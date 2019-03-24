/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 * trong event taoj file header rieeng cho file header common không quá nhiều
 */

import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import MyView from '../../../Core/View/MyView';
import {scale, verticalScale, fontSize} from '../../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

//const TAG = "[Vhandicap-v1] HeaderView : ";

//type Props = {};
export default class HeaderView extends BaseComponent {
    constructor(props) {
        super(props);
        this.callbackBack = null;
        this.callbackRight = null;
        this.state = {
            title: '',
            rightText: true,
            rightImg: this.getResources().share_logo,
            button_right_text: this.t('create')
        }
    }

    /**
     * Thay đổi text button bên phải
     * @param {*} _title 
     */
    setRightTitle(_title) {
        this.setState({
            rightText : true,
            button_right_text: _title
        });
    }

    setRightType(_isRightText) {
        this.setState({
            rightText: _isRightText
        });
    }

    setRightImg(_img) {
        this.setState({
            rightText: false,
            button_right_text: '',
            rightImg: _img
        });
    }

    onBackClick() {
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

    setTitle(title) {
        this.setState({
            title: title
        });
    }

    setRightCallback(rightCallback) {
        this.callbackRight = rightCallback;
    }

    setBack(isBack) {
        this.setState({
            back: isBack
        });
    }

    render() {
        let {rightText, button_right_text, title } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Touchable style={styles.touch_left} onPress={this.onBackClick.bind(this)}>
                        <Image
                            style={styles.back_image}
                            source={this.getResources().ic_back}
                        />
                    </Touchable>
                    <Text allowFontScaling={global.isScaleFont} style={styles.title_text}>{title}</Text>
                    <View style={styles.right_container}>
                        <MyView style={styles.right_container} hide={rightText}>
                            <Touchable style={styles.right_container} onPress={this.onRightClick.bind(this)}>
                                <Image
                                    style={styles.right_image}
                                    source={this.state.rightImg}
                                />
                            </Touchable>
                        </MyView>
                        <MyView style={styles.right_container} hide={!rightText}>
                            <Touchable style={styles.right_container} onPress={this.onRightClick.bind(this)}>
                                <Text allowFontScaling={global.isScaleFont} style={{ textAlignVertical: 'center', fontSize: fontSize(18,scale(4)), color: '#fff' }}>{button_right_text}</Text>
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
        marginTop: verticalScale(30),
        height: verticalScale(50),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    touch_left: {
        width: scale(80),
        height: verticalScale(30),
        marginLeft: 0
    },

    back_image: {
        marginLeft: scale(5),
        width: scale(40),
        height: verticalScale(30),
        resizeMode: 'contain',
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
        width: scale(80),
        height: verticalScale(30),
        justifyContent: 'center',
        alignItems: 'flex-end'
    },

    title_text: {
        flex: 1,
        marginLeft: scale(10),
        fontSize: fontSize(20,scale(6)),// 20,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center'
    },

    top: {
        backgroundColor: '#FFFFFF',
        paddingTop: verticalScale(20),
        top: 0,
        height: verticalScale(64),
        right: 0,
        left: 0,
        borderBottomWidth: 0.5,
        borderBottomColor: '#828287',
        position: 'relative',
    },

    rightButton: {
        width: scale(100),
        height: verticalScale(37),
        position: 'absolute',
        bottom: verticalScale(8),
        right: scale(2),
        padding: scale(8)
    },
});