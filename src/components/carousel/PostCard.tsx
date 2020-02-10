/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as NavActions from 'actions/nav';
import * as API from 'api';
import Analytics from '@aws-amplify/analytics';
import LinkedText from 'components/LinkedText';
import fontColorContrast from 'font-color-contrast';
import gql from 'graphql-tag';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';
import * as subscriptions from 'graphql/subscriptions';
import { ImageUrlForPost } from 'logic/Posts';
import { calculateProfilePicUrl } from 'logic/UserInfo';
import { Icon } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { Mutation, Query } from 'react-apollo';
import Moment from 'react-moment';
import {
    ActivityIndicator, Animated, Text,
    TouchableOpacity, View,
} from 'react-native';
import Image from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import LargeNum from 'utils/LargeNum';
import { navigate } from 'utils/NavigationService';
import OnMount from 'utils/OnMount';
import { confirmBounz } from 'utils/Prompt';
import BounzImage from './BounzImage';
import CommentBlock from './CommentBlock';
import { IPostListElementProps } from './PostList';

const GetSentPost = gql(queries.getSentPost);
const GetCourtInfo = gql(queries.getCourtInfo);
const GetBounz = gql(queries.getBounz);
const GetUserInfo = gql(queries.getUserInfo);
const ProgImage = createImageProgress(Image);

export type PostCardProps = IPostListElementProps & { myUserId: string; hideExpand?: boolean; };

export default abstract class PostCard<T extends PostCardProps> extends React.PureComponent<T> {
    state = {
        opacity: new Animated.Value(1.0),
        working: false,
    };

    private showReady() {
        Animated.timing(this.state.opacity, { toValue: 0.7, duration: 100, useNativeDriver: true }).start();
    }

    private unshowReady() {
        Animated.timing(this.state.opacity, { toValue: 1.0, duration: 100, useNativeDriver: true }).start();
    }

    abstract get postId(): { creatorId: string, postedDate: string };
    abstract get relevantISODate(): string;
    abstract get bounzable(): boolean;

    private onCreatorPress(creatorId: string) {
        navigate(NavActions.gotoOtherUser(creatorId));
    }

    private onCourtPress(courtId: string) {
        navigate(NavActions.gotoCourt(courtId));
    }

    private onExpandPress(postId: string) {
        navigate(NavActions.gotoPost(postId));
    }

