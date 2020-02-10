/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as React from 'react';
import { Animated, Image } from 'react-native';

interface IProps {
    size: number;
}

export default class JumpingLogo extends React.Component<IProps> {
    state = {
        dy: new Animated.Value(0),
    };

    componentDidMount() {
        const press = Animated.timing(this.state.dy, {
            toValue: this.props.size - 10,
            useNativeDriver: true,
        });

        const up = Animated.timing(this.state.dy, {
            toValue: -this.props.size,
            useNativeDriver: true,
        });

        const seq = Animated.sequence([
            press,
            up,
        ]);

        Animated.loop(seq).start();
    }

    render() {
        const { size } = this.props;
        const { dy } = this.state;

        const scale = dy.interpolate({
            inputRange: [-size, 0, size],
            outputRange: [1, 1, 0],
        });

        return (
            <Animated.Image source={require('../../assets/img/logo.png')}
                style={{
                    height: size,
                    width: size,
                    transform: [{ translateY: this.state.dy }, { scaleY: scale }],
                }}
            />
        );
    }
}
