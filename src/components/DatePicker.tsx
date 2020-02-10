/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { Button, Content, Text } from 'native-base';
import * as React from 'react';
import { ViewStyle } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { validateYupSchema } from 'formik';

interface IProps {
    label: string;
    valid?: boolean;
    invalid?: boolean;
    onChange: (value: Date) => void;
    value?: Date;
    error?: string;
    dirty: boolean;
    style?: ViewStyle;
    mode?: any;
}

export default class DatePicker extends React.Component<IProps> {
    state = {
        pickerVisible: false,
    };

    private handleConfirm(date: Date) {
        this.setState({ pickerVisible: false });
        this.props.onChange(date);
    }

    private handleCancel() {
        this.setState({ pickerVisible: false });
    }

    private doOpen() {
        this.setState({ pickerVisible: true });
    }

    private determineText() {
        const { error, label, value, dirty } = this.props;

        if (error && dirty) {
            return error;
        } else if (value) {
            if (this.props.mode === 'datetime') {
                return label + ': ' + value.toDateString() + ' ' + value.toString().substr(11, 5);
            } else {
                return label + ': ' + value.toDateString();
            }
        } else {
            return 'Choose ' + label;
        }
    }

    public render() {
        const { value, label, valid, invalid, dirty, style } = this.props;

        return (
            <Content style={style}>
                <DateTimePicker
                    isVisible={this.state.pickerVisible}
                    onConfirm={this.handleConfirm.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    date={(value) ? value : new Date()}
                    mode={this.props.mode}
                />
                <Button block bordered onPress={this.doOpen.bind(this)} success={valid && dirty}
                    danger={invalid && dirty}
                >
                    <Text>{this.determineText.bind(this)()}</Text>
                </Button>
            </Content>
        );
    }
}
