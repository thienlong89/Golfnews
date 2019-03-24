import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Platform,
    Linking,
    ScrollView,
    Alert,
    Dimensions,
    BackHandler
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../Common/HeaderView';
// import ModalDropdown from 'react-native-modal-dropdown';
import AppUtil from '../../Config/AppUtil';
import MyView from '../../Core/View/MyView';
var SendIntentAndroid = require('react-native-send-intent');
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
// let { width, height } = Dimensions.get('window');

export default class ContactView extends BaseComponent {
    constructor(props) {
        super(props);
        this.isAndroid = Platform.OS === 'android';
        this.state = {
            off_notify: false,
            hide_flight: false
        }

        this.onChatWithCSKHClick = this.onChatWithCSKHClick.bind(this);
        this.onYourTubeClick = this.onYourTubeClick.bind(this);
        this.onFacebookClick = this.onFacebookClick.bind(this);
        this.onWebsiteClick = this.onWebsiteClick.bind(this);
        this.onOpenEmailClick = this.onOpenEmailClick.bind(this);
        this.onPhoneClick = this.onPhoneClick.bind(this);

        this.onWhatsappClick = this.onWhatsappClick.bind(this);
        this.onZaloClick = this.onZaloClick.bind(this);
        this.onViberClick = this.onViberClick.bind(this);

        this.backHandler = null;
    }

    onBackClick() {
        let { navigation } = this.props;
        navigation.goBack();
        return true;
    }

    componentDidMount() {
        if (this.headerView) {
            this.headerView.setTitle(this.t('lien_he'));
            this.headerView.callbackBack = this.onBackClick.bind(this);
        }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress',this.onBackClick.bind(this));
    }

    componentWillUnmount(){
        if(this.backHandler) this.backHandler.remove();
    }

    onOpenEmailClick() {
        Linking.openURL(`mailto:${this.getConfig().email}`)
    }

    /**
     * Lấy số viber
     */
    getViber() {
        let ott = this.getConfig().ott;
        console.log("ott : ", ott);
        if (!ott.length) {
            return '';
        }
        let arr = ott.find(d => d.name.toLowerCase() === 'viber');
        console.log("viber arr : ", arr);
        if (Object.keys(arr).length) {
            return arr.contact;
        }
        return '';
    }

    /**
     * Lấy số zalo
     */
    getZalo() {
        let ott = this.getConfig().ott;
        if (!ott.length) {
            return '';
        }
        let arr = ott.find(d => d.name.toLowerCase() === 'zalo');
        if (Object.keys(arr).length) {
            return arr.contact;
        }
        return '';
    }

    /**
     * Lấy số whatsapp
     */
    getWhatsapp() {
        let ott = this.getConfig().ott;
        if (!ott.length) {
            return '';
        }
        let arr = ott.find(d => d.name.toLowerCase() === 'whatsapp');
        if (Object.keys(arr).length) {
            return arr.contact;
        }
        return '';
    }

    onPhoneClick() {
        if (Platform.OS === 'android') {
            SendIntentAndroid.sendPhoneDial(this.getConfig().hotline);
        } else {
            AppUtil.call_hotline();
            const url = `tel:${this.getConfig().hotline}`;
            let self = this;
            Linking.canOpenURL(url).then(canopen => {
                if (canopen) {
                    Linking.openURL(url).catch((err) => Promise.reject(err))
                } else {
                    Alert.alert(
                        self.t('thong_bao'),
                        'Sim is not installed',
                        [
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                        ],
                        { cancelable: false }
                    )
                }
            });
        }

    }

    onZaloClick() {
        if (this.isAndroid) {
            SendIntentAndroid.openApp('com.zing.zalo');
        } else {
            const url = `zalo://send?phone=${this.getZalo()}`;
            let self = this;
            Linking.canOpenURL(url).then(canopen => {
                if (canopen) {
                    Linking.openURL(url).catch((err) => Promise.reject(err))
                } else {
                    self.openZaloAlert();
                }
            });
        }

    }

    openZaloAlert() {
        let self = this;
        Alert.alert(
            self.t('thong_bao'),
            'Zalo app is not installed, do you want to install now?',
            [
                { text: 'Cancel', onPress: () => console.log('OK Pressed') },
                {
                    text: 'Ok', onPress: () => {
                        if (self.isAndroid) {
                            Linking.openURL("market://details?id=com.zing.zalo");
                        } else {
                            let link = 'itms-apps://itunes.apple.com/cy/app/zalo/id579523206?mt=8';
                            Linking.openURL(link);
                        }
                    }
                },
            ],
            { cancelable: false }
        )
    }

