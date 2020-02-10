/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as React from 'react';
import {
    Animated, Dimensions, Keyboard, Platform,
    StyleSheet, TextInput, UIManager, View, ViewProperties,
} from 'react-native';

const { State: TextInputState } = TextInput;

// Based on https://codeburst.io/react-native-keyboard-covering-inputs-72a9d3072689
class KeyboardShift extends React.Component {
    state = {
        shift: new Animated.Value(0),
    };

    keyboardDidShowSub: any;
    keyboardDidHideSub: any;

    componentWillMount() {
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowSub.remove();
        this.keyboardDidHideSub.remove();
    }

    render() {
        const { shift } = this.state;
        return (
            <Animated.View {...this.props}
                style={[this.props.style, styles.container, { transform: [{ translateY: shift }] }]}
            >
                {this.props.children}
            </Animated.View>
        );
    }

    handleKeyboardDidShow = (event: any) => {
        const { height: windowHeight } = Dimensions.get('window');
        const keyboardHeight = event.endCoordinates.height;
        const currentlyFocusedField = TextInputState.currentlyFocusedField();

        if (!currentlyFocusedField) {
            return;
        }

        UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
            const fieldHeight = height;
            const fieldTop = pageY;
            const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
            if (gap >= 0) {
                return;
            }
            Animated.timing(
                this.state.shift,
                {
                    toValue: gap,
                    duration: 100,
                    useNativeDriver: true,
                },
            ).start();
        });
    }

    handleKeyboardDidHide = () => {
        Animated.timing(
            this.state.shift,
            {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            },
        ).start();
    }
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        left: 0,
        position: 'absolute',
        top: 0,
        width: '100%',
    },
});

export default class PlatformKeyboardAvoidingView extends React.Component<ViewProperties> {
    public render() {
        if (Platform.OS === 'ios') {
            return (<KeyboardShift {...this.props} />);
        } else {
            return (<View {...this.props} />);
        }
    }
}
