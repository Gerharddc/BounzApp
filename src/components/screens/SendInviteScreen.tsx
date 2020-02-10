/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Herman Lombard
 */

import * as NavActions from 'actions/nav';
import * as API from 'API';
import { appSyncClient } from 'app';
import Analytics from '@aws-amplify/analytics';
import PlatformKeyboardAvoidingView from 'components/PlatformKeyboardAvoidingView';
import { Formik } from 'formik';
import gql from 'graphql-tag';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';
import * as _ from 'lodash';
import { Button, Content, Icon, Input, Label, Text, View } from 'native-base';
import * as React from 'react';
import { Mutation, Query } from 'react-apollo';
import { ActivityIndicator, FlatList, Keyboard, TouchableOpacity } from 'react-native';
import InputSpinner from 'react-native-input-spinner';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import { navigate } from 'utils/NavigationService';
import * as yup from 'yup';

const listEventResponses = gql(queries.listEventResponses);

type NameSetter = (name: string, surname: string) => void;

interface IProps {
    navigation: any;
    myUserId: string;
}

interface ISelectedUser {
    userId: string;
    username: string;
    name?: string;
    surname?: string;
}

interface IState {
    loading: boolean;
    selectedUser?: {
        userId: string;
        username: string;
        name: string | null;
        surname: string | null;
    };
}

const validationSchema = yup.object().shape({
    name: yup
        .string()
        .required()
        .label('Name'),
    surname: yup
        .string()
        .required()
        .label('Surname'),
});

class SendInviteScreen extends React.Component<IProps> {
    componentDidMount() {
        Analytics.record({
            name: 'viewSendInviteScreen',
        });
    }

    static navigationOptions = {
        title: 'Send invite',
    };

    state = {
        loading: false,
        selectedUser: undefined as ISelectedUser | undefined,
    };

    async handleSubmit(values: any, createInvite: any) {
        let updated = false;
        const inviteeId = this.state.selectedUser ? this.state.selectedUser.userId : null;

        if (inviteeId === this.props.myUserId) {
            alert('Cannot send invite to self');
            return null;
        }

        const input = {
            eventId: this.props.navigation.state.params.eventId,
            inviteeId,
            inviteeName: values.name,
            inviteeSurname: values.surname,
            attendanceLimit: values.attendanceLimit,
        };
        try {
            await createInvite({
                variables: { input },
                update: (proxy, { data }) => {
                    let newInvite;

                    if (updated) {
                        return;
                    }

                    const responseList = proxy.readQuery({
                        query: listEventResponses,
                        variables: { eventId: input.eventId },
                    }) as any;

                    if (data && data.createInvite) {
                        newInvite = {
                            response: null,
                            invite: data.createInvite,
                            __typename: 'RespondedInvite',
                        };
                    }

                    if (responseList && responseList.listEventResponses) {
                        responseList.listEventResponses.items.push(newInvite);
                    }

                    proxy.writeQuery({
                        query: listEventResponses,
                        variables: { eventId: input.eventId },
                        data: responseList,
                    });

                    updated = true;
                },
            });
        } catch (e) {
            console.log(e);
        }
        navigate(NavActions.goBack());
    }

    private renderRow({ item }: any, setName: NameSetter) {
        return (
            <TouchableOpacity
                style={{
                    height: '100%',
                    padding: 7,
                    borderRadius: 5,
                    marginRight: 5,
                    justifyContent: 'center',
                    backgroundColor: 'black',
                }}
                onPress={async () => {
                    this.setState({ loading: true });

                    const resp = await appSyncClient.query<API.GetUserRealName2Query>(
                        { query: gql(queries.getUserRealName2), variables: { userId: item.userId } });

                    const data = resp.data.getUserRealName2;

                    this.setState({
                        loading: false,
                        selectedUser: {
                            username: item.username,
                            userId: item.userId,
                            name: data ? data.name : null,
                            surname: data ? data.surname : null,
                        },
                    });

                    if (data) {
                        setName(data.name || '', data.surname || '');
                    }
                }}
            >
                <Text style={{ color: 'white' }}>
                    {`${item.name} (${item.username})`}
                </Text>
            </TouchableOpacity>
        );
    }

