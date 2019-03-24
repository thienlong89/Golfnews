import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    ScrollView,
    BackHandler
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../Common/HeaderView';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import PopupNotify from '../Popups/PopupNotificationView';
import AppUtil from '../../Config/AppUtil';
import PopupAttackImage from '../Popups/PopupSelectImage';
import PopupSelectImage from '../Popups/PopupSelectImageFull';

import { scale, verticalScale, fontSize } from '../../Config/RatioScale';

let screenWidth = Dimensions.get('window').width - scale(20);
/**
 * Để xác định xem đang chụp ảnh trước hay ảnh sau
 */
const CAMERA_TYPE = {
    AFTER: 1,
    BERFORE: 2
}
export default class ReportNewFacilityView extends BaseComponent {
    constructor(props) {
        super(props);
        this.paths_image = [];
        this.type = CAMERA_TYPE.BERFORE;
        this.state = {
            path_image1: '',
            path_image2: '',
            img1_width: 0,
            img1_height: 0,
            img2_width: 0,
            img2_height: 0
        }

        this.backHandler = null;
    }

    /**
     * Kiểm tra trước khi gửi dữ liệu
     */
    checkSendData() {
        console.log("facility length : ", this.facility_id);
        if (!this.paths_image.length) {
            this.popup.setMsg(this.t('choosen_image'));
            this.popup.show();
            return false;
        }
        return true;
    }

    /**
     * Quay lai man hinh truoc do
     */
    onBackClick() {
        let { navigation } = this.props;
        if (navigation)
            navigation.goBack();
        return true;
    }

    checkCameraType(w, h, uri) {
        let size = this.checkSizeImage(w, h);
        switch (this.type) {
            case CAMERA_TYPE.BERFORE:
                this.setState({
                    path_image1: uri,
                    img1_width: size.w,
                    img1_height: size.h
                });
                break;
            case CAMERA_TYPE.AFTER:
                this.setState({
                    path_image2: uri,
                    img2_width: size.w,
                    img2_height: size.h
                });
                break;
            default:
                break;
        }
    }

    /**
     * tra ve kich thuoc anh theo ty le ban dau
     * @param {*} w 
     * @param {*} h 
     */
    checkSizeImage(w, h) {
        let _w = w;
        let _h = h;
        if (w > screenWidth) {
            _w = screenWidth;
            _h = (h * screenWidth) / w;
        }
        console.log("width, height", w, h, _w, _h, screenWidth);
        return { w: _w, h: _h };
    }

    async onTakePhoto() {
        let obj = await AppUtil.onTakePhotoClick(true);
        if (!Object.keys(obj).length) return;
        obj.data = null;
        console.log("obj  ", obj);
        let uri = obj.path;
        let height = obj.height;
        let width = obj.width;
        this.paths_image.push(obj);
        this.checkCameraType(width, height, uri);
    }

    async onImportGallery() {
        let obj = await AppUtil.onImportGalleryClick(true);
        if (!Object.keys(obj).length) return;
        let uri = obj.path;
        let width = obj.width;
        let height = obj.height;
        this.paths_image.push(obj);
        this.checkCameraType(width, height, uri);
    }

    componentDidMount() {
        if (this.headerView) {
            this.headerView.setTitle(this.t('report_new_facility'));
            this.headerView.callbackBack = this.onBackClick.bind(this);
        }

        this.backHandler = BackHandler.addEventListener('hardwareBackPress',this.onBackClick.bind(this));

        //this.popupAttackImage.onTakePhotoCallback = this.onTakePhoto.bind(this);
        //this.popupAttackImage.onImportGalleryCallback = this.onImportGallery.bind(this);
        if (this.popupSelectImage) {
            this.popupSelectImage.onTakePhotoCallback = this.onTakePhoto.bind(this);
            this.popupSelectImage.onImportGalleryCallback = this.onImportGallery.bind(this);
        }
    }

    componentWillUnmount(){
        if(this.backHandler) this.backHandler.remove();
    }

    /**
     * chup anh mat truoc scorecard
     */
    onCameraBeforeClick() {
        this.type = CAMERA_TYPE.BERFORE;
        //this.popupAttackImage.show();
        if (this.popupSelectImage) {
            this.popupSelectImage.show();
        }
    }

    /**
     * Chup anh mat sau scorecard
     */
    onCameraAfterClick() {
        this.type = CAMERA_TYPE.AFTER;
        //this.popupAttackImage.show();
        if (this.popupSelectImage) {
            this.popupSelectImage.show();
        }
    }