    private renderCreatorInfo(creatorId: string, fontColor: string) {
        return (
            <Query<API.GetUserInfoQuery>
                query={GetUserInfo}
                variables={{ userId: creatorId }}
            >
                {({ data, loading }) => {
                    const creatorName = (!data || !data.getUserInfo) ? 'Loading' : data.getUserInfo.username;
                    const creatorImageUrl = (!data || !data.getUserInfo) ? undefined :
                        calculateProfilePicUrl(data.getUserInfo);

                    return (
                        <TouchableOpacity
                            style={{ flexDirection: 'row', padding: 7, alignItems: 'center', flex: 1 }}
                            onPress={() => this.onCreatorPress(creatorId)}
                        >
                            <ProgImage
                                style={{ width: 40, height: 40, borderRadius: 10, overflow: 'hidden' }}
                                source={{ uri: creatorImageUrl }}
                                indicator={Progress.Pie}
                            />
                            <Text
                                numberOfLines={2}
                                style={{
                                    marginLeft: 7, color: fontColor,
                                    fontFamily: platform.brandFontFamily, flex: 1,
                                }}
                            >
                                {creatorName}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
            </Query>
        );
    }

    private renderCourtInfo(courtId: string | null, fontColor: string) {
        if (!courtId) {
            return null;
        }

        return (
            <Query<API.GetCourtInfoQuery>
                query={GetCourtInfo}
                variables={{ courtId }}
            >
                {({ data, loading }) => {
                    if (!data || !data.getCourtInfo) {
                        return (
                            <ActivityIndicator
                                style={{ width: '100%', padding: 10 }}
                                size="small"
                                color={fontColor}
                            />
                        );
                    }

                    const courtName = (!data || !data.getCourtInfo) ? 'Loading' : data.getCourtInfo.name;

                    return (
                        <TouchableOpacity
                            style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: fontColor }}
                            onPress={() => this.onCourtPress(courtId)}
                        >
                            <Text
                                style={{
                                    color: fontColor,
                                    fontFamily: platform.brandFontFamily,
                                    textAlign: 'center',
                                    width: '100%',
                                    margin: 7,
                                }}
                            >
                                Posted in {courtName}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
            </Query>
        );
    }

    private renderBounty(bounty: number | null, fontColor: string) {
        if (!bounty) {
            return null;
        }

        return (
            <View
                style={{ borderBottomWidth: 1, borderColor: fontColor }}
            >
                <Text
                    style={{
                        color: fontColor,
                        textAlign: 'center',
                        width: '100%',
                        margin: 7,
                        fontWeight: 'bold',
                    }}
                >
                    Featured with {LargeNum(bounty)} bounty left
                </Text>
            </View>
        );
    }

    private coloredText(color: string) {
        return (props: { children: any }) => (
            <Text style={{ color }}>
                {props.children}
            </Text>
        );
    }

    private renderPost(queryPost: API.GetSentPostQuery, bounzed: boolean) {
        const { maxImgHeight } = this.props;
        const post = queryPost.getSentPost!;
        const postId = post.creatorId + ';' + post.postedDate;
        const fontColor = fontColorContrast(post.vibrantColor);
        const postImageUrl = ImageUrlForPost(post);
        const canBounz = this.bounzable && !bounzed;

        return (
            <View style={{ width: '100%' }}>
                <View style={{ flexDirection: 'row', zIndex: 10, alignItems: 'center' }}>
                    {this.renderCreatorInfo(post.creatorId, fontColor)}
                    {!this.props.hideExpand &&
                        <TouchableOpacity
                            style={{ paddingHorizontal: 10 }}
                            onPress={() => this.onExpandPress(postId)}
                        >
                            <Icon name="expand" style={{ fontSize: 30, color: fontColor }} />
                        </TouchableOpacity>}
                </View>
                <Mutation<API.CreateBounzMutation> mutation={gql(mutations.createBounz)}>
                    {(createBounz) => (
                        <Query<API.GetUserInfoQuery>
                            query={GetUserInfo}
                            variables={{ userId: this.props.myUserId }}
                        >
                            {({ data }) => (
                                <View
                                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', zIndex: 100 }}
                                >
                                    <BounzImage
                                        maxHeight={maxImgHeight}
                                        bounzable={canBounz}
                                        showReady={this.showReady.bind(this)}
                                        unshowReady={this.unshowReady.bind(this)}
                                        imgUri={postImageUrl}
                                        aspectRatio={post.aspectRatio}
                                        bounzPost={async () => {
                                            try {
                                                Analytics.record({
                                                    name: 'createBounz',
                                                    attributes: { postId },
                                                });

                                                this.setState({ working: true });

                                                const confirmed = await confirmBounz();
                                                if (confirmed) {
                                                    const input = { bounzerId: this.props.myUserId, postId };
                                                    await createBounz({
                                                        variables: { input },
                                                        update: (proxy, newBounz) => {
                                                            const variables = {
                                                                bounzerId: this.props.myUserId,
                                                                postId,
                                                            };
                                                            const bounzData: any = proxy.readQuery({
                                                                query: GetBounz,
                                                                variables,
                                                            });

                                                            // AppSync calls this thing many times so make
                                                            // sure we only change things once
                                                            if (!bounzData.getBounz) {
                                                                bounzData.getBounz = newBounz.data!.createBounz;

                                                                proxy.writeQuery({
                                                                    query: GetBounz,
                                                                    variables,
                                                                    data: bounzData,
                                                                });

                                                                const postData: any = proxy.readQuery({
                                                                    query: GetSentPost,
                                                                    variables: this.postId,
                                                                });

                                                                postData.getSentPost.bounzes++;

                                                                proxy.writeQuery({
                                                                    query: GetSentPost,
                                                                    variables: this.postId,
                                                                    data: postData,
                                                                });
                                                            }
                                                        },
                                                    });
                                                }

                                                this.setState({ working: false });
                                            } catch (e) {
                                                alert(e.message);
                                                console.log(e);

                                                this.setState({ working: false });
                                            }
                                        }}
                                    />
                                    {this.state.working &&
                                        <ActivityIndicator
                                            color="blue"
                                            size="large"
                                            style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 10 }}
                                        />}
                                </View>
                            )}
                        </Query>
                    )}
                </Mutation>
                {this.renderBounty(post.bounty, fontColor)}
                <View style={{
                    flexDirection: 'row', paddingHorizontal: 8,
                    borderBottomWidth: 1, borderColor: fontColor,
                }}>
                    <View style={{
                        flex: 3, flexDirection: 'row', paddingVertical: 5,
                        borderRightWidth: 1, borderColor: fontColor,
                        alignItems: 'center',
                    }}>
                        <Icon style={{ fontSize: 20, color: fontColor }} name="tennisball" />
                        <Text style={{
                            marginHorizontal: 1, color: fontColor,
                            fontWeight: canBounz ? 'normal' : 'bold',
                            flex: 1, textAlign: 'center',
                        }}>
                            {LargeNum(post.bounzes || 0)}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={{
                            flex: 10, flexDirection: 'row', borderColor: fontColor, paddingLeft: 5,
                            paddingVertical: 5, justifyContent: 'center',
                        }}
                        onPress={() => navigate(NavActions.gotoPostBounzers(post.creatorId + ';' + post.postedDate))}
                    >
                        <Text style={{ color: fontColor }}>View bounzers</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', paddingHorizontal: 8 }}>
                    <View style={{
                        flex: 3, flexDirection: 'row', paddingVertical: 5,
                        borderRightWidth: 1, borderColor: fontColor,
                        alignItems: 'center',
                    }}>
                        <Icon style={{ fontSize: 18, color: fontColor }} name="md-mail" />
                        <Text style={{ marginHorizontal: 1, color: fontColor, flex: 1, textAlign: 'center' }}>
                            {LargeNum(post.receipts || 0)}
                        </Text>
                    </View>
                    <View style={{
                        flex: 10, flexDirection: 'row', justifyContent: 'center',
                        paddingVertical: 5, paddingLeft: 5,
                    }}>
                        <Moment fromNow element={this.coloredText(fontColor)}>{this.relevantISODate}</Moment>
                    </View>
                </View>
                {this.renderCourtInfo(post.courtId, fontColor)}
                <LinkedText style={{ margin: 7, color: fontColor }} text={post.caption} />
                <CommentBlock postId={post.creatorId + ';' + post.postedDate}
                    fontColor={fontColor} vibrantColor={post.vibrantColor} />
            </View>
        );
    }

    private renderLoading() {
        return (
            <View style={{ width: '100%' }}>
                <ActivityIndicator
                    color={platform.brandPrimary}
                    size="large"
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1,
                    }}
                />
                <Image
                    source={require('../../../assets/img/City.png')}
                    style={{
                        width: '100%',
                        height: this.props.maxImgHeight,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Image
                        source={require('../../../assets/img/Pigeon.png')}
                        style={{ width: '50%', height: '50%' }}
                        resizeMode="contain"
                    />
                </Image>
            </View>
        );
    }

    render() {
        return (
            <Query<API.GetSentPostQuery>
                query={GetSentPost}
                variables={this.postId}
                fetchPolicy="cache-and-network"
            >
                {({ data, error, subscribeToMore, loading }) => {
                    if (error) {
                        console.log('error', error);
                    }

                    const myId = this.props.myUserId;
                    const postId = this.postId.creatorId + ';' + this.postId.postedDate;

                    return (
                        <View>
                            <Query<API.GetBounzQuery>
                                query={GetBounz}
                                variables={{ bounzerId: myId, postId }}
                                fetchPolicy="cache-and-network"
                            >
                                {(result) => {
                                    let bgColor: string;
                                    let rest: any;

                                    if (result.error) {
                                        console.log('error', error);
                                    }

                                    if (!data || !data.getSentPost || !result.data) {
                                        bgColor = platform.brandBackground;
                                        rest = this.renderLoading();
                                    } else {
                                        bgColor = data.getSentPost.vibrantColor;
                                        rest = this.renderPost(data, result.data!.getBounz !== null);
                                    }

                                    return (
                                        <Animated.View
                                            style={{
                                                opacity: this.state.opacity,
                                                backgroundColor: bgColor,
                                            }}
                                        >
                                            {rest}
                                        </Animated.View>
                                    );
                                }}
                            </Query>
                            <OnMount run={() => {
                                subscribeToMore({
                                    document: gql(subscriptions.onUpdateSentPost),
                                    variables: this.postId,
                                    updateQuery: (prev, { subscriptionData }) => {
                                        const newData = (subscriptionData.data as any).onUpdateSentPost;
                                        if (newData) {
                                            // The newData might lack some attributes
                                            prev.getSentPost = { ...prev.getSentPost, ...newData };
                                        }
                                        return prev;
                                    },
                                });
                            }} />
                        </View>
                    );
                }}
            </Query>
        );
    }
}
