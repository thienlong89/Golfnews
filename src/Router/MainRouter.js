import React from 'react';
import { StackNavigator } from 'react-navigation';
import {
    Platform,
    View
} from 'react-native';

import AppScene from '../Scenes/AppScene';
import MenuView from '../Components/Menu/MenuView';
import LeaderBoardView from '../Components/LeaderBoard/LeaderBoardView';
import FlightHistoryView from '../Components/History/FlightHistoryView';
import FlightHistoryNavigatorOtherView from '../Components/History/FlightHistoreNavigatorOther';
import FlightHistoryNavigatorView from '../Components/History/FlightHistoryNavigator';
import PlayerInfoView from '../Components/PlayerInfo/PlayerInfoView';
import ClubDetailView from '../Components/CLB/CLBDetailView';
import EnterFlightInfoView from '../Components/CreateFlight/EnterFlightInfoView';
import EnterFlightScoreView from '../Components/CreateFlight/EnterFlightScoreView';
import PersionalInformationView from '../Components/Users/PersonalInformationView';
import ScorecardView from '../Components/CreateFlight/Scorecard/ScorecardView';
import SettingAppView from '../Components/Menu/SettingAppView';
import BlockFriendView from '../Components/BlockFriend/BlockFriendView';
import SearchUserView from '../Components/CreateFlight/SearchUserView';
import ReportErrorFacilityView from '../Components/Menu/ReportErrorInfoFacilityView';
import PaymentView from '../Components/Payment/PaymentView';
import ContactView from '../Components/Menu/ContactView';
import SysHandicapView from '../Components/Menu/SynHandicapView';
import ChangeTeeView from '../Components/CreateFlight/ChangeTeeView';
import NewsView from '../Components/News/NewsView';
import NewsDetailView from '../Components/News/NewsDetailView';
import StatisticalView from '../Components/Statistical/StatisticalView';
import CertificateView from '../Components/Certificate/CertificateView';
import ShowScorecardImage from '../Components/CreateFlight/ShowScorecardImage';
import UploadFlightImage from '../Components/CreateFlight/EnterScore/UploadFlightImage';
import FLightSuggestedView from '../Components/CreateFlight/FLightSuggestedView'

