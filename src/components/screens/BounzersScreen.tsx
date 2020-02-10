/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
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

const listPostBounzes = gql(queries.listPostBounzes);

interface IProps {
    navigation: any;
}

export default class BounzersScreen extends React.Component<IProps> {
    componentDidMount() {
        const postId = this.props.navigation.state.params.postId;

        Analytics.record({
            name: 'viewBounzersScreen',
            attributes: { postId },
        });
    }

    public static navigationOptions = ({ navigation }: any) => ({
        title: 'Bounzers',
    })

    public render() {
        const postId = this.props.navigation.state.params.postId;

        return (
            <Query<API.ListPostBounzesQuery>
                query={listPostBounzes}
                variables={{ postId }}
                fetchPolicy="cache-and-network"
            >
                {({ data, loading, fetchMore, refetch }) => {
                    if (!data || !data.listPostBounzes) {
                        return (<LoadingBlock />);
                    }

                    const nextToken = data.listPostBounzes.nextToken;
                    const ids = data.listPostBounzes.items.map((a) => a.bounzerId);

                    return (
                        <UserList
                            ids={ids}
                            query={listPostBounzes}
                            nextToken={nextToken}
                            variables={{ postId, nextToken }}
                            fetchMore={fetchMore}
                            queryName="listPostBounzes"
                            refreshing={loading}
                            onRefresh={() => refetch()}
                        />
                    );
                }}
            </Query>
        );
    }
}
