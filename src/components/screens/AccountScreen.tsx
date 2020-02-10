/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Herman Lombard
 */

import * as NavActions from 'actions/nav';
import * as API from 'API';
import { appSyncClient } from 'app';
import Auth from '@aws-amplify/auth';
import Analytics from '@aws-amplify/analytics';
import PlatformKeyboardAvoidingView from 'components/PlatformKeyboardAvoidingView';
import ValidatedInput from 'components/ValidatedInput';
import gql from 'graphql-tag';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';
import { DoesEmailExist } from 'logic/Login';
import { DoesUsernameExist } from 'logic/Login';
import { UpdateEndpoint } from 'logic/UserInfo';
import { Button, Content, Text, View } from 'native-base';
import * as React from 'react';
import { Mutation } from 'react-apollo';
import { ActivityIndicator, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import twitter from 'twitter-text';
import { navigate } from 'utils/NavigationService';
import { requestPassword } from 'utils/Prompt';

const isNotEmail = (value: string) => isEmail(value) ? undefined : 'May not be email';
const validUserName = (value: string) => twitter.isValidUsername('@' + value) ? undefined : 'Invalid characters';
const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : 'Not a valid address';

const url = 'https://vqotjnz0kh.execute-api.us-east-1.amazonaws.com/dev2/deleteUserEndpoints';

interface IProps {
    myUserId: any;
}

class AccountScreen extends React.Component<IProps> {

    componentDidMount() {
        Analytics.record({
            name: 'viewAccountScreen',
        });
        this.getUser();
    }

    static navigationOptions = {
        title: 'Account',
    };

    state = {
        myUserId: '',
        updatingUsername: false,
        updatingPassword: false,
        name: '',
        validName: true,
        dirtyName: false,
        nameError: '',
        surname: '',
        dirtySurname: false,
        validSurname: true,
        surnameError: '',
        username: '',
        dirtyUsername: false,
        validUsername: true,
        usernameError: '',
        email: '',
        dirtyEmail: false,
        validEmail: true,
        emailError: '',
        allValid: true,
        saving: false,
        loading: false,
    };

    private renderChangePassword() {
        return (
            <Button block iconLeft disabled={this.state.updatingPassword}
                onPress={async () => {
                    const { password, oldPassword } = await requestPassword(true);

                    if (!password || !oldPassword) {
                        return;
                    }

                    this.setState({ updatingPassword: true });
                    try {
                        const user = await Auth.currentUserPoolUser();
                        await Auth.changePassword(user, oldPassword, password);
                    } catch (e) {
                        console.log(e);
                        alert(e.message);
                    }
                    this.setState({ updatingPassword: false });
                }}
            >
                <Text>Change password</Text>
                {this.state.updatingPassword && <ActivityIndicator
                    style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1 }}
                    color="blue"
                />}
            </Button>
        );
    }

    async changeName(value: string) {
        this.setState({ name: value });
        this.setState({ dirtyName: true });
        if (value === '') {
            await this.setState({ validName: false });
            this.setState({ nameError: 'May not be empty' });
        } else {
            await this.setState({ validName: true });
            this.setState({ nameError: '' });
        }
        await this.checkValid();
    }

    async changeSurname(value: string) {
        this.setState({ surname: value });
        this.setState({ dirtySurname: true });
        if (value === '') {
            await this.setState({ validSurname: false });
            this.setState({ surnameError: 'May not be empty' });
        } else {
            await this.setState({ validSurname: true });
            this.setState({ surnameError: '' });
        }
        await this.checkValid();
    }

    async checkValid() {
        if ((this.state.validName && this.state.validSurname) && this.state.validUsername) {
            this.setState({ allValid: true });
        } else {
            this.setState({ allValid: false });
        }
        console.log('Valid: ', this.state.allValid);
    }

    async getUsername(userId: string) {
        const res = await appSyncClient.query<API.GetUserInfoQuery>({
            query: gql(queries.getUserInfo),
            variables: { userId },
        });

        if (res.data.getUserInfo) {
            console.log('Res: ', res.data.getUserInfo);
            return res.data.getUserInfo.username;
        } else {
            return undefined;
        }
    }

    async changeEmail(value: string) {
        this.setState({ email: value });
        this.setState({ dirtyEmail: true });
        if (value === '') {
            await this.setState({ validEmail: false });
            this.setState({ emailError: 'May not be empty' });
        } else {
            if (!(isEmail(value) === undefined)) {
                await this.setState({ validEmail: false });
                this.setState({ emailError: 'Invalid email' });
            } else {
                this.setState({ emailError: 'Checking' });
                await this.setState({ validEmail: false });
                await this.setState({ allValid: false });
                const taken = await DoesEmailExist(value);
                if (taken === true) {
                    await this.setState({ validEmail: false });
                    this.setState({ emailError: 'Already taken' });
                } else {
                    await this.setState({ validEmail: true });
                    this.setState({ emailError: '' });
                }
            }
        }
        this.checkValid();
    }

    async changeUsername(value: string) {
        this.setState({ username: value });
        this.setState({ dirtyUsername: true });
        if (value === '') {
            await this.setState({ validUsername: false });
            this.setState({ usernameError: 'May not be empty' });
        } else {
            if (!(isNotEmail(value) === undefined)) {
                await this.setState({ validUsername: false });
                this.setState({ usernameError: 'May not be an email' });
            } else {
                if (!(validUserName(value) === undefined)) {
                    await this.setState({ validUsername: false });
                    this.setState({ usernameError: 'Contains invalid characters' });
                } else {
                    this.setState({ usernameError: 'Checking' });
                    await this.setState({ validUserName: false });
                    await this.setState({ allValid: false });
                    const taken = await DoesUsernameExist(value);
                    console.log(taken);
                    if (taken) {
                        await this.setState({ validUsername: false });
                        this.setState({ usernameError: 'Taken' });
                    } else {
                        await this.setState({ validUsername: true });
                        this.setState({ usernameError: '' });
                    }
                }
            }
        }
        this.checkValid();
    }

    async getUser() {
        this.setState({ loading: true });
        const user = await Auth.currentAuthenticatedUser({ bypassCache: true });
        const { attributes } = user;
        const username = await this.getUsername(user.username);
        await this.setState({ myUserId: user.username });
        this.setState({ name: attributes.name });
        this.setState({ surname: attributes.family_name });
        this.setState({ username });
        this.setState({ email: attributes.email });
        this.setState({ loading: false });
    }

    public render() {
        if (this.state.loading) {
            return (
                <ActivityIndicator
                    size="large"
                    color="blue"
                    style={{ width: '100%', height: '100%', position: 'absolute' }}
                />);
        } else {
            return (
                <PlatformKeyboardAvoidingView style={{ flex: 1 }}>
                    <Content padder>
                        <View style={{ paddingBottom: 10 }}>
                            <ValidatedInput
                                valid={this.state.validName}
                                invalid={!this.state.validName}
                                dirty={this.state.dirtyName}
                                label={'First name'}
                                value={this.state.name}
                                onChange={async (value) => await this.changeName(value)}
                                onBlur={() => null}
                                onFocus={() => null}
                                error={this.state.nameError}
                            />
                        </View>
                        <View style={{ paddingBottom: 10 }}>
                            <ValidatedInput
                                valid={this.state.validSurname}
                                invalid={!this.state.validSurname}
                                dirty={this.state.dirtySurname}
                                label={'Surname'}
                                value={this.state.surname}
                                onChange={async (value) => await this.changeSurname(value)}
                                onBlur={() => null}
                                onFocus={() => null}
                                error={this.state.surnameError}
                            />
                        </View>
                        {/*<View style={{ paddingBottom: 10 }}>
                        <ValidatedInput
                            valid={this.state.validEmail}
                            invalid={!this.state.validEmail}
                            dirty={this.state.dirtyEmail}
                            label={'Email'}
                            value={this.state.email}
                            onChange={async (value) => await this.changeEmail(value)}
                            onBlur={() => null}
                            onFocus={() => null}
                            email={true}
                            error={this.state.emailError}
            /></View> */}
                        <View style={{ paddingBottom: 10 }}>
                            <ValidatedInput
                                valid={this.state.validUsername}
                                invalid={!this.state.validUsername}
                                dirty={this.state.dirtyUsername}
                                label={'Username'}
                                value={this.state.username}
                                onChange={async (value) => await this.changeUsername(value)}
                                onBlur={() => null}
                                onFocus={() => null}
                                error={this.state.usernameError}
                            /></View>
                        {this.renderChangePassword()}
                        <Mutation<API.UpdateUserRealNameMutation> mutation={gql(mutations.updateUserRealName)}>
                            {(updateUserRealName) => (
                                <Mutation<API.UpdateUsernameMutation> mutation={gql(mutations.updateUsername)}>
                                    {(updateUsername) => (
                                        <Button block disabled={(!this.state.allValid) || this.state.saving ||
                                            !((this.state.dirtyName || this.state.dirtySurname)
                                                || this.state.dirtyUsername)}
                                            onPress={async () => {
                                                Keyboard.dismiss();
                                                this.setState({ saving: true });
                                                const user = await Auth.currentAuthenticatedUser();
                                                const input1 = {
                                                    userId: user.username,
                                                    name: this.state.name,
                                                    family_name: this.state.surname,
                                                };
                                                await updateUserRealName({
                                                    variables: { input: input1 },
                                                    update: (proxy, { data }) => {
                                                        if (!data || !data.updateUserRealName) {
                                                            return null;
                                                        }

                                                        const userRealName = proxy.readQuery({
                                                            query: gql(queries.getUserRealName),
                                                            variables: { userId: user.username },
                                                        });

                                                        if (!userRealName || !userRealName.getUserRealName) {
                                                            return;
                                                        }

                                                        userRealName.getUserRealName = this.state.name +
                                                            ' ' + this.state.surname;

                                                        proxy.writeQuery({
                                                            query: gql(queries.getUserRealName),
                                                            variables: { userId: user.username },
                                                            data: userRealName,
                                                        });
                                                    },
                                                });
                                                const username = this.state.username;
                                                const input2 = { userId: user.username, username };
                                                await updateUsername({
                                                    variables: { input: input2 },
                                                    update: (proxy, { data }) => {
                                                        if (!data || !data.updateUsername) {
                                                            return null;
                                                        }

                                                        const userInfo = proxy.readQuery({
                                                            query: gql(queries.getUserInfo),
                                                            variables: { userId: user.username },
                                                        });

                                                        if (!userInfo || !userInfo.getUserInfo) {
                                                            return;
                                                        }

                                                        userInfo.getUserInfo.username = this.state.username;

                                                        proxy.writeQuery({
                                                            query: gql(queries.getUserInfo),
                                                            variables: { userId: user.username },
                                                            data: userInfo,
                                                        });
                                                    },
                                                });
                                                const result = await Auth.updateUserAttributes(user, {
                                                    family_name: this.state.surname,
                                                    name: this.state.name,
                                                });
                                                console.log('result: ', result);
                                                this.setState({ dirtyName: false });
                                                this.setState({ dirtySurname: false });
                                                this.setState({ dirtyEmail: false });
                                                this.setState({ dirtyUsername: false });
                                                this.setState({ saving: false });
                                                if (!(result === 'SUCCESS')) {
                                                    this.getUser();
                                                    alert('Failed to save changes');
                                                }
                                            }}>
                                            <Text>Save changes</Text>
                                        </Button>

                                    )}
                                </Mutation>
                            )}
                        </Mutation>
                        <Button info block disabled={false}
                            onPress={async () => {
                                try {
                                    const h = {
                                        Authorization: `${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
                                    };
                                    const res = await fetch(url, { method: 'GET', headers: h });
                                    const result = JSON.parse(await res.text());

                                    if (!result) {
                                        throw new Error('Invalid server response');
                                    }

                                    await UpdateEndpoint();
                                    alert('Endpoint updated');
                                } catch (e) {
                                    alert(JSON.stringify(e));
                                }
                            }}>
                            <Text>Reset push notifications</Text>
                        </Button>
                        <Button danger block disabled={false}
                            onPress={async () => {
                                navigate(NavActions.gotoDeleteAccount(this.props.myUserId));
                            }}>
                            <Text>Request to delete account</Text>
                        </Button>
                    </Content>
                    {this.state.saving && <ActivityIndicator
                        size="large"
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            position: 'absolute',
                            zIndex: 1,
                        }}
                    />}
                </PlatformKeyboardAvoidingView>
            );
        }
    }
}

function mapStateToProps(state: IReduxState) {
    return {
        myUserId: state.users.myUserId,
    };
}

export default connect(mapStateToProps)(AccountScreen);
