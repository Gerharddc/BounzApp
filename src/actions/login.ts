/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import actionCreatorFactory from 'typescript-fsa';
const actionCreator = actionCreatorFactory('Login');

export const finishLogout = actionCreator('FINISH_LOGOUT'); // Reset state
