/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import Auth from '@aws-amplify/auth';
import * as AuthActions from 'actions/auth';
import { setBusy, unsetBusy } from 'actions/dialog';
import { finishLogout } from 'actions/login';
import * as API from 'api';
import { appSyncClient, store } from 'app';
import * as AWS from 'aws-sdk';
import dateformat from 'dateformat';
import gql from 'graphql-tag';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';
import * as querystring from 'query-string';
import { AsyncStorage } from 'react-native';
import system from 'system-exports';
import { requestPassword, requestUsername, showErrorDialog } from 'utils/Prompt';
import uuidv4 from 'uuid/v4';
import SecureCognitoStorage from './SecureCognitoStorage';

export const secureCognitoStorage = new SecureCognitoStorage();

/*Auth.configure({
    Auth: {
        region: aws_exports.aws_project_region,
        userPoolId: aws_exports.aws_user_pools_id,
        userPoolWebClientId: aws_exports.aws_user_pools_web_client_id,
        identityPoolId: aws_exports.aws_cognito_identity_pool_id,
        storage: secureCognitoStorage,
    },
});*/

export type Creds = AWS.CognitoIdentityCredentials;

export function CheckEULA() {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('AcceptedEULA').then((value) => {
            resolve(value === 'true');
        });
    });
}

async function getUserInfo(userId: string) {
    const { data } = await appSyncClient.query<API.GetUserInfoQuery>(
        { query: gql(queries.getUserInfo), variables: { userId } },
    );

    if (data && data.getUserInfo) {
        return data.getUserInfo;
    } else {
        return undefined;
    }
}

async function createUserInfo(userId: string, username: string) {
    const input = { userId, username };

    const { data } = await appSyncClient.mutate<API.CreateUserInfoMutation>(
        { mutation: gql(mutations.createUserInfo), variables: { input } },
    );

    console.log('data', data);
}

export async function LoginUser(username: string, password: string) {
    if (username === '') {
        showErrorDialog('You need to enter your username or email');
        return;
    }

    if (password === '') {
        showErrorDialog('You need to enter your password');
        return;
    }

    store.dispatch(AuthActions.setLoggingIn());

    try {
        const user = await Auth.signIn(username.toLowerCase(), password);
        store.dispatch(AuthActions.unsetLoggingIn());

        await completeChallenges(user);
    } catch (e) {
        // TODO: implement specific error messages
        let msg = e.message;
        console.log(e);

        if (e.code === 'UserNotFoundException') {
            msg = 'User does not exists or email has not been verified';
        }

        store.dispatch(unsetBusy());
        store.dispatch(AuthActions.unsetLoggingIn());
        showErrorDialog(msg);
    } finally {
        store.dispatch(AuthActions.unsetLoggingIn());
    }
}

async function completeChallenges(user: any) {
    if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        const newPassword = await requestPassword(false);

        if (newPassword.password) {
            store.dispatch(setBusy());

            const params = user.challengeParam.userAttributes;
            const required: any = {};
            for (const param of user.challengeParam.requiredAttributes) {
                if (params[param] === '') {
                    required[param] = 'bs@bsmail.com'; // TODO
                } else {
                    required[param] = params[param];
                }
            }
            await Auth.completeNewPassword(user, newPassword.password, required);

            store.dispatch(unsetBusy());
        }
    } else if (user.challengeName) {
        alert('Unkown challenge ' + user.challengeName);
    }
}

export async function EnsureUser() {
    try {
        // TODO: a cached user does not reflect challenges
        const user = await Auth.currentUserPoolUser();
        await completeChallenges(user);

        const userInfo = await getUserInfo(user.username);
        if (!userInfo) {
            const u = await requestUsername(false);
            store.dispatch(setBusy());
            await createUserInfo(user.username, u!);
        }
    } catch (e) {
        console.log(e);
        showErrorDialog(e.message);
    } finally {
        store.dispatch(unsetBusy());
    }
}

export async function SignupUser({ birthdate, email, surname, gender, name, password }:
    {
        birthdate: Date, email: string, surname: string, gender: string,
        name: string, password: string,
    }) {

    const attributes = {
        birthdate: dateformat(birthdate, 'mm/dd/yyyy') || '',
        email: email.toLowerCase(),
        family_name: surname,
        gender: gender || '',
        name,
        // preferred_username: username,
    };

    return await Auth.signUp({
        username: uuidv4(),
        password,
        attributes,
    });
}

export type UserCredentialType = 'username' | 'email';

export function DoesUsernameExist(username: string) {
    return new Promise<boolean>(async (resolve, reject) => {
        try {
            const url = system.compute_rest_endpoint + '/checkUsernameExists?' + querystring.stringify({ username });
            const res = await fetch(url, { method: 'GET' });
            const result = JSON.parse(await res.text());

            if (!result) {
                throw new Error('Invalid server response');
            }

            resolve(result.exists);
        } catch (e) {
            reject(e);
        }
    });
}

export function DoesEmailExist(email: string) {
    return new Promise<boolean>(async (resolve, reject) => {
        try {
            const url = system.compute_rest_endpoint + '/checkEmailExists?' + querystring.stringify({ email });
            const res = await fetch(url, { method: 'GET' });
            const result = JSON.parse(await res.text());

            if (!result) {
                throw new Error('Invalid server response');
            }

            resolve(result.exists);
        } catch (e) {
            reject(e);
        }
    });
}

export async function Logout() {
    await Auth.signOut();
    await appSyncClient.resetStore();
    store.dispatch(finishLogout());
}
