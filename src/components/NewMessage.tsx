/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
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

const listThreadMessages = gql(queries.listThreadMessages);
const listUserThreads = gql(queries.listUserThreads);

interface IProps {
    fontColor: string;
    myUserId: string;
    threadId: string;
}

class NewMessage extends React.Component<IProps> {
    state = {
        newMessage: '',
        loading: false,
    };

    componentDidMount() {
        // This is a hack to make text selectable on Android
        setTimeout(() => this.setState({ multiline: false }), 100);
    }

    render() {
        const { fontColor } = this.props;

        return (
            <Mutation<API.CreateMessageMutation> mutation={gql(mutations.createMessage)}>
                {(createMessage) => {
                    return (
                        <View style={{
                            borderBottomWidth: 1,
                            borderTopWidth: 1,
                            borderColor: fontColor,
                            opacity: this.state.loading ? 0.5 : 1,
                        }}>
                            <MentionSuggestingInput
                                placeholder="Your message"
                                style={{
                                    width: '100%', color: fontColor, height: 50,
                                    paddingLeft: 7, paddingRight: 40,
                                }}
                                placeholderTextColor={(fontColor === '#ffffff') ? '#E0E0E0' : '#424242'}
                                value={this.state.newMessage}
                                onChangeText={(text) => this.setState({ newMessage: text })}
                                disabled={this.state.loading}
                                fontColor={fontColor}
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
                                disabled={!this.state.newMessage}
                                onPress={async () => {
                                    const input = {
                                        messengerId: this.props.myUserId,
                                        threadId: this.props.threadId,
                                        message: this.state.newMessage,
                                    };

                                    this.setState({ loading: true });
                                    try {

                                        Analytics.record({
                                            name: 'newMessage',
                                            attributes: { threadId: this.props.threadId },
                                        });

                                        let updated = false;
                                        await createMessage({
                                            variables: { input },
                                            update: (proxy, { data }) => {
                                                if (updated) {
                                                    return;
                                                }

                                                updated = true;

                                                if (!data || !data.createMessage) {
                                                    return null;
                                                }

                                                const threadList = proxy.readQuery({
                                                    query: listUserThreads,
                                                    variables: { userId: input.messengerId },
                                                });

                                                const newThread = {
                                                    threadId: data.createMessage.threadId,
                                                    userId: data.createMessage.messengerId,
                                                    latestMessageDate: data.createMessage.messageDate,
                                                    __typename: 'Thread',
                                                };

                                                const threadExists = threadList.listUserThreads.items.find((item) => {
                                                    return item.threadId === data!.createMessage!.threadId;
                                                });

                                                if (threadList && threadList.listUserThreads) {
                                                    if (!threadExists) {
                                                        threadList.listUserThreads.items =
                                                            [newThread, ...threadList.listUserThreads.items];
                                                    }
                                                    threadList.listUserThreads.items.map((item) => {
                                                        if (item.threadId === data!.createMessage!.threadId) {
                                                            item.latestMessageDate = data!.createMessage!.messageDate;
                                                        }
                                                    });
                                                }

                                                proxy.writeQuery({
                                                    query: listUserThreads,
                                                    variables: { userId: input.messengerId },
                                                    data: threadList,
                                                });

                                                const threadMessages = proxy.readQuery({
                                                    query: listThreadMessages,
                                                    variables: { threadId: input.threadId },
                                                });

                                                if (!threadMessages || !threadMessages.listThreadMessages) {
                                                    return;
                                                }

                                                const newMessage = {
                                                    message: input.message,
                                                    messengerId: input.messengerId,
                                                    messageDate: data.createMessage.messageDate,
                                                    threadId: input.threadId,
                                                    __typename: 'Message',
                                                };

                                                threadMessages.listThreadMessages.items =
                                                    [newMessage, ...threadMessages.listThreadMessages.items];

                                                proxy.writeQuery({
                                                    query: listThreadMessages,
                                                    variables: { threadId: input.threadId },
                                                    data: threadMessages,
                                                });
                                            },
                                        });

                                        Keyboard.dismiss();
                                    } catch (e) {
                                        console.log(e);
                                        alert(e.message);
                                    }

                                    this.setState({ newMessage: '', loading: false });
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

export default connect(mapStateToProps)(NewMessage);
