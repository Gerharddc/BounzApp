/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as NavActions from 'actions/nav';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { ActivityIndicator, AsyncStorage, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { navigate } from 'utils/NavigationService';

export default class EULAScreen extends React.Component {
    static navigationOptions = {
        title: 'EULA',
    };

    private acceptPage() {
        AsyncStorage.setItem('AcceptedEULA', 'true');

        navigate(NavActions.gotoLogin());
    }

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
            <View style={{ flex: 1 }}>
                <WebView
                    source={{ uri: 'https://www.bounz.io/eula.html' }}
                    style={{ width: '100%', flex: 1 }}
                    renderLoading={this.renderActivity}
                    startInLoadingState={true}
                />
                <TouchableOpacity
                    style={{ height: 50, backgroundColor: platform.brandPrimary,
                        alignItems: 'center', justifyContent: 'center' }}
                    onPress={this.acceptPage}
                >
                    <Text>Accept and use Bounz</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
