/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

interface IProps {
    title: string;
    message: string;
    onPress: () => void;
    onClose: () => void;
}

export default class NotificationBody extends React.Component<IProps> {
    public render() {
        return (
            <View style={{ flex: 1, paddingTop: (Platform.OS === 'ios' ? getStatusBarHeight() : 0) }}>
                <View style={{ padding: 8, flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', color: 'white' }}>{this.props.title}</Text>
                    <Text style={{ color: 'white' }}>{this.props.message}</Text>
                </View>
                <View style={{ flexDirection: 'row', width: '100%', height: 40 }}>
                    <TouchableOpacity style={styles.buttonOpacity} onPress={() => {
                        if (this.props.onClose) {
                            this.props.onClose();
                        }

                        if (this.props.onPress) {
                            this.props.onPress();
                        }
                    }}>
                        <Text style={styles.buttonText}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonOpacity} onPress={this.props.onClose}>
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonOpacity: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        marginHorizontal: 1,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
    },
});
