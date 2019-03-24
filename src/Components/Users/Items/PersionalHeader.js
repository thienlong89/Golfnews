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
    Dimensions,
    TouchableOpacity
    // Platform,
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import { Avatar } from 'react-native-elements';
import BaseComponent from '../../../Core/View/BaseComponent';
import AppUtil from '../../../Config/AppUtil';
//import PopupAttachImage from '../../Popups/PopupSelectImage';
import ApiService from '../../../Networking/ApiService';
import ProgressUpload from '../../Common/ProgressUpload';

import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
let { width, height } = Dimensions.get('window');

const TAG = "[Vhandicap-v1] PersionalHeader : ";

//type Props = {};
export default class PersionalHeader extends BaseComponent {

    constructor(props) {
        super(props);
        this.navigation = null;
        this.parent = null;
        this.state = {
            avatar: '',
            fullname: '',
            userId: ''
        }

        this.onChangeAvatar = this.onChangeAvatar.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
    }

    setNavigation(_navigation) {
        this.navigation = _navigation;
    }

    componentDidMount() {
        this.parent = this.props.parent;
        if (this.parent) {
            this.parent.sendUpdateAvatarCallback = this.sendUploadProfile.bind(this);
        }
    }

    orientationPortrait() {
        this.Mxpo.ScreenOrientation.allow(this.Mxpo.ScreenOrientation.Orientation.PORTRAIT);
    }

    /**
     * load anh từ camera
     */
    async onTakePhotoClick() {
        let imageUri = await AppUtil.onTakePhotoClick(true);
        this.sendUploadProfile(imageUri);
    }

    /**
     * load ảnh từ thư viện
     */
    async onImportGalleryClick() {
        let imageUri = await AppUtil.onImportGalleryClick(true);
        this.sendUploadProfile(imageUri);
    }

    setTimeOut() {
        let self = this;
        this.refreshIntervalId = setInterval(() => {
            if (self.progressUpload) {
                self.progressUpload.hideLoading();
            }
            if (this.refreshIntervalId) {
                clearInterval(self.refreshIntervalId);
            }
        }, 15000);
    }

    sendUploadProfile(uri) {
        console.log('sendUploadProfile')
        let url = this.getConfig().getBaseUrl() + ApiService.user_upload_profile();
        let self = this;
        this.progressUpload.showLoading();
        this.setTimeOut();
        AppUtil.upload(url, uri, (jsonData) => {
            if (self.refreshIntervalId) {
                clearInterval(self.refreshIntervalId);
            }
            if (jsonData.hasOwnProperty('error_code')) {
                console.log("update avatar : ", jsonData);
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    let data = jsonData['data'];
                    let user = data['user'];
                    let avatar = (user && user.avatar) ? user.avatar : '';
                    if (avatar.length) {
                        self.getUserInfo().setUserAvatar(avatar);
                        self.getUserInfo().getUserProfile().setAvatar(avatar);
                        self.setState({
                            avatar: avatar
                        }, () => {
                            global.isProfileDidUpdate = true;
                            global.isProfileDidUpdate2 = true;
                        });
                    }
                }
            }
            self.progressUpload.hideLoading();
        }, () => {
            if (self.refreshIntervalId) {
                clearInterval(self.refreshIntervalId);
            }
            self.progressUpload.hideLoading();
            self.popupTimeOut.showPopup();
        }, (progress) => {
            self.progressUpload.setProgress(progress);
        });
    }

    /**
     * Button thay đổi ảnh đại diện
     */
    onChangeAvatar() {
        if (this.parent) {
            this.parent.onChangeAvatar();
        }
        //this.popupAttachImage.show();
    }

    /**
     * cap nhat lai thong tin header
     */
    updateInfoView() {
        this.setState({});
    }

    /**
     * Hiển thị chứng chỉ
     */
    onCertificateClick() {
        this.navigation.navigate('certificate', { orientationPortrait: this.orientationPortrait.bind(this) });
    }

    render() {
        return (
            <View style={styles.container}>
                <Image
                    source={this.getResources().ic_bg_home}
                    style={styles.img_bg_grass}
                    resizeMethod={'resize'} />

                <View style={styles.view_content}>
                    <View style={styles.line} />
                    <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>

                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Avatar
                                rounded
                                containerStyle={styles.avatar_container}
                                avatarStyle={styles.avatar_style}
                                height={this.getRatioAspect().verticalScale(90)}
                                width={this.getRatioAspect().verticalScale(90)}
                                source={(AppUtil.formatAvatar(this.getUserInfo().getUserAvatar())) ? { uri: this.getUserInfo().getUserAvatar() } : this.getResources().ic_user_info}
                                onPress={this.onChangeAvatar} />
                            <Avatar
                                rounded
                                width={verticalScale(36)}
                                height={verticalScale(36)}
                                avatarStyle={styles.avatar_camera_style}
                                containerStyle={styles.camera_img}
                                source={this.getResources().camera}
                                onPress={this.onChangeAvatar}
                            />

                            <ProgressUpload
                                ref={(progressUpload) => { this.progressUpload = progressUpload; }}
                                isModalView={false}
                            />
                        </View>

                    </View>

                    <View style={styles.info_view}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.fullname}>{this.getUserInfo().getFullname()}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.user_id}>{this.getUserInfo().getUserId()}</Text>
                    </View>

                    <TouchableOpacity style={[styles.touchable_back, { zIndex: 3 }]} onPress={this.onBackPress}>
                        <Image style={styles.icon_back}
                            source={this.getResources().ic_back_large}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    onBackPress() {
        if (this.props.onBackPress) {
            this.props.onBackPress();
        }
    }
}

