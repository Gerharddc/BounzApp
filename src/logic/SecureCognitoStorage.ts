/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { ICognitoStorage } from 'amazon-cognito-identity-js';
import { AsyncStorage } from 'react-native';
import * as Keychain from 'react-native-keychain';

/**
 * Alternative storage provider for cognito that uses react-native-keychain to
 * securely store access tokens.
 *
 * @export
 * @class SecureCognitoStorage
 * @implements {ICognitoStorage}
 */
export default class SecureCognitoStorage implements ICognitoStorage {
    private dict: Map<string, string>;

    constructor() {
        this.dict = new Map();
    }

    private async storeKeys() {
        await AsyncStorage.setItem('@SecureCognitoStorage:keys', JSON.stringify(Array.from(this.dict.keys())));
    }

    public async setItem(key: string, value: string) {
        this.dict.set(key, value);

        try {
            await Keychain.setInternetCredentials(key, key, value);
            await this.storeKeys();
        } catch (e) {
            console.log('SecureCognitoStorage SetItem Error', e);
            alert(e);
        }
    }

    public getItem(key: string) {
        return this.dict.get(key) || '';
    }

    public async removeItem(key: string) {
        this.dict.delete(key);

        await Keychain.resetInternetCredentials(key);
        await this.storeKeys();
    }

    private async clearSecure() {
        for (const key of this.dict.keys()) {
            await Keychain.resetInternetCredentials(key);
        }
    }

    public clear() {
        this.dict.clear();

        this.clearSecure().then(() => {
            this.storeKeys();
        });
    }

    public async loadValues() {
        const keysString = await AsyncStorage.getItem('@SecureCognitoStorage:keys');

        if (!keysString) {
            return;
        }

        const keys: string[] = JSON.parse(keysString);

        if (keys) {
            for (const key of keys) {
                const res = (await Keychain.getInternetCredentials(key)) as any;
                if (res.password) {
                    this.dict.set(key, res.password);
                }
            }
        }
    }
}
