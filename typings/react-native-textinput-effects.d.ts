declare module 'react-native-textinput-effects' {
	import * as React from 'react';
	import { Text, View, StyleProp, ViewStyle, TextStyle, TextInputProperties } from 'react-native';
	
	export interface IBaseInputProps extends TextInputProperties {
		label?: string;
		value?: string;
		defaultValue?: string;
		style?: StyleProp<ViewStyle>;
		inputStyle?: StyleProp<TextStyle>;
		labelStyle?: StyleProp<TextStyle>;
		easing?: () => any;
		animationDuration?: number;
		useNativeDriver?: boolean;
	}

	export interface ISaeProps extends IBaseInputProps {
		height?: number;
		iconClass: any;
		iconName?: string;
		iconColor?: string;
	}

	export interface IFumiProps extends IBaseInputProps {
		iconClass: any;
		iconName: string;
		iconColor?: string;
		iconSize?: number;
		passiveIconColor?: string;
		height?: number;
	}

	export interface IJiroProps extends IBaseInputProps {
		borderColor?: string;
		height?: number;
	}

	export interface IHoshiProps extends IBaseInputProps {
		borderColor?: string;
		maskColor?: string;
		height?: number;
	}

	export interface IKohanaProps extends IBaseInputProps {
		iconClass: any;
		iconName: string;
		iconColor?: string;
		iconSize?: number;
	}

	export class BaseInput<T extends IBaseInputProps> extends React.Component<T, any> {
		inputRef: () => React.ReactInstance;
		focus: () => void;
		blur: () => void;
		isFocused: () => boolean;
		clear: () => void;
	}

	export class Sae extends BaseInput<ISaeProps> {}
	export class Fumi extends BaseInput<IFumiProps> {}
	export class Jiro extends BaseInput<IJiroProps> {}
	export class Hoshi extends BaseInput<IHoshiProps> {}
	export class Kohana extends BaseInput<IKohanaProps> {}
}