/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { gotoUsersToFollow } from 'actions/nav';
import Analytics from '@aws-amplify/analytics';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { AsyncStorage, Button, Image, Platform, StyleSheet, View } from 'react-native';
import Swiper from 'react-native-swiper';
import { navigate } from 'utils/NavigationService';

export default class UsageScreen extends React.Component {
    static navigationOptions = {
        title: 'Usage',
        headerRight: (
            <View style={{ paddingRight: Platform.OS === 'android' ? 5 : 0 }}>
                <Button title="Next" onPress={() => navigate(gotoUsersToFollow())} color={platform.brandBackground}/>
            </View>
        ),
    };

    public componentDidMount() {
        AsyncStorage.setItem('@Bounz:sawIntro', 'true');

        Analytics.record({
            name: 'viewUsageScreen',
        });
    }

    public render() {
        return (
            <Swiper>
                <Image source={require('../../../assets/slides/Screen1.png')} style={styles.slide}/>
                <Image source={require('../../../assets/slides/Screen2.png')} style={styles.slide}/>
                <Image source={require('../../../assets/slides/Screen3.png')} style={styles.slide}/>
                <Image source={require('../../../assets/slides/Screen4.png')} style={styles.slide}/>
                <Image source={require('../../../assets/slides/Screen5.png')} style={styles.slide}/>
            </Swiper>
        );
    }
}

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        resizeMode: 'contain',
        height: '100%',
        width: '100%',
    },
});
