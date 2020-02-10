/**
 * Copyright (c) 2019-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as NavActions from 'actions/nav';
import * as API from 'API';
import { appSyncClient } from 'app';
import Analytics from '@aws-amplify/analytics';
import LoadingBlock from 'components/LoadingBlock';
import PlatformKeyboardAvoidingView from 'components/PlatformKeyboardAvoidingView';
import gql from 'graphql-tag';
import * as mutations from 'graphql/mutations';
import * as queries from 'graphql/queries';
import { Body, Button, CheckBox, Input, ListItem, Text } from 'native-base';
import * as React from 'react';
import { Mutation } from 'react-apollo';
import { ActivityIndicator, Platform, ScrollView, Text as RNText, View } from 'react-native';
import ColorPalette from 'react-native-color-palette';
import { navigate } from 'utils/NavigationService';

interface ICourt {
    name: string;
    description: string;
    restricted: boolean;
    color: string;
}

interface IProps {
    navigation: any;
}

export default class EditCourtScreen extends React.Component<IProps> {
    static navigationOptions = {
        title: 'Edit court',
    };

    state = {
        loading: false,
        court: undefined as ICourt | undefined,
    };

    private async setStartData() {
        const { courtId } = this.props.navigation.state.params;
        const resp = await appSyncClient.query<API.GetCourtInfoQuery>(
            { query: gql(queries.getCourtInfo), variables: { courtId } });

        this.setState({ court: resp.data.getCourtInfo });
    }

    public componentDidMount() {
        this.setStartData();

        const { courtId } = this.props.navigation.state.params;

        Analytics.record({
            name: 'viewEditCourtScreen',
            attributes: { courtId },
        });
    }

    public render() {
        if (!this.state.court) {
            return (<LoadingBlock />);
        }

        const { courtId } = this.props.navigation.state.params;
        const { name, description, restricted, color } = this.state.court;

        return (
            <PlatformKeyboardAvoidingView style={{ flex: 1 }}>
                <ScrollView>
                    <View style={{ flex: 1, padding: 10 }}>
                        <ColorPalette
                            onChange={(c: any) => this.setState({ court: { ...this.state.court, color: c } })}
                            defaultColor={color}
                            colors={['#C0392B', '#E74C3C', '#8E44AD', '#2980B9', '#2BC069', '#C0BD2B', '#C0662B']}
                            title={'Pick a colour to represent the court'}
                            default={color}
                            icon={<RNText>✔</RNText>}
                        />
                        <ListItem noIndent>
                            <CheckBox checked={restricted} onPress={() => this.setState({ restricted: !restricted })} />
                            <Body>
                                <Text style={{ color: 'black' }}>
                                    Require permission to join this court
                            </Text>
                            </Body>
                        </ListItem>
                        <Input
                            placeholder="Type a name here"
                            style={{ color: 'black', opacity: this.state.loading ? 0.5 : 1, borderBottomWidth: 1 }}
                            value={name}
                            disabled={this.state.loading}
                            onChangeText={(e) => this.setState({ court: { ...this.state.court, name: e } })}
                            placeholderTextColor="gray"
                        />
                        <Input
                            placeholder="Type a description here"
                            multiline={true}
                            style={[
                                { color: 'black', opacity: this.state.loading ? 0.5 : 1 },
                                Platform.OS === 'ios' ? { marginTop: 10, marginBottom: 5 } : {},
                            ]}
                            value={description}
                            disabled={this.state.loading}
                            onChangeText={(e) => this.setState({ court: { ...this.state.court, description: e } })}
                            placeholderTextColor="gray"
                        />
                        <Mutation<API.UpdateCourtInfoInput> mutation={gql(mutations.updateCourtInfo)}>
                            {(updateCourtInfo) => (
                                <Button
                                    block success
                                    disabled={name === '' || description === ''}
                                    onPress={async () => {
                                        this.setState({ loading: true });

                                        try {
                                            const input = { name, description, restricted, color, courtId };
                                            await updateCourtInfo({ variables: { input } });

                                            navigate(NavActions.goBack());
                                        } catch (e) {
                                            alert(e.message);
                                            console.log(e);
                                        }

                                        this.setState({ loading: false });
                                    }}
                                >
                                    <Text>Save</Text>
                                </Button>
                            )}
                        </Mutation>
                    </View>
                </ScrollView>
                {(this.state.loading) && <ActivityIndicator
                    size="large"
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        position: 'absolute',
                        zIndex: 1,
                    }}
                    color="blue"
                />}
            </PlatformKeyboardAvoidingView>
        );
    }
}
