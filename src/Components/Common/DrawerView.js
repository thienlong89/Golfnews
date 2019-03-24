var TENSION = 800;
var FRICTION = 90;

import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableWithoutFeedback,
    // Text,
    // Image,
    // View,
    Animated,
    // AlertIOS,
    PanResponder,
    Dimensions,
} from 'react-native';

import { View } from 'react-native-animatable';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const ANIMATE_TIME = 500;

export default class DrawerView extends Component {

    static defaultProps = {
        initialDrawerSize: 1,

    }

    constructor(props) {
        super(props)
        // naming it initialX clearly indicates that the only purpose
        // of the passed down prop is to initialize something internally
        const initialUsedSpace = Math.abs(this.props.initialDrawerSize);
        const initialDrawerSize = initialUsedSpace >= 1 ? initialUsedSpace : (SCREEN_HEIGHT * (1 - initialUsedSpace));


        var finalDrawerSize = this.props.finalDrawerHeight ? this.props.finalDrawerHeight : 0;
        // console.log(initialDrawerSize, 'Initila size');
        this.state = {
            touched: 'FALSE',
            position: new Animated.Value(initialDrawerSize),
            initialPositon: initialDrawerSize,
            finalPosition: finalDrawerSize,
            initialUsedSpace: initialUsedSpace,
        };

        this.onRequestClose = this.onRequestClose.bind(this);
    }


    isAValidMovement = (distanceX, distanceY) => {
        const moveTravelledFarEnough = Math.abs(distanceY) > Math.abs(distanceX) && Math.abs(distanceY) > 2;
        return moveTravelledFarEnough;
    }


    startAnimation = (velocityY, positionY, initialPositon, id, finalPosition) => {
        // console.log('creating animation ');
        var isGoingToUp = (velocityY < 0) ? true : false;
        // var speed = Math.abs(velocityY);
        // var currentPosition = Math.abs(positionY / SCREEN_HEIGHT);
        var endPosition = isGoingToUp ? finalPosition + 50 : initialPositon + 50;

        var position = new Animated.Value(positionY);
        position.removeAllListeners();

        // console.log('configuration : '+endPosition)
        Animated.timing(position, {
            toValue: endPosition,
            tension: 30,
            friction: 0,
            // easing:Easing.elastic,
            velocity: velocityY
        }).start();

        // position.addListener((position) => { console.log('position by', position, endPosition); });
        position.addListener((position) => {
            if (!this.center) return;
            this.onUpdatePosition(position.value);
        });
    }

    onUpdatePosition(position) {
        // console.log('UPDATE_POSITION', position);
        position = position - 50;
        this.state.position.setValue(position);
        this._previousTop = position;
        // console.log('Position ', position);
        const { initialPosition } = this.state

        if (initialPosition === position) {
            this.props.onInitialPositionReached && this.props.onInitialPositionReached();
        }
    }

    componentWillMount() {
        this._panGesture = PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return this.isAValidMovement(gestureState.dx, gestureState.dy) && this.state.touched == 'TRUE';
            },
            onPanResponderMove: (evt, gestureState) => {
                this.moveDrawerView(gestureState);
            },
            onPanResponderRelease: (evt, gestureState) => {
                this.moveFinished(gestureState);
            },
        });
    }


    moveDrawerView(gestureState) {
        // console.log('GESTURE', gestureState);
        if (!this.center) return;
        // var currentValue = Math.abs(gestureState.moveY / SCREEN_HEIGHT);
        // var isGoingToUp = (gestureState.vy < 0);
        //Here, I'm subtracting %5 of screen size from edge drawer position to be closer as possible to finger location when dragging the drawer view
        var position = gestureState.moveY - SCREEN_HEIGHT * 0.05;
        //Send to callback function the current drawer position when drag down the drawer view component
        //   if(!isGoingToUp) this.props.onDragDown(1-currentValue);
        this.onUpdatePosition(position);
    }

    moveFinished(gestureState) {
        var isGoingToUp = (gestureState.vy < 0);
        if (!this.center) return;
        this.startAnimation(gestureState.vy, gestureState.moveY, this.state.initialPositon, gestureState.stateId, this.state.finalPosition);
        this.props.onRelease && this.props.onRelease(isGoingToUp);
    }

    slideUp(time = null) {
        this.refViewContainer.animate('fadeInUp', time? time: ANIMATE_TIME)
    }

    slideDown() {
        this.refViewContainer.animate('fadeOutDown', ANIMATE_TIME)
    }

    renderContent() {
        var drawerView = this.props.renderDrawerView ? this.props.renderDrawerView() : null;
        var initDrawerView = this.props.renderInitDrawerView ? this.props.renderInitDrawerView() : null;
        if (initDrawerView) {
            return (
                <View style={{ flex: 1 }}>
                    <TouchableWithoutFeedback
                        onPressIn={() => {
                            console.log('touch in');
                            this.setState({ touched: 'TRUE' });
                        }}
                        onPressOut={() => {
                            this.setState({ touched: 'FALSE' });
                            console.log('touch out');
                        }}>
                        {/* <View style={{ flex: 1 }}> */}
                        {initDrawerView}

                        {/* </View> */}

                    </TouchableWithoutFeedback>
                    {drawerView}
                </View>
            )
        } else {
            return (
                <TouchableWithoutFeedback
                    onPressIn={() => {
                        console.log('touch in');
                        this.setState({ touched: 'TRUE' });
                    }}
                    onPressOut={() => {
                        this.setState({ touched: 'FALSE' });
                        console.log('touch out');
                    }}>
                    <View style={{ flex: 1, backgroundColor: '#ff0' }}>
                        {drawerView}

                    </View>

                </TouchableWithoutFeedback>
            )
        }
    }



    render() {
        var containerView = this.props.renderContainerView ? this.props.renderContainerView() : null;
        // var drawerView = this.props.renderDrawerView ? this.props.renderDrawerView() : null;
        // var initDrawerView = this.props.renderInitDrawerView ? this.props.renderInitDrawerView() : null;
        var drawerPosition = {
            top: this.state.position
        };

        return (
            <View
                ref={(refViewContainer) => this.refViewContainer = refViewContainer}
                style={styles.viewport}>

                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={this.onRequestClose}>
                        {containerView}
                    </TouchableWithoutFeedback>

                </View>

                <Animated.View
                    style={[drawerPosition, styles.drawer,
                        { backgroundColor: this.props.drawerBg ? this.props.drawerBg : 'white' }]}
                    ref={(center) => this.center = center}
                    {...this._panGesture.panHandlers}
                >
                    {/* <View style={{flex: 1}}> */}
                    {this.renderContent()}
                    {/* </View> */}


                </Animated.View>

            </View >
        );
    }

    onRequestClose() {
        let{onRequestClose} = this.props;
        if (onRequestClose) {
            onRequestClose();
        }
    }
};


var styles = StyleSheet.create({
    viewport: {
        flex: 1,
    },
    drawer: {
        flex: 1,
    },
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});
