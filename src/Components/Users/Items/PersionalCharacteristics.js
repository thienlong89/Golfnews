/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {
    Text,
    View,
    Alert,
    Image,
    ScrollView,
    Dimensions
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import styles from '../../../Styles/Users/StylePersonalView';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import CharacteristicsModel from '../../../Model/User/CharacteristicsModel';
import ModalDropdown from 'react-native-modal-dropdown';
import MyView from '../../../Core/View/MyView';

const TAG = "[Vhandicap-v1] PersionalInfo : ";

import { scale, verticalScale, moderateScale } from '../../../Config/RatioScale';
let { width, height } = Dimensions.get('window');

//gang tay
var list_size_taythuan = [];
var list_size_spans = [];
var list_size_shoes = [];
//quan
var list_size_pants = [];
//ao
var list_size_coats = [];
var list_stick = [];

//type Props = {};
export default class PersionalCharacteristics extends BaseComponent {

    constructor(props) {
        super(props);
        this.tay_thuan = 0;
        this.state = {
            txtTayThuan: '',
            txtGangTay: '',
            txtSizeAo: '',
            txtSizeQuan: '',
            txtSizeGiay: '',
            txtSticks_are_in_use: '',
            editable: false
        }
        this.onEditClick = this.onEditClick.bind(this);
    }

    componentDidMount() {
        this.sendRequestCharacteristics();
    }

    getTayThuanDisplay(id) {
        return global.preferred_hand.find(d => d.id === id).name;
    }

    /**
     * Lấy đặc điểm của mình như quần , áo...
     */
    sendRequestCharacteristics() {
        let url = this.getConfig().getBaseUrl() + ApiService.user_characteristics_list();
        this.internalLoading.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            console.log("dac diem : ", jsonData);
            self.model = new CharacteristicsModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                self.tay_thuan = self.model.getPreferredHand();
                self.setState({
                    txtTayThuan: self.getTayThuanDisplay(self.model.getPreferredHand()),
                    txtGangTay: self.model.getSizeSpan(),
                    txtSizeAo: self.model.getSizeCoat(),
                    txtSizeQuan: self.model.getSizePants(),
                    txtSizeGiay: self.model.getSizeShoes(),
                    txtSticks_are_in_use: self.model.getSticks()
                });
            }
            self.internalLoading.hideLoading();
        }, () => {
            //time out
            self.internalLoading.hideLoading();
        });
    }

    firstFocus() {
        this.setState({
            editable: true
        });
    }

    /**
     * lay cac dac diem cua user tu sever
     */
    sendRequestExtraFields() {
        let url = this.getConfig().getBaseUrl() + ApiService.user_extra_fields();
        console.log("url extra : ", url);
        this.internalLoading.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            console.log("extra : ", jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    if (jsonData.hasOwnProperty('data')) {
                        let data = jsonData['data'];
                        list_size_coats = data['size_coats'] || [];
                        list_size_pants = data['size_pants'] || [];
                        list_size_shoes = data['size_shoes'] || [];
                        list_size_spans = data['size_spans'] || [];
                        list_stick = data['stick'] || [];
                        self.firstFocus();
                    }
                }
            }
            self.internalLoading.hideLoading();
        }, () => {
            //time out
            self.internalLoading.hideLoading();
        })
    }

    /**
     * Chinh sửa thông tin
     */
    onEditClick() {
        //dang o che do edit neu kick se gui du lieu len sever
        if (this.state.editable) {
            console.log("send ....");
            this.sendUpdateCharacteristics();
        } else {
            //bat che độ edit thông tin
            //kiểm tra nếu lấy thông tin rôi thì ko cần lấy lại
            if (!list_size_coats.length) {
                this.sendRequestExtraFields();
            } else {
                this.firstFocus();
            }
        }
    }

    /**
     * Update đặc điểm user [tay thuận, cỡ găng tay,cỡ quần, cớ áo, cớ giày...]
     */
    sendUpdateCharacteristics() {
        //console.log("send data : ");
        this.internalLoading.showLoading();
        let self = this;
        let { txtTayThuan, txtGangTay, txtSizeAo, txtSizeQuan, txtSizeGiay, txtSticks_are_in_use } = this.state;
        let formData = {
            "preferred_hand": this.tay_thuan,
            "size_span": txtGangTay,
            "size_coat": txtSizeAo,
            "size_pants": txtSizeQuan,
            "size_shoes": txtSizeGiay,
            "sticks_are_in_use": txtSticks_are_in_use
        }
        console.log("size formData : ", formData);

        let url = this.getConfig().getBaseUrl() + ApiService.user_characteristics_update();
        Networking.httpRequestPost(url, (jsonData) => {
            console.log("jesponse : ", jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    self.setState({
                        editable: false
                    }, () => {
                        if (this.props.onUpdateSuccess) {
                            this.props.onUpdateSuccess();
                        }
                    });
                } else {
                    Alert.alert(
                        self.t('thong_bao'),
                        jsonData['error_msg'],
                        [
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                        ],
                        { cancelable: true }
                    )
                }
            }
            self.internalLoading.hideLoading();
        }, formData, () => {
            //time out
            self.internalLoading.hideLoading();
        });
    }

    onGangtaySelected(data, index) {
        this.dropdown_gangtay.hide();
        console.log("value choosen : ", data);
        this.setState({
            txtGangTay: data
        });
    }

    onSizeAoSelected(data, index) {
        this.dropdown_sizeao.hide();
        this.setState({
            txtSizeAo: data
        });
    }

    onSizeGiaySelected(data, index) {
        this.dropdown_sizegiay.hide();
        this.setState({
            txtSizeGiay: data
        });
    }

    /**
     * Gậy đang sử dụng
     * @param {*} data 
     * @param {*} index 
     */
    onStickSelected(data, index) {
        this.dropdown_stick_are_use.hide();
        this.setState({
            txtSticks_are_in_use: data
        });
    }

    onSizeQuanSelected(data, index) {
        this.dropdown_sizequan.hide();
        this.setState({
            txtSizeQuan: data
        });
    }

    onTayThuanSelected(data, index) {
        this.dropdown_taythuan.hide();
        this.tay_thuan = data.id;
        this.setState({
            txtTayThuan: data.name
        });
    }

    render() {
        let {
            editable,
            txtTayThuan,
            txtGangTay,
            txtSizeAo,
            txtSizeQuan,
            txtSizeGiay,
            txtSticks_are_in_use
        } = this.state;
        return (
            // <KeyboardAwareScrollView>
            <View style={styles.container_info}>
                {/* {this.renderLoading()} */}
                <View style={styles.item_header_view}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.item_header_text}>{this.t('dac_diem')}</Text>
                    <Touchable onPress={this.onEditClick} style={{ padding: 10 }}>
                        {/* <Image
                            style={[styles.pen_image, { tintColor: editable ? '#00aba7' : '#A5A5A5' }]}
                            source={editable ? this.getResources().btn_save : this.getResources().pen}
                        /> */}
                        <Text style={[styles.txt_edit, {color: editable ? '#00aba7' : '#A5A5A5'}]}>{editable ? this.t('save') : this.t('edit')}</Text>
                    </Touchable>
                </View>
                {/* <ScrollView style={{ flex: 1 }}> */}
                <View style={styles.item_body_view}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.item_label}>{this.t('tay_thuan')}</Text>
                    <MyView style={styles.myview} hide={editable}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.item_value}>{txtTayThuan}</Text>
                    </MyView>
                    <MyView style={styles.myview} hide={!editable}>
                        <ModalDropdown
                            defaultValue={txtTayThuan}
                            ref={(dropdown_taythuan) => { this.dropdown_taythuan = dropdown_taythuan; }}
                            style={styles.dropdown}
                            textStyle={styles.dropdown_text}
                            dropdownStyle={styles.dropdown_dropdown}
                            options={global.preferred_hand}
                            renderRow={(rowData, index, isSelected) =>
                                <View style={{ backgroundColor: isSelected ? '#99E6FF' : '#FFFFFF' }}>
                                    <Touchable onPress={() => this.onTayThuanSelected(rowData, index)}>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.text_dropdown}>{rowData.name}</Text>
                                    </Touchable>
                                </View>
                            }
                        />
                    </MyView>
                </View>
                <View style={styles.item_body_view}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.item_label}>{this.t('gang_tay')}</Text>
                    <MyView style={styles.myview} hide={editable}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.item_value}>{txtGangTay}</Text>
                    </MyView>
                    <MyView style={styles.myview} hide={!editable}>
                        <ModalDropdown
                            defaultValue={txtGangTay}
                            ref={(dropdown_gangtay) => { this.dropdown_gangtay = dropdown_gangtay; }}
                            style={styles.dropdown}
                            textStyle={styles.dropdown_text}
                            dropdownStyle={styles.dropdown_dropdown}
                            options={list_size_spans}
                            renderRow={(rowData, index, isSelected) =>
                                <View style={{ backgroundColor: isSelected ? '#99E6FF' : '#FFFFFF' }}>
                                    <Touchable onPress={() => this.onGangtaySelected(rowData, index)}>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.text_dropdown}>{rowData}</Text>
                                    </Touchable>
                                </View>
                            }
                        />
                    </MyView>
                </View>
                <View style={styles.item_body_view}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.item_label}>{this.t('size_ao')}</Text>
                    <MyView style={styles.myview} hide={editable}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.item_value}>{txtSizeAo}</Text>
                    </MyView>
                    <MyView style={styles.myview} hide={!editable}>
                        <ModalDropdown
                            defaultValue={txtSizeAo}
                            ref={(dropdown_sizeao) => { this.dropdown_sizeao = dropdown_sizeao; }}
                            style={styles.dropdown}
                            textStyle={styles.dropdown_text}
                            dropdownStyle={styles.dropdown_dropdown}
                            options={list_size_coats}
                            renderRow={(rowData, index, isSelected) =>
                                <View style={{ backgroundColor: isSelected ? '#99E6FF' : '#FFFFFF' }}>
                                    <Touchable onPress={() => this.onSizeAoSelected(rowData, index)}>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.text_dropdown}>{rowData}</Text>
                                    </Touchable>
                                </View>
                            }
                        />
                    </MyView>
                </View>
                <View style={styles.item_body_view}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.item_label}>{this.t('size_quan')}</Text>
                    <MyView style={styles.myview} hide={editable}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.item_value}>{txtSizeQuan}</Text>
                    </MyView>
                    <MyView style={styles.myview} hide={!editable}>
                        <ModalDropdown
                            defaultValue={txtSizeQuan}
                            ref={(dropdown_sizequan) => { this.dropdown_sizequan = dropdown_sizequan; }}
                            style={styles.dropdown}
                            textStyle={styles.dropdown_text}
                            dropdownStyle={styles.dropdown_dropdown}
                            options={list_size_pants}
                            renderRow={(rowData, index, isSelected) =>
                                <View style={{ backgroundColor: isSelected ? '#99E6FF' : '#FFFFFF' }}>
                                    <Touchable onPress={() => this.onSizeQuanSelected(rowData, index)}>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.text_dropdown}>{rowData}</Text>
                                    </Touchable>
                                </View>
                            }
                        />
                    </MyView>
                </View>
                <View style={styles.item_body_view}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.item_label}>{this.t('size_giay')}</Text>
                    <MyView style={styles.myview} hide={editable}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.item_value}>{txtSizeGiay}</Text>
                    </MyView>
                    <MyView style={styles.myview} hide={!editable}>
                        <ModalDropdown
                            defaultValue={txtSizeGiay}
                            ref={(dropdown_sizegiay) => { this.dropdown_sizegiay = dropdown_sizegiay; }}
                            style={styles.dropdown}
                            textStyle={styles.dropdown_text}
                            dropdownStyle={styles.dropdown_dropdown}
                            options={list_size_shoes}
                            renderRow={(rowData, index, isSelected) =>
                                <View style={{ backgroundColor: isSelected ? '#99E6FF' : '#FFFFFF' }}>
                                    <Touchable onPress={() => this.onSizeGiaySelected(rowData, index)}>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.text_dropdown}>{rowData}</Text>
                                    </Touchable>
                                </View>
                            }
                        />
                    </MyView>
                </View>
                <View style={styles.item_body_view}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.item_label}>{this.t('stick_use_label')}</Text>
                    <MyView style={styles.myview} hide={editable}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.item_value}>{txtSticks_are_in_use}</Text>
                    </MyView>
                    <MyView style={styles.myview} hide={!editable}>
                        <ModalDropdown
                            defaultValue={txtSticks_are_in_use}
                            ref={(dropdown_stick_are_use) => { this.dropdown_stick_are_use = dropdown_stick_are_use; }}
                            style={styles.dropdown}
                            textStyle={styles.dropdown_text}
                            dropdownStyle={styles.dropdown_dropdown}
                            options={list_stick}
                            renderRow={(rowData, index, isSelected) =>
                                <View style={{ backgroundColor: isSelected ? '#99E6FF' : '#FFFFFF' }}>
                                    <Touchable onPress={() => this.onStickSelected(rowData, index)}>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.text_dropdown}>{rowData}</Text>
                                    </Touchable>
                                </View>
                            }
                        />
                    </MyView>
                </View>
                {/* </ScrollView> */}
                {this.renderInternalLoading()}
            </View>
            // </KeyboardAwareScrollView>
        );
    }
}