import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    TextInput,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import { Transition } from 'react-navigation-fluid-transitions';
import { verticalScale, scale, fontSize } from '../../Config/RatioScale';
import { language } from '../../../Language';
import firebase from 'react-native-firebase';

import DeviceInfo from 'react-native-device-info';

const screenWidth = Dimensions.get("window").width;

export default class SelectLanguageView extends BaseComponent {

    constructor(props) {
        super(props);
        this.onSelectLanguagePress = this.onSelectLanguagePress.bind(this);
        this.onLanguageCallback = this.onLanguageCallback.bind(this);
        this.onStartPress = this.onStartPress.bind(this);
        const deviceLocale = DeviceInfo.getDeviceLocale();
        this.currentLanguage = '';
        if (deviceLocale && deviceLocale.includes('vi')) {
            this.getUserInfo().setLang('vn');
            this.setLanguage('vn');
            this.currentLanguage = language.find((lang) => {
                return lang.key === 'vn';
            })
        } else {
            this.getUserInfo().setLang('en');
            this.setLanguage('en');
            this.currentLanguage = language.find((lang) => {
                return lang.key === 'en';
            })
        }

        this.state = {
            language: this.currentLanguage,
            source: this.currentLanguage ? this.currentLanguage.flag : this.getResources().world
        }
    }

    render() {
        let { language, source } = this.state;

        return (
            // <Transition appear='horizontal'>
            // <ImageBackground style={styles.container}
            //     source={this.getResources().ic_bg_login}
            //     resizeMethod={'resize'}>
            <View style={styles.container}>

                {/* <View style={styles.view_opacity} /> */}

                <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('issued_by_vga')}</Text>

                <View style={styles.view_content}>
                    <View style={styles.view_vhandicap}>
                        <Image
                            style={styles.logo}
                            source={this.getResources().ic_logo}
                        />
                        <View style={{marginLeft: scale(5)}}>
                            <Image
                                style={styles.img_vhandicap}
                                source={this.getResources().ic_vhandicap}
                            />
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_official_handicap}>{this.t('official_handicap')}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={this.onSelectLanguagePress}>
                        <View style={styles.view_input_language}>
                            <Image
                                style={styles.img_flag}
                                source={source} />

                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_triangle}>{'▼'}</Text>

                            <TextInput allowFontScaling={global.isScaleFont}
                                style={styles.select_language}
                                placeholder={this.t('select_language')}
                                placeholderTextColor='#BEBEBE'
                                editable={false}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                value={language.name}
                                numberOfLines={1}
                                onFocus={this.onSelectLanguageFocus}
                            />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={language === ''}
                        onPress={this.onStartPress}>
                        <View style={[styles.touchable_start, { opacity: language === '' ? 0.5 : 1 }]}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_start}>{this.t('start_upper_case')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.view_bottom}>
                    <View style={styles.view_power_by}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_powered}>{this.t('powered_by')}</Text>
                        <Image
                            style={styles.img_vgs_holding}
                            source={this.getResources().ic_vgsholding} />
                    </View>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_copyright}>{'Copyright @2018'}</Text>
                </View>
                {this.renderMessageBar()}
            </View>
            // </ImageBackground>
            // </Transition>
        );
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();

        if (firebase) {
            firebase.analytics().setAnalyticsCollectionEnabled(true);
            firebase.analytics().setCurrentScreen('SelectLanguageView');
            // firebase.messaging().getToken().then((token) => {
            //     console.log('setAnalyticsCollectionEnabled',token)
            //  });
        }

    }

    componentWillUnmount() {
        this.unregisterMessageBar();

    }

    onSelectLanguagePress() {
        this.props.navigation.navigate('language_list_screen', {
            onLanguageCallback: this.onLanguageCallback
        });
    }

    onLanguageCallback(language) {
        this.getUserInfo().setLang(language.key);
        this.setLanguage(language.key);
        this.setState({
            language: language,
            source: language.flag
        }, () => {

        })
    }

    onStartPress() {
        this.props.navigation.navigate('login_screen', {
            language: this.state.language
        });
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#fff'
        // alignItems: 'center',
    },
    view_vhandicap: {
        height: verticalScale(80),
        flexDirection: 'row',
        alignItems: 'center'
    },
    logo: {
        height: verticalScale(80),
        width: verticalScale(80),
        resizeMode: 'contain'
    },
    img_vhandicap: {
        ...Platform.select({
            ios: {
                height: scale(55)
            },
            android: {
                height: scale(50),
            }
        }),
        width: null,
        resizeMode: 'contain'
    },
    txt_official_handicap: {
        color: '#0A0A0A',
        fontSize: fontSize(11, -2),
    }, 
    view_input_language: {
        width: screenWidth - scale(60),
        height: verticalScale(40),
        marginTop: verticalScale(40),
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderColor: '#C2C2C2',
        borderRadius: verticalScale(20),
        borderWidth: 1,
        alignItems: 'center',
    },
    img_flag: {
        height: verticalScale(25),
        width: verticalScale(25),
        resizeMode: 'contain',
        marginLeft: scale(10)
    },
    select_language: {
        fontSize: fontSize(15, scale(1)),
        flex: 1,
        color: 'black',
        lineHeight: fontSize(18, scale(5)),
        padding: 0
    },
    touchable_start: {
        backgroundColor: '#00C25D',
        width: screenWidth - scale(60),
        height: verticalScale(45),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: verticalScale(20),
        marginTop: verticalScale(20),
        marginBottom: verticalScale(50)
    },
    txt_start: {
        fontSize: fontSize(18, scale(4)),
        color: '#fff'
    },
    view_opacity: {
        flex: 1,
        // width: screenWidth,
        backgroundColor: '#fff',
        opacity: 0.5
    },
    view_content: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt_triangle: {
        color: '#7E7E7E',
        fontSize: fontSize(13, -scale(1)),
        marginLeft: scale(5),
        marginRight: scale(5)
    },
    txt_title: {
        color: '#0A0A0A',
        fontSize: fontSize(15),
        fontWeight: '500',
        textAlign: 'center',
        marginTop: scale(50)
    },
    view_bottom: {
        alignItems: 'center',
        marginBottom: scale(30)
    },
    view_power_by: {
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
    },
    txt_powered: {
        color: '#0A0A0A',
        fontSize: fontSize(13),
        marginBottom: scale(5)
    },
    img_vgs_holding: {
        height: scale(40),
        // width: scale(200),
        resizeMode: 'contain',
    },
    txt_copyright: {
        color: '#585858',
        fontSize: fontSize(11),
        marginTop: scale(10)
    }
});