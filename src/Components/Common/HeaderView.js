/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import MyView from '../../Core/View/MyView';
import {scale, verticalScale, fontSize} from '../../Config/RatioScale';
let{width,height} = Dimensions.get('window');
import { Constants } from '../../Core/Common/ExpoUtils';

const TAG = "[Vhandicap-v1] HeaderView : ";

//type Props = {};
export default class HeaderView extends BaseComponent {
    constructor(props) {
        super(props);

        this.isIphoneX = this.getAppUtil().isIphoneX();
        this.callbackBack = null;
        this.callbackRight = null;
        this.state = {
            title: '',
            right: false,
            right_path: '',
            back : true,
            is_event: false,//nut tao event o man hinh club admin
            is_save: false,//nut luu thong tin khi them thnah vien o group hoac club
            is_direction: false,//buttom dieu huong
        }

        this.onBackClick = this.onBackClick.bind(this);
        this.onRightClick = this.onRightClick.bind(this);
    }

    onBackClick() {
        if(!this.state.back) return true;
        if (this.callbackBack) {
            this.callbackBack();
        }
        return true;
    }

    onRightClick() {
        if (this.callbackRight) {
            this.callbackRight();
        }
    }

    setDirectionButton() {
        this.setState({
            is_direction: true
        });
    }

    setSaveButton() {
        this.setState({
            // right : true,
            is_save: true
        });
    }

    setEventButton() {
        this.setState({
            is_event: true,
        });
    }

    setTitle(title) {
        this.setState({
            title: title
        });
    }

    setRight(isRight, rightCallback) {
        this.callbackRight = rightCallback;
        this.setState({
            right: isRight,
        });
    }

    getRequireImage() {
        if (this.state.is_event) {
            return this.getResources().ic_event;
        } else if (this.state.is_save) {
            return this.getResources().btn_save;
        } else if (this.state.is_direction) {
            return this.getResources().ic_group_info;
        }
        return '';
    }

    _handleOnSelect(value){

    }

    setBack(isBack){
        this.setState({
            back : isBack
        });
    }

    render() {
        //console.log("render header !!");
        let{back,title,right} = this.state;
        return (
            <View style={styles.container}>
                <View style={[styles.content, this.isIphoneX ? { marginTop: 30 } : {}]}>
                    <Touchable style={styles.touch_back} onPress={this.onBackClick}>
                        <Image
                            style={styles.back_image}
                            source={back ? this.getResources().ic_back_large : ''}
                        />
                    </Touchable>
                    <Text allowFontScaling={global.isScaleFont} style={styles.title_text} numberOfLines={1}>{title}</Text>
                    <View style={styles.right_container}>
                        <MyView style={styles.right_container} hide={!right}>
                            <Touchable onPress={this.onRightClick}>
                                <Image
                                    style={styles.right_image}
                                    source={this.getRequireImage()}
                                />
                            </Touchable>
                        </MyView>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: verticalScale(80),
        backgroundColor: '#00aba7',
    },

    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        marginTop: Constants.statusBarHeight,
        alignItems: 'center'
    },

    touch_back : {
        width: verticalScale(50),
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: scale(15),
        paddingBottom: scale(15)
    },

    back_image: {
        height: verticalScale(22),
        width: verticalScale(22),
        resizeMode: 'contain',
        marginLeft: scale(4)
    },

    right_image: {
        marginRight: scale(5),
        width: scale(30),
        height: verticalScale(30),
        resizeMode: 'contain',
        // backgroundColor : 'red'
    },

    right_container: {
        marginRight: scale(5),
        width: scale(30),
        height: verticalScale(30),
    },

    title_text: {
        //flex: 1,
        marginLeft: scale(10),
        fontSize: fontSize(22,6),// 22,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        marginRight : scale(10)
    },

    // top: {
    //     backgroundColor: '#FFFFFF',
    //     paddingTop: verticalScale(20),
    //     top: 0,
    //     height: verticalScale(64),
    //     right: 0,
    //     left: 0,
    //     borderBottomWidth: 0.5,
    //     borderBottomColor: '#828287',
    //     position: 'relative',
    // },

    // rightButton: {
    //     width: scale(100),
    //     height: verticalScale(37),
    //     position: 'absolute',
    //     bottom: verticalScale(8),
    //     right: scale(2),
    //     padding: scale(8)
    // },
});