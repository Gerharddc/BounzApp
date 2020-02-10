/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { finishLogout } from 'actions/login';
import * as actions from 'actions/newPost';
import { IImageInfo } from 'logic/Images';

export interface INewPostState {
    image: IImageInfo | undefined;
    decription: string;
    court: string | undefined;
}

const initialPostState: INewPostState = {
    image: undefined,
    decription: '',
    court: undefined,
};

export default reducerWithInitialState(initialPostState)
    .case(finishLogout, (state) => {
        return initialPostState;
    })
    .case(actions.setImage, (state, image) => {
        return { ...state, image };
    })
    .case(actions.setDescription, (state, decription) => {
        return { ...state, decription };
    })
    .case(actions.clearPost, (state) => {
        return initialPostState;
    })
    .case(actions.setCourt, (state, court) => {
        return { ...state, court };
    });
