import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
// import Swiper from 'react-native-swiper';
// import MyView from '../../Core/View/MyView';
import { Avatar } from 'react-native-elements';
// import Networking from '../../Networking/Networking';
// import ApiService from '../../Networking/ApiService';
// import PlayerInfoModel from '../../Model/PlayerInfo/PlayerInfoModel';
// import Files from '../Common/Files';
import HomeLoading from '../Home/HomeLoadingView';
// import CustomLoading from '../Common/ItemLoadingView';
import RankingInfoView from './Items/RankingInfoView';
// import CategoryPlayerView from './Items/CategoryPlayerView';

import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
// import ButtonPlayerInfo from './Buttons/ButtonPlayerInfo';
// import { FRIEND } from '../../Constant/Constant';
let { width, height } = Dimensions.get('window');
import StaticProps from '../../Constant/PropsStatic';
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
// import AcceptRejectInviteFriend from './Items/AcceptRejectInviteFriend';


// const PATH_ICON_FRIEND = {
//     REMOVE: Files.sprites.ic_unfriend,
//     ADD: Files.sprites.icon_add_friend
// }

// const FRIEND_STATUS = {
//     NOT_FRIEND: -1,
//     FRIEND: 1,
//     WAITING_FOR_ACCEPT: 2,
//     SENT_REQUEST: 0
// }
/**
 * friend status 1 - friend, 2 no gui cho minh
 */
export default class PlayerInfoItem extends BaseComponent {

    static defaultProps = {
        puid: '',
        isMe: false
    }

    constructor(props) {
        super(props);
        this.friend_status = 0;
        this.originAvatar = '';
        this.userProfile;
        this.state = {
            // indicator_custom_page1: '#54FFFB',
            // indicator_custom_page2: '#4DD9D9D9',
            user_name: '',
            user_id: '',
            user_club_id: '',
            user_avatar_uri: '',
            birthday: '',
            gender: '',
            city: '',
            country_image: '',
            phone_number: '',
            hdc_tt: '',
            hdc_usga: '',
            top_ranking: 'Top 18+ Game',
            top_ranking_value: '',
            system_ranking: '',
            ranking_manner: '',
            // isHideClubJoin: false,
            // clubList: [],
            // isLoading_friend: false,
            // showIconAddFriend: false,
            // friend_status: -1
        }

        this.onViewDetailAvatar = this.onViewDetailAvatar.bind(this);

        this.onViewDetailAvatarCallback = null;
        // this.onAddFriendClick = this.onAddFriendClick.bind(this);
        // this.onRejectInviteFriendClick = this.onRejectInviteFriendClick.bind(this);
        // this.onAcceptInviteFriendClick = this.onAcceptInviteFriendClick.bind(this);
        // this.onCategoryPress = this.onCategoryPress.bind(this);
        // this.onStatitisticalClick = this.onStatitisticalClick.bind(this);
    }

    /**
     * Trạng thái bạn bè giữa 2 người icon
     * @param {Number} friend_status 
     */
    // getIconStatusFriend(friend_status) {
    //     console.log('............................ check trang thai ban be : ', friend_status);
    //     let icon = null;
    //     switch (friend_status) {
    //         case FRIEND_STATUS.FRIEND:
    //             icon = this.getResources().icon_unfr;//icon huy ket ban
    //             break;
    //         case FRIEND_STATUS.NOT_FRIEND:
    //             icon = this.getResources().icon_addFr;
    //             break;
    //         case FRIEND_STATUS.SENT_REQUEST:
    //             icon = this.getResources().send_invite;
    //             break;
    //         default:
    //             break;
    //     }
    //     return icon;
    // }

    // /**
    //  * Trạng thái bạn bè giữa 2 người text
    //  * @param {Number} friend_status 
    //  */
    // getNameStatusFriend(friend_status) {
    //     let name = '';
    //     switch (friend_status) {
    //         case FRIEND_STATUS.FRIEND:
    //             name = this.t('reject_add_friend');//icon huy ket ban
    //             break;
    //         case FRIEND_STATUS.NOT_FRIEND:
    //             name = this.t('add_friend');
    //             break;
    //         case FRIEND_STATUS.SENT_REQUEST:
    //             name = this.t('send_invite_status');
    //             break;
    //         default:
    //             break;
    //     }
    //     return name;
    // }

