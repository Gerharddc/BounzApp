declare module 'react-native-image-progress' {
	import * as React from 'react';
	import { ImageProperties } from 'react-native';

	export const createImageProgress: (Component: any) => any;

	export interface IImageProps extends ImageProperties {
		indicator?: object;
		indicatorProps?: object;
		renderIndicator?: (progress: number, indeterminate: boolean) => void;
		renderError?: (error: Error) => void;
		threshold?: number;
	}

	export default class Image extends React.Component<IImageProps> {}
}