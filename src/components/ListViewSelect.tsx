/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as React from 'react';
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Collapsible from 'react-native-collapsible';

import variables from 'native-base-theme/variables/platform';

// const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => (r1 !== r2) });

interface IProps {
    list: string[];
    label: string;
    value: string;
    onChange: (value: string) => void;
}

export default class ListViewSelect extends React.Component<IProps> {
    state = {
        isVisible: false,
    };

    private handleClick(rowData: string) {
        this.setState({ isVisible: false });
        this.props.onChange(rowData);
    }

    private renderRow(rowData: string) {
        return (
            <View>
                <View style={Style.separator} />
                <TouchableOpacity onPress={() => this.handleClick(rowData)}>
                    <Text style={Style.rowText}>{rowData}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    private renderList() {
        return (
            <Collapsible collapsed={!this.state.isVisible}>
                <FlatList
                    style={Style.listView}
                    data={this.props.list}
                    renderItem={(rowData) => this.renderRow(rowData.item)}
                    automaticallyAdjustContentInsets={false}
                    keyExtractor={(item) => item}
                />
            </Collapsible>
        );
    }

    public render() {
        const { value, label } = this.props;

        let title;
        if (value) {
            title = label + ': ' + value;
        } else {
            title = 'Select ' + label;
        }

        return (
            <TouchableOpacity onPress={() => this.setState({ isVisible: !this.state.isVisible })}>
                <View style={Style.background}>
                    <Text style={Style.buttonText}>
                        { Platform.OS === 'android' ? title!.toUpperCase() : title }
                    </Text>
                    {this.renderList()}
                </View>
            </TouchableOpacity>
        );
    }
}

const Style = StyleSheet.create({
    background: {
        borderRadius: variables.borderRadiusBase,
        backgroundColor: 'transparent',
        padding: variables.buttonPadding,
        marginVertical: variables.buttonPadding,
        borderColor: 'black',
        borderWidth: variables.borderWidth * 2,
    },
    rowText: {
        padding: 10,
        color: variables.textColor,
    },
    separator: {
        height: variables.borderWidth,
        marginHorizontal: 8,
        backgroundColor: 'grey',
    },
    buttonText: {
        textAlign: 'center',
        fontSize: variables.btnTextSize,
        padding: variables.buttonPadding,
        color: 'black',
    },
    listView: {
        marginTop: 10,
    },
});

// Inspired by https://github.com/JamesWatling/react-native-list-view-select
