/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import { gotoPickCourt } from 'actions/nav';
import { setCourt } from 'actions/newPost';
import * as API from 'API';
import fontColorContrast from 'font-color-contrast';
import gql from 'graphql-tag';
import * as queries from 'graphql/queries';
import { calculateCourtPicUrl } from 'logic/CourtInfo';
import { Card } from 'native-base';
import * as React from 'react';
import { Query } from 'react-apollo';
import { Text, TouchableOpacity, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import { connect } from 'react-redux';
import { IReduxState } from 'reducers';
import { Dispatch } from 'redux';
import { navigate } from 'utils/NavigationService';

const Image = createImageProgress(FastImage);

interface IProps {
    courtId: string | undefined;
    myUserId: string;
    disabled: boolean;
    dispatch: Dispatch<any>;
}

class CourtPicker extends React.Component<IProps> {
    state = {
        collapsed: true,
    };

    private renderChosenCourt() {
        const { courtId } = this.props;

        if (!courtId) {
            return null;
        }

        return (
            <Query<API.GetCourtInfoQuery>
                query={gql(queries.getCourtInfo)}
                variables={{ courtId }}
            >
                {({ data }) => {
                    if (!data || !data.getCourtInfo) {
                        return null;
                    }

                    const court = data.getCourtInfo;
                    const courtPicUri = calculateCourtPicUrl(court);
                    const fontColor = fontColorContrast(court.color);

                    return (
                        <TouchableOpacity
                            style={{
                                height: 60,
                                backgroundColor: court.color,
                                borderBottomWidth: 1,
                                borderColor: 'white',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                            onPress={() => this.setState({ collapsed: !this.state.collapsed })}
                            disabled={this.props.disabled}
                        >
                            <Text style={{
                                color: fontColor,
                                textAlign: 'center',
                                flex: 1,
                            }}>
                                Posting in {data.getCourtInfo.name}
                            </Text>
                            <Image
                                source={{ uri: courtPicUri }}
                                indicator={Progress.Pie}
                                style={{ height: '100%', aspectRatio: 16 / 9 }}
                            />
                        </TouchableOpacity>
                    );
                }}
            </Query>
        );
    }

    public renderChooseCourt() {
        if (!this.props.courtId) {
            return (
                <TouchableOpacity
                    style={{ width: '100%', padding: 10 }}
                    disabled={this.props.disabled}
                    onPress={() => {
                        if (this.props.courtId) {
                            this.setState({ collapsed: false });
                        } else {
                            navigate(gotoPickCourt());
                        }
                    }}
                >
                    <Text style={{ textAlign: 'center' }}>
                        Post in a court
                    </Text>
                </TouchableOpacity>
            );
        }
    }

    public render() {
        // For some reason the card
        return (
            <Card style={{ opacity: this.props.disabled ? 0.5 : 1 }}>
                {this.renderChosenCourt()}
                {this.renderChooseCourt()}
                <Collapsible collapsed={this.state.collapsed || this.props.disabled}>
                    <View>
                        <TouchableOpacity
                            style={{ padding: 10 }}
                            onPress={() => {
                                this.setState({ collapsed: !this.state.collapsed });
                                navigate(gotoPickCourt());
                            }}
                            disabled={this.props.disabled}
                        >
                            <Text style={{ textAlign: 'center' }}>
                                Pick a new court
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ padding: 10, borderTopWidth: 1 }}
                            onPress={() => {
                                this.setState({ collapsed: !this.state.collapsed });
                                this.props.dispatch(setCourt(undefined));
                            }}
                            disabled={this.props.disabled}
                        >
                            <Text style={{ textAlign: 'center' }}>
                                Do not post in a court
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Collapsible>
            </Card>
        );
    }
}

function mapStateToProps(state: IReduxState) {
    return {
        myUserId: state.users.myUserId,
        courtId: state.newPost.court,
    };
}

export default connect(mapStateToProps)(CourtPicker);
