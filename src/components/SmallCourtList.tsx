/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as API from 'API';
import gql from 'graphql-tag';
import * as queries from 'graphql/queries';
import * as _ from 'lodash';
import * as React from 'react';
import { Query } from 'react-apollo';
import { ActivityIndicator, FlatList, StyleProp, ViewStyle } from 'react-native';
import SmallCourtCard from './SmallCourtCard';

interface IProps {
    items: Array<{ courtId: string }> | null;
    style?: StyleProp<ViewStyle>;
    itemWidth: number;
    nextToken?: string | null;
    fetchMore?: any;
    variables?: any;
    query: any;
    queryName: string;
}

export default class SmallCourtList extends React.Component<IProps> {
    private renderItem(item: { courtId: string }) {
        return (
            <Query<API.GetCourtInfoQuery>
                query={gql(queries.getCourtInfo)}
                variables={{ courtId: item.courtId }}
                fetchPolicy="cache-and-network"
            >
                {({ data, error }) => {
                    if (error) {
                        alert(error.message);
                        console.log(error);
                    }

                    if (!data || !data.getCourtInfo) {
                        return (
                            <ActivityIndicator size="large" style={{ width: this.props.itemWidth, padding: 10 }} />
                        );
                    }

                    const court = data.getCourtInfo;

                    return (
                        <SmallCourtCard court={court} width={this.props.itemWidth} />
                    );
                }}
            </Query>
        );
    }

    public render() {
        if (!this.props.items) {
            return (
                <ActivityIndicator size="large" style={{ width: '100%', padding: 10 }} />
            );
        }

        return (
            <FlatList
                data={this.props.items}
                horizontal={true}
                renderItem={({ item }) => this.renderItem(item)}
                keyExtractor={(item) => item.courtId}
                style={this.props.style}
                contentContainerStyle={{ paddingHorizontal: 10 }}
                onEndReached={() => {
                    if (!this.props.nextToken) {
                        return;
                    }

                    if (this.props.fetchMore && this.props.variables) {
                        this.props.fetchMore({
                            query: this.props.query,
                            variables: this.props.variables,
                            updateQuery: (previousResult: any, more: any) => {
                                if (!_.isEqual(more.fetchMoreResult, more.fetchMoreResult![this.props.queryName])) {
                                    const oldItems = previousResult[this.props.queryName]!.items;
                                    const newItems = more.fetchMoreResult![this.props.queryName]!.items;
                                    if (oldItems[oldItems.length - 1] !== newItems[newItems.length - 1]) {
                                        previousResult[this.props.queryName]!.items = [...oldItems, ...newItems];
                                    }
                                    previousResult[this.props.queryName]!.nextToken =
                                        more.fetchMoreResult![this.props.queryName]!.nextToken;
                                }

                                return previousResult;
                            },
                        });
                    }
                }}
            />
        );
    }
}
