/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import Analytics from '@aws-amplify/analytics';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

export default class LeaderboardsScreen extends React.Component {
    componentDidMount() {
        Analytics.record({
            name: 'viewLeaderboardsScreen',
        });
    }

    static navigationOptions = {
        title: 'Leaderboards',
    };

    private renderActivity() {
        return (
            <ActivityIndicator
                color={platform.brandBackground}
                size="large"
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            />
        );
    }

    public render() {
        return (
            <WebView
                source={{ uri: 'https://www.bounz.io/leaderboards/index.html' }}
                style={{ width: '100%', height: '100%' }}
                renderLoading={this.renderActivity}
                startInLoadingState={true}
            />
        );
    }
}
