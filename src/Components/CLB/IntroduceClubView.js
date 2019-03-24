import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    BackHandler,
    Animated
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import CustomAvatar from '../Common/CustomAvatar';
import HeaderView from '../HeaderView';
import ClbNavigatorHeader from './Items/ClbNavigatorHeader';
import ClubInfoModel from '../../Model/CLB/ClubInfoModel';
import MyView from '../../Core/View/MyView';
import PopupYesOrNo from '../Common/PopupYesOrNo';
import PhotoGridView from '../Common/PhotoGridView';
import PopupAttachImage from '../Common/PopupAttachImage';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
import * as Progress from 'react-native-progress';
import { createImageProgress } from 'react-native-image-progress';
import FastImage from 'react-native-fast-image';
const Images = createImageProgress(FastImage);

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const HOME_HEADER_HEIGHT = verticalScale(150);
const STATUSBAR_HEIGHT = 25;
const SCROLL_HEIGHT = HOME_HEADER_HEIGHT - STATUSBAR_HEIGHT;

const HEADER_COLLAPSED_HEIGHT = 80;
const imgWidth = (screenWidth - scale(40)) / 7;
const imgs = ['', '', '', '', '', ''];

export default class IntroduceClubView extends BaseComponent {

    nScroll = new Animated.Value(0);
    scroll = new Animated.Value(0);

