import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    // ListView,
    StatusBar,
    // TouchableOpacity,
    BackHandler,
    // SafeAreaView,
    // ScrollView,
    Dimensions
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import { Constants } from '../../Core/Common/ExpoUtils';
import ScorecardPlayerListView from '../CreateFlight/Items/ScorecardPlayerListView';
import ScorePreview from '../CreateFlight/Items/ScorePreview';
import MyView from '../../Core/View/MyView';
import PopupYesOrNo from '../Common/PopupYesOrNo';
import { StackActions, NavigationActions } from 'react-navigation';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import PopupNotifyView from '../Common/PopupNotifyView';
import AppUtil from '../../Config/AppUtil';
import CourseSlopeView from '../CreateFlight/Items/CourseSlopeView';
import VerifyButtonGroupView from '../CreateFlight/Items/VerifyButtonGroupView';
import GrossOverChangeBtn from '../CreateFlight/Items/GrossOverChangeBtn';
import ScorecardHeaderBtn from '../CreateFlight/Items/ScorecardHeaderBtn';
import CustomLoading from '../Common/CustomLoadingView';
import Share from 'react-native-share';
import { deleteFlightById } from '../../DbLocal/FinishFlightRealm';
import { deleteNotifyByFlightId } from '../../DbLocal/NotificationRealm';

import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
let { width, height } = Dimensions.get('window');

const SUBMIT_STATE = {
    SHOW_SUBMIT: [true, false, false],
    SHOW_VERIFY: [false, true, true],
    HIDE_ALL: [false, false, false]
}

const resetHome = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'home_screen' })
    ]
});

const POPUP_TYPE = {
    SUBMIT_SCORE: 0,
    VERIFY_SCORE: 1,
    REJECT_SCORE: 2
}

/**
 * xem tu man hinh notify
 */
export default class ScorecardPreview extends BaseComponent {

    constructor(props) {
        super(props);
        this.isIphoneX = this.getAppUtil().isIphoneX();
        this.uid = this.getUserInfo().getId();
        this.existMe = false;
        this.isHostUser = this.props.navigation.state.params.isHostUser != null ? this.props.navigation.state.params.isHostUser : false;
        this.notifyId = this.props.navigation.state.params.notifyId;
        this.playerSelected;
        this.playerPosition = 0;
        this.isAlone = false;
        this.isMe = false;
        this.popupType = -1;
        this.flightDetail = this.props.navigation.state.params != null ? this.props.navigation.state.params.FlightDetailModel : '';
        this.flight = this.flightDetail ? this.flightDetail.getFlight() : '';
        this.sourceDirection = this.props.navigation.state.params.sourceDirection;
        // console.log('onViewFlightResponse', JSON.stringify(this.flight));
        this.isGrossMode = true;
        this.likeStatus = 0;
        this.isMustRefreshNotification = false;
        this.state = {
            isShowCourseSlope: false,
            popup_content: '',
            popup_notify_content: '',
            playerWaitingVerify: ''
        }

        let playerList = this.flight.getUserRounds();
        this.playerList = playerList;
        let indexMe = playerList.findIndex((user) => {
            // console.log('......................................... ',this.checkUserId(user.getUserId()),this.checkUserId(this.uid));
            return this.checkUserId(user.getUserId()) === this.checkUserId(this.uid);
        });
        // console.log('find indez................. ',indexMe);
        if (indexMe !== -1) {
            this.existMe = true;
            if (playerList.length === 1) {
                this.isAlone = true;
            }
        }
    }

    render() {
        let playerList = this.flight.getUserRounds();
        let hideEdit = playerList[0].getCanEdit() != 1;
        let hideDelete = playerList[0].getCanDelete() != 1;

        let courseList = this.flightDetail.getFlightPath() ? this.flightDetail.getFlightPath().getCourseList() : null;
        let hideImageIcon = this.flight.getUrlScorecard() ? false : true;
        console.log('existMe..................... ', this.existMe);
        return (
            <View style={[styles.container, this.isIphoneX ? { paddingRight: 30, paddingLeft: 10, paddingBottom: 10 } : {}]}
                collapsable={false}
                ref={(parentView) => { this.parentView = parentView; }}>
                <StatusBar hidden={true} />
                {/* {this.renderLoading()} */}
                <View style={styles.container_header}>
                    <Touchable style={styles.toucable_icon_header} onPress={this.onCloseScorecardClick.bind(this)}>
                        <Image
                            style={styles.icon_close}
                            source={this.getResources().ic_x}
                        />
                    </Touchable>
                    <View style={styles.container_header_center}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.text_header_datetime}>{this.flight.getDatePlayedDisplay()}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.text_header_course_name} numberOfLines={1}>{this.flight.getFlightName()}</Text>
                    </View>

