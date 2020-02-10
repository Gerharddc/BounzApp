/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import Analytics from '@aws-amplify/analytics';
import { Text } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Pie } from 'react-native-progress';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers';

interface IProps {
    confirmBounz?: (confirm: boolean) => void;
}

class BounzCancelTimer extends React.Component<IProps> {
    state = {
        progress: 0,
        confirming: undefined as any,
        confirmed: undefined as any,
    };

    incrementProgress() {
        if (!this.state.confirming) {
            return;
        }

        if (this.state.progress < 1) {
            this.setState({ progress: this.state.progress + 0.05 });
        } else {
            this.state.confirming(true);
            this.setState({ confirming: undefined, confirmed: this.state.confirming });
        }

        setTimeout(this.incrementProgress.bind(this), 2000 / 20);
    }

    componentDidUpdate() {
        if (this.state.confirming !== this.props.confirmBounz && this.props.confirmBounz !== this.state.confirmed) {
            if (this.state.confirming) {
                this.state.confirming(true);
            }

            this.setState({ progress: 0, confirming: this.props.confirmBounz, confirmed: undefined });
            setTimeout(this.incrementProgress.bind(this), 2000 / 20);
        }
    }

    render() {
        if (!this.state.confirming) {
            return null;
        }

        return (
            <View style={{
                backgroundColor: 'white',
                position: 'absolute',
                bottom: 5,
                left: 5,
                right: 5,
                height: 40,
                flexDirection: 'row',
                borderRadius: 20,
                borderColor: 'white',
                borderWidth: 2,
                overflow: 'hidden',
            }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Pie size={38} progress={this.state.progress} borderWidth={0} color={platform.brandPrimaryDarker}/>
                </View>
                <TouchableOpacity style={styles.buttonOpacity} onPress={() => {
                    Analytics.record({
                        name: 'dismissUndoBounz',
                    });

                    this.state.confirming(true);
                    this.setState({ confirming: undefined, confirmed: this.state.confirming });
                }}>
                    <Text style={{ color: 'white' }}>Dismiss</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonOpacity} onPress={() => {
                    Analytics.record({
                        name: 'undoBounz',
                    });

                    this.state.confirming(false);
                    this.setState({ confirming: undefined, confirmed: this.state.confirming });
                }}>
                    <Text style={{ color: 'white' }}>Undo bounz</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonOpacity: {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'white',
        paddingHorizontal: 10,
        backgroundColor: platform.brandPrimaryDarker,
        borderRadius: 20,
        marginLeft: 2,
    },
});

function mapStateToProps(state: IReduxState) {
    return {
        confirmBounz: state.dialog.confirmBounz,
    };
}

export default connect(mapStateToProps)(BounzCancelTimer);
