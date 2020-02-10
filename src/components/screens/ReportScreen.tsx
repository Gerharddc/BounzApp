/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as navActions from 'actions/nav';
import * as API from 'API';
import Analytics from '@aws-amplify/analytics';
import PlatformKeyboardAvoidingView from 'components/PlatformKeyboardAvoidingView';
import gql from 'graphql-tag';
import * as mutations from 'graphql/mutations';
import { Button, Content, Input, Text } from 'native-base';
import * as React from 'react';
import { Mutation } from 'react-apollo';
import { ActivityIndicator, Platform } from 'react-native';
import { navigate } from 'utils/NavigationService';

interface IState {
    title: string;
    description: string;
    loading: boolean;
}

interface IProps {
    navigation: any;
}

export default class ReportScreen extends React.Component<IProps, IState> {
    componentDidMount() {
        const { contentType, contentId } = this.props.navigation.state.params;

        Analytics.record({
            name: 'viewReportScreen',
            attributes: { contentType },
        });
    }

    static navigationOptions = {
        title: 'Report',
    };

    state = {
        title: '',
        description: '',
        loading: false,
    };

    private renderReportButton() {
        const { contentType, contentId } = this.props.navigation.state.params;
        const { description, title, loading } = this.state;

        return (
            <Mutation<API.CreateContentReportMutation> mutation={gql(mutations.createContentReport)}>
                {(createContentReport) => (
                    <Button warning block
                        disabled={!description || !title || description === '' || title === '' || loading}
                        onPress={async () => {
                            this.setState({ loading: true });

                            try {
                                const input = {
                                    contentType,
                                    contentId,
                                    description: this.state.description,
                                    title: this.state.title,
                                };

                                await createContentReport({ variables: { input } });
                            } catch (e) {
                                alert(e.message);
                                console.log(e);
                            }

                            this.setState({ loading: false });
                            navigate(navActions.goBack());
                        }}>
                        <Text>Report</Text>
                    </Button>
                )}
            </Mutation>
        );
    }

    public render() {
        return (
            <PlatformKeyboardAvoidingView style={{ flex: 1 }}>
                <Content padder>
                    <Text style={{ color: 'darkgray', textAlign: 'justify' }}>
                        You are about to report content for breaching the Bounz terms of service.
                        Please indicate why you feel this is neccesary.
                </Text>
                    <Input
                        placeholder="Type your title here"
                        style={{ color: 'black', opacity: this.state.loading ? 0.5 : 1, borderBottomWidth: 1 }}
                        value={this.state.title}
                        disabled={this.state.loading}
                        onChangeText={(e) => this.setState({ title: e })}
                        placeholderTextColor="gray"
                    />
                    <Input
                        placeholder="Type your description here"
                        multiline={true}
                        style={{
                            color: 'black',
                            opacity: this.state.loading ? 0.5 : 1,
                            marginVertical: Platform.OS === 'ios' ? 7 : 0,
                        }}
                        value={this.state.description}
                        disabled={this.state.loading}
                        onChangeText={(e) => this.setState({ description: e })}
                        placeholderTextColor="gray"
                    />
                    {this.state.loading && <ActivityIndicator
                        style={{ width: '100%', height: '100%', position: 'absolute' }}
                        size="large"
                        color="blue"
                    />}
                    {this.renderReportButton()}
                </Content>
            </PlatformKeyboardAvoidingView>
        );
    }
}
