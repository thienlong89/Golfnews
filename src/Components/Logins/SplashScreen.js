import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    NetInfo,
    BackHandler,
    Image
} from 'react-native';//, NetInfo, BackHandler 

import BaseComponent from '../../Core/View/BaseComponent';
import DataManager from '../../Core/Manager/DataManager';
import Constant from '../../Constant/Constant';
// import Networking from '../../Networking/Networking';
// import { Video } from 'expo';
// import PopupNotifyView from '../Common/PopupNotifyView';
import UserInfo from '../../Config/UserInfo';
import arrayFromObject from '../Common/ArrayFromObject';
import cacheAssetsAsync from '../Common/CacheAssetsAsync';
import Files from '../Common/Files';

import FlightDetailModel from '../../Model/CreateFlight/Flight/FlightDetailModel';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
// import EventModel from '../../Model/Events/EventModel';
// import ProgressBarClassic from 'react-native-progress-bar-classic';
// import { AppLoading } from 'expo';
import SplashScreenNative from 'react-native-splash-screen'
import { verticalScale, scale, fontSize } from '../../Config/RatioScale';

const KEYS = [Constant.USER.USER_ID, Constant.USER.TOKEN, Constant.USER.USER_TYPE, Constant.CACHE_BASE_URL.LIST, Constant.CACHE_BASE_URL.MAIN];

/**
 * 
 * UNKNOW: 0,

   ACCEPT_VERIFY: 1,

   REJECT_VERIFY: 2,

   REJECT_ENTER_SCORE: 3,

   CONFIRMED_REJECT_SCORECARD: 4,

   CONFIRMED_ACCEPT_SCORECARD: 5,

   INVITE_ENTER_SCORE: 6,

   INVITE_VERIFY: 7,

   REQUEST_FRIEND: 9,

   CREATE_FLIGHT_FROM_SCORECARD_IMAGE: 10,

   ADD_MEMBER_TO_CLUB: 11,

   FRIEND_ADD_NEW_SCORE_CARD: 12,

   ADD_TO_GROUP: 13,

   ADD_TO_EVENT: 14,
 */

export default class SplashScreen extends BaseComponent {
    constructor(props) {
        super(props);
        this.videoLoadingFinish = false;
        this.assetsLoaded = false;
        this.state = {
            popup_notify_content: '',
            progress: 0,
            progressWithOnComplete: 0,
            progressCustomized: 0,
        }
        this.token = '';
        this.domainList = [];
        this.domain = '';


    }

    increase = (key, value) => {
        this.setState({
            [key]: this.state[key] + value,
        });
    }


    render() {

        //     const barWidth = Dimensions.get('screen').width - 120;
        //     const progressCustomStyles = {
        //       backgroundColor: '#fff', 
        //       borderRadius: 0,
        //       borderColor: 'orange',
        //     };

        //     return (
        //           <View style={styles.container}>
        //             <View style={styles.loadding}>
        //               <Text style={styles.label}>Đang cập nhật phiên bản mới nhất</Text>
        //               <ProgressBarAnimated
        //                 width={barWidth}
        //                 value={this.state.progress}
        //                 backgroundColor='#ef9d00'
        //                 backgroundColorOnComplete="#fff"
        //               />
        //             </View>
        //            </View> 
        //            // <AppLoading />
        // );
        const { width, height } = Dimensions.get('window');

        return (
            <View style={styles.container}>
                <Image
                    resizeMode="contain"
                    style={{ flex: 1, width: undefined, height: undefined }}
                    source={this.getResources().ic_bg_login}>
                </Image>

            </View>
        );
    }

    onLoadDoneVideo(data) {
        console.log("load done");
    }

