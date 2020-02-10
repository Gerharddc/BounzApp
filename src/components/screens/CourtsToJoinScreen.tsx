/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { startAtFlowTab } from 'actions/nav';
import * as API from 'API';
import Auth from '@aws-amplify/auth';
import Analytics from '@aws-amplify/analytics';
import * as AWS from 'aws-sdk';
import CourtCard from 'components/CourtCard';
import gql from 'graphql-tag';
import * as queries from 'graphql/queries';
import { Text } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { Query } from 'react-apollo';
import { ActivityIndicator, Button, FlatList, Platform, View } from 'react-native';
import system from 'system-exports';
import { navigate } from 'utils/NavigationService';

export default class CourtsToJoinScreen extends React.Component {
    static navigationOptions = {
        title: 'Courts to join',
        headerRight: (
            <View style={{ paddingRight: Platform.OS === 'android' ? 5 : 0 }}>
                <Button title="Done" onPress={() => navigate(startAtFlowTab())} color={platform.brandBackground} />
            </View>
        ),
    };

    state = {
        list: undefined,
    };

    private async getList() {
        try {
            const creds = await Auth.currentUserCredentials();
            AWS.config.credentials = creds;

            const s3 = new AWS.S3();
            const params = {
                Bucket: system.misc_files_bucket,
                Key: 'CourtsToJoin.json',
            };

            const obj = await s3.getObject(params).promise();
            const file = JSON.parse(obj.Body!.toString('utf-8'));
            this.setState({ list: file.courtIds });
        } catch (e) {
            console.log(e);
            alert(e.message);
        }
    }

    public componentDidMount() {
        this.getList();

        Analytics.record({
            name: 'viewCourtsToJoinScreen',
        });
    }

    private renderList() {
        if (!this.state.list) {
            return (
                <ActivityIndicator size="large" style={{ flex: 1 }} />
            );
        } else {
            return (
                <FlatList
                    data={this.state.list!}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 10 }}
                    keyExtractor={(item: string) => item}
                    renderItem={({ item }) => {
                        return (
                            <Query<API.GetCourtInfoQuery>
                                query={gql(queries.getCourtInfo)}
                                variables={{ courtId: item }}
                            >
                                {({ data }) => {
                                    if (!data || !data.getCourtInfo) {
                                        return (
                                            <ActivityIndicator style={{ width: '100%', padding: 10 }}/>
                                        );
                                    }

                                    return (
                                        <CourtCard court={data.getCourtInfo} />
                                    );
                                }}
                            </Query>
                        );
                    }}
                />
            );
        }
    }

    public render() {
        return (
            <View style={{ flex: 1, padding: 10 }}>
                <Text style={{ color: 'black', marginBottom: 5, textAlign: 'center' }}>
                    Some cool courts to join as a start:
                </Text>
                {this.renderList()}
            </View>
        );
    }
}