const styles = StyleSheet.create({
    container: {
        height: verticalScale(160),
        // flexDirection: 'row',
        // justifyContent: 'center',
        backgroundColor: '#fff',
    },
    img_bg_grass: {
        width: width,
        height: verticalScale(80),
        resizeMode: 'cover',
    },
    view_content: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    },
    certificate_button: {
        width: verticalScale(30),
        height: verticalScale(30),
        resizeMode: 'contain'
    },

    certificate_touchable: {
        position: 'absolute',
        top: verticalScale(10),
        right: scale(10),
        width: scale(30),
        height: verticalScale(30)
    },

    user_id: {
        fontSize: fontSize(20, scale(8)),//22
        color: '#B2B2B2',
        marginLeft: scale(5),
        fontWeight: 'bold'
    },

    fullname: {
        fontSize: fontSize(22, scale(8)),// 22,
        fontWeight: 'bold',
        color: '#424242'
    },

    info_view: {
        justifyContent: 'center',
        //backgroundColor : 'red',
        flexDirection: 'row',
        alignItems: 'center'
    },

    camera_img: {
        resizeMode: 'contain',
        alignSelf: 'center',
        position: 'absolute',
        right: verticalScale(-18),

    },

    camera_touchable: {
        width: verticalScale(36),
        height: verticalScale(36),
        position: 'absolute',
        left: 0,
        bottom: verticalScale(10)
    },

    avatar_view: {
        marginTop: verticalScale(10),
        marginLeft: scale(10),
        width: verticalScale(120),
        height: verticalScale(100),
        //backgroundColor : 'green'
    },
    progress: {
        margin: scale(10)
    },
    line: {
        height: 0.5,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginTop: verticalScale(25)
    },
    avatar_container: {
        marginTop: verticalScale(10),
        backgroundColor: '#fff'
    },
    avatar_style: {
        borderColor: '#FFFFFF',
        borderWidth: 2
    },
    avatar_camera_style: {
        borderColor: '#FFFFFF',
        borderWidth: 1
    },
    touchable_back: {
        position: 'absolute',
        height: verticalScale(50),
        width: scale(50),
        marginTop: verticalScale(25)
    },
    icon_back: {
        height: verticalScale(22),
        width: scale(22),
        resizeMode: 'contain',
        marginTop: verticalScale(15),
        marginLeft: scale(10)
    },
});