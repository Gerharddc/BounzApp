/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as NavActions from 'actions/nav';
import * as API from 'API';
import LinkedText from 'components/LinkedText';
import gql from 'graphql-tag';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';
import { calculateProfilePicUrl } from 'logic/UserInfo';
import * as React from 'react';
import { Mutation, Query } from 'react-apollo';
import Moment from 'react-moment';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import { navigate } from 'utils/NavigationService';

const Image = createImageProgress(FastImage);
const listPostComments = gql(queries.listPostComments);

interface IProps {
    comment: {
        postId: string;
        commentDate: string;
        comment: string;
        commentorId: string;
    };
    fontColor: string;
    myUserId: string;
}

class CommentItem extends React.PureComponent<IProps> {
    private coloredText(color: string) {
        return (props: { children: any }) => (
            <Text style={{ color }}>
                {props.children}
            </Text>
        );
    }

    private reportComment() {
        const { postId, commentDate } = this.props.comment;

        navigate(NavActions.gotoReport('comment', postId + ';' + commentDate));
    }

    private viewUser() {
        navigate(NavActions.gotoOtherUser(this.props.comment.commentorId));
    }

    private handlePressed(deleteThisComment: () => Promise<void>) {
        const { myUserId, comment } = this.props;

        if (myUserId === comment.commentorId) {
            Alert.alert(
                'Your comment',
                'Do you want to delete your comment?',
                [
                    { text: 'No', style: 'cancel' },
                    { text: 'Yes', onPress: deleteThisComment },
                ],
            );
        } else {
            Alert.alert(
                'Comment',
                'What do you want to do?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Report comment', onPress: this.reportComment.bind(this) },
                    { text: 'View user', onPress: this.viewUser.bind(this) },
                ],
            );
        }
    }

    public render() {
        const { comment, fontColor, myUserId } = this.props;
        const thumbSize = 40;
        const margin = 5;

        return (
            <Query<API.GetUserInfoQuery>
                query={gql(queries.getUserInfo)}
                variables={{ userId: comment.commentorId }}
                fetchPolicy="cache-and-network"
            >
                {({ data }) => (
                    <Mutation<API.DeleteCommentMutation> mutation={gql(mutations.deleteComment)}>
                        {(deleteComment) => {
                            if (!data || !data.getUserInfo) {
                                return (
                                    <ActivityIndicator color={fontColor} style={{ padding: 10, width: '100%' }} />
                                );
                            }

                            const user = data.getUserInfo;
                            const uri = user ? calculateProfilePicUrl(user) : undefined;

                            const deleteThisComment = async () => {
                                try {
                                    const input = {
                                        postId: comment.postId,
                                        commentDate: comment.commentDate,
                                        commentorId: myUserId,
                                    };
                                    let updated = false;
                                    await deleteComment({
                                        variables:
                                            { input },
                                        update: (proxy, { data }) => {

                                            if (updated) {
                                                return;
                                            }

                                            updated = true;

                                            if (!data || !data.deleteComment) {
                                                return null;
                                            }

                                            const postComments = proxy.readQuery({
                                                query: listPostComments,
                                                variables: { postId: input.postId },
                                            });

                                            if (!postComments || !postComments.listPostComments) {
                                                return;
                                            }

                                            postComments.listPostComments.items =
                                                postComments.listPostComments.items.filter((item) =>
                                                (item.commentDate !== input.commentDate) ||
                                                (item.commentorId !== input.commentorId));

                                            proxy.writeQuery({
                                                query: listPostComments,
                                                variables: { postId: input.postId },
                                                data: postComments,
                                            });
                                        }
                                    });
                                } catch (e) {
                                    alert(e.message);
                                    console.log('deleteThisComment error', e);
                                }
                            };

                            return (
                                <TouchableOpacity
                                    onPress={() => this.handlePressed(deleteThisComment)}
                                    style={{ borderTopWidth: 1, borderColor: fontColor, padding: 7 }}
                                >
                                    <View style={{ flexDirection: 'row' }}>
                                        {uri && <Image
                                            source={{ uri }}
                                            style={{
                                                width: thumbSize, height: thumbSize,
                                                borderRadius: thumbSize / 4, overflow: 'hidden',
                                            }}
                                            indicator={Progress.Pie}
                                        />}
                                        <View style={{ flex: 1, marginLeft: 10 }} >
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ color: fontColor, fontWeight: 'bold', flex: 1 }}>
                                                    {user.username}
                                                </Text>
                                                <Moment fromNow element={this.coloredText(fontColor)}>
                                                    {comment.commentDate}
                                                </Moment>
                                            </View>
                                            <LinkedText style={{ color: fontColor }} text={comment.comment} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                    </Mutation>
                )}
            </Query>
        );
    }
}

function mapStateToProps(state: IReduxState) {
    return {
        myUserId: state.users.myUserId,
    };
}

export default connect(mapStateToProps)(CommentItem);