                    <ScorecardHeaderBtn
                        ref={(scorecardHeaderBtn) => { this.scorecardHeaderBtn = scorecardHeaderBtn; }}
                        hideDelete={hideDelete}
                        hideEdit={hideEdit}
                        hideImageIcon={hideImageIcon}
                        flightId={this.flight.getId()}
                        isLiked={this.flight.isLiked()}
                        onShareScoreClick={this.snapshot.bind(this)}
                        onDeleteFlight={this.onDeleteFlight.bind(this)}
                        onEditFlight={this.onEditFlight.bind(this)}
                        onViewScorecardImage={this.onViewScorecardImage.bind(this)}
                    />
                </View>

                <View style={styles.container_player_gross}>
                    <View style={styles.container_player}>
                        <ScorecardPlayerListView
                            ref={(scorecardPlayerListView) => { this.scorecardPlayerListView = scorecardPlayerListView; }}
                            listPlayer={playerList}
                            onPlayerSelected={this.onPlayerChanged.bind(this)} />
                    </View>

                    <GrossOverChangeBtn
                        onChangeScoreMode={this.onChangeScoreMode.bind(this)}
                    />

                </View>

                {/* <ScrollView style={styles.container_score}> */}
                <ScorePreview
                    ref={(scorePreview) => { this.scorePreview = scorePreview; }}
                    FlightDetail={this.flight}
                    isGrossScoreMode={this.isGrossMode}
                    onSwipeLeft={this.onScorecardSwipeLeft.bind(this)}
                    onSwipeRight={this.onScorecardSwipeRight.bind(this)} />
                {/* </ScrollView> */}

                <View style={styles.container_bottom}>

                    <CourseSlopeView
                        courseList={courseList}
                        path1={this.flight.getPathId1()}
                        path2={this.flight.getPathId2()}
                    />
                    <VerifyButtonGroupView
                        ref={(verifyButtonGroupView) => { this.verifyButtonGroupView = verifyButtonGroupView; }}
                        existMe={this.existMe}
                        submitScorecardClick={this.submitScorecardClick.bind(this)}
                        denyScorecardClick={this.denyScorecardClick.bind(this)}
                        verifyScorecardClick={this.verifyScorecardClick.bind(this)}
                    />

                </View>

                <PopupYesOrNo
                    ref={(popupDeleteFlight) => { this.popupDeleteFlight = popupDeleteFlight; }}
                    content={this.t('delete_flight_content')}
                    confirmText={this.t('agree')}
                    cancelText={this.t('cancel')}
                    onConfirmClick={this.onConfirmDeleteFlight.bind(this)} />

                <PopupYesOrNo
                    ref={(popupScore) => { this.popupScore = popupScore; }}
                    content={this.state.popup_content}
                    confirmText={this.t('agree')}
                    cancelText={this.t('cancel')}
                    onConfirmClick={this.onPopupScoreConfirm.bind(this)} />

                <PopupYesOrNo
                    ref={(popupPlayerWaitingVerify) => { this.popupPlayerWaitingVerify = popupPlayerWaitingVerify; }}
                    content={this.state.playerWaitingVerify}
                    confirmText={this.t('continue_lower_case')}
                    cancelText={this.t('exit')}
                    onCancelClick={this.onCancelVerifyClick.bind(this)} />

