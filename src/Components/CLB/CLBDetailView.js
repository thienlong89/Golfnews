import React from 'react';
import { Text, View, Image, Linking, ScrollView, BackAndroid } from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import Touchable from 'react-native-platform-touchable';
import Networking from '../../Networking/Networking';
import CLBDetailModel from '../../Model/CLB/CLBDetailModel';
import ApiService from '../../Networking/ApiService';
import styles from '../../Styles/Clubs/StyleClubDetailView';
import HeaderView from '../Common/HeaderView';

export default class CLBDetailView extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            ngay_thanh_lap: '',
            chu_tich: '',
            tong_thu_ky: '',
            lien_he: '',
            tong_so_thanh_vien: '',
            facebook_page: '',
            dia_chi: '',
            clubId: ''
        }

        this.backHandler = null;
        this.onFacebookClick = this.onFacebookClick.bind(this);
    }

    // static defaultPrors = {
    //     onBackCallback: null
    // }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        console.log("param : ", params);
        if (this.headerview) {
            this.headerview.setTitle(params.club_title);
            this.headerview.callbackBack = this.onBackClick.bind(this);
        }
        this.backHandler = BackAndroid.addEventListener('hardwareBackPress', this.onBackClick.bind(this));
        // this.setState({ clubId: params.club_Id });
        this.sendData(params.club_id);
    }

    componentWillUnmount() {
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    sendData(clubId) {
        this.loading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.club_detai(clubId);
        console.log("clb url : ", url);
        Networking.httpRequestGet(url, this.onResponse.bind(this), () => {
            //time out
            self.loading.hideLoading();
            self.popupTimeOut.showPopup();
        });
    }

    onResponse(jsonData) {
        this.model = new CLBDetailModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            this.setState({
                title: this.model.getName(),
                ngay_thanh_lap: this.model.getCreateAt(),
                chu_tich: this.model.getManager(),
                tong_thu_ky: this.model.getSecretary(),
                lien_he: this.model.getHotline(),
                tong_so_thanh_vien: this.model.getTotalMembers(),
                facebook_page: this.model.getFacebookPage(),
                dia_chi: this.model.getAddress(),
            });
        }
        this.loading.hideLoading();
    }

    onFacebookClick() {
        let self = this;
        // console.log("open url facebook : ",this.state.facebook_page);
        let url = this.state.facebook_page;
        if (!url || !url.length) return;
        Linking.canOpenURL(url).then(canopen => {
            //console.log("open cancel ",canopen);
            if (canopen) {
                Linking.openURL(url).catch((err) => Promise.reject(err))
            } else {
                Alert.alert(
                    self.t('thong_bao'),
                    self.t('url_facebook_format'),
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                    { cancelable: false }
                )
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderLoading()}
                <HeaderView ref={(headerview) => { this.headerview = headerview; }} />
                <View style={styles.container_body}>
                    <ScrollView>
                        <View style={styles.body_item_row}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_title_text}>{this.t('ngay_thanh_lap_title')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_content_text}>{this.state.ngay_thanh_lap}</Text>
                        </View>
                        <View style={styles.body_item_row}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_title_text}>{this.t('chu_tich_title')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_content_text}>{this.state.chu_tich}</Text>
                        </View>
                        <View style={styles.body_item_row}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_title_text}>{this.t('tong_thu_ky_title')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_content_text}>{this.state.tong_thu_ky}</Text>
                        </View>
                        <View style={styles.body_item_row}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_title_text}>{this.t('lien_he_title')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_content_text}>{this.state.lien_he}</Text>
                        </View>
                        <View style={styles.total_member_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_title_text}>{this.t('tong_so_thanh_vien_title')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_content_text}>{this.state.tong_so_thanh_vien}</Text>
                        </View>
                        <View style={styles.line_view}>
                        </View>
                        <Touchable onPress={this.onFacebookClick}>
                            <View style={styles.container_logo}>
                                <Image
                                    style={styles.logo_image}
                                    source={this.getResources().face_logo}
                                />
                                <Text allowFontScaling={global.isScaleFont} style={styles.facebook_text}>{this.state.facebook_page}</Text>
                            </View>
                        </Touchable>
                        <View style={styles.container_location_view}>
                            <Image
                                style={styles.location_image}
                                source={this.getResources().location}
                            />
                            <Text allowFontScaling={global.isScaleFont} style={styles.address_text}>{this.state.dia_chi}</Text>
                        </View>
                        {/* <View style={styles.container_bottom}> */}
                        {/* </View> */}
                    </ScrollView>
                </View>
            </View>
        );
    }

    onBackClick() {
        console.log("search global !!");
        this.props.navigation.goBack();
        return true;
    }

    onCheckErrorCode(error_code) {
        super.onCheckErrorCode(error_code);
    }
}