import EventView from '../Components/Events/EventView';
import EventDetailMemberView from '../Components/Events/EventDetailView';
import EventCreateView from '../Components/Events/EventCreateView';
import BaseComponent from '../Core/View/BaseComponent';
import GolfLawAndConditions from '../Components/GolfLawAndConditions/GolfLawAndConditionsView';
import TermConditionGroupView from '../Components/GolfLawAndConditions/TermConditionGroupView';
import TermConditionDetailView from '../Components/GolfLawAndConditions/TermConditionDetailView';
import QAView from '../Components/QA/QAClientView';
import ReportUserView from '../Components/ReportUsers/ReportUserView';
import PropsStatic from '../Constant/PropsStatic';
import StatisticalOtherView from '../Components/Statistical/StatisticalOtherUserView';
import ViewAvatarHD from '../Components/PlayerInfo/ViewAvatarHD';
import CertificateUserOtherView from '../Components/Certificate/CertificateUserOtherView';
import HandicapInfoView from '../Components/Home/HandicapIndexInfoView';
import ReportNewFacilityView from '../Components/Reports/ReportNewFacilityView';
import EventDetailAdminView from '../Components/Events/EventDetailHostView';
import EventShareView from '../Components/Events/EventShareView';
import GolfCourseMap from '../Components/CreateFlight/Map/GolfCourseMap';
import FCM, { FCMEvent } from "react-native-fcm";//RemoteNotificationResult, WillPresentNotificationResult, NotificationType, NotificationActionType, NotificationActionOption, NotificationCategoryOption
import PushFirebaseItem from '../Components/PushNotification/PushFirebaseItem';
import CommentFlightView from '../Components/Social/CommentFlightView';
import Touchable from 'react-native-platform-touchable';
import ChatManager from '../Components/Chats/ChatManagerView';
import ListChatView from '../Components/Chats/ListChats/Screen/ListChatScreen';
import CreatePosts from '../Components/Posts/CreatePostsNew';
import ClubInfoTabScreen from '../Components/CLB/ClubInfoTabScreen';
import PostStatusView from '../Components/Social/PostStatusView';
import ChatGlobalView from '../Components/Chats/ChatGlobalView';
import CommentClubView from '../Components/Social/CommentClubView';
import IntroduceClubView from '../Components/CLB/IntroduceClubView';
import ClubCheckHandicapView from '../Components/CLB/ClubCheckHandicapView';
import ClubMemberListView from '../Components/CLB/ClubMemberListView';
import ClubEventView from '../Components/CLB/Event/ClubEventView';
import ClubCreateEventView from '../Components/CLB/Event/ClubCreateEventView';
import ChatGroupView from '../Components/Chats/ChatGroup/ChatGroupView';
import ClubEventDetailView from '../Components/CLB/Event/ClubEventDetailView';
import CreateNewGroupChat from '../Components/Chats/ChatGroup/CreateNewGroupChat';
import CreateFlightToJoin from '../Components/Friends/Screens/CreateFlightToJoin';
import NotifycationView from '../Components/Notification/NotifyAndNewsView';
import AwardView from '../Components/Awards/AwardView';
import AddMemberListView from '../Components/CLB/Screens/AddMemberListView';
import ClubShareView from '../Components/CLB/ClubShareView';
import ClubEventCommentView from '../Components/CLB/Event/ClubEventCommentView';
import TopicDiscussClubView from '../Components/CLB/Screens/TopicDiscussClubView';
import ClubEventShareView from '../Components/CLB/Event/ClubEventShareView';
import GroupDetailView from '../Components/Groups/GroupDetailView';
import GroupShareView from '../Components/Groups/GroupShareView';
import GroupInfoView from '../Components/Groups/GroupInfoView';
import GroupAddMemberView from '../Components/Groups/GroupAddMemberView';
import PlayerDetailInfoView from '../Components/PlayerInfo/PlayerDetailInfoView';
import { fromLeft, fadeIn } from 'react-navigation-transitions';
import PieChartView from '../Components/Charts/PieChartView';
import CircelChartView from '../Components/Charts/CircleChartView';
import AreaChartView from '../Components/Charts/AreaChartView';
import PlayerAchievementView from '../Components/PlayerInfo/PlayerAchievementView';
import UpdateCertificateView from '../Components/Certificate/UpdateCertificateView';
import CommentDiscussionView from '../Components/CLB/Comments/CommentDiscussionView';
import ClubCreateView from '../Components/CLB/ClubCreateView';
import FacilityView from '../Components/Facilities/FacilityNavigatorView';
import ReviewFacilityView from '../Components/Facilities/Reviews/ReviewFacilityView';
import CountryCodeListView from '../Components/Logins/CountryCodeListView';
import SmartChatView from '../Components/Chats/SmartChat/SmartChatView';
import EnterContentMessageView from '../Components/Chats/SmartChat/EnterContentMessageView';
import ComparePerformance from '../Components/Performance/ComparePerformance';
import LanguageListView from '../Components/Logins/LanguageListView';
import SelectCourseView from '../Components/CreateFlight/SelectCourseView';
import SearchCourseView from '../Components/Home/SearchCourseView';
import ShowListCountry from '../Components/Common/ShowListCountry';
import ShowListCity from '../Components/Common/ShowListCity';
import ShowListCountryState from '../Components/Common/ShowListCountryState';
import ImageCommentFlight from '../Components/Social/ImageCommentFlight';
import AddAdminClubView from '../Components/CLB/Screens/AddAdminClubView';
import InteractiveTabView from '../Components/Social/InteractiveTabView';
import LeaderboardSearchView from '../Components/LeaderBoard/LeaderboardSearchView';
import AdminClubTabNavigator from '../Components/CLB/Administrator/AdminClubTabNavigator';
import MemberProfileNavigator from '../Components/CLB/Administrator/MemberProfileNavigator';
import SearchUserChatView from '../Components/Chats/SearchUserChatView';
import ChatListMemberView from '../Components/Chats/ChatListMemberView';
import AdminListMemberView from '../Components/CLB/Administrator/AdminListMemberView';
import GroupCreateView from '../Components/Groups/GroupCreateView';
import ChatGroupInfoView from '../Components/Chats/ChatGroup/ChatGroupInfoView';
import UpdateClubInfoView from '../Components/CLB/Administrator/UpdateClubInfoView';
import GroupAddPlayerView from '../Components/Groups/GroupAddPlayerView';
import GroupAddAdminView from '../Components/Groups/GroupAddAdminView';
import RecentHandicapInfoView from '../Components/Home/RecentHandicapInfoView';
import FriendScreen from '../Components/Friends/Screens/FriendScreen';
import CreateTournamentsView from '../Components/Tournaments/CreateTournamentsView';
import SearchFacilityView from '../Components/Common/SearchFacilityView';
import TournamentDetailView from '../Components/Tournaments/TournamentDetailView';
import SearchUserCreateFlight from '../Components/CreateFlight/SearchUserCreateFlight';
import BenefitsVipMember from '../Components/Home/BenefitsVipMember';
import SearchEverythingView from '../Components/Home/SearchEverythingView';
import TraditionalRoomList from '../Components/CLB/Traditionals/TraditionalRoomList';
import TraditionalDetailView from '../Components/CLB/Traditionals/TraditionalDetailView';
import ChatSearchUserView from '../Components/Chats/ChatSearchUserView';
import ChatInternalView from '../Components/Chats/ChatCSKH/ChatInternalView';
import SearchByFilterView from '../Components/Home/SearchByFilterView';
import ShowWebViewContent from '../Components/Tournaments/ShowWebViewContent';
import BaseCommentFlightView from '../Components/Comments/BaseCommentFlightView';
import FlightListAddImageView from '../Components/Home/FlightListAddImageView';
import SearchCourseFacilityView from '../Components/Facilities/Reviews/SearchCourseFacilityView';
import ImageCommentFlightView from '../Components/Home/ImageCommentFlightView';
import ShowImageSlideView from '../Components/Common/ShowImageSlideView';
import ImageCommentFlightSlide from '../Components/Social/ImageCommentFlightSlide';
import TraditionalImageSlide from '../Components/CLB/Traditionals/TraditionalImageSlide';
import ChatPrivateComponent from '../Components/Chats/ChatManager/ChatPrivateComponent';
import ChatGroupComponent from '../Components/Chats/ChatManager/ChatGroupComponent';
import ChatClubComponent from '../Components/Chats/ChatManager/ChatClubComponent';
import ChatCSKHComponent from '../Components/Chats/ChatManager/ChatCSKHComponent';

