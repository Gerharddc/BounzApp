/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as NavActions from 'actions/nav';
import * as API from 'API';
import FollowSearchButton from 'components/FollowSearchButton';
import gql from 'graphql-tag';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';
import * as subscriptions from 'graphql/subscriptions';
import { ShrinkToSize, UploadImage } from 'logic/Images';
import { calculateProfilePicUrl, IUserInfo, ProfileValueDisplayNames, ProfileValueType } from 'logic/UserInfo';
import { Badge, Body, Button, Card, CardItem, Text } from 'native-base';
import { navigationOptions } from 'navigators/MainNavigtor';
import * as React from 'react';
import { Mutation, Query } from 'react-apollo';
import { ActivityIndicator, NativeModules, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-picker';
import { createImageProgress } from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import { IAuthState } from 'reducers/auth';
import { IUsersState } from 'reducers/users';
import { Dispatch } from 'redux';
import shortid from 'shortid';
import system from 'system-exports';
import LargeNum from 'utils/LargeNum';
import { navigate } from 'utils/NavigationService';
import OnMount from 'utils/OnMount';
import { promptNewValue, showErrorDialog } from 'utils/Prompt';
import LoadingBlock from '../LoadingBlock';

const Image = createImageProgress(FastImage);
const PESDK = NativeModules.PESDK;

// tslint:disable-next-line:no-var-requires
const icoMoonConfig = require('/../assets/fonts/icomoon.json');
const Icon: any = createIconSetFromIcoMoon(icoMoonConfig);

const GetUserInfo = gql(queries.getUserInfo);
const listFollowers = gql(queries.listFollowers);
const listFollowing = gql(queries.listFollowing);
const GetBlockedUser = gql(queries.getBlockedUser);
const OnUpdateUserInfo = gql(subscriptions.onUpdateUserInfo);
const UpdateProfilePic = gql(mutations.updateProfilePic);

interface IProps {
    dispatch: Dispatch<any>;
    usersState: IUsersState;
    authState: IAuthState;
    navigation?: any;
    user: any;
    updateUserInfo: any;
}

interface IState {
    loading: boolean;
}

class UserTab extends React.Component<IProps, IState> {
    public static navigationOptions = ({ navigation }: any) => {
        const pars = navigation.state.params;
        const other = pars ? pars.otherUser : undefined;
        console.log('UserTab');
        return ({
            ...navigationOptions,
            tabBarLabel: 'User',
            tabBarIcon: ({ tintColor }: { tintColor: string }) => (
                <Icon name="user" style={{ color: tintColor }} />
            ),
            title: (pars && pars.username) ? pars.username : 'Loading',
            headerRight:
                <FollowSearchButton otherUser={other} />,
        });
    }

    state = {
        loading: false,
    };

    private pickImage(): Promise<string> {
        const options = {
            title: 'Select a picture',
            quality: 0.5,
        };

        return new Promise((resolve, reject) => {
            ImagePicker.showImagePicker(options, async (response) => {
                if (response.didCancel) {
                    return;
                }

                if (response.error) {
                    showErrorDialog(response.error);
                    return resolve();
                }

                try {
                    let image = await PESDK.editFromURI(response.uri, '1:1');
                    if (!image) {
                        return resolve();
                    }

                    const MaxProfilePicSize = 150000;
                    image = await ShrinkToSize(image, MaxProfilePicSize);
                    resolve(image.uri);
                } catch (e) {
                    showErrorDialog(e.message);
                    resolve();
                }
            });
        });
    }

    private renderProfileValue(name: ProfileValueType, user: IUserInfo, viewingOtherUser: boolean, inline?: boolean) {
        if (!ProfileValueDisplayNames[name]) {
            console.log('Value missing', name);
            return (<Text>Error</Text>);
        }

        if (!user[name]) {
            console.log('Prop missing', name);
            return (<Text>Error</Text>);
        }

        return (
            <Mutation<API.UpdateUserInfoInput>
                mutation={gql(mutations.updateUserInfo)}
            >
                {(updateUserInfo, { data }) => (
                    <TouchableOpacity
                        disabled={viewingOtherUser}
                        onPress={async () => {
                            const input = { userId: user.userId } as any;
                            const value = await promptNewValue(name, user[name] as any) as any;
                            if (!!value) {
                                input[name] = value;
                                updateUserInfo({ variables: { input } });
                            }
                        }}
                    >
                        <Card style={{ minHeight: 50, justifyContent: 'center' }}>
                            <CardItem>
                                <Text style={{ fontWeight: 'bold', flex: 1 }}>{ProfileValueDisplayNames[name]}</Text>
                                {inline && <Text>{user[name]}</Text>}
                            </CardItem>
                            {!inline &&
                                <CardItem>
                                    <Body>
                                        <Text>{user[name]}</Text>
                                    </Body>
                                </CardItem>
                            }
                        </Card>
                    </TouchableOpacity>
                )}
            </Mutation>
        );
    }

    private renderBadge(name: ProfileValueType, user: IUserInfo, action?: () => void) {
        if (!ProfileValueDisplayNames[name]) {
            console.log('Value missing', name);
            return (<Text>Error</Text>);
        }

        if (!user[name] && user[name] !== 0) {
            console.log('Prop missing', name);
            console.log('user', user);
            return (<Text>Error</Text>);
        }

        return (
            <TouchableOpacity disabled={!action} onPress={action}>
                <Card>
                    <CardItem style={{ flexDirection: 'row', width: '100%' }}>
                        <Text style={{ fontWeight: 'bold' }}>{ProfileValueDisplayNames[name]}</Text>
                        <View style={{ flex: 1 }} />
                        <Badge>
                            <Text>{LargeNum(user[name] as number)}</Text>
                        </Badge>
                    </CardItem>
                </Card>
            </TouchableOpacity>
        );
    }

    private renderMessage(myId: string, otherId: string) {
        if (myId === otherId) {
            return null;
        }

        return (
            <Button block success
                onPress={() => {
                    let threadId;

                    if (myId > otherId) {
                        threadId = `userIdA:${otherId};userIdB:${myId}`;
                    } else {
                        threadId = `userIdA:${myId};userIdB:${otherId}`;
                    }

                    navigate(NavActions.gotoMessageThread(threadId));
                }}
            >
                <Text>Direct message</Text>
            </Button>
        );
    }

    private renderBlock(myId: string, otherId: string) {
        if (myId === otherId) {
            return null;
        }

        return (
            <Query<API.GetBlockedUserQuery>
                query={GetBlockedUser}
                variables={{ blockerId: myId, blockeeId: otherId }}
                fetchPolicy="cache-and-network"
            >
                {({ data, loading, error }) => {
                    if (error) {
                        console.log(error);
                    }

                    if (!data || !data.getBlockedUser) {
                        return (<ActivityIndicator size="large" style={{ width: '100%', padding: 10 }} />);
                    }

                    const blocked = data.getBlockedUser.blocked;

                    if (blocked) {
                        return (
                            <Mutation<API.UnblockUserMutation>
                                mutation={gql(mutations.unblockUser)}
                            >
                                {(unblockUser) => (
                                    <Button block success
                                        onPress={() => unblockUser({
                                            variables: { blockerId: myId, blockeeId: otherId },
                                            update: (proxy, { data }) => {
                                                if (!data || !data.unblockUser) {
                                                    return null;
                                                }

                                                const blockedUser = proxy.readQuery({
                                                    query: gql(queries.getBlockedUser),
                                                    variables: {
                                                        blockeeId: otherId,
                                                        blockerId: myId
                                                    },
                                                });

                                                if (!blockedUser || !blockedUser.getBlockedUser) {
                                                    return;
                                                }

                                                blockedUser.getBlockedUser.blocked = false;

                                                proxy.writeQuery({
                                                    query: gql(queries.getBlockedUser),
                                                    variables: { blockerId: myId, blockeeId: otherId },
                                                    data: blockedUser,
                                                });
                                            },
                                        })}
                                    >
                                        <Text> Unblock user </Text>
                                    </Button>

                                )}
                            </Mutation>
                        );
                    } else {
                        return (
                            <Mutation<API.BlockUserMutation>
                                mutation={gql(mutations.blockUser)}
                            >
                                {(blockUser) => (
                                    <Button block danger
                                        onPress={() => {
                                            blockUser({
                                                variables: { blockerId: myId, blockeeId: otherId },
                                                update: (proxy, { data }) => {
                                                    if (!data || !data.blockUser) {
                                                        return null;
                                                    }

                                                    try {
                                                        const followerList = proxy.readQuery({
                                                            query: listFollowers,
                                                            variables: { followeeId: otherId },
                                                        });

                                                        console.log('FollowersList: ', followerList);
                                                        console.log('FollowerId: ', otherId);

                                                        if (followerList && followerList.listFollowers) {
                                                            followerList.listFollowers.items =
                                                                followerList.listFollowers.items.filter((item) =>
                                                                    (item.followerId !== myId));
                                                        }

                                                        console.log('New followerlist: ', followerList);

                                                        proxy.writeQuery({
                                                            query: listFollowers,
                                                            variables: { followeeId: otherId },
                                                            data: followerList,
                                                        });
                                                    } catch (e) {
                                                        console.log(e);
                                                    }

                                                    try {
                                                        const followingList = proxy.readQuery({
                                                            query: listFollowing,
                                                            variables: { followerId: myId },
                                                        });

                                                        console.log('FollowingList: ', followingList);
                                                        console.log('FolloweeId: ', myId);

                                                        if (followingList && followingList.listFollowing) {
                                                            followingList.listFollowing.items =
                                                                followingList.listFollowing.items.filter((item) =>
                                                                    (item.followeeId !== otherId));
                                                        }

                                                        console.log('New followinglist: ', followingList);

                                                        proxy.writeQuery({
                                                            query: listFollowing,
                                                            variables: { followerId: myId },
                                                            data: followingList,
                                                        });
                                                    } catch (e) {
                                                        console.log(e);
                                                    }

                                                    const blockedUser = proxy.readQuery({
                                                        query: gql(queries.getBlockedUser),
                                                        variables: {
                                                            blockeeId: otherId,
                                                            blockerId: myId
                                                        },
                                                    });

                                                    blockedUser.getBlockedUser.blocked = true;

                                                    proxy.writeQuery({
                                                        query: gql(queries.getBlockedUser),
                                                        variables: { blockerId: myId, blockeeId: otherId },
                                                        data: blockedUser,
                                                    });
                                                },
                                            });
                                        }}
                                    >
                                        <Text> Block user </Text>
                                    </Button>

                                )}
                            </Mutation>
                        );
                    }
                }}
            </Query>
        );
    }

    private renderReport(myId: string, otherId: string) {
        if (myId === otherId) {
            return null;
        }

        return (
            <Button block danger onPress={() => navigate(NavActions.gotoReport('user', otherId))}>
                <Text>Report user</Text>
            </Button>
        );
    }

    private renderName(userId: string) {
        return (
            <Query<API.GetUserRealNameQuery>
                query={gql(queries.getUserRealName)}
                variables={{ userId }}
            >
                {({ data, error }) => {
                    if (error) {
                        console.log(error);
                    }

                    if (!data || !data.getUserRealName || data.getUserRealName.trim() === '') {
                        return null;
                    }

                    return (
                        <Text style={{ width: '100%', textAlign: 'center', marginVertical: 10 }}>
                            {data.getUserRealName}
                        </Text>
                    );
                }}
            </Query>
        );
    }

    private renderProfilePic(otherUser: boolean, thumbSize: number, user: IUserInfo) {
        return (
            <Mutation<API.UpdateProfilePicInput>
                mutation={UpdateProfilePic}
            >
                {(updateProfilePic, { data }) => {
                    return (
                        <View style={{ width: '100%', alignItems: 'center', flex: -1 }}>
                            <TouchableOpacity
                                disabled={otherUser}
                                onPress={async () => {
                                    const localUri = await this.pickImage();
                                    if (localUri) {
                                        try {
                                            this.setState({ loading: true });

                                            const bucket = system.public_uploads_bucket;
                                            const key = user.userId + '/' + shortid() + '.jpg';

                                            await UploadImage(localUri, bucket, key);

                                            const image = {
                                                bucket,
                                                key,
                                                region: 'us-east-1',
                                            };
                                            const input = { userId: this.props.usersState.myUserId, image };
                                            await updateProfilePic({ variables: { input } });

                                            this.setState({ loading: false });
                                        } catch (e) {
                                            console.log(e);
                                            this.setState({ loading: false });
                                            alert(e.message);
                                        }
                                    }
                                }}
                            >
                                <Card style={{ width: thumbSize, height: thumbSize, borderRadius: thumbSize / 4 }}>
                                    <Image
                                        source={{ uri: calculateProfilePicUrl(user) }}
                                        style={{
                                            width: thumbSize, height: thumbSize,
                                            borderRadius: thumbSize / 4, overflow: 'hidden',
                                            opacity: this.state.loading ? 0.5 : 1,
                                        }}
                                        indicator={Progress.Pie}
                                    />
                                    {(this.state.loading) &&
                                        <ActivityIndicator
                                            style={{ width: '100%', height: '100%', zIndex: 1, position: 'absolute' }}
                                            size="large"
                                            color="blue"
                                        />}
                                </Card>
                            </TouchableOpacity>
                        </View>
                    );
                }}
            </Mutation>
        );
    }

    private updateNavParams(user: IUserInfo, otherUser: string | undefined) {
        const navParams = this.props.navigation.state.params;

        if (!navParams || navParams.username !== user.username) {
            this.props.navigation.setParams({ username: user.username });
        }

        if ((!navParams || !navParams.otherUser) && otherUser) {
            this.props.navigation.setParams({ otherUser });
        }
    }

    public render() {
        const thumbSize = 130;

        const navParams = this.props.navigation.state.params;
        const userId = (navParams && navParams.userId) ? navParams.userId : this.props.usersState.myUserId;
        const otherUser = userId !== this.props.usersState.myUserId;

        return (
            <Query<API.GetUserInfoQuery>
                query={GetUserInfo}
                variables={{ userId }}
                fetchPolicy="cache-and-network"
            >
                {({ data, loading, subscribeToMore, error, refetch }) => {
                    if (error) {
                        console.log(error);
                        return (<Text>{JSON.stringify(error)}</Text>);
                    }

                    if (!data || !data.getUserInfo) {
                        return (<LoadingBlock />);
                    }

                    const user = data.getUserInfo;

                    // The navparams should not be updated during a render
                    setImmediate(() => this.updateNavParams(user, navParams ? navParams.userId : undefined));

                    return (
                        <ScrollView
                            contentContainerStyle={{ padding: 10 }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={loading}
                                    onRefresh={() => refetch()}
                                />
                            }
                        >
                            <OnMount run={() => {
                                subscribeToMore({
                                    document: OnUpdateUserInfo,
                                    variables: { userId },
                                    updateQuery: (prev, { subscriptionData }) => {
                                        if (!subscriptionData.data) {
                                            return prev;
                                        }

                                        const newItem = (subscriptionData as any).data.onUpdateUserInfo;
                                        return { getUserInfo: newItem };
                                    },
                                    onError: (e) => console.log('subscribe error', e),
                                });
                            }} />
                            {this.renderProfilePic(otherUser, thumbSize, user)}
                            {this.renderName(userId)}
                            {this.renderMessage(this.props.usersState.myUserId, userId)}
                            {this.renderProfileValue('location', user, otherUser, true)}
                            {this.renderProfileValue('bio', user, otherUser, false)}
                            {this.renderBadge('postCount', user,
                                () => navigate(NavActions.gotoOthersPosts(userId)))}
                            {this.renderBadge('bounzesMade', user,
                                () => navigate(NavActions.gotoBounzedPosts(user.userId)))}
                            {this.renderBadge('bounzesReceived', user)}
                            {this.renderBadge('receipts', user)}
                            {this.renderBadge('followersCount', user,
                                () => navigate(NavActions.gotoFollowers(user.userId)))}
                            {this.renderBadge('followingCount', user,
                                () => navigate(NavActions.gotoFollowing(user.userId)))}
                            {this.renderBadge('courtsJoined', user,
                                () => navigate(NavActions.gotoCourtsJoined(user.userId)))}
                            {this.renderBadge('courtsOwned', user,
                                () => navigate(NavActions.gotoCourtsOwned(user.userId)))}
                            {this.renderBlock(this.props.usersState.myUserId, userId)}
                            {this.renderReport(this.props.usersState.myUserId, userId)}
                        </ScrollView>
                    );
                }}
            </Query>
        );
    }
}

function mapStateToProps(state: IReduxState) {
    return {
        usersState: state.users,
        authState: state.auth,
    };
}

function mapDispatchToProps(dispatch: any) {
    return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserTab);
