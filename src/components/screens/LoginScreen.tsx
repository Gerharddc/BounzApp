/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as AuthActions from 'actions/auth';
import * as NavActions from 'actions/nav';
import PasswordModal from 'components/modals/PasswordModal';
import StyledKohana from 'components/StyledKohana';
import { LoginUser } from 'logic/Login';
import { Button, Text } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { Dimensions, Image, ScrollView, StatusBar, View } from 'react-native';
import { connect } from 'react-redux';
import { IAuthState } from 'reducers/auth';
import { IReduxState } from 'reducers/index';
import { Dispatch } from 'redux';
import { navigate } from 'utils/NavigationService';

interface ILoginPageProps {
    authState: IAuthState;
    dispatch: Dispatch<any>;
}

class LoginPage extends React.Component<ILoginPageProps> {
    static navigationOptions = {
        header: null,
    };

    private async loginWithCognito() {
        const { username, password } = this.props.authState;
        LoginUser(username, password);
    }

    private signUp() {
        navigate(NavActions.gotoSignup());
    }

    render() {
        const { authState, dispatch } = this.props;
        const { height, width } = Dimensions.get('window');

        // If we don't use a ScrollView then the keyboard doesn't close
        // when you tap outside an input

        return (
            <ScrollView
                style={{
                    backgroundColor: platform.brandBackground,
                    flex: 1,
                }}
                scrollEnabled={false}
                contentContainerStyle={{ alignItems: 'center', flexGrow: 1 }}
            >
                <View
                    style={{
                        backgroundColor: 'transparent', width: '100%', maxWidth: 500,
                        flex: 1, justifyContent: 'center', padding: 10,
                    }}
                >
                    <StatusBar backgroundColor={platform.brandBackgroundDarker} />
                    <View style={{ width: '100%', alignItems: 'center', marginBottom: 7 }}>
                        <Image
                            resizeMode="contain"
                            style={{ width: 125, height: 125 }}
                            source={require('../../../assets/img/logo.png')}
                        />
                        <Text style={{
                            fontSize: 30,
                            fontFamily: platform.brandFontFamily,
                            color: platform.brandPrimary,
                        }}>
                            Wanna Bounz?
                        </Text>
                    </View>
                    <StyledKohana
                        label="Username/Email" iconName="user" value={authState.username}
                        onChangeText={(e) => dispatch(AuthActions.setUsername(e))} keyboardType="email-address"
                    />
                    <StyledKohana
                        label="Password" iconName="key" value={authState.password}
                        onChangeText={(e) => dispatch(AuthActions.setPassword(e))} secureTextEntry={true}
                    />
                    <Button block onPress={this.loginWithCognito.bind(this)}>
                        <Text>Sign in</Text>
                    </Button>
                    <Button block onPress={this.signUp.bind(this)}>
                        <Text>Sign up</Text>
                    </Button>
                    <Button block onPress={() => navigate(NavActions.gotoForgotPassword())} warning>
                        <Text>Forgot password</Text>
                    </Button>
                </View>
                <Image
                    source={require('../../../assets/img/Tennis.jpg')}
                    style={{ width, height, position: 'absolute', right: 0, top: 0, opacity: 0.2, zIndex: -1 }}
                    resizeMode="cover"
                />
                <PasswordModal />
            </ScrollView>
        );
    }
}

function mapStateToProps(state: IReduxState) {
    return { authState: state.auth };
}

function mapDispatchToProps(dispatch: any) {
    return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