const { notification } = require('../Services/NotificationManager');

//require('../Components/Chats/Socket');//create new socket client

const PUSH_FIREBASE_TAG = {
    ENTER_SCORECARD: 'ENTER_SCORECARD',
    VERIFY: 'VERIFY',
    CONFIRMED_ACCEPT_SCORECARD: 'CONFIRMED_ACCEPT_SCORECARD',
    CONFIRMED_REJECT_SCORECARD: 'CONFIRMED_REJECT_SCORECARD',
    INVITE_FRIEND: 'INVITE_FRIEND',
    CREATE_FLIGHT_FROM_SCORECARD_IMAGE: "CREATE_FLIGHT_FROM_SCORECARD_IMAGE",
    ADD_MEMBER_TO_CLUB: 'ADD_MEMBER_TO_CLUB'
}

const AppStack = StackNavigator(
    {
        home_screen: {
            screen: AppScene
        },
        main_menu: {
            screen: MenuView
        },
        leaderboard: {
            screen: LeaderBoardView
        },
        flight_history: {
            screen: FlightHistoryView
        },
        flight_history_other: {
            screen: FlightHistoryNavigatorOtherView
        },
        flight_history_navigator_view: {
            screen: FlightHistoryNavigatorView
        },
        player_info: {
            screen: PlayerInfoView
        },
        club_detail_view: {
            screen: ClubDetailView
        },
        enter_flight_info_view: {
            screen: EnterFlightInfoView
        },
        enter_flight_score_view: {
            screen: EnterFlightScoreView
        },
        persional_information: {
            screen: PersionalInformationView
        },
        scorecard_view: {
            screen: ScorecardView
        },
        setting_app: {
            screen: SettingAppView
        },
        block_friend_view: {
            screen: BlockFriendView
        },
        search_user_view: {
            screen: SearchUserView
        },
        report_error_facility: {
            screen: ReportErrorFacilityView
        },
        payment: {
            screen: PaymentView
        },
        contact: {
            screen: ContactView
        },
        sys_handicap: {
            screen: SysHandicapView
        },
        change_tee_view: {
            screen: ChangeTeeView
        },
        news: {
            screen: NewsView
        },
        news_detail: {
            screen: NewsDetailView
        },
        statistical: {
            screen: StatisticalView
        },
        statistical_other: {
            screen: StatisticalOtherView
        },
        certificate: {
            screen: CertificateView
        },
        show_scorecard_image: {
            screen: ShowScorecardImage
        },
        upload_flight_image: {
            screen: UploadFlightImage
        },
        event: {
            screen: EventView
        },
        event_detail_member: {
            screen: EventDetailMemberView
        },
        event_detail_admin: {
            screen: EventDetailAdminView
        },
        event_create: {
            screen: EventCreateView
        },
        flight_suggested_view: {
            screen: FLightSuggestedView
        },
        golflaw_condition: {
            screen: GolfLawAndConditions
        },
        term_condition_group_view: {
            screen: TermConditionGroupView
        },
        term_condition_detail: {
            screen: TermConditionDetailView
        },
        q_a_view: {
            screen: QAView
        },
        report_user: {
            screen: ReportUserView
        },
        view_avatar_hd: {
            screen: ViewAvatarHD
        },
        certificate_user_other: {
            screen: CertificateUserOtherView
        },
        handicap_info: {
            screen: HandicapInfoView
        },
        report_new_facility: {
            screen: ReportNewFacilityView
        },
        event_share: {
            screen: EventShareView
        },
        golf_course_map: {
            screen: GolfCourseMap
        },
        comment_flight_view: {
            screen: CommentFlightView
        },
        chat_private: {
            screen: ChatPrivateComponent//ChatManager
        },
        list_chat: {
            screen: ListChatView
        },
        create_posts: {
            screen: CreatePosts
        },
        club_info_tab_screen: {
            screen: ClubInfoTabScreen
        },
        post_status_screen: {
            screen: PostStatusView
        },
        global_chat: {
            screen: ChatGlobalView
        },
        comment_club_view: {
            screen: CommentClubView
        },
        introduce_club_view: {
            screen: IntroduceClubView
        },
        check_handicap_club_view: {
            screen: ClubCheckHandicapView
        },
        club_member_list_view: {
            screen: ClubMemberListView
        },
        club_event_view: {
            screen: ClubEventView
        },
        club_create_event_view: {
            screen: ClubCreateEventView
        },
        group_chat: {
            screen: ChatGroupView
        },
        club_event_detail_view: {
            screen: ClubEventDetailView
        },
        create_new_group_chat: {
            screen: CreateNewGroupChat
        },
        create_flight_to_join: {
            screen: CreateFlightToJoin
        },
        notification_view: {
            screen: NotifycationView
        },
        award_view: {
            screen: AwardView
        },
        add_member_listview: {
            screen: AddMemberListView
        },
        club_share_view: {
            screen: ClubShareView
        },
        club_event_comment_view: {
            screen: ClubEventCommentView
        },
        topic_discuss_club_view: {
            screen: TopicDiscussClubView
        },
        club_event_share_view: {
            screen: ClubEventShareView
        },
        group_detail: {
            screen: GroupDetailView
        },
        group_share_view: {
            screen: GroupShareView
        },
        group_info_view: {
            screen: GroupInfoView
        },
        group_add_member_view: {
            screen: GroupAddMemberView
        },
        player_detail_info_view: {
            screen: PlayerDetailInfoView
        },
        chart: {
            screen: AreaChartView
        },
        player_achievement_view: {
            screen: PlayerAchievementView
        },
        update_certificate_view: {
            screen: UpdateCertificateView
        },
        comment_dicussion: {
            screen: CommentDiscussionView
        },
        club_create_view: {
            screen: ClubCreateView
        },
        facility_view : {
            screen : FacilityView
        },
        review_facility : {
            screen : ReviewFacilityView
        },
        country_code_screen: {
            screen: CountryCodeListView
        },
        smart_chat : {
            screen : SmartChatView
        },
        enter_smart_msg : {
            screen : EnterContentMessageView
        },
        compare_performance : {
            screen : ComparePerformance
        },
        language_list : {
            screen : LanguageListView
        },
        select_course_view : {
            screen : SelectCourseView
        },
        search_course_view :{
            screen : SearchCourseView
        },
        show_list_country :{
            screen : ShowListCountry
        },
        show_list_city :{
            screen : ShowListCity
        },
        show_list_country_state :{
            screen : ShowListCountryState
        },
        image_comment_flight :{
            screen : ImageCommentFlight
        },
        add_admin_club_view :{
            screen : AddAdminClubView
        },
        interactive_tab_view :{
            screen : InteractiveTabView
        },
        leaderboard_search : {
            screen : LeaderboardSearchView
        },
        admin_club_tab_navigator : {
            screen : AdminClubTabNavigator
        },
        member_profile_navigator : {
            screen : MemberProfileNavigator
        },
        search_user_chat_view : {
            screen : SearchUserChatView
        },
        group_chat_list_member : {
            screen : ChatListMemberView
        },
        admin_list_member_view : {
            screen : AdminListMemberView
        },
        group_create_view : {
            screen : GroupCreateView
        },
        group_chat_info : {
            screen : ChatGroupInfoView
        },
        update_club_info_view : {
            screen : UpdateClubInfoView
        },
        group_add_player_view : {
            screen : GroupAddPlayerView
        },
        group_add_admin_view : {
            screen : GroupAddAdminView
        },
        recent_handicap_info_view : {
            screen : RecentHandicapInfoView
        },
        friend_screen : {
            screen : FriendScreen
        },
        create_tournaments_view : {
            screen : CreateTournamentsView
        },
        search_facility_view : {
            screen : SearchFacilityView
        },
        tournament_detail_view : {
            screen : TournamentDetailView
        },
        search_user_create_flight : {
            screen : SearchUserCreateFlight
        },
        benefits_vip_member : {
            screen : BenefitsVipMember
        },
        search_everything_view : {
            screen : SearchEverythingView
        },
        traditional_room_list : {
            screen : TraditionalRoomList
        },
        traditional_detail_view : {
            screen : TraditionalDetailView
        },
        chat_search_user : {
            screen : ChatSearchUserView
        },
        chat_internal_view : {
            screen : ChatCSKHComponent
        },
        search_by_filter_view : {
            screen : SearchByFilterView
        },
        show_web_view_content : {
            screen : ShowWebViewContent
        },
        base_comment_flight_view : {
            screen : BaseCommentFlightView
        },
        flight_list_add_image_view : {
            screen : FlightListAddImageView
        },
        search_facility_course_view : {
            screen : SearchCourseFacilityView
        },
        image_comment_flight_view : {
            screen : ImageCommentFlightView
        },
        show_image_slide_view : {
            screen : ShowImageSlideView
        },
        image_comment_flight_slide : {
            screen : ImageCommentFlightSlide
        },
        traditional_image_slide : {
            screen : TraditionalImageSlide
        },
        chat_group : {
            screen : ChatGroupComponent
        },
        chat_club : {
            screen : ChatClubComponent
        }
    },
    {
        navigationOptions: {
            header: null
        },
        initialRouteName: 'home_screen',
        transitionConfig: () => fromLeft()
    },
    /*
    {
        initialRouteName: 'home_screen'
    }
    */
);

