/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { Button, Form, Text } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import { TextCB } from 'reducers/auth';
import { Dispatch } from 'redux';
import { InjectedFormProps, reduxForm } from 'redux-form';
import * as FormUtils from 'utils/FormUtils';

interface IValues {
    password: string;
    confirmpassword: string;
    oldpassword: string;
}

function renderForm(change: boolean) {
    const fn: React.SFC<InjectedFormProps<IValues>> = (props) => {
        const { handleSubmit } = props;

        return (
            <Form style={{ flex: 1 }}>
                <FormUtils.InputField name="password" label="New password" secure
                    validate={[FormUtils.strongPassword]}
                />
                <FormUtils.InputField name="confirmpassword" label="Confirm password" secure />
                {change && <FormUtils.InputField name="oldpassword" label="Old password" secure
                    validate={[FormUtils.notEmpty]}
                />}
                <View style={{ flex: 1 }}/>
                <Button block style={{ marginTop: 30 }}
                    onPress={handleSubmit as () => any}
                    disabled={props.pristine || props.invalid}
                >
                    <Text>Let's go!</Text>
                </Button>
            </Form>
        );
    };

    return fn;
}

function validate(values: IValues) {
    const errors: any = {};

    if (values.confirmpassword !== values.password) {
        errors.confirmpassword = 'Passwords do not match';
    }

    return errors;
}

const PasswordForm = (change: boolean) => reduxForm({
    form: 'password',
    validate,
})(renderForm(change));

interface IProps {
    request?: { cb: TextCB, change: boolean };
    dispatch: Dispatch<any>;
}

class PickPasswordModal extends React.Component<IProps> {
    private onSubmit(values: IValues) {
        this.props.request!.cb(values.password, values.oldpassword);
    }

    private onCancel() {
        this.props.request!.cb(undefined);
    }

    public render() {
        const { request } = this.props;

        if (!request) {
            return null;
        }

        const F = PasswordForm(request.change);

        return (
            <Modal isVisible={true} useNativeDriver={true}>
                <ScrollView style={styles.container} contentContainerStyle={{ padding: 0, flexGrow: 1 }}>
                    <Text style={styles.mainTitle}>Please pick a password</Text>
                    <F onSubmit={this.onSubmit.bind(this)} />
                    {request.change && <Button block onPress={this.onCancel.bind(this)}>
                        <Text>Cancel</Text>
                    </Button>}
                </ScrollView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    mainTitle: {
        fontSize: platform.fontSizeH2,
        fontFamily: platform.brandFontFamily,
        textAlign: 'center',
    },
    container: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        marginTop: getStatusBarHeight(),
    },
});

function mapStateToProps(state: IReduxState) {
    return {
        request: state.auth.passwordRequest,
    };
}

function mapDispatchToProps(dispatch: any) {
    return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(PickPasswordModal);
