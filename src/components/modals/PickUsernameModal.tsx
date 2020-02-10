/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { DoesUsernameExist } from 'logic/Login';
import { Button, Form, Text } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import { TextCB } from 'reducers/auth';
import { Dispatch } from 'redux';
import { InjectedFormProps, reduxForm } from 'redux-form';
import * as FormUtils from 'utils/FormUtils';

interface IValues {
    username: string;
}

const renderForm: React.SFC<InjectedFormProps<IValues>> = (props) => {
    const { handleSubmit } = props;

    return (
        <Form>
            <FormUtils.InputField name="username" label="Username"
                validate={[FormUtils.notEmpty, FormUtils.isNotEmail, FormUtils.validUserName]}
            />
            <Button block style={{ marginTop: 30 }}
                onPress={handleSubmit as () => any}
                disabled={props.pristine || props.invalid || (props.asyncValidating !== false)}
            >
                <Text>Let's go!</Text>
            </Button>
        </Form>
    );
};

function asyncValidate(values: IValues) {
    return new Promise(async (resolve, reject) => {
        try {
            if (values.username) {
                const username = await DoesUsernameExist(values.username);
                if (username) {
                    reject({ username: 'Already taken' });
                    return;
                }
            }

            resolve();
        } catch (e) {
            console.log(e);

            const err = 'Server error';
            reject({ username: err });
        }
    });
}

const UsernameForm = reduxForm({
    form: 'username',
    asyncValidate,
})(renderForm);

interface IProps {
    request?: { cb: TextCB, canCancel: boolean };
    dispatch: Dispatch<any>;
}

class PickUsernameModal extends React.Component<IProps> {
    private onSubmit(values: IValues) {
        this.props.request!.cb(values.username);
    }

    private onCancel() {
        this.props.request!.cb(undefined);
    }

    public render() {
        const { request } = this.props;

        if (!request) {
            return null;
        }

        return (
            <Modal isVisible={true} useNativeDriver={true}>
                <View style={styles.container}>
                    <Text style={styles.mainTitle}>Please pick a Bounz username</Text>
                    <UsernameForm onSubmit={this.onSubmit.bind(this)}/>
                    {request.canCancel && <Button block onPress={this.onCancel.bind(this)}>
                        <Text>Cancel</Text>
                    </Button>}
                </View>
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
        padding: 10,
        borderRadius: 10,
    },
});

function mapStateToProps(state: IReduxState) {
    return {
        request: state.auth.usernameRequest,
    };
}

function mapDispatchToProps(dispatch: any) {
    return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(PickUsernameModal);
