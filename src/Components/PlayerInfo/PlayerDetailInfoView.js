import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler,
    Image,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
import { Avatar } from 'react-native-elements';
import MyView from '../../Core/View/MyView';
import PersonalAccessories from '../Users/Items/PersonalAccessories';

export default class PlayerDetailInfoView extends BaseComponent {

    constructor(props) {
        super(props);
        this.onBackPress = this.onBackPress.bind(this);
        this.onAvatarClick = this.onAvatarClick.bind(this);
        this.userProfile = this.props.navigation.state.params.userProfile;
        this.isMe = this.props.navigation.state.params.isMe;
        this.state = {

        }
    }

    render() {
        let user_name = this.userProfile.getFullName();
        let avatar = this.userProfile.getAvatar();
        let user_id = this.userProfile.getUserId();
        let user_club_id = this.userProfile.getEhandicapMemberId();
        let birthday = this.userProfile.getBirthday();
        let gender = this.userProfile.getGender() === 0 ? this.t('male') : this.t('female');
        let city = this.userProfile.getCity();
        let phone_number = this.userProfile.getPhone();
        return (
            <View style={styles.background_home}>
                <Image
                    source={this.getResources().ic_bg_home}
                    style={styles.img_bg_grass}
                    resizeMethod={'resize'} />

                <View style={styles.view_content}>
                    <TouchableOpacity style={[styles.touchable_back, { zIndex: 3 }]} onPress={this.onBackPress}>
                        <Image style={styles.icon_back}
                            source={this.getResources().ic_back_large}
                        />
                    </TouchableOpacity>
                    <View style={styles.header_line} />
                    <View style={styles.view_avatar}>
                        <Avatar
                            width={this.getRatioAspect().verticalScale(110)}
                            width={this.getRatioAspect().verticalScale(110)}
                            rounded={true}
                            containerStyle={styles.avatar_container}
                            avatarStyle={styles.avatar_style}
                            source={{ uri: avatar }}
                            onPress={this.onAvatarClick}
                        />

                        <Text allowFontScaling={global.isScaleFont} style={styles.user_name} >{user_name}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.user_id} >
                            {user_id}
                            <Text allowFontScaling={global.isScaleFont} style={{ color: '#B2B2B2' }}>{user_club_id ? ' - ' : ''}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.user_club_id}>
                                {user_club_id ? user_club_id : ''}
                            </Text>
                        </Text>
                    </View>

                    <View style={styles.view_details}>
                        <View style={styles.view_item}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('name')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_value}>{user_name}</Text>
                        </View>
                        <View style={styles.line} />
                        <View style={styles.view_item}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('birthday')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_value}>{birthday}</Text>
                        </View>
                        <View style={styles.line} />
                        <View style={styles.view_item}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('gender')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_value}>{gender}</Text>
                        </View>
                        <View style={styles.line} />
                        <View style={styles.view_item}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('city')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_value}>{city}</Text>
                        </View>

                        <MyView hide={!this.isMe}>
                            <View style={styles.line} />
                            <View style={styles.view_item}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('phone_number')}</Text>
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_value}>{phone_number}</Text>
                            </View>
                            <View style={styles.line} />
                        </MyView>
                    </View>
                    {/* <PersonalAccessories /> */}
                </View>
            </View>
        );
    }

    onBackPress() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    handleHardwareBackPress() {
        let self = this;
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
            self.onBackPress();
            return true;
        });
    }

    onAvatarClick() {
        let { navigation } = this.props;
        let originAvatar = this.userProfile.getOriginAvatar();
        console.log('originAvatar', originAvatar)
        let user_avatar_uri = this.userProfile.getAvatar();
        if (navigation) {
            navigation.navigate('show_scorecard_image', {
                'imageUri': originAvatar ? originAvatar : user_avatar_uri,
                'imgList': [originAvatar ? originAvatar : user_avatar_uri],
                'position': 0,
                'isPortrait': true
            })
        }
    }

}

const styles = StyleSheet.create({
    background_home: {
        flex: 1,
        backgroundColor: '#fff'
    },
    img_bg_grass: {
        width: null,
        height: verticalScale(90),
        resizeMode: 'cover'
    },
    view_content: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    header_line: {
        height: 0.5,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginTop: verticalScale(25)
    },
    view_avatar: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar_container: {
        marginTop: verticalScale(10),
        backgroundColor: '#fff'
    },
    avatar_style: {
        borderColor: '#FFFFFF',
        borderWidth: 2
    },
    user_name: {
        color: '#484848',
        fontWeight: 'bold',
        fontSize: fontSize(18),// 15,
        marginTop: verticalScale(5)
    },
    user_id: {
        color: '#B2B2B2',
        fontWeight: 'bold',
        fontSize: fontSize(18),// 15,
        marginTop: verticalScale(2)
    },
    user_club_id: {
        color: '#B2B2B2',
        // fontWeight: 'bold',
        // fontSize: 15,
        // marginTop: 2
    },
    view_details: {
        marginLeft: scale(10),
        marginRight: scale(10),
        marginTop: scale(10),
        borderRadius: scale(10),
        padding: scale(10),
        // borderWidth: scale(1),
        paddingBottom: scale(10),
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowRadius: scale(10),
        shadowOpacity: 1.0,
        elevation: 1,
    },
    view_item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 50
    },
    txt_title: {
        fontSize: fontSize(15),
        color: '#797979'
    },
    txt_value: {
        fontSize: fontSize(15),
        color: '#5A5A5A',
        fontWeight: 'bold'
    },
    line: {
        height: 1,
        backgroundColor: '#D2D2D2'
    },
    touchable_back: {
        position: 'absolute',
        height: verticalScale(50),
        width: scale(50),
        marginTop: verticalScale(25)
    },
    icon_back: {
        height: verticalScale(22),
        width: scale(22),
        resizeMode: 'contain',
        marginTop: verticalScale(15),
        marginLeft: scale(10)
    },
});