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

const listFollowers = gql(queries.listFollowers);

interface IProps {
    navigation: any;
}

export default class FollowersScreen extends React.Component<IProps> {
    componentDidMount() {
        const userId = this.props.navigation.state.params.userId;

        Analytics.record({
            name: 'viewFollowersScreen',
            attributes: { userId },
        });
    }

    public static navigationOptions = ({ navigation }: any) => ({
        title: 'Followers',
    })

    public render() {
        const userId = this.props.navigation.state.params.userId;

        return (
            <Query<API.ListFollowersQuery>
                query={listFollowers}
                variables={{ followeeId: userId }}
                fetchPolicy="cache-and-network"
            >
                {({ data, loading, fetchMore, refetch }) => {
                    if (!data || !data.listFollowers) {
                        return (<LoadingBlock />);
                    }

                    const nextToken = data.listFollowers.nextToken;
                    const ids = data.listFollowers.items.map((a) => a.followerId);

                    return (
                        <UserList
                            ids={ids}
                            query={listFollowers}
                            nextToken={nextToken}
                            variables={{ followeeId: userId, nextToken }}
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
