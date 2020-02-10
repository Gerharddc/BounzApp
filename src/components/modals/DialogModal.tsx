/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import JumpingLogo from 'components/JumpingLogo';
import { Button, Input, Item, Label, Text } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import { Dialog, DialogButton, IDialogState, InputDialog } from 'reducers/dialog';
import { Dispatch } from 'redux';

interface IProps {
    dialogState: IDialogState;
    dispatch: Dispatch<any>;
}

class DialogModal extends React.Component<IProps> {
    state = {
        inputValue: undefined,
    };

    componentWillReceiveProps(props: IProps) {
        if (props.dialogState.topDialog !== this.props.dialogState.topDialog &&
            props.dialogState.topDialog instanceof InputDialog) {
            this.setState({ inputValue: props.dialogState.topDialog.startValue });
        }
    }

    buttons(buttons: DialogButton[] | undefined) {
        if (buttons) {
            return buttons.map((button, i) => {
                return (
                    <View key={i} style={{ width: '100%' }}>
                        <Button block onPress={() => button.action(this.state.inputValue)}>
                            <Text>{button.title}</Text>
                        </Button>
                    </View>);
            });
        }
    }

    renderInside(dialog: Dialog) {
        return (
            <View>
                <Text style={styles.mainTitle}>{dialog.title}</Text>
                <Text>{dialog.details}</Text>
                {dialog instanceof InputDialog &&
                    <Item floatingLabel>
                        <Label>{dialog.fieldName}</Label>
                        <Input
                            value={this.state.inputValue}
                            onChangeText={(text) => this.setState({ inputValue: text })}
                        />
                    </Item>
                }
                {this.buttons.bind(this)(dialog.buttons)}
            </View>
        );
    }

    render() {
        const dialogState = this.props.dialogState;
        const dialog = dialogState.topDialog;
        const visible = dialog ? true : false;

        if (!visible) {
            return null;
        }

        return (
            <Modal isVisible={true} useNativeDriver={true}>
                <StatusBar backgroundColor="black" />
                <View style={styles.container}>
                    <View style={{ height: 10 }} />
                    {dialog && this.renderInside.bind(this)(dialog)}
                    {dialogState.isBusy &&
                        <View style={{ alignItems: 'center', height: 75 * 1.5 }}>
                            <JumpingLogo size={75} />
                        </View>
                    }
                </View>
            </Modal>
        );
    }
}

function mapStateToProps(state: IReduxState) {
    return { dialogState: state.dialog };
}

function mapDispatchToProps(dispatch: any) {
    return { dispatch };
}

const styles = StyleSheet.create({
    mainTitle: {
        fontSize: platform.fontSizeH2,
        fontFamily: platform.brandFontFamily,
        textAlign: 'center',
    },
    container: {
        // flex: 1,
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(DialogModal);
