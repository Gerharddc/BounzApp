/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as NavActions from 'actions/nav';
import * as API from 'API';
import { DataProxy } from 'aws-appsync/node_modules/apollo-cache-inmemory/node_modules/apollo-cache';
import gql from 'graphql-tag';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';
import * as _ from 'lodash';
import * as React from 'react';
import { adopt } from 'react-adopt';
import { Mutation, Query } from 'react-apollo';
import { ActivityIndicator, FlatList, StyleProp, ViewStyle } from 'react-native';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import { navigate } from 'utils/NavigationService';
import UserRequestCard from './UserRequestCard';

interface IItem {
    courtId: string;
    memberId: string;
}

interface IProps {
    items: IItem[] | null;
    style?: StyleProp<ViewStyle>;
    itemWidth: number;
    myUserId: string;
    deleteRequest: (item: IItem, proxy: DataProxy) => void;
    nextToken?: string | null;
    fetchMore?: any;
    variables?: any;
    query: any;
    queryName: string;
}

// TODO: fix typescript on Compose

interface IRenderProps {
    user: { data: any, error: any };
    court: { data: any, error: any };
    accept: { data: any, error: any };
    reject: { data: any, error: any };
}

interface IInputProps {
    userId: string;
    courtId: string;
}

const getUser = ({ userId, render }) => (
    <Query<API.GetUserInfoQuery>
        query={gql(queries.getUserInfo)}
        variables={{ userId }}
    >
        {({ data, error }) => render({ data: data ? data.getUserInfo : null, error })}
    </Query>
);

const getCourt = ({ courtId, render }) => (
    <Query<API.GetCourtInfoQuery>
        query={gql(queries.getCourtInfo)}
        variables={{ courtId }}
    >
        {({ data, error }) => render({ data: data ? data.getCourtInfo : null, error })}
    </Query>
);

const acceptRequest = ({ render }) => (
    <Mutation<API.AcceptCourtMembershipRequestMutation>
        mutation={gql(mutations.acceptCourtMembershipRequest)}
    >
        {(acceptCourtMembershipRequest) => render(acceptCourtMembershipRequest)}
    </Mutation>
);

const declineRequest = ({ render }) => (
    <Mutation<API.DeclineCourtMembershipRequestMutation>
        mutation={gql(mutations.declineCourtMembershipRequest)}
    >
        {(declineCourtMembershipRequest) => render(declineCourtMembershipRequest)}
    </Mutation>
);

const Composed = adopt<IRenderProps, IInputProps>({
    user: getUser,
    court: getCourt,
    accept: acceptRequest,
    decline: declineRequest,
});

class UserRequestList extends React.Component<IProps> {
    private renderItem(item: { memberId: string, courtId: string }) {
        return (
            <Composed userId={item.memberId} courtId={item.courtId}>
                {({ user, court, accept, decline }) => {
                    if (user.error) {
                        console.log(user.error);
                        alert(user.error.message);
                    }

                    if (court.error) {
                        console.log(court.error);
                        alert(court.error.message);
                    }

                    if (!user.data || !court.data) {
                        return null;
                    }

                    return (
                        <UserRequestCard
                            width={this.props.itemWidth}
                            user={user.data}
                            requestText={`Wants to join ${court.data.name}`}
                            color={court.data.color}
                            onRequestPress={() => navigate(NavActions.gotoCourt(court.data.courtId))}
                            onAcceptPress={async () => {
                                const input = {
                                    memberId: item.memberId,
                                    courtId: item.courtId,
                                    ownerId: this.props.myUserId,
                                };

                                try {
                                    await accept({
                                        variables: { input },
                                        update: async (proxy) => {
                                            await this.props.deleteRequest(item, proxy);
                                        },
                                    });
                                } catch (e) {
                                    console.log(e);
                                    alert(e.message);
                                }
                            }}
                            onRejectPress={async () => {
                                const input = {
                                    memberId: item.memberId,
                                    courtId: item.courtId,
                                    ownerId: this.props.myUserId,
                                };

                                try {
                                    await decline({
                                        variables: { input },
                                        update: async (proxy) => {
                                            await this.props.deleteRequest(item, proxy);
                                        },
                                    });
                                } catch (e) {
                                    console.log(e);
                                    alert(e.message);
                                }
                            }}
                        />
                    );
                }}
            </Composed>
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
                keyExtractor={(item) => item.memberId + item.courtId}
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
                        },
                        );
                    }
                }}
            />
        );
    }
}

function mapStateToProps(state: IReduxState) {
    return {
        myUserId: state.users.myUserId,
    };
}

export default connect(mapStateToProps)(UserRequestList);
