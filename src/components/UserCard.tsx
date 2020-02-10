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
}

export default class UserCard extends React.Component<IProps> {
    private onClick() {
        navigate(gotoOtherUser(this.props.userId));
    }

    public render() {
        const userId = this.props.userId;
        const thumbSize = 40;
        const margin = 5;

        return (
            <Query<API.GetUserInfoQuery>
                query={GetUserInfo}
                variables={{ userId }}
                fetchPolicy="cache-and-network"
            >
                {({ data, loading }) => {
                    const user = (!!data && !!data.getUserInfo) ? data.getUserInfo : undefined;
                    const username = user ? user.username : 'Loading';
                    const uri = user ? calculateProfilePicUrl(user) : undefined;

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
                                    <Text style={{ flex: 1, fontFamily: platform.brandFontFamily }}>{username}</Text>
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
