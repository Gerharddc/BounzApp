/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { reducerWithInitialState } from 'typescript-fsa-reducers';

import * as actions from 'actions/dialog';
import { finishLogout } from 'actions/login';

export class DialogButton {
    readonly title: string;
    readonly action: (data: any) => void;

    constructor(title: string, action: (data: any) => void) {
        this.title = title;
        this.action = action;
    }
}

export class Dialog {
    readonly id: string;
    readonly title: string;
    readonly details: string;
    readonly buttons?: DialogButton[];

    constructor(id: string, title: string, details: string, buttons?: DialogButton[]) {
        this.id = id;
        this.title = title;
        this.details = details;
        this.buttons = buttons;
    }
}

export class InputDialog extends Dialog {
    readonly startValue: string;
    readonly fieldName: string;

    constructor(id: string, title: string, details: string, startValue: string,
        fieldName: string, buttons?: DialogButton[]) {
        super(id, title, details, buttons);
        this.startValue = startValue;
        this.fieldName = fieldName;
    }
}

export interface IDialogState {
    dialogs: Dialog[];
    topDialog?: Dialog | null;
    isBusy: boolean;
    confirmBounz?: (confirm: boolean) => void;
}

const initialDialogState: IDialogState = {
    dialogs: new Array(),
    isBusy: false,
};

function addDialog(state: IDialogState, dialog: Dialog) {
    const newDialogs = state.dialogs.slice();
    newDialogs.push(dialog);

    return { ...state, dialogs: newDialogs, topDialog: newDialogs[0] };
}

function removeDialog(state: IDialogState, id: string) {
    const newDialogs = state.dialogs.filter((dialog) => dialog.id !== id);

    let newTop = null;
    if (newDialogs.length > 0) {
        newTop = newDialogs[0];
    }

    return { ...state, dialogs: newDialogs, topDialog: newTop };
}

const busyDialogId = 'BUSY_DIALOG';

function setBusy(state: IDialogState) {
    if (state.isBusy) {
        return state;
    }

    const newDialogs = state.dialogs.slice();

    // TODO: use a random phrase from a list

    // Place a busy modal at the front of the queue
    const newDialog = new Dialog(busyDialogId, 'Busy', 'Please wait while I do my thing...');
    newDialogs.unshift(newDialog);

    return { ...state, dialogs: newDialogs, topDialog: newDialogs[0], isBusy: true };
}

function unsetBusy(state: IDialogState) {
    if (!state.isBusy) {
        return state;
    }

    return { ...removeDialog(state, busyDialogId), isBusy: false };
}

function setConfirmBounz(state: IDialogState, confirmBounz: (confirm: boolean) => void) {
    // Confirm the previous bounz if there was one
    if (state.confirmBounz) {
        state.confirmBounz(true);
    }

    return { ...state, confirmBounz };
}

export default reducerWithInitialState(initialDialogState)
    .case(finishLogout, (state) => {
        return initialDialogState;
    })
    .case(actions.addDialog, addDialog)
    .case(actions.removeDialog, removeDialog)
    .case(actions.setBusy, setBusy)
    .case(actions.unsetBusy, unsetBusy)
    .case(actions.setCofirmBounz, setConfirmBounz);
