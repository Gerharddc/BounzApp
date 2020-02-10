/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as API from 'API';
import PostList from 'components/carousel/PostList';
import ReceivedPostCard from 'components/carousel/ReceivedPostCard';
import SentPostCard from 'components/carousel/SentPostCard';
import LoadingBlock from 'components/LoadingBlock';
import gql from 'graphql-tag';
import * as queries from 'graphql/queries';
import * as subscriptions from 'graphql/subscriptions';
import * as _ from 'lodash';
import { navigationOptions } from 'navigators/MainNavigtor';
import * as React from 'react';
import { Query } from 'react-apollo';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers/index';
import { IUsersState } from 'reducers/users';
import OnMount from 'utils/OnMount';
import MenuButton from '../MenuButton';
import MessagesButton from 'components/MessagesButton';

const ListUserReceivedPosts = gql(queries.listUserReceivedPosts);
const ListUserSentPosts = gql(queries.listUserSentPosts);
const GetUserInfoQuery = gql(queries.getUserInfo);

interface IProps {
    usersState: IUsersState;
    navigation: any;
}

class FlowTab extends React.PureComponent<IProps> {
    static navigationOptions = ({ navigation }: any) => {
        const pars = navigation.state.params;
        const defaultTitle = (pars && pars.userId) ? 'Loading' : 'Bounzed to me';

        return ({
            ...navigationOptions,
            tabBarLabel: 'Flow',
            tabBarIcon: ({ tintColor }: { tintColor: string }) => (
                <Icon name="cards" style={{ fontSize: 22, color: tintColor }} />
            ),
            headerTitle: (pars && pars.otherUserName) ? `${pars.otherUserName}'s Posts` : defaultTitle,
            headerRight: (<View style={{ flexDirection: 'row' }}>
                <MessagesButton />
                <MenuButton />
            </View>
            ),
        });
    }


    private updateUserName(userId: string) {
        const navParams = this.props.navigation.state.params;

        return (
            <Query<API.GetUserInfoQuery>
                query={GetUserInfoQuery}
                variables={{ userId }}
            >
                {({ data, loading }) => {
                    if (!data || !data.getUserInfo) {
                        return null;
                    }

                    const user = data.getUserInfo;

                    if (navParams.otherUserName !== user.username) {
                        // We should not update props during a render
                        setImmediate(() =>
                            this.props.navigation.setParams({ otherUserName: user.username }));
                    }

                    return null;
                }}
            </Query>
        );
    }

    private renderReceivedPosts() {
        const receiverId = this.props.usersState.myUserId;

        return (
            <Query<API.ListUserReceivedPostsQuery>
                query={ListUserReceivedPosts}
                variables={{ receiverId }}
                fetchPolicy="cache-and-network"
            >
                {({ data, loading, error, fetchMore, refetch, subscribeToMore }) => {
                    if (error) {
                        console.log(error);
                    }

                    if (!data || !data.listUserReceivedPosts) {
                        return (<LoadingBlock />);
                    }

                    const posts = data.listUserReceivedPosts.items.map((item) => ({
                        component: ReceivedPostCard,
                        props: {
                            receivedDate: item.receivedDate,
                            postId: item.postId,
                        },
                        key: 'receivedpost_' + item.receivedDate,
                    }));

                    const nextToken = data.listUserReceivedPosts.nextToken;

                    return (
                        <View style={{ flex: 1 }}>
                            <PostList
                                posts={posts}
                                maybeText="Maybe you should follow more people 🤷"
                                onLoadMore={() => {
                                    if (!nextToken) {
                                        return;
                                    }

                                    fetchMore({
                                        query: ListUserReceivedPosts,
                                        variables: { receiverId, nextToken },
                                        updateQuery: (previousResult, more) => {
                                            if (more && more.fetchMoreResult &&
                                                more.fetchMoreResult.listUserReceivedPosts
                                            ) {
                                                if (!_.isEqual(more.fetchMoreResult,
                                                    more.fetchMoreResult!.listUserReceivedPosts)) {
                                                    const oldItems = previousResult.listUserReceivedPosts!.items;
                                                    const newItems = more.fetchMoreResult.listUserReceivedPosts.items;
                                                    if (oldItems[oldItems.length - 1] !==
                                                        newItems[newItems.length - 1]) {
                                                        previousResult.listUserReceivedPosts!.items =
                                                            [...oldItems, ...newItems];
                                                    }
                                                    previousResult.listUserReceivedPosts!.nextToken =
                                                        more.fetchMoreResult.listUserReceivedPosts.nextToken;
                                                }
                                            }
                                            return previousResult;
                                        },
                                    });
                                }}
                                refreshing={loading}
                                onRefresh={() => refetch()}
                            />
                            <OnMount run={() => {
                                subscribeToMore({
                                    document: gql(subscriptions.onCreateReceivedPost),
                                    variables: { receiverId },
                                    updateQuery: (prev, { subscriptionData }) => {
                                        const newPost = (subscriptionData.data as any).onCreateReceivedPost;

                                        if (newPost) {
                                            const oldItems = prev.listUserReceivedPosts!.items;
                                            if (!(oldItems.find(({ receivedDate }) =>
                                                (receivedDate === newPost.receivedDate),
                                            ))) {
                                                prev.listUserReceivedPosts!.items =
                                                    [newPost, ...oldItems];
                                            }
                                        }

                                        return prev;
                                    },
                                    onError: (e) => console.log('subscribe error', e),
                                });
                            }} />
                            <OnMount run={() => {
                                subscribeToMore({
                                    document: gql(subscriptions.onDeleteReceivedPost),
                                    variables: { receiverId },
                                    updateQuery: (prev, { subscriptionData }) => {
                                        const toRemove = (subscriptionData.data as any).onDeleteReceivedPost;

                                        if (prev.listUserReceivedPosts) {
                                            prev.listUserReceivedPosts.items = prev!.listUserReceivedPosts!.items!.filter(
                                                (value) => value.postId !== toRemove.postId);
                                        }

                                        return prev;
                                    },
                                    onError: (e) => console.log('subscribe error', e),
                                });
                            }} />
                        </View>
                    );
                }}
            </Query>
        );
    }

