/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as API from 'API';
import Analytics from '@aws-amplify/analytics';
import SearchUserCard from 'components/SearchUserCard';
import gql from 'graphql-tag';
import * as queries from 'graphql/queries';
import { Icon, Input, Item, Text } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { Query } from 'react-apollo';
import { FlatList, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LoadingBlock from '../LoadingBlock';

const searchUsers = gql(queries.searchUsers);

export default class FindUserScreen extends React.Component {
    componentDidMount() {
        Analytics.record({
            name: 'viewFindUserScreen',
        });
    }

    public static navigationOptions = {
        title: 'Find others',
    };

    state = {
        text: '',
    };

    private onTextChange(text: string) {
        this.setState({ text });
    }

    public render() {
        const busy = false;

        return (
            <View style={{ flex: 1 }}>
                <View style={{ padding: 10, paddingBottom: 0 }}>
                    <Item>
                        <Input
                            onChangeText={this.onTextChange.bind(this)}
                            placeholder="Search for"
                        />
                        {busy && <Icon name="sync" />}
                    </Item>
                </View>
                <Query<API.SearchUsersQuery>
                    query={searchUsers}
                    variables={{ searchTerm: this.state.text }}
                    fetchPolicy="cache-and-network"
                >
                    {({ data, loading, refetch, error }) => {
                        if (error) {
                            console.log(error);
                        }

                        if (!data || !data.searchUsers) {
                            return (<LoadingBlock />);
                        }

                        return (
                            <FlatList
                                data={data.searchUsers}
                                style={{ flex: 1 }}
                                contentContainerStyle={{ padding: 10, flexGrow: 1 }}
                                keyExtractor={(item) => item.userId}
                                renderItem={({ item }) => {
                                    return (
                                        <SearchUserCard
                                            userId={item.userId}
                                            name={item.name || ''}
                                            username={item.username}
                                            profilePicRev={item.profilePicRev || 0}
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
