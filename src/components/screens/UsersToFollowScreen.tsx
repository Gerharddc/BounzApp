/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { gotoCourtsToJoin } from 'actions/nav';
import Auth from '@aws-amplify/auth';
import Analytics from '@aws-amplify/analytics';
import * as AWS from 'aws-sdk';
import UserCard from 'components/UserCard';
import { Text } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { ActivityIndicator, Button, FlatList, Platform, View } from 'react-native';
import system from 'system-exports';
import { navigate } from 'utils/NavigationService';

export default class UsersToFollowScreen extends React.Component {
    static navigationOptions = {
        title: 'Users to follow',
        headerRight: (
            <View style={{ paddingRight: Platform.OS === 'android' ? 5 : 0 }}>
                <Button title="Next" onPress={() => navigate(gotoCourtsToJoin())} color={platform.brandBackground} />
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
                Key: 'UsersToFollow.json',
            };

            const obj = await s3.getObject(params).promise();
            const file = JSON.parse(obj.Body!.toString('utf-8'));
            this.setState({ list: file.userIds });
        } catch (e) {
            console.log(e);
            alert(e.message);
        }
    }

    public componentDidMount() {
        this.getList();

        Analytics.record({
            name: 'viewUsersToFollowScreen',
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
                            <UserCard userId={item} />
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
                    Some cool users to follow as a start:
                </Text>
                {this.renderList()}
            </View>
        );
    }
}
