/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as NavActions from 'actions/nav';
import * as API from 'API';
import MenuButton from 'components/MenuButton';
import MessagesButton from 'components/MessagesButton';
import SmallCourtList from 'components/SmallCourtList';
import UserRequestList from 'components/UserRequestList';
import gql from 'graphql-tag';
import * as queries from 'graphql/queries';
import * as subscriptions from 'graphql/subscriptions';
import { Button, Text } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import { navigationOptions } from 'navigators/MainNavigtor';
import * as React from 'react';
import { adopt } from 'react-adopt';
import { OperationVariables, Query, QueryResult } from 'react-apollo';
import { ActivityIndicator, Image, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import { navigate } from 'utils/NavigationService';
import OnMount from 'utils/OnMount';

const listMemberCourts = gql(queries.listMemberCourts);
const listOwnerCourts = gql(queries.listOwnerCourts);
const listCourtMembershipRequests = gql(queries.listCourtMembershipRequests);
const OnCreateCourtMembershipRequest = gql(subscriptions.onCreateCourtMembershipRequest);

// tslint:disable-next-line:no-var-requires
const icoMoonConfig = require('/../assets/fonts/icomoon.json');
const Icon: any = createIconSetFromIcoMoon(icoMoonConfig);

const ListCourtMembershipRequests = gql(queries.listCourtMembershipRequests);

interface IProps {
    myUserId: string;
}

interface IRenderProps {
    memberCourts: QueryResult<API.ListMemberCourtsQuery, OperationVariables>;
    ownerCourts: QueryResult<API.ListOwnerCourtsQuery, OperationVariables>;
    membershipRequests: QueryResult<API.ListCourtMembershipRequestsQuery, OperationVariables>;
}

const getMemberCourts = ({ myUserId, render }: any) => (
    <Query<API.ListMemberCourtsQuery>
        query={listMemberCourts}
        variables={{ memberId: myUserId }}
        fetchPolicy="cache-and-network"
    >
        {(result) => render(result)}
    </Query>
);

const getOwnerCourts = ({ myUserId, render }: any) => (
    <Query<API.ListOwnerCourtsQuery>
        query={listOwnerCourts}
        variables={{ ownerId: myUserId }}
        fetchPolicy="cache-and-network"
    >
        {(result) => render(result)}
    </Query>
);

const getMembershipRequests = ({ myUserId, render }: any) => (
    <Query<API.ListCourtMembershipRequestsQuery>
        query={listCourtMembershipRequests}
        variables={{ ownerId: myUserId }}
        fetchPolicy="cache-and-network"
    >

        {(result) => render(result)}
    </Query>
);

const Composed = adopt<IRenderProps, IProps>({
    memberCourts: getMemberCourts,
    ownerCourts: getOwnerCourts,
    membershipRequests: getMembershipRequests,
});

class CourtsTab extends React.Component<IProps> {
    static navigationOptions = ({ navigation }: any) => ({
        ...navigationOptions,
        tabBarLabel: 'Courts',
        tabBarIcon: ({ tintColor }: { tintColor: string }) => (
            <Icon name="court" style={{ color: tintColor, fontSize: 22 }} />
        ),
        title: 'Courts',
        headerRight: (<View style={{ flexDirection: 'row' }}>
            <MessagesButton />
            <MenuButton />
        </View>
        ),
    })

    private renderMemberCourts(result: QueryResult<API.ListMemberCourtsQuery, OperationVariables>) {
        const { data, error } = result;

        if (error) {
            console.log(error);
            alert(error.message);
        }

        if (!data || !data.listMemberCourts) {
            return (<ActivityIndicator style={{ width: '100%', padding: 5 }} />);
        }

        const items = (data && data.listMemberCourts) ? data.listMemberCourts.items : null;

        if (items!.length < 1) {
            return (
                <View style={{ alignItems: 'center' }}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={styles.actionText}>
                            Come on, you know you want to join some!
                        </Text>
                    </View>
                    <Image
                        resizeMode="contain"
                        source={require('../../../assets/img/box.png')}
                        style={{ height: 100, margin: 20 }}
                    />
                </View>
            );
        }

        return (
            <SmallCourtList
                items={items}
                style={{ width: '100%' }}
                itemWidth={200}
                nextToken={data.listMemberCourts.nextToken}
                fetchMore={result.fetchMore}
                query={listMemberCourts}
                queryName="listMemberCourts"
                variables={this.props.myUserId}
            />
        );
    }

    private renderOwnerCourts(result: QueryResult<API.ListOwnerCourtsQuery, OperationVariables>) {
        const { data, error } = result;

        if (error) {
            console.log(error);
            alert(error.message);
        }

        if (!data || !data.listOwnerCourts) {
            return (<ActivityIndicator style={{ width: '100%', padding: 5 }} />);
        }

        const items = (data && data.listOwnerCourts) ? data.listOwnerCourts.items : null;

        if (items!.length < 1) {
            return (
                <View style={{ alignItems: 'center' }}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={styles.actionText}>
                            Make one, we know it will rock!
                        </Text>
                    </View>
                    <Image
                        resizeMode="contain"
                        source={require('../../../assets/img/box.png')}
                        style={{ height: 100, margin: 20 }}
                    />
                </View>
            );
        }

        return (
            <SmallCourtList
                items={items}
                style={{ width: '100%' }}
                itemWidth={200}
                nextToken={data.listOwnerCourts.nextToken}
                fetchMore={result.fetchMore}
                variables={this.props.myUserId}
                query={listOwnerCourts}
                queryName="listOwnerCourts"
            />
        );
    }

    private renderMembershipRequests(result: QueryResult<API.ListCourtMembershipRequestsQuery, OperationVariables>) {
        const { data, error, subscribeToMore } = result;

        if (error) {
            console.log(error);
            alert(error.message);
        }

        if (!data || !data.listCourtMembershipRequests) {
            return (
                <ActivityIndicator style={{ width: '100%', padding: 5 }} />
            );
        }

        const items = (data && data.listCourtMembershipRequests) ?
            data.listCourtMembershipRequests.items : null;

        const input = { ownerId: this.props.myUserId };

        if (items!.length < 1) {
            return (
                <View>
                    <OnMount run={() => {
                        console.log('Onmount0');
                        subscribeToMore({
                            document: OnCreateCourtMembershipRequest,
                            variables: { ownerId: input.ownerId },
                            updateQuery: (prev, { subscriptionData }) => {
                                console.log('Subscribing');
                                const newRequest = (subscriptionData.data as any).onCreateCourtMembershipRequest;
                                console.log('newRequest: ', newRequest);
                                if (newRequest) {
                                    const oldItems = prev.listCourtMembershipRequests!.items;
                                    console.log('oldItems: ', prev);
                                    if (!(oldItems.find(({ courtId, memberId }) =>
                                        courtId === newRequest.courtId &&
                                        memberId === newRequest.memberId))) {
                                        prev.listCourtMembershipRequests!.items = [newRequest, ...oldItems];
                                    }
                                }

                                return prev;
                            },
                            onError: (e) => console.log('subscribe error', e),
                        });
                    }} />
                    <UserRequestList
                        items={items}
                        style={{ width: '100%' }}
                        itemWidth={150}
                        deleteRequest={(item, proxy) => {
                            const requestData = proxy.readQuery({
                                query: ListCourtMembershipRequests,
                                variables: input,
                            }) as any;

                            requestData.listCourtMembershipRequests.items =
                                requestData.listCourtMembershipRequests.items.filter((i: typeof item) =>
                                    (i.courtId !== item.courtId) || (i.memberId !== item.memberId));

                            proxy.writeQuery({
                                query: ListCourtMembershipRequests,
                                variables: input,
                                data: requestData,
                            });
                        }}
                        nextToken={data.listCourtMembershipRequests.nextToken}
                        fetchMore={result.fetchMore}
                        variables={this.props.myUserId}
                        query={listCourtMembershipRequests}
                        queryName="listCourtMembershipRequests"
                    />
                </View>
            );
        }

        return (
            <View>
                <OnMount run={() => {
                    console.log('Onmount');
                    subscribeToMore({
                        document: OnCreateCourtMembershipRequest,
                        variables: { ownerId: input.ownerId },
                        updateQuery: (prev, { subscriptionData }) => {
                            console.log('Subscribing');
                            const newRequest = (subscriptionData.data as any).onCreateCourtMembershipRequest;
                            console.log('newRequest: ', newRequest);
                            if (newRequest) {
                                const oldItems = prev.listCourtMembershipRequests!.items;
                                console.log('oldItems: ', prev);
                                if (!(oldItems.find(({ courtId, memberId }) =>
                                    courtId === newRequest.courtId &&
                                    memberId === newRequest.memberId))) {
                                    prev.listCourtMembershipRequests!.items = [newRequest, ...oldItems];
                                }
                            }

                            return prev;
                        },
                        onError: (e) => console.log('subscribe error', e),
                    });
                }} />
                <Text style={styles.sectionTitle}>Requests to join my courts</Text>
                <UserRequestList
                    items={items}
                    style={{ width: '100%' }}
                    itemWidth={150}
                    deleteRequest={(item, proxy) => {
                        const requestData = proxy.readQuery({
                            query: ListCourtMembershipRequests,
                            variables: input,
                        }) as any;

                        requestData.listCourtMembershipRequests.items =
                            requestData.listCourtMembershipRequests.items.filter((i: typeof item) =>
                                (i.courtId !== item.courtId) || (i.memberId !== item.memberId));

                        proxy.writeQuery({
                            query: ListCourtMembershipRequests,
                            variables: input,
                            data: requestData,
                        });
                    }}
                    nextToken={data.listCourtMembershipRequests.nextToken}
                    fetchMore={result.fetchMore}
                    variables={this.props.myUserId}
                    query={listCourtMembershipRequests}
                    queryName="listCourtMembershipRequests"
                />
            </View>
        );
    }

    public render() {
        console.log('Courtstab');
        return (
            <Composed myUserId={this.props.myUserId}>
                {({ memberCourts, ownerCourts, membershipRequests }: IRenderProps) => (
                    <ScrollView style={{ flex: 1 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={memberCourts.loading || ownerCourts.loading || membershipRequests.loading}
                                onRefresh={() => {
                                    try {
                                        memberCourts.refetch();
                                        ownerCourts.refetch();
                                        membershipRequests.refetch();
                                    } catch (e) {
                                        console.log(e);
                                        alert(e.message);
                                    }
                                }}
                            />
                        }
                        contentContainerStyle={{ paddingVertical: 10 }}
                    >
                        <Text style={styles.sectionTitle}>Courts I have joined</Text>
                        {this.renderMemberCourts(memberCourts)}
                        <Button block
                            onPress={() => navigate(NavActions.gotoAllCourts())}
                            style={{ marginHorizontal: 10 }}
                        >
                            <Text>View all courts</Text>
                        </Button>
                        <Text style={styles.sectionTitle}>Courts I own</Text>
                        {this.renderOwnerCourts(ownerCourts)}
                        <Button block
                            onPress={() => navigate(NavActions.gotoCreateCourt())}
                            style={{ marginHorizontal: 10 }}
                        >
                            <Text>Create new court</Text>
                        </Button>
                        {this.renderMembershipRequests(membershipRequests)}
                    </ScrollView>
                )}
            </Composed>
        );
    }
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 20,
        // fontFamily: platform.brandFontFamily,
        color: '#424242',
        textAlign: 'center',
        marginVertical: 5,
        fontWeight: 'bold',
    },
    actionText: {
        textAlign: 'center',
        // fontSize: 18,
        fontFamily: platform.brandFontFamily,
    },
});

function mapStateToProps(state: IReduxState) {
    return {
        myUserId: state.users.myUserId,
    };
}

export default connect(mapStateToProps)(CourtsTab);
