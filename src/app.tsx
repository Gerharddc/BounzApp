/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import Auth from '@aws-amplify/auth';
import PushNotification from '@aws-amplify/pushnotification';
import AWSAppSyncClient, { AUTH_TYPE, defaultDataIdFromObject } from 'aws-appsync';
import { Rehydrated } from 'aws-appsync-react';
import * as AWS from 'aws-sdk';
import { StyleProvider } from 'native-base';
import getTheme from 'native-base-theme/components';
import AppNavigator from 'navigators/AppNavigator';
import { SetStartDeeplink } from 'navigators/MainNavigtor';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import { AsyncStorage, Linking, NativeModules, Platform, PushNotificationIOS, View } from 'react-native';
import { Provider } from 'react-redux';
import AppReducer from 'reducers';
import { createStore } from 'redux';
import system from 'system-exports';

AWS.config.region = 'us-east-1';

// TODO: use secureCognitoStorage

Auth.configure({
    Auth: {
        region: system.aws_project_region,
        userPoolId: system.aws_user_pools_id,
        userPoolWebClientId: system.aws_user_pools_web_client_id,
        identityPoolId: system.aws_cognito_identity_pool_id,
        // storage: secureCognitoStorage,
    },
});

PushNotification.onRegister(async (token: any) => {
    console.log('token', token);
    await AsyncStorage.setItem('@Bounz:deviceToken', token);
});

if (Platform.OS === 'ios') {
    PushNotificationIOS.getInitialNotification().then((notification: any) => {
        if (notification) {
            const deeplink = notification._data.data.pinpoint.deeplink;
            SetStartDeeplink(deeplink);
        }
    });
} else {
    PushNotification.onNotificationOpened(async (notification: any) => {
        const deeplink = notification['pinpoint.deeplink'];
        if (deeplink) {
            // Opening the link here has no effect on a cold start so we store it as well
            SetStartDeeplink(deeplink);
            await Linking.openURL(deeplink);
        }
    });
}

PushNotification.configure({
    appId: system.aws_mobile_analytics_app_id,
});

export const appSyncClient = new AWSAppSyncClient({
    url: system.aws_appsync_graphqlEndpoint,
    region: system.aws_project_region,
    auth: {
        type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
        jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken(),
    },
    cacheOptions: {
        dataIdFromObject: (object) => {
            const obj = object as any;

            switch (object.__typename) {
                case 'UserInfo':
                    return obj.userId;
                case 'SentPost':
                    return obj.creatorId + ';' + obj.postedDate;
                case 'ReceivedPost':
                    return obj.receiverId + ';' + obj.postId;
                case 'Comment':
                    return obj.postId + ';' + obj.commentDate;
                case 'Message':
                    return obj.threadId + ';' + obj.messageDate;
                case 'Bounz':
                    return obj.bounzerId + ';' + obj.postId;
                case 'BlockedUser':
                    return obj.blockerId + ';' + obj.blockeeId;
                case 'Follower':
                    return obj.followerId + ';' + obj.followeeId;
                case 'CourtMember':
                    return obj.courtId + ';' + obj.memberId;
                case 'CourtOwner':
                    return obj.courtId + ';' + obj.ownerId;
                case 'CourtInfo':
                    return obj.courtId;
                case 'SearchedUser':
                    return obj.userId;
                case 'IgnoredCourt':
                    return obj.courtId + ';' + obj.ignorerId;
                case 'UserEvent':
                    return obj.eventId;
                default:
                    return defaultDataIdFromObject(obj);
            }
        },
    },
    // disableOffline: true,
});

export const store = createStore(
    AppReducer,
);

export default class App extends React.Component {
    public componentDidMount() {
        /*if (Platform.OS === 'android') {
            // If the splash layer is cleared to early it can cause flickering during launch
            setTimeout(NativeModules.SplashModule.clearBackground, 1000);
        }*/
        // NativeModules.SplashModule.clearBackground();
    }

    public render() {
        return (
            <StyleProvider style={getTheme()}>
                <Provider store={store}>
                    <ApolloProvider client={appSyncClient as any}>
                        <Rehydrated>
                            <AppNavigator/>
                        </Rehydrated>
                    </ApolloProvider>
                </Provider>
            </StyleProvider>
        );
    }
}
