import React from 'react';
import {
    StyleSheet,
    Text,

    // View,
    TouchableOpacity,
    Image,
    Animated,
    UIManager
} from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import MyView from '../../../Core/View/MyView';
import Touchable from 'react-native-platform-touchable';
import CustomAvatar from '../../Common/CustomAvatar';
import TeeView from '../../Common/TeeView';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
import { View } from 'react-native-animatable';
import PropsStatic from '../../../Constant/PropsStatic';

export default class MemberFlightEventItem extends BaseComponent {

    static defaultProps = {
        memberItem: {},
        isShowSwap: false,
        isShareView: false
    }

    constructor(props) {
        super(props);
        this.onChangeTee = this.onChangeTeePress.bind(this);
        this.onSwapPlayerFlight = this.onSwapPlayerFlightPress.bind(this);
        let { memberItem, isShowSwap, isShareView } = this.props;
        let is_block = memberItem.is_block;
        this.state = {
            animationHeight: new Animated.Value(is_block === 0 || isShareView || !isShowSwap ? verticalScale(70) : verticalScale(1)),
            animation: new Animated.Value(1),
        }

        this.onUserClick = this.onUserClick.bind(this);
    }

    /**
     * vao xem chi tiet user
     */
    onUserClick() {
        let { memberItem, isCallbackPress } = this.props;
        if (isCallbackPress) {
            isCallbackPress(memberItem);
        } else {
            let user = memberItem.getUserProfile();
            let userId = user.getUserId() || '';
            let navigation = PropsStatic.getAppSceneNavigator();
            this.Logger().log('............................ navigation : ', navigation);
            if (navigation) {
                navigation.navigate('player_info', { "puid": userId });
            }
        }

    }

    hideSwap() {
        this.props.isShowSwap = false;
        this.setState({});
    }

    startAnimation() {
        const animations = [
            Animated.timing(this.state.animation, {
                toValue: 1.1,
                duration: 500,
            }),
        ];

        Animated.sequence(animations).start();
    }

    render() {
        let { memberItem, isShowSwap } = this.props;
        let user = memberItem.getUserProfile();
        let avatar = user.getAvatar();
        let fullName = user.getFullName() || '';
        let handicap = user.getUsgaHcIndex() || '';
        let userId = user.getUserId() || '';
        let ehandicapClub = user.getEhandicapMemberId() || '';

        let teeSelected = memberItem.getTeeDisplay();
        let facility_handicap = memberItem.getCourseIndex();
        let isSelectSwap = memberItem.isSelectSwap;
        let is_block = memberItem.is_block;

        console.log('is_block', is_block)
        // this.Logger().log('................................. isShowSwap',isShowSwap,facility_handicap);

        return (
            <Animated.View style={[{ transform: [{ scale: this.state.animation }] }, { height: this.state.animationHeight }]}
            >
                <Touchable onPress={this.onUserClick}>
                    <View style={[styles.container, { minHeight: verticalScale(70) }]}
                        ref={(refViewAnimate) => { this.refViewAnimate = refViewAnimate }}>

                        <CustomAvatar
                            width={verticalScale(50)}
                            height={verticalScale(50)}
                            uri={avatar}
                        />

                        <View style={styles.container_content_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.fullname_text} numberOfLines={1}>{fullName}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.user_id_text}>{this.showUserId(userId, ehandicapClub)}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.user_id_text}>
                                {this.t('hdc')}: {this.getAppUtil().handicap_display(handicap)}
                            </Text>

                        </View>

