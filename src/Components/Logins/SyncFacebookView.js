import React from 'react';
import { Text, View, Image, Dimensions } from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import Touchable from 'react-native-platform-touchable';
import HeaderView from '../HeaderView';
import { TextField } from 'react-native-material-textfield';
import styles from '../../Styles/Logins/StyleSyncFacebook';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
// import ModalDropdown from 'react-native-modal-dropdown';
import ListCountryModel from '../../Model/CreateFlight/ListCountryModel';
import ListCityModel from '../../Model/CreateFlight/ListCityModel';
import ListStateModel from '../../Model/CreateFlight/ListStateModel';
import MyView from '../../Core/View/MyView';
import FirebaseNotificationsAsync from '../Common/FirebaseNotificationsAsync';
import MyTextInput from '../Common/MyTextInput';
import MyListView from '../Common/MyListView';
import DataManager from '../../Core/Manager/DataManager';
import Constant from '../../Constant/Constant';
import {scale, verticalScale, fontSize} from '../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

let left = (2 * width) / 5 + scale(25);
export default class SyncFacebookView extends BaseComponent {

    constructor(props) {
        super(props);
        this.facebookId = '';
        this.country = '';
        this.country_id = '';
        this.city = '';
        this.city_id = null;
        this.state_id = '';
        this.txtState = null;
        //this.state_name = ''
        this.list_cities = [];
        this.list_states = [];
        this.country_sortname = '';
        //this.isChangecity
        this.placeholder_state = this.t('state');
        this.placeholder_city = this.t('city');
        this.state = {
            isState: false,
            isMaleSelected: true,
            name: '',
            handicap: '36.4',
            list_country_offset: 1,
            list_state_offset: 1,
            list_city_offset: 1,
            // city: '',
            //txtCountry: this.t('country'),
            //txtCity: this.t('state') + '/' + this.t('city'),
            error_name: '',
            error_handicap: '',
            showErrorCountry: false,
            showErrorCity: false
        }
    }

