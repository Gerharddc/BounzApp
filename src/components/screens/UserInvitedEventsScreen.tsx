/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Herman Lombard
 */

import { gotoEvent } from 'actions/nav';
import * as API from 'API';
import Analytics from '@aws-amplify/analytics';
import gql from 'graphql-tag';
import * as queries from 'graphql/queries';
import * as _ from 'lodash';
import { Button, Card, Text, View } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { Query } from 'react-apollo';
import { SectionList, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import { navigate } from 'utils/NavigationService';
import LoadingBlock from '../LoadingBlock';

const listUserInvitedEvents = gql(queries.listUserInvitedEvents);

interface IProps {
    myUserId: any;
}

class UserInvitedEventsScreen extends React.Component<IProps> {
    componentDidMount() {
        Analytics.record({
            name: 'viewEventsScreen',
        });
    }

    static navigationOptions = {
        title: 'Event Invites',
    };

    public render() {
        const inviteeId = this.props.myUserId;

        return (
            <Query<API.ListUserInvitedEventsQuery>
                query={listUserInvitedEvents}
                variables={{ inviteeId }}
                fetchPolicy="cache-and-network"
            >
                {({ data, error, fetchMore, refetch, loading }) => {
                    const responded = new Array<any>();
                    const notResponded = new Array<any>();

                    if (error) {
                        console.log(error);
                        return (
                            <Text>{JSON.stringify(error)}</Text>
                        );
                    }

                    if (!data || !data.listUserInvitedEvents) {
                        return (<LoadingBlock />);
                    }

                    const nextToken = data.listUserInvitedEvents.nextToken;

                    data.listUserInvitedEvents.items.map((item) => {
                        if (item.response) {
                            responded.push(item);
                        } else {
                            notResponded.push(item);
                        }
                    });

                    return (
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
                            keyExtractor={(item) => item.event.eventId}
                            onEndReached={() => {
                                if (!nextToken) {
                                    return;
                                }

                                fetchMore({
                                    query: listUserInvitedEvents,
                                    variables: { inviteeId, nextToken },
                                    updateQuery: (previousResult: any, more: any) => {
                                        if (more &&
                                            more.fetchMoreResult &&
                                            more.fetchMoreResult.listUserInvitedEvents
                                        ) {
                                            const oldItems = previousResult.listUserInvitedEvents.items;
                                            const newItems = more.fetchMoreResult.listUserInvitedEvents.items;

                                            if (!_.isEqual(oldItems, newItems)) {
                                                if (oldItems[oldItems.length - 1] !==
                                                    newItems[newItems.length - 1]) {
                                                    previousResult.listUserInvitedEvents.items =
                                                        [...oldItems, ...newItems];
                                                }

                                                previousResult.listUserInvitedEvents.nextToken =
                                                    more.fetchMoreResult.listUserInvitedEvents.nextToken;
                                            }
                                        }
                                        return previousResult;
                                    },
                                });
                            }}
                            renderItem={({ item, index, section }) => {
                                if (item.response) {
                                    return (
                                        <TouchableOpacity
                                            onPress={() =>
                                                navigate(gotoEvent(item.event.eventId,
                                                    item.response.responseId,
                                                    item.invite.inviteId))
                                            }
                                        >
                                            <Card style={{ padding: 10 }}>
                                                <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
                                                    {item.event.title} </Text>
                                                <Text>
                                                    {(new Date(item.event.date)).toDateString()}
                                                </Text>
                                            </Card>
                                        </TouchableOpacity>
                                    );
                                } else {
                                    return (
                                        <TouchableOpacity
                                            onPress={() =>
                                                navigate(gotoEvent(item.event.eventId, '', item.invite.inviteId))
                                            }
                                        >
                                            <Card style={{ padding: 10 }}>
                                                <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
                                                    {item.event.title} </Text>
                                                <Text>
                                                    {(new Date(item.event.date)).toDateString()}
                                                </Text>
                                            </Card>
                                        </TouchableOpacity>
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
                                { title: 'Already answered:', data: responded },
                                { title: 'Outstanding:', data: notResponded },
                            ]}
                            refreshing={loading}
                            onRefresh={() => refetch()}
                        />
                    );
                }}
            </Query>
        );
    }
}

function mapStateToProps(state: IReduxState) {
    return {
        myUserId: state.users.myUserId,
    };
}

export default connect(mapStateToProps)(UserInvitedEventsScreen);