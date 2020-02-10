/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as NavActions from 'actions/nav';
import * as API from 'API';
import Analytics from '@aws-amplify/analytics';
import Color from 'color';
import LoadingBlock from 'components/LoadingBlock';
import fontColorContrast from 'font-color-contrast';
import gql from 'graphql-tag';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';
import * as subscriptions from 'graphql/subscriptions';
import * as _ from 'lodash';
import { calculateCourtPicUrl } from 'logic/CourtInfo';
import { ShrinkToSize, UploadImage } from 'logic/Images';
import { calculateProfilePicUrl } from 'logic/UserInfo';
import { Badge, Button, Card, Icon, Text } from 'native-base';
import { navigationOptions } from 'navigators/MainNavigtor';
import * as React from 'react';
import { Mutation, Query } from 'react-apollo';
import {
    ActivityIndicator, Alert, NativeModules, RefreshControl, ScrollView,
    Share, StatusBar, TouchableOpacity, View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-picker';
import { createImageProgress } from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import shortid from 'shortid';
import system from 'system-exports';
import LargeNum from 'utils/LargeNum';
import { navigate } from 'utils/NavigationService';
import OnMount from 'utils/OnMount';
import { showErrorDialog } from 'utils/Prompt';

const listMemberCourts = gql(queries.listMemberCourts);
const listOwnerCourts = gql(queries.listOwnerCourts);
const Image = createImageProgress(FastImage);
const GetCourtMember = gql(queries.getCourtMember);
const GetCourtMembershipRequest = gql(queries.getCourtMembershipRequest);
const GetIgnoredCourt = gql(queries.getIgnoredCourt);
const UpdateCourtPic = gql(mutations.updateCourtPic);
const PESDK = NativeModules.PESDK;
const getUserInfo = gql(queries.getUserInfo);
const OnUpdateCourtInfo = gql(subscriptions.onUpdateCourtInfo);

interface IProps {
    navigation: any;
    myUserId: string;
}

class CourtScreen extends React.Component<IProps> {
    componentDidMount() {
        const navParams = this.props.navigation.state.params;

        Analytics.record({
            name: 'viewCourtScreen',
            attributes: { courtId: navParams.courtId },
        });
    }

    public static navigationOptions = ({ navigation }: any) => {
        const pars = navigation.state.params;

        const options = _.cloneDeep(navigationOptions);
        if (pars && pars.color) {
            const contrast = fontColorContrast(pars.color);
            options.headerStyle.backgroundColor = pars.color;
            options.headerTintColor = contrast;
            options.headerTitleStyle.color = contrast;

            if (pars.owner) {
                (options as any).headerRight = (
                    <TouchableOpacity
                        style={{ paddingRight: 10 }}
                        onPress={() => navigate(NavActions.gotoEditCourt(pars.courtId))}
                    >
                        <Icon name="create" style={{ color: contrast }} />
                    </TouchableOpacity>
                );
            }
        }
        (options as any).title = (pars && pars.courtName) ? pars.courtName : 'Loading';

        return options;
    }

    state = {
        joining: false,
        loading: false,
        leaving: false,
        deleting: false,
        changingIgnore: false,
    };

    private renderJoinButton(courtId: string) {
        return (
            <Mutation<API.JoinCourtMutation> mutation={gql(mutations.joinCourt)}>
                {(joinCourt) => (
                    <Button block disabled={this.state.joining} onPress={async () => {
                        this.setState({ joining: true });

                        const input = {
                            memberId: this.props.myUserId,
                            courtId,
                        };

                        const userId = this.props.myUserId;

                        let updated = false;

                        try {
                            await joinCourt({
                                variables: { input },
                                update: (proxy) => {
                                    const memberData = proxy.readQuery({
                                        query: GetCourtMember,
                                        variables: input,
                                    });

                                    (memberData as any).getCourtMember = {
                                        ...input, __typename: 'CourtMember',
                                    };

                                    proxy.writeQuery({
                                        query: GetCourtMember,
                                        variables: input,
                                        data: memberData,
                                    });

                                    const userData = proxy.readQuery({
                                        query: getUserInfo,
                                        variables: { userId },
                                    });

                                    if (userData) {
                                        userData.getUserInfo.courtsJoined++;
                                    }

                                    proxy.writeQuery({
                                        query: getUserInfo,
                                        variables: { userId },
                                        data: userData,
                                    });

                                    const requestDataMember = proxy.readQuery({
                                        query: listMemberCourts,
                                        variables: { memberId: this.props.myUserId },
                                    });

                                    const newItemMember = {
                                        courtId: input.courtId,
                                        memberId: input.memberId,
                                        __typename: 'CourtMember',
                                    };

                                    if (!updated) {
                                        requestDataMember!.listMemberCourts.items.push(newItemMember);
                                        updated = true;
                                    }

                                    proxy.writeQuery({
                                        query: listMemberCourts,
                                        variables: { memberId: this.props.myUserId },
                                        data: requestDataMember,
                                    });
                                },
                            });
                            this.setState({ joining: false });
                        } catch (e) {
                            console.log(e);
                            alert(e.message);
                            this.setState({ joining: false });
                        }
                    }}>
                        <Text>Join court</Text>
                        {this.state.joining && <ActivityIndicator
                            color="blue"
                            style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 1 }}
                        />}
                    </Button>
                )}
            </Mutation>
        );
    }

    private renderShare(courtId: string, courtName: string) {
        return (
            <Button block dark
                onPress={async () => {
                    const courtLink = `https://www.bounz.io/links/court/${courtId}`;
                    try {
                        const result = await Share.share({
                            title: `Bounz`,
                            message:
                                `Please join ${courtName} court using ${courtLink}`,
                        });

                        if (result.action === Share.sharedAction) {
                            if (result.activityType) {
                                // shared with activity type of result.activityType
                            } else {
                                // shared
                            }
                        } else if (result.action === Share.dismissedAction) {
                            // dismissed
                        }
                    } catch (error) {
                        alert(error.message);
                    }
                }}
            >
                <Text>Share court</Text>
            </Button>
        );
    }

    private renderRequestButton(courtId: string) {
        const input = {
            memberId: this.props.myUserId,
            courtId,
        };

        return (
            <Query<API.GetCourtMembershipRequestQuery>
                query={GetCourtMembershipRequest}
                variables={input}
                fetchPolicy="cache-and-network"
            >
                {({ data, error }) => {
                    if (error) {
                        alert(error.message);
                        console.log(error);
                    }

                    if (!data) {
                        return null;
                    }

                    if (data.getCourtMembershipRequest !== null) {
                        return (
                            <Button disabled={true} block>
                                <Text>Request to join sent</Text>
                            </Button>
                        );
                    }

                    return (
                        <Mutation<API.RequestToJoinCourtMutation> mutation={gql(mutations.requestToJoinCourt)}>
                            {(requestToJoinCourt) => (
                                <Button block disabled={this.state.joining} onPress={async () => {
                                    this.setState({ joining: true });

                                    try {
                                        await requestToJoinCourt({
                                            variables: { input },
                                            update: (proxy) => {
                                                const requestData = proxy.readQuery({
                                                    query: GetCourtMembershipRequest,
                                                    variables: input,
                                                });

                                                (requestData as any).getCourtMembershipRequest = {
                                                    ...input, __typename: 'CourtMembershipRequest',
                                                };

                                                proxy.writeQuery({
                                                    query: GetCourtMembershipRequest,
                                                    variables: input,
                                                    data: requestData,
                                                });
                                            },
                                        });
                                        this.setState({ joining: false });
                                    } catch (e) {
                                        console.log(e);
                                        alert(e.message);
                                        this.setState({ joining: false });
                                    }
                                }}>
                                    <Text>Request to join court</Text>
                                    {this.state.joining && <ActivityIndicator
                                        color="blue"
                                        style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 1 }}
                                    />}
                                </Button>
                            )}
                        </Mutation>
                    );
                }}
            </Query>
        );
    }

    private onDeletePress(deleteCourt: () => void) {
        Alert.alert(
            'Delete post',
            'Are you sure you want to delete this court?',
            [
                { text: 'No', style: 'cancel' },
                { text: 'Yes', onPress: deleteCourt },
            ],
        );
    }

    private renderLeaveButton(courtId: string) {
        return (
            <Mutation<API.LeaveCourtMutation> mutation={gql(mutations.leaveCourt)}>
                {(leaveCourt) => (
                    <Button block disabled={this.state.leaving} onPress={async () => {
                        this.setState({ leaving: true });
                        const input = {
                            memberId: this.props.myUserId,
                            courtId,
                        };

                        let updated = false;

                        try {
                            await leaveCourt({
                                variables: { input },
                                update: (proxy) => {
                                    let data = proxy.readQuery({
                                        query: GetCourtMember,
                                        variables: input,
                                    }) as any;

                                    data.getCourtMember = null;

                                    proxy.writeQuery({
                                        query: GetCourtMember,
                                        variables: input,
                                        data,
                                    });

                                    data = proxy.readQuery({
                                        query: listMemberCourts,
                                        variables: { memberId: this.props.myUserId },
                                    });

                                    const newItems =
                                        data.listMemberCourts.items.filter(item => item.courtId !== input.courtId);

                                    data = {
                                        listMemberCourts: {
                                            items: newItems,
                                            nextToken: data.listMemberCourts.nextToken,
                                            __typename: 'CourtMemberList',
                                        },
                                    };

                                    proxy.writeQuery({
                                        query: listMemberCourts,
                                        variables: { memberId: this.props.myUserId },
                                        data,
                                    });

                                    const userData = proxy.readQuery({
                                        query: getUserInfo,
                                        variables: { userId: this.props.myUserId },
                                    });

                                    if (userData && !updated) {
                                        userData.getUserInfo.courtsJoined--;
                                        updated = true;
                                    }

                                    proxy.writeQuery({
                                        query: getUserInfo,
                                        variables: { userId: this.props.myUserId },
                                        data: userData,
                                    });

                                },
                            });
                            this.setState({ leaving: false });
                        } catch (e) {
                            console.log(e);
                            alert(e.message);
                            this.setState({ leaving: false });
                        }
                    }}>
                        <Text>Leave court</Text>
                        {this.state.leaving && <ActivityIndicator
                            color="blue"
                            style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 1 }}
                        />}
                    </Button>
                )}
            </Mutation>
        );
    }

    private renderDeleteButton(courtId: string) {
        return (
            <Mutation<API.DeleteCourtMutation> mutation={gql(mutations.deleteCourt)}>
                {(deleteCourt) => {
                    const deleteUserCourt = async () => {
                        this.setState({ deleting: true });
                        let updated = false;
                        try {
                            await deleteCourt({
                                variables: { courtId },
                                update: (proxy) => {

                                    const memberCourts = proxy.readQuery({
                                        query: listMemberCourts,
                                        variables: { memberId: this.props.myUserId },
                                    }) as any;

                                    if (memberCourts.listMemberCourts && !updated) {
                                        memberCourts.listMemberCourts.items =
                                            memberCourts.listMemberCourts.items.filter((item) =>
                                            item.courtId !== courtId);
                                    }

                                    proxy.writeQuery({
                                        query: listMemberCourts,
                                        variables: { memberId: this.props.myUserId },
                                        data: memberCourts,
                                    });

                                    const userData = proxy.readQuery({
                                        query: getUserInfo,
                                        variables: { userId: this.props.myUserId },
                                    });

                                    if (userData && userData.getUserInfo && !updated) {
                                        userData.getUserInfo.courtsOwned--;
                                        userData.getUserInfo.courtsJoined--;
                                    }

                                    proxy.writeQuery({
                                        query: getUserInfo,
                                        variables: { userId: this.props.myUserId },
                                        data: userData,
                                    });

                                    const OwnerCourts = proxy.readQuery({
                                        query: listOwnerCourts,
                                        variables: { ownerId: this.props.myUserId },
                                    }) as any;


                                    if (OwnerCourts.listOwnerCourts && !updated) {
                                        OwnerCourts.listOwnerCourts.items =
                                            OwnerCourts.listOwnerCourts.items.filter((item) =>
                                            item.courtId !== courtId);
                                        updated = true;
                                    }

                                    proxy.writeQuery({
                                        query: listOwnerCourts,
                                        variables: { ownerId: this.props.myUserId },
                                        data: OwnerCourts,
                                    });

                                    navigate(NavActions.goBack());
                                },
                            });
                        } catch (e) {
                            console.log(e);
                            alert(e.message);
                        }
                        this.setState({ deleting: false });
                    }

                    return (
                        <Button block danger disabled={this.state.deleting} onPress={async () => {
                            this.onDeletePress(deleteUserCourt);
                        }}>
                            <Text> Delete Court </Text>
                            {this.state.deleting && <ActivityIndicator
                                color="blue"
                                style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 1 }}
                            />}
                        </Button>);
                }}
            </Mutation>
        );
    }

    private renderIgnoreButton(courtId: string) {
        return (
            <Mutation<API.IgnoreCourtMutation> mutation={gql(mutations.ignoreCourt)}>
                {(ignoreCourt) => (
                    <Button block info disabled={this.state.changingIgnore} onPress={
                        async () => {
                            this.setState({ changingIgnore: true });

                            const variables = { courtId, ignorerId: this.props.myUserId };
                            try {
                                await ignoreCourt({
                                    variables,
                                    update: (proxy) => {
                                        const data = proxy.readQuery({
                                            query: GetIgnoredCourt,
                                            variables,
                                        });

                                        (data as any).getIgnoredCourt = {
                                            ...variables, __typename: 'IgnoredCourt',
                                        };

                                        proxy.writeQuery({
                                            query: GetIgnoredCourt,
                                            variables,
                                            data,
                                        });
                                    },
                                });
                            } catch (e) {
                                console.log(e);
                                alert(e.message);
                            }

                            this.setState({ changingIgnore: false });
                        }
                    }>
                        <Text>Ignore court</Text>
                    </Button>
                )}
            </Mutation>
        );
    }

    private renderUnignoreButton(courtId: string) {
        return (
            <Mutation<API.UnignoreCourtMutation> mutation={gql(mutations.unignoreCourt)}>
                {(unignoreCourt) => (
                    <Button block info disabled={this.state.changingIgnore} onPress={
                        async () => {
                            this.setState({ changingIgnore: true });

                            const variables = { courtId, ignorerId: this.props.myUserId };
                            try {
                                await unignoreCourt({
                                    variables,
                                    update: (proxy) => {
                                        const data = proxy.readQuery({
                                            query: GetIgnoredCourt,
                                            variables,
                                        });

                                        (data as any).getIgnoredCourt = null;

                                        proxy.writeQuery({
                                            query: GetIgnoredCourt,
                                            variables,
                                            data,
                                        });
                                    },
                                });
                            } catch (e) {
                                console.log(e);
                                alert(e.message);
                            }

                            this.setState({ changingIgnore: false });
                        }
                    }>
                        <Text>Stop ignoring court</Text>
                    </Button>
                )}
            </Mutation>
        );
    }

    private renderButtons(court: { courtId: string, ownerId: string, restricted: boolean }) {
        if (court.ownerId !== this.props.myUserId) {
            return (
                <View>
                    <Query<API.GetCourtMemberQuery>
                        query={GetCourtMember}
                        variables={{ courtId: court.courtId, memberId: this.props.myUserId }}
                        fetchPolicy="cache-and-network"
                    >
                        {({ data, error }) => {
                            if (error) {
                                console.log(error);
                                alert(error.message);
                            }

                            if (!data) {
                                return null;
                            }

                            if (data.getCourtMember === null) {
                                if (court.restricted) {
                                    return this.renderRequestButton(court.courtId);
                                } else {
                                    return this.renderJoinButton(court.courtId);
                                }
                            } else {
                                return this.renderLeaveButton(court.courtId);
                            }
                        }}
                    </Query>
                    {this.renderShare(court.courtId, this.props.navigation.state.params.courtName)}
                    <Query<API.GetIgnoredCourtQuery>
                        query={GetIgnoredCourt}
                        variables={{ courtId: court.courtId, ignorerId: this.props.myUserId }}
                        fetchPolicy="cache-and-network"
                    >
                        {({ data, error }) => {
                            if (!data) {
                                return null;
                            }

                            if (data.getIgnoredCourt === null) {
                                return this.renderIgnoreButton(court.courtId);
                            } else {
                                return this.renderUnignoreButton(court.courtId);
                            }
                        }}
                    </Query>
                    <Button block danger onPress={() => navigate(NavActions.gotoReport('court', court.courtId))}>
                        <Text>Report court</Text>
                    </Button>
                </View>
            );
        } else {
            return this.renderDeleteButton(court.courtId);
        }
    }

    private renderOwnerCard(court: { ownerId: string }) {
        return (
            <Query<API.GetUserInfoQuery>
                query={gql(queries.getUserInfo)}
                variables={{ userId: court.ownerId }}
            >
                {(result) => {
                    if (!result.data || !result.data.getUserInfo) {
                        return null;
                    }

                    const user = result.data.getUserInfo;
                    const ownerPicUri = calculateProfilePicUrl(user);
                    const thumbSize = 60;

                    return (
                        <TouchableOpacity onPress={() => navigate(NavActions.gotoOtherUser(court.ownerId))}>
                            <Card>
                                <View style={{ flexDirection: 'row', marginLeft: 15, alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', flex: 1 }}>Owned by</Text>
                                    <Text>{user.username}</Text>
                                    <Image
                                        source={{ uri: ownerPicUri }}
                                        style={{
                                            width: thumbSize, height: thumbSize,
                                            marginLeft: 15,
                                        }}
                                        indicator={Progress.Pie}
                                    />
                                </View>
                            </Card>
                        </TouchableOpacity>
                    );
                }}
            </Query>
        );
    }

    private renderDescription(post: { description: string }) {
        return (
            <Card>
                <View style={{ padding: 15 }}>
                    <Text style={{ fontWeight: 'bold', flex: 1 }}>Description</Text>
                    <Text>{post.description}</Text>
                </View>
            </Card>
        );
    }

    private renderMemberCount(post: { memberCount: number, courtId: string }) {
        return (
            <TouchableOpacity
                onPress={() => {
                    navigate(NavActions.gotoCourtMembers(post.courtId));
                }}
            >
                <Card>
                    <View style={{ padding: 15, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', flex: 1 }}>Members</Text>
                        <Badge>
                            <Text>{LargeNum(post.memberCount)}</Text>
                        </Badge>
                    </View>
                </Card>
            </TouchableOpacity>
        );
    }

    private renderPostCount(post: { postCount: number, courtId: string }) {
        return (
            <TouchableOpacity
                onPress={() => {
                    navigate(NavActions.gotoCourtPosts(post.courtId));
                }}
            >
                <Card>
                    <View style={{ padding: 15, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', flex: 1 }}>Posts</Text>
                        <Badge>
                            <Text>{LargeNum(post.postCount)}</Text>
                        </Badge>
                    </View>
                </Card>
            </TouchableOpacity>
        );
    }

    private pickImage(): Promise<string> {
        const options = {
            title: 'Select a picture',
            quality: 0.5,
        };

        return new Promise((resolve, reject) => {
            ImagePicker.showImagePicker(options, async (response) => {
                if (response.didCancel) {
                    return;
                }

                if (response.error) {
                    showErrorDialog(response.error);
                    return resolve();
                }

                try {
                    let image = await PESDK.editFromURI(response.uri, '16:9');
                    if (!image) {
                        return resolve();
                    }

                    const MaxCourtPicSize = 500000;
                    image = await ShrinkToSize(image, MaxCourtPicSize);
                    resolve(image.uri);
                } catch (e) {
                    showErrorDialog(e.message);
                    resolve();
                }
            });
        });
    }

    private renderCourtPic(owner: boolean, court: any) {
        return (
            <Mutation<API.UpdateCourtPicInput>
                mutation={UpdateCourtPic}
            >
                {(updateCourtPic, { data }) => {
                    return (
                        <TouchableOpacity
                            disabled={!owner}
                            onPress={async () => {
                                const localUri = await this.pickImage();
                                if (localUri) {
                                    try {
                                        this.setState({ loading: true });

                                        const bucket = system.public_uploads_bucket;
                                        const key = court.courtId + '/' + shortid() + '.jpg';

                                        await UploadImage(localUri, bucket, key);

                                        const image = {
                                            bucket,
                                            key,
                                            region: 'us-east-1',
                                        };
                                        const input = { courtId: court.courtId, image, ownerId: court.ownerId };
                                        await updateCourtPic({ variables: { input } });

                                        this.setState({ loading: false });
                                    } catch (e) {
                                        console.log(e);
                                        this.setState({ loading: false });
                                        alert(e.message);
                                    }
                                }
                            }}
                        >
                            <Image
                                source={{ uri: calculateCourtPicUrl(court) }}
                                style={{ width: '100%', aspectRatio: 16 / 9 }}
                                indicator={Progress.Pie}
                            />
                            {(this.state.loading) &&
                                <ActivityIndicator
                                    style={{ width: '100%', height: '100%', zIndex: 1, position: 'absolute' }}
                                    size="large"
                                    color="blue"
                                />}
                        </TouchableOpacity>
                    );
                }}
            </Mutation>
        );
    }

    private renderMessage(courtId: string) {
        return (
            <Button block success
                onPress={() => {
                    const threadId = `courtId:${courtId}`;

                    navigate(NavActions.gotoMessageThread(threadId));
                }}
            >
                <Text>Court chat room</Text>
            </Button>
        );
    }

    public render() {
        const navParams = this.props.navigation.state.params;
        const courtId = this.props.navigation.state.params.courtId;
        let owner = false;
        return (
            <Query<API.GetCourtInfoQuery>
                query={gql(queries.getCourtInfo)}
                variables={{ courtId }}
                fetchPolicy="cache-and-network"
            >
                {({ data, error, subscribeToMore, loading, refetch }) => {
                    if (error) {
                        console.log(error);
                    }

                    if (!data || !data.getCourtInfo) {
                        return (
                            <LoadingBlock />
                        );
                    }

                    const court = data.getCourtInfo;

                    if (this.props.myUserId === court.ownerId) {
                        owner = true;
                    }

                    if (!navParams || navParams.courtName !== court.name ||
                        navParams.color !== court.color || navParams.owner !== owner) {
                        setImmediate(() => {
                            this.props.navigation.setParams({ courtName: court.name, color: court.color, owner });
                        });
                    }

                    return (
                        <ScrollView
                            style={{ flex: 1 }}
                            refreshControl={
                                <RefreshControl refreshing={loading} onRefresh={() => refetch()} />
                            }
                        >
                            <StatusBar
                                backgroundColor={Color(court.color).darken(0.1).hex()}
                                barStyle={fontColorContrast(court.color) === '#ffffff' ?
                                    'light-content' : 'dark-content'}
                            />
                            <OnMount run={() => {
                                subscribeToMore({
                                    document: OnUpdateCourtInfo,
                                    variables: { courtId },
                                    updateQuery: (prev, { subscriptionData }) => {
                                        if (!subscriptionData.data) {
                                            return prev;
                                        }

                                        const newItem = (subscriptionData as any).data.onUpdateCourtInfo;
                                        return { getCourtInfo: newItem };
                                    },
                                    onError: (e) => console.log('subscribe error', e),
                                });
                            }} />
                            {this.renderCourtPic(owner, court)}
                            <View style={{ padding: 10 }}>
                                {this.renderDescription(court)}
                                {this.renderOwnerCard(court)}
                                {this.renderMemberCount(court)}
                                {this.renderPostCount(court)}
                                {this.renderMessage(courtId)}
                                {this.renderButtons(court)}
                            </View>
                        </ScrollView>
                    );
                }}
            </Query>
        );
    }
}

function mapStateToProps(state: IReduxState) {
    return {
        myUserId: state.users.myUserId,
    };
}

export default connect(mapStateToProps)(CourtScreen);
