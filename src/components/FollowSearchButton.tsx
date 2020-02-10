/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as NavActions from 'actions/nav';
import * as API from 'API';
import gql from 'graphql-tag';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';
import { Icon } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { Mutation, Query } from 'react-apollo';
import { ActivityIndicator, Button, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import { navigate } from 'utils/NavigationService';

const GetFollower = gql(queries.getFollower);
const getUserInfo = gql(queries.getUserInfo);
const listFollowing = gql(queries.listFollowing);
const listFollowers = gql(queries.listFollowers);

interface IProps {
    otherUser: string;
    myUserId: string;
}

class FollowSearchButton extends React.Component<IProps> {
    state = {
        working: false,
    };

    private handleSearch() {
        navigate(NavActions.gotoFindUser());
    }

    private renderButton() {
        return (
            <Query<API.GetBlockedUserQuery>
                query={gql(queries.getBlockedUser)}
                variables={{blockeeId: this.props.otherUser,
                blockerId: this.props.myUserId}}
                fetchPolicy="cache-and-network"
            >
                {({ data, loading }) => {
                    if (!data || !data.getBlockedUser) {
                        return null;
                    }

                    if (data.getBlockedUser.blocked === true) {
                        return null;
                    }

                    const input = { followerId: this.props.myUserId, followeeId: this.props.otherUser };

                    return (
                        <Query<API.GetFollowerQuery>
                            query={GetFollower}
                            variables={input}
                            fetchPolicy="cache-and-network"
                        >
                            {({ data, loading }) => {
                                if (loading || this.state.working) {
                                    return <ActivityIndicator color="blue" />;
                                }

                                if (!data || !data.getFollower) {
                                    return (
                                        <Mutation<API.CreateFollowerMutation> mutation={gql(mutations.createFollower)}>
                                            {(createFollower) => (
                                                <Button
                                                    title={'Follow'}
                                                    color={platform.brandBackground}
                                                    onPress={async () => {
                                                        try {
                                                            this.setState({ working: true });
                                                            let updated = false;
                                                            await createFollower({
                                                                variables: { input },
                                                                update: (proxy) => {
                                                                    const followerData = proxy.readQuery({
                                                                        query: GetFollower,
                                                                        variables: input,
                                                                    });

                                                                    (followerData as any).getFollower = {
                                                                        ...input, __typename: 'Follower',
                                                                    };

                                                                    proxy.writeQuery({
                                                                        query: GetFollower,
                                                                        variables: input,
                                                                        data: followerData,
                                                                    });

                                                                    const followersList = proxy.readQuery({
                                                                        query: listFollowers,
                                                                        variables: {followeeId : input.followeeId},
                                                                    });

                                                                    console.log('FollowingList: ', followersList);

                                                                    const newFollower = {
                                                                        followeeId : input.followeeId,
                                                                        followerId : input.followerId,
                                                                        __typename: 'Follower',
                                                                    };

                                                                    if (followersList && !updated) {
                                                                        followersList.listFollowers.items =
                                                                        [newFollower,
                                                                        ...followersList.listFollowers.items];
                                                                    }

                                                                    console.log('New following: ', newFollower);
                                                                    console.log('New FollowingList: ', followersList);

                                                                    proxy.writeQuery({
                                                                        query: listFollowers,
                                                                        variables: {followeeId : input.followeeId},
                                                                        data: followersList,
                                                                    });

                                                                    const followingList = proxy.readQuery({
                                                                        query: listFollowing,
                                                                        variables: {followerId : input.followerId},
                                                                    });

                                                                    console.log('FollowingList: ', followingList);

                                                                    const newFollowing = {
                                                                        followeeId : input.followeeId,
                                                                        followerId : input.followerId,
                                                                        __typename: 'Follower',
                                                                    };

                                                                    if (followingList && !updated) {
                                                                        followingList.listFollowing.items = [newFollowing, ...followingList.listFollowing.items];
                                                                    }

                                                                    console.log('New following: ', newFollowing);
                                                                    console.log('New FollowingList: ', followingList);

                                                                    proxy.writeQuery({
                                                                        query: listFollowing,
                                                                        variables: {followerId : input.followerId},
                                                                        data: followingList,
                                                                    });

                                                                    const userData = proxy.readQuery({
                                                                        query: getUserInfo,
                                                                        variables: { userId: this.props.myUserId },
                                                                    });

                                                                    if (userData!.getUserInfo && !updated) {
                                                                        userData!.getUserInfo.followingCount++;
                                                                    }

                                                                    proxy.writeQuery({
                                                                        query: getUserInfo,
                                                                        variables: { userId: this.props.myUserId },
                                                                        data: userData,
                                                                    });

                                                                    const otherUser = proxy.readQuery({
                                                                        query: getUserInfo,
                                                                        variables: { userId: this.props.otherUser },
                                                                    });

                                                                    if (otherUser!.getUserInfo && !updated) {
                                                                        otherUser!.getUserInfo.followersCount++;
                                                                        updated = true;
                                                                    }

                                                                    proxy.writeQuery({
                                                                        query: getUserInfo,
                                                                        variables: { userId: this.props.otherUser },
                                                                        data: otherUser,
                                                                    });
                                                                },
                                                            });
                                                            this.setState({ working: false });
                                                        } catch (e) {
                                                            console.log(e);
                                                        }
                                                    }}
                                                />
                                            )}
                                        </Mutation>
                                    );
                                } else {
                                    return (
                                        <Mutation<API.DeleteFollowerMutation> mutation={gql(mutations.deleteFollower)}>
                                            {(deleteFollower) => (
                                                <Button
                                                    title={'Unfollow'}
                                                    color={platform.brandBackground}
                                                    onPress={async () => {
                                                        try {
                                                            this.setState({ working: true });
                                                            let updated = false;
                                                            await deleteFollower({
                                                                variables: { input },
                                                                update: (proxy) => {
                                                                    const followerData = proxy.readQuery({
                                                                        query: GetFollower,
                                                                        variables: input,
                                                                    });

                                                                    (followerData as any).getFollower = null;

                                                                    proxy.writeQuery({
                                                                        query: GetFollower,
                                                                        variables: input,
                                                                        data: followerData,
                                                                    });

                                                                    const followerList = proxy.readQuery({
                                                                        query: listFollowers,
                                                                        variables: {followeeId : input.followeeId},
                                                                    });

                                                                    console.log('FollowersList: ', followerList);
                                                                    console.log('FollowerId: ', input.followerId);

                                                                    if (followerList && followerList.listFollowers){
                                                                        followerList.listFollowers.items =
                                                                        followerList.listFollowers.items.filter((item) =>
                                                                        (item.followerId != input.followerId));
                                                                    }

                                                                    console.log('New followerlist: ', followerList);

                                                                    proxy.writeQuery({
                                                                        query: listFollowers,
                                                                        variables: {followeeId : input.followeeId},
                                                                        data: followerList,
                                                                    });

                                                                    const followingList = proxy.readQuery({
                                                                        query: listFollowing,
                                                                        variables: {followerId : input.followerId},
                                                                    });

                                                                    console.log('FollowingList: ', followingList);
                                                                    console.log('FolloweeId: ', input.followeeId);

                                                                    if (followingList && followingList.listFollowing){
                                                                        followingList.listFollowing.items =
                                                                        followingList.listFollowing.items.filter((item) =>
                                                                        (item.followeeId != input.followeeId));
                                                                    }

                                                                    console.log('New followinglist: ', followingList);

                                                                    proxy.writeQuery({
                                                                        query: listFollowing,
                                                                        variables: {followerId : input.followerId},
                                                                        data: followingList,
                                                                    });

                                                                    const userData = proxy.readQuery({
                                                                        query: getUserInfo,
                                                                        variables: { userId: this.props.myUserId },
                                                                    });

                                                                    if (userData!.getUserInfo && !updated) {
                                                                        userData!.getUserInfo.followingCount--;
                                                                    }

                                                                    proxy.writeQuery({
                                                                        query: getUserInfo,
                                                                        variables: { userId: this.props.myUserId },
                                                                        data: userData,
                                                                    });

                                                                    const otherUser = proxy.readQuery({
                                                                        query: getUserInfo,
                                                                        variables: { userId: this.props.otherUser },
                                                                    });

                                                                    if (otherUser!.getUserInfo && !updated) {
                                                                        otherUser!.getUserInfo.followersCount--;
                                                                        updated = true;
                                                                    }

                                                                    proxy.writeQuery({
                                                                        query: getUserInfo,
                                                                        variables: { userId: this.props.otherUser },
                                                                        data: otherUser,
                                                                    });
                                                                },
                                                            });
                                                            this.setState({ working: false });
                                                        } catch (e) {
                                                            console.log(e);
                                                        }
                                                    }}
                                                />
                                            )}
                                        </Mutation>
                                    );
                                }
                            }}
                        </Query>
                    );
                }}
            </Query>
        );
    }

    public render() {
        if (this.props.otherUser && this.props.otherUser !== this.props.myUserId) {
            return (
                <View style={{ paddingRight: 10 }}>
                    {this.renderButton()}
                </View>
            );
        } else {
            return (
                <TouchableOpacity
                    style={{ paddingRight: 10 }}
                    onPress={this.handleSearch.bind(this)}
                >
                    <Icon name="search" />
                </TouchableOpacity>
            );
        }
    }
}

function mapStateToProps(state: IReduxState) {
    return {
        myUserId: state.users.myUserId,
    };
}

export default connect(mapStateToProps)(FollowSearchButton);
