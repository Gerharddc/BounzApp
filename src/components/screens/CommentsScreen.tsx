/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as API from 'API';
import Analytics from '@aws-amplify/analytics';
import CommentItem from 'components/carousel/CommentItem';
import NewComment from 'components/carousel/NewComment';
import PlatformKeyboardAvoidingView from 'components/PlatformKeyboardAvoidingView';
import gql from 'graphql-tag';
import * as queries from 'graphql/queries';
import * as subscriptions from 'graphql/subscriptions';
import * as _ from 'lodash';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { Query } from 'react-apollo';
import { ActivityIndicator, FlatList, Image, View } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import OnMount from 'utils/OnMount';
import LoadingBlock from '../LoadingBlock';

interface IProps {
    navigation: any;
}

const ListPostComments = gql(queries.listPostComments);

export default class CommentsScreen extends React.Component<IProps> {
    componentDidMount() {
        const { postId } = this.props.navigation.state.params;

        Analytics.record({
            name: 'viewCommentsScreen',
            attributes: { postId },
        });
    }

    public static navigationOptions = ({ navigation }: any) => ({
        title: 'Comments',
    })

    public render() {
        const { postId } = this.props.navigation.state.params;
        const fontColor = '#000000';

        return (
            <Query<API.ListPostCommentsQuery>
                query={ListPostComments}
                variables={{ postId }}
                fetchPolicy="cache-and-network"
            >
                {({ data, fetchMore, subscribeToMore, loading, refetch }) => {
                    if (!data || !data.listPostComments) {
                        return (<LoadingBlock />);
                    }

                    const nextToken = data.listPostComments.nextToken;

                    return (
                        <PlatformKeyboardAvoidingView style={{ flex: 1 }}>
                            <Image
                                source={require('../../../assets/img/fishnets-and-hearts.png')}
                                style={{ position: 'absolute', width: '100%', height: '100%' }}
                                resizeMode="repeat"
                            />
                            <FlatList
                                keyboardShouldPersistTaps="always"
                                keyboardDismissMode="on-drag"
                                inverted
                                refreshing={loading}
                                onRefresh={() => refetch()}
                                data={data.listPostComments.items}
                                renderItem={({ item }) => (
                                    <CommentItem
                                        key={item.postId + item.commentDate}
                                        comment={item}
                                        fontColor={fontColor}
                                    />
                                )}
                                keyExtractor={(item) => item.postId + item.commentDate}
                                onEndReached={() => {
                                    if (!nextToken) {
                                        return;
                                    }

                                    fetchMore({
                                        query: ListPostComments,
                                        variables: { postId, nextToken },
                                        updateQuery: (previousResult: any, more: any) => {
                                            if (more && more.fetchMoreResult &&
                                                more.fetchMoreResult.listPostComments
                                            ) {
                                                if (!_.isEqual(more.fetchMoreResult,
                                                    more.fetchMoreResult!.listPostComments)) {
                                                    const oldItems = previousResult.listPostComments.items;
                                                    const newItems = more.fetchMoreResult.listPostComments.items;
                                                    if (oldItems[oldItems.length - 1] !==
                                                        newItems[newItems.length - 1]) {
                                                        previousResult.listPostComments.items =
                                                            [...oldItems, ...newItems];
                                                    }
                                                    previousResult.listPostComments.nextToken =
                                                        more.fetchMoreResult.listPostComments.nextToken;
                                                }
                                            }
                                            return previousResult;
                                        },
                                    });
                                }}
                                ListFooterComponent={loading ?
                                    <ActivityIndicator
                                        style={{ width: '100%', padding: 5 }} color={fontColor} size="large"
                                    /> : null
                                }
                            />
                            <NewComment fontColor={fontColor} postId={postId} />
                            <OnMount run={() => {
                                subscribeToMore({
                                    document: gql(subscriptions.onCreateComment),
                                    variables: { postId },
                                    updateQuery: (prev, { subscriptionData }) => {
                                        const newComment = (subscriptionData.data as any).onCreateComment;

                                        if (newComment) {
                                            const oldItems = prev.listPostComments!.items;
                                            if (!(oldItems.find(({ commentorId, commentDate }) =>
                                                commentorId === newComment.commentorId &&
                                                commentDate === newComment.commentDate))) {
                                                prev.listPostComments!.items = [newComment, ...oldItems];
                                            }
                                        }

                                        return prev;
                                    },
                                    onError: (e) => console.log('subscribe error', e),
                                });
                            }} />
                            <OnMount run={() => {
                                subscribeToMore({
                                    document: gql(subscriptions.onDeleteComment),
                                    variables: { postId },
                                    updateQuery: (prev, { subscriptionData }) => {
                                        const toRemove = (subscriptionData.data as any).onDeleteComment;

                                        if (prev.listPostComments) {
                                            prev.listPostComments.items = prev.listPostComments.items.filter(
                                                (value) => value.commentDate !== toRemove.commentDate);
                                        }

                                        return prev;
                                    },
                                    onError: (e) => console.log('subscribe error', e),
                                });
                            }} />
                            <View style={{ height: getBottomSpace(), backgroundColor: platform.brandPrimary }} />
                        </PlatformKeyboardAvoidingView>
                    );
                }}
            </Query>
        );
    }
}
