/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as NewPostActions from 'actions/newPost';
import * as API from 'api';
import Analytics from '@aws-amplify/analytics';
import CourtPicker from 'components/CourtPicker';
import MentionSuggestingInput from 'components/MentionSuggestingInput';
import PlatformKeyboardAvoidingView from 'components/PlatformKeyboardAvoidingView';
import gql from 'graphql-tag';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';
import { ShrinkToSize, UploadImage } from 'logic/Images';
import { Button, Card, Content, Text } from 'native-base';
import { navigationOptions } from 'navigators/MainNavigtor';
import * as React from 'react';
import { Mutation } from 'react-apollo';
import {
    ActivityIndicator, Dimensions, Image, NativeModules,
    Platform, StyleSheet, TouchableOpacity, View,
} from 'react-native';
import { Alert } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import { INewPostState } from 'reducers/newPost';
import { Dispatch } from 'redux';
import shortid from 'shortid';
import system from 'system-exports';
import { showErrorDialog } from 'utils/Prompt';
import MenuButton from '../MenuButton';
import MessagesButton from '../MessagesButton';

const GetUserInfo = gql(queries.getUserInfo);
const listUserReceivedPosts = gql(queries.listUserReceivedPosts);

// tslint:disable-next-line:no-var-requires
const icoMoonConfig = require('/../assets/fonts/icomoon.json');
const Icon: any = createIconSetFromIcoMoon(icoMoonConfig);

const PESDK = NativeModules.PESDK;

interface IProps {
    dispatch: Dispatch<any>;
    newPostState: INewPostState;
    myUserId: string;
}

class CameraTab extends React.Component<IProps> {
    state = {
        maxImgHeight: this.getMaxImgHeight(),
        maxImgWidth: 100,
        loading: false,
        multiline: false,
    };

    static navigationOptions = ({ navigation }: any) => ({
        ...navigationOptions,
        tabBarLabel: 'Camera',
        tabBarIcon: ({ tintColor }: { tintColor: string }) => (
            <Icon name="camera" style={{ color: tintColor }} />
        ),
        title: 'New post',
        headerRight: (
            <View style={{ flexDirection: 'row' }}>
                <MessagesButton />
                <MenuButton />
            </View>
        ),
    })

    private getMaxImgHeight() {
        return Dimensions.get('window').height * 0.45;
    }

    private openPicker(options: any) {
        ImagePicker.showImagePicker(options, async (response) => {
            if (response.didCancel) {
                return;
            }

            if (response.error) {
                showErrorDialog(response.error);
                return;
            }

            try {
                let result;
                if (response.customButton) {
                    result = await PESDK.editFromURI(this.props.newPostState.image!.uri, '');
                } else {
                    result = await PESDK.editFromURI(response.uri, '');
                }

                if (!result) {
                    return;
                }

                const { uri, width, height, fileSize, type } = result;
                const image = { uri, width, height, fileSize, type };

                this.props.dispatch(NewPostActions.setImage(image));
            } catch (e) {
                showErrorDialog(e.message);
            }
        });
    }

    private pickFromNothing() {
        const options = {
            title: 'Select a picture',
            quality: 0.7,
        };

        this.openPicker.bind(this)(options);
    }

    private pickFromPicture() {
        const options = {
            title: 'Select a picture',
            quality: 0.7,
            customButtons: [
                { name: 'edit', title: 'Edit the current picture' },
            ],
        };

        this.openPicker.bind(this)(options);
    }

