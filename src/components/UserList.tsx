/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as _ from 'lodash';
import { Text } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native';
import * as Animatable from 'react-native-animatable';
import UserCard from './UserCard';

interface IWithToken {
    nextToken?: any;
}

interface IProps {
    ids: string[] | undefined;
    query: any;
    queryName: string;
    nextToken?: string | null;
    variables?: IWithToken;
    fetchMore?: any;
    onRefresh?: () => void;
    refreshing?: boolean;
}

export default class UserList extends React.Component<IProps> {
    public render() {
        const { ids } = this.props;

        if (!ids) {
            console.log('No UserList ids');
            return;
        }

        return (
            <FlatList
                data={ids}
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 10, flexGrow: 1 }}
                keyExtractor={(item: string) => item}
                renderItem={({ item }) => {
                    return (
                        <UserCard userId={item} />
                    );
                }}
                onEndReached={() => {
                    if (!this.props.nextToken) {
                        return;
                    }

                    if (this.props.fetchMore && this.props.variables) {
                        this.props.fetchMore({
                            query: this.props.query,
                            variables: this.props.variables,
                            updateQuery: (previousResult: any, more: any) => {
                                if (more &&
                                    more.fetchMoreResult &&
                                    more.fetchMoreResult[this.props.queryName]
                                ) {
                                    if (!_.isEqual(more.fetchMoreResult,
                                        more.fetchMoreResult![this.props.queryName])) {
                                        const oldItems = previousResult[this.props.queryName].items;
                                        const newItems = more.fetchMoreResult[this.props.queryName].items;
                                        if (oldItems[oldItems.length - 1] !== newItems[newItems.length - 1]) {
                                            previousResult[this.props.queryName].items = [...oldItems, ...newItems];
                                        }
                                        previousResult[this.props.queryName].nextToken =
                                            more.fetchMoreResult[this.props.queryName].nextToken;
                                    }
                                }
                                return previousResult;
                            },
                        });
                    }
                }}
                onRefresh={this.props.onRefresh}
                refreshing={this.props.refreshing}
                ListEmptyComponent={(
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text
                                style={{ textAlign: 'center', fontSize: 18, fontFamily: platform.brandFontFamily }}
                            >
                                Woooah, it's empty in here!
                                </Text>
                            </View>
                        <Animatable.Image
                            resizeMode="contain"
                            style={{ marginBottom: 10, width: '100%', height: 150 }}
                            source={require('../../assets/img/box.png')}
                            animation="bounce"
                            iterationCount="infinite"
                            duration={2000}
                            useNativeDriver={true}
                        />
                    </View>
                )}
            />
        );
    }
}
