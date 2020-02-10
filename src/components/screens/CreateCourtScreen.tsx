/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import Auth from '@aws-amplify/auth';
import * as NavActions from 'actions/nav';
import * as API from 'API';
import Analytics from '@aws-amplify/analytics';
import PlatformKeyboardAvoidingView from 'components/PlatformKeyboardAvoidingView';
import gql from 'graphql-tag';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';
import { IImageInfo, ShrinkToSize, UploadImage } from 'logic/Images';
import { Body, Button, CheckBox, Input, ListItem, Text } from 'native-base';
import * as React from 'react';
import { Mutation } from 'react-apollo';
import {
    ActivityIndicator, Dimensions, Image, NativeModules,
    ScrollView, Text as RNText, TouchableOpacity, View, Platform,
} from 'react-native';
import ColorPalette from 'react-native-color-palette';
import ImagePicker from 'react-native-image-picker';
import shortid from 'shortid';
import system from 'system-exports';
import { navigate } from 'utils/NavigationService';

const PESDK = NativeModules.PESDK;
const listOwnerCourts = gql(queries.listOwnerCourts);
const listMemberCourts = gql(queries.listMemberCourts);
const getUserInfo = gql(queries.getUserInfo);
const getCourtInfo = gql(queries.getCourtInfo);

export default class CreateCourtScreen extends React.Component {
    componentDidMount() {
        Analytics.record({
            name: 'viewCreateCourtScreen',
        });
    }

    static navigationOptions = {
        title: 'Create court',
    };

    state = {
        image: undefined as IImageInfo | undefined,
        name: '',
        description: '',
        restricted: false,
        loading: false,
        color: '#C0392B',
    };

    private openPicker(options: any) {
        ImagePicker.showImagePicker(options, async (response) => {
            if (response.didCancel) {
                return;
            }

            if (response.error) {
                alert(response.error);
                return;
            }

            try {
                let result;
                if (response.customButton) {
                    result = await PESDK.editFromURI(this.state.image!.uri, '16:9');
                } else {
                    result = await PESDK.editFromURI(response.uri, '16:9');
                }

                if (!result) {
                    return;
                }

                const { uri, width, height, fileSize, type } = result;
                const image = { uri, width, height, fileSize, type };

                this.setState({ image });
            } catch (e) {
                alert(e.message);
                console.log(e);
            }
        });
    }

    private pickImage() {
        if (this.state.image) {
            const options = {
                title: 'Select a picture',
                quality: 0.7,
                customButtons: [
                    { name: 'edit', title: 'Edit the current picture' },
                ],
            };

            this.openPicker.bind(this)(options);
        } else {
            const options = {
                title: 'Select a picture',
                quality: 0.7,
            };

            this.openPicker.bind(this)(options);
        }
    }

