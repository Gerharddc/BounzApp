/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { gotoCourt } from 'actions/nav';
import fontColorContrast from 'font-color-contrast';
import { calculateCourtPicUrl } from 'logic/CourtInfo';
import { Card, CardItem } from 'native-base';
import * as React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
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
    width: number;
}

export default class SmallCourtCard extends React.Component<IProps> {
    private onClick() {
        navigate(gotoCourt(this.props.court.courtId));
    }

    public render() {
        const { court } = this.props;
        const courtPicUri = calculateCourtPicUrl(court);
        const fontColor = fontColorContrast(court.color);

        return (
            <TouchableOpacity
                disabled={court ? false : true}
                onPress={this.onClick.bind(this)}
                style={{ width: this.props.width }}
            >
                <Card>
                    <CardItem cardBody>
                        <Image
                            source={{ uri: courtPicUri }}
                            style={{ width: '100%', aspectRatio: 16 / 9 }}
                            indicator={Progress.Pie}
                        />
                    </CardItem>
                    <CardItem style={{ backgroundColor: court.color }}>
                        <Text style={{ color: fontColor }}>{court.name}</Text>
                    </CardItem>
                </Card>
            </TouchableOpacity>
        );
    }
}
