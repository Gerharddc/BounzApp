/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import Auth from '@aws-amplify/auth';
import * as AWS from 'aws-sdk';
import { readFile } from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';

export interface IImageInfo {
    uri: string;
    width: number;
    height: number;
    fileSize: number;
    type: string;
}

export async function ShrinkToSize(pic: IImageInfo, maxSize: number) {
    do {
        let w = pic.width;
        let h = pic.height;

        if (pic.fileSize > maxSize) {
            const div = Math.ceil(Math.sqrt(pic.fileSize / maxSize));
            w = Math.floor(w / div);
            h = Math.floor(h / div);
        }

        const format = ((mime) => {
            switch (mime) {
                case 'image/jpeg':
                    return 'JPEG';
                case 'image/png':
                    return 'PNG';
                default:
                    throw new Error('Unsupported image type');
            }
        })(pic.type);

        const resized = await ImageResizer.createResizedImage(
            pic.uri,
            w,
            h,
            format,
            70,
        );

        // Fuck knows why this is needed
        /*if (Platform.OS === 'ios') {
            resized.size! *= 3;
        }*/

        pic = {
            uri: resized.uri,
            width: w,
            height: h,
            fileSize: resized.size!, // TODO: eish
            type: 'image/jpeg',
        };
    } while (pic.fileSize > maxSize);

    return pic;
}

export function UploadImage(uri: string, bucket: string, key: string) {
    return new Promise(async (resolve, reject) => {
        try {
            AWS.config.credentials = await Auth.currentCredentials();
            const s3 = new AWS.S3();

            const params = {
                Bucket: bucket,
                Key: key,
                Body: new Buffer(await readFile(uri, 'base64'), 'base64'),
                ContentType: 'image/jpeg',
            };

            await s3.putObject(params).promise();

            resolve();
        } catch (e) {
            reject(e);
        }
    });
}