    onViberClick() {
        const url = `viber://pa?chatURI=${this.getViber()}`;
        let self = this;
        Linking.canOpenURL(url).then(canopen => {
            if (canopen) {
                Linking.openURL(url).catch((err) => Promise.reject(err))
            } else {
                Alert.alert(
                    self.t('thong_bao'),
                    'Viber app is not installed, do you want to install now?',
                    [
                        { text: 'Cancel', onPress: () => console.log('OK Pressed') },
                        {
                            text: 'Ok', onPress: () => {
                                if (self.isAndroid) {
                                    Linking.openURL("market://details?id=com.viber.voip");
                                } else {
                                    let link = 'itms-apps://itunes.apple.com/us/app/viber-messenger-text-call/id382617920?mt=8';
                                    Linking.openURL(link);
                                }
                            }
                        },
                    ],
                    { cancelable: false }
                )
            }
        });
    }

    onWhatsappClick() {
        const url = `whatsapp://send?phone=+84${this.getWhatsapp()}`;
        let self = this;
        Linking.canOpenURL(url).then(canopen => {
            if (canopen) {
                Linking.openURL(url).catch((err) => Promise.reject(err))
            } else {
                Alert.alert(
                    self.t('thong_bao'),
                    'WhatsApp is not installed, do you want to install now?',
                    [
                        { text: 'Cancel', onPress: () => console.log('OK Pressed') },
                        {
                            text: 'Ok', onPress: () => {
                                if (self.isAndroid) {
                                    Linking.openURL("market://details?id=com.whatsapp");
                                } else {
                                    let link = 'itms-apps://itunes.apple.com/us/app/whatsapp-messenger/id310633997?mt=8';
                                    Linking.openURL(link);
                                }
                            }
                        },
                    ],
                    { cancelable: false }
                )
            }
        });
    }

    /**
     * Click icon youtube
     */
    onYourTubeClick() {
        Linking.openURL(this.getConfig().youtube_forum).catch(err => console.error('loi roi', err));
    }

    /**
     * click icon facebook
     */
    onFacebookClick() {
        Linking.openURL(this.getConfig().facebook_forum).catch(err => console.error('loi roi', err));
    }

    onWebsiteClick() {
        Linking.openURL(this.getConfig().website).catch(err => console.error('loi roi', err));
    }