                <PopupNotifyView
                    ref={(popupNotify) => { this.popupNotify = popupNotify; }}
                    content={this.state.popup_notify_content}
                    confirmText={this.t('ok')}
                    onConfirmClick={this.onPopupNotifyConfirm.bind(this)} />
                <CustomLoading ref={(customLoading) => { this.customLoading = customLoading; }} />
                {this.renderMessageBar()}
            </View>
        );
    }

    checkUserId(uid) {
        // console.log("checkUserId............................................. ", uid);
        uid = uid.toString().toLowerCase().replace('vga', '');
        // console.log("checkUserId............................................. ", uid);
        return parseInt(uid);
    }

    componentDidMount() {
        this.rotateToLandscape();
        this.registerMessageBar();
        this.handleHardwareBackPress();

        this.onPlayerChanged(this.playerList[0], 0);

        // let { id } = this.props.screenProps;
    }

    handleHardwareBackPress() {
        let self = this;
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
            self.onCloseScorecardClick();
            return true;
        });
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    onCloseScorecardClick() {
        if (this.existMe) {
            let users = this.flight.getUserRounds().filter((userRound) => {
                return (userRound.getState() === 0 && userRound.getSubmitted() === 1 && this.checkUserId(userRound.getUserId()) !== this.checkUserId(this.uid) && userRound.getConfirmed() != 1)
                    || (userRound.getState() === 1 && !this.isHostUser && userRound.getConfirmed() != 1);
            });
            if (users.length > 0) {
                let user_ids = users.map((userRound) => {
                    return userRound.getUser().getUserId();
                });

                this.popupPlayerWaitingVerify.setContent(this.t('player_waiting_verify').format(user_ids.join(', ')));
            } else {
                try {
                    deleteNotifyByFlightId(this.flight.getId());
                    this.isMustRefreshNotification = true;
                    this.onCloseScorecard();
                } catch (error) {

                }
            }
        } else {
            this.onCloseScorecard();
        }
    }

    onCancelVerifyClick() {
        this.onCloseScorecard();
    }

    onCloseScorecard() {
        let { navigation } = this.props;
        let { onCloseScorecard } = navigation.state.params;

        navigation.replace('app_screen');
        // console.log('params......................',params);
        // if (onCloseScorecard) {
        //     onCloseScorecard();
        // }
        // if (params.refresh && this.isMustRefreshNotification) {
        //     //refesh lai man hinh notify
        //     params.refresh(this.notifyId);
        // };
        // navigation.goBack();
    }

    onChangeScoreMode() {
        this.isGrossMode = !this.isGrossMode;
        this.scorePreview.setChangeScoreMode(this.isGrossMode);
    }

    onDeleteFlight() {
        this.popupDeleteFlight.show();
    }

    onConfirmDeleteFlight() {
        this.customLoading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.out_flight(this.flight.getId());
        console.log('url', url);
        Networking.httpRequestGet(url, this.onDeleteFlightResponse.bind(this, this.flight.getId()), () => {
            //time out
            self.customLoading.hideLoading();
            self.showErrorMsg(self.t('time_out'))
        });
    }

    onDeleteFlightResponse(flightId, jsonData) {
        this.customLoading.hideLoading();
        console.log('onDeleteFlightResponse', jsonData);
        let error_code;
        if (jsonData != null && jsonData.hasOwnProperty('error_code')) {
            error_code = jsonData['error_code'];
        }
        if (error_code != null && error_code === 0) {
            if (jsonData.hasOwnProperty("error_msg")) {
                let msg = jsonData['error_msg']; //"Bạn đã ra khỏi flight thành công"
                this.showSuccessMsg(msg);
            }
            deleteFlightById(flightId);
            this.props.navigation.dispatch(resetHome);
        } else {
            this.showErrorMsg(jsonData['error_msg']);
        }
    }

    snapshot = async () => {
        let self = this;
        let imageUri = await AppUtil.onSnapshotClick(this.parentView);
        this.customLoading.showLoading();
        if (imageUri) {
            Share.open({
                url: imageUri,
            })
                .then(() => { self.customLoading.hideLoading(); })
                .catch((error) => {
                    self.customLoading.hideLoading();
                    console.log('Share.error', error)
                });

        } else {
            self.customLoading.hideLoading();
        }

    }

    onUploadSuccess(jsonData) {
        this.customLoading.hideLoading();
        console.log('onUploadSuccess', jsonData);
        if (jsonData != null && jsonData.hasOwnProperty('error_code')) {
            if (jsonData['error_code'] === 0) {
                AppUtil.ShareUrl(jsonData['data'].image_paths[0].url);

            } else {
                this.showErrorMsg(jsonData['error_msg']);
            }
        }
    }

    onScorecardSwipeLeft(position) {
        this.scorecardPlayerListView.onSelectPlayerPosition(position);
    }

    onScorecardSwipeRight(position) {
        this.scorecardPlayerListView.onSelectPlayerPosition(position);
    }

    onPlayerChanged(userRound, index) {
        this.playerSelected = userRound;
        this.playerPosition = index;
        // kiem tra user duoc chon co phai la minh hay ko
        this.isMe = this.checkUserId(userRound.getUserId()) === this.checkUserId(this.uid);
        this.onSetSubmitScoreBtnState(userRound);
        if (this.scorePreview) {
            this.scorePreview.setPlayerPosition(index);
        }
    }

    /**
     * submit = 1: khong hien thi nut gui diem
     * confirm = 1: khong hien thi nut ky diem, != 1: hien thi nut ky diem
     * state: = 0: diem tu nhap, =1 : diem do nguoi khac nhap ho
     * @param {*} userRound: UserRoundModel
     */
    onSetSubmitScoreBtnState(userRound) {
        // console.log('onSetSubmitScoreBtnState', this.existMe, userRound.getState(), userRound.getSubmitted(), this.isMe, userRound.getConfirmed(), this.isHostUser);
        if (this.existMe) {

            // state = 0 || state = 1: kiem tra da co diem hay chua
            if (userRound.getState() === 0) {   // diem tu nhap

                if (userRound.getSubmitted() === 1) {
                    // da co diem tu nhap va da gui diem
                    if (this.isMe || userRound.getConfirmed() === 1) {
                        // SUBMIT_STATE.HIDE_ALL
                        this.setVerifyState(SUBMIT_STATE.HIDE_ALL);
                        // this.setState(SUBMIT_STATE.HIDE_ALL);
                    } else {
                        this.setVerifyState(SUBMIT_STATE.SHOW_VERIFY);
                        // this.setState(SUBMIT_STATE.SHOW_VERIFY);
                    }

                } else if (this.isMe) {
                    // da co diem tu nhap nhung chua gui diem
                    this.setVerifyState(SUBMIT_STATE.SHOW_SUBMIT);
                    // this.setState(SUBMIT_STATE.SHOW_SUBMIT);
                } else {
                    this.setVerifyState(SUBMIT_STATE.HIDE_ALL);
                    // this.setState(SUBMIT_STATE.HIDE_ALL);
                }
            } else if (userRound.getState() === 1) {    // diem duoc nhap ho
                if (this.isHostUser || userRound.getConfirmed() === 1) {
                    this.setVerifyState(SUBMIT_STATE.HIDE_ALL);
                    // this.setState(SUBMIT_STATE.HIDE_ALL);
                } else {
                    this.setVerifyState(SUBMIT_STATE.SHOW_VERIFY);
                    // this.setState(SUBMIT_STATE.SHOW_VERIFY);
                }
            } else {
                // chua co diem hoac khong ton tai user: khong hien thi nut nao ca
                this.setVerifyState(SUBMIT_STATE.HIDE_ALL);
                // this.setState(SUBMIT_STATE.HIDE_ALL);
            }
        } else {
            this.setVerifyState(SUBMIT_STATE.HIDE_ALL);
            // this.setState(SUBMIT_STATE.HIDE_ALL);
        }
    }

    setVerifyState(state) {
        if (this.verifyButtonGroupView) {
            this.verifyButtonGroupView.setVerifyState(state[0], state[1], state[2], this.existMe);
        }
    }

    onViewScorecardImage() {
        let uri = this.flight.getUrlScorecard();
        console.log('uri', uri);
        if (uri) {
            this.props.navigation.navigate('show_scorecard_image', { 'imageUri': uri })
        } else {
            // notify image error
            this.showWarningMsg(this.t('image_empty'));
        }
    }

    onEditFlight() {
        if (this.sourceDirection === 'EnterFlightScoreView') {
            this.onCloseScorecard();
        } else {
            this.props.navigation.replace('enter_flight_score_view',
                {
                    'FlightDetailModel': this.flightDetail,
                    'EditFlight': true,
                    'isHostUser': this.isHostUser
                })
        }
    }

    submitScorecardClick() {
        this.popupType = POPUP_TYPE.SUBMIT_SCORE;
        if (this.isAlone) {
            this.popupScore.setContent(this.t('submit_score_alone'));
        } else {
            this.popupScore.setContent(this.t('submit_score_all'));
        }
    }

    verifyScorecardClick() {
        this.popupType = POPUP_TYPE.VERIFY_SCORE;
        if (this.isMe) {
            this.popupScore.setContent(this.t('verify_my_score'));
        } else {
            this.popupScore.setContent(this.t('verify_score_another').format(this.playerSelected.getUser() ? `${this.playerSelected.getUser().getFullName()} - ${this.playerSelected.getUser().getUserId()}` : ''));
        }
    }

    denyScorecardClick() {
        this.popupType = POPUP_TYPE.REJECT_SCORE;
        if (this.isMe) {
            this.popupScore.setContent(this.t('reject_my_score'));
        } else {
            this.popupScore.setContent(this.t('reject_score_another').format(this.playerSelected.getUser() ? `${this.playerSelected.getUser().getFullName()} - ${this.playerSelected.getUser().getUserId()}` : ''));
        }
    }

    onPopupScoreConfirm() {
        if (this.popupType === POPUP_TYPE.SUBMIT_SCORE) {
            this.requestSubmitScorecard();
        } if (this.popupType === POPUP_TYPE.VERIFY_SCORE) {
            this.requestVerifyScorecard();
        } if (this.popupType === POPUP_TYPE.REJECT_SCORE) {
            this.requestRejectScorecard();
        }
    }

    /**
     * Submit score
     */
    requestSubmitScorecard() {
        this.customLoading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.submit_scorecard(this.flight.getId());
        console.log('url', url);
        Networking.httpRequestGet(url, this.onSubmitScoreSuccess.bind(this, this.flight.getId()), () => {
            //time out
            self.customLoading.hideLoading();
            self.showErrorMsg(self.t('time_out'))
        });
    }

    onSubmitScoreSuccess(flightId, jsonData) {
        this.customLoading.hideLoading();
        if (jsonData != null && jsonData.hasOwnProperty('error_code')) {
            if (jsonData['error_code'] === 0) {
                global.flightIdRefresh = flightId;
                this.flight.getUserRounds()[this.playerPosition].setSubmitted(1);
                if (this.isAlone) {
                    this.setVerifyState(SUBMIT_STATE.HIDE_ALL);
                    this.popupNotify.setContent(this.t('submit_score_alone_complete'));
                } else {
                    this.setVerifyState(SUBMIT_STATE.HIDE_ALL);
                    this.popupNotify.setContent(this.t('submit_score_all_complete'));
                }
                try {
                    deleteNotifyByFlightId(flightId);
                } catch (error) {

                }
            } else {
                this.showErrorMsg(jsonData['error_msg']);
            }
        }

    }
    ////////////////////////////////////////////////////

    /**
     * Verify score
     */
    requestVerifyScorecard() {
        this.customLoading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.verify_scorecard(this.flight.getId(), this.playerSelected.getUserId());
        console.log('url', url);
        Networking.httpRequestGet(url, this.onVerifyScoreSuccess.bind(this, this.flight.getId()), () => {
            //time out
            self.customLoading.hideLoading();
            self.showErrorMsg(self.t('time_out'))
        });
    }

    onVerifyScoreSuccess(flightId, jsonData) {
        console.log('onVerifyScoreSuccess', jsonData)
        this.customLoading.hideLoading();
        if (jsonData != null && jsonData.hasOwnProperty('error_code')) {
            if (jsonData['error_code'] === 0) {
                global.flightIdRefresh = flightId;
                this.flight.getUserRounds()[this.playerPosition].setConfirmed(1);
                this.flight.getUserRounds()[this.playerPosition].setState(-1);
                this.scorecardPlayerListView.onSelectPlayerPosition(this.playerPosition);
                if (this.isMe) {
                    this.setVerifyState(SUBMIT_STATE.HIDE_ALL);
                    this.popupNotify.setContent(this.t('verify_my_score_success'));
                } else {
                    this.setVerifyState(SUBMIT_STATE.HIDE_ALL);
                    this.popupNotify.setContent(this.t('verify_score_another_success').format(this.playerSelected.getUser() ? `${this.playerSelected.getUser().getFullName()} - ${this.playerSelected.getUser().getUserId()}` : ''));
                }
            } else {
                this.showErrorMsg(jsonData['error_msg']);
            }
        }
    }
    ////////////////////////////////////////////////////

    /**
     * Reject score
     */
    requestRejectScorecard() {
        this.customLoading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.rejected_scorecard(this.flight.getId(), this.playerSelected.getUserId());
        console.log('url', url);
        Networking.httpRequestGet(url, this.onRejectScoreSuccess.bind(this, this.flight.getId()), () => {
            //time out
            self.customLoading.hideLoading();
            self.showErrorMsg(self.t('time_out'))
        });
    }

    onRejectScoreSuccess(flightId, jsonData) {
        console.log('onRejectScoreSuccess', jsonData)
        this.customLoading.hideLoading();
        if (jsonData != null && jsonData.hasOwnProperty('error_code')) {
            if (jsonData['error_code'] === 0) {
                global.flightIdRefresh = flightId;
                this.flight.getUserRounds()[this.playerPosition].setConfirmed(-1);
                this.flight.getUserRounds()[this.playerPosition].setState(-1);
                if (this.isMe) {
                    this.setVerifyState(SUBMIT_STATE.HIDE_ALL);
                    this.popupNotify.setContent(this.t('reject_my_score_success'));
                } else {
                    this.setVerifyState(SUBMIT_STATE.HIDE_ALL);
                    this.popupNotify.setContent(this.t('reject_score_another_success').format(this.playerSelected.getUser() ? `${this.playerSelected.getUser().getFullName()} - ${this.playerSelected.getUser().getUserId()}` : ''));
                }
            } else {
                this.showErrorMsg(jsonData['error_msg']);
            }
        }
    }
    ////////////////////////////////////////////////////

    onPopupNotifyConfirm() {
        if (this.popupType === POPUP_TYPE.SUBMIT_SCORE) {
            // this.props.navigation.dispatch(resetHome);
            // global.flightIdRefresh = this.flight.id;
            this.onCloseScorecard();
        }
        // this.onCloseScorecard();
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    container_header: {
        flexDirection: 'row',
        backgroundColor: '#F7F7F7',
        marginTop: Constants.marginTopBuild,
    },
    icon_close: {
        height: verticalScale(25),
        width: scale(25),
        resizeMode: 'contain'
    },
    container_header_center: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
    },
    container_header_right: {
        flexDirection: 'row'
    },
    icon_header: {
        height: verticalScale(25),
        width: scale(25),
        resizeMode: 'contain'
    },
    text_header_datetime: {
        color: '#B8B8B8',
        fontWeight: 'bold',
        fontSize: fontSize(15),// 15,
        marginLeft: scale(5)
    },
    text_header_course_name: {
        flex: 1,
        color: '#00ABA7',
        fontWeight: 'bold',
        fontSize: fontSize(15),// 15,
        marginLeft: scale(5),
        marginRight: scale(10)
    },
    toucable_icon_header: {
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        paddingLeft: scale(7),
        paddingRight: scale(7)
    },
    container_player_gross: {
        flexDirection: 'row',
        marginBottom: verticalScale(3)
    },
    container_player: {
        flexDirection: 'row',
        flex: 1
    },
    touchable_over_gross: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(10)
    },
    text_gross_over: {
        color: '#00ABA7',
        fontSize: fontSize(15),// 15,
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10),
        minWidth: verticalScale(80),
        borderColor: '#00ABA7',
        borderWidth: 1,
        textAlign: 'center'
    },
    container_score: {
        flex: 1,
    },
    container_bottom: {
        flexDirection: 'row',
        paddingBottom: verticalScale(3),
        paddingTop: verticalScale(2),
        alignItems: 'flex-end'
    },
    text_course_slope: {
        color: '#00ABA7',
        fontSize: fontSize(15),// 15,
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        minWidth: verticalScale(80),
        borderColor: '#00ABA7',
        borderWidth: 1,
        textAlign: 'center'
    },
    touchable_course_slope: {
        marginLeft: scale(10),
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    submit_score_container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        minWidth: verticalScale(180),
        marginRight: scale(5)
    },
    touchable_deny_view: {
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        borderWidth: 1,
        borderColor: 'red',
        backgroundColor: 'white',
        minWidth: verticalScale(80),
        justifyContent: 'center',
        alignItems: 'center'
    },
    text_deny_score: {
        color: 'red',
        fontSize: fontSize(15),// 15,
    },
    touchable_submit_score: {
        paddingTop: verticalScale(6),
        paddingBottom: verticalScale(6),
        backgroundColor: '#00ABA7',
        borderRadius: scale(3),
        minWidth: verticalScale(80),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: scale(10)
    },
    text_submit_score: {
        color: '#FFFFFF',
        fontSize: fontSize(15),// 15,
        paddingRight: scale(3),
        paddingLeft: scale(3)
    },
    course_slope_container: {
        flex: 1,
        justifyContent: 'space-between',
        marginRight: scale(5)
    },
    view_course_slope: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon_close_slope: {
        height: verticalScale(25),
        width: scale(25),
        resizeMode: 'contain',
        marginLeft: scale(7)
    },
    tee_info_container: {
        flexDirection: 'row',
        height: verticalScale(30),
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    view_tee_color: {
        width: scale(23),
        height: scale(23),
        borderWidth: 1,
        borderColor: '#A1A1A1',
        marginLeft: scale(5)
    },
    txt_tee_slope_title: {
        color: '#716A6A',
        fontSize: width * 0.027,// 13,
        includeFontPadding: false
    },
    txt_tee_slope_value: {
        color: '#716A6A',
        fontWeight: 'bold',
        fontSize: fontSize(15),// 13,
        includeFontPadding: false
    }

});