    private renderImage() {
        const { newPostState } = this.props;

        if (newPostState.image) {
            const iW = newPostState.image.width;
            const iH = newPostState.image.height;

            const mW = this.state.maxImgWidth;
            const mH = this.state.maxImgHeight;

            // tslint:disable-next-line:one-variable-per-declaration
            let w, h;
            if (iW > iH) {
                w = mW;
                h = w / iW * iH;
            } else {
                h = mH;
                w = h / iH * iW;
            }

            return (
                <View style={styles.alignCenter} onLayout={((e) => {
                    this.setState({ maxImgWidth: e.nativeEvent.layout.width });
                })}>
                    <TouchableOpacity
                        onPress={this.pickFromPicture.bind(this)}
                        disabled={this.state.loading}
                        style={{ opacity: this.state.loading ? 0.5 : 1 }}
                    >
                        <Card style={{ flex: -1 }}>
                            <Image
                                source={{ uri: newPostState.image.uri }}
                                style={{ width: w, height: h }}
                                resizeMode="contain"
                            />
                            {this.state.loading && <ActivityIndicator
                                size="large"
                                style={{ width: '100%', height: '100%', position: 'absolute' }}
                                color="blue"
                            />}
                        </Card>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <View style={styles.alignCenter}>
                    <TouchableOpacity
                        style={{ width: '100%', height: 200, marginBottom: 7 }}
                        onPress={this.pickFromNothing.bind(this)}
                    >
                        <Card style={[styles.centreBothWays, { height: '100%' }]}>
                            <Text style={{ color: 'black' }}>Tap here to select a picture</Text>
                        </Card>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    private confirmDelete() {
        const { dispatch } = this.props;

        Alert.alert(
            'Confirm',
            'Are you sure you want to delete this post?',
            [
                { text: 'Cancel' },
                { text: 'Yes', onPress: () => dispatch(NewPostActions.clearPost()) },
            ],
        );
    }

    private renderPostButton() {
        const { newPostState, myUserId } = this.props;

        return (
            <Mutation<API.CreatePostInput> mutation={gql(mutations.createPost)}>
                {(createPost) => {
                    return (
                        <Button block
                            disabled={!newPostState.decription || !newPostState.image || this.state.loading}
                            style={{ marginHorizontal: 5 }}
                            onPress={async () => {
                                try {
                                    this.setState({ loading: true });

                                    Analytics.record({
                                        name: 'createPost',
                                    });

                                    const bucket = system.public_uploads_bucket;
                                    const key = myUserId + '/' + shortid() + '.jpg';

                                    const MaxProfilePicSize = 500000;
                                    const image = await ShrinkToSize(newPostState.image!, MaxProfilePicSize);

                                    await UploadImage(image.uri, bucket, key);

                                    const input = {
                                        creatorId: myUserId,
                                        caption: newPostState.decription,
                                        image: {
                                            bucket,
                                            key,
                                            region: 'us-east-1',
                                        },
                                        courtId: this.props.newPostState.court,
                                    };

                                    let updated = false;

                                    await createPost({
                                        variables: { input },
                                        update: (proxy, { data }) => {

                                            if (!data || !data.createPost) {
                                                console.log('no data');
                                                return null;
                                            }

                                            const userData: any = proxy.readQuery({
                                                query: GetUserInfo,
                                                variables: { userId: myUserId },
                                            });

                                            if (userData.getUserInfo && !updated) {
                                                userData.getUserInfo.postCount++;
                                            }

                                            proxy.writeQuery({
                                                query: GetUserInfo,
                                                variables: { userId: myUserId },
                                                data: userData,
                                            });

                                            const posts: any = proxy.readQuery({
                                                query: listUserReceivedPosts,
                                                variables: { receiverId: myUserId },
                                            });

                                            const newPost = {
                                                receiverId: myUserId,
                                                postId: data.createPost.creatorId + ';' + data.createPost.postedDate,
                                                receivedDate: data.createPost.postedDate,
                                                __typename: 'CourtOwner',
                                            };

                                            if (posts.listUserReceivedPosts && !updated) {
                                                posts.listUserReceivedPosts.items =
                                                    [newPost, ...posts.listUserReceivedPosts.items];
                                                updated = true;
                                            }

                                            proxy.writeQuery({
                                                query: listUserReceivedPosts,
                                                variables: { receiverId: myUserId },
                                                data: posts,
                                            });
                                        },
                                    });

                                    this.setState({ loading: false });
                                    this.setState({ courtId: undefined });
                                    this.props.dispatch(NewPostActions.clearPost());
                                } catch (e) {
                                    console.log(e);
                                    this.setState({ loading: false });
                                    alert(e.message);
                                }
                            }}
                        >
                            <Text>Post</Text>
                        </Button>
                    );
                }}
            </Mutation>
        );
    }

    componentDidMount() {
        // This is a hack to make text selectable on Android
        setTimeout(() => this.setState({ multiline: true }), 100);
    }

    public render() {
        const { newPostState, dispatch } = this.props;

        return (
            <PlatformKeyboardAvoidingView
                style={{ flex: 1 }}
                onLayout={() => this.setState({ maxImgHeight: this.getMaxImgHeight() })}
            >
                <Content padder>
                    {this.renderImage()}
                    <CourtPicker
                        disabled={this.state.loading}
                    />
                    <MentionSuggestingInput
                        placeholder="Type a caption here"
                        style={{
                            color: 'black',
                            opacity: this.state.loading ? 0.5 : 1,
                            marginVertical: Platform.OS === 'ios' ? 7 : 0,
                            width: 'auto',
                        }}
                        placeholderTextColor="gray"
                        value={newPostState.decription}
                        onChangeText={(e) => dispatch(NewPostActions.setDescription(e))}
                        disabled={this.state.loading}
                        fontColor="#000000"
                        multiline={this.state.multiline}
                    />
                    {this.renderPostButton()}
                    <Button block warning
                        style={{ marginBottom: 20, marginHorizontal: 5 }}
                        onPress={this.confirmDelete.bind(this)}
                        disabled={!newPostState.decription && !newPostState.image && !newPostState.court
                            || this.state.loading}
                    >
                        <Text>Clear</Text>
                    </Button>
                </Content>
            </PlatformKeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    centreBothWays: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    alignCenter: {
        width: '100%',
        alignItems: 'center',
    },
});

function mapStateToProps(state: IReduxState) {
    return {
        newPostState: state.newPost,
        myUserId: state.users.myUserId,
    };
}

function mapDispatchToProps(dispatch: any) {
    return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(CameraTab);
