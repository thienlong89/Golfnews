import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TextInput,
    ListView,
    ScrollView,
    Keyboard,
    TouchableOpacity
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../../Core/View/BaseComponent';
import HeaderView from '../../../Common/HeaderView';
import ApiService from '../../../../Networking/ApiService';
import Networking from '../../../../Networking/Networking';
import FacilityListModel from '../../../../Model/Facility/FacilityListModel';
import PopupNotify from '../../../Popups/PopupNotificationView';
import AppUtil from '../../../../Config/AppUtil';
import ListViewReportFacility from '../../../Menu/Items/ListViewReportFacility';
import { verticalScale, scale, fontSize } from '../../../../Config/RatioScale';
import PopupAttachImageModal from '../../../Common/PopupAttachImageModal';
import AutoScaleLocalImage from '../../../Common/AutoScaleLocalImage';
import SearchFacilityView from '../../../CreateFlight/Tab/Items/SearchFacilityView';

let screenWidth = Dimensions.get('window').width - scale(20);
/**
 * Để xác định xem đang chụp ảnh trước hay ảnh sau
 */
const CAMERA_TYPE = {
    AFTER: 1,
    BERFORE: 2
}
export default class ReportErrorFacilityScreen extends BaseComponent {
    constructor(props) {
        super(props);
        this.facility_id = 0;
        this.paths_image = [];
        this.list_facilities = [];
        this.type = CAMERA_TYPE.BERFORE;
        this.state = {
            //txtFacility: '',
            isEnableSubmit: false,
            frontUri: '',
            backUri: ''
        }

        this.onTakePhotoClick = this.onTakePhoto.bind(this);
        this.onImportGalleryClick = this.onImportGallery.bind(this);
        this.onCameraBeforeClick = this.onCameraBeforeClick.bind(this);
        this.onCameraAfterClick = this.onCameraAfterClick.bind(this);
        this.onSendClick = this.onSendClick.bind(this);
        this.onChangeInputSearchFacility = this.onChangeInputSearchFacility.bind(this);
        this.onSearchFacilityFocus = this.onSearchFacilityFocus.bind(this);
        this.onRemoveFrontUriPress = this.onRemoveFrontUriPress.bind(this);
        this.onRemoveBackUriPress = this.onRemoveBackUriPress.bind(this);
    }

    /**
     * Kiểm tra trước khi gửi dữ liệu
     */
    // checkSendData() {
    //     console.log("facility length : ", this.facility_id);
    //     if (!this.facility_id) {
    //         this.popup.setMsg(this.t('choosen_facility'));
    //         this.popup.show();
    //         return false;
    //     }
    //     if (!this.paths_image.length) {
    //         this.popup.setMsg(this.t('choosen_image'));
    //         this.popup.show();
    //         return false;
    //     }
    //     return true;
    // }

