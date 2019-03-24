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
    Dimensions,
    TouchableWithoutFeedback,
    BackHandler
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core//View/BaseComponent';
import MyView from '../../Core/View/MyView';

import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
let { width, height } = Dimensions.get('window');

//const TAG = "[Vhandicap-v1] PopupNotificationView : ";
let screenWidth = Dimensions.get('window').width;
let popupWidth = screenWidth - scale(60);

export default class PopupSelectImageFull extends BaseComponent {
    constructor(props) {
        super(props);
        this.onTakePhotoCallback = null;
        this.onImportGalleryCallback = null;
        this.state = {
            isShow: false,
        }

        this.onImportGalleryClick = this.onImportGalleryClick.bind(this);
        this.onTakePhotoClick = this.onTakePhotoClick.bind(this);
        this.onExitClick = this.onExitClick.bind(this);

        this.backAndroid = null;
    }

    componentDidMount() {
        this.backAndroid = BackHandler.addEventListener('hardwareBackPress', this.onExitClick);
    }

    componentWillUnmount() {
        if (this.backAndroid) {
            this.backAndroid.remove();
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

    isShow() {
        return this.state.isShow;
    }

    onExitClick() {
        console.log("poup.................................................... dimiss");
        this.dimiss();
        return true;
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
        let { isShow } = this.state;
        return (
            <MyView style={styles.modalBackground} hide={!isShow}>
                <TouchableWithoutFeedback onPress={this.onExitClick}>
                    <View style={{flex : 1,backgroundColor : '#fff'}}></View>
                </TouchableWithoutFeedback>
                <View style={styles.container}>
                    <View style={styles.button_group}>
                        <Touchable onPress={this.onImportGalleryClick}>
                            <View style={styles.library_view}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.library_text}>{this.t('library')}</Text>
                            </View>
                        </Touchable>
                        <Touchable onPress={this.onTakePhotoClick}>
                            <View style={styles.camera_view}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.camera_text}>{this.t('take_photo')}</Text>
                            </View>
                        </Touchable>
                    </View>
                    <Touchable onPress={this.onExitClick}>
                        <View style={styles.exit_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.exit_text}>{this.t('exit')}</Text>
                        </View>
                    </Touchable>
                </View>

            </MyView>
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

    exit_text: {
        fontSize: fontSize(16, scale(2)),// 16,
        textAlignVertical: 'center',
        alignSelf: 'center',
        color: '#424242'
    },

    exit_view: {
        marginTop: verticalScale(10),
        height: verticalScale(40),
        borderColor: '#424242',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fff',
        justifyContent: "center",
        alignItems: 'center'
    },

    button_group: {
        marginBottom: verticalScale(10),
        height: verticalScale(80),
        borderColor: '#424242',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fff'
    },

    camera_text: {
        fontSize: fontSize(16, scale(2)),// 16,
        textAlignVertical: 'center',
        alignSelf: 'center',
        color: '#424242'
    },

    camera_view: {
        height: verticalScale(40),
        justifyContent: "center",
        alignItems: 'center'
    },

    library_view: {
        height: verticalScale(40),
        borderBottomColor: '#424242',
        borderBottomWidth: 1,
        justifyContent: "center",
        alignItems: 'center'
    },

    library_text: {
        fontSize: fontSize(16, scale(2)),// 16,
        textAlignVertical: 'center',
        alignSelf: 'center',
        color: '#424242'
    },

    modalBackground: {
        //flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
});