                        <View style={{ minWidth: isShowSwap ? scale(70) : scale(40), flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>

                            <MyView hide={isSelectSwap === 1}
                                style={{ flexDirection: 'row', alignItems: 'center' }}>


                                <TouchableOpacity onPress={this.onChangeTee}
                                    style={styles.touchable_tee_view}>
                                    <TeeView
                                        ref={(refTeeView) => { this.refTeeView = refTeeView }}
                                        teeObject={teeSelected}
                                    />
                                </TouchableOpacity>

                                <MyView hide={facility_handicap != undefined && facility_handicap != null ? false : true}
                                    style={styles.view_course_handicap}>
                                    <View style={styles.handicap_facility_view}>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.handicap_facility_text}>
                                            {this.getAppUtil().handicap_display(facility_handicap)}
                                        </Text>
                                    </View>
                                </MyView>
                            </MyView>

                            {/* <MyView hide={isSelectSwap === -1 || isSelectSwap === 0 || isSelectSwap === 2 || is_block}>
                                <Text allowFontScaling={global.isScaleFont} style={{ color: '#9B9B9B', fontSize: fontSize(13, -scale(1)), marginRight: scale(3) }}>{this.t('press_to_swap')}</Text>
                            </MyView> */}

                            <MyView hide={!isShowSwap || isSelectSwap === 1}>
                                <TouchableOpacity style={[styles.touchable_icon_remove, {
                                    paddingLeft: scale(10),
                                    paddingRight: scale(5),
                                    paddingTop: scale(10),
                                    paddingBottom: scale(10)
                                }]}
                                    onPress={this.onSwapPlayerFlight}>
                                    <Image
                                        style={[styles.img_swap, { tintColor: isSelectSwap === 0 ? '#00ABA7' : isSelectSwap === 1 ? '#9B9B9B' : '#9B9B9B' }]}
                                        source={isSelectSwap === -1 || isSelectSwap === 0 || isSelectSwap === 2 ? this.getResources().ic_swap_player : this.getResources().ic_swap_check}
                                    />
                                </TouchableOpacity>
                            </MyView>

                        </View>
                    </View>
                </Touchable>

                <MyView hide={isSelectSwap === -1 || isSelectSwap === 0 || is_block}
                    style={[styles.view_swap, { backgroundColor: 'rgba(255,255,255,0.8)', }]}>
                </MyView>
                <MyView hide={isSelectSwap === -1 || isSelectSwap === 0 || is_block}
                    style={[styles.view_swap, { justifyContent: 'flex-end', alignItems: 'center' }]}>
                    <TouchableOpacity style={[styles.touchable_icon_remove, { padding: isSelectSwap != 1 ? 0 : scale(10) }]}
                        onPress={this.onSwapPlayerFlight}>
                        <Text allowFontScaling={global.isScaleFont} style={{ color: '#000', fontWeight: 'bold', fontSize: fontSize(15, -scale(1)), marginRight: scale(3) }}>{isSelectSwap != 1 ? '' : this.t('press_to_swap')}</Text>

                        <Image
                            style={[styles.img_swap, { tintColor: '#000' }]}
                            source={isSelectSwap != 1 ? null : this.getResources().ic_swap_check}
                        />
                    </TouchableOpacity>
                </MyView>
            </Animated.View>
        );
    }

    showUserId(userId, eHandicap_member_id) {
        return (eHandicap_member_id && eHandicap_member_id.length) ? userId + '-' + eHandicap_member_id : userId;
    }

    onChangeTeePress() {
        if (this.props.onChangeTeePress) {
            this.props.onChangeTeePress();
        }
    }

    onSwapPlayerFlightPress() {
        if (this.props.onSwapPlayer) {
            this.props.onSwapPlayer(this.refMemberFlightEventItem);
        }

    }

    startAnimate() {
        // setTimeout(()=>{
        this.refViewAnimate.animate('flipInY', 1000)
        // }, 500)

        // this.refViewAnimate.animate('flipOutY', 500)
    }

    setCollapse() {
        let initialValue = verticalScale(70);
        let finalValue = verticalScale(1);

        // this.state.animationHeight.setValue(initialValue);
        Animated.spring(
            this.state.animationHeight,
            {
                toValue: finalValue
            }
        ).start();

    }

    setExpand() {
        let initialValue = verticalScale(1);
        let finalValue = verticalScale(70);

        this.state.animationHeight.setValue(initialValue);
        Animated.spring(
            this.state.animationHeight,
            {
                toValue: finalValue
            }
        ).start();
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10),
        alignItems: 'center',
        paddingLeft: scale(10),
        paddingRight: scale(10)
    },

    avatar_image: {
        resizeMode: 'contain',
        minHeight: verticalScale(50),
        minWidth: verticalScale(50)
    },

    container_content_view: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: scale(8)
    },

    fullname_text: {
        fontWeight: 'bold',
        fontSize: fontSize(15, scale(1)),
        color: '#000'
    },

    user_id_text: {
        color: '#adadad',
        fontSize: fontSize(13, -scale(1))
    },

    view_course_handicap: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(20)
    },
    handicap_facility_view: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#00aba7',
        borderRadius: verticalScale(15),
        width: verticalScale(30),
        height: verticalScale(30),
        borderWidth: scale(1.5),
    },

    handicap_facility_text: {
        alignSelf: 'center',
        color: '#00aba7',
        fontWeight: 'bold'
        //fontSize : 25
    },

    img_swap: {
        width: verticalScale(20),
        height: verticalScale(20),
        resizeMode: 'contain',
        // padding: scale(10)
    },
    touchable_icon_remove: {
        justifyContent: 'center',
        flexDirection: 'row',
    },
    view_center: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: scale(10)
    },
    touchable_tee_view: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_swap: {
        position: 'absolute',
        left: scale(10),
        right: scale(10),
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        flexDirection: 'row'
    }
});