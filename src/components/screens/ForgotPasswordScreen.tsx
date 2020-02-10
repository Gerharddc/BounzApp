/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import Auth from '@aws-amplify/auth';
import Analytics from '@aws-amplify/analytics';
import { Button, Content, Input, Item, Label, Text } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { StatusBar } from 'react-native';
import { requestPassword } from 'utils/Prompt';

export default class ForgotPasswordScreen extends React.Component {
    componentDidMount() {
        Analytics.record({
            name: 'viewForgotPasswordScreen',
        });
    }

    static navigationOptions = {
        title: 'Forgot password',
    };

    state = {
        code: '',
        username: '',
    };

    private async sendCode() {
        try {
            const result = await Auth.forgotPassword(this.state.username.toLowerCase());
            console.log('forgot', result);
            alert('A verification code has been sent to your email address');
        } catch (e) {
            console.log(e);
            alert(e.message);
        }
    }

    private async changePassword() {
        try {
            const password = await requestPassword(false);

            if (!password.password) {
                return;
            }

            const result =
                await Auth.forgotPasswordSubmit(this.state.username.toLowerCase(), this.state.code, password.password);
            console.log('change', result);
            alert('Your password has been changed');
        } catch (e) {
            console.log(e);
            alert(e.message);
        }
    }

    public render() {
        return (
            <Content padder>
                <StatusBar backgroundColor={platform.brandPrimaryDarker} />
                <Item stackedLabel>
                    <Label>Username or email</Label>
                    <Input
                        onChangeText={(text) => this.setState({ username: text })}
                        placeholder="Enter username or email here" placeholderTextColor="gray"
                    />
                </Item>
                <Item stackedLabel>
                    <Label>Verification code</Label>
                    <Input
                        onChangeText={(text) => this.setState({ code: text })}
                        placeholder="Enter code here" placeholderTextColor="gray"
                    />
                </Item>
                <Button block disabled={this.state.username === ''} onPress={this.sendCode.bind(this)}>
                    <Text>Send new code</Text>
                </Button>
                <Button block
                    disabled={this.state.code === '' || this.state.username === ''}
                    onPress={this.changePassword.bind(this)}
                >
                    <Text>Change password</Text>
                </Button>
            </Content>
        );
    }
}
