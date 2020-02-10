/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import DialogModal from 'components/modals/DialogModal';
import LoggingInModal from 'components/modals/LoggingInModal';
import PasswordModal from 'components/modals/PasswordModal';
import EULAScreen from 'components/screens/EULAScreen';
import ForgotPasswordScreen from 'components/screens/ForgotPasswordScreen';
import LoginScreen from 'components/screens/LoginScreen';
import PrivacyPolicyScreen from 'components/screens/PrivacyPolicyScreen';
import SignupScreen from 'components/screens/SignupScreen';
import StatusScreen from 'components/screens/StatusScreen';
import TermsScreen from 'components/screens/TermsScreen';

import { gotoEULA } from 'actions/nav';
import { CheckEULA } from 'logic/Login';
import { EnsureValidSystem } from 'logic/System';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { StatusBar, View } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { navigate, setTopLevelNavigator } from 'utils/NavigationService';

export const navigationOptions = {
    headerStyle: {
        backgroundColor: platform.brandPrimary,
    },
    headerTitleStyle: {
        fontFamily: platform.brandFontFamily,
        color: 'black',
    },
    headerTintColor: platform.brandBackground,
};

export const Navigator = createAppContainer(createStackNavigator({
    SystemStatus: {
        screen: StatusScreen,
    },
    Login: {
        screen: LoginScreen,
    },
    Signup: {
        screen: SignupScreen,
        navigationOptions,
    },
    PrivacyPolicy: {
        screen: PrivacyPolicyScreen,
        navigationOptions,
    },
    Terms: {
        screen: TermsScreen,
        navigationOptions,
    },
    EULA: {
        screen: EULAScreen,
        navigationOptions,
    },
    ForgotPassword: {
        screen: ForgotPasswordScreen,
        navigationOptions,
    },
}, { initialRouteName: 'Login' }));

interface IProps {
    dispatch: any;
}

class LoginNavigator extends React.Component<IProps> {
    async componentDidMount() {
        const accepted = await CheckEULA();
        if (!accepted) {
            navigate(gotoEULA());
        }

        await EnsureValidSystem();
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <DialogModal />
                <LoggingInModal />
                <PasswordModal />
                <StatusBar backgroundColor={platform.brandPrimaryDarker} />
                <Navigator ref={(ref: any) => setTopLevelNavigator(ref)} />
            </View>
        );
    }
}

function mapDispatchToProps(dispatch: any) {
    return { dispatch };
}

export default connect(undefined, mapDispatchToProps)(LoginNavigator);
