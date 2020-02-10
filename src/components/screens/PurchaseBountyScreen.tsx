/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import Analytics from '@aws-amplify/analytics';
import md5 from 'md5';
import { Button, Input, Item, Label, Text } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import system from 'system-exports';
import MoneyBadge from './MoneyBadge';

const FAIL_URL = 'https://bs.bounz.io/fail';
const SUCCESS_URL = 'https://bs.bounz.io/success';

const PRICE_PER_BOUNTY = 1 / 50;
const MIN_PURCHASE = 50;

interface IProps {
    myUserId: string;
}

class PurchaseBountyScreen extends React.Component<IProps> {
    componentDidMount() {
        Analytics.record({
            name: 'viewPurchaseBountyScreen',
        });
    }

    static navigationOptions = {
        title: 'Purcahse bounty',
    };

    state = {
        html: undefined as string | undefined,
        baseUrl: undefined as string | undefined,
        success: false,
        amount: undefined,
        loading: false,
    };

    private async makePayment() {
        this.setState({ loading: true });

        // TODO: provide more fields
        const pars = [
            { key: 'merchant_id', value: '10011632' },
            { key: 'merchant_key', value: 'rzhcchdhi13do' },
            { key: 'return_url', value: SUCCESS_URL },
            { key: 'cancel_url', value: FAIL_URL },
            { key: 'notify_url', value: system.compute_rest_endpoint + '/PaymentCallback' },
            { key: 'amount', value: this.price!.toFixed(2) },
            { key: 'item_name', value: 'Bounty' },
            { key: 'custom_str1', value: this.props.myUserId },
        ];

        let str = '';
        const formData = new FormData();
        for (const par of pars) {
            formData.append(par.key, par.value.trim());
            str += par.key + '=' + encodeURIComponent(par.value) + '&';
        }
        str = str.slice(0, -1);
        formData.append('signature', md5(str));

        const result = await fetch('https://sandbox.payfast.co.za/eng/process', { body: formData, method: 'post' });
        const text = await result.text();

        this.setState({ html: text, baseUrl: result.url, loading: false });
    }

    private renderActivity() {
        return (
            <ActivityIndicator
                color={platform.brandBackground}
                size="large"
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            />
        );
    }

    private get price() {
        if (!this.state.amount) {
            return undefined;
        }

        return this.state.amount! * PRICE_PER_BOUNTY;
    }

    private renderButton() {
        if (!this.state.amount) {
            return (
                <Button block disabled={true}>
                    <Text>Proceed to payment</Text>
                </Button>
            );
        }

        if (this.price! < MIN_PURCHASE) {
            return (
                <Button block warning disabled>
                    <Text>Minimum purchase of R{MIN_PURCHASE}</Text>
                </Button>
            );
        }

        return (
            <Button block onPress={this.makePayment.bind(this)} disabled={!this.state.amount}>
                <Text>Purchase for R{this.price}</Text>
            </Button>
        );
    }

    public render() {
        if (this.state.html) {
            return (
                <WebView
                    style={{ flex: 1 }}
                    source={{ html: this.state.html, baseUrl: this.state.baseUrl }}
                    onNavigationStateChange={(e) => {
                        if (e.url === FAIL_URL) {
                            this.setState({ html: undefined, baseUrl: undefined });
                        } else if (e.url === SUCCESS_URL) {
                            this.setState({ html: undefined, baseUrl: undefined, success: true });
                        }
                    }}
                    renderLoading={this.renderActivity}
                    startInLoadingState={true}
                />
            );
        }

        if (this.state.success) {
            return (
                <View style={{ padding: 10, flex: 1 }}>
                    <Text>Success</Text>
                    <Button block onPress={() => this.setState({ success: false })}>
                        <Text>Great</Text>
                    </Button>
                </View>
            );
        }

        if (this.state.loading) {
            return this.renderActivity();
        }

        return (
            <View style={{ flex: 1, padding: 10 }}>
                <MoneyBadge
                    title="Price per bounty"
                    amountText={PRICE_PER_BOUNTY.toString()}
                    icon="coins"
                />
                <MoneyBadge
                    title="Minimum purchase"
                    amountText={'R' + MIN_PURCHASE.toString()}
                    icon="coins"
                />
                <Item stackedLabel>
                    <Label style={{ color: 'black' }}>Amount of bounty to purchase</Label>
                    <Input
                        value={this.state.amount}
                        onChangeText={(amount) => this.setState({ amount })}
                        style={{ color: 'black' }}
                        placeholder="Enter a bounty amount here"
                        placeholderTextColor="gray"
                    />
                </Item>
                {this.renderButton()}
            </View>
        );
    }
}

function mapStateToProps(state: IReduxState) {
    return {
        myUserId: state.users.myUserId,
    };
}

export default connect(mapStateToProps)(PurchaseBountyScreen);
