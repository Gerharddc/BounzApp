declare module 'react-native-photo-view' {
    import * as React from 'react';
    
    export interface IProps {
        source: { uri: string };
        style?: any;
        loadingIndicatorSource?: string;
        fadeDuration?: number;
        minimumZoomScale?: number;
        maximumZoomScale?: number;
        showsHorizontalScrollIndicator?: boolean;
        showsVerticalScrollIndicator?: boolean;
        scale?: number;
        androidZoomTransitionDuration?: number;
        androidScaleType?: 'center' | 'centerCrop' | 'centerInside' | 'fitCenter' | 'fitStart' | 'fitEnd' | 'fitXY';
        onLoadStart?: () => any;
        onLoad?: () => any;
        onLoadEnd?: () => any;
        onProgress?: (nativeEvent: { loaded: number, total: number }) => any;
        onTap?: () => any;
        onViewTap?: () => any;
        onScale?: () => any;
    }

	export default class PhotoView extends React.Component<IProps> {} 
}