    componentDidMount() {
        // this.props.navigation.replace('login_screen');
        // this.rotateToPortrait();

        // SplashScreenNative.hide();
        console.log("load done");

        this.addEventBack();
        this.addEventInternetConnection();

        NetInfo.addEventListener('connectionChange', this.onConnectionChange.bind(this));
        this.onCheckData();
        // this.getServerUrl();
        // this.loadAssetsAsync();
        DataManager.loadSingleLocalData(Constant.LANGUAGE, (language) => {

            if (language) {
                this.getUserInfo().setLang(language);
                this.setLanguage(language);
            } else {
                this.getUserInfo().setLang('vn');
                this.setLanguage('vn');
            }

        }, () => {
            this.getUserInfo().setLang('vn');
            this.setLanguage('vn');
        });
    }


    componentWillUnmount() {
        // NetInfo.removeEventListener('connectionChange', null);
    }

    getServerUrl() {
        Networking.httpRequestGet(this.getConfig().URL_IPS,
            (jsonData) => {
                console.log('checkServerUrl', jsonData)
                this.domainList = jsonData.servers;
                this.saveUrl(JSON.stringify(this.domainList));
                this.domain = this.domainList[0].domainbase;
                this.checkServer(this.domain);
            }, (err) => {
                console.log('checkServerUrl.err', err);
                // this.domainList = 
            });
    }

    checkServer(baseurl) {
        let url = baseurl + this.getConfig().BASE_DIR + ApiService.ping_server();
        console.log('url', url);
        Networking.httpRequestGet(url, (jsonData) => {

            console.log('checkServerUrl.jsonData', jsonData)
            if (jsonData.error_code === 0) {
                global.base_url = this.domain;
                this.getConfig().setBaseUrl(this.domain);
                this.saveUrl(null, this.domain);
                this.gotoLogicApp();
            } else {

            }
        }, (err) => {
            console.log('checkServerUrl.getCaptchaImageCheck', err)
            this.domainList.splice(this.index, 1);
            this.index = Math.floor(Math.random(this.domainList.length));
            console.log('checkServerUrl.random', this.index)
            let item = this.domainList[this.index]
            console.log('checkServerUrl.item', item)
            if (item) {
                this.domain = item.domain;
                this.checkServer(this.domain);
            }

        });
    }

    onPlaybackStatusUpdate(playbackStatus) {
        this.videoLoadingFinish = true;
        if (this.assetsLoaded) {
            this.onCheckData();
        }

    }

    onCheckData() {
        DataManager.loadLocalData(KEYS, this.onLoadLocalComplete.bind(this));
        // NetInfo.isConnected.fetch().then(isConnected => {
        //     if (!isConnected) {
        //         this.setState({
        //             popup_notify_content: this.t('network_connection_error'),
        //             isShowSubmitScore: false
        //         }, () => this.popupNotify.show());
        //     } else {
        //         DataManager.loadLocalData(KEYS, this.onLoadLocalComplete.bind(this));
        //     }
        // });
    }

    onConnectionChange(connectionType) {
        if (connectionType != 'none' && connectionType != 'unknown') {
            // this.popupNotify.dismiss();
        }
    }
    onPopupNotifyConfirm() {
        BackHandler.exitApp();
    }
    progress_cb = (p) => {
        console.log(`% Done ok = ${p.toFixed(0)}`);
        // this.state['progress'] = p.toFixed(0);
        this.increase('progress', p.toFixed(0) - this.state['progress']);

    }
    loadAssetsAsync = async () => {
        try {
            await cacheAssetsAsync({
                files: arrayFromObject(Files), progress_cb: this.progress_cb
            });
        } catch (e) {
            console.warn(
                `There was an error caching assets (see: app.js), perhaps due to a 
                network timeout, so we skipped caching. Reload the app to try again.`
            );
            console.log(e.message);
        } finally {
            this.assetsLoaded = true;
            if (this.videoLoadingFinish) {
                this.onCheckData();
            }
        }
    };

