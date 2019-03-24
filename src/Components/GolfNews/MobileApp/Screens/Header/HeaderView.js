import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet,Animated } from 'react-native';
import BaseComponent from '../../../../../Core/View/BaseComponent';
import MyView from '../../../../../Core/View/MyView';

const SCROLL_HEIGHT_HIDE = -100;

export default class HeaderView extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            hide : false,
            ic_left: this.getResourceGolfnews().ic_navigator,
            ic_right: this.getResourceGolfnews().ic_search,
            title: this.props.title ? this.props.title : '',
            translateYValue: new Animated.Value(0),
        }
        this.onIconLeftClick = this.onIconLeftClick.bind(this);
        this.onIconRightClick = this.onIconRightClick.bind(this);

        this.onLeftCallback = this.props.onNavigatorClick ? this.props.onNavigatorClick : null;
        this.onRightCallback = this.props.search ? this.props.search : null;

        this.translateY = this.state.translateYValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0,0],
            // outputRange: [0, 0],
            // extrapolate: 'clamp'
        });
    }

    hide(){
        let{hide} = this.state;
        if(hide) return ;
        this.setState({
            hide : true,
        });
    }

    show(){
        let{hide} = this.state;
        if(!hide) return;
        this.setState({
            hide : false
        });
    }

    setHeaderLeft(icon, _callback = null) {
        this.setState({
            ic_left: icon
        }, () => {
            this.onLeftCallback = _callback;
        })
    }

    setHeaderRight(icon, _callback = null) {
        this.setState({
            ic_right: icon,
        }, () => {
            this.onRightCallback = _callback;
        });
    }

    onIconLeftClick() {
        if (this.onLeftCallback) {
            this.onLeftCallback();
        }
    }

    onIconRightClick() {
        if (this.onRightCallback) {
            this.onRightCallback();
        }
    }

    setHeader(title) {
        this.setState({
            title: title
        });
    }

    showWithAnimation(){
        const { translateYValue } = this.state;
        Animated.timing(translateYValue, {
            toValue: 0,
            duration: 50
        }).start(()=>{
            // this.state.hide = false;
        });
    }

    hideWithAnimation(){
        const { translateYValue } = this.state;
        Animated.timing(translateYValue, {
            toValue: SCROLL_HEIGHT_HIDE,
            duration: 60
        }).start(()=>{
            // this.state.hide = true;
        });
    }

    render() {
        let{hide,translateYValue} = this.state;
        if(hide) return null;
        let { ic_left, ic_right, title } = this.state;
        let {hide_right} = this.props;

        
        return (
            // <Animated.View style={[styles.container,{transform: [{ translateY: this.translateY }]}]}>
            <View style={styles.container}>
                <View style={styles.body}>
                    <TouchableOpacity onPress={this.onIconLeftClick}>
                        <Image
                            style={styles.icon_left}
                            source={ic_left}
                        />
                    </TouchableOpacity>
                    <Text allowFontScaling={false} style={styles.title}>
                        {title}
                    </Text>
                    <TouchableOpacity onPress={this.onIconRightClick}>
                        <MyView hide={hide_right}>
                            <Image
                                style={styles.icon_right}
                                source={ic_right}
                            />
                        </MyView>
                    </TouchableOpacity>
                </View>
                </View>
            // </Animated.View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        height: 70,
        backgroundColor: '#F36F25'
    },

    body: {
        marginTop: 30,
        backgroundColor: '#F36F25',
        alignItems: 'flex-end',
        flexDirection: 'row',
        paddingBottom: 5,
        justifyContent: 'center'
    },

    icon_left: {
        width: 22,
        height: 22,
        tintColor: 'white',
        marginLeft: 10,
        resizeMode: 'contain'
    },

    icon_right: {
        width: 22,
        height: 22,
        tintColor: 'white',
        marginRight: 10
    },

    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white'
    }
});