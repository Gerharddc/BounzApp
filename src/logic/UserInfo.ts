/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import Auth from '@aws-amplify/auth';
import Analytics from '@aws-amplify/analytics';
import system from 'system-exports';
import { AsyncStorage, Platform, NativeModules } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export interface IUserInfo {
    userId: string;
    username: string;
    postCount: number;
    bounzesMade: number;
    bounzesReceived: number;
    receipts: number;
    location: string;
    bio: string;
    followersCount: number;
    followingCount: number;
    profilePicRev: number;
    courtsJoined: number;
    courtsOwned: number;
}

const baseImgUrl = 'https://' + system.public_images_domain + '/profile-pics/';
export function calculateProfilePicUrl(user: { userId: string, profilePicRev: number }) {
    return baseImgUrl + user.userId + '-' + user.profilePicRev + '.jpg';
}

export type ProfileValueType = keyof IUserInfo;

export const ProfileValueDisplayNames: { [index in ProfileValueType]: string } = {
    location: 'Location',
    bio: 'Short bio',
    postCount: 'Posts',
    followersCount: 'Followers',
    followingCount: 'Following',
    bounzesMade: 'Bounzes made',
    bounzesReceived: 'Bounzes received',
    receipts: 'Receipts',
    profilePicRev: 'Profile Pic Version',
    userId: 'User ID',
    username: 'Username',
    courtsJoined: 'Courts joined',
    courtsOwned: 'Courts owned',
};

export async function ConfigureEndpoint() {
    const token = await AsyncStorage.getItem('@Bounz:deviceToken');
    if (!token) {
        console.log('No device token to register endpoint');
    } else {
        console.log('token', token);
    }

    let channelType: string;
    if (Platform.OS === 'ios') {
        const sandbox = NativeModules.Sandbox.isSandbox;
        if (sandbox === null) {
            throw new Error('APS Sandbox state unkown');
        }

        channelType = sandbox ? 'APNS_SANDBOX' : 'APNS';
    } else {
        channelType = 'GCM';
    }

    const user = await Auth.currentUserPoolUser();

    Analytics.configure({
        AWSPinpoint: {
            appId: system.aws_mobile_analytics_app_id,
            region: system.aws_project_region,
            endpoint: {
                address: token,
                channelType,
                userId: user.username,
                optOut: 'NONE',
                demographic: {
                    appVersion: DeviceInfo.getBuildNumber().toString(),
                    locale: DeviceInfo.getDeviceLocale(),
                    make: DeviceInfo.getBrand(),
                    model: DeviceInfo.getModel(),
                    platform: DeviceInfo.getSystemName(),
                    platformVersion: DeviceInfo.getSystemVersion(),
                    timezone: DeviceInfo.getTimezone(),
                },
                location: {
                    country: DeviceInfo.getDeviceCountry(),
                },
            },
        },
    });
}

export async function UpdateEndpoint() {
    const token = await AsyncStorage.getItem('@Bounz:deviceToken');
    if (!token) {
        console.log('No device token to register endpoint');
    } else {
        console.log('token', token);
    }

    let channelType: string;
    if (Platform.OS === 'ios') {
        const sandbox = NativeModules.Sandbox.isSandbox;
        if (sandbox === null) {
            throw new Error('APS Sandbox state unkown');
        }

        channelType = sandbox ? 'APNS_SANDBOX' : 'APNS';
    } else {
        channelType = 'GCM';
    }

    const user = await Auth.currentUserPoolUser();

    await Analytics.updateEndpoint({
        address: token,
        channelType,
        userId: user.username,
        optOut: 'NONE',
        demographic: {
            appVersion: DeviceInfo.getBuildNumber().toString(),
            locale: DeviceInfo.getDeviceLocale(),
            make: DeviceInfo.getBrand(),
            model: DeviceInfo.getModel(),
            platform: DeviceInfo.getSystemName(),
            platformVersion: DeviceInfo.getSystemVersion(),
            timezone: DeviceInfo.getTimezone(),
        },
        location: {
            country: DeviceInfo.getDeviceCountry(),
        },
    });
}
