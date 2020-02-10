/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { gotoMaintenance, gotoNoNetwork, gotoOutdated } from 'actions/nav';
import system from 'system-exports';
import { navigate } from 'utils/NavigationService';

interface IServerInfo {
    MinApi: number;
    SystemStatus: string;
}

export function GetSystemInfo() {
    return new Promise<IServerInfo>(async (resolve, reject) => {
        try {
            const url = system.compute_rest_endpoint + '/systemInfo';
            const res = await fetch(url, { method: 'GET' });
            const result = JSON.parse(await res.text());

            if (!result) {
                throw new Error('Invalid server response');
            }

            resolve(result);
        } catch (e) {
            reject(e);
        }
    });
}

export async function EnsureValidSystem() {
    try {
        const systemInfo = await GetSystemInfo();
        console.log('systemInfo', systemInfo);
        if (systemInfo.SystemStatus !== 'up') {
            navigate(gotoMaintenance());
        } else if (Number(system.min_api) < systemInfo.MinApi) {
            navigate(gotoOutdated());
        }
    } catch (e) {
        console.log(e);
        navigate(gotoNoNetwork());
    }
}
