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
    BackHandler
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../Common/HeaderView';
import ModalDropdown from 'react-native-modal-dropdown';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import ListCountryModel from '../../Model/CreateFlight/ListCountryModel';
import ListStateModel from '../../Model/CreateFlight/ListStateModel';
import ListCityModel from '../../Model/CreateFlight/ListCityModel';
import FacilityListModel from '../../Model/Facility/FacilityListModel';
import PopupNotify from '../Popups/PopupNotificationView';
import AppUtil from '../../Config/AppUtil';
import PopupAttackImage from '../Popups/PopupSelectImage';
import MyView from '../../Core/View/MyView';
import MyTextInput from '../Common/MyTextInput';
import MyListView from '../Common/MyListView';
import ListViewReportFacility from './Items/ListViewReportFacility';
import { verticalScale, scale, fontSize } from '../../Config/RatioScale';

let screenWidth = Dimensions.get('window').width - scale(20);
/**
 * Để xác định xem đang chụp ảnh trước hay ảnh sau
 */
const CAMERA_TYPE = {
    AFTER: 1,
    BERFORE: 2
}
export default class ReportErrorInfoFacilityView extends BaseComponent {
    constructor(props) {
        super(props);
        this.country_id = '';
        this.state_id = '';
        this.city_id = '';
        this.facility_id = 0;
        this.paths_image = [];
        this.list_facilities = [];
        this.type = CAMERA_TYPE.BERFORE;
        this.country_sortname = '';
        this.list_cities = [];
        this.list_states = [];
        this.state = {
            //dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            txtNational: this.t('country'),
            txtTerritory: this.t('state'),
            txtCity: this.t('city_list'),
            //txtFacility: '',

            path_image1: '',
            path_image2: '',
            img1_width: 0,
            img1_height: 0,
            img2_width: 0,
            img2_height: 0,
            isState: false
        }

        this.backHandler = null;
    }

    /**
     * Kiểm tra trước khi gửi dữ liệu
     */
    checkSendData() {
        console.log("facility length : ", this.facility_id);
        if (!this.facility_id) {
            this.popup.setMsg(this.t('choosen_facility'));
            this.popup.show();
            return false;
        }
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
        if (navigation) {
            navigation.goBack();
        }
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
        //console.log("width, height",_w,_h,screenWidth);
        return { w: _w, h: _h };
    }

