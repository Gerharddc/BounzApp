/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as NavActions from 'actions/nav';
import * as API from 'API';
import gql from 'graphql-tag';
import * as queries from 'graphql/queries';
import * as subscriptions from 'graphql/subscriptions';
import * as React from 'react';
import { Query } from 'react-apollo';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { navigate } from 'utils/NavigationService';
import OnMount from 'utils/OnMount';
import CommentItem from './CommentItem';
import NewComment from './NewComment';

interface IProps {
    postId: string;
    fontColor: string;
    vibrantColor: string;
}

const COMMENT_LIMIT = 5;

export default class CommentBlock extends React.PureComponent<IProps> {
    private renderComments() {
        const { fontColor, postId, vibrantColor } = this.props;

        return (
            <Query<API.ListPostCommentsQuery>
                query={gql(queries.listPostComments)}
                variables={{ postId }}
                fetchPolicy="cache-and-network"
            >
                {({ data, loading, error, subscribeToMore, refetch }) => {
                    if (error) {
                        console.log('error', error);
                    }

                    if (!data || !data.listPostComments) {
                        if (loading) {
                            return (
                                <ActivityIndicator style={{ width: '100%', padding: 5 }} color={fontColor} />
                            );
                        } else {
                            return null;
                        }
                    }

                    return (
                        <View>
                            {data.listPostComments.items.slice(0, COMMENT_LIMIT).reverse().map((item) => (
                                <CommentItem
                                    key={item.postId + item.commentDate}
                                    comment={item}
                                    fontColor={fontColor}
                                />
                            ))}
                            {(data.listPostComments.nextToken || data.listPostComments.items.length > 5) &&
                                <TouchableOpacity
                                    style={{ borderTopWidth: 1, borderColor: fontColor, alignItems: 'center' }}
                                    onPress={() => navigate(NavActions.gotoPostComments(postId))}
                                >
                                    <Text style={{ color: fontColor, fontSize: 16, padding: 10 }}>
                                        View all comments
                                    </Text>
                                </TouchableOpacity>
                            }
                            <OnMount run={() => {
                                subscribeToMore({
                                    document: gql(subscriptions.onCreateComment),
                                    variables: { postId },
                                    updateQuery: (prev, { subscriptionData }) => {
                                        const newComment = (subscriptionData.data as any).onCreateComment;

                                        if (newComment) {
                                            const oldItems = prev.listPostComments!.items;
                                            if (!(oldItems.find(({ commentorId, commentDate }) =>
                                                (commentorId === newComment.commentorId) &&
                                                (commentDate === newComment.commentDate),
                                            ))) {
                                                prev.listPostComments!.items =
                                                    [newComment, ...oldItems];
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
                        </View>
                    );
                }}
            </Query>
        );
    }

    public render() {
        const { fontColor, postId } = this.props;

        return (
            <View>
                {this.renderComments()}
                <NewComment fontColor={fontColor} postId={postId} />
            </View>
        );
    }
}
