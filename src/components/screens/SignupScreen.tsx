/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { Button, Content, Form, Text, CheckBox, ListItem, Body } from 'native-base';
import * as React from 'react';
import { StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { InjectedFormProps, reduxForm } from 'redux-form';

import * as authActions from 'actions/auth';
import * as Dialog from 'actions/dialog';
import * as navActions from 'actions/nav';
import { DoesEmailExist, SignupUser } from 'logic/Login';
import platform from 'native-base-theme/variables/platform';
import { IReduxState } from 'reducers/index';
import * as FormUtils from 'utils/FormUtils';
import { navigate } from 'utils/NavigationService';
import { showErrorDialog, showOkDialog } from 'utils/Prompt';

interface IValues {
    name: string;
    surname: string;
    email: string;
    password: string;
    confirmpassword: string;
    birthdate: Date;
    gender: string;
    oldEnoguh: boolean;
}

const renderForm: React.SFC<InjectedFormProps<IValues>> = (props) => {
    const { handleSubmit } = props as any;

    return (
        <Content style={{ paddingHorizontal: 10 }}>
            <StatusBar backgroundColor={platform.brandPrimaryDarker} />
            <Form>
                <FormUtils.InputField name="name" label="First name"
                    validate={[FormUtils.notEmpty]} />
                <FormUtils.InputField name="surname" label="Surname"
                    validate={[FormUtils.notEmpty]} />
                <FormUtils.InputField name="email" label="Email" email
                    validate={[FormUtils.notEmpty, FormUtils.isEmail]} />
                <FormUtils.InputField name="password" label="Password" secure
                    validate={[FormUtils.strongPassword]} />
                <FormUtils.InputField name="confirmpassword" label="Confirm password" secure />
                <FormUtils.CheckBoxField name="oldEnough" label="I am at least 13 years old"
                    validate={[FormUtils.notEmpty]} />
                {/*<FormUtils.DateField name="birthdate"
                    label="Birth date" style={{ marginTop: 20 }}
                    validate={[FormUtils.notEmpty, FormUtils.minAge]} />
                <FormUtils.SelectField name="gender" label="Gender" list={FormUtils.genders}
    validate={[FormUtils.notEmpty]} />*/}
            </Form>

            <Text style={{ textAlign: 'center', marginTop: 20 }}>
                By signing up you agree to our
            </Text>

            <Button bordered block style={{ marginTop: 10 }} onPress={() => navigate(navActions.gotoPrivacyPolicy())}>
                <Text>Privacy policy</Text>
            </Button>

            <Text style={{ textAlign: 'center' }}>
                and
            </Text>

            <Button bordered block style={{ marginTop: 10 }} onPress={() => navigate(navActions.gotoTerms())}>
                <Text>Terms of service</Text>
            </Button>

            <Button block style={{ marginTop: 10, marginBottom: 10 }}
                onPress={handleSubmit as () => any}
                disabled={props.pristine || props.invalid || (props.asyncValidating !== false)}
            >
                <Text>Let's go!</Text>
            </Button>
        </Content>
    );
};

function validate(values: IValues) {
    const errors: any = {};

    if (values.confirmpassword !== values.password) {
        errors.confirmpassword = 'Passwords do not match';
    }

    return errors;
}

function asyncValidate(values: IValues) {
    return new Promise(async (resolve, reject) => {
        try {
            if (values.email) {
                const email = await DoesEmailExist(values.email);
                if (email) {
                    reject({ email: 'Already taken' });
                    return;
                }
            }

            resolve();
        } catch (e) {
            const err = 'Server error';
            reject({ email: err });
        }
    });
}

const SignupForm = reduxForm({
    form: 'signup',
    validate,
    asyncValidate,
    asyncBlurFields: ['email'],
})(renderForm);

interface IProps {
    dispatch: Dispatch<any>;
}

class SignupPage extends React.Component<IProps> {
    static navigationOptions = {
        title: 'Sign up',
    };

    private async submit(values: IValues) {
        const { dispatch } = this.props;

        dispatch(Dialog.setBusy());
        try {
            await SignupUser(values);

            dispatch(authActions.setUsername(values.email));
            dispatch(authActions.setPassword(values.password));

            showOkDialog(
                'Almost done',
                'Just confirm your email with the link that was sent to you and then you can log in.',
            );

            navigate(navActions.gotoLogin());
        } catch (e) {
            showErrorDialog(e.message);
        } finally {
            dispatch(Dialog.unsetBusy());
        }
    }

    public render() {
        return (
            <SignupForm onSubmit={this.submit.bind(this)} />
        );
    }
}

function mapStateToProps(state: IReduxState) {
    return {};
}

function mapDispatchToProps(dispatch: any) {
    return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);
