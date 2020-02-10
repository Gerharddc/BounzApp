/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Herman Lombard
 */

import { gotoInviteResponse } from 'actions/nav';
import * as API from 'API';
import Analytics from '@aws-amplify/analytics';
import gql from 'graphql-tag';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';
import * as _ from 'lodash';
import { Card } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { Mutation } from 'react-apollo';
import { Query } from 'react-apollo';
import { ActivityIndicator, Alert, SectionList, Share, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Config from 'react-native-config';
import { navigate } from 'utils/NavigationService';
import LoadingBlock from '../LoadingBlock';

const listEventResponses = gql(queries.listEventResponses);

interface IProps {
    navigation: any;
}

export default class EventResponsesScreen extends React.Component<IProps> {
    componentDidMount() {
        Analytics.record({
            name: 'viewEventResponsesScreen',
        });
    }

    static navigationOptions = {
        title: 'Responses',
    };

    state = {
        deleting: false,
    };

    private handlePress(inviteId: string, deleteInvite: any, eventId: string) {
        Alert.alert(
            'Comment',
            'What do you want to do?',
            [
                {
                    text: 'Share link', onPress: async () => {
                        let inviteLink;
                        if (Config.STAGE === 'prod') {
                            inviteLink = `https://prod.bounz.io/invites/renderInvite?inviteId=${inviteId}`;
                        } else {
                            inviteLink = `https://dev.bounz.io/invites/renderInvite?inviteId=${inviteId}`;
                        }

                        await Share.share({
                            title: `Bounz`,
                            message: inviteLink,
                        });
                    },
                },
                { text: 'Delete invite', onPress: () => this.deleteInvite(inviteId, deleteInvite) },
                { text: 'Manual response', onPress: () => navigate(gotoInviteResponse(inviteId, eventId)) },
            ],
        );
    }

    async deleteInvite(inviteId: string, deleteInvite: any) {
        Alert.alert(
            'Delete post',
            'Are you sure you want to delete this invite?',
            [
                { text: 'No', style: 'cancel' },
                { text: 'Yes', onPress: deleteInvite },
            ],
        );
    }

    public render() {
        const eventId = this.props.navigation.state.params.eventId;

        return (
            <Query<API.ListEventResponsesQuery>
                query={listEventResponses}
                variables={{ eventId }}
                fetchPolicy="cache-and-network"
            >
                {({ data, error, fetchMore, refetch, loading }) => {
                    const attending = new Array<any>();
                    const notAttending = new Array<any>();
                    const nonResponders = new Array<any>();

                    if (error) {
                        console.log(error);
                        return (
                            <Text>{JSON.stringify(error)}</Text>
                        );
                    }

                    if (!data || !data.listEventResponses) {
                        return (<LoadingBlock />);
                    }

                    const nextToken = data.listEventResponses.nextToken;

                    data.listEventResponses.items.map((item) => {
                        if (item.response && item.response.responseType === 'Will attend') {
                            attending.push(item);
                        } else if (item.response && item.response.responseType === 'Cannot attend') {
                            notAttending.push(item);
                        } else {
                            nonResponders.push(item);
                        }
                    });

                    return (
                        <View style={{ flex: 1 }}>
                            <SectionList
                                style={{ width: '100%', flex: 1 }}
                                contentContainerStyle={{ padding: 10 }}
                                ListEmptyComponent={(
                                    <View style={{ flex: 1 }}>
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
                                    </View>
                                )}
                                keyExtractor={(item) => item.invite.inviteId}
                                onEndReached={() => {
                                    if (!nextToken) {
                                        return;
                                    }

                                    fetchMore({
                                        query: listEventResponses,
                                        variables: { eventId, nextToken },
                                        updateQuery: (previousResult: any, more: any) => {
                                            if (more &&
                                                more.fetchMoreResult &&
                                                more.fetchMoreResult.listEventResponses
                                            ) {
                                                const oldItems = previousResult.listEventResponses.items;
                                                const newItems = more.fetchMoreResult.listEventResponses.items;

                                                if (!_.isEqual(oldItems, newItems)) {
                                                    if (oldItems[oldItems.length - 1] !==
                                                        newItems[newItems.length - 1]) {
                                                        previousResult.listEventResponses.items =
                                                            [...oldItems, ...newItems];
                                                    }

                                                    previousResult.listEventResponses.nextToken =
                                                        more.fetchMoreResult.listEventResponses.nextToken;
                                                }
                                            }
                                            return previousResult;
                                        },
                                    });
                                }}
                                renderItem={({ item, index, section }) => {
                                    if (item.response && item.response.responseType === 'Will attend') {
                                        return (
                                            <Card style={{ padding: 10 }}>
                                                <Text style={{ fontWeight: 'bold' }}>
                                                    {item.invite.inviteeName + ' ' +
                                                        item.invite.inviteeSurname + ' '}
                                                    ({item.response.attendanceCount + ' ' +
                                                        (item.response.attendanceCount === 1 ?
                                                            'person' : 'people')})</Text>
                                                {item.response.comment.trim() !== '' ?
                                                    <Text>{item.response.comment.trim()}</Text> : null}
                                            </Card>
                                        );
                                    } else if (item.response && item.response.responseType === 'Cannot attend') {
                                        return (
                                            <Card style={{ padding: 10 }}>
                                                <Text style={{ fontWeight: 'bold' }}>
                                                    {item.invite.inviteeName + ' ' + item.invite.inviteeSurname}
                                                </Text>
                                                {item.response.comment.trim() !== '' ?
                                                    <Text>{item.response.comment.trim()}</Text> : null}
                                            </Card>
                                        );
                                    } else {
                                        return (
                                            <Mutation<API.DeleteInviteMutation> mutation={gql(mutations.deleteInvite)}>
                                                {(deleteInvite) => {
                                                    const inviteId = item.invite.inviteId;
                                                    const inviteDelete = async () => {
                                                        this.setState({ deleting: true });
                                                        try {
                                                            await deleteInvite({
                                                                variables: { inviteId: item.invite.inviteId },
                                                                update: (proxy) => {
                                                                    const data = proxy.readQuery({
                                                                        query: listEventResponses,
                                                                        variables: { eventId },
                                                                    }) as any;

                                                                    data.listEventResponses.items =
                                                                        data.listEventResponses.items.filter(
                                                                            (item: any) =>
                                                                                item.invite.inviteId !== inviteId);

                                                                    proxy.writeQuery({
                                                                        query: listEventResponses,
                                                                        variables: { eventId },
                                                                        data,
                                                                    });
                                                                },
                                                            });
                                                            // navigate(navActions.goBack());
                                                        } catch (e) {
                                                            console.log(e);
                                                            alert(e.message);
                                                        }
                                                        this.setState({ deleting: false });
                                                    };
                                                    return (
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                this.handlePress(item.invite.inviteId,
                                                                    inviteDelete, eventId,
                                                                );
                                                            }}
                                                        >
                                                            <Card style={{ padding: 10 }}>
                                                                <Text style={{ fontWeight: 'bold' }}>
                                                                    {item.invite.inviteeName + ' ' +
                                                                        item.invite.inviteeSurname + ' '}
                                                                    ({item.invite.attendanceLimit.toString() + ' ' +
                                                                        (item.invite.attendanceLimit === 1 ?
                                                                            'person' : 'people')})
                                                                </Text>
                                                            </Card>
                                                        </TouchableOpacity>
                                                    );
                                                }}
                                            </Mutation>
                                        );
                                    }
                                }}
                                renderSectionHeader={({ section: { title } }) => (
                                    <Card style={{ backgroundColor: 'black', padding: 10 }}>
                                        <Text style={{ fontWeight: 'bold', color: 'white' }}>
                                            {title}
                                        </Text>
                                    </Card>
                                )}
                                sections={[
                                    { title: 'Will attend', data: attending },
                                    { title: 'Cannot make it', data: notAttending },
                                    { title: 'Outstanding responses', data: nonResponders },
                                ]}
                                refreshing={loading}
                                onRefresh={() => refetch()}
                            />
                            {this.state.deleting && <ActivityIndicator
                                size="large"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    position: 'absolute',
                                    zIndex: 1,
                                }}
                            />}
                        </View>
                    );
                }}
            </Query>
        );
    }
}
