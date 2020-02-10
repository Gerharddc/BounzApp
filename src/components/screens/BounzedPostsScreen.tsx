/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as API from 'API';
import Analytics from '@aws-amplify/analytics';
import BounzedPostCard from 'components/carousel/BounzedPostCard';
import PostList from 'components/carousel/PostList';
import LoadingBlock from 'components/LoadingBlock';
import gql from 'graphql-tag';
import * as queries from 'graphql/queries';
import * as subscriptions from 'graphql/subscriptions';
import * as _ from 'lodash';
import * as React from 'react';
import { Query } from 'react-apollo';
import { View } from 'react-native';
import { IUsersState } from 'reducers/users';
import OnMount from 'utils/OnMount';

const ListUserBounzes = gql(queries.listUserBounzes);

interface IProps {
    usersState: IUsersState;
    navigation: any;
}

export default class BounzedPostsScreen extends React.Component<IProps> {
    componentDidMount() {
        const bounzerId = this.props.navigation.state.params.userId;

        Analytics.record({
            name: 'viewBounzedPostsScreen',
            attributes: { bounzerId },
        });
    }

    static navigationOptions = ({ navigation }: any) => ({
        title: 'Bounzes made',
    })

    public render() {
        const bounzerId = this.props.navigation.state.params.userId;
        return (
            <Query<API.ListUserBounzesQuery>
                query={ListUserBounzes}
                variables={{ bounzerId, limit: 2 }}
                fetchPolicy="cache-and-network"
            >
                {({ data, loading, error, fetchMore, refetch, subscribeToMore }) => {
                    if (!data || !data.listUserBounzes) {
                        return (<LoadingBlock />);
                    }

                    const posts = data.listUserBounzes.items.map((item) => ({
                        component: BounzedPostCard,
                        props: {
                            bounzerId: item.bounzerId,
                            postId: item.postId,
                            bounzedDate: item.bounzedDate,
                        },
                        key: 'bounzedpost_' + item.bounzerId + '-' + item.bounzedDate,
                    }));
                    const nextToken = data.listUserBounzes.nextToken;

                    console.log('posts', posts);

                    return (
                        <View style={{ flex: 1, width: '100%' }}>
                            <PostList
                                posts={posts}
                                onLoadMore={() => {
                                    if (!nextToken) {
                                        return;
                                    }

                                    fetchMore({
                                        query: ListUserBounzes,
                                        variables: { bounzerId, nextToken },
                                        updateQuery: (previousResult, more) => {
                                            if (!_.isEqual(more.fetchMoreResult,
                                                more.fetchMoreResult!.listUserBounzes)) {
                                                const oldItems = previousResult.listUserBounzes!.items;
                                                const newItems = more.fetchMoreResult!.listUserBounzes!.items;
                                                if (oldItems[oldItems.length - 1] !== newItems[newItems.length - 1]) {
                                                    previousResult.listUserBounzes!.items = [...oldItems, ...newItems];
                                                }
                                                previousResult.listUserBounzes!.nextToken =
                                                    more.fetchMoreResult!.listUserBounzes!.nextToken;
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
                                    document: gql(subscriptions.onCreateBounz),
                                    variables: { bounzerId },
                                    updateQuery: (prev, { subscriptionData }) => {
                                        const toRemove = (subscriptionData.data as any).onDeleteSentPost;

                                        if (prev.listUserBounzes) {
                                            prev.listUserBounzes.items = prev.listUserBounzes.items.filter(
                                                (value) => value.bounzedDate !== toRemove.bounzedDate);
                                        }

                                        return prev;
                                    },
                                });
                            }} />
                        </View>
                    );
                }}
            </Query>
        );
    }
}
