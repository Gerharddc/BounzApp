/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { finishLogout } from 'actions/login';
import * as actions from 'actions/users';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

export interface IUsersState {
    myUserId: string;
}

const intialUsersState: IUsersState = {
    myUserId: '',
};

export default reducerWithInitialState(intialUsersState)
    .case(finishLogout, (state) => {
        return intialUsersState;
    })
    .case(actions.setMyUserId, (state, myUserId: string) => {
        return { ...state, myUserId };
    });
