/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as API from 'API';
import Analytics from '@aws-amplify/analytics';
import ThreadCard from 'components/ThreadCard';
import gql from 'graphql-tag';
import * as queries from 'graphql/queries';
import * as _ from 'lodash';
import { Text, View } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { Query } from 'react-apollo';
import { FlatList } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LoadingBlock from '../LoadingBlock';

const listUserThreads = gql(queries.listUserThreads);

interface IProps {
    navigation: any;
}

export default class MessagesScreen extends React.Component<IProps> {
    componentDidMount() {
        Analytics.record({
            name: 'viewMessageThreadsScreen',
        });
    }

    static navigationOptions = {
        title: 'Direct Messages',
    };

    public render() {

        return (
            <View style={{ flex: 1 }}>
                <Query<API.ListUserThreadsQuery>
                    query={listUserThreads}
                    variables={{ userId: this.props.navigation.state.params.userId }}
                    fetchPolicy="cache-and-network"
                >
                    {({ data, loading, refetch, error }) => {
                        if (error) {
                            console.log(error);
                        }

                        if (!data || !data.listUserThreads) {
                            return (<LoadingBlock />);
                        }

                        return (
                            <FlatList
                                data={data.listUserThreads.items}
                                style={{ flex: 1 }}
                                contentContainerStyle={{ padding: 10, flexGrow: 1 }}
                                keyExtractor={(item) => item.threadId}
                                renderItem={({ item }) => {
                                    const idA = (item.threadId.split(';')[0]).split(':')[1];
                                    let messengerId = '';
                                    if (idA === this.props.navigation.state.params.userId) {
                                        messengerId = (item.threadId.split(';')[1]).split(':')[1];
                                    } else {
                                        messengerId = idA;
                                    }
                                    return (
                                        <ThreadCard
                                            userId={messengerId}
                                            threadId={item.threadId}
                                            latestMessageDate={item.latestMessageDate}
                                        />
                                    );
                                }}
                                onRefresh={() => refetch()}
                                refreshing={loading}
                                ListEmptyComponent={(
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                            <Text style={{
                                                textAlign: 'center',
                                                fontSize: 18,
                                                fontFamily: platform.brandFontFamily,
                                            }}>
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
            </View>
        );
    }
}