    async onTakePhoto() {
        let obj = await AppUtil.onTakePhotoClick(true);
        if (!Object.keys(obj).length) return;
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
            this.headerView.setTitle(this.t('bao_loi_thong_tin_san'));
            this.headerView.callbackBack = this.onBackClick.bind(this);
        }

        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBackClick.bind(this));

        this.textInputNational.focusCallback = this.onNationalFocus.bind(this);
        this.textInputNational.submitCallback = this.onNationalSubmit.bind(this);
        this.listViewNational.itemClickCallback = this.onNationalSelected.bind(this);
        this.textInputNational.enable();

        this.textInputCity.focusCallback = this.onCityFocus.bind(this);
        this.textInputCity.submitCallback = this.onCitySubmit.bind(this);
        this.listViewCity.itemClickCallback = this.onCityClick.bind(this);

        this.listViewFacility.itemClickCallback = this.onItemFacilityClick.bind(this);
        this.inputSearchFacility.submitCallback = this.sendRequestListFacilities.bind(this);
        this.inputSearchFacility.enable();

        this.popupAttackImage.onTakePhotoCallback = this.onTakePhoto.bind(this);
        this.popupAttackImage.onImportGalleryCallback = this.onImportGallery.bind(this);
        this.sendRequestListCountries();
    }

    componentWillUnmount() {
        if (this.backHandler) this.backHandler.remove();
    }

    setStateCallback() {
        if (this.textInputTerritory) {
            this.textInputTerritory.focusCallback = this.onTerritoryFocus.bind(this);
            this.textInputTerritory.submitCallback = this.onTerritorySubmit.bind(this);
            this.listViewTerritory.itemClickCallback = this.onTerritorySelected.bind(this);
        }
    }

    onCityFocus() {
        this.listViewCity.setFillData(this.list_cities);
        this.inputSearchFacility.clear();
        this.listViewFacility.hide();
    }

    onCitySubmit(text) {
        let array_city = this.list_cities.filter(d => d.getName().toLowerCase().indexOf(text.toLowerCase().trim()) >= 0);
        if (array_city.length) {
            this.listViewCity.setFillData(array_city);
        }
    }

    onCityClick(data) {
        this.textInputCity.setValue(data.getName());
        this.city_id = data.getId();
        this.inputSearchFacility.focus();
        this.sendRequestListFacilities();
    }

    /**
     * focus vao chon Bang
     */
    onTerritoryFocus() {
        this.listViewTerritory.setFillData(this.list_states);
        this.listViewCity.hide();
        this.inputSearchFacility.clear();
        this.listViewFacility.hide();
    }

    onTerritorySubmit(text) {
        let array_territory = this.list_states.filter(d => d.getName().toLowerCase().indexOf(text.toLowerCase().trim()) >= 0);
        if (array_territory.length) {
            this.listViewTerritory.setFillData(array_territory);
        }
    }

    /**
     * focus vao o tim kiem quoc gia thi hien 
     */
    onNationalFocus() {
        this.listViewNational.setFillData(global.list_countries);
        this.listViewCity.hide();
        this.inputSearchFacility.clear();
        if (this.listViewTerritory) {
            this.listViewTerritory.hide();
        }
        this.listViewFacility.hide();
    }

    /**
     * Khi tim kiem quoc gia
     * @param {*} text 
     */
    onNationalSubmit(text) {
        let array_national = global.list_countries.filter(d => d.getName().toLowerCase().indexOf(text.toLowerCase().trim()) >= 0);
        if (array_national.length) {
            this.listViewNational.setFillData(array_national);
        }
    }

    /**
     * Chon quoc gia
     * @param {*} data 
     * @param {*} index 
     */
    onNationalSelected(data) {
        this.country_id = data.getId();
        this.country_sortname = data.getSortName();
        this.textInputNational.setValue(data.getName());
        if (this.textInputTerritory) {
            this.textInputTerritory.setValue(this.t('state'));
        }
        this.textInputCity.setValue(this.t('city'));
        this.state_id = null;
        this.city_id = null;
        if (data.getNumberState() > 0) {
            let self = this;
            this.setState({
                isState: true
            }, () => {
                self.setStateCallback();
                this.sendRequestListState(data.getId());
            });
        } else {
            this.setState({
                isState: false
            });
            this.sendRequestListCity();
        }
    }

    /**
     * Gửi yêu cầu lấy danh sách các quốc gia
     */
    sendRequestListCountries() {
        if (global.list_countries.length) {
            this.listViewNational.setFillData(global.list_countries);
            return;
        }
        let url = this.getConfig().getBaseUrl() + ApiService.list_countries();
        this.internalLoading.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            //console.log("quoc gia : ",jsonData);
            self.model = new ListCountryModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                //console.log('onListCountryResponse', self.model.getCountryList());
                global.list_countries = self.model.getCountryList();
            } else {
                self.popup.setMsg(jsonData['error_msg']);
                self.popup.show();
            }
            self.internalLoading.hideLoading();
        }, () => {
            //time out
            self.internalLoading.hideLoading();
            self.popupTimeOut.showPopup();
        })
    }

    /**
     * chon vung lanh thổ/bang
     * @param {*} data 
     * @param {*} index 
     */
    onTerritorySelected(data) {
        this.state_id = data.getId() || '';
        this.textInputTerritory.setValue(data.getName());
        this.sendRequestListCity();
    }

    /**
     * Lay danh sach cac bang
     */
    sendRequestListState(country) {
        if (this.country_sortname) {
            let arr_state = global.list_states.hasOwnProperty(this.country_sortname) ? global.list_states[this.country_sortname] : [];
            if (arr_state.length) {
                this.list_states = arr_state;
                this.listViewTerritory.setFillData(this.list_states);
                this.textInputTerritory.enable();
                this.textInputTerritory.focus();
                return;
            }
        }
        this.internalLoading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.list_states(country);
        console.log("list state url : ", url);
        Networking.httpRequestGet(url, (jsonData) => {
            //console.log("data state : ",jsonData);
            self.model = new ListStateModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                //console.log("list state ", self.model.getStateList());
                self.list_states = self.model.getStateList();
                global.list_states[this.country_sortname] = self.model.getStateList();
                //console.log("list state : ",self.list_states);
                self.listViewTerritory.setFillData(self.list_states);
                self.textInputTerritory.enable();
                self.textInputTerritory.focus();
            }
            self.internalLoading.hideLoading();
        }, () => {
            //time out
            self.internalLoading.hideLoading();
            self.popupTimeOut.showPopup();
        });
    }

    /**
     * Lay danh sach cac thanh pho
     */
    sendRequestListCity() {
        if (this.country_sortname) {
            let arr_city = global.list_cities.hasOwnProperty(this.country_sortname) ? global.list_cities[this.country_sortname] : [];
            if (arr_city.length) {
                this.list_cities = arr_city;
                this.listViewCity.setFillData(this.list_cities);
                this.textInputCity.enable();
                this.textInputCity.focus();
                return;
            }
        }
        this.internalLoading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.list_cities(this.country_id, this.state_id);
        console.log("list state url : ", url);
        Networking.httpRequestGet(url, (jsonData) => {
            self.model = new ListCityModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                //console.log("list state ", self.model.getStateList());
                self.list_cities = self.model.getCityList();
                global.list_cities[this.country_sortname] = self.model.getCityList();
                self.textInputCity.enable();
                self.textInputCity.focus();
                self.listViewCity.setFillData(self.list_cities);
                // self.listCitiesView.setFillData(this.list_cities);
            }
            self.internalLoading.hideLoading();
        }, () => {
            //time out
            self.internalLoading.hideLoading();
            self.popupTimeOut.showPopup();
        });
    }

    /**
     * 
    */
    sendRequestListFacilities(text) {
        let url = this.getConfig().getBaseUrl() + ApiService.search_facility(this.country_id, this.state_id, this.city_id, text);
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
        this.popupAttackImage.show();
    }

    /**
     * Chup anh mat sau scorecard
     */
    onCameraAfterClick() {
        this.type = CAMERA_TYPE.AFTER;
        this.popupAttackImage.show();
    }

    /**
     * Gui thong tin
     */
    onSendClick() {
        if (this.checkSendData()) {
            this.sendRequestReportFacility();
        }
    }

    /**
     * Gui thong tin report san
     */
    sendRequestReportFacility() {
        let url = this.getConfig().getBaseUrl() + ApiService.report_facility_create(this.facility_id);
        this.internalLoading.showLoading();
        let self = this;
        AppUtil.upload_mutil(url, this.paths_image, (jsonData) => {
            console.log("report response ", jsonData);
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
            self.internalLoading.hideLoading();
        });
    }

    onItemFacilityClick(data) {
        this.facility_id = data.getId();
        this.inputSearchFacility.setValue(data.getSubTitle());
    }

    render() {
        let { txtNational,
            txtTerritory,
            txtCity,
            isState
        } = this.state;
        return (
            <View style={styles.container}>
                <PopupNotify ref={(popup) => { this.popup = popup }} />
                <PopupAttackImage ref={(popupAttackImage) => { this.popupAttackImage = popupAttackImage; }} />
                {/* {this.renderLoading()} */}
                <HeaderView ref={(headerView) => { this.headerView = headerView; }} />
                <Text allowFontScaling={global.isScaleFont} style={styles.text_msg}>{this.t('bao_loi_thong_tin_san_msg')}</Text>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={styles.item_view}>
                        <MyTextInput
                            ref={(textInputNational) => { this.textInputNational = textInputNational; }}
                            //defaultValue={txtNational}
                            placeholder={txtNational}
                            style={styles.text_input} />
                        <Image
                            style={styles.arrow_img}
                            source={this.getResources().ic_arrow_down}
                        />
                    </View>
                    <MyView style={styles.item_view} hide={!isState}>
                        <MyTextInput
                            ref={(textInputTerritory) => { this.textInputTerritory = textInputTerritory; }}
                            // defaultValue={txtTerritory}
                            placeholder={txtTerritory}
                            style={styles.text_input} />
                        <Image
                            style={styles.arrow_img}
                            source={this.getResources().ic_arrow_down}
                        />
                    </MyView>
                    <View style={styles.item_view}>
                        <MyTextInput
                            ref={(textInputCity) => { this.textInputCity = textInputCity; }}
                            // defaultValue={txtTerritory}
                            placeholder={txtCity}
                            style={styles.text_input} />
                        <Image
                            style={styles.arrow_img}
                            source={this.getResources().ic_arrow_down}
                        />
                    </View>
                    <View style={styles.facility_view}>
                        <View style={styles.item_view_2}>
                            {/* <TextInput ref={(input) => { this.inputSearch = input }}
                                style={styles.input_facility}
                                placeholder={this.t('golf_course')}
                                // editable={!disable_facility}
                                placeholderTextColor='#a1a1a1'
                                underlineColorAndroid='rgba(0,0,0,0)'
                                //onSubmitEditing={this.onSubmitFacility.bind(this)}
                                onChangeText={(text) => { this.sendRequestListFacilities(text) }}
                                value={this.state.txtFacility}
                            >
                            </TextInput> */}
                            <MyTextInput ref={(input) => { this.inputSearchFacility = input }}
                                style={styles.input_facility}
                                placeholder={this.t('golf_course')}
                            />
                            <Image
                                style={styles.searct_facility_img}
                                source={this.getResources().ic_Search}
                            />
                        </View>
                    </View>
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
                            style={[{ width: this.state.img1_width, height: this.state.img1_height }, styles.img_uplaod]}
                            source={{ uri: this.state.path_image1 }}
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
                            style={[{ width: this.state.img2_width, height: this.state.img2_height }, styles.img_uplaod]}
                            source={{ uri: this.state.path_image2 }}
                        />
                    </ScrollView>
                    <Touchable onPress={this.onSendClick.bind(this)}>
                        <View style={styles.button_send}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.send_label}>{this.t('send')}</Text>
                        </View>
                    </Touchable>
                    <MyListView
                        ref={(listViewNational) => { this.listViewNational = listViewNational; }}
                        top={60}
                        left={10}
                        right={10} />
                    <MyListView
                        ref={(listViewTerritory) => { this.listViewTerritory = listViewTerritory; }}
                        top={115}
                        left={10}
                        right={10} />
                    <MyListView
                        ref={(listViewCity) => { this.listViewCity = listViewCity; }}
                        top={isState ? 170 : 115}
                        left={10}
                        right={10} />
                    <ListViewReportFacility ref={(listViewFacility) => { this.listViewFacility = listViewFacility; }} />
                    {this.renderInternalLoading()}
                </View>
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
        margin: verticalScale(10),
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
        fontSize: fontSize(14),
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
        width: verticalScale(20),
        height: verticalScale(20),
        marginRight: scale(5),
        alignItems: 'center',
        justifyContent: 'center',
        resizeMode: 'contain'
    },

    searct_facility_img: {
        width: verticalScale(20),
        height: verticalScale(20),
        marginRight: scale(5),
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
        borderRadius: verticalScale(3),
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
        fontSize: fontSize(14),
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
        marginTop: verticalScale(10),
        marginRight: scale(10),
        minHeight: verticalScale(60),
        fontSize: fontSize(20,scale(6)),
        color: '#424242'
    },

    item_view_2: {
        width: screenWidth,
        height: verticalScale(40),
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: scale(10),
        borderWidth: 0.5,
        borderRadius: verticalScale(3),
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
        borderRadius: verticalScale(3),
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
        fontSize: fontSize(16, scale(2)),
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
        marginRight: scale(-20),
        borderWidth: verticalScale(2),
        borderRadius: verticalScale(3),
    },
})