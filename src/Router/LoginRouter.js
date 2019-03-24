//import React from 'react';
import { StackNavigator } from 'react-navigation';
import {
    Animated,
    Easing
} from 'react-native'

import LoginView from '../Components/Logins/LoginView';
import LoginViewTest from '../Components/Logins/LoginViewTest';
import RegisterView from '../Components/Logins/RegisterView';
import VerifyOtpView from '../Components/Logins/VerifyOtpView';
import EnterNewPasswordView from '../Components/Logins/EnterNewPasswordView';
import AppStack from './MainRouter';
import SyncFacebookView from '../Components/Logins/SyncFacebookView';
import RecoverPasswordView from '../Components/Logins/RecoverPasswordView';
import SplashScreen from '../Components/Logins/SplashScreen';
import SelectLanguageView from '../Components/Logins/SelectLanguageView';
import LanguageListView from '../Components/Logins/LanguageListView';
import CountryCodeListView from '../Components/Logins/CountryCodeListView';
import EnterUserInfoView from '../Components/Logins/EnterUserInfoView';
import ChatManager from '../Components/Chats/ChatManagerView';

import ScorecardView from '../Components/CreateFlight/Scorecard/ScorecardView';
import EnterFlightScorePreview from '../Components/CreateFlight/EnterFlightScoreView';
import NotificationFriendScreen from '../Components/Previews/NotificationFriend';
import EventDetailView from '../Components/Previews/EventDetailPreview';
import GroupInfo from '../Components/Previews/GroupInfoPreview';
import ClubHomeView from '../Components/Previews/ClubHomePreview';
import ShowScorecardImage from '../Components/CreateFlight/ShowScorecardImage';
import EventShareView from '../Components/Events/EventShareView';
import ClubShareView from '../Components/CLB/ClubShareView';
import FriendFlightScorecard from '../Components/Previews/ScoreCardFriendPreview';
import SuggestFriendView from '../Components/Logins/SuggestFriendView';
import LeaderBoardView from '../Components/LeaderBoard/LeaderBoardView';
import { FluidNavigator } from 'react-navigation-fluid-transitions';
import {fromLeft} from 'react-navigation-transitions';

const transitionConfig = {
    duration: 500,
    timing: Animated.timing,
    easing: Easing.easing
  };

export const LoginStack = FluidNavigator(
    {
        splash_screen: {
            screen: SplashScreen
        },
        select_language_screen: {
            screen: SelectLanguageView
        },
        language_list_screen: {
            screen: LanguageListView
        },
        country_code_screen: {
            screen: CountryCodeListView
        },
        login_screen: {
            screen: LoginView
        },
        app_screen: {
            screen: AppStack
        },
        register_screen: {
            screen: RegisterView
        },
        verifyotp_screen: {
            screen: VerifyOtpView
        },
        enter_password_screen: {
            screen: EnterNewPasswordView
        },
        sync_facebook_screen: {
            screen: SyncFacebookView
        },
        recover_password_screen: {
            screen: RecoverPasswordView
        },
        update_user_info_screen: {
            screen: EnterUserInfoView
        },
        //=======================================Preview from screen notification=========================
        scorecard_view : {
           screen : ScorecardView 
        },

        enter_flight_show : {
            screen : EnterFlightScorePreview
        },

        notification_friend : {
            screen : NotificationFriendScreen
        },

        club_home_preview : {
            screen : ClubHomeView
        },

        group_detail_view : {
            screen : GroupInfo
        },

        event_detail : {
            screen : EventDetailView
        },

        show_scorecard_image : {
            screen : ShowScorecardImage
        },

        event_share : {
            screen : EventShareView
        },

        club_share : {
            screen : ClubShareView
        },
        friend_flight_scorecard : {
            screen : FriendFlightScorecard
        },
        chat_public : {
            screen : ChatManager
        },
        suggest_friend_view : {
            screen : SuggestFriendView
        },
        LeaderBoardView : {
            screen : LeaderBoardView
        }
        
    },
    {
        navigationOptions: {
            header: null
        },
        initialRouteName: 'splash_screen',

        transitionConfig,
        mode: 'card',
        // transitionConfig : ()=>fromLeft()
    }
    
);

