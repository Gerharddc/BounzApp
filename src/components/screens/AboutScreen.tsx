/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import Analytics from '@aws-amplify/analytics';
import { Text } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { Dimensions, Image, ScrollView, View } from 'react-native';
import system from 'system-exports';

export default class AboutScreen extends React.Component {
    componentDidMount() {
        Analytics.record({
            name: 'viewAboutScreen',
        });
    }

    static navigationOptions = {
        title: 'About',
    };

    public render() {
        const PRETORIA = '../../../assets/img/Pretoria.png';
        const ratio = 1407 / 3351;
        const SCREEN_WIDTH = Dimensions.get('window').width;
        const imgHeight = SCREEN_WIDTH * ratio;

        return (
            <View style={{ flexDirection: 'column', backgroundColor: platform.brandBackground, height: '100%' }}>
                <ScrollView style={{ flex: 1 }}>
                    <Image
                        style={{ width: '100%', height: 125, resizeMode: 'contain', marginTop: 15 }}
                        source={require('../../../assets/img/logo.png')}
                    />
                    <Text
                        style={{
                            marginTop: 7, textAlign: 'center', fontSize: 30,
                            fontFamily: platform.brandFontFamily, color: platform.brandPrimary,
                        }}>
                        Bounz
                    </Text>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 7, color: 'white' }}>
                        Version: 0.2.2 Stage: {system.stage} API: {system.min_api}
                    </Text>
                    <Text style={{ marginTop: 10, marginHorizontal: 25, textAlign: 'left', color: 'white' }}>
                        Bounz is a fun new way to share images with people across the world.
                        We remove social contraints from content sharing and set your posts free!
                    </Text>
                    <Text style={{ marginTop: 10, marginHorizontal: 25, textAlign: 'left', color: 'white' }}>
                        Bounz is still in the very early stages of development.
                        It is being developed by a small group of university students
                        so please do not expect too much in terms of robustness just yet!
                    </Text>
                    <Text style={{ marginTop: 10, marginHorizontal: 25, textAlign: 'left', color: 'white' }}>
                        Should you have any comments, suggestions, praises or complaints please
                        do not hestiate to send them to feedback@bounz.io, we really need your input!
                    </Text>
                    <Text style={{
                        marginTop: 10,
                        textAlign: 'center',
                        fontFamily: platform.brandFontFamily,
                        paddingBottom: imgHeight,
                        color: 'white',
                    }}>
                        © Bounz Media (Pty) Ltd
                    </Text>
                </ScrollView>
                <Image
                    style={{
                        width: SCREEN_WIDTH, height: imgHeight,
                        resizeMode: 'contain', position: 'absolute', bottom: 0,
                    }}
                    source={require(PRETORIA)}
                />
            </View>
        );
    }
}
