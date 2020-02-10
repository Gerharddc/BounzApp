/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import CameraTab from 'components/tabs/CameraTab';
import CourtsTab from 'components/tabs/CourtsTab';
import FlowTab from 'components/tabs/FlowTab';
import UserTab from 'components/tabs/UserTab';
import platform from 'native-base-theme/variables/platform';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';

const Camera = createStackNavigator({
    Camera: { screen: CameraTab },
});
Camera.navigationOptions = (CameraTab as any).navigationOptions;

const Flow = createStackNavigator({
    Flow: { screen: FlowTab },
});
Flow.navigationOptions = (FlowTab as any).navigationOptions;

const MyUser = createStackNavigator({
    MyUser: { screen: UserTab },
});
MyUser.navigationOptions = (UserTab as any).navigationOptions;

const Courts = createStackNavigator({
    Courts: { screen: CourtsTab },
});
Courts.navigationOptions = (CourtsTab as any).navigationOptions;

const MainTabNavigator = createBottomTabNavigator(
    {
        Camera: { screen: Camera },
        Flow: { screen: Flow },
        Courts: { screen: Courts, path: 'courtmembershiprequest/:courtId/:memberId' },
        MyUser: { screen: MyUser },
    },
    {
        initialRouteName: 'Flow',
        tabBarOptions: {
            activeTintColor: platform.brandBackground,
            inactiveTintColor: 'black',
            style: {
                backgroundColor: platform.brandPrimary,
            },
            showLabel: false,
        },
    },
);

MainTabNavigator.navigationOptions = {
    header: null,
};

export default MainTabNavigator;