    // setChangeState(friend_status) {
    //     // this.setState({
    //     let icon_add_friend = this.getIconStatusFriend(friend_status);
    //     let name = this.getNameStatusFriend(friend_status);
    //     // this.btnAddFriend.changeView(icon_add_friend, name);
    //     // friend_status: friend_status
    //     // });
    // }

    onViewDetailAvatar() {
        // let { navigation, isMe } = this.props;
        // if (navigation) {
        //     navigation.navigate('player_detail_info_view', {
        //         'userProfile': this.userProfile,
        //         'isPortrait': true,
        //         'isMe': isMe
        //     });
        // }
        if (this.onViewDetailAvatarCallback) {
            this.onViewDetailAvatarCallback();
        }
    }

    componentDidMount() {
        // console.log("xem thong tin puid ", this.puid);
        // let { isMe, puid } = this.props;
        // this.requestGetUserProfile(puid);
        // this.btnCertificate.show();
        // this.btnStatistical.show();
        // this.btnComparePerformance.show();
        // this.addEvent();
        // console.log('isMe............................ ', isMe);
        // if (!isMe) {
        //     this.btnChat.show();
        // }
    }

    render() {
        let {
            country_image,
            hdc_tt,
            hdc_usga,
            top_ranking,
            top_ranking_value,
            system_ranking,
            ranking_manner
        } = this.state;

        // let clubViewList = this.state.clubList.map((item, key) => {
        //     return <Avatar containerStyle={{ marginRight: this.getRatioAspect().scale(10) }}
        //         rounded={true}
        //         width={this.getRatioAspect().verticalScale(45)}
        //         height={this.getRatioAspect().verticalScale(45)}
        //         avatarStyle={{ borderColor: '#fff', borderWidth: 1 }}
        //         source={{ uri: item.getLogo() }} />;
        // });

        return (
            <View style={styles.background_home}
            >
                <Image
                    source={this.getResources().ic_bg_home}
                    style={styles.img_bg_grass}
                    resizeMethod={'resize'} />

                <View style={styles.view_content}>
                    {/* <View style={styles.header_line} /> */}

                    {/* <View style={styles.swiper_page1}> */}
                    <View style={styles.player_info_view}>
                        <View style={styles.player_view}>

                            <Touchable onPress={this.onViewDetailAvatar}>
                                <View style={styles.avatar_container}>
                                    <Avatar
                                        width={this.getRatioAspect().verticalScale(70)}
                                        height={this.getRatioAspect().verticalScale(70)}
                                        rounded={true}
                                        containerStyle={styles.avatar_container}
                                        avatarStyle={styles.avatar_style}
                                        source={{ uri: this.state.user_avatar_uri }}
                                    />
                                    <Avatar
                                        containerStyle={styles.flag_container}
                                        width={this.getRatioAspect().verticalScale(26)}
                                        height={this.getRatioAspect().verticalScale(26)}
                                        rounded={true}
                                        source={country_image.length ? { uri: country_image } : ''}
                                    />
                                </View>
                            </Touchable>

                            <Text allowFontScaling={global.isScaleFont} style={styles.user_name} >{this.state.user_name}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.user_id} >
                                {this.state.user_id}
                                <Text allowFontScaling={global.isScaleFont} style={{ color: '#B2B2B2' }}>{this.state.user_club_id ? ' - ' : ''}</Text>
                                <Text allowFontScaling={global.isScaleFont} style={styles.user_club_id}>
                                    {this.state.user_club_id ? this.state.user_club_id : ''}
                                </Text>
                            </Text>
                        </View>

                        <RankingInfoView
                            hdc_tt={hdc_tt}
                            hdc_usga={hdc_usga}
                            top_ranking={top_ranking}
                            top_ranking_value={top_ranking_value}
                            system_ranking={system_ranking}
                            ranking_manner={ranking_manner}
                        />

                    </View>

                    {/* <View style={styles.view_container_club}>
                            <MyView style={styles.club_group_view} hide={this.state.isHideClubJoin} />
                            <MyView style={styles.view_club} hide={this.state.isHideClubJoin}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.club_joined}>{this.t('club_joined')}</Text>
                                <View style={styles.club_icon_group}>
                                    {clubViewList}
                                </View>
                            </MyView>
                        </View> */}

                    {/* </ImageBackground> */}
                    {/* </View> */}

                    {/* <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                        <View style={{ marginTop: verticalScale(10), flexDirection: 'row', justifyContent: 'space-between' }}>
                            <ButtonPlayerInfo ref={(btnCertificate) => { this.btnCertificate = btnCertificate; }}
                                name={this.t('certificate')}
                                source={this.getResources().write_event}
                            />
                            <ButtonPlayerInfo
                                ref={(btnStatistical) => { this.btnStatistical = btnStatistical; }}
                                name={this.t('statistical')}
                                source={this.getResources().ic_statistical}
                            />
                            <ButtonPlayerInfo
                                ref={(btnComparePerformance) => { this.btnComparePerformance = btnComparePerformance; }}
                                name={this.t('compare_performance')}
                                source={this.getResources().ic_compare_level}
                            />
                            <ButtonPlayerInfo
                                ref={(btnChat) => { this.btnChat = btnChat; }}
                                name={this.t('chat')}
                                source={this.getResources().ic_discuss}
                            />
                            <ButtonPlayerInfo
                                ref={(btnAddFriend) => { this.btnAddFriend = btnAddFriend }}
                            // name={this.t('add_friend')}
                            // source={this.getResources().icon_add_friend}
                            />
                        </View>
                         <CategoryPlayerView
                            onCategoryPress={this.onCategoryPress} /> 
        </View> */}
                </View>


                {/* <HomeLoading ref={(homeLoading) => { this.homeLoading = homeLoading; }}
                    top={this.getRatioAspect().verticalScale(100)} /> */}
            </View>
        );
    }

    // onCategoryPress(index) {
    //     let { onCategoryPress } = this.props;
    //     if (onCategoryPress) {
    //         onCategoryPress(index);
    //     }
    // }

    /**
     * kick vào button thống kê 10 trân gần nhất
     */
    onStatitisticalClick() {
        // let { onStatitisticalClick } = this.props;
        // if (onStatitisticalClick) {
        //     onStatitisticalClick();
        // }
        let navigation = StaticProps.getAppSceneNavigator();
        if (navigation) {
            let { isMe, puid } = this.props;
            if (isMe) {
                navigation.navigate('statistical');
            } else {
                navigation.navigate('statistical_other', { puid: puid });
            }
        }
    }

    // onComparePerformanceClick() {
    //     let { isMe, puid } = this.props;
    //     let navigation = StaticProps.getAppSceneNavigator();
    //     if (navigation) {
    //         navigation.navigate('compare_performance', {
    //             puid: puid,
    //             isMe: isMe,
    //             playerProfile: this.userProfile
    //         });
    //     }
    // }

    // /**
    //  * Đồng ý lời mời kết bạn
    //  */
    // onAcceptInviteFriendClick() {
    //     let url = this.getConfig().getBaseUrl() + ApiService.friend_accept(this.puid);
    //     this.acceptLoading.showLoading();
    //     this.setState({
    //         isLoading_friend: true
    //     });
    //     let self = this;
    //     Networking.httpRequestGet(url, (jsonData) => {
    //         console.log("acctep : ", jsonData);
    //         self.acceptLoading.hideLoading();
    //         if (jsonData.hasOwnProperty('error_code')) {
    //             let error_code = parseInt(jsonData['error_code']);
    //             if (error_code === 0) {
    //                 //thanh cong
    //                 self.friend_status = FRIEND_STATUS.FRIEND;
    //                 self.setState({
    //                     isLoading_friend: false,
    //                     showIconAddFriend: true,
    //                     icon_add_friend: (FRIEND_STATUS.FRIEND === 1 || friend_status === FRIEND_STATUS.SENT_REQUEST) ? PATH_ICON_FRIEND.REMOVE : PATH_ICON_FRIEND.ADD
    //                 });
    //             } else {
    //                 self.setState({
    //                     isLoading_friend: false
    //                 });
    //             }
    //         }
    //     }, () => {
    //         self.acceptLoading.hideLoading();
    //         self.setState({
    //             isLoading_friend: false
    //         });
    //     });
    // }

    // onRejectInviteFriendClick() {
    //     if (this.props.onRejectInviteFriendClick) {
    //         this.props.onRejectInviteFriendClick();
    //     }
    // }

    // onRejectInviteFriend() {
    //     let url = this.getConfig().getBaseUrl() + ApiService.friend_denied(this.puid);
    //     this.acceptLoading.showLoading();
    //     this.setState({
    //         isLoading_friend: true
    //     });
    //     let self = this;
    //     Networking.httpRequestGet(url, (jsonData) => {
    //         console.log("acctep : ", jsonData);
    //         self.acceptLoading.hideLoading();
    //         if (jsonData.hasOwnProperty('error_code')) {
    //             let error_code = parseInt(jsonData['error_code']);
    //             if (error_code === 0) {
    //                 //thanh cong
    //                 self.friend_status = FRIEND_STATUS.NOT_FRIEND;
    //                 // self.setState({
    //                 //     // isLoading_friend: false,
    //                 //     // showIconAddFriend: true,
    //                 //     icon_add_friend: (this.friend_status === 1) ? PATH_ICON_FRIEND.REMOVE : PATH_ICON_FRIEND.ADD
    //                 // });
    //             } else {
    //                 self.setState({
    //                     isLoading_friend: false
    //                 });
    //             }
    //         }
    //     }, () => {
    //         self.acceptLoading.hideLoading();
    //         self.setState({
    //             isLoading_friend: false
    //         });
    //     });
    // }

    // cancelRequestAddFriend() {
    //     if (this.props.cancelRequestAddFriend) {
    //         this.props.cancelRequestAddFriend();
    //     }
    // }

    // requestGetUserProfile(puid = this.uid) {
    //     let self = this;
    //     this.homeLoading.setVisible(true);
    //     let url = this.getConfig().getBaseUrl() + ApiService.user_profile(puid);
    //     console.log('url', url);
    //     Networking.httpRequestGet(url, this.onResponseUserProfile.bind(this), () => {
    //         //time out
    //         self.homeLoading.setVisible(false);
    //         self.showErrorMsg(self.t('time_out'));
    //     });
    // }

    // onResponseUserProfile(jsonData) {
    //     this.homeLoading.setVisible(false);
    //     this.model = new PlayerInfoModel(this);
    //     this.model.parseData(jsonData);
    //     if (this.model.getErrorCode() === 0) {
    //         this.updatePlayerInfo(this.model);
    //     } else {
    //         this.showErrorMsg(this.model.getErrorMsg());
    //     }
    // }

    updatePlayerInfo(playerInfo) {
        this.userProfile = playerInfo.getPlayerProfile();
        let puid = playerInfo.getPuid();
        let friend_status = playerInfo.getFriendStatus();

        // console.log('............................................ playerInfo',playerInfo)

        this.puid = puid;
        this.friend_status = friend_status;
        // console.log("status ban be : ", (this.friend_status !== FRIEND_STATUS.WAITING_FOR_ACCEPT), friend_status);
        this.originAvatar = this.userProfile.getOriginAvatar();
        this.setState({
            user_name: this.userProfile.getFullName(),
            user_id: this.userProfile.getUserId(),
            user_club_id: this.userProfile.getEhandicapMemberId(),
            user_avatar_uri: this.userProfile.getAvatar(),
            birthday: this.userProfile.getBirthday(),
            gender: this.userProfile.getGender() === 0 ? this.t('male') : this.t('female'),
            city: this.userProfile.getCity(),
            phone_number: this.userProfile.getPhone(),//getUsgaHcIndexExpected
            // hdc_tt: this.userProfile.getUsgaHcIndex() >= 0 ? this.userProfile.getUsgaHcIndex() : '+' + Math.abs(this.userProfile.getUsgaHcIndex()),
            hdc_tt: this.userProfile.getUsgaHcIndexExpected() >= 0 ? this.userProfile.getUsgaHcIndexExpected() : '+' + Math.abs(this.userProfile.getUsgaHcIndexExpected()),
            hdc_usga: this.userProfile.getMonthlyHandicap() >= 0 ? this.userProfile.getMonthlyHandicap() : '+' + Math.abs(this.userProfile.getMonthlyHandicap()),
            top_ranking: this.userProfile.getDisplay_ranking_type(),
            top_ranking_value: this.userProfile.getRanking() > 0 ? this.userProfile.getRanking() : '-',
            system_ranking: this.userProfile.getSystem_ranking() > 0 ? this.userProfile.getSystem_ranking() : '-',
            ranking_manner: this.userProfile.getRanking_manners(),
            // clubList: playerInfo.getClubList(),
            // isHideClubJoin: playerInfo.getClubList().length === 0 ? true : false,
            // showIconAddFriend: !this.props.isMe && (friend_status !== FRIEND_STATUS.WAITING_FOR_ACCEPT),
            // icon_add_friend: (friend_status === 1 || friend_status === FRIEND_STATUS.SENT_REQUEST) ? PATH_ICON_FRIEND.REMOVE : PATH_ICON_FRIEND.ADD,
            country_image: this.userProfile.getCountryImage(),
            // showIconAddFriend: friend_status === 1 ? false : true,
            // friend_status: friend_status
        });
    }
}

