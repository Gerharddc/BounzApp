/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

import * as React from 'react';
import { Animated, Dimensions, PanResponder, PanResponderInstance, Platform } from 'react-native';
import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import * as Progress from 'react-native-progress';

const AnimProgImg: any = Animated.createAnimatedComponent(createImageProgress(FastImage));
const BOUNZ_THRESHOLD = Dimensions.get('window').width / 4;

interface IProps {
    maxHeight: number;
    aspectRatio: number;
    imgUri: string;
    bounzable: boolean;
    showReady: () => void;
    unshowReady: () => void;
    bounzPost?: () => void;
}

export default class BounzImage extends React.PureComponent<IProps> {
    state = {
        dDrag: new Animated.ValueXY({ x: 0, y: 0 }),
        dxNative: new Animated.Value(0),
        jumpNative: new Animated.Value(0),
        dragging: true,
        pinching: false,
        scale: new Animated.Value(1),
    };

    private panResponder: PanResponderInstance | undefined;

    private bounzRight(dx: number) {
        if (dx < 0) {
            return;
        }

        this.setState({ dragging: false });

        this.state.dxNative.setValue(dx);

        const up = Animated.parallel([
            Animated.spring(this.state.dxNative, {
                toValue: 0,
                useNativeDriver: true,
            }),
            Animated.spring(this.state.jumpNative, {
                toValue: -dx,
                useNativeDriver: true,
            }),
        ], { stopTogether: false });

        const down = Animated.spring(this.state.jumpNative, {
            toValue: 0,
            useNativeDriver: true,
        });

        Animated.stagger(300, [
            up,
            down,
        ]).start(() => {
            this.state.dDrag.x.setValue(0);
            this.setState({ dragging: true });
        });

        if (dx > BOUNZ_THRESHOLD && this.props.bounzPost) {
            this.props.bounzPost();
        }

        this.props.unshowReady();
    }

    private unPinch() {
        const small = Animated.spring(this.state.scale, {
            toValue: 1,
            useNativeDriver: true,
        });

        const back = Animated.spring(this.state.dDrag, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
        });

        Animated.parallel([small, back], {
            stopTogether: false,
        }).start(() => this.setState({ pinching: false }));
    }

    private lastScale = 0;
    private increasing = true;
    private initialDistance = 0;

    private processMove(e: any, { dx }: { dx: number }) {
        if (this.props.bounzable) {
            if (dx > BOUNZ_THRESHOLD) {
                this.props.showReady();
            } else {
                this.props.unshowReady();
            }
        }

        if (e.nativeEvent.touches.length > 1) {
            const dx1 = e.nativeEvent.touches[0].locationX - e.nativeEvent.touches[1].locationX;
            const dy1 = e.nativeEvent.touches[0].locationY - e.nativeEvent.touches[1].locationY;
            const dist = Math.sqrt(dx1 * dx1 + dy1 * dy1);
            let scale = dist / this.initialDistance;

            if (this.initialDistance === 0) {
                this.initialDistance = 0;
                scale = 1;
                this.lastScale = 1;
                this.increasing = true;
            }

            // iOS create bs all over the place events which need to be dampened
            if (Platform.OS === 'ios') {
                const setScale = () => {
                    this.state.scale.setValue(scale);
                    this.lastScale = scale;
                };

                if (this.increasing) {
                    if (scale < this.lastScale) {
                        if (this.lastScale / scale > 1.15) {
                            setScale();
                            this.increasing = false;
                        }
                    } else {
                        setScale();
                    }
                } else {
                    if (scale > this.lastScale) {
                        if (scale / this.lastScale > 1.15) {
                            setScale();
                            this.increasing = true;
                        }
                    } else {
                        setScale();
                    }
                }
            } else {
                this.state.scale.setValue(scale);
            }

            if (!this.state.pinching) {
                this.setState({ pinching: true });
            }
        }
    }

    public componentWillMount() {
        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
                if (evt.nativeEvent.touches.length > 1) {
                    return true;
                } else {
                    return this.props.bounzable && gestureState.dx > 0;
                }
            },

            onMoveShouldSetPanResponder: (evt, gestureState) => {
                if (evt.nativeEvent.touches.length > 1) {
                    return true;
                } else {
                    return this.props.bounzable && gestureState.dx > 0;
                }
            },

            onPanResponderMove: Animated.event([
                null,
                { dx: this.state.dDrag.x, dy: this.state.dDrag.y },
            ], { listener: this.processMove.bind(this) as any }),

            onPanResponderRelease: (e, { dx }) => {
                if (this.state.pinching) {
                    this.unPinch();
                } else if (this.props.bounzable) {
                    this.bounzRight(dx);
                }
            },

            onPanResponderTerminate: (e, { dx }) => {
                if (this.state.pinching) {
                    this.unPinch();
                } else if (this.props.bounzable) {
                    this.bounzRight(dx);
                }
            },

            onPanResponderGrant: (e) => {
                if (e.nativeEvent.touches.length > 1) {
                    const dx = e.nativeEvent.touches[0].locationX - e.nativeEvent.touches[1].locationX;
                    const dy = e.nativeEvent.touches[0].locationY - e.nativeEvent.touches[1].locationY;

                    this.initialDistance = Math.sqrt(dx * dx + dy * dy);
                    this.setState({ pinching: true });
                } else {
                    this.initialDistance = 0;
                }
            },

            onPanResponderTerminationRequest: () => {
                return false;
            },
        });
    }

    public render() {
        const { maxHeight, aspectRatio } = this.props;

        const width = Dimensions.get('window').width;
        const full = Math.min(maxHeight, width / aspectRatio);
        const half = width / 2;

        let transform: any[] = [];

        if (this.state.pinching) {
            transform = [...this.state.dDrag.getTranslateTransform(),
            { scaleX: this.state.scale }, { scaleY: this.state.scale }];
        } else if (this.props.bounzable) {
            const prop = this.state.dragging ? this.state.dDrag.x : this.state.dxNative;

            const transX = Animated.add(
                prop.interpolate({
                    inputRange: [0, width],
                    outputRange: [0, half],
                    extrapolate: 'clamp',
                }),
                this.state.jumpNative,
            );

            const size = prop.interpolate({
                inputRange: [0, width],
                outputRange: [1, 0],
                extrapolate: 'clamp',
            });

            transform = [{ translateX: transX }, { scaleX: size }];
        }

        const uri = this.props.imgUri;

        return (
            <AnimProgImg
                source={{ uri }}
                {...(this.panResponder ? this.panResponder.panHandlers : undefined)}
                style={{
                    height: full,
                    width,
                    transform,
                }}
                resizeMode="contain"
                indicator={Progress.Pie}
            />
        );
    }
}
