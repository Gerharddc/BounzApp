/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Herman Lombard
 */

import * as NavActions from 'actions/nav';
import Analytics from '@aws-amplify/analytics';
import { Button, Content, Icon, Text } from 'native-base';
import * as React from 'react';
import { navigate } from 'utils/NavigationService';

const PAD = 25;

export default class LegalScreen extends React.Component {
    componentDidMount() {
        Analytics.record({
            name: 'viewLegalScreen',
        });
    }

    static navigationOptions = {
        title: 'Legal Information',
    };

    public render() {
        return (
            <Content padder>
                <Button block iconLeft onPress={() => navigate(NavActions.gotoPrivacyPolicy())}>
                    <Icon name="paper" />
                    <Text style={{ paddingRight: PAD }}>Privacy Policy</Text>
                </Button>
                <Button block iconLeft onPress={() => navigate(NavActions.gotoTerms())}>
                    <Icon name="paper" />
                    <Text style={{ paddingRight: PAD }}>Terms of Service</Text>
                </Button>
                <Button block iconLeft onPress={() => navigate(NavActions.gotoLicenses())}>
                    <Icon name="paper" />
                    <Text style={{ paddingRight: PAD }}>Licenses</Text>
                </Button>
            </Content>
        );
    }
}