    private renderSuggestions(name: string | undefined, setName: NameSetter) {
        if (!name || name === '' || this.state.selectedUser) {
            return null;
        }

        return (
            <Query<API.SearchUsersQuery>
                query={gql(queries.searchUsers)}
                variables={{ searchTerm: name }}
                fetchPolicy="cache-and-network"
            >
                {({ data, loading }) => {
                    if (loading || !data || !data.searchUsers) {
                        return (<ActivityIndicator style={{ width: '100%', height: 50 }} />);
                    }

                    const list = data.searchUsers!.filter((item) => item.userId !== 'ghost');

                    if (list.length < 1) {
                        return null;
                    }

                    return (
                        <FlatList
                            keyboardShouldPersistTaps={'always'}
                            horizontal
                            data={list}
                            keyExtractor={(item) => item.userId}
                            renderItem={(item) => this.renderRow(item, setName)}
                            style={{ height: 40, marginTop: 10, width: '100%' }}
                            contentContainerStyle={{ paddingHorizontal: 10 }}
                        />
                    );
                }}
            </Query>
        );
    }

    private renderSelected() {
        if (!this.state.selectedUser) {
            return null;
        }

        return (
            <View style={{
                width: '100%',
                backgroundColor: 'black',
                padding: 10,
                height: 50,
                alignItems: 'center',
                flexDirection: 'row',
            }}>
                <Text style={{ color: 'white' }}>{this.state.selectedUser.username}</Text>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={() => this.setState({ selectedUser: undefined })}>
                    <Icon name="close" style={{ color: 'white' }} />
                </TouchableOpacity>
            </View>
        );
    }

    private renderForm(createInvite: any) {
        return (
            <Formik
                initialValues={{
                    name: '',
                    surname: '',
                    attendanceLimit: 1,
                }}
                onSubmit={async (values, actions) => {
                    Keyboard.dismiss();
                    await this.handleSubmit(values, createInvite);
                    actions.setSubmitting(false);
                    this.setState({selectedUser: null});
                    actions.resetForm();
                }}
                validationSchema={validationSchema}
            >
                {(formikProps) => (
                    <PlatformKeyboardAvoidingView style={{ flex: 1 }}>
                        <Content>
                            {this.renderSuggestions(formikProps.values.name, (name, surname) => {
                                formikProps.setFieldValue('name', name);
                                formikProps.setFieldValue('surname', surname);
                            })}
                            {this.renderSelected()}
                            <View style={{ padding: 10 }}>
                                <Label>Name: {formikProps.errors.name &&
                                    ('(' + formikProps.errors.name + ')')}</Label>
                                <Input
                                    onChangeText={formikProps.handleChange('name')}
                                    placeholder="Enter first name"
                                    value={formikProps.values.name}
                                />
                                <View
                                    style={{
                                        borderBottomColor: 'black',
                                        borderBottomWidth: 1,
                                    }}
                                />
                                <View
                                    style={{
                                        borderBottomColor: 'black',
                                        borderBottomWidth: 1,
                                        paddingTop: 10,
                                    }}
                                >
                                    <Label>Surname: {formikProps.errors.surname &&
                                        ('(' + formikProps.errors.surname + ')')}</Label>
                                    <Input
                                        onChangeText={formikProps.handleChange('surname')}
                                        placeholder="Enter last name"
                                        value={formikProps.values.surname}
                                    />
                                </View>
                                <View style={{ paddingTop: 10 }}>
                                    <Label>Attendance limit:</Label>
                                </View>
                                <View style={{ padding: 10 }}>
                                    <InputSpinner
                                        disabled={false}
                                        max={100}
                                        min={1}
                                        step={1}
                                        rounded={false}
                                        editable={false}
                                        showBorder={true}
                                        color={'#3e525f'}
                                        value={formikProps.values.attendanceLimit}
                                        onChange={formikProps.handleChange('attendanceLimit')}
                                        style={{ width: '100%' }}
                                    />
                                </View>
                                <Button onPress={formikProps.handleSubmit}
                                    block
                                    disabled={!(!formikProps.errors.name && !formikProps.errors.surname)}>
                                    <Text>Submit</Text>
                                </Button>
                            </View>
                        </Content>
                        {(this.state.loading || formikProps.isSubmitting) && <ActivityIndicator
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
                )}
            </Formik>
        );
    }

    public render() {
        return (
            <Mutation<API.CreateInviteMutation> mutation={gql(mutations.createInvite)}>
                {(createInvite) => {
                    return (
                        this.renderForm(createInvite)
                    );
                }}
            </Mutation>
        );
    }
}

function mapStateToProps(state: IReduxState) {
    return { myUserId: state.users.myUserId };
}

export default connect(mapStateToProps)(SendInviteScreen);
