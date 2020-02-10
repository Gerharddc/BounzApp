/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { TextCB } from 'reducers/auth';
import actionCreatorFactory from 'typescript-fsa';
const actionCreator = actionCreatorFactory('Auth');

export const setUsername = actionCreator<string>('SET_USERNAME');
export const setPassword = actionCreator<string>('SET_PASSWORD');
export const setUsernameRequest = actionCreator<{ cb: TextCB, canCancel: boolean }>('SET_USERNAME_REQUEST');
export const unsetUsernameRequest = actionCreator('UNSET_USERNAME_REQUEST');
export const setPasswordRequest = actionCreator<{ cb: TextCB, change: boolean }>('SET_PASSWORD_REQUEST');
export const unsetPasswordRequest = actionCreator('UNSET_PASSWORD_REQUEST');

export const setLoggingIn = actionCreator('SET_LOGGING_IN');
export const unsetLoggingIn = actionCreator('UNSET_LOGGING_IN');
