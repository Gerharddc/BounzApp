/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import actionCreatorFactory from 'typescript-fsa';
const actionCreator = actionCreatorFactory('Users');

export const setMyUserId = actionCreator<string>('SET_MY_USER_ID');
