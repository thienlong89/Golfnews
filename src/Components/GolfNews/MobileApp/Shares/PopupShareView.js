import React from 'react';
import { View, Animated, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, Share,Image } from 'react-native'
import BaseComponent from '../../../../Core/View/BaseComponent';
const SCROLL_HEIGHT = 0;

export default class PopupShareView extends BaseComponent {
    constructor(props) {
        super(props);
        this.onCopyLinkClick = this.onCopyLinkClick.bind(this);
        this.onShareClick = this.onShareClick.bind(this);
        this.onExitClick = this.onExitClick.bind(this);
        this.state = {
            translateYValue: new Animated.Value(this.props.isShowing ? SCROLL_HEIGHT : 100),
        }
    }

    show() {
        const { translateYValue } = this.state;
        Animated.timing(translateYValue, {
            toValue: SCROLL_HEIGHT,
            duration: 50
        }).start();
    }

    hide(_callback = null) {
        const { translateYValue } = this.state;
        Animated.timing(translateYValue, {
            toValue: 100,
            duration: 60
        }).start(() => {
            setTimeout(()=>{
                if (_callback) {
                    _callback();
                }
            },200);
        });
    }

    onCopyLinkClick() {
        this.hide(this.props.copy ? this.props.copy() : null);
    }

    onShareClick() {
        this.hide(this.props.share ? this.props.share : null);
    }

    onExitClick() {
        this.hide(this.props.onExit ? this.props.onExit() : null);
    }

    render() {
        let { translateYValue } = this.state;
        return (
            <TouchableWithoutFeedback onPress={this.onExitClick}>
                <Animated.View style={[styles.view_container, {
                    zIndex: 1,
                    transform: [{ translateY: translateYValue }],
                }]}>
                    <TouchableOpacity onPress={this.onCopyLinkClick}>
                        <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                            <Image style={{width : 22,height : 22,resizeMode : 'contain'}}
                                    source={this.getResourceGolfnews().ic_copy}
                            />
                            <Text style={{ fontSize: 16, color: 'black', marginLeft: 10 }}>{'Copy link bài viết'}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onShareClick}>
                        <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                            <Image style={{width : 22,height : 22,resizeMode : 'contain'}}
                                    source={this.getResourceGolfnews().ic_share}
                            />
                            <Text style={{ fontSize: 16, color: 'black', marginLeft: 10 }}>{'Chia sẻ bài viết'}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onExitClick}>
                        <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                            <Image style={{width : 22,height : 22,resizeMode : 'contain'}}
                                    source={this.getResourceGolfnews().ic_quit}
                            />
                            <Text style={{ fontSize: 16, color: 'black', marginLeft: 10 }}>{'Hủy'}</Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    view_container: {
        position: 'absolute',
        right: 0,
        left: 0,
        bottom: 0,
        padding: 10,
        backgroundColor: 'white'
    },
});