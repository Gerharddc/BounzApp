/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { gotoOtherUser } from 'actions/nav';
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
import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import { navigate } from 'utils/NavigationService';

const Image = createImageProgress(FastImage);
const AnimOpac = Animatable.createAnimatableComponent(TouchableOpacity);

const GetUserInfo = gql(queries.getUserInfo);

interface IProps {
    userId: string;
    username: string;
    name: string;
    profilePicRev: number;
}

export default class SearchUserCard extends React.Component<IProps> {
    private onClick() {
        navigate(gotoOtherUser(this.props.userId));
    }

    public render() {
        const { userId, username, name, profilePicRev } = this.props;
        const thumbSize = 40;
        const margin = 5;

        const uri = calculateProfilePicUrl({ userId, profilePicRev });

        if (userId === 'ghost') {
            return null;
        }

        return (
            <AnimOpac
                onPress={this.onClick.bind(this)}
                animation="bounceInLeft"
                useNativeDriver={true}
                delay={Math.random() * 200}
            >
                <Card>
                    <View style={{
                        margin, marginLeft: 15, flexDirection: 'row',
                        alignItems: 'center', height: thumbSize + margin,
                    }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontFamily: platform.brandFontFamily }}>{username}</Text>
                            <Text style={{ }}>{name}</Text>
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
    }
}
