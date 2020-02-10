/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { gotoCourt } from 'actions/nav';
import * as API from 'API';
import fontColorContrast from 'font-color-contrast';
import gql from 'graphql-tag';
import * as queries from 'graphql/queries';
import { calculateCourtPicUrl } from 'logic/CourtInfo';
import { calculateProfilePicUrl } from 'logic/UserInfo';
import { Body, Card, CardItem, Left, Right, Text } from 'native-base';
import * as React from 'react';
import { Query } from 'react-apollo';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { navigate } from 'utils/NavigationService';

const Image = createImageProgress(FastImage);

interface IProps {
    court: {
        courtId: string,
        ownerId: string,
        name: string,
        description: string,
        memberCount: number,
        postCount: number,
        verified: boolean,
        restricted: boolean,
        imageRev: number,
        color: string,
    };
    onClick?: (courtId: string) => void;
}

export default class CourtCard extends React.Component<IProps> {
    private onClick() {
        if (this.props.onClick) {
            this.props.onClick(this.props.court.courtId);
        } else {
            navigate(gotoCourt(this.props.court.courtId));
        }
    }

    public render() {
        const { court } = this.props;
        const courtPicUri = calculateCourtPicUrl(court);
        const fontColor = fontColorContrast(court.color);

        return (
            <TouchableOpacity
                disabled={court ? false : true}
                onPress={this.onClick.bind(this)}
            >
                <Card>
                    <CardItem>
                        <Query<API.GetUserInfoQuery>
                            query={gql(queries.getUserInfo)}
                            variables={{ userId: court.ownerId }}
                        >
                            {({ data }) => {
                                if (!data || !data.getUserInfo) {
                                    return (
                                        <ActivityIndicator />
                                    );
                                }

                                const user = data.getUserInfo;
                                const ownerPicUri = calculateProfilePicUrl(user);
                                const thumbSize = 40;

                                return (
                                    <Left>
                                        <Image
                                            source={{ uri: ownerPicUri }}
                                            style={{
                                                width: thumbSize, height: thumbSize,
                                                borderRadius: thumbSize / 4, overflow: 'hidden',
                                            }}
                                            indicator={Progress.Pie}
                                        />
                                        <Body>
                                            <Text style={{ color: court.color }}>{court.name}</Text>
                                            <Text note>By {user.username}</Text>
                                        </Body>
                                    </Left>
                                );
                            }}
                        </Query>
                        {court.verified && <Right>
                            <Icon name="verified" size={30} />
                        </Right>}
                    </CardItem>
                    <CardItem cardBody>
                        <Image
                            source={{ uri: courtPicUri }}
                            style={{ width: '100%', aspectRatio: 16 / 9 }}
                            indicator={Progress.Pie}
                        />
                    </CardItem>
                    <CardItem style={{ backgroundColor: court.color }}>
                        <Text style={{ color: fontColor }}>{court.description}</Text>
                    </CardItem>
                </Card>
            </TouchableOpacity>
        );
    }
}