    /**
    * Lấy danh sách quốc gia
    */
    sendRequestListCountry() {
        if (global.list_countries.length) {
            this.countryListView.setFillData(global.list_countries);
            return;
        }//co roi thi khong load lai
        let url = this.getConfig().getBaseUrl() + ApiService.list_countries();
        this.loading.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.model = new ListCountryModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                console.log('onListCountryResponse', self.model.getCountryList());
                global.list_countries = this.model.getCountryList();
            }
            self.loading.hideLoading();
        }, () => {
            //time out
            self.loading.hideLoading();
            self.showErrorMsg(self.t('time_out'));
        });
    }

    /**
     * list state
     */
    sendRequestState() {
        if (this.country_id) {
            let arr_state = global.list_states.hasOwnProperty(this.country_sortname) ? global.list_states[this.country_sortname] : [];
            if (arr_state.length) {
                this.list_states = arr_state;
                this.stateListView.setFillData(this.list_states);
                this.textInputState.enable();
                this.textInputState.focus();
                return;
            }
        }
        let url = this.getConfig().getBaseUrl() + ApiService.list_states(this.country_id);
        console.log("list state : ", url);
        this.loading.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.loading.hideLoading();
            let model = new ListStateModel(self);
            model.parseData(jsonData);
            if (model.getErrorCode() === 0) {
                self.list_states = model.getStateList();
                global.list_states[this.country_sortname] = model.getStateList();
                self.stateListView.setFillData(self.list_states);
                self.textInputState.enable();
                self.textInputState.focus();
            }
        }, () => {
            self.loading.hideLoading();
        });
    }

    sendRequestListCity() {
        if (this.country_sortname) {
            let arr_city = global.list_cities.hasOwnProperty(this.country_sortname) ? global.list_cities[this.country_sortname] : [];
            if (arr_city.length) {
                this.list_cities = arr_city.slice(0);
                this.cityListView.setFillData(this.list_cities);
                this.textInputCity.enable();
                this.textInputCity.focus();
                return;
            }
        }
        let url = this.getConfig().getBaseUrl() + ApiService.list_cities(this.country_id);
        console.log("list city url : ", url);
        this.loading.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.model = new ListCityModel(self);
            self.model.parseData(jsonData);
            //console.log("city data ", jsonData);
            if (self.model.getErrorCode() === 0) {
                self.list_cities = self.model.getCityList();
                self.cityListView.setFillData(self.model.getCityList());
                global.list_cities[this.country] = self.model.getCityList();
                self.textInputCity.enable();
                self.textInputCity.focus();
            }
            self.loading.hideLoading();
        }, () => {
            //time out
            self.loading.hideLoading();
            self.showErrorMsg(self.t('time_out'));
        });
    }

    /**
     * 
     * @param {*} data 
     */
    onCountrySelected(data) {
        // this.dropdown_country.hide();
        this.country_sortname = data.getSortName();
        this.country_id = data.getId();
        this.textInputCountry.setValue(data.getName());
        this.state_id = null;
        this.city = null;
        //this.textInputCity.enable();
        let self = this;
        if (data.getNumberState() > 0) {
            this.setState({
                isState: true,
                showErrorCity: false,
                showErrorCountry: false
            }, () => {
                self.setStateCallback();
                this.sendRequestState();
            });
        } else {
            this.setState({
                isState: false,
                showErrorCity: false,
                showErrorCountry: false
            });
            this.sendRequestListCity();
        }
    }

    /**
     * 
     * @param {*} data 
     */
    onCitySelected(data) {
        //this.dropdown_city.hide();
        this.setState({
            //txtCity: data.getName(),
            showErrorCity: false,
            showErrorCountry: false
        });
        this.city = data.getName();
        this.city_id = data.getId();
        this.textInputCity.setValue(data.getName());
    }

    onCountryLayoutHandler(event) {
        const { y } = event.nativeEvent.layout;
        this.setState({
            list_country_offset: y + verticalScale(40)
        });
    }

    onStateLayoutHandler(event) {
        const { y } = event.nativeEvent.layout;
        //console.log("y : ", y);
        this.setState({
            list_state_offset: y + verticalScale(40)
        });
    }

    onCityLayoutHandler(event) {
        const { y } = event.nativeEvent.layout;
        //console.log("y : ", y);
        this.setState({
            list_city_offset: y +  verticalScale(40)
        });
    }

    render() {
        let { isState, list_city_offset, list_country_offset, list_state_offset } = this.state;
        return (
            <View style={styles.container} >
                {this.renderLoading()}
                <HeaderView title={this.t('enter_info')} showBack={false} />
                <KeyboardAwareScrollView innerRef={ref => { this.scroll = ref }}
                    style={{ flex: 1 }}
                    enableOnAndroid={true}
                    keyboardShouldPersistTaps='always'
                    extraScrollHeight={50}>
                    <View style={{ flex: 1 }}>
                        <Touchable style={styles.touch_facebook} onPress={this.onFacebookLogIn.bind(this)}>
                            <View style={styles.facebook_group}>
                                <Image
                                    style={styles.facebook_icon}
                                    source={this.getResources().ic_facebook}
                                />
                                <Text allowFontScaling={global.isScaleFont} style={styles.facebook_text}>{this.t('sync_facebook')}</Text>
                            </View>
                        </Touchable>

                        <Text allowFontScaling={global.isScaleFont} style={styles.or_enter_info}>{this.t('or_enter_info')}</Text>

                        <View style={styles.view_textfield}>
                            <TextField allowFontScaling={global.isScaleFont}
                                label={this.t('name')}
                                tintColor='#8A8A8F'
                                lineWidth={scale(0.5)}
                                activeLineWidth={scale(0.5)}
                                disabledLineWidth={scale(0.5)}
                                labelFontSize={fontSize(15,scale(1))}
                                fontSize={fontSize(17,scale(3))}
                                onFocus={() => this.onNameFocus()}
                                error={this.state.error_name}
                                errorColor='#FF0000'
                                value={this.state.name}
                                onChangeText={(input) => { this.setState({ name: input }) }} />
                        </View>

                        <View style={styles.view_textfield}>
                            <TextField allowFontScaling={global.isScaleFont}
                                label={this.t('handicap_score')}
                                tintColor='#8A8A8F'
                                lineWidth={scale(0.5)}
                                activeLineWidth={scale(0.5)}
                                disabledLineWidth={scale(0.5)}
                                labelFontSize={fontSize(15,scale(1))}
                                fontSize={fontSize(17,scale(3))}
                                keyboardType='numeric'
                                maxLength={4}
                                onFocus={() => this.onHandicapScoreFocus()}
                                error={this.state.error_handicap}
                                errorColor='#FF0000'
                                onChangeText={(input) => { this.setState({ handicap: input }) }}
                                value={this.state.handicap}
                            />
                        </View>

                        <Text allowFontScaling={global.isScaleFont} style={styles.gender}>{this.t('gender')}</Text>
                        <View style={styles.gender_group}>
                            <Touchable onPress={this.onMaleClick.bind(this)}>
                                <Text allowFontScaling={global.isScaleFont} style={[styles.gender_male, { color: this.state.isMaleSelected ? '#00ABA7' : 'rgba(138,138,143,0.5)' }]}
                                >{this.t('male')}</Text>

                            </Touchable>
                            <Text allowFontScaling={global.isScaleFont} style={styles.gender_text_normal}>/</Text>
                            <Touchable onPress={this.onFeMaleClick.bind(this)}>
                                <Text allowFontScaling={global.isScaleFont} style={[styles.gender_female, { color: this.state.isMaleSelected ? 'rgba(138,138,143,0.5)' : '#00ABA7' }]}>{this.t('female')}</Text>
                            </Touchable>
                        </View>
                        <MyView style={styles.error_view} hide={!this.state.showErrorCountry}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.error_text}>{this.t('country_error')}</Text>
                        </MyView>

                        <View style={[styles.item_body_view, { borderBottomColor: '#ebebeb', borderBottomWidth: scale(1) }]}
                            onLayout={this.onCountryLayoutHandler.bind(this)}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label}>{this.t('country')}</Text>
                            <MyTextInput ref={(textInputCountry) => { this.textInputCountry = textInputCountry; }}
                                placeholder={this.t('country')}
                                style={styles.dropdown} />
                        </View>

                        <MyView style={[styles.item_body_view, { borderBottomColor: '#ebebeb', borderBottomWidth: scale(1) }]}
                            onLayout={this.onStateLayoutHandler.bind(this)} hide={!isState}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label}>{this.t('state')}</Text>
                            <MyTextInput ref={(textInputState) => { this.textInputState = textInputState; }}
                                placeholder={this.placeholder_state}
                                style={styles.dropdown} />
                        </MyView>

                        <MyView style={styles.error_view} hide={!this.state.showErrorCity}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.error_text}>{this.t('city_error')}</Text>
                        </MyView>
                        <View style={[styles.item_body_view, { borderBottomColor: '#ebebeb', borderBottomWidth: scale(1) }]}
                            onLayout={this.onCityLayoutHandler.bind(this)}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label}>{this.t('city')}</Text>
                            <MyTextInput ref={(textInputCity) => { this.textInputCity = textInputCity; }}
                                placeholder={this.placeholder_city}
                                style={styles.dropdown} />
                        </View>

                        <Touchable onPress={this.onComplete.bind(this)}>
                            <View style={styles.touch_complete}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.text_complete}>{this.t('complete')}</Text>
                            </View>
                        </Touchable>
                        <View style={{ height: verticalScale(60) }}></View>
                        <MyListView ref={(countryListView) => { this.countryListView = countryListView; }}
                            right={0}
                            left={left}
                            top={list_country_offset}
                            bottom={verticalScale(1)} />
                        <MyListView ref={(stateListView) => { this.stateListView = stateListView; }}
                            right={0}
                            left={left}
                            top={list_state_offset}
                            bottom={verticalScale(1)} />
                        <MyListView ref={(cityListView) => { this.cityListView = cityListView; }}
                            right={0}
                            left={left}
                            top={list_city_offset}
                            bottom={verticalScale(1)} />
                    </View>
                </KeyboardAwareScrollView>
                {this.renderMessageBar()}
            </View>
        );
    }

    componentDidMount() {
        this.registerMessageBar();
        this.sendRequestListCountry();
        this.textInputCountry.enable();
        this.textInputCountry.focusCallback = this.countryFocus.bind(this);
        this.textInputCountry.submitCallback = this.countrySubmit.bind(this);

        this.countryListView.itemClickCallback = this.onCountrySelected.bind(this);

        this.textInputCity.focusCallback = this.cityFocus.bind(this);
        this.textInputCity.submitCallback = this.citySubmit.bind(this);
        this.cityListView.itemClickCallback = this.onCitySelected.bind(this);
    }

    setStateCallback(){
        if(this.textInputState){
            this.textInputState.focusCallback = this.onStateFocus.bind(this);
            this.textInputState.submitCallback = this.onStateSubmit.bind(this);
            this.stateListView.itemClickCallback = this.onStateItemClick.bind(this);
        }
    }

    onStateFocus(){
        this.textInputCity.clear();
        this.cityListView.hide();
        this.stateListView.setFillData(this.list_states);
    }

    onStateSubmit(text){
        let arr_state = this.list_statess.filter(d => d.getName().toLowerCase().indexOf(text.toLowerCase().trim()) >= 0);
        this.stateListView.setFillData(arr_state);
    }

    onStateItemClick(data){
        this.state_id = data.getId();
        this.txtState = data.getName();
        this.textInputState.setValue(data.getName());
        this.city = null;
        this.sendRequestListCity();
    }

    citySubmit(text) {
        let arr_city = this.list_cities.filter(d => d.getName().toLowerCase().indexOf(text.toLowerCase().trim()) >= 0);
        this.cityListView.setFillData(arr_city);
    }

    cityFocus() {
        this.cityListView.setFillData(this.list_cities);
    }

    /**
     * Khi dang tim kiem quoc gia
     * @param {*} text 
     */
    countrySubmit(text) {
        let arr_country = global.list_countries.filter(d => d.getName().toLowerCase().indexOf(text.toLowerCase().trim()) >= 0);
        this.countryListView.setFillData(arr_country);
    }
    /**
     * focus quoc gia
     */
    countryFocus() {
        this.cityListView.hide();
        this.textInputCity.setValue('');
        this.textInputCity.clear();
        if(this.textInputState){
            this.textInputState.clear();
        }
        if(this.stateListView){
            this.stateListView.hide();
        }
        this.countryListView.setFillData(global.list_countries);
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
    }

    async onFacebookLogIn() {
        const { type, token } = await this.Mxpo.Facebook.logInWithReadPermissionsAsync('243128862494634', {
            permissions: ['public_profile', 'email', 'user_photos'],
        });

        if (type === 'success') {
            // Get the user's name using Facebook's Graph API
            const response = await fetch(
                `https://graph.facebook.com/me?access_token=${token}`);
            let data = await response.json();
            console.log('onFacebookLogIn.response', data);
            this.facebookId = data.id;
            this.setState({
                name: data.name
            })

        }
    }

    onNameFocus() {
        console.log('onNameFocus');
        // this.scroll.props.scrollToPosition(0, 0);
        this.setState({ error_name: '' });
    }

    onHandicapScoreFocus() {
        console.log('onHandicapScoreFocus');
        // this.scroll.props.scrollToPosition(0, 0);
        this.setState({ error_handicap: '' });
    }

    onMaleClick() {
        this.setState({
            isMaleSelected: true
        });
    }

    onFeMaleClick() {
        this.setState({
            isMaleSelected: false
        });
    }

    hideErrorCode() {
        this.setState({
            error_name: '',
            error_handicap: '',
            showErrorCity: false,
            showErrorCountry: false
        });
    }

    /**
     * Kiểm tra dữ liệu khi đang ký
     */
    onValidateInput() {
        if (this.state.name === '') {
            this.setState({ error_name: this.t('error_name') });
            return false;
        }
        if (this.state.handicap === '') {
            this.setState({ error_handicap: this.t('error_handicap') });
            return false;
        } else {
            if (this.state.isMaleSelected && parseFloat(this.state.handicap) > 36.4) {
                this.setState({ error_handicap: this.t('handicap_male_error') });
                return false;
            } else if (!this.state.isMaleSelected && parseFloat(this.state.handicap) > 40.4) {
                this.setState({ error_handicap: this.t('handicap_female_error') });
                return false;
            }
        }
        if (!this.city) {
            this.setState({ showErrorCity: true });
            return false;
        }
        if (!this.country_id) {
            this.setState({
                showErrorCountry: true
            });
            return false;
        }
        return true;
    }

    onComplete() {
        if (this.onValidateInput()) {
            this.loading.showLoading();
            let url = this.getConfig().getBaseUrl() + ApiService.user_update_profile();
            let self = this;
            console.log("url : ", url);
            let formData = {
                "fullname": this.state.name,
                "usga_hc_index": this.state.handicap,
                "gender": this.state.isMaleSelected ? 0 : 1
            };
            if (this.country_id) {
                formData.country = this.country_sortname;
            }
            if (this.city) {
                formData.city = this.city;
            }
            if(this.state_id){
                formData.state = this.txtState;
            }
            if(this.city_id){
                formData.city_id = this.city_id;
            }
            console.log('formData: ', formData)
            Networking.httpRequestPost(url, this.onUpdateProfileResponse.bind(this), formData, () => {
                //time out
                self.loading.hideLoading();
                self.showErrorMsg(self.t('time_out'))
            });
        }
    }

    onUpdateProfileResponse(jsonData) {
        this.loading.hideLoading();
        console.log('onUpdateProfileResponse: ', jsonData);
        let error_code;
        if (jsonData != null && jsonData.hasOwnProperty('error_code')) {
            error_code = jsonData['error_code'];
        }
        if (error_code != null && error_code === 0) {
            FirebaseNotificationsAsync();
            DataManager.saveLocalData([
                [Constant.USER.USER_TYPE, '1']

            ], (error) => console.log('saveLocalData', error));

            this.props.navigation.replace('app_screen');
        } else {
            if (jsonData.hasOwnProperty("error_msg")) {
                let error_msg = jsonData['error_msg'];
                this.showErrorMsg(error_msg);
            }
        }
    }
}
