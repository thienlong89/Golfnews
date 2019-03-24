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
    Dimensions,
    Image,
    Modal
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core//View/BaseComponent';
// import Networking from '../../Networking/Networking';
// import ApiService from '../../Networking/ApiService';

import {scale, verticalScale, fontSize} from '../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

//const TAG = "[Vhandicap-v1] PopupNotificationView : ";
let screenWidth = Dimensions.get('window').width;
let popupWidth = screenWidth - scale(60);
//let popupHeight = (2 * popupWidth) / 3;
//let buttonWidth = popupWidth / 3;
//type Props = {};
export default class PopupSelectImage extends BaseComponent {
    constructor(props) {
        super(props);
        this.onTakePhotoCallback = null;
        this.onImportGalleryCallback = null;
        this.state = {
            isShow: false,
        }
    }

    dimiss() {
        this.setState({
            isShow: false
        });
    }

    show() {
        if (this.state.isShow) return;
        this.setState({
            isShow: true
        });
    }

    onExitClick() {
        this.dimiss();
    }

    onTakePhotoClick() {
        this.dimiss();
        if (this.onTakePhotoCallback) {
            this.onTakePhotoCallback();
        }
    }

    onImportGalleryClick() {
        this.dimiss();
        if (this.onImportGalleryCallback) {
            this.onImportGalleryCallback();
        }
    }

    render() {
        return (
            <Modal
                transparent={true}
                animationType={'fade'}
                visible={this.state.isShow}
                onRequestClose={this.onExitClick.bind(this)}>
                {this.renderLoading()}
                <View style={styles.modalBackground}>
                    <View style={styles.container}>
                        <View style={styles.button_group}>
                            <Touchable onPress={this.onImportGalleryClick.bind(this)}>
                                <View style={styles.library_view}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.library_text}>{this.t('library')}</Text>
                                </View>
                            </Touchable>
                            <Touchable onPress={this.onTakePhotoClick.bind(this)}>
                                <View style={styles.camera_view}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.camera_text}>{this.t('take_photo')}</Text>
                                </View>
                            </Touchable>
                        </View>
                        <Touchable onPress={this.onExitClick.bind(this)}>
                            <View style={styles.exit_view}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.exit_text}>{this.t('exit')}</Text>
                            </View>
                        </Touchable>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        width: popupWidth,
        height: verticalScale(150),
        //backgroundColor: '#fff',
        // borderColor: '#fff',
        // borderWidth: 1,
        borderRadius: 5
    },

    exit_text : {
        fontSize: fontSize(16,scale(2)),// 16, 
        textAlignVertical: 'center', 
        alignSelf: 'center', 
        color: '#424242'
    },

    exit_view : {
        marginTop: verticalScale(10), 
        height: verticalScale(40), 
        borderColor: '#424242', 
        borderWidth: 1, 
        borderRadius: 5, 
        backgroundColor: '#fff', 
        justifyContent: "center", 
        alignItems: 'center' 
    },

    button_group : {
        marginBottom: verticalScale(10), 
        height: verticalScale(80), 
        borderColor: '#424242', 
        borderWidth: 1, 
        borderRadius: 5, 
        backgroundColor: '#fff'
    },

    camera_text : {
        fontSize: fontSize(16,scale(2)),// 16, 
        textAlignVertical: 'center', 
        alignSelf: 'center', 
        color: '#424242'
    },

    camera_view : {
        height: verticalScale(40), 
        justifyContent: "center", 
        alignItems: 'center' 
    },

    library_view : {
        height: verticalScale(40), 
        borderBottomColor: '#424242', 
        borderBottomWidth: 1, 
        justifyContent: "center", 
        alignItems: 'center' 
    },

    library_text : {
        fontSize: fontSize(16,scale(2)),// 16, 
        textAlignVertical: 'center', 
        alignSelf: 'center', 
        color: '#424242'
    },

    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
});