    /**
     *     "name_display":"Tổng đài CSKH",
    "type_chat":1,
    "avatar":"https://staging-api-s2.golfervn.com/api/v3/image?type=normal&imagename=null",
    "id":1,
    "name":"Tổng đài CSKH",
    "user_create":0,
    "id_info":null,
    "type":0,
    "can_delete":0,
    "created_at":"09:23:43,10-01-2019",
    "updated_at":"09:23:44,10-01-2019"
     */
    onChatWithCSKHClick() {
        let id = 1;
        let name_display = 'Tổng đài CSKH';
        let type = 0;
        let data = {
            "name_display": "Tổng đài CSKH",
            "type_chat": 1,
            "avatar": "https://staging-api-s2.golfervn.com/api/v3/image?type=normal&imagename=null",
            "id": 1,
            "name": "Tổng đài CSKH",
            "user_create": 0,
            "id_info": null,
            "type": 0,
            "can_delete": 0,
            "created_at": "09:23:43,10-01-2019",
            "updated_at": "09:23:44,10-01-2019"
        }
        let { navigation } = this.props;
        if (!navigation) return;
        navigation.navigate('chat_internal_view', { id: id, type: type, name: name_display, categoriz: 'group', data: data });
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <HeaderView ref={(headerView) => { this.headerView = headerView; }} />
                <ScrollView>
                    <Touchable onPress={this.onOpenEmailClick}>
                        <View style={styles.item_container}>
                            <Image
                                style={styles.item_image}
                                source={this.getResources().mail}
                            />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_text}>{this.getConfig().email}</Text>
                        </View>
                    </Touchable>
                    <Touchable onPress={this.onPhoneClick}>
                        <View style={styles.item_container}>
                            <Image
                                style={styles.item_image}
                                source={this.getResources().ic_contact}
                            />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_text}>{this.getConfig().hotline}</Text>
                        </View>
                    </Touchable>

                    <Touchable onPress={this.onViberClick}>
                        <MyView style={styles.item_container} hide={!this.getViber().length}>
                            <Image
                                style={styles.item_ic_image}
                                source={this.getResources().ic_viber}
                            />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_text}>{this.getViber()}</Text>
                        </MyView>
                    </Touchable>
                    <Touchable onPress={this.onZaloClick}>
                        <MyView style={styles.item_container} hide={!this.getZalo().length}>
                            <Image
                                style={styles.item_ic_image}
                                source={this.getResources().ic_zalo}
                            />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_text}>{this.getZalo()}</Text>
                        </MyView>
                    </Touchable>
                    <Touchable onPress={this.onWhatsappClick}>
                        <MyView style={styles.item_container} hide={!this.getWhatsapp().length}>
                            <Image
                                style={styles.item_ic_image}
                                source={this.getResources().ic_whatsapp}
                            />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_text}>{this.getWhatsapp()}</Text>
                        </MyView>
                    </Touchable>
                    <Touchable onPress={this.onChatWithCSKHClick}>
                        <View style={styles.item_container}>
                            <Image
                                style={styles.item_image}
                                source={this.getResources().telemarketer}
                            />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_text}>{this.t('feed_back')}</Text>
                        </View>
                    </Touchable>
                </ScrollView>
                <View style={{ height: this.getRatioAspect().verticalScale(110), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderBottomColor: '#ebebeb', borderBottomWidth: 0.5 }}>
                    <Touchable onPress={this.onYourTubeClick}>
                        <Image
                            style={styles.youtube_img}
                            source={this.getResources().youtube_logo}
                        />
                    </Touchable>
                    <Touchable onPress={this.onFacebookClick}>
                        <Image
                            style={styles.facebook_img}
                            source={this.getResources().ic_facebook}
                        />
                    </Touchable>
                    <Touchable onPress={this.onWebsiteClick}>
                        <Image
                            style={styles.world_img}
                            source={this.getResources().world}
                        />
                    </Touchable>
                </View>
                <View style={styles.golfvn_container}>
                    <View style={styles.golfvn_view}>
                        <Image
                            style={styles.location_img}
                            source={this.getResources().location_icon}
                        />
                        <Text allowFontScaling={global.isScaleFont} style={styles.location_address_label}>{this.t('tru_so_vp_hiep_hoi_golf_vn')}</Text>
                    </View>
                    <Text allowFontScaling={global.isScaleFont} style={styles.location_value_text}>{this.t('dia_chi_vp_hiep_hoi_golf_vn')}</Text>
                </View>
                <View style={styles.vgs_container}>
                    <View style={styles.vgs_view}>
                        <Image
                            style={styles.location_img}
                            source={this.getResources().location_icon}
                        />
                        <Text allowFontScaling={global.isScaleFont} style={styles.location_address_label}>{this.t('tru_so_cty_vgs')}</Text>
                    </View>
                    <Text allowFontScaling={global.isScaleFont} style={styles.location_value_text}>{this.t('dia_chi_tru_so_cty_vgs')}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    item_container: {
        height: verticalScale(50),
        flexDirection: 'row',
        borderBottomColor: '#ebebeb',
        borderBottomWidth: (Platform.OS === 'ios') ? 1 : 0.5,
        //alignItems: 'flex-end'
        alignItems: 'center'
    },

    vgs_view: {
        height: verticalScale(50),
        flexDirection: 'row'
    },

    vgs_container: {
        height: verticalScale(100),
        marginBottom: verticalScale(20)
    },

    golfvn_container: {
        height: verticalScale(100)
    },

    golfvn_view: {
        height: verticalScale(40),
        flexDirection: 'row'
    },

    world_img: {
        width: verticalScale(50),
        height: verticalScale(50),
        resizeMode: 'contain',
        //marginBottom: 10, 
        marginLeft: scale(5)
    },

    facebook_img: {
        width: verticalScale(50),
        height: verticalScale(50),
        resizeMode: 'contain',
        marginLeft: scale(5),
        // marginBottom: 10
    },

    youtube_img: {
        width: verticalScale(50),
        height: verticalScale(50),
        resizeMode: 'contain',
        // marginBottom: 10 
    },

    location_img: {
        width: verticalScale(10),
        height: verticalScale(10),
        resizeMode: 'contain',
        tintColor: '#4294f7',
        marginLeft: scale(10),
        marginTop: scale(10)
    },

    location_value_text: {
        flex: 1,
        fontSize: fontSize(14, 1),// 14,
        color: '#979797',
        marginLeft: scale(25)
    },

    location_address_label: {
        fontSize: fontSize(14, 1),// 14,
        color: '#000',
        fontWeight: 'bold',
        textAlignVertical: 'center',
        marginLeft: scale(5)
    },

    item_ic_image: {
        height: verticalScale(30),
        width: verticalScale(30),
        marginLeft: scale(10),
        resizeMode: 'contain',
        //marginBottom: 5,
        //tintColor: '#4294f7'
    },

    item_image: {
        height: verticalScale(20),
        width: verticalScale(20),
        marginLeft: scale(10),
        resizeMode: 'contain',
        marginBottom: scale(5),
        tintColor: '#4294f7'
    },

    item_text: {
        fontSize: fontSize(14, 1),// 14,
        color: '#4294f7',
        marginLeft: scale(10),
        marginBottom: verticalScale(5)
    }
})