    /**
     * Gui thong tin
     */
    onSendClick() {
        if (this.checkSendData()) {
            this.sendRequestReportFacility();
        }
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

    /**
     * Gui thong tin report san
     */
    sendRequestReportFacility() {
        let url = this.getConfig().getBaseUrl() + ApiService.report_facility_new(this.getUserInfo().getLongitude(), this.getUserInfo().getLatitude());
        this.internalLoading.showLoading();
        let self = this;
        this.setTimeOut();
        console.log("url bao san moi : ", url);
        AppUtil.upload_mutil(url, this.paths_image, (jsonData) => {
            // console.log("report response ", jsonData);
            if (self.refreshIntervalId) {
                clearInterval(self.refreshIntervalId);
            }
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    this.popup.setCallback(this.onBackClick.bind(this));
                    self.popup.setMsg(this.t('report_error_facility_msg'));
                } else if (error_code === 2) {
                    self.onCheckErrorCode(2, '');
                }
                else {
                    self.popup.setMsg(jsonData['error_msg']);
                }
            }
            self.internalLoading.hideLoading();
        }, () => {
            if (self.refreshIntervalId) {
                clearInterval(self.refreshIntervalId);
            }
            self.internalLoading.hideLoading();
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <PopupNotify ref={(popup) => { this.popup = popup }} />
                {/* <PopupAttackImage ref={(popupAttackImage) => { this.popupAttackImage = popupAttackImage; }} /> */}
                {/* {this.renderLoading()} */}
                <HeaderView ref={(headerView) => { this.headerView = headerView; }} />
                <Text allowFontScaling={global.isScaleFont} style={styles.text_msg}>{this.t('bao_loi_thong_tin_san_msg')}</Text>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ScrollView>
                        <Touchable onPress={this.onCameraBeforeClick.bind(this)}>
                            <View style={styles.button_view}>
                                <Image
                                    style={styles.camera}
                                    source={this.getResources().camera_2}
                                />
                                <Text allowFontScaling={global.isScaleFont} style={styles.button_label}>{this.t('chup_anh_mat_truoc_scorecard')}</Text>
                                <View style={styles.button_right}></View>
                            </View>
                        </Touchable>
                        <Image
                            // style={[{ width: screenWidth}, styles.img_uplaod]}
                            style={[{ width: this.state.img1_width, height: this.state.img1_height }, styles.img_uplaod]}
                            source={{ uri: this.state.path_image1 }}
                            resizeMethod={'resize'}
                        />
                        <Touchable onPress={this.onCameraAfterClick.bind(this)}>
                            <View style={styles.button_view_2}>
                                <Image
                                    style={styles.camera}
                                    source={this.getResources().camera_2}
                                />
                                <Text allowFontScaling={global.isScaleFont} style={styles.button_label}>{this.t('chup_anh_mat_sau_scorecard')}</Text>
                                <View style={styles.button_right}></View>
                            </View>
                        </Touchable>
                        <Image
                            // style={[{ width: screenWidth }, styles.img_uplaod]}
                            style={[{ width: this.state.img2_width, height: this.state.img2_height }, styles.img_uplaod]}
                            source={{ uri: this.state.path_image2 }}
                            resizeMethod={'resize'}
                        />
                    </ScrollView>
                    <Touchable onPress={this.onSendClick.bind(this)}>
                        <View style={styles.button_send}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.send_label}>{this.t('send')}</Text>
                        </View>
                    </Touchable>
                    {this.renderInternalLoading()}
                </View>
                <PopupSelectImage ref={(popupSelectImage) => { this.popupSelectImage = popupSelectImage; }} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },

    img_uplaod: {
        resizeMode: 'contain',
        alignSelf: 'center',
        margin: scale(10),
        borderColor: '#ebebeb',
        borderWidth: 1
    },

    facility_view: {
        height: verticalScale(40),
        marginTop: verticalScale(15)
    },

    separator: {
        height: 1,
        backgroundColor: '#ebebeb'
    },

    input_facility: {
        flex: 1,
        marginLeft: scale(10),
        color: '#a6a6a6',
        paddingTop: 0,
        paddingBottom: 0
    },

    myview: {
        position: "absolute",
        //zIndex: 10,
        top: verticalScale(170),
        left: scale(10),
        width: screenWidth,
        //bottom : 0,
        height: verticalScale(150),
        backgroundColor: '#fff',
        borderColor: '#000',
        borderWidth: 1
    },

