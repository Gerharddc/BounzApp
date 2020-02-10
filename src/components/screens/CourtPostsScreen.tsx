/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Herman Lombard
 */

import * as API from 'API';
import Analytics from '@aws-amplify/analytics';
import PostList from 'components/carousel/PostList';
import SentPostCard from 'components/carousel/SentPostCard';
import gql from 'graphql-tag';
import * as queries from 'graphql/queries';
import * as _ from 'lodash';
import { Text, View } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { Query } from 'react-apollo';
import { ScrollView } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LoadingBlock from '../LoadingBlock';

const listCourtPosts = gql(queries.listCourtPosts);

interface IProps {
    navigation: any;
}

export default class CourtPostsScreen extends React.Component<IProps> {
    componentDidMount() {
        const courtId = this.props.navigation.state.params.courtId;

        Analytics.record({
            name: 'viewCourtPostsScreens',
            attributes: { courtId },
        });
    }

    public static navigationOptions = ({ navigation }: any) => ({
        title: 'Posts',
    })

    public render() {
        const courtId = this.props.navigation.state.params.courtId;

        return (
            <Query<API.ListCourtPostsQuery>
                query={listCourtPosts}
                variables={{ courtId }}
                fetchPolicy="cache-and-network"
            >
                {({ data, loading, fetchMore, refetch, error }) => {

                    if (error) {
                        console.log(error);
                    }

                    if (!data || !data.listCourtPosts) {
                        return (<LoadingBlock />);
                    }

                    if (data.listCourtPosts.items.length < 1) {
                        return (
                            <ScrollView
                                style={{ padding: 10, flex: 1 }} contentContainerStyle={{ flex: 1 }}
                            >
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text style={{ textAlign: 'center', fontFamily: platform.brandFontFamily }}>
                                        Hmmmm that's stange, there's nothing here.
                                    </Text>
                                </View>
                                <Animatable.Image
                                    resizeMode="contain"
                                    style={{ marginBottom: 10, width: '100%', height: 150 }}
                                    source={require('../../../assets/img/box.png')}
                                    animation="bounce"
                                    iterationCount="infinite"
                                    duration={2000}
                                    useNativeDriver={true}
                                />
                            </ScrollView>
                        );
                    }

                    const nextToken = data.listCourtPosts.nextToken;
                    const posts = data.listCourtPosts.items!.map((item) => ({
                        component: SentPostCard,
                        props: {
                            creatorId: item.creatorId,
                            postedDate: item.postedDate,
                        },
                        key: item.creatorId + item.postedDate,
                    }));

                    return (
                        <PostList
                            posts={posts}
                            onLoadMore={() => {
                                if (!nextToken) {
                                    return;
                                }

                                fetchMore({
                                    query: listCourtPosts,
                                    variables: { courtId, nextToken },
                                    updateQuery: (previousResult, more) => {
                                        if (more.fetchMoreResult && more.fetchMoreResult.listCourtPosts) {
                                            if (!_.isEqual(more.fetchMoreResult,
                                                more.fetchMoreResult!.listCourtPosts)) {
                                                const oldItems = previousResult.listCourtPosts!.items;
                                                const newItems = more.fetchMoreResult.listCourtPosts.items;
                                                if (oldItems[oldItems.length - 1] !== newItems[newItems.length - 1]) {
                                                    previousResult.listCourtPosts!.items = [...oldItems, ...newItems];
                                                }
                                                previousResult.listCourtPosts!.nextToken =
                                                    more.fetchMoreResult.listCourtPosts.nextToken;
                                            }
                                        }
                                        return previousResult;
                                    },
                                });
                            }}
                            refreshing={loading}
                            onRefresh={() => refetch()}
                        />
                    );
                }}
            </Query>
        );
    }
}