    private renderSentPosts(creatorId: string) {
        return (
            <Query<API.ListUserSentPostsQuery>
                query={ListUserSentPosts}
                variables={{ creatorId }}
                fetchPolicy="cache-and-network"
            >
                {({ data, loading, error, fetchMore, refetch, subscribeToMore }) => {
                    if (error) {
                        console.log(error);
                    }

                    if (!data || !data.listUserSentPosts) {
                        return (<LoadingBlock />);
                    }

                    const posts = data.listUserSentPosts.items.map((item) => ({
                        component: SentPostCard,
                        props: {
                            creatorId: item.creatorId,
                            postedDate: item.postedDate,
                        },
                        key: item.creatorId + item.postedDate,
                    }));

                    const nextToken = data.listUserSentPosts.nextToken;

                    return (
                        <View style={{ flex: 1, width: '100%' }}>
                            <PostList
                                posts={posts}
                                onLoadMore={() => {
                                    if (!nextToken) {
                                        return;
                                    }

                                    fetchMore({
                                        query: ListUserSentPosts,
                                        variables: { creatorId, nextToken },
                                        updateQuery: (previousResult, more) => {
                                            if (more.fetchMoreResult && more.fetchMoreResult.listUserSentPosts) {
                                                if (!_.isEqual(more.fetchMoreResult, more.fetchMoreResult!.listUserSentPosts)) {
                                                    const oldItems = previousResult.listUserSentPosts!.items;
                                                    const newItems = more.fetchMoreResult.listUserSentPosts.items;
                                                    if (oldItems[oldItems.length - 1] !== newItems[newItems.length - 1]) {
                                                        previousResult.listUserSentPosts!.items = [...oldItems, ...newItems];
                                                    }
                                                    previousResult.listUserSentPosts!.nextToken =
                                                        more.fetchMoreResult.listUserSentPosts.nextToken;
                                                }
                                            }
                                            return previousResult;
                                        },
                                    });
                                }}
                                refreshing={loading}
                                onRefresh={() => refetch()}
                            />
                            <OnMount run={() => {
                                subscribeToMore({
                                    document: gql(subscriptions.onDeleteSentPost),
                                    variables: { creatorId },
                                    updateQuery: (prev, { subscriptionData }) => {
                                        const toRemove = (subscriptionData.data as any).onDeleteSentPost;

                                        if (prev.listUserSentPosts) {
                                            prev.listUserSentPosts.items = prev.listUserSentPosts.items.filter(
                                                (value) => value.postedDate !== toRemove.postedDate);
                                        }

                                        return prev;
                                    },
                                    onError: (e) => console.log('subscribe error', e),
                                });
                            }} />
                            <OnMount run={() => {
                                subscribeToMore({
                                    document: gql(subscriptions.onDeleteSentPost),
                                    variables: { creatorId },
                                    updateQuery: (prev, { subscriptionData }) => {
                                        const toRemove = (subscriptionData.data as any).onDeleteSentPost;

                                        if (prev.listUserSentPosts) {
                                            prev.listUserSentPosts.items = prev!.listUserSentPosts!.items!.filter(
                                                (value) => value.postedDate !== toRemove.postedDate);
                                        }

                                        return prev;
                                    },
                                    onError: (e) => console.log('subscribe error', e),
                                });
                            }} />
                        </View>
                    );
                }}
            </Query>
        );
    }

    public render() {
        const navParams = this.props.navigation.state.params;

        if (navParams && navParams.userId) {
            return (
                <View style={{ flex: 1 }}>
                    {this.updateUserName(navParams.userId)}
                    {this.renderSentPosts(navParams.userId)}
                </View>
            );
        } else {
            return (
                <View style={{ flex: 1 }}>
                    {this.renderReceivedPosts()}
                </View>
            );
        }
    }
}

function mapStateToProps(state: IReduxState) {
    return {
        usersState: state.users,
    };
}

export default connect(mapStateToProps)(FlowTab);
