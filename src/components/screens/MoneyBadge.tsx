/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { Icon, Text } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { View } from 'react-native';

interface IProps {
    title: string;
    amountText: string;
    icon: 'wallet' | 'coins';
}

export default class MoneyBadge extends React.Component<IProps> {
    public render() {
        return (
            <View style={{
                backgroundColor: platform.brandBackground,
                padding: 10,
                borderRadius: 10,
                flexDirection: 'row',
                marginVertical: 10,
            }}>
                <View style={{ height: '100%', alignItems: 'center', padding: 10 }}>
                    <Icon
                        name={this.props.icon}
                        type={this.props.icon === 'wallet' ? 'Entypo' : 'FontAwesome5'}
                        style={{ fontSize: 40, color: 'white' }}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: 'white' }}>{this.props.title}</Text>
                    <Text style={{ color: 'white', fontSize: 25 }}>{this.props.amountText}</Text>
                </View>
            </View>
        );
    }
}
