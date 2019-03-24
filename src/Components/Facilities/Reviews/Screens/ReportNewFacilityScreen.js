import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../../Core/View/BaseComponent';
import ApiService from '../../../../Networking/ApiService';
import Networking from '../../../../Networking/Networking';
import PopupNotify from '../../../Popups/PopupNotificationView';
import AppUtil from '../../../../Config/AppUtil';
import PopupAttachImageModal from '../../../Common/PopupAttachImageModal';
import AutoScaleLocalImage from '../../../Common/AutoScaleLocalImage';
import PropStatic from '../../../../Constant/PropsStatic';

import { scale, verticalScale, fontSize } from '../../../../Config/RatioScale';

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
        this.countryId = '';
        this.state = {
            country: '',
            frontUri: '',
            backUri: '',
            facilityName: '',
            description: '',
            isEnableSubmit: false
        }

        this.onFacilityNameChange = this.onFacilityNameChange.bind(this);
        this.onCameraBeforeClick = this.onCameraBeforeClick.bind(this);
        this.onCameraAfterClick = this.onCameraAfterClick.bind(this);
        this.onSendClick = this.onSendClick.bind(this);
        this.onTakePhotoClick = this.onTakePhoto.bind(this);
        this.onImportGalleryClick = this.onImportGallery.bind(this);
        this.onCountryFocus = this.onCountryFocus.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
        this.onRemoveFrontUriPress = this.onRemoveFrontUriPress.bind(this);
        this.onRemoveBackUriPress = this.onRemoveBackUriPress.bind(this);
    }

    renderFrontImage(frontUri) {
        if (frontUri) {
            return (
                <View>
                    <AutoScaleLocalImage
                        ref={(refFrontImage) => { this.refFrontImage = refFrontImage }}
                        customStyle={styles.scorecard}
                        screenWidth={screenWidth} />
                    <TouchableOpacity style={styles.touchable_close}
                        onPress={this.onRemoveFrontUriPress}>
                        <Image
                            style={styles.img_close}
                            source={this.getResources().ic_x} />
                    </TouchableOpacity>
                </View>
            )
        }
        return (
            <Touchable onPress={this.onCameraBeforeClick}
                style={styles.touchable_import_photo}>
                <View style={styles.button_view_2}>
                    <Image
                        style={styles.camera}
                        source={this.getResources().camera_2}
                    />
                    <Text allowFontScaling={global.isScaleFont} style={styles.button_label}>{this.t('chup_anh_mat_truoc_scorecard')}</Text>
                    <View style={styles.button_right}></View>
                </View>
            </Touchable>
        )
    }

    renderBackImage(backUri) {
        if (backUri) {
            return (
                <View>
                    <AutoScaleLocalImage
                        ref={(refBackImage) => { this.refBackImage = refBackImage }}
                        customStyle={styles.scorecard}
                        screenWidth={screenWidth} />
                    <TouchableOpacity style={styles.touchable_close}
                        onPress={this.onRemoveBackUriPress}>
                        <Image
                            style={styles.img_close}
                            source={this.getResources().ic_x} />
                    </TouchableOpacity>
                </View>
            )
        }
        return (
            <Touchable onPress={this.onCameraAfterClick}
                style={styles.touchable_import_photo}>
                <View style={styles.button_view_2}>
                    <Image
                        style={styles.camera}
                        source={this.getResources().camera_2}
                    />
                    <Text allowFontScaling={global.isScaleFont} style={styles.button_label}>{this.t('chup_anh_mat_sau_scorecard')}</Text>
                    <View style={styles.button_right}></View>
                </View>
            </Touchable>

        )
    }

    render() {
        let {
            country,
            isEnableSubmit,
            frontUri,
            backUri,
            facilityName,
            description
        } = this.state;

        return (
            <KeyboardAvoidingView style={styles.container}
                behavior="padding"
                enabled>
                <PopupNotify ref={(popup) => { this.popup = popup }} />
                <ScrollView contentContainerStyle={{ paddingBottom: scale(10) }}>
                    {/* <KeyboardAvoidingView style={{ flex: 1 }}
                        behavior="padding"
                        enabled> */}

                    <Text allowFontScaling={global.isScaleFont} style={styles.text_msg}>{this.t('report_new_facility_title')}</Text>

                    <TextInput allowFontScaling={global.isScaleFont}
                        style={[styles.text_input, styles.view_input]}
                        placeholder={this.t('enter_facility_name')}
                        placeholderTextColor='#8A8A8F'
                        underlineColorAndroid='rgba(0,0,0,0)'
                        value={facilityName}
                        onChangeText={this.onFacilityNameChange}
                        multiline={true}
                    />

                    <TextInput allowFontScaling={global.isScaleFont}
                        style={[styles.text_input, styles.view_input, { minHeight: scale(60) }]}
                        placeholder={this.t('report_new_facility_description')}
                        placeholderTextColor='#8A8A8F'
                        underlineColorAndroid='rgba(0,0,0,0)'
                        onChangeText={this.onDescriptionChange}
                        value={description}
                        multiline={true}
                    />

                    <View style={styles.view_input}>
                        <TextInput allowFontScaling={global.isScaleFont}
                            style={styles.text_input}
                            placeholder={this.t('country')}
                            placeholderTextColor='#8A8A8F'
                            underlineColorAndroid='rgba(0,0,0,0)'
                            value={country}
                            // onChangeText={this.onFacilityNameChange}
                            onFocus={this.onCountryFocus}
                        />
                    </View>

                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        {this.renderFrontImage(frontUri)}
                        {this.renderBackImage(backUri)}
                    </View>

                    {/* </KeyboardAvoidingView> */}
                </ScrollView>

                <TouchableOpacity onPress={this.onSendClick}
                    disabled={!isEnableSubmit}
                    style={{ opacity: isEnableSubmit ? 1 : 0.5 }}>
                    <View style={styles.button_send}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.send_label}>{this.t('send')}</Text>
                    </View>
                </TouchableOpacity>

                <PopupAttachImageModal
                    ref={(popupAttachImage) => { this.popupAttachImage = popupAttachImage; }}
                    onTakePhotoClick={this.onTakePhotoClick}
                    onImportGalleryClick={this.onImportGalleryClick} />
                {this.renderLoading()}
            </KeyboardAvoidingView>
        );
    }

    checkCameraType(uri) {
        switch (this.type) {
            case CAMERA_TYPE.BERFORE:
                this.setState({
                    frontUri: uri
                }, () => {
                    this.refFrontImage.setNewUri(uri);
                    this.validateData();
                })

                break;
            case CAMERA_TYPE.AFTER:
                this.setState({
                    backUri: uri
                }, () => {
                    this.refBackImage.setNewUri(uri);
                    this.validateData();
                })

                break;
            default:
                break;
        }
    }

    async onTakePhoto() {
        let obj = await AppUtil.onTakePhotoClick(false);
        if (!Object.keys(obj).length) return;
        let uri = obj.path;
        this.paths_image.push(obj);
        this.checkCameraType(uri);
    }

    async onImportGallery() {
        let obj = await AppUtil.onImportGalleryClick(false);
        if (!Object.keys(obj).length) return;
        let uri = obj.path;
        this.paths_image.push(obj);
        this.checkCameraType(uri);
    }

    /**
     * chup anh mat truoc scorecard
     */
    onCameraBeforeClick() {
        this.type = CAMERA_TYPE.BERFORE;
        if (this.popupAttachImage) {
            this.popupAttachImage.show();
        }
    }

    /**
     * Chup anh mat sau scorecard
     */
    onCameraAfterClick() {
        this.type = CAMERA_TYPE.AFTER;
        if (this.popupAttachImage) {
            this.popupAttachImage.show();
        }
    }

    onCountryFocus() {
        let navigation = PropStatic.getAppSceneNavigator();
        if (navigation) {
            navigation.navigate('show_list_country', { countryCallback: this.onCountrySelected.bind(this) });
        }
    }

    onCountrySelected(country) {
        this.setState({
            country: country.getName()
        }, () => {
            this.countryId = country.getId();
            this.validateData();
        })
    }

    onFacilityNameChange(input) {
        this.setState({
            facilityName: input
        }, () => {
            this.validateData();
        })

    }

    onDescriptionChange(input) {
        this.setState({
            description: input
        }, () => {
        })
    }

    onRemoveFrontUriPress() {
        this.setState({
            frontUri: ''
        }, () => {
            this.validateData();
        })
    }

    onRemoveBackUriPress() {
        this.setState({
            backUri: ''
        }, () => {
            this.validateData();
        })
    }

    validateData() {
        let {
            country,
            isEnableSubmit,
            frontUri,
            backUri,
            facilityName
        } = this.state;
        if (country && facilityName && frontUri && backUri) {
            if (!isEnableSubmit) {
                this.setState({
                    isEnableSubmit: true
                })
            }
        } else if (isEnableSubmit) {
            this.setState({
                isEnableSubmit: false
            })
        }
    }

    /**
     * Gui thong tin
     */
    onSendClick() {
        this.sendRequestReportFacility();
    }

    setTimeOut() {
        let self = this;
        this.refreshIntervalId = setInterval(() => {
            if (self.loading) {
                self.loading.hideLoading();
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
        let {
            frontUri,
            backUri
        } = this.state;
        let url = this.getConfig().getBaseUrl() + ApiService.report_facility_new(this.getUserInfo().getLongitude(), this.getUserInfo().getLatitude());
        if (this.loading)
            this.loading.showLoading();
        let self = this;
        this.setTimeOut();
        console.log("url: ", url);
        AppUtil.upload_mutil(url, [frontUri, backUri], (jsonData) => {
            console.log("sendRequestReportFacility ", jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    try {
                        let id = jsonData.data.facility_report.id;
                        console.log("sendRequestReportFacility.id", id);
                        self.requestUpdateReport(id);
                    } catch (error) {
                        if (self.loading)
                            self.loading.hideLoading();
                        if (self.refreshIntervalId) {
                            clearInterval(self.refreshIntervalId);
                        }
                    }
                } else if (error_code === 2) {
                    if (self.loading)
                        self.loading.hideLoading();
                    if (self.refreshIntervalId) {
                        clearInterval(self.refreshIntervalId);
                    }
                    self.onCheckErrorCode(2, '');
                } else {
                    if (self.loading)
                        self.loading.hideLoading();
                    if (self.refreshIntervalId) {
                        clearInterval(self.refreshIntervalId);
                    }
                    self.popup.setMsg(jsonData['error_msg']);
                }
            }

        }, () => {
            if (self.refreshIntervalId) {
                clearInterval(self.refreshIntervalId);
            }
            if (self.loading)
                self.loading.hideLoading();
        });
    }

    requestUpdateReport(reportId) {
        // this.loading.showLoading();
        let {
            facilityName,
            description
        } = this.state;
        let self = this;
        let fromData = {
            "country_id": this.countryId,
            "note": description,
            "new_name_facility": facilityName
        }
        console.log('requestUpdateReport.fromData', fromData)
        let url = this.getConfig().getBaseUrl() + ApiService.report_facility_new_update(this.getUserInfo().getLongitude(), this.getUserInfo().getLatitude(), reportId);
        console.log('url', url)
        Networking.httpRequestPost(url, (jsonData) => {
            console.log('requestUpdateInfo', jsonData);
            if (self.loading)
                self.loading.hideLoading();
            if (jsonData.error_code === 0) {
                this.popup.setCallback(this.onReportSuccess.bind(this));
                self.popup.setMsg(this.t('report_error_facility_msg'));
            } else {
                self.showErrorMsg(jsonData.error_msg);
            }

        }, fromData, () => {
            //time out
            if (self.loading)
                self.loading.hideLoading();
            self.showErrorMsg(self.t('time_out'));
        });
    }

    onReportSuccess() {
        this.setState({
            frontUri: '',
            backUri: '',
            country: '',
            isEnableSubmit: false,
            facilityName: '',
            description: ''
        }, () => {
            this.countryId = '';
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },

    img_upload: {
        resizeMode: 'contain',
        alignSelf: 'center',
        margin: scale(10),
        borderColor: '#ebebeb',
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

    touchable_import_photo: {
        marginTop: verticalScale(15),
    },
    button_view_2: {
        height: verticalScale(40),
        marginLeft: scale(10),
        marginRight: scale(10),
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
        fontSize: fontSize(15),// 14,
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
        marginTop: verticalScale(5),
        marginRight: scale(10),
        // minHeight: verticalScale(60),
        fontSize: fontSize(14),// 14,
        color: '#424242'
    },
    view_input: {
        borderColor: '#A1A1A1',
        borderWidth: 1,
        borderRadius: scale(5),
        // justifyContent: 'center',
        marginLeft: scale(10),
        marginRight: scale(10),
        marginTop: scale(10)
    },
    text_input: {
        padding: verticalScale(4),
        fontSize: fontSize(14),
        lineHeight: fontSize(18, verticalScale(4)),
    },
    scorecard: {
        margin: scale(10)
    },
    touchable_close: {
        position: 'absolute',
        right: scale(10),
        top: scale(10),
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    img_close: {
        width: scale(20),
        height: scale(20),
        resizeMode: 'contain',
        tintColor: '#fff'
    }
})