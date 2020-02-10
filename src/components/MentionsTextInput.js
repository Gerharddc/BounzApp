// Based on https://github.com/harshq/react-native-mentions/blob/master/src/MentionsTextInput.js

import React, { Component } from 'react';
import {
    Text,
    View,
    Animated,
    FlatList,
    ViewPropTypes,
    Platform
} from 'react-native';
import PropTypes from 'prop-types';
import { Input } from 'native-base';

export default class MentionsTextInput extends Component {
    constructor() {
        super();
        this.state = {
            isTrackingStarted: false,
            suggestionRowHeight: new Animated.Value(0),
            open: false,
        }
        this.isTrackingStarted = false;
        this.previousChar = " ";
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.value) {
            this.resetTextbox();
        } else if (this.isTrackingStarted && !nextProps.horizontal && nextProps.suggestionsData.length !== 0) {
            const numOfRows = nextProps.MaxVisibleRowCount >= nextProps.suggestionsData.length ? nextProps.suggestionsData.length : nextProps.MaxVisibleRowCount;
            const height = numOfRows * nextProps.suggestionRowHeight;
            this.openSuggestionsPanel(height);
        }
    }

    startTracking() {
        this.isTrackingStarted = true;
        this.openSuggestionsPanel();
        this.setState({
            isTrackingStarted: true
        })
    }

    stopTracking() {
        this.isTrackingStarted = false;
        this.closeSuggestionsPanel();
        this.setState({
            isTrackingStarted: false
        })
    }

    openSuggestionsPanel(height) {
        this.setState({ open: true });
        Animated.timing(this.state.suggestionRowHeight, {
            toValue: height ? height : this.props.suggestionRowHeight,
            duration: 100,
        }).start();
    }

    closeSuggestionsPanel() {
        Animated.timing(this.state.suggestionRowHeight, {
            toValue: 0,
            duration: 100,
        }).start(() => this.setState({ open: false }));
    }

    updateSuggestions(lastKeyword) {
        this.props.triggerCallback(lastKeyword);
    }

    identifyKeyword(val) {
        if (this.isTrackingStarted) {
            const boundary = this.props.triggerLocation === 'new-word-only' ? 'B' : '';
            const pattern = new RegExp(`\\${boundary}${this.props.trigger}[a-z0-9_-]+|\\${boundary}${this.props.trigger}`, `gi`);
            const keywordArray = val.match(pattern);
            if (keywordArray && !!keywordArray.length) {
                const lastKeyword = keywordArray[keywordArray.length - 1];
                this.updateSuggestions(lastKeyword);
            }
        }
    }

    onChangeText(val) {
        console.log('Disabled: ', this.props.disabled);
        this.props.onChangeText(val); // pass changed text back
        const lastChar = val.substr(val.length - 1);
        const wordBoundry = (this.props.triggerLocation === 'new-word-only') ? this.previousChar.trim().length === 0 : true;
        if (lastChar === this.props.trigger && wordBoundry) {
            this.startTracking();
        } else if (lastChar === ' ' && this.state.isTrackingStarted || val === "") {
            this.stopTracking();
        }
        this.previousChar = lastChar;
        this.identifyKeyword(val);
    }

    resetTextbox() {
        this.previousChar = " ";
        this.stopTracking();
    }

    render() {
        const minHeight = Animated.multiply(this.state.suggestionRowHeight, -1);
        const extra = Platform.OS === 'ios' ? { zIndex: 10, top: minHeight, position: 'absolute' } : {};

        let height = this.props.style.height;
        if (height) {
            height += this.state.open && Platform.OS !== 'ios' ? this.props.suggestionRowHeight : 0;
        }

        return (
            <View style={{ height }}>
                {this.state.open && <Animated.View
                    style={[
                        { ...this.props.suggestionsPanelStyle },
                        { height: this.state.suggestionRowHeight, ...extra },
                    ]}
                >
                    <FlatList
                        keyboardShouldPersistTaps={"always"}
                        horizontal={this.props.horizontal}
                        ListEmptyComponent={this.props.loadingComponent}
                        enableEmptySections={true}
                        data={this.props.suggestionsData}
                        keyExtractor={this.props.keyExtractor}
                        renderItem={(rowData) => { return this.props.renderSuggestionsRow(rowData, this.stopTracking.bind(this)) }}
                    />
                </Animated.View>}
                <Input
                    {...this.props}
                    onChangeText={this.onChangeText.bind(this)}
                    disabled={this.props.disabled}
                />
            </View>
        )
    }
}

MentionsTextInput.propTypes = {
    suggestionsPanelStyle: ViewPropTypes.style,
    loadingComponent: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.element,
    ]),
    trigger: PropTypes.string.isRequired,
    triggerLocation: PropTypes.oneOf(['new-word-only', 'anywhere']).isRequired,
    triggerCallback: PropTypes.func.isRequired,
    renderSuggestionsRow: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.element,
    ]).isRequired,
    suggestionsData: PropTypes.array,
    keyExtractor: PropTypes.func.isRequired,
    horizontal: PropTypes.bool,
    suggestionRowHeight: PropTypes.number.isRequired,
};

MentionsTextInput.defaultProps = {
    suggestionsPanelStyle: { backgroundColor: 'rgba(100,100,100,0.1)' },
    loadingComponent: () => <Text>Loading...</Text>,
    horizontal: true,
}