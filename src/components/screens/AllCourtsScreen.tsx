/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as API from 'API';
import Analytics from '@aws-amplify/analytics';
import CourtCard from 'components/CourtCard';
import LoadingBlock from 'components/LoadingBlock';
import gql from 'graphql-tag';
import * as queries from 'graphql/queries';
import * as _ from 'lodash';
import { Input, Item, Text } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { Query } from 'react-apollo';
import { FlatList, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

const listCourtInfos = gql(queries.listCourtInfos);
const searchCourts = gql(queries.searchCourts);
const getCourtInfo = gql(queries.getCourtInfo);

export default class AllCourtsScreen extends React.Component {
    componentDidMount() {
        Analytics.record({
            name: 'viewAllCourtsScreen',
        });
    }

    public static navigationOptions = {
        title: 'All Courts',
    };

    state = {
        text: '',
    };

    private onTextChange(text: string) {
        this.setState({ text });
    }

    private renderCourts(text: string) {
        if (this.state.text.length < 1) {
            return (
                <Query<API.ListCourtInfosQuery>
                    query={listCourtInfos}
                    fetchPolicy="cache-and-network"
                >
                    {({ data, error, fetchMore, loading, refetch }) => {
                        if (!data || !data.listCourtInfos) {
                            return (
                                <LoadingBlock />
                            );
                        }

                        const nextToken = data.listCourtInfos.nextToken;
                        if (error) {
                            console.log(error);
                        }

                        return (
                            <FlatList
                                data={data.listCourtInfos.items}
                                renderItem={({ item }) => (
                                    <CourtCard court={item} />
                                )}
                                refreshing={loading}
                                onRefresh={() => refetch()}
                                style={{ width: '100%', flex: 1 }}
                                contentContainerStyle={{ padding: 10 }}
                                keyExtractor={(item) => item.courtId}
                                onEndReached={() => {
                                    if (!nextToken) {
                                        return;
                                    }

                                    if (fetchMore) {
                                        fetchMore({
                                            query: listCourtInfos,
                                            updateQuery: (previousResult: any, more: any) => {
                                                if (more &&
                                                    more.fetchMoreResult &&
                                                    more.fetchMoreResult.listCourtInfos
                                                ) {
                                                    if (!_.isEqual(more.fetchMoreResult,
                                                        more.fetchMoreResult!.listCourtInfos)) {
                                                        const oldItems = previousResult.listCourtInfos.items;
                                                        const newItems = more.fetchMoreResult.listCourtInfos.items;
                                                        if (oldItems[oldItems.length - 1] !==
                                                            newItems[newItems.length - 1]) {
                                                            previousResult.listCourtInfos.items =
                                                                [...oldItems, ...newItems];
                                                        }
                                                        previousResult.listCourtInfos.nextToken =
                                                            more.fetchMoreResult.listCourtInfos.nextToken;
                                                    }
                                                }
                                                return previousResult;
                                            },
                                        });
                                    }
                                }}
                            />
                        );
                    }}
                </Query>
            );
        } else {
            return (
                <Query<API.SearchCourtsQuery>
                    query={searchCourts}
                    variables={{ searchTerm: this.state.text }}
                    fetchPolicy="cache-and-network"
                >
                    {({ data, loading, fetchMore, refetch }) => {
                        if (!data || !data.searchCourts) {
                            return (<LoadingBlock />);
                        }

                        return (
                            <FlatList
                                data={data.searchCourts}
                                renderItem={({ item }) => (
                                    <Query<API.GetCourtInfoQuery>
                                        query={getCourtInfo}
                                        variables={{ courtId: item.courtId }}
                                        fetchPolicy="cache-and-network"
                                    >
                                        {({ data: data2, error }) => {

                                            if (!data2 || !data2.getCourtInfo) {
                                                return (
                                                    <LoadingBlock />
                                                );
                                            }

                                            return (
                                                <CourtCard court={data2.getCourtInfo} />
                                            );
                                        }}
                                    </Query>
                                )}
                                refreshing={loading}
                                onRefresh={() => refetch()}
                                style={{ width: '100%', flex: 1 }}
                                contentContainerStyle={{ padding: 10, flexGrow: 1 }}
                                keyExtractor={(item) => item.courtId}
                                onEndReached={() => {
                                    if (fetchMore) {
                                        fetchMore({
                                            query: listCourtInfos,
                                            updateQuery: (previousResult: any, more: any) => {
                                                if (more &&
                                                    more.fetchMoreResult &&
                                                    more.fetchMoreResult.searchCourts
                                                ) {
                                                    if (!_.isEqual(more.fetchMoreResult,
                                                        more.fetchMoreResult!.searchCourts)) {
                                                        const oldItems = previousResult.searchCourts.items;
                                                        const newItems = more.fetchMoreResult.searchCourts.items;
                                                        if (oldItems[oldItems.length - 1] !==
                                                            newItems[newItems.length - 1]) {
                                                            previousResult.searchCourts.items =
                                                                [...oldItems, ...newItems];
                                                        }
                                                        previousResult.searchCourts.nextToken =
                                                            more.fetchMoreResult.searchCourts.nextToken;
                                                    }
                                                }
                                                return previousResult;
                                            },
                                        });
                                    }
                                }}
                                ListEmptyComponent={(
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                            <Text
                                                style={{
                                                    textAlign: 'center', fontSize: 18,
                                                    fontFamily: platform.brandFontFamily,
                                                }}
                                            >
                                                Woooah, it's empty in here!
                                            </Text>
                                        </View>
                                        <Animatable.Image
                                            resizeMode="contain"
                                            style={{ marginBottom: 10, width: '100%', height: 150 }}
                                            source={require('../../../assets/img/box.png')}
                                            animation="bounce"
                                            iterationCount="infinite"
                                            duration={2000}
                                            useNativeDriver={true}
                                        />
                                    </View>
                                )}
                            />
                        );
                    }}
                </Query>
            );
        }
    }

    public render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ padding: 10, paddingBottom: 0 }}>
                    <Item>
                        <Input
                            onChangeText={this.onTextChange.bind(this)}
                            placeholder="Search for"
                        />
                    </Item>
                </View>
                {this.renderCourts(this.state.text)}
            </View>
        );
    }
}
