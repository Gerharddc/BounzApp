/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as navActions from 'actions/nav';
import * as API from 'API';
import Analytics from '@aws-amplify/analytics';
import ListViewSelect from 'components/ListViewSelect';
import PlatformKeyboardAvoidingView from 'components/PlatformKeyboardAvoidingView';
import gql from 'graphql-tag';
import * as mutations from 'graphql/mutations';
import { Button, Content, Input, Item, Picker, Text, View } from 'native-base';
import * as React from 'react';
import { Mutation } from 'react-apollo';
import { ActivityIndicator, Platform } from 'react-native';
import { navigate } from 'utils/NavigationService';

interface IProps {
    navigation: any;
}

export default class FindUserScreen extends React.Component<IProps> {
    componentDidMount() {
        Analytics.record({
            name: 'viewDeleteAccountScreen',
        });
    }

    public static navigationOptions = {
        title: 'Delete Account Request',
    };

    state = {
        deleteReason: '',
        loading: false,
        option: true,
        alternateReason: '',
    };

    private renderDeleteButton() {
        const contentType = 'user';
        const contentId = this.props.navigation.state.params.userId;
        const { deleteReason, loading, alternateReason } = this.state;

        return (
            <Mutation<API.CreateContentReportMutation> mutation={gql(mutations.createContentReport)}>
                {(createContentReport) => (
                    <Button warning block
                        disabled={!deleteReason || deleteReason === '' || loading ||
                            ((deleteReason === 'Other reason') && (this.state.alternateReason === ''))}
                        onPress={async () => {
                            this.setState({ loading: true });
                            console.log('Inputreason: ', deleteReason);
                            try {
                                const input = {
                                    contentType,
                                    contentId,
                                    description: deleteReason,
                                    title: 'Delete request',
                                };
                                if (this.state.deleteReason === 'Other reason') {
                                    console.log('OtherDelete: ');
                                    input.description = alternateReason;
                                }
                                console.log('Input: ', input);
                                await createContentReport({ variables: { input } });
                            } catch (e) {
                                alert(e.message);
                                console.log(e);
                            }

                            this.setState({ loading: false });
                            navigate(navActions.goBack());
                        }}>
                        <Text>Delete</Text>
                    </Button>
                )}
            </Mutation>
        );
    }

    async onChange(value: string) {
        console.log('Value: ', value);
        if (value === 'Other reason') {
            await this.setState({ deleteReason: 'Other reason' });
            await this.setState({ alternateReason: '' });
            console.log('Other reason');
        } else {
            await this.setState({ deleteReason: value });
            console.log('Option');
        }
        console.log('DeleteReason: ', this.state.deleteReason);
    }

    public render() {
        const list = ['User is deceased', 'I do not enjoy the app', 'I have privacy concerns', 'Other reason'];
        return (
            <PlatformKeyboardAvoidingView style={{ flex: 1 }}>
                <Content padder>
                    <Text style={{ color: 'darkgray', marginBottom: 5 }}>
                        Submitting this request will propmt us to review it and subsequently
                        delete your account. Please pick a reason for wanting to delete
                        the account or state your own.
                    </Text>
                    <Text style={{ textAlign: 'justify' }}>
                        Reason for deleting:
                    </Text>
                    <ListViewSelect
                        list={list} onChange={async (value) => this.onChange(value)}
                        label={'Option'} value={this.state.deleteReason}
                    />
                    <View
                        style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: 1,
                        }}
                    />
                    <Input
                        placeholder="Enter alternate reason"
                        multiline={true}
                        style={{
                            color: 'black',
                            opacity: this.state.loading ? 0.5 : 1,
                            marginVertical: Platform.OS === 'ios' ? 7 : 0,
                        }}
                        value={this.state.alternateReason}
                        disabled={this.state.loading || !(this.state.deleteReason === 'Other reason')}
                        onChangeText={(e) => this.setState({ alternateReason: e })}
                        placeholderTextColor="gray"
                    />
                    {this.state.loading && <ActivityIndicator
                        style={{ width: '100%', height: '100%', position: 'absolute' }}
                        size="large"
                        color="blue"
                    />}
                    {this.renderDeleteButton()}
                </Content>
            </PlatformKeyboardAvoidingView>
        );
    }
}
