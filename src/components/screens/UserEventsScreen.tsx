/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Herman Lombard
 */

import { gotoCreateEvent, gotoEvent } from 'actions/nav';
import * as API from 'API';
import Analytics from '@aws-amplify/analytics';
import gql from 'graphql-tag';
import * as queries from 'graphql/queries';
import * as _ from 'lodash';
import { Button, Card, Text, View } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { Query } from 'react-apollo';
import { FlatList, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import { navigate } from 'utils/NavigationService';
import LoadingBlock from '../LoadingBlock';

const listUserEvents = gql(queries.listUserEvents);

interface IProps {
    myUserId: any;
}

class UserEventsScreen extends React.Component<IProps> {
    componentDidMount() {
        Analytics.record({
            name: 'viewEventsScreen',
        });
    }

    static navigationOptions = {
        title: 'My events',
    };

    public render() {

        return (
            <View style={{ flex: 1 }}>
                <Query<API.ListUserEventsQuery>
                    query={listUserEvents}
                    variables={{ ownerId: this.props.myUserId }}
                    fetchPolicy="cache-and-network"
                >
                    {({ data, error, fetchMore, refetch, loading }) => {
                        if (error) {
                            console.log(error);
                            return (
                                <Text>{JSON.stringify(error)}</Text>
                            );
                        }

                        if (!data || !data.listUserEvents) {
                            return (<LoadingBlock />);
                        }

                        const nextToken = data.listUserEvents.nextToken;

                        return (
                            <FlatList
                                data={data.listUserEvents.items}
                                renderItem={({ item }) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() =>
                                                navigate(gotoEvent(item.eventId, '', ''))
                                            }
                                        >
                                            <Card style={{ padding: 10 }}>
                                                <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
                                                    {item.title} </Text>
                                                <Text>
                                                    {(new Date(item.date)).toDateString()}
                                                </Text>
                                            </Card>
                                        </TouchableOpacity>
                                    );
                                }}
                                onEndReached={() => {
                                    if (!nextToken) {
                                        return;
                                    }

                                    fetchMore({
                                        query: listUserEvents,
                                        variables: { ownerId: this.props.myUserId, nextToken },
                                        updateQuery: (previousResult: any, more: any) => {
                                            if (more &&
                                                more.fetchMoreResult &&
                                                more.fetchMoreResult.listUserEvents
                                            ) {
                                                const oldItems = previousResult.listUserEvents.items;
                                                const newItems = more.fetchMoreResult.listUserEvents.items;

                                                if (!_.isEqual(oldItems, newItems)) {
                                                    if (oldItems[oldItems.length - 1] !==
                                                        newItems[newItems.length - 1]) {
                                                        previousResult.listUserEvents.items =
                                                            [...oldItems, ...newItems];
                                                    }

                                                    previousResult.listUserEvents.nextToken =
                                                        more.fetchMoreResult.listUserEvents.nextToken;
                                                }
                                            }

                                            return previousResult;
                                        },
                                    });
                                }}
                                onRefresh={() => refetch()}
                                refreshing={loading}
                                keyExtractor={(item) => item.eventId}
                                keyboardShouldPersistTaps="never"
                                keyboardDismissMode="on-drag"
                                ListEmptyComponent={(
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                            <Text style={{ textAlign: 'center', fontFamily: platform.brandFontFamily }}>
                                                Hmmmm that's stange, there's nothing here.
                                        </Text>
                                        </View>
                                        <Animatable.Image
                                            resizeMode="contain"
                                            style={{ marginBottom: 10, width: '100%', height: 150 }}
                                            source={require('../../../assets/img/box.png')}
                                            iterationCount="infinite"
                                            duration={2000}
                                            useNativeDriver={true}
                                        />
                                    </View>
                                )}
                                contentContainerStyle={{ padding: 10, flexGrow: 1 }}
                                ListHeaderComponent={(
                                    <Button block onPress={() => navigate(gotoCreateEvent())}>
                                        <Text>Create event</Text>
                                    </Button>
                                )}
                            />
                        );
                    }}
                </Query>
            </View>
        );
    }
}

function mapStateToProps(state: IReduxState) {
    return {
        myUserId: state.users.myUserId,
    };
}

export default connect(mapStateToProps)(UserEventsScreen);