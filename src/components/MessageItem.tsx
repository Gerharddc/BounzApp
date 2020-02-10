/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
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
const listThreadMessages = gql(queries.listThreadMessages);
const listUserThreads = gql(queries.listUserThreads);

interface IProps {
    message: {
        threadId: string;
        messageDate: string;
        message: string;
        messengerId: string;
    };
    fontColor: string;
    myUserId: string;
}

class MessageItem extends React.PureComponent<IProps> {
    private coloredText(color: string) {
        return (props: { children: any }) => (
            <Text style={{ color }}>
                {props.children}
            </Text>
        );
    }

    private reportMessage() {
        const { threadId, messageDate } = this.props.message;

        navigate(NavActions.gotoReport('message', threadId + ';' + messageDate));
    }

    private viewUser() {
        navigate(NavActions.gotoOtherUser(this.props.message.messengerId));
    }

    private handlePressed(deleteThisMessage: () => Promise<void>) {
        const { myUserId, message } = this.props;

        if (myUserId === message.messengerId) {
            Alert.alert(
                'Your message',
                'Do you want to delete your message?',
                [
                    { text: 'No', style: 'cancel' },
                    { text: 'Yes', onPress: deleteThisMessage },
                ],
            );
        } else {
            Alert.alert(
                'Message',
                'What do you want to do?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Report message', onPress: this.reportMessage.bind(this) },
                    { text: 'View user', onPress: this.viewUser.bind(this) },
                ],
            );
        }
    }

    public render() {
        const { message, fontColor, myUserId } = this.props;
        const thumbSize = 40;
        const margin = 5;

        return (
            <Query<API.GetUserInfoQuery>
                query={gql(queries.getUserInfo)}
                variables={{ userId: message.messengerId }}
                fetchPolicy="cache-and-network"
            >
                {({ data }) => (
                    <Mutation<API.DeleteMessageMutation> mutation={gql(mutations.deleteMessage)}>
                        {(deleteMessage) => {
                            if (!data || !data.getUserInfo) {
                                return (
                                    <ActivityIndicator color={fontColor} style={{ padding: 10, width: '100%' }} />
                                );
                            }

                            const user = data.getUserInfo;
                            const uri = user ? calculateProfilePicUrl(user) : undefined;

                            const deleteThisMessage = async () => {
                                try {
                                    const input = {
                                        threadId: message.threadId,
                                        messageDate: message.messageDate,
                                        messengerId: myUserId,
                                    };
                                    let updated = false;
                                    await deleteMessage({
                                        variables: { input },
                                        update: (proxy, { data }) => {
                                            if (updated) {
                                                return;
                                            }

                                            updated = true;

                                            if (!data || !data.deleteMessage) {
                                                return null;
                                            }

                                            const threadMessages = proxy.readQuery({
                                                query: listThreadMessages,
                                                variables: { threadId: input.threadId },
                                            });

                                            if (!threadMessages || !threadMessages.listThreadMessages) {
                                                return;
                                            }

                                            threadMessages.listThreadMessages.items =
                                                threadMessages.listThreadMessages.items.filter((item) =>
                                                (item.messageDate !== input.messageDate) ||
                                                (item.messengerId !== input.messengerId));

                                            proxy.writeQuery({
                                                query: listThreadMessages,
                                                variables: { threadId: input.threadId },
                                                data: threadMessages,
                                            });

                                            const threadList = proxy.readQuery({
                                                query: listUserThreads,
                                                variables: { userId: input.messengerId },
                                            });

                                            console.log('Threadlist: ', threadList);
                                            console.log('Date: ', threadMessages.listThreadMessages.items[0]);

                                            const newLatestMessageDate = threadMessages.listThreadMessages.items[0].messageDate;

                                            console.log('New date: ', newLatestMessageDate);
                                            console.log('Threadmessages: ', threadMessages);

                                            threadList.listUserThreads.items.map((item) =>{
                                                if (item.threadId === data!.deleteMessage!.threadId){
                                                    item.latestMessageDate = newLatestMessageDate;
                                                }
                                            })

                                            console.log('New threadlist: ', threadList);

                                            proxy.writeQuery({
                                                query: listUserThreads,
                                                variables: { userId: input.messengerId },
                                                data: threadList,
                                            });
                                        },
                                    });
                                } catch (e) {
                                    alert(e.message);
                                    console.log('deleteThisMessage error', e);
                                }
                            };

                            return (
                                <TouchableOpacity
                                    onPress={() => this.handlePressed(deleteThisMessage)}
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
                                                    {message.messageDate}
                                                </Moment>
                                            </View>
                                            <LinkedText style={{ color: fontColor }} text={message.message} />
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

export default connect(mapStateToProps)(MessageItem);
