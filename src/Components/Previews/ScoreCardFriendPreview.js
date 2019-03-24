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


/**
 * xem tu man hinh notify
 * xem tran khi nhan thong bao cac tran ban cua ban
 */
export default class ScorecardFriendPreview extends BaseComponent {

    constructor(props) {
        super(props);
        this.isIphoneX = this.getAppUtil().isIphoneX();
        this.uid = this.getUserInfo().getId();
        this.existMe = false;
        // this.isHostUser = this.props.navigation.state.params.isHostUser != null ? this.props.navigation.state.params.isHostUser : false;
        // this.notifyId = this.props.navigation.state.params.notifyId;
        this.playerSelected;
        this.playerPosition = 0;
        this.isAlone = false;
        // this.isMe = false;
        this.popupType = -1;
        this.flightDetail = this.props.navigation.state.params != null ? this.props.navigation.state.params.FlightDetailModel : '';
        this.flight = this.flightDetail ? this.flightDetail.getFlight() : '';
        this.sourceDirection = this.props.navigation.state.params.sourceDirection;
        // console.log('onViewFlightResponse', JSON.stringify(this.flight));
        this.isGrossMode = true;
        // this.likeStatus = 0;
        // this.isMustRefreshNotification = false;
        this.state = {
            isShowCourseSlope: false,
            popup_content: '',
            popup_notify_content: '',
            playerWaitingVerify: ''
        }

        let playerList = this.flight.getUserRounds();
        this.playerList = playerList;
        // let indexMe = playerList.findIndex((user) => {
        //     // console.log('......................................... ',this.checkUserId(user.getUserId()),this.checkUserId(this.uid));
        //     return this.checkUserId(user.getUserId()) === this.checkUserId(this.uid);
        // });
        // console.log('find indez................. ',indexMe);
        // if (indexMe !== -1) {
        //     this.existMe = true;
        //     if (playerList.length === 1) {
        //         this.isAlone = true;
        //     }
        // }
    }

    render() {
        let playerList = this.flight.getUserRounds();

        let courseList = this.flightDetail.getFlightPath() ? this.flightDetail.getFlightPath().getCourseList() : null;
        // console.log('existMe..................... ', this.existMe);
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

                </View>



                <CustomLoading ref={(customLoading) => { this.customLoading = customLoading; }} />
                {this.renderMessageBar()}
            </View>
        );
    }

    // checkUserId(uid) {
    //     // console.log("checkUserId............................................. ", uid);
    //     uid = uid.toString().toLowerCase().replace('vga', '');
    //     // console.log("checkUserId............................................. ", uid);
    //     return parseInt(uid);
    // }

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
        this.onCloseScorecard();
    }

    onCancelVerifyClick() {
        this.onCloseScorecard();
    }

    onCloseScorecard() {
        let { navigation } = this.props;
        navigation.replace('app_screen');
    }

    onChangeScoreMode() {
        this.isGrossMode = !this.isGrossMode;
        this.scorePreview.setChangeScoreMode(this.isGrossMode);
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
        // this.isMe = this.checkUserId(userRound.getUserId()) === this.checkUserId(this.uid);
        if (this.scorePreview) {
            this.scorePreview.setPlayerPosition(index);
        }
    }
    ////////////////////////////////////////////////////

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