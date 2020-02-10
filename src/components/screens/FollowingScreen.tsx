/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as API from 'API';
import Analytics from '@aws-amplify/analytics';
import UserList from 'components/UserList';
import gql from 'graphql-tag';
import * as queries from 'graphql/queries';
import * as React from 'react';
import { Query } from 'react-apollo';
import LoadingBlock from '../LoadingBlock';

const listFollowing = gql(queries.listFollowing);

interface IProps {
    navigation: any;
}

export default class FollowingScreen extends React.Component<IProps> {
    componentDidMount() {
        const userId = this.props.navigation.state.params.userId;

        Analytics.record({
            name: 'viewFollowingScreen',
            attributes: { userId },
        });
    }

    public static navigationOptions = ({ navigation }: any) => ({
        title: 'Following',
    })

    public render() {
        const userId = this.props.navigation.state.params.userId;

        return (
            <Query<API.ListFollowingQuery>
                query={listFollowing}
                variables={{ followerId: userId }}
                fetchPolicy="cache-and-network"
            >
                {({ data, loading, fetchMore, refetch }) => {
                    if (!data || !data.listFollowing) {
                        return (<LoadingBlock />);
                    }

                    const nextToken = data.listFollowing.nextToken;
                    const ids = data.listFollowing.items.map((a) => a.followeeId);

                    return (
                        <UserList
                            ids={ids}
                            query={listFollowing}
                            nextToken={nextToken}
                            variables={{ followerId: userId, nextToken }}
                            fetchMore={fetchMore}
                            queryName="listFollowers"
                            refreshing={loading}
                            onRefresh={() => refetch()}
                        />
                    );
                }}
            </Query>
        );
    }
}