const styles = StyleSheet.create({
    background_home: {
        width: width,
        minHeight: verticalScale(190),
        // paddingBottom : verticalScale(10),
        backgroundColor: '#fff'
    },
    img_bg_grass: {
        width: width,
        height: verticalScale(90),
        resizeMode: 'cover'
    },
    view_content: {
        position: 'absolute',
        left: 0,
        top: getStatusBarHeight() + verticalScale(6),
        right: 0,
        bottom: 0
    },
    button_reject_friend: {
        height: verticalScale(20),
        width: scale(50),
        marginRight: scale(5),
        marginBottom: verticalScale(7),
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#fff',
        borderWidth: 1
    },

    button_accept_friend: {
        height: verticalScale(20),
        width: scale(50),
        justifyContent: 'center',
        marginRight: scale(5),
        marginBottom: verticalScale(7),
        alignItems: 'center',
        borderColor: '#fff',
        borderWidth: 1
    },

    text_buttom_friend: {
        color: '#fff',
        fontSize: fontSize(11, -scale(4)),// 11,
        textAlign: 'center'
    },

    container_content: {
        flex: 1
    },
    header_line: {
        height: 0.5,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginTop: verticalScale(25)
    },
    swiper_page1: {

    },
    swiper_page2: {
        flex: 1,
        justifyContent: 'center'
    },
    player_info_view: {
        flexDirection: 'row',
        marginRight: scale(10),
        justifyContent: 'space-between'
    },
    player_view: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    ranking_view: {
        flex: 4,
        borderRadius: scale(10),
        marginTop: verticalScale(10),
        backgroundColor: 'rgba(13, 13, 13, 0.2)',
    },
    avatar_container: {
        marginTop: verticalScale(10),
    },
    flag_container: {
        position: 'absolute'
    },
    avatar_style: {
        borderColor: '#FFFFFF',
        borderWidth: verticalScale(2),
    },
    user_name: {
        color: '#484848',
        fontWeight: 'bold',
        fontSize: fontSize(15),// 15,
        marginTop: verticalScale(5)
    },
    user_id: {
        color: '#B2B2B2',
        fontWeight: 'bold',
        fontSize: fontSize(15),// 15,
        marginTop: verticalScale(2)
    },
    user_club_id: {
        color: '#B2B2B2',
        // fontWeight: 'bold',
        // fontSize: 15,
        // marginTop: 2
    },
    ranking_title: {
        backgroundColor: '#EFEFF4',
        borderRadius: scale(8),
        color: '#014736',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: fontSize(15),// 15,
        paddingTop: verticalScale(3),
        paddingBottom: verticalScale(3)
    },
    ranking_view_item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: scale(20),
        marginLeft: scale(10)
    },
    ranking_text: {
        color: '#FFFFFF',
        fontSize: fontSize(15),
    },
    ranking_value: {
        color: '#FFE24A',
        fontWeight: 'bold',
        fontSize: fontSize(15)
    },
    ranking_line: {
        backgroundColor: '#FFFFFF',
        marginRight: scale(20),
        marginLeft: scale(10),
        marginTop: verticalScale(3),
        marginBottom: verticalScale(3),
        height: 0.5
    },
    ranking_manner: {
        position: 'absolute',
        height: verticalScale(10),
        width: scale(10),
        resizeMode: 'contain',
        right: scale(5)
    },
    ranking_view_system: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 0,
        marginLeft: scale(10),
        alignItems: 'center'
    },
    ranking_system_value: {
        color: '#FFE24A',
        fontWeight: 'bold',
        marginRight: scale(20)
    },
    club_group_bg: {
        flex: 1,
        width: null,
        marginRight: scale(10),
        marginLeft: scale(10),
        marginTop: verticalScale(20)
    },
    club_group_view: {
        height: verticalScale(35),
        backgroundColor: 'rgba(206, 206, 206, 0.2)',
        borderRadius: 15,
    },
    club_joined: {
        marginLeft: scale(10),
        fontSize: fontSize(15),
        color: '#505050'
    },
    club_icon_group: {
        flexDirection: 'row',
        height: verticalScale(40),
        marginRight: scale(10),
    },
    club_logo: {
        height: verticalScale(45),
        width: verticalScale(45),
        marginLeft: scale(10),
        marginRight: scale(10)
    },
    player_info_item_first: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: scale(45),
        marginRight: scale(45)
    },
    player_info_item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: scale(45),
        marginRight: scale(45),
        marginTop: verticalScale(10)
    },
    player_info_label: {
        color: '#FFFFFF',
        fontSize: fontSize(15),// 15
    },
    player_info_value: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: fontSize(15),// 15
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
    indicator_group: {
        width: 90,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        height: verticalScale(20),
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    indicator_custom: {
        height: verticalScale(2),
        width: scale(50),
        margin: verticalScale(5)
    },

    view_accept_friend: {
        position: 'absolute',
        height: verticalScale(30),
        //width: 100,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },

    touchable_friend: {
        position: 'absolute',
        height: verticalScale(40),
        width: scale(50),
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },

    icon_friend: {
        height: verticalScale(25),
        width: scale(25),
        resizeMode: 'contain',
        marginRight: scale(10),
        marginBottom: verticalScale(5)
    },

    touchable_statitistical: {
        position: 'absolute',
        height: verticalScale(40),
        width: scale(40),
        left: scale(40),
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },

    icon_statitistical: {
        height: verticalScale(25),
        width: scale(25),
        resizeMode: 'contain',
        marginRight: scale(10),
        marginTop: verticalScale(10),
        //tintColor: '#FFFFFF',
    },

    icon_category: {
        height: 25,
        width: 25,
        resizeMode: 'contain',
        tintColor: '#FFFFFF',
    },

    touchable_category: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    view_container_club: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    view_club: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    item_category: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon_certificate: {
        height: verticalScale(25),
        width: scale(25),
        resizeMode: 'contain',
        marginRight: scale(10),
        marginTop: verticalScale(10),
        tintColor: '#FFFFFF',
        opacity: 1
    },
    txt_category_name: {
        fontSize: 10,
        color: '#FFFFFF'
    },
    view_bottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row'
    }
});