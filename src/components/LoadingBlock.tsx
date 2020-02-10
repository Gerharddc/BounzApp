/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { ActivityIndicator, View, ViewStyle } from 'react-native';

interface IProps {
    style?: ViewStyle;
}

export default class LoadingBlock extends React.Component<IProps> {
    public render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', ...this.props.style }}>
                <ActivityIndicator
                    color={platform.brandPrimary}
                    size="large"
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                />
            </View>
        );
    }
}