    item: {
        height: verticalScale(30),
        width: screenWidth,
        fontSize: fontSize(14),// 14,
        color: '#000',
        marginLeft: scale(5),
        // backgroundColor : 'green',
        textAlignVertical: 'center',
        //borderBottomColor: '#ebebeb', 
        //borderBottomWidth: 0.5 
    },

    list_view: {
        position: 'absolute',
        //zIndex: 11,
        top: 0,
        left: 0,
        //backgroundColor : 'blue',
        width: screenWidth - scale(2),
        height: verticalScale(148)
    },

    arrow_img: {
        width: scale(20),
        height: verticalScale(20),
        marginRight: scale(5),
        alignItems: 'center',
        justifyContent: 'center',
        resizeMode: 'contain'
    },

    searct_facility_img: {
        width: scale(20),
        height: verticalScale(20),
        marginRight: verticalScale(5),
        alignItems: 'center',
        justifyContent: 'center',
        resizeMode: 'contain'
    },

    button_view: {
        width: screenWidth,
        height: verticalScale(40),
        marginLeft: scale(10),
        marginTop: verticalScale(30),
        borderColor: '#00aba7',
        borderWidth: 0.5,
        borderRadius: scale(3),
        flexDirection: 'row',
        alignItems: 'center'
    },

    button_view_2: {
        width: screenWidth,
        height: verticalScale(40),
        marginLeft: scale(10),
        marginTop: verticalScale(15),
        borderColor: '#00aba7',
        borderWidth: 0.5,
        borderRadius: scale(3),
        flexDirection: 'row',
        alignItems: 'center'
    },

    button_send: {
        width: screenWidth,
        height: verticalScale(40),
        marginLeft: scale(10),
        marginTop: verticalScale(10),
        marginBottom: verticalScale(10),
        borderColor: '#00aba7',
        backgroundColor: '#00aba7',
        borderWidth: 0.5,
        borderRadius: scale(3),
        flexDirection: 'row',
        alignItems: 'center'
    },

    send_label: {
        flex: 1,
        fontSize: fontSize(14),// 14,
        color: '#fff',
        textAlign: 'center',
        alignItems: 'center'
    },

    button_right: {
        width: scale(30),
        height: verticalScale(40)
    },

    button_label: {
        flex: 1,
        fontSize: fontSize(14),// 14,
        color: '#00aba7',
        textAlign: 'center',
        alignItems: 'center'
    },

    camera: {
        width: scale(20),
        height: verticalScale(20),
        marginLeft: scale(10),
        alignItems: 'center',
        resizeMode: 'contain'
    },

    text_msg: {
        marginLeft: scale(10),
        marginTop: verticalScale(10),
        marginRight: scale(10),
        minHeight: verticalScale(60),
        fontSize: fontSize(20,scale(6)),// 14,
        color: '#424242'
    },

    item_view_2: {
        width: screenWidth,
        height: verticalScale(40),
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: scale(10),
        borderWidth: 0.5,
        borderRadius: scale(3),
        borderColor: '#bdbdbd',
        backgroundColor: 'rgba(245, 245, 245, 0.8)',
        // marginTop: 15
    },

    item_view: {
        width: screenWidth,
        height: verticalScale(40),
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: scale(10),
        borderWidth: 0.5,
        borderRadius: scale(3),
        borderColor: '#bdbdbd',
        backgroundColor: 'rgba(245, 245, 245, 0.8)',
        marginTop: verticalScale(15)
    },

    dropdown: {
        flex: 1,
        //backgroundColor : 'blue',
        justifyContent: 'center',
    },

    text_input: {
        flex: 1,
        marginLeft: scale(10),
        justifyContent: 'center'
    },

    dropdown_text: {
        //marginVertical: 10,
        //marginHorizontal: 6,
        fontSize: fontSize(16, scale(2)),// 16,
        color: '#a1a1a1',
        textAlign: 'left',
        marginLeft: scale(10),
        textAlignVertical: 'center',
    },

    text_dropdown: {
        color: '#615B5B',
        paddingLeft: scale(20),
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10)
    },

    dropdown_dropdown: {
        width: screenWidth,
        height: verticalScale(400),
        borderColor: 'cornflowerblue',
        marginRight: -scale(20),
        borderWidth: scale(2),
        borderRadius: scale(3),
    },
})