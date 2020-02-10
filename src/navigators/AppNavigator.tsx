/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import Auth from '@aws-amplify/auth';
import NotificationBody from 'components/NotificationBody';
import _ from 'lodash';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { ActivityIndicator, Platform, StatusBar, View } from 'react-native';
import { InAppNotificationProvider } from 'react-native-in-app-notification';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import LoginNavigator from './LoginNavigator';
import MainNavigtor from './MainNavigtor';

export default class AppNavigator extends React.Component {
    // tslint:disable-next-line:variable-name
    _isMounted = false;

    // tslint:disable-next-line:variable-name
    _initialAuthState = 'signIn';

    state = {
        authState: 'loading',
    };

    constructor(props: any) {
        super(props);

        this.handleStateChange = this.handleStateChange.bind(this);
        this.checkUser = this.checkUser.bind(this);
        this.onHubCapsule = this.onHubCapsule.bind(this);
        this.checkContact = this.checkContact.bind(this);

        //Hub.listen('auth', this.onHubCapsule);
    }

    componentDidMount() {
        this._isMounted = true;
        this.checkUser();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onHubCapsule(capsule: any) {
        const { channel, payload, source } = capsule;
        if (channel === 'auth') { this.checkUser(); }
    }

    handleStateChange(state: any, data: any) {
        // logger.debug('authenticator state change ' + state);
        if (!this._isMounted) { return; }
        if (state === this.state.authState) { return; }

        if (state === 'signedOut') { state = 'signIn'; }
        this.setState({ authState: state, authData: data, error: null });
        // if (this.props.onStateChange) { this.props.onStateChange(state, data); }

        /*switch (state) {
            case 'signedIn':
                Analytics.record('_userauth.sign_in');
                break;
            case 'signedUp':
                Analytics.record('_userauth.sign_up');
                break;
        }*/
    }

    async checkContact(user: any) {
        try {
            const data = await Auth.verifiedContact(user);
            // logger.debug('verified user attributes', data);
            if (!_.isEmpty(data.verified)) {
                this.handleStateChange('signedIn', user);
            } else {
                user = Object.assign(user, data);
                this.handleStateChange('verifyContact', user);
            }
        } catch (e) {
            // logger.warn('Failed to verify contact', e);
            this.handleStateChange('signedIn', user);
        }
    }

    checkUser() {
        const { authState } = this.state;
        const statesJumpToSignIn = ['signedIn', 'signedOut', 'loading'];
        Auth.currentAuthenticatedUser()
            .then((user) => {
                if (!this._isMounted) { return; }
                if (user) {
                    this.checkContact(user);
                } else {
                    if (statesJumpToSignIn.includes(authState)) {
                        this.handleStateChange(this._initialAuthState, null);
                    }
                }
            })
            .catch((err) => {
                if (!this._isMounted) { return; }
                // logger.debug(err);
                if (statesJumpToSignIn.includes(authState)) {
                    Auth.signOut()
                        .then(() => {
                            this.handleStateChange(this._initialAuthState, null);
                        })
                        // .catch((err) => this.error(err));
                        .catch((e) => console.log(e));
                }
            });
    }

    renderNavigator() {
        const authState = this.state.authState;
        console.log(authState);

        if (authState === 'signedIn') {
            return (<MainNavigtor />);
        } else if (authState === 'loading') {
            return (
                <View style={{ flex: 1 }}>
                    <StatusBar backgroundColor={platform.brandBackgroundDarker} />
                    <ActivityIndicator size="large" style={{ width: '100%', height: '100%' }} />
                </View>
            ); // TODO: show something nice
        } else {
            return (<LoginNavigator />);
        }
    }

    render() {
        return (
            <InAppNotificationProvider
                notificationBodyComponent={NotificationBody}
                backgroundColour={platform.brandPrimaryDarker}
                height={100 + (Platform.OS === 'ios' ? getStatusBarHeight() : 0)}
            >
                {this.renderNavigator()}
            </InAppNotificationProvider>
        );
    }
}