    checkCameraType(uri) {
        console.log('checkCameraType', uri)
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

    componentDidMount() {
        this.listViewFacility.itemClickCallback = this.onItemFacilityClick.bind(this);
        // this.inputSearchFacility.submitCallback = this.sendRequestListFacilities.bind(this);
        // this.inputSearchFacility.enable();

    }

    onSearchFacilityFocus() {
        this.sendRequestListFacilities('');
    }

    onChangeInputSearchFacility(input) {
        this.sendRequestListFacilities(input);
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

    /**
     * 
    */
    sendRequestListFacilities(text) {
        let url = this.getConfig().getBaseUrl() + ApiService.search_facility('', '', '', text);
        //this.loading.showLoading();
        let self = this;
        console.log("facilities url : ", url);
        Networking.httpRequestGet(url, (jsonData) => {
            self.model = new FacilityListModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                //console.log('self.model.getFacilityList()', self.model.getFacilityList());
                if (self.model.getFacilityList().length > 0) {
                    self.list_facilities = self.model.getFacilityList();
                    self.listViewFacility.setFillData(self.list_facilities);
                }
            }
        }, () => {
            //time out
            //self.loading.hideLoading();
            self.popupTimeOut.showPopup();
        })
    }

    onSubmitFacility() {
        this.sendRequestListFacilities();
    }

    /**
     * chup anh mat truoc scorecard
     */
    onCameraBeforeClick() {
        this.type = CAMERA_TYPE.BERFORE;
        this.popupAttachImage.show();
    }

    /**
     * Chup anh mat sau scorecard
     */
    onCameraAfterClick() {
        this.type = CAMERA_TYPE.AFTER;
        this.popupAttachImage.show();
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
            <Touchable onPress={this.onCameraBeforeClick}>
                <View style={styles.button_view}>
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
            <Touchable onPress={this.onCameraAfterClick}>
                <View style={styles.button_view}>
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
            frontUri,
            backUri,
            isEnableSubmit
        } = this.state;
        return (
            <View style={styles.container}>

                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ScrollView>
                        <Text allowFontScaling={global.isScaleFont} style={styles.text_msg}>{this.t('report_error_facility_title')}</Text>

                        <View style={styles.view_search}>
                            <SearchFacilityView ref={(refSearchFacilityView) => { this.refSearchFacilityView = refSearchFacilityView; }}
                                onChangeInputSearchFacility={this.onChangeInputSearchFacility}
                                onSearchFacilityFocus={this.onSearchFacilityFocus}
                                isShow={true}
                            />
                        </View>

                        {this.renderFrontImage(frontUri)}
                        {this.renderBackImage(backUri)}

                    </ScrollView>

                    <TouchableOpacity onPress={this.onSendClick}
                        disabled={!isEnableSubmit}
                        style={{ opacity: isEnableSubmit ? 1 : 0.5 }}>
                        <View style={styles.button_send}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.send_label}>{this.t('send')}</Text>
                        </View>
                    </TouchableOpacity>

                    <ListViewReportFacility ref={(listViewFacility) => { this.listViewFacility = listViewFacility; }}
                        customStyle={styles.list_facility} />

                    <PopupAttachImageModal
                        ref={(popupAttachImage) => { this.popupAttachImage = popupAttachImage; }}
                        onTakePhotoClick={this.onTakePhotoClick}
                        onImportGalleryClick={this.onImportGalleryClick} />

                    <PopupNotify ref={(popup) => { this.popup = popup }} />

                    {this.renderLoading()}
                </View>
            </View>
        );
    }

    validateData() {
        let {
            frontUri,
            backUri,
            isEnableSubmit
        } = this.state;
        if (this.facility_id && frontUri && backUri) {
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
        // if (this.checkSendData()) {
        this.sendRequestReportFacility();
        // }
    }

    /**
     * Gui thong tin report san
     */
    sendRequestReportFacility() {
        let {
            frontUri,
            backUri
        } = this.state;
        let url = this.getConfig().getBaseUrl() + ApiService.report_facility_create(this.facility_id);
        if (this.loading)
            this.loading.showLoading();
        let self = this;
        AppUtil.upload_mutil(url, [frontUri, backUri], (jsonData) => {
            // console.log("report response ", jsonData);
            if (self.loading)
                self.loading.hideLoading();
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    self.popup.setCallback(this.onReportSuccess.bind(this));
                    self.popup.setMsg(this.t('report_error_facility_msg'));
                } else if (error_code === 2) {
                    self.onCheckErrorCode(2, '');
                }
                else {
                    self.popup.setMsg(jsonData['error_msg']);
                }
            }

        }, () => {
            if (self.loading)
                self.loading.hideLoading();
        });
    }

    onItemFacilityClick(data) {
        this.facility_id = data.getId();
        this.refSearchFacilityView.setValue(data.getSubTitle());
        Keyboard.dismiss();
    }

    onReportSuccess() {
        this.setState({
            frontUri: '',
            backUri: '',
            isEnableSubmit: false
        }, () => {
            this.facility_id = '';
            this.refSearchFacilityView.setValue('');
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },

    item: {
        height: verticalScale(30),
        width: screenWidth,
        fontSize: fontSize(14),
        color: '#000',
        marginLeft: scale(5),
        // backgroundColor : 'green',
        textAlignVertical: 'center',
        //borderBottomColor: '#ebebeb', 
        //borderBottomWidth: 0.5 
    },
    scorecard: {
        margin: scale(10)
    },
    view_search: {
        margin: scale(10)
    },
    button_view: {
        height: verticalScale(40),
        marginLeft: scale(10),
        marginRight: scale(10),
        marginTop: verticalScale(15),
        borderColor: '#00aba7',
        borderWidth: 0.5,
        borderRadius: verticalScale(3),
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
        borderRadius: verticalScale(3),
        flexDirection: 'row',
        alignItems: 'center'
    },

    send_label: {
        flex: 1,
        fontSize: fontSize(15),
        color: '#fff',
        textAlign: 'center',
        alignItems: 'center'
    },

    button_right: {
        width: verticalScale(30),
        height: verticalScale(40)
    },

    button_label: {
        flex: 1,
        fontSize: fontSize(14),
        color: '#00aba7',
        textAlign: 'center',
        alignItems: 'center'
    },

    camera: {
        width: verticalScale(20),
        height: verticalScale(20),
        marginLeft: scale(10),
        alignItems: 'center',
        resizeMode: 'contain'
    },

    text_msg: {
        marginLeft: scale(10),
        marginRight: scale(10),
        minHeight: verticalScale(60),
        fontSize: fontSize(14),// 14,
        color: '#424242'
    },

    list_facility: {
        position: "absolute",
        top: verticalScale(120),
        left: scale(10),
        right: scale(10),
        bottom: verticalScale(10),
        backgroundColor: '#fff',
        borderColor: '#000',
        borderWidth: 1
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