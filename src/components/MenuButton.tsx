/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { Icon } from 'native-base';
import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import { navigate } from 'utils/NavigationService';

import * as NavActions from 'actions/nav';

export default class MenuButton extends React.Component {
    public render() {
        return (
            <TouchableOpacity
                style={{ paddingRight: 10 }}
                onPress={() => navigate(NavActions.gotoMenu())}
            >
                <Icon name="menu"/>
            </TouchableOpacity>
        );
    }
}
