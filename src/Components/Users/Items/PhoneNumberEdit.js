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
import MyView from '../../../Core/View/MyView';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import PopupNotification from '../../Popups/PopupNotificationView';
import MyTextInput from '../../Common/MyTextInput';
import { fontSize } from '../../../Config/RatioScale';

const screenWidth = Dimensions.get('window').width - 15;

export default class PhoneNumberEdit extends BaseComponent {
    constructor(props) {
        super(props);

        this.updateCompleteCallback = null;
        this.refPhoneItem = [];
        this.state = {
            editable: false,
            listPhone: this.genListPhone(),
        }
        this.onEditableClick = this.onEditableClick.bind(this);
        this.onPhoneChangePress = this.onPhoneChangePress.bind(this);
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
    }

    render() {
        let { editable, listPhone } = this.state;
        let genPhone = listPhone.map((data, index) => {
            return (
                <PhoneItem
                    ref={(refPhoneItem) => { this.refPhoneItem[index] = refPhoneItem; }}
                    key={index}
                    phone={data.phone}
                    isAdded={data.isAdded}
                    view_label={data.view_label}
                    onPhoneChangePress={this.onPhoneChangePress} />
            )
        });

        return (
            <View style={styles.container_info}>
                {/* {this.renderLoading()} */}
                <PopupNotification ref={(popup) => { this.popup = popup; }} />
                <PopupVerifiedPhone ref={(popupVerifyPhone) => { this.popupVerifyPhone = popupVerifyPhone; }} />

                <View style={styles.item_header_view}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.item_header_text}>{this.t('phone_number')}</Text>
                    {/* <Touchable onPress={this.onEditableClick} style={{ padding: 8 }}>
                        <Image
                            style={[styles.pen_image, { tintColor: editable ? '#00aba7' : '#A5A5A5' }]}
                            source={editable ? this.getResources().btn_save : this.getResources().pen}
                        />
                    </Touchable> */}
                </View>

                {genPhone}

                {/* <Text allowFontScaling={global.isScaleFont} style={styles.txt_add_more_phone}>{this.t('add_more_phone')}</Text> */}

                {this.renderInternalLoading()}
            </View>
        );
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

    }

    onEditableClick() {
        if (this.state.editable) {
            this.sendUpdateProfile();
        } else {
            this.setState({
                editable: true
            }, () => {
                for(let index in this.state.listPhone){
                    if(this.refPhoneItem[index]){
                        this.refPhoneItem[index].setEditAble(true);
                    }
                }
            })

        }
    }

    /**
     * Update profile
     */
    sendUpdateProfile() {

    }

    onPhoneChangePress(isDeletePhone) {
        console.log('onPhoneChangePress', isDeletePhone)
        if(this.props.onChangePhonePress){
            this.props.onChangePhonePress(isDeletePhone)
        }
    }
}