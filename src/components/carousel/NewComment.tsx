/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as API from 'API';
import Analytics from '@aws-amplify/analytics';
import MentionSuggestingInput from 'components/MentionSuggestingInput';
import gql from 'graphql-tag';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';
import { Icon } from 'native-base';
import * as React from 'react';
import { Mutation } from 'react-apollo';
import { ActivityIndicator, Keyboard, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers';

const listPostComments = gql(queries.listPostComments);

interface IProps {
    fontColor: string;
    myUserId: string;
    postId: string;
}

class NewComment extends React.Component<IProps> {
    state = {
        newComment: '',
        loading: false,
        multiline: true,
    };

    componentDidMount() {
        // This is a hack to make text selectable on Android
        setTimeout(() => this.setState({ multiline: false }), 100);
    }

    render() {
        const { fontColor } = this.props;

        return (
            <Mutation<API.CreateCommentMutation> mutation={gql(mutations.createComment)}>
                {(createComment) => {
                    return (
                        <View style={{
                            borderBottomWidth: 1,
                            borderTopWidth: 1,
                            borderColor: fontColor,
                            opacity: this.state.loading ? 0.5 : 1,
                        }}>
                            <MentionSuggestingInput
                                placeholder="Your comment"
                                style={{
                                    width: '100%', color: fontColor, height: 50,
                                    paddingLeft: 7, paddingRight: 40,
                                }}
                                placeholderTextColor={(fontColor === '#ffffff') ? '#E0E0E0' : '#424242'}
                                value={this.state.newComment}
                                onChangeText={(text) => this.setState({ newComment: text })}
                                disabled={this.state.loading}
                                fontColor={fontColor}
                                multiline={this.state.multiline}
                            />
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    zIndex: 1,
                                    right: 7,
                                    bottom: 0,
                                    justifyContent: 'center',
                                    height: 50,
                                    marginBottom: 0,
                                    paddingBottom: 0,
                                }}
                                disabled={!this.state.newComment}
                                onPress={async () => {
                                    const input = {
                                        commentorId: this.props.myUserId,
                                        postId: this.props.postId,
                                        comment: this.state.newComment,
                                    };

                                    try {
                                        this.setState({ loading: true });

                                        Analytics.record({
                                            name: 'newComment',
                                            attributes: { postId: this.props.postId },
                                        });

                                        let updated = false;
                                        await createComment({
                                            variables: { input },
                                            update: (proxy, { data }) => {

                                                if (updated) {
                                                    return;
                                                }

                                                updated = true;

                                                if (!data || !data.createComment) {
                                                    return null;
                                                }

                                                const postComments = proxy.readQuery({
                                                    query: listPostComments,
                                                    variables: { postId: input.postId },
                                                });

                                                if (!postComments || !postComments.listPostComments) {
                                                    return;
                                                }

                                                const newComment = {
                                                    comment: input.comment,
                                                    commentorId: input.commentorId,
                                                    commentDate: data.createComment.commentDate,
                                                    postId: input.postId,
                                                    __typename: 'Comment',
                                                };

                                                postComments.listPostComments.items = [newComment, ...postComments.listPostComments.items];

                                                proxy.writeQuery({
                                                    query: listPostComments,
                                                    variables: { postId: input.postId },
                                                    data: postComments,
                                                });
                                            },
                                        });

                                        this.setState({ newComment: '', loading: false });
                                        Keyboard.dismiss();
                                    } catch (e) {
                                        console.log(e);
                                        alert(e.message);
                                    }
                                }}
                            >
                                <Icon style={{ color: fontColor }} fontSize={5} name="md-send" />
                            </TouchableOpacity>
                            {this.state.loading && <ActivityIndicator
                                size="small"
                                color="blue"
                                style={{ width: '100%', height: '100%', position: 'absolute' }}
                            />}
                        </View>
                    );
                }}
            </Mutation>
        );
    }
}

function mapStateToProps(state: IReduxState) {
    return { myUserId: state.users.myUserId };
}

export default connect(mapStateToProps)(NewComment);
