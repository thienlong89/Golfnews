/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {
    Text,
    View,
    Image,
    ScrollView,
    Dimensions,
    TextInput
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import styles from '../../../Styles/Users/StylePersonalView';
import PhoneItem from './PhoneItem';
import PopupVerifiedPhone from '../../Common/PopupVerifiedPhone';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-datepicker';
import ModalDropdown from 'react-native-modal-dropdown';
import MyView from '../../../Core/View/MyView';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import PopupNotification from '../../Popups/PopupNotificationView';
import ListCountryModel from '../../../Model/CreateFlight/ListCountryModel';
import ListCityModel from '../../../Model/CreateFlight/ListCityModel';
import moment from 'moment';
import MyTextInput from '../../Common/MyTextInput';
import MyListView from '../../Common/MyListView';
import ListStateModel from '../../../Model/CreateFlight/ListStateModel';
import { fontSize, scale } from '../../../Config/RatioScale';
//import SearchableDropDown from 'react-native-searchable-dropdown';

// const TAG = "[Vhandicap-v1] PersionalInfo : ";
const screenWidth = Dimensions.get('window').width - 15;

export default class PersionalInfo extends BaseComponent {
    constructor(props) {
        super(props);
        this.sex_id = this.getUserInfo().getSex();
        this.country = '';
        this.country_sortname = this.getUserInfo().getCountry();
        this.txtCity = this.getUserInfo().getCity();
        this.city_id = null;
        this.txtCountry = this.getUserInfo().getCountry();
        this.txtState = this.getUserInfo().getState();
        this.birthday = null;
        //console.log("txtState : ==================== ",this.txtState,this.txtState.length);
        this.list_cities = global.list_cities[this.country_sortname] || [];
        this.list_states = [];
        this.state_id = null;
        this.updateCompleteCallback = null;
        this.state = {
            txtName: this.getUserInfo().getFullname(),
            date_birthday: this.getUserInfo().getBirthdayDisplay(),
            txtSex: global.DROPDOWN_SEX.find(d => d.id === this.getUserInfo().getSex()).name,
            editable: false,
            isState: this.txtState.length ? true : false,
            // listPhone: this.genListPhone(),
        }
        this.onEditableClick = this.onEditableClick.bind(this);
    }

    genListPhone() {
        let list_phone = [];
        let array_phone = this.getUserInfo().getListPhone();
        let length = array_phone.length;
        for (let i = 0; i < length; i++) {
            let d = array_phone[i];
            if (i === 0) {
                list_phone.push({ phone: d, isAdded: true, view_label: true });
            } else {
                list_phone.push({ phone: d, isAdded: true, view_label: false });
            }
        }
        list_phone.push({ phone: '', isAdded: false, view_label: false });
        return list_phone;
    }

    componentDidMount() {
        //this.popupVerifyPhone.dimiss();
        this.inputCountry.focusCallback = this.onCountryFocus.bind(this);
        this.inputCountry.submitCallback = this.onCountrySubmit.bind(this);
        this.listCountry.itemClickCallback = this.onCountrySelected.bind(this);
        //city
        this.inputCity.focusCallback = this.onCityFocus.bind(this);
        this.inputCity.submitCallback = this.onCitySubmit.bind(this);
        this.listCitiesView.itemClickCallback = this.onCitySelected.bind(this);
        //state
        //this.setStateCallback();
    }

    setStateCallback() {
        if (this.inputState) {
            this.inputState.focusCallback = this.onStateFocus.bind(this);
            this.inputState.submitCallback = this.onStateSubmit.bind(this);
            this.listStateView.itemClickCallback = this.onStateClick.bind(this);
            this.inputState.enable();
        }
    }

    onStateFocus() {
        // this.listCitiesView.hide();
        // if (!this.list_states || !this.list_states.length) {
        //     this.sendRequestState();
        //     return;
        // }
        // this.listStateView.setFillData(this.list_states);
        this.props.navigation.navigate('show_list_country_state', {
            'country': this.country,
            stateCallback: this.onStateClick.bind(this)
        });
    }

    /**
     * submit state
     * @param {*} txtSearch 
     */
    onStateSubmit(txtSearch) {
        this.listCitiesView.hide();
        if (txtSearch.trim().length) {
            let arr_states = this.list_states.filter(d => d.getName().toLowerCase().indexOf(txtSearch.toLowerCase()) >= 0);
            this.listStateView.setFillData(arr_states);
        } else {
            this.listStateView.setFillData(this.list_states);
        }
    }

    /**
     * click chon state
     * @param {*} data 
     */
    onStateClick(data) {
        this.state_id = data.getId();
        this.txtState = data.getName();
        this.inputState.setValue(data.getName());
        // this.sendRequestListCity();
    }

    onCitySubmit(txtSearch) {
        if (txtSearch.trim().length) {
            let array_cities = this.list_cities.filter(d => d.getName().toLowerCase().indexOf(txtSearch.toLowerCase()) >= 0);
            this.listCitiesView.setFillData(array_cities);
        } else {
            this.listCitiesView.setFillData(this.list_cities);
        }
    }

    onCityFocus() {
        // if (!this.list_cities || !this.list_cities.length) {
        //     this.sendRequestListCity();
        //     return;
        // }
        // this.listCitiesView.setFillData(this.list_cities);
        this.props.navigation.navigate('show_list_city', {
            'country': this.country,
            'state_id': this.state_id,
            cityCallback: this.onCitySelected.bind(this)
        });
    }

    onCountrySubmit(txtSearch) {
        this.listCitiesView.hide();
        if (this.listStateView) {
            this.listStateView.hide();
        }
        if (txtSearch.trim().length) {
            let array_country = global.list_countries.filter(d => d.getName().toLowerCase().indexOf(txtSearch.toLowerCase()) >= 0);
            this.listCountry.setFillData(array_country);
        } else {
            this.listCountry.setFillData(global.list_countries);
        }
    }

    /**
     * focus vao o tim kiem
     */
    onCountryFocus() {
        console.log("country focus")
        // this.listCountry.setFillData(global.list_countries);
        // this.listCitiesView.hide();
        // if (this.listStateView) {
        //     this.listStateView.hide();
        // }
        this.props.navigation.navigate('show_list_country', { countryCallback: this.onCountrySelected.bind(this) });
    }

    onEditableClick() {
        if (this.state.editable) {
            this.sendUpdateProfile();
        } else {
            // this.sendRequestListCountry();
            this.setState({
                editable: true
            }, () => {
                this.inputCountry.enable();
                this.inputName.focus();
                this.inputCity.enable();
            })

        }
    }

    /**
     * Lấy danh sách quốc gia
     */
    sendRequestListCountry() {
        if (global.list_countries.length) {
            this.setState({
                editable: true
            });
            return;
        }//co roi thi khong load lai
        let url = this.getConfig().getBaseUrl() + ApiService.list_countries();
        this.internalLoading.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.model = new ListCountryModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                global.list_countries = this.model.getCountryList();
                self.setState({
                    editable: true
                });
            }
            self.internalLoading.hideLoading();
        }, () => {
            self.internalLoading.hideLoading();
            self.popupTimeOut.showPopup();
        });
    }

    /**
     * list state
     */
    sendRequestState() {
        if (this.country_sortname) {
            let arr_state = global.list_states.hasOwnProperty(this.country_sortname) ? global.list_states[this.country_sortname] : [];
            if (arr_state.length) {
                this.list_states = arr_state;
                this.listStateView.setFillData(this.list_states);
                return;
            }
        }
        let url = this.getConfig().getBaseUrl() + ApiService.list_states(this.country);
        console.log("list state : ", url);
        this.internalLoading.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.internalLoading.hideLoading();
            let model = new ListStateModel(self);
            model.parseData(jsonData);
            if (model.getErrorCode() === 0) {
                self.list_states = model.getStateList();
                global.list_states[this.country_sortname] = model.getStateList();
                self.listStateView.setFillData(self.list_states);
            }
        }, () => {
            self.internalLoading.hideLoading();
        });
    }

    /**
     * list city
     */
    sendRequestListCity() {
        if (this.country) {
            let arr_city = global.list_cities.hasOwnProperty(this.country_sortname) ? global.list_cities[this.country_sortname] : [];
            if (arr_city.length) {
                this.list_cities = arr_city;
                this.listCitiesView.setFillData(this.list_cities);
                this.inputCity.focus();
                return;
            }
        }
        //let id = this.state_id ? this.state_id : this.country;
        let url = this.getConfig().getBaseUrl() + ApiService.list_cities(this.country, this.state_id);
        console.log("list city url : ", url);
        this.internalLoading.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.model = new ListCityModel(self);
            self.model.parseData(jsonData);
            //console.log("city data ",jsonData);
            if (self.model.getErrorCode() === 0) {
                self.list_cities = self.model.getCityList();
                global.list_cities[this.country_sortname] = self.model.getCityList();
                self.listCitiesView.setFillData(this.list_cities);
                self.inputCity.focus();
            }
            self.internalLoading.hideLoading();
        }, () => {
            //time out
            self.internalLoading.hideLoading();
            self.popupTimeOut.showPopup();
        });
    }

    /**
     * Nhập xong ô giới tính
     */
    onSexSelected(data, index) {
        this.dropdown_sex.hide();
        this.sex_id = data.id;
        this.setState({
            txtSex: data.name
        });
    }

    onCountrySelected(data) {//, index) {
        console.log("country clicked ========================");
        this.country = data.getId();
        this.country_sortname = data.getSortName();
        this.inputCountry.setValue(data.getName());
        if (this.inputState) {
            this.inputState.setValue('');
            this.state_id = null;
        }
        this.inputCity.setValue('');
        this.txtCity = '';
        this.txtState = null;
        let self = this;
        if (data.getNumberState() > 0) {
            this.setState({
                isState: true
            }, () => {
                self.setStateCallback();
                // this.sendRequestState();
            });
        } else {
            this.setState({
                isState: false
            }, () => {
                console.log("sendRequestListCity");
                // this.props.navigation.navigate('show_list_city', {
                //     'country': this.country,
                //     'state_id': this.state_id,
                //     cityCallback: this.onCitySelected.bind(this)
                // });
            });
            // this.sendRequestListCity();

        }
    }

    /**
     * 
     */
    onCitySelected(data) {//, index) {
        this.txtCity = data.getName();
        this.inputCity.setValue(data.getName());
        this.city_id = data.getId();
        //this.inputCity.onBlur();
    }

    /**
     * Update profile
     */
    sendUpdateProfile() {
        let time = this.birthday ? moment(this.birthday, 'DD/MM/YYYY') : 0;
        let timestamp = time ? (new Date(time)).getTime() : 0;
        let formData = {
            "fullname": this.state.txtName,
            "gender": this.sex_id,
        }
        if (timestamp > 0) {
            formData.birthday = timestamp;
        }
        if (this.country_sortname) {
            formData.country = this.country_sortname;
        }
        if (this.txtCity) {
            formData.city = this.txtCity;
        }
        if (this.city_id) {
            formData.city_id = this.city_id;
        }
        if (this.txtState) {
            formData.state = this.txtState;
        } else {
            formData.state = '';
        }
        console.log("formData : ", formData);
        let url = this.getConfig().getBaseUrl() + ApiService.user_update_profile();
        this.internalLoading.showLoading();
        let self = this;
        Networking.httpRequestPost(url, (jsonData) => {
            //console.log("json data",jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    self.saveProfile();
                    self.inputCountry.disable();
                    self.inputCity.disable();
                    self.setState({
                        editable: false
                    }, () => {
                        if (self.props.onUpdateSuccess) {
                            self.props.onUpdateSuccess();
                        }
                        if (self.updateCompleteCallback) {
                            self.updateCompleteCallback();
                        }
                    });

                } else {
                    self.popup.setMsg(jsonData['error_msg']);
                }
            }
            self.internalLoading.hideLoading();
        }, formData, () => {
            //time out
            self.internalLoading.hideLoading();
            self.popupTimeOut.showPopup();
        });
    }

    /**
     * Luu lai thong tin da update
     */
    saveProfile() {
        let { txtName, date_birthday } = this.state;
        this.getUserInfo().setFullname(txtName);
        this.getUserInfo().setSex(this.sex_id);
        this.getUserInfo().setCity(this.txtCity);
        this.getUserInfo().setState(this.txtState);
        this.getUserInfo().setBirthday(date_birthday);
        this.getUserInfo().setBirthdayDisplay(date_birthday);
        this.getUserInfo().setCountry(this.country_sortname);
        this.getUserInfo().getUserProfile().setFullname(txtName);
        // this.getUserInfo().getUserProfile()
        // this.getUserInfo().getUserProfile()
        global.isProfileDidUpdate = true;
        global.isProfileDidUpdate2 = true;
    }

    render() {
        let { editable, txtName, date_birthday, txtSex, isState } = this.state;

        let self = this;

        return (
            <View style={styles.container_info}>
                {/* {this.renderLoading()} */}
                <PopupNotification ref={(popup) => { this.popup = popup; }} />
                <PopupVerifiedPhone ref={(popupVerifyPhone) => { this.popupVerifyPhone = popupVerifyPhone; }} />

                <View style={styles.item_header_view}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.item_header_text}>{this.t('persional_info_title')}</Text>
                    <Touchable onPress={this.onEditableClick} style={{ padding: 8 }}>
                        {/* <Image
                            style={[styles.pen_image, { tintColor: editable ? '#00aba7' : '#A5A5A5' }]}
                            source={editable ? this.getResources().btn_save : this.getResources().pen}
                        /> */}
                        <Text style={[styles.txt_edit, {color: editable ? '#00aba7' : '#A5A5A5'}]}>{editable ? this.t('save') : this.t('edit')}</Text>
                    </Touchable>
                </View>
                {/* <KeyboardAwareScrollView
                    enableOnAndroid={true}
                    keyboardShouldPersistTaps='always'
                    extraScrollHeight={50}>
                    <ScrollView style={{ flex: 1 }}
                        keyboardShouldPersistTaps='always'
                        scrollEnabled={false}
                    > */}
                <View style={styles.item_body_view}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.item_label}>{this.t('name')}</Text>
                    <TextInput allowFontScaling={global.isScaleFont}
                        ref={(inputName) => { this.inputName = inputName; }}
                        style={styles.item_input}
                        onChangeText={(text) => this.setState({ txtName: text })}
                        editable={editable}
                        value={txtName}
                        placeholder=''
                        placeholderTextColor='#424242'
                        underlineColorAndroid='rgba(0,0,0,0)'
                    />
                </View>
                <View style={styles.item_body_view}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.item_label}>{this.t('birthday')}</Text>
                    <MyView style={styles.myview} hide={editable}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.item_value}>{date_birthday}</Text>
                    </MyView>
                    <MyView style={[styles.myview]} hide={!editable}>
                        <DatePicker
                            ref={(datePicker) => { this.datePicker = datePicker; }}
                            style={styles.datepicker}
                            mode='date'
                            allowFontScaling={global.isScaleFont}
                            date={date_birthday}
                            placeholder={date_birthday}
                            format={global.BIRTHDAY_FORMAT}
                            // minDate="2016-05-01"
                            // maxDate= {(new Date()).getTime()}
                            confirmBtnText={this.t('agree')}
                            cancelBtnText={this.t('cancel')}
                            androidMode='spinner'
                            iconSource={this.getResources().ic_calender}
                            customStyles={{
                                dateInput: {
                                    borderWidth: 0,
                                    justifyContent: 'flex-start',
                                    flexDirection: 'row',
                                },
                                placeholderText: {
                                    fontSize: fontSize(14),
                                    color: '#FF0000',
                                },
                                dateText: {
                                    flex: 1,
                                    fontSize: fontSize(14),
                                    color: '#424242',
                                },
                                dateIcon: {
                                    height: this.getRatioAspect().verticalScale(25),
                                    position: 'absolute',
                                    resizeMode: 'contain',
                                    right: 0,//this.getRatioAspect().scale(25),
                                    // width: this.getRatioAspect().scale(25),
                                    marginRight: 0
                                }
                            }}
                            onDateChange={(date) => {
                                self.setState({ date_birthday: date });
                                self.birthday = date;
                                //console.log("date : ", date);
                            }}
                        />
                    </MyView>
                </View>

                <View style={styles.item_body_view}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.item_label}>{this.t('gender')}</Text>
                    <MyView style={styles.myview} hide={editable}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.item_value}>{txtSex}</Text>
                    </MyView>
                    <MyView style={styles.myview} hide={!editable}>
                        <ModalDropdown
                            defaultValue={txtSex}
                            ref={(dropdown_sex) => { this.dropdown_sex = dropdown_sex; }}
                            style={styles.dropdown}
                            textStyle={styles.dropdown_text}
                            dropdownStyle={styles.dropdown_dropdown_gender}
                            options={global.DROPDOWN_SEX}
                            renderRow={(rowData, index, isSelected) =>
                                <View style={{ backgroundColor: isSelected ? '#99E6FF' : '#FFFFFF' }}>
                                    <Touchable onPress={() => this.onSexSelected(rowData, index)}>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.text_dropdown}>{rowData.name}</Text>
                                    </Touchable>
                                </View>
                            }
                        />
                    </MyView>
                </View>
                <View style={[styles.item_body_view, { borderBottomColor: '#ebebeb', borderBottomWidth: 1 }]}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.item_label}>{this.t('country')}</Text>
                    <MyTextInput
                        ref={(inputCountry) => { this.inputCountry = inputCountry; }}
                        style={[styles.item_value, { flex: 3 }]}
                        placeholder={this.txtCountry}
                    />
                </View>
                <MyView style={[styles.item_body_view, { borderBottomColor: '#ebebeb', borderBottomWidth: 1 }]} hide={!isState}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.item_label}>{this.t('state')}</Text>
                    <MyTextInput
                        ref={(inputState) => { this.inputState = inputState; }}
                        style={[styles.item_value, { flex: 3 }]}
                        placeholder={this.txtState}
                    />
                </MyView>
                <View style={[styles.item_body_view, {}]}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.item_label}>{this.t('city')}</Text>
                    <MyTextInput
                        ref={(inputCity) => { this.inputCity = inputCity; }}
                        style={[styles.item_value, { flex: 3 }]}
                        placeholder={this.txtCity} />
                </View>
                {/* {genPhone} */}
                {/* <MyView style={{ height: this.getRatioAspect().verticalScale(210) }} hide={!this.state.editable} /> */}
                <MyListView ref={(listCountry) => { this.listCountry = listCountry; }}
                    top={this.getRatioAspect().verticalScale(160)}
                    left={(2 * screenWidth) / 5 + this.getRatioAspect().scale(20)}
                />
                <MyListView ref={(listStateView) => { this.listStateView = listStateView; }}
                    top={this.getRatioAspect().verticalScale(200)}
                    left={(2 * screenWidth) / 5 + this.getRatioAspect().scale(20)}
                />
                <MyListView ref={(listCities) => { this.listCitiesView = listCities; }}
                    top={isState ? this.getRatioAspect().verticalScale(240) : this.getRatioAspect().verticalScale(200)}
                    left={(2 * screenWidth) / 5 + this.getRatioAspect().scale(20)}
                />
                {/* </ScrollView>
                </KeyboardAwareScrollView > */}
                {this.renderInternalLoading()}
            </View>
        );
    }
}
//{genPhone}