/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import auth, { IAuthState } from './auth';
import dialog, { IDialogState } from './dialog';
import newPost, { INewPostState } from './newPost';
import users, { IUsersState } from './users';

const AppReducer = combineReducers({
    form: formReducer as any, // TODO
    auth,
    dialog,
    newPost,
    users,
});

export interface IReduxState {
    auth: IAuthState;
    dialog: IDialogState;
    newPost: INewPostState;
    users: IUsersState;
}

export default AppReducer;