    onLoadLocalComplete(err, results) {
        // let uid;
        results.map((store, i) => {

            let key = store[0];
            if (key === Constant.USER.USER_ID) {
                this.uid = store[1];
            } else if (key === Constant.USER.TOKEN) {
                this.token = store[1];
            } else if (key === Constant.USER.USER_TYPE) {
                this.userType = store[1];
            } else if (key === Constant.CACHE_BASE_URL.LIST) {
                this.domainList = JSON.parse(store[1])
            } else if (key === Constant.CACHE_BASE_URL.MAIN) {
                this.domain = store[1];
            }
        });

        this.domain = this.getConfig().URL_EXTRAS
        this.getConfig().setBaseUrl(this.domain);
        this.saveUrl(null, this.domain);
        this.gotoLogicApp();

        // if (this.domain) {
        //     this.checkServer(this.domain);
        // } else if (this.domainList && this.domainList.length > 0) {
        //     try {
        //         this.domain = this.domainList[0].domainbase;
        //     } catch (error) {
        //         this.domain = this.domainList[0].domain;
        //     }
        //     this.checkServer(this.domain);
        // } else {
        //     this.getServerUrl();
        // }

    }

    gotoLogicApp() {
        if (this.uid && this.token) {
            UserInfo.setId(this.uid);
            UserInfo.setUserToken(this.token);
            if (!this.userType || this.userType === '0') {
                this.props.navigation.replace('update_user_info_screen');
            } else {
                // this.props.navigation.replace('app_screen');
                this.checkLoadView();
            }
        } else {
            this.props.navigation.replace('select_language_screen');
        }
    }

    refreshWhenBack() {
        console.log('refreshWhenBack.........................................');
        this.props.navigation.replace('app_screen');
    }

