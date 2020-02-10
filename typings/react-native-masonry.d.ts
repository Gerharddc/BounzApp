declare module 'react-native-masonry' {
	import * as React from 'react';
	import {  ImageStyle, StyleProp } from 'react-native';

	export interface IBrick<T> {
		uri: string;
		key?: string;
		data?: T;
		onPress?: (data: IBrick<T>) => void;
		renderHeader?: (data: IBrick<T>) => void;
		renderFooter?: (data: IBrick<T>) => void;
	}

	export interface IMasonryProps<T> {
		bricks: IBrick<T>[];
		columns?: number;
		sorted?: boolean;
		imageContainerStyle?: StyleProp<ImageStyle>;
		customImageComponent?: React.Component;
		customImageProps?: object;
		spacing?: number;
	}

	export default class Masonry<T> extends React.Component<IMasonryProps<T>> {} 
}