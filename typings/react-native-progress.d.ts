declare module 'react-native-progress' {
	import * as React from 'react';

	interface IProgressProps {
		animated?: boolean;
		indeterminate?: boolean;
		progress?: number;
		color?: string;
		unfilledColor?: string;
		borderWidth?: number;
		borderColor?: string;
		setState?: any;
	}

	interface IPieProps extends IProgressProps {
		size?: number;
	}

	export class Pie extends React.Component<IPieProps, any> {}
}