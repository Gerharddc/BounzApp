/**
 * Copyright (c) 2017-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import JumpingLogo from 'components/JumpingLogo';
import { Text } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import { Dispatch } from 'redux';

interface IProps {
    loggingIn: boolean;
    dispatch: Dispatch<any>;
}

class LoggingInModal extends React.Component<IProps> {
    render() {
        if (!this.props.loggingIn) {
            return null;
        }

        return (
            <Modal isVisible={true} useNativeDriver={true}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.mainTitle}>Logging in</Text>
                </View>
                <View style={{ alignItems: 'center', height: 75 * 1.5 }}>
                    <JumpingLogo size={75} />
                </View>
                <StatusBar backgroundColor="black"/>
            </Modal>
        );
    }
}

function mapStateToProps(state: IReduxState) {
    return { loggingIn: state.auth.loggingIn };
}

function mapDispatchToProps(dispatch: any) {
    return { dispatch };
}

const styles = StyleSheet.create({
    mainTitle: {
        fontSize: 50,
        marginTop: 20,
        fontFamily: platform.brandFontFamily,
        textAlign: 'center',
        color: platform.brandPrimary,
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(LoggingInModal);
