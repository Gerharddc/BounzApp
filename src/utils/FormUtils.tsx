/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { AgeFromDate } from 'age-calculator';
import { Body, CheckBox, ListItem, Text, Textarea } from 'native-base';
import * as React from 'react';
import { ViewStyle } from 'react-native';
import { BaseFieldProps, Field, GenericField, WrappedFieldProps } from 'redux-form';

import DatePicker from 'components/DatePicker';
import ListViewSelect from 'components/ListViewSelect';
import ValidatedInput from 'components/ValidatedInput';

interface IFieldProps {
    label: string;
    style?: ViewStyle;
}

/* CheckBox field */

const renderCheckBox: React.SFC<WrappedFieldProps & IFieldProps> = (props) => {
    const { meta, input } = props;
    const { error } = meta;

    return (
        <ListItem style={{ marginLeft: 0 }}>
            <CheckBox
                checked={input.value || false}
                onPress={() => input.onChange(!input.value)}
                onFocus={input.onFocus as () => void}
                onBlur={input.onBlur}
            />
            <Body>
                <Text>{props.label || ''}</Text>
            </Body>
        </ListItem>
    );
};

const CheckBoxFieldInternal = Field as new () => GenericField<IFieldProps>;
type CheckBoxFieldProps = BaseFieldProps<IFieldProps> & IFieldProps;
export const CheckBoxField: React.SFC<CheckBoxFieldProps> = (props) => (
    <CheckBoxFieldInternal {...props} component={renderCheckBox} />
);

/* Input field */

interface IInputFieldProps extends IFieldProps {
    secure?: boolean;
    email?: boolean;
}

const renderInput: React.SFC<WrappedFieldProps & IInputFieldProps> = (props) => {
    const { meta, input } = props;
    const { error } = meta;

    return (
        <ValidatedInput
            valid={meta.valid} invalid={meta.invalid} dirty={meta.dirty}
            label={props.label || ''} value={input.value} onChange={input.onChange}
            onBlur={input.onBlur} onFocus={input.onFocus as () => void}
            secure={props.secure} email={props.email}
            asyncValidating={meta.asyncValidating} error={error}
        />
    );
};

const InputFieldInternal = Field as new () => GenericField<IInputFieldProps>;
type InputFieldProps = BaseFieldProps<IInputFieldProps> & IInputFieldProps;
export const InputField: React.SFC<InputFieldProps> = (props) => (
    <InputFieldInternal {...props} component={renderInput} />
);

/* TextArea field */

const renderTextField: React.SFC<WrappedFieldProps> = (props) => {
    const { input } = props;

    return (
        <Textarea
            value={input.value} onChange={input.onChange}
            onBlur={input.onBlur} onFocus={input.onFocus as () => void}
            rowSpan={5} placeholder={props.label || ''}
        />
    );
};

const TextAreaFieldInternal = Field as new () => GenericField<{}>;
export const TextAreaField: React.SFC<InputFieldProps> = (props) => (
    <TextAreaFieldInternal {...props} component={renderTextField} />
);

/* Date field */

type IDateFieldProps = IFieldProps;

const renderDatePicker: React.SFC<WrappedFieldProps & IDateFieldProps> = (props) => {
    const { meta, input } = props;
    const { error } = meta;

    return (
        <DatePicker
            label={props.label} invalid={meta.invalid} onChange={input.onChange}
            error={error} value={input.value} dirty={meta.dirty} style={props.style}
        />
    );
};

const DateFieldInternal = Field as new () => GenericField<IDateFieldProps>;
type DateFieldProps = BaseFieldProps<IDateFieldProps> & IDateFieldProps;
export const DateField: React.SFC<InputFieldProps> = (props) => (
    <DateFieldInternal {...props} component={renderDatePicker} />
);

/* Select field */

interface ISelectFieldProps extends IFieldProps {
    list: string[];
}

const renderSelect: React.SFC<WrappedFieldProps & ISelectFieldProps> = (props) => {
    const { meta, input } = props;
    const { error } = meta;

    return (
        <ListViewSelect
            list={props.list} onChange={input.onChange}
            label={props.label} value={input.value}
        />
    );
};

const SelectFieldInternal = Field as new () => GenericField<ISelectFieldProps>;
type SelectFieldProps = BaseFieldProps<ISelectFieldProps> & ISelectFieldProps;
export const SelectField: React.SFC<SelectFieldProps> = (props) => (
    <SelectFieldInternal {...props} component={renderSelect} />
);

/* Other */

import PasswordValidator from 'password-validator';
const schema = new PasswordValidator();
schema
    .is().min(8)
    .has().uppercase()
    .has().lowercase()
    .has().digits();
export const strongPassword = (value: string) => {
    if (!value) {
        return undefined;
    }

    const errors: [string] | null = schema.validate(value, { list: true });
    if (errors) {
        switch (errors[0]) {
            case 'min':
                return 'At least 8 characters';
            case 'uppercase':
                return 'At least 1 uppercase character';
            case 'lowercase':
                return 'At least 1 lowercase character';
            case 'digits':
                return 'At least 1 digit';
        }
    }

    return undefined;
};

import twitter from 'twitter-text';

export const notEmpty = (value: any) => (value) ? undefined : 'Required';
export const minAge = (value: Date) => (new AgeFromDate(value).age < 16) ? 'You have to be at least 16' : undefined;
export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : 'Not a valid address';
export const isNotEmail = (value: string) => isEmail(value) ? undefined : 'May not be email';
export const validUserName = (value: string) => twitter.isValidUsername('@' + value) ? undefined : 'Invalid characters';

export const genders = [
    'Male',
    'Female',
    'Other',
];
