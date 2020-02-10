/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as NavActions from 'actions/nav';
import { gotoEvent } from 'actions/nav';
import * as API from 'API';
import { appSyncClient } from 'app';
import Analytics from '@aws-amplify/analytics';
import ListViewSelect from 'components/ListViewSelect';
import PlatformKeyboardAvoidingView from 'components/PlatformKeyboardAvoidingView';
import gql from 'graphql-tag';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';
import * as _ from 'lodash';
import { calculateProfilePicUrl } from 'logic/UserInfo';
import { Button, Card, Content, Input, Text, View } from 'native-base';
import * as React from 'react';
import { Mutation, Query } from 'react-apollo';
import { ActivityIndicator, Keyboard, Platform, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import InputSpinner from 'react-native-input-spinner';
import * as Progress from 'react-native-progress';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import { navigate } from 'utils/NavigationService';
import LoadingBlock from '../LoadingBlock';

const getInviteInfo = gql(queries.getInviteInfo);
const listUserInvitedEvents = gql(queries.listUserInvitedEvents);
const getInviteResponseInfo = gql(queries.getInviteResponseInfo);
const Image = createImageProgress(FastImage);

interface IProps {
    navigation: any;
    myUserId: string;
}

class InviteResponseScreen extends React.Component<IProps> {
    componentDidMount() {
        Analytics.record({
            name: 'viewInviteScreen',
        });
    }

    static navigationOptions = {
        title: 'Respond to Invite',
    };

    state = {
        comment: '',
        responseType: '',
        attendanceCount: 0,
        loading: false,
        spinnerDisabled: true,
    };

    private didUpdate = false;

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

    async updateInviteeId() {
        console.log('Updating InviteeId:');
        console.log('InviteeId:', this.props.myUserId);
        await appSyncClient.mutate<API.UpdateInviteeIdMutation>({
            mutation: gql(mutations.updateInviteeId),
            variables: {
                inviteId: this.props.navigation.state.params.inviteId,
                inviteeId: this.props.myUserId,
            },
        });
        console.log('Updated InviteeId:');
    }

    private changeType(value: string) {
        this.setState({ responseType: value });

        if (value === 'Cannot attend') {
            this.setState({ attendanceCount: 0 });
            this.setState({ spinnerDisabled: true });
        } else {
            this.setState({ spinnerDisabled: false });
            this.setState({ attendanceCount: 1 });
        }
    }

    private validResponse(attendanceLimit: number) {
        if (this.state.responseType === 'Will attend') {
            return (this.state.attendanceCount > 0 && this.state.attendanceCount <= attendanceLimit);
        } else {
            return (this.state.responseType !== '');
        }
    }

    private responseId = '';

    private renderRespondButton(event: any, invite: any) {
        return (
            <Mutation<API.CreateInviteResponseMutation>
                mutation={gql(mutations.createInviteResponse)}
            >
                {(createInviteResponse) => {
                    return (
                        <Button block
                            disabled={!this.validResponse(invite.attendanceLimit)}
                            onPress={async () => {
                                Keyboard.dismiss();
                                this.setState({ loading: true });

                                let updated = false;

                                const input = {
                                    inviteId: this.props.navigation.state.params.inviteId,
                                    responseType: this.state.responseType,
                                    attendanceCount: this.state.attendanceCount,
                                    comment: this.state.comment,
                                };

                                try {
                                    await createInviteResponse({
                                        variables: { input },
                                        update: (proxy, { data }) => {

                                            if (updated) {
                                                return;
                                            }

                                            let response;

                                            if (!data || !data.createInviteResponse) {
                                                return;
                                            } else {
                                                this.responseId = data.createInviteResponse.responseId;
                                                response = {
                                                    getInviteResponseInfo: data.createInviteResponse,
                                                };
                                            }

                                            console.log('inviteResponse:', response);

                                            proxy.writeQuery({
                                                query: getInviteResponseInfo,
                                                variables: { responseId: this.responseId },
                                                data: response,
                                            });

                                            const invitedEvents = proxy.readQuery({
                                                query: listUserInvitedEvents,
                                                variables: { inviteeId: this.props.myUserId },
                                            }) as any;

                                            console.log('invitedEvents:', invitedEvents);

                                            if (!invitedEvents || !invitedEvents.listUserInvitedEvents) {
                                                return;
                                            }

                                            invitedEvents.listUserInvitedEvents.items.map((item: any) => {
                                                if (item.invite.inviteId === data.createInviteResponse!.inviteId) {
                                                    item.response = data.createInviteResponse;
                                                }
                                            });

                                            console.log('invitedEvents:', invitedEvents);

                                            proxy.writeQuery({
                                                query: listUserInvitedEvents,
                                                variables: { inviteeId: this.props.myUserId },
                                                data: invitedEvents,
                                            });

                                            updated = true;
                                        },
                                    });
                                    navigate(gotoEvent(this.props.navigation.state.params.eventId,
                                        this.responseId,
                                        this.props.navigation.state.params.inviteId));

                                } catch (e) {
                                    console.log(e);
                                }

                                this.setState({ loading: true });
                            }}
                        >
                            <Text>Send response</Text>
                        </Button>
                    );
                }}
            </Mutation>
        );
    }

    private renderAttendanceSpinner(attendanceLimit: number) {
        if (this.state.spinnerDisabled) {
            return null;
        } else {
            return (
                <View>
                    <Text style={{ marginBottom: 5 }}>
                        Number of people attending (max {attendanceLimit.toString()}):
                    </Text>
                    <InputSpinner
                        disabled={this.state.spinnerDisabled}
                        max={attendanceLimit}
                        min={1}
                        step={1}
                        rounded={false}
                        editable={false}
                        showBorder={true}
                        color={'#3e525f'}
                        value={this.state.attendanceCount}
                        onChange={(num: number) => {
                            this.setState({ attendanceCount: num });
                        }}
                        style={{ width: '100%' }}
                    />
                </View>
            );
        }
    }

    private renderOwnerCard(ownerId: string) {
        return (
            <Query<API.GetUserInfoQuery>
                query={gql(queries.getUserInfo)}
                variables={{ userId: ownerId }}
            >
                {(result) => {
                    if (!result.data || !result.data.getUserInfo) {
                        return null;
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
                }}
            </Query>
        );
    }

    private renderRSVP(event: any, invite: any) {
        const list = ['Will attend', 'Cannot attend'];
        const rsvpDate = (new Date(event.rsvpDate)).toDateString();

        return (
            <Card style={{ padding: 15 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
                    RSVP
                </Text>
                <Text style={{ marginBottom: 5 }}>
                    Please respond by {rsvpDate}
                </Text>
                <ListViewSelect
                    list={list} onChange={async (value) => {
                        this.changeType(value);
                    }}
                    label={'Attendance'} value={this.state.responseType}
                />
                {this.renderAttendanceSpinner(invite.attendanceLimit)}
                <View
                    style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: 1,
                        marginTop: 10,
                    }}
                />
                <Input
                    placeholder="Enter an optional comment"
                    multiline={true}
                    style={{
                        color: 'black',
                        opacity: 1,
                        marginVertical: Platform.OS === 'ios' ? 7 : 0,
                    }}
                    value={this.state.comment}
                    disabled={false}
                    onChangeText={(e) => {
                        this.setState({ comment: e });
                    }}
                    placeholderTextColor="gray"
                />
                {this.renderRespondButton(event, invite)}
            </Card>
        );
    }

    public render() {
        const inviteId = this.props.navigation.state.params.inviteId;

        return (
            <Query<API.GetInviteInfoQuery>
                query={getInviteInfo}
                variables={{ inviteId }}
            >
                {({ data, error }) => {
                    if (error) {
                        console.log(error);
                        return (
                            <Text>{error}</Text>
                        );
                    }

                    if (!data || !data.getInviteInfo) {
                        return (<LoadingBlock />);
                    }

                    const invite = data.getInviteInfo.invite;
                    const event = data.getInviteInfo.event;
                    const date = (new Date(event.date)).toDateString();

                    console.log('InviteeId: ', invite.inviteeId);

                    if (!(invite.inviteeId === this.props.myUserId) && this.didUpdate === false) {
                        setImmediate(() => this.updateInviteeId());
                        this.didUpdate = true;
                    }

                    return (
                        <PlatformKeyboardAvoidingView style={{ flex: 1 }}>
                            <Content padder>
                                <Card style={{ padding: 15, backgroundColor: 'black' }}>
                                    <Text style={{ fontWeight: 'bold', marginBottom: 5, color: 'white' }}>
                                        Hi {invite.inviteeName}
                                    </Text>
                                    <Text style={{ color: 'white' }}>
                                        You've been invited to an awesome {event.type.toLowerCase()}!
                                    </Text>
                                </Card>
                                {this.renderCard(event.title, event.description)}
                                {this.renderOwnerCard(event.ownerId)}
                                {this.renderCard('Location', event.location)}
                                {this.renderCard('Date', date)}
                                {this.renderRSVP(event, invite)}
                            </Content>
                            {this.state.loading && <ActivityIndicator
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
                        </PlatformKeyboardAvoidingView>
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

export default connect(mapStateToProps)(InviteResponseScreen);
