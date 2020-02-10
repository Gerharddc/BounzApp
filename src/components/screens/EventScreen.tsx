/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Herman Lombard
 */

import { gotoEventResponses, gotoSendInvite } from 'actions/nav';
import * as navActions from 'actions/nav';
import * as NavActions from 'actions/nav';
import * as API from 'API';
import Analytics from '@aws-amplify/analytics';
import gql from 'graphql-tag';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';
import * as _ from 'lodash';
import { calculateProfilePicUrl } from 'logic/UserInfo';
import { Button, Card, Text } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { Mutation } from 'react-apollo';
import { Query } from 'react-apollo';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import { navigate } from 'utils/NavigationService';
import LoadingBlock from '../LoadingBlock';

const getEventInfo = gql(queries.getEventInfo);
const getInviteResponseInfo = gql(queries.getInviteResponseInfo);
const listUserEvents = gql(queries.listUserEvents);
const Image = createImageProgress(FastImage);

interface IProps {
    navigation: any;
    myUserId: string;
}

class EventScreen extends React.Component<IProps> {
    componentDidMount() {
        Analytics.record({
            name: 'viewEventScreen',
        });
    }
    state = {
        deleting: false,
    };

    static navigationOptions = {
        title: 'Event details',
    };

    async deleteEvent(deleteEvent: any) {
        Alert.alert(
            'Delete post',
            'Are you sure you want to delete this event?',
            [
                { text: 'No', style: 'cancel' },
                { text: 'Yes', onPress: deleteEvent },
            ],
        );
    }

    private renderOwnerButtons(eventId: string) {
        return (
            <View>
                <Button block
                    onPress={() =>
                        navigate(gotoSendInvite(eventId))
                    }
                >
                    <Text>Send invite</Text>
                </Button>
                <Button block
                    onPress={() =>
                        navigate(gotoEventResponses(eventId))
                    }
                >
                    <Text>View responses</Text>
                </Button>
                <Mutation<API.DeleteEventMutation> mutation={gql(mutations.deleteEvent)}>
                    {(deleteEvent) => {
                        const eventDelete = async () => {
                            this.setState({ deleting: true });
                            try {
                                await deleteEvent({
                                    variables: { eventId },
                                    update: (proxy) => {
                                        const data = proxy.readQuery({
                                            query: listUserEvents,
                                            variables: { ownerId: this.props.myUserId },
                                        }) as any;

                                        data.listUserEvents.items =
                                            data.listUserEvents.items.filter((item: any) => item.eventId !== eventId);

                                        proxy.writeQuery({
                                            query: listUserEvents,
                                            variables: { ownerId: this.props.myUserId },
                                            data,
                                        });
                                    },
                                });
                                navigate(navActions.goBack());
                                this.setState({ deleting: true });
                            } catch (e) {
                                console.log(e);
                            }
                        };
                        return (
                            <Button block
                                onPress={() => {
                                    this.deleteEvent(eventDelete);
                                }}
                            >
                                <Text>Delete event</Text>
                            </Button>
                        );
                    }}
                </Mutation>
            </View>
        );
    }

    private renderButtons(event: any) {
        const currentDate = new Date();
        const myUserId = this.props.myUserId;
        const responseId = this.props.navigation.state.params.responseId;
        const inviteId = this.props.navigation.state.params.inviteId;

        if (myUserId === event.ownerId) {
            return this.renderOwnerButtons(event.eventId);
        } else if (responseId) {
            return this.renderResponse(responseId);
        } else if ((new Date(event.rsvpDate)) < currentDate) {
            return (
                <Card style={{ padding: 15 }}>
                    <Text style={{ alignContent: 'center', textAlign: 'center' }}>
                        Unfortunately the RSVP date has passed
                    </Text>
                </Card>
            );
        } else {
            return (
                <Button block iconLeft onPress={() => navigate(NavActions.gotoInviteResponse(inviteId, event.eventId))}>
                    <Text>Respond to invite</Text>
                </Button>
            );
        }
    }

