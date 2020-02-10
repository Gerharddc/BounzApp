/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import PlatformKeyboardAvoidingView from 'components/PlatformKeyboardAvoidingView';
import { Text, View } from 'native-base';
import platform from 'native-base-theme/variables/platform';
import * as React from 'react';
import { Dimensions, FlatList, NativeModules, RefreshControl, ScrollView } from 'react-native';
import * as Animatable from 'react-native-animatable';

export interface IPostListElementProps {
    maxImgHeight: number;
    itemWidth: number;
}

class Element extends React.PureComponent<IPostListElementProps> { }

interface IPost {
    component: typeof Element;
    props: any;
    key: string;
}

interface IProps {
    posts: IPost[];
    maybeText?: string;
    onLoadMore?: () => void;
    onRefresh?: () => void;
    refreshing?: boolean;
}

export default class PostList extends React.PureComponent<IProps> {
    private get maxImgHeight() {
        return Dimensions.get('window').height / 2;
    }

    private renderItem({ item }: { item: IPost, index: number }) {
        return (
            <item.component
                {...item.props}
                maxImgHeight={this.maxImgHeight}
                key={item.key}
            />
        );
    }

    public render() {
        const { posts } = this.props;

        return (
            <PlatformKeyboardAvoidingView style={{ flex: 1 }}>
                <FlatList
                    data={posts}
                    renderItem={this.renderItem.bind(this)}
                    onEndReached={this.props.onLoadMore}
                    onRefresh={this.props.onRefresh}
                    refreshing={this.props.refreshing}
                    keyExtractor={(item) => item.key}
                    keyboardShouldPersistTaps="always"
                    keyboardDismissMode="on-drag"
                    ListEmptyComponent={(
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={{ textAlign: 'center', fontFamily: platform.brandFontFamily }}>
                                    Hmmmm that's stange, there's nothing here.
                                </Text>
                                <Text style={{ textAlign: 'center' }}>
                                    {this.props.maybeText || 'Maybe this user is just a bit lazy 😜'}
                                </Text>
                            </View>
                            <Animatable.Image
                                resizeMode="contain"
                                style={{ marginBottom: 10, width: '100%', height: 150 }}
                                source={require('../../../assets/img/box.png')}
                                animation="bounce"
                                iterationCount="infinite"
                                duration={2000}
                                useNativeDriver={true}
                            />
                        </View>
                    )}
                    contentContainerStyle={{ flexGrow: 1 }}
                />
            </PlatformKeyboardAvoidingView>
        );
    }
}
