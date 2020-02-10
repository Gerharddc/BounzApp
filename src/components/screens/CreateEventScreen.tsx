/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Herman Lombard
 */

import * as NavActions from 'actions/nav';
import * as API from 'API';
import { OperationVariables } from 'apollo-client';
import Analytics from '@aws-amplify/analytics';
import DatePicker from 'components/DatePicker';
import ListViewSelect from 'components/ListViewSelect';
import PlatformKeyboardAvoidingView from 'components/PlatformKeyboardAvoidingView';
import { Formik } from 'formik';
import gql from 'graphql-tag';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';
import { Button, Content, Input, Label, Text, View } from 'native-base';
import * as React from 'react';
import { Mutation, MutationFn } from 'react-apollo';
import { ActivityIndicator, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import { navigate } from 'utils/NavigationService';

const listUserEvents = gql(queries.listUserEvents);

interface IProps {
    myUserId: string;
}

class CreateEventScreen extends React.Component<IProps> {
    componentDidMount() {
        Analytics.record({
            name: 'viewCreateEventScreen',
        });
    }

    static navigationOptions = {
        title: 'Create event',
    };

    state = {
        loading: false,
    };

    async handleSubmit(values: any, createEvent: MutationFn<API.CreateEventMutation, OperationVariables>) {
        this.setState({ loading: true });

        const input = {
            title: values.title,
            type: values.type,
            description: values.description,
            location: values.location,
            ownerId: this.props.myUserId,
            date: values.date,
            rsvpDate: values.rsvpDate,
        };

        let updated = false;

        await createEvent({
            variables: { input },
            update: (proxy, { data }) => {
                if (updated) {
                    return;
                } else {
                    updated = true;
                }

                if (!data || !data.createEvent) {
                    return null;
                }

                try {
                    const userEvents = proxy.readQuery({
                        query: listUserEvents,
                        variables: { ownerId: this.props.myUserId },
                    }) as any;

                    if (!userEvents || !userEvents.listUserEvents) {
                        return;
                    }

                    userEvents.listUserEvents.items.push(data.createEvent);

                    proxy.writeQuery({
                        query: listUserEvents,
                        variables: { onwerId: this.props.myUserId },
                        data: userEvents,
                    });
                } catch (e) {
                    console.log(e);
                }
            },
        });

        this.setState({ loading: false });
        navigate(NavActions.goBack());
    }

    public render() {
        return (
            <Mutation<API.CreateEventMutation> mutation={gql(mutations.createEvent)}>
                {(createEvent) => {
                    return (
                        this.renderForm(createEvent)
                    );
                }}
            </Mutation>
        );
    }

    private validateFields(values: any, currentDate: Date) {
        const minDate = currentDate.toDateString() + ' ' + currentDate.toString().substr(11, 5);
        const errors = {} as any;

        if (!values.title) {
            errors.title = 'Required field';
        }

        if (!values.type) {
            errors.type = 'Required field';
        }

        if (!values.description) {
            errors.description = 'Required field';
        }

        if (!values.location) {
            errors.location = 'Required field';
        }

        if (values.date < currentDate) {
            errors.date = 'Must be later than ' + minDate;
        }

        const eventDate = values.date.toDateString() + ' ' + values.date.toString().substr(11, 5);

        if (values.rsvpDate < currentDate) {
            errors.rsvpDate = 'Must be later than ' + minDate;
        }

        if (values.rsvpDate > values.date) {
            errors.rsvpDate = 'Must be earlier than ' + eventDate;
        }

        return errors;
    }

    private renderForm(createEvent: any) {
        const list = ['Party', 'Conference', 'Wedding', 'Sport'];
        const currentDate = new Date();

        return (
            <Formik
                initialValues={{
                    title: '',
                    type: '',
                    description: '',
                    location: '',
                    date: (new Date()),
                    rsvpDate: (new Date()),
                    rsvpTime: (new Date()),
                }}
                onSubmit={(values, actions) => {
                    actions.setSubmitting(true);
                    console.log('Values:', values);
                    Keyboard.dismiss();
                    actions.setSubmitting(false);
                    this.handleSubmit(values, createEvent);
                }}
                validate={(values) => {
                    let errors = {};
                    errors = this.validateFields(values, currentDate);
                    return errors;
                }}
            >
                {(formikProps) => (
                    <PlatformKeyboardAvoidingView style={{ flex: 1 }}>
                        <Content padder >
                            <View
                                style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: 1,
                                }}
                            >
                                <Label>Title: {formikProps.errors.title &&
                                    ('(' + formikProps.errors.title + ')')}</Label>
                                <Input
                                    onChangeText={formikProps.handleChange('title')}
                                    placeholder="Enter title"
                                    value={formikProps.values.title}
                                />
                            </View>
                            <View
                                style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: 1,
                                    paddingTop: 10,
                                    paddingBottom: 10,
                                }}
                            >
                                <Label>Type: {formikProps.errors.type &&
                                    ('(' + formikProps.errors.type + ')')}</Label>
                                <ListViewSelect
                                    list={list} onChange={formikProps.handleChange('type')}
                                    label={'Option'} value={formikProps.values.type}
                                />
                            </View>
                            <View
                                style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: 1,
                                    paddingTop: 10,
                                }}
                            >
                                <Label>Description: {formikProps.errors.description &&
                                    ('(' + formikProps.errors.description + ')')}</Label>
                                <Input
                                    onChangeText={formikProps.handleChange('description')}
                                    placeholder="Enter description"
                                    value={formikProps.values.description}
                                />
                            </View>
                            <View
                                style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: 1,
                                    paddingTop: 10,
                                    marginBottom: 10,
                                }}
                            >
                                <Label>Location: {formikProps.errors.location &&
                                    ('(' + formikProps.errors.location + ')')}</Label>
                                <Input
                                    onChangeText={formikProps.handleChange('location')}
                                    placeholder="Enter location"
                                    value={formikProps.values.location}
                                />
                            </View>
                            <DatePicker
                                label={'Event date'} invalid={!!formikProps.errors.date}
                                onChange={formikProps.handleChange('date')}
                                error={formikProps.errors.date || ''} value={formikProps.values.date}
                                dirty={formikProps.dirty} mode={'datetime'}
                            />
                            <DatePicker
                                label={'RSVP date'} invalid={!!formikProps.errors.rsvpDate}
                                onChange={formikProps.handleChange('rsvpDate')}
                                error={formikProps.errors.rsvpDate || ''} value={formikProps.values.rsvpDate}
                                dirty={formikProps.dirty} mode={'datetime'}
                            />
                            <Button onPress={() => {
                                formikProps.handleSubmit();
                                console.log('Submitting event');
                            }}
                                block
                                disabled={!(!formikProps.errors.title && !formikProps.errors.type
                                    && !formikProps.errors.description && !formikProps.errors.location
                                    && !formikProps.errors.date && !formikProps.errors.rsvpDate) ||
                                    !formikProps.dirty}>
                                <Text>Submit</Text>
                            </Button>
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
                )}
            </Formik>
        );
    }
}

function mapStateToProps(state: IReduxState) {
    return {
        myUserId: state.users.myUserId,
    };
}

export default connect(mapStateToProps)(CreateEventScreen);
