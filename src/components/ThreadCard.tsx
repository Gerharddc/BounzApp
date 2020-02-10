/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Herman Lombard
 */

import { gotoMessageThread } from 'actions/nav';
import * as API from 'API';
import gql from 'graphql-tag';
import * as queries from 'graphql/queries';
import { calculateProfilePicUrl } from 'logic/UserInfo';
import { Card, Text } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { Query } from 'react-apollo';
import { TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Parser from 'react-native-dom-parser';
import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import { navigate } from 'utils/NavigationService';

const Image = createImageProgress(FastImage);
const AnimOpac = Animatable.createAnimatableComponent(TouchableOpacity);

const GetUserInfo = gql(queries.getUserInfo);
const getMessage = gql(queries.getMessage);

interface IProps {
    userId: string;
    threadId: string;
    latestMessageDate: string;
}

export default class ThreadCard extends React.Component<IProps> {
    private onClick() {
        navigate(gotoMessageThread(this.props.threadId));
    }

    private getMessage() {
        const threadId = this.props.threadId;
        const messageDate = this.props.latestMessageDate;

        return (
            <Query<API.GetMessageQuery>
                query={getMessage}
                variables={{
                    threadId,
                    messageDate,
                }}
            >
                {({ data, loading }) => {
                    if (!data || !data.getMessage) {
                        console.log('No message');
                        return null;
                    }

                    const msg = data!.getMessage!.message;
                    const reTagCatcher = /(<.[^(><.)]+>)/g;
                    const tags = msg.match(reTagCatcher) || [];

                    let newString = msg;

                    for (const tag of tags) {
                        const dom = Parser(tag);

                        if (dom.tagName !== 'Mention') {
                            continue;
                        }

                        const ats = dom.attributes;

                        if (ats.type === 'user') {
                            newString = msg.replace(tag, ats.display);
                        }
                    }

                    return newString;
                }}
            </Query>
        );
    }

    public render() {
        const userId = this.props.userId;
        const thumbSize = 40;
        const margin = 5;

        return (
            <Query<API.GetUserInfoQuery>
                query={GetUserInfo}
                variables={{ userId }}
            >
                {({ data, loading }) => {
                    const user = (!!data && !!data.getUserInfo) ? data.getUserInfo : undefined;
                    const username = user ? user.username : 'Loading';
                    const uri = user ? calculateProfilePicUrl(user) : undefined;
                    const message = this.getMessage();

                    if (user && user.userId === 'ghost') {
                        return null;
                    }
                    return (
                        <AnimOpac
                            disabled={user ? false : true}
                            onPress={this.onClick.bind(this)}
                            animation="bounceInLeft"
                            useNativeDriver={true}
                            delay={Math.random() * 200}
                        >
                            <Card>
                                <View style={{
                                    margin, marginLeft: 15, flexDirection: 'row',
                                    alignItems: 'center', height: thumbSize + margin,
                                }}
                                >
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ flex: 1, fontFamily: platform.brandFontFamily }}>
                                            {username}
                                        </Text>
                                        <Text numberOfLines={1}>
                                            {message}
                                        </Text>
                                    </View>
                                    {uri && <Image
                                        source={{ uri }}
                                        style={{
                                            width: thumbSize, height: thumbSize,
                                            borderRadius: thumbSize / 4, overflow: 'hidden',
                                        }}
                                        indicator={Progress.Pie}
                                    />}
                                </View>
                            </Card>
                        </AnimOpac>
                    );
                }}
            </Query>
        );
    }
}
