/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as React from 'react';
import { View } from 'react-native';
import { IKohanaProps, Kohana } from 'react-native-textinput-effects';
import Entypo from 'react-native-vector-icons/Entypo';

import platform from 'native-base-theme/variables/platform';

interface IStyledKohanaProps {
    label: string;
    iconName: string;
    secureTextEntry?: boolean;
    keyboardType?: IKohanaProps['keyboardType'];
    value: any;
    onChangeText: IKohanaProps['onChangeText'];
}

class StyledKohana extends React.Component<IStyledKohanaProps> {
    static defaultProps: Partial<IStyledKohanaProps> = {
        secureTextEntry: false,
    }; //marginVertical: platform.verticalMargin,

    render() {
        return (
            <Kohana
                style={{ backgroundColor: platform.brandPrimary,
                    marginVertical: platform.verticalMargin, maxHeight: 50 }}
                label={this.props.label}
                iconClass={Entypo}
                iconName={this.props.iconName}
                iconColor={platform.brandBackground}
                iconSize={18}
                labelStyle={{ color: 'grey' }}
                inputStyle={{ color: 'white' }}
                useNativeDriver
                secureTextEntry={this.props.secureTextEntry || false}
                keyboardType={this.props.keyboardType}
                value={this.props.value}
                onChangeText={this.props.onChangeText}
            />
        );
    }
}

export default StyledKohana;
