declare module "react-native-aws3-cognito" {
    export interface IFile {
        uri: string,
        name: string,
        type: string,
    }

    export interface IOptions {
        acl?: string,
        keyPrefix?: string,
        bucket: string,
        region: string,
        accessKey: string,
        secretKey: string,
        sessionToken?: string,
        successActionStatus?: number,
        awsUrl?: string,
        timeDelta?: number,
        version?: object,
    }

    export interface IEvent {
        loaded: number,
        total: number,
        percent: number,
    }

    export interface IResponse extends Promise<XMLHttpRequest> {
        progress: (e: IEvent) => void;
        abort: () => void;
    }

    export class RNS3 {
        static put(file: IFile, options: IOptions): IResponse;
    }
}