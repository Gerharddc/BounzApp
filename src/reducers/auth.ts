/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { reducerWithInitialState } from 'typescript-fsa-reducers';

import * as actions from 'actions/auth';
import { finishLogout } from 'actions/login';

export type TextCB = (text?: string, text2?: string) => void;

export interface IAuthState {
    username: string;
    password: string;
    loggingIn: boolean;
    usernameRequest?: { cb: TextCB, canCancel: boolean };
    passwordRequest?: { cb: TextCB, change: boolean };
}

const initialAuthState: IAuthState = {
    username: '',
    password: '',
    loggingIn: false,
    usernameRequest: undefined,
    passwordRequest: undefined,
};

export default reducerWithInitialState(initialAuthState)
    .case(finishLogout, (state) => {
        return initialAuthState;
    }).case(actions.setUsername, (state, username) => {
        return { ...state, username };
    })
    .case(actions.setPassword, (state, password) => {
        return { ...state, password };
    })
    .case(actions.setLoggingIn, (state) => {
        return { ...state, loggingIn: true };
    })
    .case(actions.unsetLoggingIn, (state) => {
        return { ...state, loggingIn: false };
    })
    .case(actions.setUsernameRequest, (state, usernameRequest) => {
        return { ...state, usernameRequest };
    })
    .case(actions.unsetUsernameRequest, (state) => {
        return { ...state, usernameRequest: undefined };
    })
    .case(actions.setPasswordRequest, (state, passwordRequest) => {
        return { ...state, passwordRequest };
    })
    .case(actions.unsetPasswordRequest, (state) => {
        return { ...state, passwordRequest: undefined };
    });
