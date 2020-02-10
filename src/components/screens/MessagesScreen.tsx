/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Herman Lombard
 */

import { extractThreadDetails } from 'actions/ExtractThreadDetails';
import * as API from 'API';
import Analytics from '@aws-amplify/analytics';
import MessageItem from 'components/MessageItem';
import NewMessage from 'components/NewMessage';
import PlatformKeyboardAvoidingView from 'components/PlatformKeyboardAvoidingView';
import gql from 'graphql-tag';
import * as queries from 'graphql/queries';
import * as subscriptions from 'graphql/subscriptions';
import * as _ from 'lodash';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { Query } from 'react-apollo';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import OnMount from 'utils/OnMount';
import LoadingBlock from '../LoadingBlock';

interface IProps {
    navigation: any;
    myUserId: string;
}

const ListThreadMessages = gql(queries.listThreadMessages);

class MessagesScreen extends React.Component<IProps> {
    componentDidMount() {
        const { threadId } = this.props.navigation.state.params;

        if (threadId.includes('courtId')) {
            Analytics.record({
                name: 'viewUserMessages',
                attributes: { threadId },
            });
        } else {
            Analytics.record({
                name: 'viewCourtMessages',
                attributes: { threadId },
            });
        }
    }

    public static navigationOptions = ({ navigation }: any) => {
        const pars = navigation.state.params;
        return ({title: (pars && pars.title) ? (pars.title) : 'Loading'}) ;
    }

    private updateNavParams(title: string) {
        const navParams = this.props.navigation.state.params;
        if (!navParams || navParams.title !== title) {
            this.props.navigation.setParams({ title });
        }
    }

    private renderMessages(threadId: string) {
        const fontColor = '#000000';
        return (
            <Query<API.ListThreadMessagesQuery>
                query={ListThreadMessages}
                variables={{ threadId }}
                fetchPolicy="cache-and-network"
            >
                {({ data, fetchMore, subscribeToMore, loading, refetch }) => {
                    if (!data || !data.listThreadMessages) {
                        return (<LoadingBlock />);
                    }

                    const nextToken = data.listThreadMessages.nextToken;

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
                                data={data.listThreadMessages.items}
                                renderItem={({ item }) => (
                                    <MessageItem
                                        key={item.threadId + item.messageDate}
                                        message={item}
                                        fontColor={fontColor}
                                    />
                                )}
                                keyExtractor={(item) => item.threadId + item.messageDate}
                                onEndReached={() => {
                                    if (!nextToken) {
                                        return;
                                    }

                                    fetchMore({
                                        query: ListThreadMessages,
                                        variables: { threadId, nextToken },
                                        updateQuery: (previousResult: any, more: any) => {
                                            if (more && more.fetchMoreResult &&
                                                more.fetchMoreResult.listThreadMessages
                                            ) {
                                                if (!_.isEqual(more.fetchMoreResult,
                                                    more.fetchMoreResult!.listThreadMessages)) {
                                                    const oldItems = previousResult.listThreadMessages.items;
                                                    const newItems = more.fetchMoreResult.listThreadMessages.items;
                                                    if (oldItems[oldItems.length - 1] !==
                                                        newItems[newItems.length - 1]) {
                                                        previousResult.listThreadMessages.items =
                                                            [...oldItems, ...newItems];
                                                    }
                                                    previousResult.listThreadMessages.nextToken =
                                                        more.fetchMoreResult.listThreadMessages.nextToken;
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
                            <NewMessage fontColor={fontColor} threadId={threadId} />
                            <OnMount run={() => {
                                subscribeToMore({
                                    document: gql(subscriptions.onCreateMessage),
                                    variables: { threadId },
                                    updateQuery: (prev, { subscriptionData }) => {
                                        const newMessage = (subscriptionData.data as any).onCreateMessage;

                                        if (newMessage) {
                                            const oldItems = prev.listThreadMessages!.items;
                                            if (!(oldItems.find(({ messengerId, messageDate }) =>
                                                messengerId === newMessage.messengerId &&
                                                messageDate === newMessage.messageDate))) {
                                                prev.listThreadMessages!.items = [newMessage, ...oldItems];
                                            }
                                        }

                                        return prev;
                                    },
                                    onError: (e) => console.log('subscribe error', e),
                                });
                            }} />
                            <OnMount run={() => {
                                subscribeToMore({
                                    document: gql(subscriptions.onDeleteMessage),
                                    variables: { threadId },
                                    updateQuery: (prev, { subscriptionData }) => {
                                        const toRemove = (subscriptionData.data as any).onDeleteMessage;

                                        if (prev.listThreadMessages) {
                                            prev.listThreadMessages.items = prev.listThreadMessages.items.filter(
                                                (value) => value.messageDate !== toRemove.messageDate);
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

    public render() {
        const { threadId } = this.props.navigation.state.params;
        const thread = extractThreadDetails(threadId);
        let title = 'Loading';
        console.log('ThreadId: ', threadId);
        console.log('Thread: ', thread);
        if (thread.type === 'court') {
            console.log('CourtThread');
            return (
                <Query<API.GetCourtInfoQuery>
                    query={gql(queries.getCourtInfo)}
                    variables={{ courtId: thread.courtId }}
                    fetchPolicy="cache-and-network"
                >
                    {({ data, error }) => {
                        if (error) {
                            return (
                                <View>
                                    <Text>{JSON.stringify(error)}</Text>
                                    <Text>{JSON.stringify(thread)}</Text>
                                </View>
                            );
                        }

                        if (!data || !data.getCourtInfo) {
                            return (<LoadingBlock />);
                        } else {
                            title = data.getCourtInfo.name;
                        }

                        setImmediate(() => this.updateNavParams(title));

                        return (
                            this.renderMessages(threadId)
                        );
                    }}
                </Query>
            );
        } else {
            const otherId = (thread.userIdA === this.props.myUserId) ? thread.userIdB : thread.userIdA;

            return (
                <Query<API.GetUserInfoQuery>
                    query={gql(queries.getUserInfo)}
                    variables={{ userId: otherId }}
                    fetchPolicy="cache-and-network"
                >
                    {({ data, error }) => {
                        if (error) {
                            return (
                                <View>
                                    <Text>{JSON.stringify(error)}</Text>
                                    <Text>{JSON.stringify(thread)}</Text>
                                </View>
                            );
                        }

                        if (!data || !data.getUserInfo) {
                            return (<LoadingBlock />);
                        } else {
                            title = data.getUserInfo.username;
                        }

                        setImmediate(() => this.updateNavParams(title));
                        return (
                            this.renderMessages(threadId)
                        );
                    }}
                </Query>
            );
        }
    }
}

function mapStateToProps(state: IReduxState) {
    return {
        myUserId: state.users.myUserId,
    };
}

export default connect(mapStateToProps)(MessagesScreen);
