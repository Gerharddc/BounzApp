/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import Analytics from '@aws-amplify/analytics';
import { Content, Text } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import Collapsible from 'react-native-collapsible';

// tslint:disable-next-line:no-var-requires
const licenses = require('../../../assets/licenses.json');

export default class LicensesScreen extends React.Component {
    componentDidMount() {
        Analytics.record({
            name: 'viewLicensesScreen',
        });
    }

    static navigationOptions = {
        title: 'Licenses',
    };

    state = {
        openedSet: new Set<string>(),
    };

    private toggleLicense(title: string) {
        const openedSet = new Set(this.state.openedSet);

        if (openedSet.has(title)) {
            openedSet.delete(title);
        } else {
            openedSet.add(title);
        }

        this.setState({ openedSet });
    }

    private renderLicense(license: { title: string, text: string }) {
        const { title, text } = license;

        return (
            <TouchableOpacity
                onPress={() => this.toggleLicense(title)}
                style={{ marginBottom: 7, borderRadius: 5, backgroundColor: platform.brandPrimary, padding: 7 }}
                key={ title }
            >
                <Text style={{ textAlign: 'center', fontSize: 18, color: 'white', fontWeight: 'bold' }}>
                    {title}
                </Text>
                <Collapsible collapsed={!this.state.openedSet.has(title)}>
                    <Text style={{ color: 'white', textAlign: 'justify', width: '100%', marginTop: 5 }}>
                        {text}
                    </Text>
                </Collapsible>
            </TouchableOpacity>
        );
    }

    public render() {
        return (
            <Content padder>
                <Text style={{ color: 'black' }}>
                    We are privileged to live in a world of open-source software without which Bounz would not be
                    possible.
                </Text>
                <Text style={{ color: 'black', marginTop: 5, marginBottom: 10 }}>
                    As such, it is with gratitude that we include the following licenses:
                </Text>
                { licenses.list.map((license: any) => this.renderLicense(license)) }
            </Content>
        );
    }
}
