/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as NavActions from 'actions/nav';
import fontColorContrast from 'font-color-contrast';
import { calculateProfilePicUrl } from 'logic/UserInfo';
import { Card, CardItem } from 'native-base';
import * as React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import { navigate } from 'utils/NavigationService';

const Image = createImageProgress(FastImage);

interface IProps {
    user: { userId: string, profilePicRev: number, username: string };
    width: number;
    requestText: string;
    color: string;
    onRequestPress?: () => void;
    onAcceptPress: () => void;
    onRejectPress: () => void;
}

export default class UserRequestCard extends React.Component<IProps> {
    state = {
        working: false,
    };

    public render() {
        const userPicUri = calculateProfilePicUrl(this.props.user);
        const fontColor = fontColorContrast(this.props.color);

        return (
            <Card style={{ width: this.props.width }}>
                <TouchableOpacity onPress={() => navigate(NavActions.gotoOtherUser(this.props.user.userId))}>
                    <CardItem cardBody>
                        <Image
                            source={{ uri: userPicUri }}
                            style={{ width: '100%', aspectRatio: 1 }}
                            indicator={Progress.Pie}
                        />
                    </CardItem>
                    <Text style={{ width: '100%', padding: 7, color: 'black' }}>
                        {this.props.user.username}
                    </Text>
                </TouchableOpacity>
                <View style={{ backgroundColor: this.props.color, flexDirection: 'column' }}>
                    <TouchableOpacity onPress={this.props.onRequestPress}>
                        <Text style={{ color: fontColor, width: '100%', padding: 7 }}>
                            {this.props.requestText}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ borderTopColor: fontColor, borderTopWidth: 1, width: '100%' }}
                        onPress={async () => {
                            this.setState({ working: true });
                            await this.props.onAcceptPress();
                            // No need to unset the working flag because the component will now be gone
                        }}
                    >
                        <Text style={{ color: fontColor, width: '100%', padding: 7, textAlign: 'center' }}>
                            Accept
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ borderTopColor: fontColor, borderTopWidth: 1, width: '100%' }}
                        onPress={async () => {
                            this.setState({ working: true });
                            await this.props.onRejectPress();
                            // No need to unset the working flag because the component will now be gone
                        }}
                    >
                        <Text style={{ color: fontColor, width: '100%', padding: 7, textAlign: 'center' }}>
                            Dismiss
                        </Text>
                    </TouchableOpacity>
                </View>
                {this.state.working && <ActivityIndicator
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 1,
                    }}
                    size="large"
                />}
            </Card>
        );
    }
}
