/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as React from 'react';
import { AppRegistry, YellowBox } from 'react-native';
import App from './app';

// TODO: fix deprecated lifecycle shit
YellowBox.ignoreWarnings([
    'Warning: componentWillReceiveProps is deprecated',
    'Warning: componentWillUpdate is deprecated',
    'Warning: componentDidUpdate is deprecated',
    'Warning: componentWillMount is deprecated',
]);

export default class Bounz extends React.Component {
    render() {
        return (
            <App />
        );
    }
}

AppRegistry.registerComponent('bounz', () => Bounz);
