/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { goBack } from 'actions/nav';
import { setCourt } from 'actions/newPost';
import * as API from 'API';
import Analytics from '@aws-amplify/analytics';
import CourtCard from 'components/CourtCard';
import LoadingBlock from 'components/LoadingBlock';
import Fuse from 'fuse.js';
import gql from 'graphql-tag';
import * as queries from 'graphql/queries';
import * as _ from 'lodash';
import { Input, Item, Text } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { Query } from 'react-apollo';
import { FlatList, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import { Dispatch } from 'redux';
import { navigate } from 'utils/NavigationService';

const listMemberCourts = gql(queries.listMemberCourts);
const getCourtInfo = gql(queries.getCourtInfo);

interface IProps {
    dispatch: Dispatch<any>;
    myUserId: string;
}

class PickCourtScreen extends React.Component<IProps> {
    componentDidMount() {
        Analytics.record({
            name: 'viewPickCourtScreen',
        });
    }

    public static navigationOptions = {
        title: 'Pick a court',
    };

    state = {
        text: '',
    };

    private onTextChange(text: string) {
        this.setState({ text });
    }

    private onCardClick(courtId: string) {
        this.props.dispatch(setCourt(courtId));
        navigate(goBack());
    }

    private courtNames = new Map();

    private renderCourts(text: string) {
        return (
            <Query<API.ListMemberCourtsQuery>
                query={listMemberCourts}
                variables={{ memberId: this.props.myUserId }}
                fetchPolicy="cache-and-network"
            >
                {({ data, error, fetchMore, refetch, loading }) => {
                    if (error) {
                        console.log(error);
                    }

                    if (!data || !data.listMemberCourts) {
                        return (
                            <LoadingBlock />
                        );
                    }

                    let searched = data.listMemberCourts.items;
                    if (text !== '' && searched) {
                        const searchable = searched.map((i) => ({
                            item: i,
                            name: this.courtNames.get(i.courtId) || '',
                        }));

                        const fuse = new Fuse(searchable, {
                            shouldSort: true,
                            keys: ['name'],
                        });
                        const result = fuse.search(text);
                        searched = result.map((i) => i.item);
                        console.log('result', result);
                    }

                    const nextToken = data.listMemberCourts.nextToken;
                    return (
                        <FlatList
                            data={searched}
                            renderItem={({ item }) => (
                                <Query<API.GetCourtInfoQuery>
                                    query={getCourtInfo}
                                    variables={{ courtId: item.courtId }}
                                >
                                    {({ data: data2 }) => {
                                        if (!data2 || !data2.getCourtInfo) {
                                            return (
                                                <LoadingBlock />
                                            );
                                        }

                                        if (!this.courtNames.has(item.courtId)) {
                                            this.courtNames.set(item.courtId, data2.getCourtInfo.name);
                                        }

                                        return (
                                            <CourtCard
                                                court={data2.getCourtInfo}
                                                onClick={this.onCardClick.bind(this)}
                                            />
                                        );
                                    }}
                                </Query>
                            )}
                            style={{ width: '100%', flex: 1 }}
                            contentContainerStyle={{ padding: 10, flexGrow: 1 }}
                            keyExtractor={(item) => item.courtId}
                            onEndReached={() => {
                                if (!nextToken) {
                                    return;
                                }

                                if (fetchMore) {
                                    fetchMore({
                                        query: listMemberCourts,
                                        updateQuery: (previousResult: any, more: any) => {
                                            if (more &&
                                                more.fetchMoreResult &&
                                                more.fetchMoreResult.listMemberCourts
                                            ) {
                                                if (!_.isEqual(more.fetchMoreResult,
                                                    more.fetchMoreResult!.listMemberCourts)) {
                                                    const oldItems = previousResult.listMemberCourts.items;
                                                    const newItems = more.fetchMoreResult.listMemberCourts.items;
                                                    if (oldItems[oldItems.length - 1] !==
                                                        newItems[newItems.length - 1]) {
                                                        previousResult.listMemberCourts.items =
                                                            [...oldItems, ...newItems];
                                                    }
                                                    previousResult.listMemberCourts.nextToken =
                                                        more.fetchMoreResult.listMemberCourts.nextToken;
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
                                        <Text style={{ textAlign: 'center', fontFamily: platform.brandFontFamily }}>
                                            Hmmmm that's stange, there's nothing here.
                                            </Text>
                                        <Text style={{ textAlign: 'center' }}>
                                            {'Maybe you should join some courts 🤷'}
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
                            refreshing={loading}
                            onRefresh={() => refetch()}
                        />
                    );
                }}
            </Query>
        );

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

function mapStateToProps(state: IReduxState) {
    return {
        myUserId: state.users.myUserId,
    };
}

function mapDispatchToProps(dispatch: any) {
    return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(PickCourtScreen);