    private renderResponse(responseId: string) {
        return (
            <Query<API.GetInviteResponseInfoQuery>
                query={getInviteResponseInfo}
                variables={{ responseId }}
                fetchPolicy="cache-and-network"
            >
                {({ data, error, fetchMore, refetch, loading }) => {
                    if (error) {
                        console.log(error);
                        return (
                            <Text>{JSON.stringify(error)}</Text>
                        );
                    }

                    if (!data || !data.getInviteResponseInfo) {
                        return (
                            <View style={{ height: 60 }}>
                                <ActivityIndicator
                                    color={platform.brandPrimary}
                                    size="large"
                                    style={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                />
                            </View>
                        );
                    }

                    return (
                        <View style={{ flex: 1 }}>
                            {this.renderCard('Your response', data.getInviteResponseInfo.responseType)}
                            {this.renderCard('Attendance limit', data.getInviteResponseInfo.attendanceCount.toString())}
                            {(data.getInviteResponseInfo.comment.trim() !== '') &&
                                this.renderCard('Comment', data.getInviteResponseInfo.comment)}
                        </View>
                    );
                }}
            </Query>
        );
    }

    private renderOwnerCard(ownerId: string) {
        const myUserId = this.props.myUserId;

        if (myUserId === ownerId) {
            return null;
        } else {
            return (
                <Query<API.GetUserInfoQuery>
                    query={gql(queries.getUserInfo)}
                    variables={{ userId: ownerId }}
                >
                    {(result) => {
                        if (!result.data || !result.data.getUserInfo) {
                            return (
                                <View style={{ height: 60 }}>
                                    <ActivityIndicator
                                        color={platform.brandPrimary}
                                        size="large"
                                        style={{
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    />
                                </View>
                            );
                        }

                        const user = result.data.getUserInfo;
                        const ownerPicUri = calculateProfilePicUrl(user);
                        const thumbSize = 60;

                        return (
                            <TouchableOpacity onPress={() => navigate(NavActions.gotoOtherUser(ownerId))}>
                                <Card>
                                    <View style={{ flexDirection: 'row', marginLeft: 15, alignItems: 'center' }}>
                                        <Text style={{ fontWeight: 'bold', flex: 1 }}>Owned by</Text>
                                        <Text>{user.username}</Text>
                                        <Image
                                            source={{ uri: ownerPicUri }}
                                            style={{
                                                width: thumbSize, height: thumbSize,
                                                marginLeft: 15,
                                            }}
                                            indicator={Progress.Pie}
                                        />
                                    </View>
                                </Card>
                            </TouchableOpacity>
                        );
                    }
                    }
                </Query >
            );
        }
    }

    private renderCard(title: string, text: string) {
        return (
            <Card style={{ padding: 15 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
                    {title}
                </Text>
                <Text>{text}</Text>
            </Card>
        );
    }

    public render() {
        const eventId = this.props.navigation.state.params.eventId;

        return (
            <Query<API.GetEventInfoQuery>
                query={getEventInfo}
                variables={{ eventId }}
                fetchPolicy="cache-and-network"
            >
                {({ data, error, refetch, loading }) => {

                    if (error) {
                        console.log(error);
                        return (
                            <Text>{JSON.stringify(error)}</Text>
                        );
                    }

                    if (!data || !data.getEventInfo) {
                        return (<LoadingBlock />);
                    }

                    const event = data.getEventInfo;

                    return (
                        <View style={{ flex: 1 }}>
                            <ScrollView style={{ flex: 1 }}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={loading}
                                        onRefresh={() => refetch()}
                                    />
                                }
                                contentContainerStyle={{ padding: 10 }}
                            >
                                <Card style={{ padding: 15, backgroundColor: 'black' }}>
                                    <Text style={{ fontWeight: 'bold', marginBottom: 5, color: 'white' }}>
                                        {event.title}
                                    </Text>
                                    <Text style={{ color: 'white' }}>
                                        {event.type}
                                    </Text>
                                </Card>
                                {this.renderOwnerCard(data.getEventInfo.ownerId)}
                                {this.renderCard('Description', event.description)}
                                {this.renderCard('Location', event.location)}
                                {this.renderCard('Date', event.date.substr(0, 10) + ' ' + event.date.substr(11, 5))}
                                {this.renderCard('RSVP date', event.rsvpDate.substr(0, 10) + ' ' +
                                    event.rsvpDate.substr(11, 5))}
                                {this.renderButtons(event)}
                            </ScrollView>
                            {this.state.deleting && <ActivityIndicator
                                size="large"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    position: 'absolute',
                                    zIndex: 1,
                                }}
                                color="blue"
                            />}
                        </View>
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

export default connect(mapStateToProps)(EventScreen);
