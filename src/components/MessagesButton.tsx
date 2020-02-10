/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import Auth from '@aws-amplify/auth';
import { Icon } from 'native-base';
import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import { navigate } from 'utils/NavigationService';

import * as NavActions from 'actions/nav';

export default class MessagesButton extends React.Component {

    async navigate(){
        console.log('Navigating');
        const user = await Auth.currentAuthenticatedUser();
        navigate(NavActions.gotoMessages(user.username));
    }

    public render() {
        return (
            <TouchableOpacity
                style={{ paddingRight: 10 }}
                onPress={async () => await this.navigate()}
            >
                <Icon name="chatboxes"/>
            </TouchableOpacity>
        );
    }
}
