/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { Icon, Input, Item, Label } from 'native-base';
import * as React from 'react';

interface IProps {
    valid: boolean;
    invalid: boolean;
    dirty: boolean;
    label: string;
    value: string;
    onChange: (value: string) => void;
    onFocus: () => void;
    onBlur: (value: string) => void;
    secure?: boolean;
    email?: boolean;
    asyncValidating?: boolean;
    error?: string;
}

export default class ValidatedInput extends React.Component<IProps> {
    private iconName() {
        if (this.props.asyncValidating) {
            return 'sync';
        } else if (this.props.valid) {
            return 'checkmark-circle';
        } else {
            return 'close-circle';
        }
    }

    private labelAdd() {
        const { asyncValidating, error, dirty } = this.props;

        if (asyncValidating) {
            return ' (Checking)';
        } else if (error && dirty) {
            return ' (' + error + ')';
        } else {
            return '';
        }
    }

    public render() {
        const {
            valid, invalid, dirty, label, value,
            onChange, onFocus, onBlur, secure, email,
        } = this.props;

        return (
            <Item
                success={valid && dirty}
                error={invalid && dirty}
                floatingLabel
                style={{ marginLeft: 0 }}
            >
                <Label>{label + this.labelAdd.bind(this)()}</Label>
                <Input value={value} onChangeText={onChange}
                    onFocus={onFocus as () => any}
                    onBlur={() => onBlur(value)}
                    secureTextEntry={secure}
                    keyboardType={email ? 'email-address' : 'default'}
                />
                {dirty && <Icon name={this.iconName.bind(this)()} />}
            </Item>
        );
    }
}
