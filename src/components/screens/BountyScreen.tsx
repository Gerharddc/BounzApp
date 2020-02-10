/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { gotoPurchaseBounty } from 'actions/nav';
import * as API from 'API';
import Analytics from '@aws-amplify/analytics';
import gql from 'graphql-tag';
import * as queries from 'graphql/queries';
import { Body, Button, Card, CardItem, Icon, Text } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { Query } from 'react-apollo';
import { ScrollView, TouchableOpacity, View, RefreshControl } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import { navigate } from 'utils/NavigationService';
import MoneyBadge from './MoneyBadge';

interface IProps {
    myUserId: string;
}

class BountyScreen extends React.Component<IProps> {
    componentDidMount() {
        Analytics.record({
            name: 'viewBountyScreen',
        });
    }

    static navigationOptions = {
        title: 'Bounty',
    };

    state = {
        collapsed: true,
        refreshing: false,
    };

    private renderDescription() {
        return (
            <Card>
                <CardItem bordered style={{ padding: 0, margin: 0 }}>
                    <Text style={{ color: 'black' }}>What is bounty?</Text>
                    <View style={{ flex: 1, height: '100%' }} />
                    <TouchableOpacity onPress={() => this.setState({ collapsed: !this.state.collapsed })}>
                        <Icon name={this.state.collapsed ? 'add' : 'remove'} style={{ textAlign: 'right' }} />
                    </TouchableOpacity>
                </CardItem>
                <Collapsible collapsed={this.state.collapsed}>
                    <CardItem bordered>
                        <Body>
                            <Text style={{ color: 'black' }}>
                                Bounty is an awesome new concept for post promotion. Anyone who wants to promote a post
                                (like an advertiser) can attach bounty and anyone who bounzes a post with bounty
                                receives a part of that bounty equal to the amount of new receipts they generate for
                                the post (if there is enough bounty left). Bounty can then be redeemed as real money
                                if you have more than the minimum payout amount.
                            </Text>
                        </Body>
                    </CardItem>
                </Collapsible>
            </Card>
        );
    }

    public render() {
        return (
            <Query<API.GetUserBountyQuery>
                query={gql(queries.getUserBounty)}
                variables={{ userId: this.props.myUserId }}
                fetchPolicy="cache-and-network"
            >
                {({ data, error, refetch }) => {
                    if (!data || !data.getUserBounty) {
                        return null; // TODO: loading
                    }

                    return(
                    <ScrollView contentContainerStyle={{ padding: 10 }}
                        style={{ flex: 1 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => refetch()}
                            />}>
                        {this.renderDescription()}
                        <MoneyBadge
                            title="Your balance"
                            amountText={(data.getUserBounty.bounty! || 0).toString()}
                            icon="wallet"
                        />
                        <Button block onPress={() => navigate(gotoPurchaseBounty())}>
                            <Text>Buy more</Text>
                        </Button>
                        <Button block>
                            <Text>Request payout</Text>
                        </Button>
                    </ScrollView>
                    );}}
            </Query>
        );
    }
}

function mapStateToProps(state: IReduxState) {
    return {
        myUserId: state.users.myUserId,
    };
}

export default connect(mapStateToProps)(BountyScreen);