    tabY = this.nScroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT],
        outputRange: [0, -SCROLL_HEIGHT],
        extrapolate: 'clamp'
    });

    imgOpacity = this.nScroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT],
        outputRange: [1, 0],
    });

    constructor(props) {
        super(props);
        this.userProfile = this.getUserInfo().getUserProfile();
        this.isIphoneX = this.getAppUtil().isIphoneX();
        let { clubName, clubId, logoUrl, totalMember, isAdmin, isAccepted, invitation_id, isModerator, isGeneralSecretary } = this.props.navigation.state.params;
        this.clubName = clubName;
        this.clubId = clubId;
        this.isAdmin = isAdmin;
        this.isGeneralSecretary = isGeneralSecretary;
        this.isModerator = isModerator;
        this.totalMember = totalMember;
        this.invitation_id = invitation_id;
        this.isAccepted = isAccepted;
        this.logoUrl = logoUrl;
        this.isMember = false;
        this.state = {
            introContent: '',
            imgBackground: '',
            adminList: [],
            memberList: [],
            friendList: [],
            topicList: [],
            imgList: [],
            secretGeneralList: [],
            moderatorList: [],
            isShowInvite: true,
            totalTraditionalImg: 0,
            traditionalImgList: [],
            invitePermission: ''
            // scrollY: new Animated.Value(0),
            // header_expanded_height: 230
        }

        this.onChangeCoverImage = this.onChangeCoverImage.bind(this);
        this.onImportGalleryClick = this.onImportGalleryClick.bind(this);
        this.onTakePhotoClick = this.onTakePhotoClick.bind(this);
        this.backgroundUpdateCallback = this.backgroundUpdateCallback.bind(this);

        this.onViewAllMember = this.onViewAllMember.bind(this);
        this.onViewAllImage = this.onViewAllImage.bind(this);
        this.onViewEventPress = this.onViewEventPress.bind(this);
        this.onAcceptInviteClick = this.onAcceptInviteClick.bind(this);
        this.onRejectInviteClick = this.onRejectInviteClick.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
        this.onCheckHandicapPress = this.onCheckHandicapPress.bind(this);
        this.onPopupConfirmClick = this.onPopupConfirmClick.bind(this);
        this.onManageClubPress = this.onManageClubPress.bind(this);
        this.onUpdateClubInfoPress = this.onUpdateClubInfoPress.bind(this);
        this.onOpenTraditionalRoom = this.onOpenTraditionalRoom.bind(this);
        this.addTraditionalImage = this.addTraditionalImage.bind(this);
        this.onAcceptInvitePermissionClick = this.onAcceptInvitePermissionClick.bind(this);
        this.onRejectInvitePermissionClick = this.onRejectInvitePermissionClick.bind(this);
    }

    renderIntroduceGroup(introContent) {
        return (
            <View style={[styles.view_introduce, styles.border_shadow]}>
                <View style={styles.view_introduce_title}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('introduce_about_club')}</Text>
                    <MyView hide={this.isAdmin != 1}>
                        <TouchableOpacity style={styles.touchable_edit}
                            onPress={this.onUpdateClubInfoPress}>
                            <Image style={styles.img_edit}
                                source={this.getResources().pen} />
                        </TouchableOpacity>
                    </MyView>
                </View>
                <View style={styles.line} />
                <Text allowFontScaling={global.isScaleFont} style={styles.txt_content}>{introContent}</Text>
            </View>
        )
    }

    renderMemberList(memberList) {
        let w = (screenWidth - 40 - 45) / 10;

        let lsAvatar = memberList.map((player, index) => {
            if (index < 9) {
                return (
                    <CustomAvatar
                        width={w}
                        height={w}
                        containerStyle={{ marginRight: 5 }}
                        view_style={{ marginRight: 5 }}
                        uri={player.getAvatar()} />
                )
            } else {
                return (
                    <TouchableOpacity onPress={this.onViewAllMember}>
                        <View style={{ width: w, height: w, borderRadius: w / 2, justifyContent: 'center', alignItems: 'center' }}>
                            <CustomAvatar
                                width={w}
                                height={w}
                                // style={{ marginRight: 5 }}
                                uri={player.getAvatar()} />
                            <View style={[styles.view_member_more, {
                                width: w,
                                height: w,
                                borderRadius: w / 2,
                            }]} />
                            <View style={styles.txt_member_more}>
                                <Text allowFontScaling={global.isScaleFont} style={{ color: '#fff', fontSize: 18 }}>{'•••'}</Text>
                            </View>

                        </View>
                    </TouchableOpacity>

                )
            }

        })

        return (
            <View style={styles.view_ls_member}>
                {lsAvatar}
            </View>
        )
    }

    renderMemberGroup(adminList = [], secretGeneralList = [], memberList = [], friendList = [], moderatorList = []) {

        // Chu tich
        let presidentNames = adminList.map((player) => {
            return player.getFullName();
        }).join(', ')

        let presidentView = adminList.map((player) => {
            return (
                <CustomAvatar
                    width={30}
                    height={30}
                    containerStyle={{ marginRight: 5 }}
                    view_style={{ marginRight: 5 }}
                    uri={player.getAvatar()} />
            )
        })
        /////////////////////////
        // tong thu ky
        let secretaryGeneralNames = secretGeneralList.map((player) => {
            return player.getFullName();
        }).join(', ')

        let secretaryGeneralView = secretGeneralList.map((player) => {
            return (
                <CustomAvatar
                    width={30}
                    height={30}
                    containerStyle={{ marginRight: 5 }}
                    view_style={{ marginRight: 5 }}
                    uri={player.getAvatar()} />
            )
        })
        /////////////////////////

        let moderator = moderatorList.map((player) => {
            return player.getFullName();
        }).join(', ')

        let member = friendList.join(', ');

        let moderatorView = moderatorList.map((player) => {
            return (
                <CustomAvatar
                    width={30}
                    height={30}
                    containerStyle={{ marginRight: 5 }}
                    view_style={{ marginRight: 5 }}
                    uri={player.getAvatar()} />
            )
        })



        return (
            <View style={[styles.view_group, styles.border_shadow]}>
                <View style={styles.view_header_group}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{`${this.t('member')} • ${this.totalMember}`}</Text>
                    <TouchableOpacity onPress={this.onViewAllMember}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_sub_title}>{this.t('view_all')}</Text>
                            <Image
                                style={styles.img_arrow_right}
                                source={this.getResources().ic_arrow_right}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.line} />

                <MyView hide={adminList.length === 0}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_sub_title}>{this.t('chu_tich_title')}</Text>
                    <View style={{ flexDirection: 'row', paddingLeft: scale(10), paddingRight: scale(10) }}>
                        {presidentView}
                    </View>

                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_admin_title}>{this.t('is_president').format(presidentNames)}</Text>
                </MyView>

                <MyView hide={secretGeneralList.length === 0}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_sub_title}>{this.t('secretary')}</Text>
                    <View style={{ flexDirection: 'row', paddingLeft: scale(10), paddingRight: scale(10) }}>
                        {secretaryGeneralView}
                    </View>

                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_admin_title}>{`${secretaryGeneralNames} ${this.t('is_secretary')}`}</Text>
                </MyView>

                <MyView hide={moderatorList.length === 0}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_sub_title}>{this.t('admin')}</Text>
                    <View style={{ flexDirection: 'row', paddingLeft: scale(10), paddingRight: scale(10) }}>
                        {moderatorView}
                    </View>

                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_admin_title}>{`${moderator} ${this.t('is_admin')}`}</Text>
                </MyView>

                {this.renderMemberList(memberList)}
                <MyView hide={friendList.length === 0}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_member_title}>{this.t('is_member').format(member)}</Text>
                </MyView>
            </View>
        )
    }

    renderEvent() {
        return (
            <TouchableOpacity onPress={this.onViewEventPress}>
                <View style={[styles.view_add_event, styles.border_shadow]}>
                    <Image
                        style={styles.img_add_event}
                        source={this.getResources().tee_time_icon} />
                    <Text allowFontScaling={global.isScaleFont} style={[styles.txt_check_handicap, { flex: 1 }]}>{`${this.t('event')}`}</Text>
                </View>
            </TouchableOpacity>

        )
    }

    renderAdministratorBtn() {
        if (this.isAdmin === 1 || this.isModerator === 1 || this.isGeneralSecretary === 1) {
            return (
                <TouchableOpacity onPress={this.onManageClubPress}>
                    <View style={[styles.view_add_event, styles.border_shadow]}>
                        <Image
                            style={styles.img_add_event}
                            source={this.getResources().ic_administrator_club} />
                        <Text allowFontScaling={global.isScaleFont} style={[styles.txt_check_handicap, { flex: 1 }]}>{`${this.t('manage_club')}`}</Text>
                    </View>
                </TouchableOpacity>

            )
        } else {
            return null;
        }

    }

    renderConfirmInvite(isShowInvite, invitePermission) {
        console.log('renderConfirmInvite', isShowInvite, invitePermission, !invitePermission)
        return (
            <MyView hide={isShowInvite && !invitePermission}
                style={[{ justifyContent: 'center', alignItems: 'center', height: 80, width: screenWidth, backgroundColor: '#fff' }, styles.border_shadow]}>
                <Text allowFontScaling={global.isScaleFont} style={{ color: '#666666', fontSize: 15, marginTop: 5, marginBottom: 5, marginLeft: 10, marginRight: 10 }}>
                    {!isShowInvite ? this.t('you_added_club').format(this.clubName) :
                        invitePermission.invented_permission_type === 2 ? this.t('invited_secretary_general').format(this.clubName) : this.t('invited_moderator_club').format(this.clubName)}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                    <Touchable style={{ minWidth: 80, backgroundColor: '#00ABA7', justifyContent: 'center', alignItems: 'center', borderRadius: 3, marginRight: 5 }}
                        onPress={!isShowInvite ? this.onAcceptInviteClick : this.onAcceptInvitePermissionClick}>
                        <Text allowFontScaling={global.isScaleFont} style={{ color: '#FFF', fontSize: 15, paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5 }}>
                            {this.t('chap_nhan')}
                        </Text>
                    </Touchable>

                    <Touchable style={{ minWidth: 80, borderColor: '#B3B3B3', borderWidth: 1, borderRadius: 3, justifyContent: 'center', alignItems: 'center', marginLeft: 5 }}
                        onPress={!isShowInvite ? this.onRejectInviteClick : this.onRejectInvitePermissionClick}>
                        <Text allowFontScaling={global.isScaleFont} style={{ color: '#5E5E5E', fontSize: 15, paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5 }}>
                            {!isShowInvite ? this.t('out_of_club') : this.t('deny')}
                        </Text>
                    </Touchable>
                </View>
            </MyView>
        )
    }

    renderTopic(listTopic) {

        let topicItem = listTopic.map((topic) => {
            return (
                <Touchable onPress={this.onTopicItemPress.bind(this, topic)}>
                    <View style={styles.view_topic_item}>
                        <Image
                            style={styles.img_topic}
                            source={{ uri: topic.icon }}
                        />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_topic}>
                                    {topic.name}
                                </Text>
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_topic_count}>
                                    {topic.total_post_not_view_by_user <= 0 ? '' : topic.total_post_not_view_by_user}
                                </Text>
                            </View>
                            <View style={styles.line} />
                        </View>

                    </View>
                </Touchable>
            )
        })

        return (
            <View style={{ marginTop: 8, backgroundColor: '#fff' }}>
                <View style={styles.view_header_group}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{`${this.t('topic')}`}</Text>
                </View>
                <View style={styles.line} />
                {topicItem}
            </View>
        )
    }

    renderImage(imgList) {
        return (
            <View style={{ marginTop: 8, backgroundColor: '#fff' }}>
                <View style={styles.view_header_group}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{`${this.t('photo')}`}</Text>
                    <TouchableOpacity onPress={this.onViewAllImage}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_sub_title}>{this.t('view_all')}</Text>
                            <Image
                                style={styles.img_arrow_right}
                                source={this.getResources().ic_arrow_right}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.line} />
                <PhotoGridView source={imgList} />
            </View>
        )
    }

    renderAddPhoto() {
        if (this.isMember) {
            return (
                <Text allowFontScaling={global.isScaleFont} style={styles.txt_add_image}
                    onPress={this.addTraditionalImage}>{this.isMember ? `${this.t('add_photo')}` : ''}</Text>
            )
        }
        return null;
    }

    renderTraditional(totalImg, imgList = [], isShowInvite) {
        console.log('renderTraditional', this.isMember)
        if (totalImg > 0) {
            if (imgList.length > 6) {
                imgList = imgList.slice(0, 6);
            } else if (imgList.length < 6) {
                imgList = [...imgList, ...imgs.slice(imgList.length, imgs.length)];
            }
            let imgViews = imgList.map((img, index) => {
                if (img.img_path) {
                    return (
                        <TouchableOpacity onPress={this.onImgTraditionalPress.bind(this, img.id, index, img)}>
                            <Images
                                style={styles.img_item}
                                source={{
                                    uri: `${img.img_path}&type=small`,
                                }}
                                resizeMode={FastImage.resizeMode.contain}
                                indicator={Progress.Circle}
                            />
                        </TouchableOpacity>
                    )
                } else {
                    return (
                        <View style={styles.img_item} />
                    )
                }

            })
            return (
                <TouchableOpacity onPress={this.onOpenTraditionalRoom}>
                    <View style={[styles.view_introduce, styles.border_shadow]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{`${this.t('traditional_room')} (${totalImg})`}</Text>
                            {this.renderAddPhoto()}
                        </View>
                        <View style={styles.line} />
                        <View style={styles.view_traditional}>
                            {imgViews}
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
        return (
            <TouchableOpacity onPress={this.onOpenTraditionalRoom}>
                <View style={[styles.view_introduce, styles.border_shadow]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{`${this.t('traditional_room')} (${totalImg})`}</Text>
                        {this.renderAddPhoto()}
                    </View>
                    <View style={styles.line} />
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_img_empty}>{this.t('not_yet_image')}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {

        let {
            introContent,
            imgBackground,
            adminList,
            memberList,
            friendList,
            isShowInvite,
            topicList,
            imgList,
            moderatorList,
            secretGeneralList,
            totalTraditionalImg,
            traditionalImgList,
            invitePermission } = this.state;

        return (
            <View style={[styles.container, this.isIphoneX ? { paddingBottom: 15 } : {}]}>

                <View style={{ position: 'absolute', zIndex: 3, right: 0, left: 0 }}>
                    <HeaderView
                        title={this.clubName}
                        handleBackPress={this.onBackPress}
                    />
                </View>
                <HeaderView showBack={false} />

                <View style={{ flex: 1 }}>
                    <Animated.View style={{
                        transform: [{ translateY: this.tabY }],
                        backgroundColor: 'rgba(0,0,0,0)',
                        zIndex: 2,
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                    }}>
                        <Animated.View style={[{ opacity: this.imgOpacity }]}>
                            <ClbNavigatorHeader
                                ref={(refClbNavigatorHeader) => { this.refClbNavigatorHeader = refClbNavigatorHeader; }}
                                imgBackground={imgBackground}
                                isAdmin={this.isAdmin === 1 || this.isModerator === 1 || this.isGeneralSecretary === 1}
                                backgroundUpdate={this.backgroundUpdateCallback}
                                onChangeCoverImage={this.onChangeCoverImage}
                                {...this.props} />
                        </Animated.View>
                    </Animated.View>

                    <ScrollView
                        ref={(refScrollView) => { this.refScrollView = refScrollView; }}
                        contentContainerStyle={{ paddingTop: HOME_HEADER_HEIGHT }}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: this.nScroll } } }],
                        )}
                        scrollEventThrottle={16}>

                        {this.renderConfirmInvite(isShowInvite, invitePermission)}
                        {this.renderMemberGroup(adminList, secretGeneralList, memberList, friendList, moderatorList)}
                        <TouchableOpacity onPress={this.onCheckHandicapPress}>
                            <View style={[styles.touchable_check_handicap, styles.border_shadow]}>
                                <View style={styles.view_handicap}>
                                    <Text allowFontScaling={global.isScaleFont} style={{ color: '#ABABAB', fontSize: 13 }}>{this.t('handicap_title')}</Text>
                                </View>
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_check_handicap}>{this.t('check_handicap')}</Text>
                            </View>
                        </TouchableOpacity>

                        {this.renderEvent()}
                        {this.renderAdministratorBtn()}
                        {this.renderTraditional(totalTraditionalImg, traditionalImgList, isShowInvite)}
                        {this.renderIntroduceGroup(introContent)}
                        {/* {this.renderTopic(topicList)} */}
                        {/* {this.renderImage(imgList)} */}
                    </ScrollView>

                    {this.renderLoading()}
                </View>
                <PopupYesOrNo
                    ref={(refPopupYesOrNo) => { this.refPopupYesOrNo = refPopupYesOrNo; }}
                    content={''}
                    confirmText={this.t('agree')}
                    cancelText={this.t('cancel')}
                    onConfirmClick={this.onPopupConfirmClick} />

                <PopupAttachImage
                    ref={(popupAttachImage) => { this.popupAttachImage = popupAttachImage; }}
                    onTakePhotoClick={this.onTakePhotoClick}
                    onImportGalleryClick={this.onImportGalleryClick} />

                {this.renderMessageBar()}

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
        this.requestClubInfo();
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

    onCheckHandicapPress() {
        this.props.navigation.navigate('check_handicap_club_view', {
            clubId: this.clubId,
            clubName: this.clubName,
            isAdmin: this.isAdmin,
            isAccepted: this.isAccepted,
            isMember: this.isAccepted,
            invitation_id: this.invitation_id,
            totalMember: this.totalMember,
        })
    }

    onViewEventPress() {
        this.props.navigation.navigate('club_event_view', {
            'clubId': this.clubId,
            "isPersonal": false
        })
    }

    onViewAllMember() {
        this.props.navigation.navigate('club_member_list_view', { ...this.props.navigation.state.params })
    }

    onTopicItemPress(topic) {
        this.props.navigation.navigate('topic_discuss_club_view', {
            'topic': topic,
            ...this.props.navigation.state.params
        })
    }

    onManageClubPress() {
        this.props.navigation.navigate('admin_club_tab_navigator', {
            clubId: this.clubId,
            clubName: this.clubName,
            isAdmin: this.isAdmin,
            isAccepted: this.isAccepted,
            isMember: this.isAccepted,
            invitation_id: this.invitation_id,
            totalMember: this.totalMember,
        })
    }

    onUpdateClubInfoPress() {
        this.props.navigation.navigate('update_club_info_view', {
            clubId: this.clubId,
            clubName: this.clubName,
            logoUrl: this.logoUrl,
            introduce: this.state.introContent,
            updateCallback: this.onUpdateClubInfoCallback.bind(this)
        })
    }

    onOpenTraditionalRoom() {
        this.props.navigation.navigate('traditional_room_list', {
            clubId: this.clubId,
            isAddImage: false
            // clubName: this.clubName,
            // logoUrl: this.logoUrl,
            // introduce: this.state.introContent,
            // updateCallback: this.onUpdateClubInfoCallback.bind(this)
        });
    }

    addTraditionalImage() {
        this.props.navigation.navigate('traditional_room_list', {
            clubId: this.clubId,
            isAddImage: true,
            // clubName: this.clubName,
            // logoUrl: this.logoUrl,
            // introduce: this.state.introContent,
            updateCallback: this.onRefreshScreen.bind(this)
        });
    }

    onImgTraditionalPress(id, index, imgObj) {
        console.log('onImgTraditionalPress', id, index, imgObj, this.state.traditionalImgList)
        // this.props.navigation.navigate('traditional_detail_view', {
        //     eventProps: null,
        //     eventId: id,
        //     clubId: this.clubId,
        // })
        this.props.navigation.navigate('traditional_image_slide', {
            'imgObj': imgObj,
            'index': index,
            'clubId': this.clubId,
            'imgList': this.state.traditionalImgList
        })
    }

    onRefreshScreen() {
        this.requestClubInfo();
    }

    onUpdateClubInfoCallback(introContent, logoUri) {
        console.log('onUpdateClubInfoCallback', logoUri)
        this.setState({
            introContent: introContent
        }, () => {
            this.logoUrl = logoUri;
            let { params } = this.props.navigation.state;
            if (params.refreshCallback) {
                params.refreshCallback(this.clubId, logoUri);
            }
        })
    }

    onViewAllImage() {

    }

    requestClubInfo() {
        if (this.loading)
            this.loading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.get_club_info(this.clubId);
        console.log('url', url);
        Networking.httpRequestGet(url, this.onClubInfoResponse.bind(this), () => {
            //time out
            if (self.loading)
                self.loading.hideLoading();
            self.showErrorMsg(self.t('time_out'))
        });
    }

    onClubInfoResponse(jsonData) {
        if (this.loading)
            this.loading.hideLoading();

        this.model = new ClubInfoModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            let permissionClub = this.model.getPermissionClub();
            let isAccepted = 1;
            if (permissionClub) {
                this.isAdmin = permissionClub.is_user_admin;
                this.isGeneralSecretary = permissionClub.is_general_secretary;
                this.isModerator = permissionClub.is_moderator;
                isAccepted = permissionClub.is_accepted;
                this.isMember = permissionClub.is_accepted === 1;
            }
            this.totalMember = this.model.getTotalMember();

            this.setState({
                introContent: this.model.getAbout(),
                imgBackground: this.model.getImgBackground(),
                adminList: this.model.getAdminList(),
                memberList: this.model.getMemberList(),
                friendList: this.model.getFriendList(),
                topicList: this.model.getTopicList(),
                imgList: this.model.getImgList(),
                moderatorList: this.model.getModeratorList(),
                secretGeneralList: this.model.getSecretaryGeneralList(),
                totalTraditionalImg: this.model.getTotalTraditionalImg(),
                traditionalImgList: this.model.getTraditionalImgList(),
                invitePermission: this.model.getInvitePermissionClub(),
                isShowInvite: isAccepted === 1
            }, () => {
                console.log('invitePermission.model', this.state.invitePermission)
                this.refClbNavigatorHeader.setImageCover(this.model.getImgBackground());
            })
        } else {
            this.showErrorMsg(jsonData['error_msg']);
        }

    }

    onAcceptInviteClick() {
        let type = 1;
        this.refPopupYesOrNo.setContent(this.t('join_club_confirm'), type);
    }

    onRejectInviteClick() {
        let type = 0;
        this.refPopupYesOrNo.setContent(this.t('out_of_club_confirm'), type);
    }

    onAcceptInvitePermissionClick() {
        let {
            invitePermission
        } = this.state;
        if (invitePermission) {
            let type = 2;
            this.refPopupYesOrNo.setContent(invitePermission.invented_permission_type === 2 ? this.t('invited_secretary_general_confirm').format(this.clubName) : this.t('invited_moderator_club_confirm').format(this.clubName), type);
        }
    }

    onRejectInvitePermissionClick() {
        let {
            invitePermission
        } = this.state;
        let type = 3;
        this.refPopupYesOrNo.setContent(invitePermission.invented_permission_type === 1 ? this.t('invited_secretary_general_reject').format(this.clubName) : this.t('invited_moderator_club_reject').format(this.clubName), type);
    }

    onPopupConfirmClick(type) {
        if (type === 0) {
            this.requestRefuseJoinClub();
        } else if (type === 1) {
            this.requestAcceptJoinClub();
        } else if (type === 2) {
            this.requestAcceptPermissionClub();
        } else if (type === 3) {
            this.requestRefusePermissionClub();
        }
    }

    requestAcceptJoinClub() {
        let url = this.getConfig().getBaseUrl() + ApiService.club_accept_invitation(this.invitation_id);
        let self = this;
        if (this.loading)
            this.loading.showLoading();
        Networking.httpRequestGet(url, (jsonData) => {
            self.loading.hideLoading();
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    this.isMember = true;
                    self.setState({
                        isShowInvite: true
                    })
                } else {
                    self.showErrorMsg(jsonData['error_msg']);
                }
            }
        }, () => {
            //time out
            if (self.loading)
                self.loading.hideLoading();
            // self.popupTimeOut.showPopup();
        })
    }

    requestRefuseJoinClub() {
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.club_deni_invite(this.invitation_id);
        if (this.loading)
            this.loading.showLoading();
        Networking.httpRequestGet(url, (jsonData) => {
            self.loading.hideLoading();
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    self.onBackPress();
                    let { params } = self.props.navigation.state;
                    if (params.callback) {
                        params.callback(this.clubId);
                    }
                } else {
                    self.showErrorMsg(jsonData['error_msg']);
                }
            }
        }, () => {
            //time out
            if (self.loading)
                self.loading.hideLoading();
        });
    }

    requestAcceptPermissionClub() {
        let url = this.getConfig().getBaseUrl() + ApiService.club_accept_upgrade_permission(this.clubId);
        console.log('url', url)
        let self = this;
        if (this.loading)
            this.loading.showLoading();
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('requestParticipateClub', jsonData)
            if (self.loading)
                self.loading.hideLoading();
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    this.isGeneralSecretary = 1;
                    self.setState({
                        invitePermission: ''
                    })
                } else {
                    self.showErrorMsg(jsonData['error_msg']);
                }
            }
        }, () => {
            //time out
            if (self.loading)
                self.loading.hideLoading();
        })
    }

    requestRefusePermissionClub() {
        let url = this.getConfig().getBaseUrl() + ApiService.club_reject_upgrade_permission(this.clubId);
        let self = this;
        if (this.loading)
            this.loading.showLoading();
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('requestParticipateClub', jsonData)
            if (self.loading)
                self.loading.hideLoading();
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    self.setState({
                        invitePermission: ''
                    })
                } else {
                    self.showErrorMsg(jsonData['error_msg']);
                }
            }
        }, () => {
            //time out
            if (self.loading)
                self.loading.hideLoading();
        })
    }

    onChangeCoverImage() {
        this.popupAttachImage.show();
    }

    onTakePhotoClick = async (index) => {
        let imageUri = await this.getAppUtil().onTakePhotoClick(false);
        if (!imageUri.didCancel) {
            this.getAppUtil().resizeImage(imageUri.path, imageUri.width, imageUri.height, imageUri.size)
                .then(({ uri }) => {
                    console.log('uri', uri);
                    this.refClbNavigatorHeader.requestUploadImage(uri, this.clubId);
                })
                .catch(err => {
                    console.log(err);
                    this.refClbNavigatorHeader.requestUploadImage(imageUri, this.clubId);
                });

        }

    }

    onImportGalleryClick = async (index) => {
        let imageUri = await this.getAppUtil().onImportGalleryClick(false);
        console.log('imageUri', imageUri.path, index);
        if (!imageUri.didCancel) {
            this.getAppUtil().resizeImage(imageUri.path, imageUri.width, imageUri.height, imageUri.size)
                .then(({ uri }) => {
                    console.log('uri', uri);
                    this.refClbNavigatorHeader.requestUploadImage(uri, this.clubId);
                })
                .catch(err => {
                    console.log(err);
                    this.refClbNavigatorHeader.requestUploadImage(imageUri, this.clubId);
                });
        }
    }

    backgroundUpdateCallback(imagePath) {
        // let { params } = this.props.navigation.state;
        // if (params.callback) {
        //     params.callback(this.clubId, imagePath);
        // }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // minHeight: screenHeight - 50,
    },
    icon_menu_style: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
    view_introduce: {
        backgroundColor: '#fff',
        marginTop: scale(5),
        marginBottom: scale(10),
    },
    view_introduce_title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    touchable_edit: {
        paddingTop: scale(10),
        paddingBottom: scale(10),
        paddingRight: scale(10),
        paddingLeft: scale(20),
    },
    img_edit: {
        width: scale(17),
        height: scale(17),
        resizeMode: 'contain',
        tintColor: '#A5A5A5'
    },
    txt_title: {
        color: '#000',
        fontSize: fontSize(15),
        fontWeight: 'bold',
        padding: 10
    },
    line: {
        height: 0.8,
        backgroundColor: '#D6D4D4'
    },
    txt_content: {
        color: '#757575',
        fontSize: 15,
        padding: 10
    },
    view_group: {
        backgroundColor: '#fff',
        marginTop: scale(20),
    },
    view_header_group: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    txt_sub_title: {
        color: '#8B8B8B',
        fontSize: 15,
        paddingLeft: scale(10),
        paddingTop: scale(10),
        paddingRight: scale(10),
        paddingBottom: scale(0),
    },
    img_arrow_right: {
        height: 15,
        width: 15,
        resizeMode: 'contain',
        tintColor: '#8B8B8B',
        marginRight: scale(10),
        marginTop: scale(5)
    },
    view_ls_member: {
        flexDirection: 'row',
        padding: scale(10)
    },
    txt_admin_title: {
        color: '#292929',
        fontSize: 13,
        paddingLeft: scale(10),
        paddingTop: scale(0),
        paddingRight: scale(10),
        paddingBottom: scale(10),
    },
    txt_member_title: {
        color: '#292929',
        fontSize: 13,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5
    },
    touchable_check_handicap: {
        alignItems: 'center',
        backgroundColor: '#fff',
        marginTop: scale(5),
        flexDirection: 'row',
        paddingTop: 8,
        paddingBottom: 8
    },
    txt_check_handicap: {
        color: '#373737',
        fontSize: 15,
        paddingTop: 10,
        paddingBottom: 10
    },
    view_add_event: {
        flexDirection: 'row',
        marginTop: scale(5),
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingBottom: 8,
        paddingTop: 8,
        paddingLeft: 10
    },
    img_add_event: {
        width: 36,
        height: 30,
        resizeMode: 'contain',
        marginRight: 10,
        tintColor: '#ABABAB'
    },
    txt_member_more: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_member_more: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#000',
        opacity: 0.5
    },
    view_handicap: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderColor: '#ABABAB',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 10,
        marginRight: 10
    },
    view_topic_item: {
        flexDirection: 'row',
        minHeight: 50,
        backgroundColor: '#fff',
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'center'
    },
    img_topic: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
    txt_topic: {
        color: '#373737',
        fontSize: 17
    },
    txt_topic_count: {
        color: '#999999',
        fontSize: 15
    },
    border_shadow: {
        elevation: 4,
        shadowOffset: { width: 0, height: -3 },
        shadowColor: "grey",
        shadowOpacity: 1,
        shadowRadius: scale(8),
        borderRadius: scale(8),
        margin: 10
    },
    view_traditional: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: scale(10),
        justifyContent: 'space-between'
    },
    img_item: {
        width: imgWidth,
        height: imgWidth,
        resizeMode: 'center'
    },
    txt_img_empty: {
        fontSize: fontSize(15),
        color: '#757575',
        textAlign: 'center',
        marginTop: scale(5),
        marginBottom: scale(5)
    },
    txt_add_image: {
        color: '#00ABA7',
        fontSize: fontSize(15),
        padding: scale(10)
    }
});