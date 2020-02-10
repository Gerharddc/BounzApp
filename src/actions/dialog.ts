/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { Dialog } from 'reducers/dialog';
import actionCreatorFactory from 'typescript-fsa';
const actionCreator = actionCreatorFactory('DIALOG');

export const addDialog = actionCreator<Dialog>('ADD_DAILOG');
export const removeDialog = actionCreator<string>('REMOVE_DAILOG');
export const setBusy = actionCreator('SET_BUSY');
export const unsetBusy = actionCreator('UNSET_BUSY');
export const setCofirmBounz = actionCreator<(confirm: boolean) => void>('SET_CONFIRM_BOUNZ');