    /**
     * lay thong tin event
     * @param {*} id 
     */
    requestEventDetail(id) {
        let url = this.getConfig().getBaseUrl() + ApiService.event_detail(id);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('event detail................... ', jsonData);
            // let model = new EventModel();
            // model.parseData(jsonData);
            let event_data = null;
            let error_code = parseInt(jsonData['error_code']);
            if (error_code === 0) {
                let event = jsonData.data.event;
                event_data = {
                    name: event.name,
                    user_host_id: event.host_user_id,
                    facility_name: event.Facility.sub_title,// d.getFacility().getSubTitle(),
                    tee_time: event.tee_time,
                    avatar: event.HostUser.avatar,// d.getHostUser().getAvatar(),
                    create_at_timestamp: event.created_at_timestamp,// d.getDateCreateTimestamp(),
                    // coming: d.isComing(),
                    id: event.id,
                    facility_id: event.facility_id
                }

                let { navigation } = self.props;
                if (navigation) {
                    navigation.navigate('event_detail', { data: event_data });
                }
            } else {
                if (navigation) {
                    navigation.navigate('app_screen');
                }
            }
        }, () => {
            if (navigation) {
                navigation.navigate('app_screen');
            }
        });
    }

    checkLoadView() {
        let { screenProps } = this.props;
        if (!screenProps) {
            this.props.navigation.replace('app_screen');
            return;
        }
        let { fromFirebaseBackground, type, id } = screenProps;
        // console.log('param.............................. ', fromFirebaseBackground,type,id);
        if (!fromFirebaseBackground || !type) {
            this.props.navigation.replace('app_screen');
            return;
        }
        type = parseInt(type);
        // console.log('...................................... ',type);
        this.id = id;
        //fake test ban cua ban
        // type = (type >= 1 && type <= 7) ? 12 : type;

        if (type >= 1 && type <= 7) {
            this.requestFlightView(this.id);
        } else if (type === 9) {
            this.props.navigation.navigate('notification_friend', { refesh_back: this.refreshWhenBack.bind(this) });
        } else if (type === 14) {
            this.requestEventDetail(this.id);
        } else if (type === 11) {
            this.requestClubDetail(this.id);
        } else if (type === 13) {
            this.requestGroupInfo(this.id);
        } else if (type === 12) {
            //thong bao cho ban cua ban
            this.requestFriendFlightView(this.id);
        } else {
            //default
            this.props.navigation.replace('app_screen');
        }
    }

    requestGroupInfo(group_id) {
        let url = this.getConfig().getBaseUrl() + ApiService.group_detail(group_id);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            this.Logger().log('......... group info ', jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    let data = jsonData.hasOwnProperty('data') ? jsonData['data'] : undefined;
                    if (data) {
                        let group = data.hasOwnProperty('group') ? data['group'] : null;
                        if (group) {
                            let obj = {
                                host: false,
                                groupId: group['id'],
                                logoUrl: group['image_path'],
                                groupName: group['name']
                            }
                            let { navigation } = self.props;
                            if (navigation) {
                                navigation.navigate('group_detail_view', { data: obj });
                                return;
                            }
                        }
                    }
                }
            }
            let { navigation } = self.props;
            if (navigation) {
                navigation.replace('app_screen');
            }
        }, () => {
            let { navigation } = self.props;
            if (navigation) {
                navigation.replace('app_screen');
            }
        });
    }

    requestClubDetail(club_id) {
        let url = this.getConfig().getBaseUrl() + ApiService.club_detai(club_id);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('club add.................................. ', jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    let data = jsonData.hasOwnProperty('data') ? jsonData['data'] : {};
                    let club = data.hasOwnProperty('club') ? data['club'] : undefined;
                    let club_data = null;
                    if (club) {
                        //clubId: this.clbId,refresh : this.onRefresh.bind(this), clubName: this.clbName,logoUrl : this.logoUrl, isAdmin: this.model.IsAdmin(), isAccepted: this.model.IsAccepted(), isMember: this.model.IsMember(), invitation_id: this.model.getInvitationId() }
                        club_data = {
                            clubId: club.id,
                            clubName: club.name,
                            logoUrl: club.logo_url_path,
                        }
                        let invitation = data.hasOwnProperty('invitation') ? data['invitation'] : undefined;
                        if (invitation) {
                            club_data.isAdmin = invitation.is_user_admin == 1 ? true : false;
                            club_data.isAccepted = invitation.is_accepted == 1 ? true : false;
                            club_data.isMember = true;
                            club_data.invitation_id = invitation.id;
                        }
                    }
                    if (club_data) {
                        let { navigation } = self.props;
                        if (navigation) {
                            navigation.navigate('club_home_preview', { clubId: club_data.clubId, clubName: club_data.clubName, logoUrl: club_data.logoUrl, isAdmin: club_data.isAdmin, isAccepted: club_data.isAccepted, isMember: club_data.isMember, invitation_id: club_data.invitation_id })
                        }
                    }
                } else {
                    let { navigation } = self.props;
                    if (navigation) {
                        navigation.replace('app_screen');
                    }
                }
            } else {
                let { navigation } = self.props;
                if (navigation) {
                    navigation.replace('app_screen');
                }
            }
        }, () => {
            let { navigation } = self.props;
            if (navigation) {
                navigation.replace('app_screen');
            }
        })
    }

    /**
     * Tran ban cua ban
     * @param {*} flight_id 
     */
    requestFriendFlightView(flight_id) {
        let url = this.getConfig().getBaseUrl() + ApiService.view_flight_detail(flight_id);
        let self = this;
        console.log('url', url);
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('onItemFriendFlightClick', jsonData);
            // self.hideLoading();
            try {

                self.model = new FlightDetailModel(self);
                self.model.parseData(jsonData);
                //console.log("view flight : ",self.model.getErrorMsg());
                if (self.model.getErrorCode() === 0) {
                    // let userRounds = self.model.getFlight().getUserRounds();
                    // let user = userRounds.find((userRound) => {
                    //     return this.getAppUtil().replaceUser(userRound.getUserId()) === this.getAppUtil().replaceUser(self.uid);
                    // });
                    // if (user && user.getSubmitted() === 1) {
                    //     self.openScoreView(0, self.model);
                    // } else {
                    //     self.openScoreView(1, self.model);
                    // }
                    self.props.navigation.navigate('friend_flight_scorecard',
                        {
                            'FlightDetailModel': self.model,
                            'isHostUser': false
                        })
                } else {
                    // self.popupNotify.setMsg(self.model.getErrorMsg());
                    self.props.navigation.replace('app_screen');
                }
            } catch (error) {
                console.log('onItemFinishFlightClick.error', error)
            }
        }, () => {
            self.props.navigation.replace('app_screen');
        });
    }

    requestFlightView(flight_id) {
        // if (flight.getFlight() && flight.getFlight().getSource() === 'image' && flight.getType() === 'unfinished') {
        //     this.navigation.navigate('upload_flight_image', { 'RoundItemModel': flight });
        // } else {
        let url = this.getConfig().getBaseUrl() + ApiService.view_flight_detail(flight_id);
        let self = this;
        console.log('url', url);
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('onItemFriendFlightClick', jsonData);
            // self.hideLoading();
            try {

                self.model = new FlightDetailModel(self);
                self.model.parseData(jsonData);
                //console.log("view flight : ",self.model.getErrorMsg());
                if (self.model.getErrorCode() === 0) {
                    let userRounds = self.model.getFlight().getUserRounds();
                    let user = userRounds.find((userRound) => {
                        return this.getAppUtil().replaceUser(userRound.getUserId()) === this.getAppUtil().replaceUser(self.uid);
                    });
                    if (user && user.getSubmitted() === 1) {
                        self.openScoreView(0, self.model);
                    } else {
                        self.openScoreView(1, self.model);
                    }
                } else {
                    // self.popupNotify.setMsg(self.model.getErrorMsg());
                    self.props.navigation.replace('app_screen');
                }
            } catch (error) {
                console.log('onItemFinishFlightClick.error', error)
            }
        }, () => {
            self.props.navigation.replace('app_screen');
            //time out
            // self.hideLoading();
            // self.showErrorMsg(self.t('time_out'));
        });
        // }

    }

    openScoreView(type, FlightDetailModel) {
        let flight = FlightDetailModel.getFlight();
        let playerList = flight.getUserRounds();
        let indexMe = playerList.findIndex((user) => {
            return this.uid.toString().toUpperCase().indexOf('VGA') > -1 ? user.getUser().getUserId() === this.uid : user.getUserId() === this.uid;
        });
        let isHostUser = false;
        if (indexMe != -1) {
            playerList.splice(0, 0, ...playerList.splice(indexMe, 1));
            try {
                if (playerList.length > 0 && playerList[0].getSttUser() === 1) {
                    isHostUser = true;
                }
            } catch (error) {
                console.log('parseCourseData.isHostUser.error', error);
            }

        }

        let { navigation } = this.props;
        if (type === 0) {
            navigation.navigate('scorecard_view',
                {
                    onCloseScorecard: this.refreshWhenBack.bind(this),
                    'type': 'preview',
                    'FlightDetailModel': FlightDetailModel,
                    'isHostUser': isHostUser
                });
        } else {
            navigation.navigate('enter_flight_show',
                {
                    'FlightDetailModel': FlightDetailModel,
                    'isHostUser': isHostUser,
                    'type': 'preview',
                    onDispatchCallback: this.refreshWhenBack.bind(this)
                });
        }

    }

    saveUrl(listUrl, baseurl) {
        if (listUrl) {
            DataManager.saveLocalData([[Constant.CACHE_BASE_URL.LIST, listUrl]], (error) => console.log('saveLocalData', error));
        } else if (baseurl) {
            DataManager.saveLocalData([[Constant.CACHE_BASE_URL.MAIN, baseurl]], (error) => console.log('saveLocalData', error));
        }

    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#11a9a3',
        marginTop: 0,
        marginBottom: 0,
        alignItems: 'stretch'

    },
    container_search: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    buttonContainer: {
        marginTop: verticalScale(15),
    },
    separator: {
        marginVertical: verticalScale(30),
        borderWidth: 0.5,
        borderColor: '#DCDCDC',
    },
    loadding: {
        // backgroundColor: 'red',
        marginTop: Dimensions.get('window').height - scale(200),

    },
    label: {
        color: '#fff',
        fontSize: fontSize(14),
        fontWeight: '500',
        justifyContent: 'center',
        marginBottom: verticalScale(10),
        marginLeft: scale(20),
    },
});