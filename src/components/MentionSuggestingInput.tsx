/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as API from 'API';
import MentionsTextInput from 'components/MentionsTextInput';
import fontColorContrast from 'font-color-contrast';
import gql from 'graphql-tag';
import * as queries from 'graphql/queries';
import * as React from 'react';
import { Query } from 'react-apollo';
import { ActivityIndicator, StyleProp, Text, TextStyle, TouchableOpacity, View } from 'react-native';

interface IProps {
    value: string;
    onChangeText: (text: string) => void;
    fontColor: string;
    style?: StyleProp<TextStyle>;
    placeholderTextColor?: string;
    disabled?: boolean;
    placeholder?: string;
}

export default class MentionSuggestingInput extends React.Component<IProps> {
    state = {
        search: '',
    };

    private renderLoading(noResults: boolean) {
        const contrast = fontColorContrast(this.props.fontColor);

        if (noResults) {
            return () => (
                <View style={{ paddingLeft: 5, height: '100%', justifyContent: 'center' }}>
                    <Text style={{ color: contrast }}>No results</Text>
                </View>
            );
        } else {
            return () => (
                <ActivityIndicator
                    style={{ height: '100%', paddingLeft: 5 }}
                    color={contrast}
                />
            );
        }
    }

    private triggerCallback(text: string) {
        this.setState({ search: text.replace('@', '') });
    }

    private renderRow({ item }: any, hidePanel: () => void) {
        const contrast = fontColorContrast(this.props.fontColor);

        return (
            <TouchableOpacity
                style={{
                    height: '100%',
                    backgroundColor: contrast,
                    padding: 7,
                    borderRadius: 5,
                    marginRight: 5,
                    justifyContent: 'center',
                }}
                onPress={() => {
                    hidePanel();
                    this.props.onChangeText(this.props.value.replace('@' + this.state.search, '@' + item.username));
                }}
            >
                <Text style={{ color: this.props.fontColor }}>
                    {item.username}
                </Text>
            </TouchableOpacity>
        );
    }

    public render() {
        return (
            <Query<API.SearchUsersQuery>
                query={gql(queries.searchUsers)}
                variables={{ searchTerm: this.state.search }}
                fetchPolicy="cache-and-network"
            >
                {({ data, loading }) => {
                    const list = (data && data.searchUsers) ?
                        data.searchUsers.filter((item) => item.userId !== 'ghost') : undefined;
                    const noResults = (list) ? (list.length === 0 && !loading) : false;

                    return (
                        <MentionsTextInput
                            style={this.props.style}
                            suggestionsPanelStyle={{
                                backgroundColor: this.props.fontColor,
                                width: '100%',
                                paddingVertical: 5,
                                paddingLeft: 5,
                            }}
                            loadingComponent={this.renderLoading(noResults)}
                            trigger={'@'}
                            triggerLocation={'new-word-only'}
                            value={this.props.value}
                            onChangeText={this.props.onChangeText}
                            triggerCallback={this.triggerCallback.bind(this)}
                            renderSuggestionsRow={this.renderRow.bind(this)}
                            suggestionsData={list}
                            keyExtractor={(item: any) => item.userId}
                            suggestionRowHeight={45}
                            placeholder={this.props.placeholder}
                            placeholderTextColor={this.props.placeholderTextColor}
                            blurOnSubmit={false}
                            disabled={this.props.disabled}
                        />
                    );
                }}
            </Query>
        );
    }
}