export default class AppStackView extends BaseComponent {
    constructor(props) {
        super(props);
        notification.initListingNotification(this.onReceiveItem.bind(this));
    }

    /**
     * Hứng khi có thông báo bắn về
     */
    onReceiveItem(notify) {
        console.log("vua co thong bao ban ve : ", notify);
    }

    componentDidMount() {
        // console.log("app props",this.props);
        this.registerNotificationFirebase();
        FCM.getInitialNotification().then(async notif => {
            //console.log("notifycation 2 : ", notif, JSON.stringify(notif));
        });
        PropsStatic.setNavigator(this.props.navigation);
    }

    showPushMsg(title, msg) {
        if (this.pushFirebaseItem) {
            this.pushFirebaseItem.showMsg(title, msg);
        }
    }

    registerNotificationFirebase() {
        this.Logger().log("Dang ky nhan firebase thanh cong !");
        let self = this;
        FCM.on(FCMEvent.Notification, async notif => {
            this.Logger().log("Notification ---------------------- Firebase", notif);

            let fcm = Platform.OS === 'android' ? notif.fcm : notif.notification;
            if (!fcm || !Object.keys(fcm).length) { return; }
            let tag = fcm.tag;
            let title = fcm.title;
            global.change_notify = true;
            this.Logger().log("tag title : ", tag, title);
            this.Logger().log("registerNotificationFirebase: ", fcm);
            
            if(tag.toLowerCase().indexOf('chat_') >= 0) return;//khong hien thi notifi chat

            if (tag === PUSH_FIREBASE_TAG.INVITE_FRIEND) {
                let msg = self.t('player_send_invite').format(notif.fullname);
                this.Logger().log("msg : ", msg);
                self.showPushMsg(title, msg);
            } else if (tag === PUSH_FIREBASE_TAG.ENTER_SCORECARD) {
                global.isNewNotifyReceived = true;
                let msg = self.t('player_invite_enter_score').format(notif.fullname, notif.flight_name);
                self.showPushMsg(title, msg);
            } else if (tag === PUSH_FIREBASE_TAG.VERIFY) {
                global.isNewNotifyReceived = true;
                let msg = self.t('player_verify').format(notif.fullname, notif.flight_name);
                self.showPushMsg(title, msg);
            } else if (tag === PUSH_FIREBASE_TAG.CONFIRMED_ACCEPT_SCORECARD) {
                global.isNewNotifyReceived = true;
                let msg = self.t('player_accept_scorecard').format(notif.fullname, notif.flight_name);
                self.showPushMsg(title, msg);
            } else if (tag === PUSH_FIREBASE_TAG.CONFIRMED_REJECT_SCORECARD) {
                global.isNewNotifyReceived = true;
                let msg = self.t('player_reject_scorecard').format(notif.fullname, notif.flight_name);
                self.showPushMsg(title, msg);
            } else if (tag === PUSH_FIREBASE_TAG.CREATE_FLIGHT_FROM_SCORECARD_IMAGE) {
                global.isNewNotifyReceived = true;
                // let msg = self.t('player_accept_scorecard').format(notif.fullname,notif.flight_name);
                // self.showPushMsg(title,msg);
            } else if (tag === PUSH_FIREBASE_TAG.ADD_MEMBER_TO_CLUB) {
                global.isNewNotifyReceived = true;
                let msg = self.t('add_member_club').format(notif.fullname, notif.clubName);
                self.showPushMsg(title, msg);
            } else {
                global.isNewNotifyReceived = true;
                // let msg = self.t('add_member_club').format(notif.fullname,'');
                self.showPushMsg(title, fcm.body);
            }

            // if (Platform.OS === 'ios' && notif._notificationType === NotificationType.WillPresent && !notif.local_notification) {
            //     // this notification is only to decide if you want to show the notification when user if in foreground.
            //     // usually you can ignore it. just decide to show or not.
            //     notif.finish(WillPresentNotificationResult.All)
            //     return;
            // }

            // if (notif.opened_from_tray) {
            //     if (notif.targetScreen === 'detail') {
            //         setTimeout(() => {
            //             navigation.navigate('Detail')
            //         }, 500)
            //     }
            //     setTimeout(() => {
            //         alert(`User tapped notification\n${JSON.stringify(notif)}`)
            //     }, 500)
            // }

            // if(Platform.OS ==='ios'){
            //         //optional
            //         //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
            //         //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
            //         //notif._notificationType is available for iOS platfrom
            //         switch(notif._notificationType){
            //           case NotificationType.Remote:
            //             notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
            //             break;
            //           case NotificationType.NotificationResponse:
            //             notif.finish();
            //             break;
            //           case NotificationType.WillPresent:
            //             notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
            //             // this type of notificaiton will be called only when you are in foreground.
            //             // if it is a remote notification, don't do any app logic here. Another notification callback will be triggered with type NotificationType.Remote
            //             break;
            //         }
            // }
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <AppStack screenProps={{ grandparentNavigation: this.props.navigation }} />
                <PushFirebaseItem ref={(pushFirebaseItem) => { this.pushFirebaseItem = pushFirebaseItem; }} />
                {/* <Touchable style={{width : 50,height : 50, position : 'absolute',right :10,bottom : 70}} onPress={this.onChatClick.bind(this)} >
                    <Image
                        style={{ position: 'absolute', width: 50, height: 50, right: 0, bottom: 0, resizeMode: 'contain' }}
                        source={this.getResources().icon_chat}
                    />
                </Touchable> */}
            </View>
        );
    }
}

