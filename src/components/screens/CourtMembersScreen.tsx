import * as API from 'API';
import Analytics from '@aws-amplify/analytics';
import UserList from 'components/UserList';
import gql from 'graphql-tag';
import * as queries from 'graphql/queries';
import * as React from 'react';
import { Query } from 'react-apollo';
import LoadingBlock from '../LoadingBlock';

const listCourtMembers = gql(queries.listCourtMembers);

interface IProps {
    navigation: any;
}

export default class CourtMembersScreen extends React.Component<IProps> {
    componentDidMount() {
        const courtId = this.props.navigation.state.params.courtId;

        Analytics.record({
            name: 'viewCourtMembersScreen',
            attributes: { courtId },
        });
    }

    public static navigationOptions = ({ navigation }: any) => ({
        title: 'Members',
    })

    public render() {
        const courtId = this.props.navigation.state.params.courtId;

        return (
            <Query<API.ListCourtMembersQuery>
                query={listCourtMembers}
                variables={{ courtId }}
                fetchPolicy="cache-and-network"
            >
                {({ data, loading, fetchMore, refetch }) => {
                    if (!data || !data.listCourtMembers) {
                        return (<LoadingBlock />);
                    }
                    const nextToken = data.listCourtMembers.nextToken;
                    const ids = data.listCourtMembers.items!.map((a) => a.memberId);
                    return (
                        <UserList
                            ids={ids}
                            query={listCourtMembers}
                            nextToken={nextToken}
                            variables={{ courtId, nextToken }}
                            fetchMore={fetchMore}
                            queryName="listCourtMembers"
                            refreshing={loading}
                            onRefresh={() => refetch()}
                        />
                    );
                }}
            </Query>
        );
    }
}