    public render() {
        const { image, name, description, restricted, color } = this.state;
        const screenWidth = Dimensions.get('window').width;

        return (
            <PlatformKeyboardAvoidingView style={{ flex: 1 }}>
                <ScrollView>
                    <TouchableOpacity
                        style={{
                            width: screenWidth,
                            height: screenWidth / 16 * 9,
                            backgroundColor: '#90A4AE',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onPress={this.pickImage.bind(this)}
                    >
                        {this.state.image ?
                            <Image
                                source={{ uri: this.state.image.uri }}
                                style={{ width: '100%', height: '100%' }}
                            /> :
                            <Text style={{ color: 'black' }}>
                                Tap here to select an image
                        </Text>}
                    </TouchableOpacity>
                    <View style={{ flex: 1, padding: 10 }}>
                        <ColorPalette
                            onChange={(c: any) => this.setState({ color: c })}
                            defaultColor={'#C0392B'}
                            colors={['#C0392B', '#E74C3C', '#8E44AD', '#2980B9', '#2BC069', '#C0BD2B', '#C0662B']}
                            title={'Pick a colour to represent the court'}
                            default={color}
                            icon={<RNText>✔</RNText>}
                        />
                        <ListItem noIndent>
                            <CheckBox checked={restricted} onPress={() => this.setState({ restricted: !restricted })} />
                            <Body>
                                <Text style={{ color: 'black' }}>
                                    Require permission to join this court
                            </Text>
                            </Body>
                        </ListItem>
                        <Input
                            placeholder="Type a name here"
                            style={{ color: 'black', opacity: this.state.loading ? 0.5 : 1, borderBottomWidth: 1 }}
                            value={name}
                            disabled={this.state.loading}
                            onChangeText={(e) => this.setState({ name: e })}
                            placeholderTextColor="gray"
                        />
                        <Input
                            placeholder="Type a description here"
                            multiline={true}
                            style={[
                                { color: 'black', opacity: this.state.loading ? 0.5 : 1 },
                                Platform.OS === 'ios' ? { marginTop: 10, marginBottom: 5 } : {},
                            ]}
                            value={description}
                            disabled={this.state.loading}
                            onChangeText={(e) => this.setState({ description: e })}
                            placeholderTextColor="gray"
                        />
                        <Mutation<API.CreateCourtMutation> mutation={gql(mutations.createCourt)}>
                            {(createCourt) => (
                                <Button
                                    block success
                                    disabled={!image || name === '' || description === ''}
                                    onPress={async () => {
                                        this.setState({ loading: true });

                                        try {
                                            const user = await Auth.currentUserPoolUser();
                                            const userId = user.username;

                                            const bucket = system.public_uploads_bucket;
                                            const key = userId + '/' + shortid() + '.jpg';

                                            const MaxCourtPicSize = 500000;
                                            const img = await ShrinkToSize(image!, MaxCourtPicSize);

                                            await UploadImage(img.uri, bucket, key);

                                            const input = {
                                                ownerId: userId,
                                                name,
                                                description,
                                                restricted,
                                                color,
                                                image: {
                                                    bucket,
                                                    key,
                                                    region: 'us-east-1',
                                                },
                                            };

                                            let updated = false;

                                            const court = await createCourt({
                                                variables: { input },
                                                update: (proxy, { data }) => {
                                                    if (!data) {
                                                        return null;
                                                    }

                                                    const requestDataOwner = proxy.readQuery({
                                                        query: listOwnerCourts,
                                                        variables: { ownerId: userId },
                                                    });

                                                    const newItemOwner = {
                                                        courtId: data!.createCourt!.courtId,
                                                        ownerId: data!.createCourt!.ownerId,
                                                        __typename: 'CourtOwner',
                                                    };

                                                    if (!updated) {
                                                        requestDataOwner!.listOwnerCourts.items.push(newItemOwner);
                                                    }

                                                    proxy.writeQuery({
                                                        query: listOwnerCourts,
                                                        variables: { ownerId: userId },
                                                        data: requestDataOwner,
                                                    });

                                                    const userData = proxy.readQuery({
                                                        query: getUserInfo,
                                                        variables: { userId },
                                                    });

                                                    if (userData && !updated) {
                                                        userData.getUserInfo.courtsOwned++;
                                                        updated = true;
                                                    }

                                                    proxy.writeQuery({
                                                        query: getUserInfo,
                                                        variables: { userId },
                                                        data: userData,
                                                    });

                                                    const courtData = {
                                                        getCourtInfo:
                                                            data!.createCourt,
                                                    };

                                                    courtData!.getCourtInfo!.memberCount = 1;

                                                    proxy.writeQuery({
                                                        query: getCourtInfo,
                                                        variables: { courtId: data!.createCourt!.courtId },
                                                        data: courtData,
                                                    });

                                                    const requestDataMember = proxy.readQuery({
                                                        query: listMemberCourts,
                                                        variables: { memberId: userId },
                                                    });

                                                    const newItemMember = {
                                                        courtId: data!.createCourt!.courtId,
                                                        memberId: data!.createCourt!.ownerId,
                                                        __typename: 'CourtMember',
                                                    };

                                                    if (!updated) {
                                                        requestDataMember!.listMemberCourts.items.push(newItemMember);
                                                        updated = true;
                                                    }

                                                    proxy.writeQuery({
                                                        query: listMemberCourts,
                                                        variables: { ownerId: userId },
                                                        data: requestDataMember,
                                                    });
                                                },
                                            });

                                            if (!court || !court.data || !court.data.createCourt) {
                                                throw new Error('No court was returned');
                                            }

                                            navigate(NavActions.switchToCourt(court.data.createCourt.courtId));
                                        } catch (e) {
                                            this.setState({ loading: false });

                                            alert(e.message);
                                            console.log(e);
                                        }
                                    }}
                                >
                                    <Text>Let's do it!</Text>
                                </Button>
                            )}
                        </Mutation>
                    </View>
                </ScrollView>
                {this.state.loading && <ActivityIndicator
                    size="large"
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        position: 'absolute',
                        zIndex: 1,
                    }}
                    color="blue"
                />}
            </PlatformKeyboardAvoidingView>
        );
    }
}
