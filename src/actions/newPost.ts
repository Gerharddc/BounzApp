/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { IImageInfo } from 'logic/Images';
import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory('Post');

export const setImage = actionCreator<IImageInfo>('SET_IMAGE');
export const setDescription = actionCreator<string>('SET_DESCRIPTION');
export const clearPost = actionCreator('CLEAR_POST');
export const setCourt = actionCreator<string | undefined>('SET_COURT');
