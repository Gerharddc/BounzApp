/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { setPasswordRequest, setUsernameRequest, unsetPasswordRequest, unsetUsernameRequest } from 'actions/auth';
import { addDialog, removeDialog, setCofirmBounz } from 'actions/dialog';
import { store } from 'app';
import { Dialog, DialogButton, InputDialog } from 'reducers/dialog';
import shortid from 'shortid';

export function promptNewValue(title: string, startText: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const dialogId = shortid.generate();

        const okButton = new DialogButton('Ok', (text: string) => {
            resolve(text);
            store.dispatch(removeDialog(dialogId));
        });
        const cancelButton = new DialogButton('Cancel', () => {
            resolve(startText);
            store.dispatch(removeDialog(dialogId));
        });

        const dialog = new InputDialog(dialogId, 'Edit ' + title, '', startText, 'New value', [okButton, cancelButton]);
        store.dispatch(addDialog(dialog));
    });
}

export function requestUsername(canCancel = true): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
        store.dispatch(setUsernameRequest({
            cb: (username) => {
                resolve(username);
                store.dispatch(unsetUsernameRequest());
            },
            canCancel,
        }));
    });
}

export function showDialog(title: string, details: string, buttons?: DialogButton[]) {
    const dialogId = shortid.generate();
    const dialog = new Dialog(dialogId, title, details, buttons);
    store.dispatch(addDialog(dialog));
}

export function showOkDialog(title: string, details: string) {
    const dialogId = shortid.generate();
    const okButton = new DialogButton('Ok', () => store.dispatch(removeDialog(dialogId)));
    const dialog = new Dialog(dialogId, title, details, [okButton]);
    store.dispatch(addDialog(dialog));
}

export function showErrorDialog(data: string | object) {
    const msg = (typeof data === 'string') ? data : JSON.stringify(data);
    showOkDialog('Error', msg);
}

interface IPasswordResult {
    password?: string;
    oldPassword?: string;
}

export function requestPassword(change = true): Promise<IPasswordResult> {
    return new Promise((resolve, reject) => {
        store.dispatch(setPasswordRequest({
            cb: (password, oldPassword) => {
                resolve({ password, oldPassword });
                store.dispatch(unsetPasswordRequest());
            },
            change,
        }));
    });
}

export function confirmBounz(): Promise<boolean> {
    return new Promise((resolve, reject) => {
        store.dispatch(setCofirmBounz(resolve));
    });
}
