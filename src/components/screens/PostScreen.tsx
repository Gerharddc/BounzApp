/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as NavActions from 'actions/nav';
import * as API from 'API';
import Analytics from '@aws-amplify/analytics';
import Color from 'color';
import SentPostCard from 'components/carousel/SentPostCard';
import LoadingBlock from 'components/LoadingBlock';
import PlatformKeyboardAvoidingView from 'components/PlatformKeyboardAvoidingView';
import fontColorContrast from 'font-color-contrast';
import gql from 'graphql-tag';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';
import * as _ from 'lodash';
import { navigationOptions } from 'navigators/MainNavigtor';
import * as React from 'react';
import { Mutation, Query } from 'react-apollo';
import {
    ActivityIndicator, Alert, Dimensions, RefreshControl,
    ScrollView, StatusBar, Text, TouchableOpacity, View,
} from 'react-native';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import { navigate } from 'utils/NavigationService';

const GetUserInfo = gql(queries.getUserInfo);
const listUserReceivedPosts = gql(queries.listUserReceivedPosts);

interface IProps {
    myUserId: string;
    navigation: any;
}

class PostScreen extends React.PureComponent<IProps> {
    componentDidMount() {
        const navParams = this.props.navigation.state.params;

        Analytics.record({
            name: 'viewPostScreen',
            attributes: { postId: navParams.postId },
        });
    }

    public static navigationOptions = ({ navigation }: any) => {
        const pars = navigation.state.params;

        const options = _.cloneDeep(navigationOptions);
        if (pars && pars.color) {
            const contrast = fontColorContrast(pars.color);
            options.headerStyle.backgroundColor = pars.color;
            options.headerTintColor = contrast;
            options.headerTitleStyle.color = contrast;
        }
        (options as any).title = 'Post';

        return options;
    }

    state = {
        deleting: false,
    };

    private renderButton(onPress: () => void, text: string, fontColor: string) {
        return (
            <TouchableOpacity
                onPress={onPress}
                style={{
                    padding: 10,
                    width: '100%',
                    alignItems: 'center',
                    borderBottomWidth: 3,
                    borderTopWidth: 3,
                    borderColor: fontColor,
                }}
            >
                <Text style={{ color: fontColor, fontSize: 16 }}>
                    {text}
                </Text>
            </TouchableOpacity>
        );
    }

    private onDeletePress(deletePost: () => void) {
        Alert.alert(
            'Delete post',
            'Are you sure you want to delete your post?',
            [
                { text: 'No', style: 'cancel' },
                { text: 'Yes', onPress: deletePost },
            ],
        );
    }

    private renderButtons(creatorId: string, postedDate: string, fontColor: string) {
        if (creatorId === this.props.myUserId) {
            return (
                <Mutation<API.DeleteSentPostMutation> mutation={gql(mutations.deleteSentPost)}>
                    {(deleteSentPost) => {
                        const deletePost = async () => {
                            try {
                                this.setState({ deleting: true });

                                let updated = false;
                                const input = { creatorId, postedDate };
                                await deleteSentPost({
                                    variables: { input },
                                    update: (proxy) => {
                                        if (updated) {
                                            return;
                                        } else {
                                            updated = true;
                                        }

                                        const data: any = proxy.readQuery({
                                            query: GetUserInfo,
                                            variables: { userId: this.props.myUserId },
                                        });

                                        if (data.getUserInfo) {
                                            data.getUserInfo.postCount--;

                                            proxy.writeQuery({
                                                query: GetUserInfo,
                                                variables: { userId: this.props.myUserId },
                                                data,
                                            });
                                        }

                                        const posts: any = proxy.readQuery({
                                            query: listUserReceivedPosts,
                                            variables: { receiverId: this.props.myUserId },
                                        });

                                        const newPosts = {
                                            listUserReceivedPosts: {
                                                items:
                                                    posts.listUserReceivedPosts.items.filter((item) => 
                                                    item.postId !== this.props.navigation.state.params.postId),
                                                nextToken: posts.listUserReceivedPosts.nextToken,
                                                __typename: 'ReceivedPostsList',
                                            },
                                        };

                                        proxy.writeQuery({
                                            query: listUserReceivedPosts,
                                            variables: { receiverId: this.props.myUserId },
                                            data: newPosts,
                                        });
                                    },
                                });

                                this.setState({ deleting: false });
                                navigate(NavActions.goBack());
                            } catch (e) {
                                alert(e.message);
                                console.log(e);
                            }
                        };

                        return this.renderButton(
                            () => this.onDeletePress(deletePost),
                            'Delete this post',
                            fontColor,
                        );
                    }}
                </Mutation>
            );
        } else {
            return this.renderButton(
                () => navigate(NavActions.gotoReport('post', creatorId + ';' + postedDate)),
                'Report this post',
                fontColor,
            );
        }
    }

    public render() {
        const navParams = this.props.navigation.state.params;
        const parts = navParams.postId.split(';');
        const creatorId = parts[0];
        const postedDate = parts[1];

        return (
            <Query<API.GetSentPostQuery>
                query={gql(queries.getSentPost)}
                variables={{ creatorId, postedDate }}
            >
                {({ data, loading, refetch }) => {
                    if (!data || !data.getSentPost) {
                        return <LoadingBlock />;
                    }

                    const post = data.getSentPost;
                    const fontColor = fontColorContrast(post.vibrantColor);
                    const statusColor = Color(post.vibrantColor).darken(0.2).hex();

                    if (!navParams || !navParams.color) {
                        setImmediate(() => {
                            this.props.navigation.setParams({ color: Color(post.vibrantColor).darken(0.1).hex() });
                        });
                    }

                    return (
                        <PlatformKeyboardAvoidingView style={{ flex: 1, backgroundColor: post.vibrantColor }}>
                            <StatusBar
                                backgroundColor={statusColor}
                                barStyle={fontColorContrast(statusColor) === '#ffffff' ?
                                    'light-content' : 'dark-content'}
                            />
                            <ScrollView
                                keyboardShouldPersistTaps="always"
                                keyboardDismissMode="on-drag"
                                refreshControl={
                                    <RefreshControl
                                        refreshing={loading}
                                        onRefresh={() => refetch()}
                                    />
                                }
                            >
                                <SentPostCard
                                    creatorId={creatorId}
                                    postedDate={postedDate}
                                    hideExpand={true}
                                    maxImgHeight={Dimensions.get('window').height / 2}
                                    itemWidth={Dimensions.get('window').width}
                                />
                                <View style={{ width: '100%', marginVertical: 20 }}>
                                    {this.renderButtons(creatorId, postedDate, fontColor)}
                                </View>
                            </ScrollView>
                            {this.state.deleting && <ActivityIndicator
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    position: 'absolute',
                                }}
                                size="large"
                            />}
                        </PlatformKeyboardAvoidingView>
                    );
                }}
            </Query>
        );
    }
}

function mapStateToProps(state: IReduxState) {
    return {
        myUserId: state.users.myUserId,
    };
}

export default connect(mapStateToProps)(PostScreen);
