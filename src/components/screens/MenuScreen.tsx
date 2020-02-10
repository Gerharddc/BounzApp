/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as NavActions from 'actions/nav';
import Analytics from '@aws-amplify/analytics';
import { Logout } from 'logic/Login';
import { Button, Content, Icon, Text, View } from 'native-base';
import * as React from 'react';
import Config from 'react-native-config';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import { navigate } from 'utils/NavigationService';

const PAD = 25;

interface IProps {
    navigation: any;
    userId: any;
}

class MenuScreen extends React.Component<IProps> {
    componentDidMount() {
        Analytics.record({
            name: 'viewMenuScreen',
        });
    }

    static navigationOptions = {
        title: 'Menu',
    };

    private renderEventsButton() {
        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',

            }}>
                <Button block iconLeft onPress={() => navigate(NavActions.gotoUserEvents())} style={{flex: 1}}>
                    <Icon name="calendar" />
                    <Text style={{ paddingRight: PAD }}>Events</Text>
                </Button>
                <View style={{ width: 8 }}></View>
                <Button block iconLeft onPress={() => navigate(NavActions.gotoUserInvitedEvents())} style={{flex: 1}}>
                    <Icon name="mail" />
                    <Text style={{ paddingRight: PAD }}>Invites</Text>
                </Button>
            </View>
        );
    }

    public render() {
        return (
            <Content padder>
                <Button block iconLeft onPress={() => navigate(NavActions.gotoAbout())}>
                    <Icon name="information-circle" />
                    <Text style={{ paddingRight: PAD }}>About</Text>
                </Button>
                {this.renderEventsButton()}
                <Button block iconLeft onPress={() => navigate(NavActions.gotoLeaderboards())}>
                    <Icon name="trophy" />
                    <Text style={{ paddingRight: PAD }}>Leaderboards</Text>
                </Button>
                {Config.STAGE !== 'prod' &&
                    <Button block iconLeft onPress={() => navigate(NavActions.gotoBounty())}>
                        <Icon name="cash" />
                        <Text style={{ paddingRight: PAD }}>Bounty</Text>
                    </Button>}
                <Button block iconLeft onPress={() => navigate(NavActions.gotoAccount())}>
                    <Icon name="person" />
                    <Text style={{ paddingRight: PAD }}>Manage Account</Text>
                </Button>
                <Button block iconLeft onPress={() => navigate(NavActions.gotoUsage())}>
                    <Icon name="information-circle" />
                    <Text style={{ paddingRight: PAD }}>Using Bounz</Text>
                </Button>
                <Button block iconLeft onPress={() => navigate(NavActions.gotoLegal())}>
                    <Icon name="paper" />
                    <Text style={{ paddingRight: PAD }}>Legal Information</Text>
                </Button>
                <Button block iconLeft onPress={Logout}>
                    <Icon name="exit" />
                    <Text style={{ paddingRight: PAD }}>Sign Out</Text>
                </Button>
            </Content>
        );
    }
}

function mapStateToProps(state: IReduxState) {
    return {
        userId: state.users.myUserId,
    };
}

export default connect(mapStateToProps)(MenuScreen);
