/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { Text } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { Dimensions, Image, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

interface IProps {
    navigation: any;
}

export default class StatusScreen extends React.Component<IProps> {
    static navigationOptions = {
        header: null,
    };

    private renderMiddle() {
        const navParams = this.props.navigation.state.params;
        const width = Dimensions.get('window').width - 20;

        switch (navParams.status) {
            case 'outdated':
                return (
                    <View style={{ marginTop: 10, flex: 1 }}>
                        <Text style={{ color: 'black', textAlign: 'center', marginHorizontal: 10 }}>
                            It seems this version Bounz is too old to talk to the system,
                            please update :)
                        </Text>
                        <View style={{ flex: 1 }} />
                        <Image
                            style={{ width, height: width * 0.899, resizeMode: 'contain' }}
                            source={require('../../../assets/img/OldCar.png')}
                        />
                    </View>
                );
            case 'maintenance':
                return (
                    <View style={{ marginTop: 10, flex: 1 }}>
                        <Text style={{ color: 'black', textAlign: 'center', marginHorizontal: 10 }}>
                            Unfortunaly our system is down for maintenance
                            but we'll have you "bounzing" again in no time
                        </Text>
                        <View style={{ flex: 1 }} />
                        <Image
                            style={{ width, height: width * 1, resizeMode: 'contain' }}
                            source={require('../../../assets/img/Maintenance.png')}
                        />
                    </View>
                );
            case 'noNetwork':
                const w = Dimensions.get('window').width;
                const h = w * 0.375;

                return (
                    <View style={{ marginTop: 10, flex: 1 }}>
                        <Text style={{ color: 'black', textAlign: 'center', marginHorizontal: 10 }}>
                            Unfortunaly Bounz currently needs an active internet connection to function.
                        </Text>
                        <Text style={{ color: 'black', textAlign: 'center', marginTop: 10, marginHorizontal: 10 }}>
                            For now, you will have to restart the app once you regain connection.
                        </Text>
                        <View style={{ flex: 1 }} />
                        <Image
                            style={{ width: w, height: h, resizeMode: 'contain' }}
                            source={require('../../../assets/img/Disconnected.png')}
                        />
                    </View>
                );
            default:
                return (
                    <View style={{ marginTop: 10, flex: 1 }}>
                        <Text style={{ color: 'black', textAlign: 'center', marginHorizontal: 10 }}>
                            There is an unkown problem with Bounz at the moment
                        </Text>
                        <View style={{ flex: 1 }} />
                        <Image
                            style={{ width, height: width * 1, resizeMode: 'contain' }}
                            source={require('../../../assets/img/Maintenance.png')}
                        />
                    </View>
                );
        }
    }

    public render() {
        return (
            <View style={{ flex: 1 }}>
                <Text
                    style={{ fontFamily: platform.brandFontFamily, textAlign: 'center',
                    fontSize: 50, marginTop: getStatusBarHeight() }}
                >
                    Oops
                </Text>
                {this.renderMiddle()}
            </View>
        );
    }
}
