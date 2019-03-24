/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';

//type Props = {};
export default class HeaderReviewFacilityView extends BaseComponent {
    constructor(props) {
        super(props);
        this.callbackBack = null;
        this.callbackRight = null;
        this.state = {
            title: ''
        }

        this.onBackClick = this.onBackClick.bind(this);
        this.onRightClick = this.onRightClick.bind(this);
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

    setRight(isRight, rightCallback) {
        this.callbackRight = rightCallback;
        this.setState({
            right: isRight,
        });
    }

    setBack(isBack) {
        this.setState({
            back: isBack
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Touchable style={styles.touch_back} onPress={this.onBackClick}>
                        <Image
                            style={styles.back_image}
                            source={this.getResources().ic_back}
                        />
                    </Touchable>
                    <Text allowFontScaling={global.isScaleFont} style={styles.title_text} numberOfLines={1}>{this.state.title}</Text>
                    <View style={styles.right_container}>
                        <Touchable onPress={this.onRightClick.bind(this)}>
                            <Image
                                style={styles.right_image}
                                source={this.getResources().ic_map_header}
                            />
                        </Touchable>
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

    touch_back: {
        width: scale(35),
        height: verticalScale(50),
        marginLeft: 0,
        //backgroundColor : 'green'
    },

    back_image: {
        marginLeft: scale(5),
        width: scale(30),
        height: verticalScale(30),
        marginTop: verticalScale(10),
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
        width: scale(30),
        height: verticalScale(30),
    },

    title_text: {
        //flex: 1,
        marginLeft: scale(10),
        fontSize: fontSize(22, 6),// 22,
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
});