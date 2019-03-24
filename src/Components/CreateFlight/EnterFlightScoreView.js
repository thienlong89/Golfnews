import React from 'react';
import { Platform, StyleSheet, Text, View, StatusBar, BackHandler, Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import EnterScoreView from './EnterScore/EnterScoreView';
import EnterEachHoldView from './EnterScore/EnterEachHoldView';
import MyView from '../../Core/View/MyView';
import PopupAttachImage from '../Common/PopupAttachImage';
import PopupExportScorecard from './popup/PopupExportScorecard';
import PopupChangePath from './popup/PopupChangePath';
import PopupChangePlayerInfo from './popup/PopupChangePlayerInfo';
import { ImagePicker } from '../../Core/Common/ExpoUtils';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import FlightDetailModel from '../../Model/CreateFlight/Flight/FlightDetailModel';
import PopupYesOrNo from '../Common/PopupYesOrNo';
import { StackActions, NavigationActions } from 'react-navigation';
import AppUtil from '../../Config/AppUtil';
// import FlightSummaryModel from '../../Model/CreateFlight/Flight/FlightSummaryModel';
import ProgressUpload from '../Common/ProgressUpload';
import HoleUserModel from '../../Model/CreateFlight/Flight/HoleUserModel';
import { deleteFlightById } from '../../DbLocal/FinishFlightRealm';
import PopupSelectPath from './popup/PopupSelectPath';
import PopupSelectTeeView from '../Common/PopupSelectTeeView';
import CourseModel from '../../Model/CreateFlight/Flight/CourseModel';

import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
let { width, height } = Dimensions.get('window');

const resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'home_screen' })
    ]
});

const ENTER_SCORE_TYPE = {
    EXPORT_SCORECARD: 0,
    SAVE_DATA: 1
}

// const db = SQLite.openDatabase(global.db_name);
// const db = SQLite.openDatabase('VHandicap');

export default class EnterFlightScoreView extends BaseComponent {

    constructor(props) {
        super(props);

        this.isPreview = this.props.navigation.state.params.type ? true : false
        this.uid = this.getUserInfo().getId();
        let playerSelected;
        let playerPositionSelected;
        let teeListAvailable = [];
        this.pathList = [];
        this.pathType = 0;
        let params = this.props.navigation.state.params;
        this.isHostUser = params.isHostUser ? true : false;
        this.isEditFlight = params.EditFlight ? true : false;
        this.flightDetail = params.FlightDetailModel;
        this.oldFlightModel = this.isEditFlight ? JSON.stringify(this.flightDetail.getFlight()) : '';
        this.flight = this.flightDetail.getFlight();
        this.flightId = this.flight.getId();
        this.type_flight = this.flight.getTypeFlight();
        this.facilityId = this.flight.getFacilityId();
        this.notifyId = params.notifyId;
        this.selectType = 0;
        this.isJustCreated = params.isJustCreated ? true : false;
        this.state = {
            isEnterScoreTab: true,
            flightDetailModel: this.flightDetail,
            userSelected: 0,
            holdSelected: 0,
            holdUserSelected: [0, 0, 0, 0],
            pathNeedChange: {}
        }

        this.onBackPress = this.onBackPress.bind(this);
        this.onMenuHeaderClick = this.onMenuHeaderClick.bind(this);
        this.onEnterEachHoldTabSelected = this.onEnterEachHoldTabSelected.bind(this);
        this.onEnterScoreTabSelected = this.onEnterScoreTabSelected.bind(this);
        this.onLongPressPlayerListener = this.onLongPressPlayerListener.bind(this);
        this.onAttachImage = this.onAttachImage.bind(this);
        this.onChangePathCallback = this.onChangePathCallback.bind(this);
        this.onExportScorecardClick = this.onExportScorecardClick.bind(this);
        this.onTakePhotoClick = this.onTakePhotoClick.bind(this);
        this.onImportGalleryClick = this.onImportGalleryClick.bind(this);
        this.onViewImageClick = this.onViewImageClick.bind(this);
        this.onDeleteFlightClick = this.onDeleteFlightClick.bind(this);
        this.onPathChanged = this.onPathChanged.bind(this);
        this.onEditPlayerClick = this.onEditPlayerClick.bind(this);
        this.onDeletePlayerClick = this.onDeletePlayerClick.bind(this);
        this.onConfirmDeletePlayer = this.onConfirmDeletePlayer.bind(this);
        this.onAddMorePath = this.onAddMorePath.bind(this);
        this.onPathAddCallback = this.onPathAddCallback.bind(this);
        this.onTeeSelectedListener = this.onTeeSelectedListener.bind(this);
    }

    render() {
        let {
            flightDetailModel,
            userSelected,
            holdSelected,
            holdUserSelected,
            isEnterScoreTab,
            pathNeedChange
        } = this.state;
        this.flight = flightDetailModel.getFlight();
        let flightName = this.flight.getFlightName()

        return (
            <View style={styles.container}>
                {this.renderLoading()}
                <StatusBar hidden={false} />
                <HeaderView
                    title={this.flight.getFlightName()}
                    handleBackPress={this.onBackPress}
                    menuTitle={this.t('done')}
                    onMenuHeaderClick={this.onMenuHeaderClick} />

                <View style={styles.container_segment}>
                    <Touchable style={[styles.touchable_enter_hold, { backgroundColor: isEnterScoreTab ? '#FFFFFF' : '#00ABA7' }]}
                        onPress={this.onEnterEachHoldTabSelected}>
                        <Text allowFontScaling={global.isScaleFont} style={[styles.btn_title, { color: isEnterScoreTab ? '#00ABA7' : '#FFFFFF' }]}>{this.t('enter_each_hold')}</Text>
                    </Touchable>
                    <Touchable style={[styles.touchable_enter_all, { backgroundColor: isEnterScoreTab ? '#00ABA7' : '#FFFFFF' }]}
                        onPress={this.onEnterScoreTabSelected}>
                        <Text allowFontScaling={global.isScaleFont} style={[styles.btn_title, { color: isEnterScoreTab ? '#FFFFFF' : '#00ABA7' }]}>{this.t('enter_score')}</Text>
                    </Touchable>
                </View>

                <MyView hide={isEnterScoreTab} style={styles.enter_score_content}>
                    <EnterEachHoldView
                        ref={(enterEachHoldView) => { this.enterEachHoldView = enterEachHoldView; }}
                        flightDetailModel={flightDetailModel}
                        userSelected={userSelected}
                        holdSelected={holdSelected}
                        holdUserSelected={holdUserSelected}
                        onSyncFlightScore={this.onSyncFlightScore.bind(this, 0)}
                        onLongPressPlayerListener={this.onLongPressPlayerListener}
                        isHostUser={this.isHostUser}
                        teeList={this.teeListAvailable}
                        {...this.props}
                    />
                </MyView>

                <MyView hide={!isEnterScoreTab} style={styles.enter_score_content}>
                    <EnterScoreView
                        ref={(enterScoreView) => { this.enterScoreView = enterScoreView; }}
                        flightDetailModel={flightDetailModel}
                        userSelected={userSelected}
                        holdSelected={holdSelected}
                        holdUserSelected={holdUserSelected}
                        onSyncFlightScore={this.onSyncFlightScore.bind(this, 1)}
                        onAttachImage={this.onAttachImage}
                        onLongPressPlayerListener={this.onLongPressPlayerListener}
                        onChangePathCallback={this.onChangePathCallback}
                        onAddMorePath={this.onAddMorePath}
                        onExportScorecard={this.onExportScorecardClick}
                        isHostUser={this.isHostUser}
                        {...this.props}
                    />
                </MyView>

                <PopupAttachImage
                    ref={(popupAttachImage) => { this.popupAttachImage = popupAttachImage; }}
                    onTakePhotoClick={this.onTakePhotoClick}
                    onImportGalleryClick={this.onImportGalleryClick}
                    onViewImageClick={this.onViewImageClick} />

                <PopupExportScorecard
                    ref={(popupExportScorecard) => { this.popupExportScorecard = popupExportScorecard; }}
                    onExportScorecardClick={this.onExportScorecardClick}
                    onDeleteFlightClick={this.onDeleteFlightClick} />

                <PopupChangePath
                    ref={(popupChangePath) => { this.popupChangePath = popupChangePath; }}
                    pathNeedChange={pathNeedChange}
                    pathList={this.pathList}
                    onPathChanged={this.onPathChanged} />

                <PopupSelectPath
                    ref={(refPopupSelectPath) => { this.refPopupSelectPath = refPopupSelectPath; }}
                    onPathCallback={this.onPathAddCallback} />

                <PopupChangePlayerInfo
                    ref={(popupChangePlayerInfo) => { this.popupChangePlayerInfo = popupChangePlayerInfo; }}
                    playerPosition={this.playerPositionSelected}
                    onEditPlayerClick={this.onEditPlayerClick}
                    onDeletePlayerClick={this.onDeletePlayerClick} />

                <PopupYesOrNo
                    ref={(popupDeletePlayer) => { this.popupDeletePlayer = popupDeletePlayer; }}
                    content={this.t('confirm_delete_player')}
                    confirmText={this.t('agree')}
                    cancelText={this.t('cancel')}
                    onConfirmClick={this.onConfirmDeletePlayer} />

                <PopupYesOrNo
                    ref={(popupDeleteFlight) => { this.popupDeleteFlight = popupDeleteFlight; }}
                    content={this.t('delete_flight_content')}
                    confirmText={this.t('agree')}
                    cancelText={this.t('cancel')}
                    onConfirmClick={this.onConfirmDeleteFlight.bind(this, true)} />

                <PopupSelectTeeView
                    ref={(refPopupSelectTeeView) => { this.refPopupSelectTeeView = refPopupSelectTeeView; }}
                    onTeeSelected={this.onTeeSelectedListener} />

                <ProgressUpload
                    ref={(progressUpload) => { this.progressUpload = progressUpload; }}
                />
                {this.renderMessageBar()}
            </View>
        );
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.handleHardwareBackPress();
        // this.registerMessageBar();
        this.parseCourseData(this.flightDetail);
        // this.checkFlightFromDatabase(this.flight);
    }

    componentWillUnmount() {
        console.log('componentWillUnmount');
        // this.unregisterMessageBar();
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

    parseCourseData(FlightDetailModel) {
        console.log('parseCourseData');
        // console.log('parseCourseData', JSON.stringify(FlightDetailModel));
        let flightPath = FlightDetailModel.getFlightPath();
        let flight = FlightDetailModel.getFlight();
        this.teeListAvailable = flightPath.getTeeInfoGender();
        this.selectType = flightPath.getSelectType();
        if (this.enterScoreView) {
            this.enterScoreView.setListTeeAvailable(this.teeListAvailable);
        }
        // this.getListTeeSelected(flight.getPathId1(), flight.getPathId2(), listCourse);
        this.pathList = flightPath.getPathList();

        if (this.refPopupSelectPath) {
            this.refPopupSelectPath.setPathList(this.pathList);
        }

    }

    getListTeeSelected(path_id1, path_id2, listCourse) {
        for (let obj of listCourse) {
            if ((path_id1 === obj.getPathId1() || path_id1 === obj.getPathId2())
                && (path_id2 === obj.getPathId1() || path_id2 === obj.getPathId2())) {
                this.teeListAvailable = obj.getTeeInfoGender();// this.getTeeList(obj.getTeeInfofull());// obj.getTeeInfo().getTeeList();
                this.Logger().log('................................ enter scorecard teeListAvailable', this.teeListAvailable);
                if (this.enterScoreView) {
                    this.enterScoreView.setListTeeAvailable(this.teeListAvailable);
                }
                break;
            }
        }
    }

    onBackPress() {
        let navigation = this.props.navigation;
        if (navigation) {
            // if(navigation.state.routeName === 'enter_flight_info_view')
            let { params } = navigation.state;
            if (params.refresh) {
                //refesh lai man hinh notify
                params.refresh();
            }
            if (this.isJustCreated && !this.checkIsEnterScore()) {
                this.props.navigation.goBack();
                this.onConfirmDeleteFlight();
                // this.deleteDatabaseFLight();
            } else {
                this.onEnterScoring(ENTER_SCORE_TYPE.SAVE_DATA);
            }

        }
        return true;
    }

    onMenuHeaderClick() {
        this.popupExportScorecard.show();
    }

    onEnterEachHoldTabSelected() {
        if (this.enterScoreView) {
            this.enterScoreView.syncFlightScore();
            this.setState({
                isEnterScoreTab: false
            });
        }
    }

    onEnterScoreTabSelected() {
        if (this.enterEachHoldView) {
            this.enterEachHoldView.syncFlightScore();
            this.setState({
                isEnterScoreTab: true
            });
        }
    }

    onSyncFlightScore(type, flightDetailModelState, user_selected, hold_selected, hold_user_selected) {
        console.log('onSyncFlightScore', this.isHostUser);
        // if (this.enterScoreView) {
        //     this.enterScoreView.setInitData(true);
        // }
        this.setState({
            userSelected: user_selected,
            holdSelected: hold_selected,
            holdUserSelected: hold_user_selected
        });

    }

    onAttachImage() {
        let flight = this.state.flightDetailModel.getFlight();
        this.popupAttachImage.show(flight.getUrlScorecard() ? true : false);
    }

    onViewImageClick() {
        let flight = this.state.flightDetailModel.getFlight();
        let uri = flight.getUrlScorecard();
        let uriArray = flight.getUrlScorecardArray();
        console.log('uri', uri);
        if (uri) {
            this.props.navigation.navigate('show_scorecard_image', {
                'imageUri': uri,
                'imgList': uriArray,
                'position': 0,
                onCloseImage: this.onCloseViewImage.bind(this)
            })
        } else {
            // notify image error
            this.showWarningMsg(this.t('image_empty'));
        }
    }

    onCloseViewImage() {
        this.rotateToPortrait();
    }

    async onTakePhotoClick() {
        let imageUri = await AppUtil.onTakePhotoClick(false);
        if (imageUri) {
            this.getAppUtil().resizeImage(imageUri.path, imageUri.width, imageUri.height, imageUri.size)
                .then(({ uri }) => {
                    console.log('uri', uri)
                    // this.requestUploadImage(uri);
                    this.requestUploadScorecard(uri);
                })
                .catch(err => {
                    console.log(err);
                    this.requestUploadScorecard(imageUri.path);
                    // this.requestUploadScorecard(imageUri);
                });
        }

    }

    async onImportGalleryClick() {
        let imageUri = await AppUtil.onImportGalleryClick(false);
        if (imageUri) {
            this.getAppUtil().resizeImage(imageUri.path, imageUri.width, imageUri.height, imageUri.size)
                .then(({ uri }) => {
                    console.log('uri', uri)
                    // this.requestUploadImage(uri);
                    this.requestUploadScorecard(uri);
                })
                .catch(err => {
                    console.log(err);
                    this.requestUploadScorecard(imageUri.path);
                    // this.requestUploadScorecard(imageUri);
                });
        }
        // this.requestUploadScorecard(imageUri);
    }

    requestUploadScorecard(imagePath) {
        let self = this;
        this.progressUpload.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.upload_scorecard(this.flightId);
        console.log('url', url);
        AppUtil.upload_mutil(url, [imagePath],
            this.onUploadSuccess.bind(this),
            (error) => {
                self.progressUpload.hideLoading();
                // console.log('showErrorMsg2')
                self.showErrorMsg(error);
            }, (progress) => {
                self.progressUpload.setProgress(progress);
            });
    }

    onUploadSuccess(jsonData) {
        console.log('onUploadSuccess', jsonData);
        this.progressUpload.hideLoading();
        if (jsonData != null && jsonData.hasOwnProperty('error_code')) {

            if (jsonData['error_code'] === 0) {
                try {
                    let url = jsonData['data'].flight.url_scorecards;
                    console.log('url_scorecards', url)
                    this.state.flightDetailModel.getFlight().setUrlScorecard(url);
                    this.state.flightDetailModel.getFlight().setUrlScorecardArray(jsonData['data'].flight.array_url_scorecard)
                    this.setState({
                        flightDetailModel: this.state.flightDetailModel
                    });
                    // this.updateDatabaseFlight(this.state.flightDetailModel.getFlight());
                    this.showSuccessMsg(this.t('upload_success'));
                } catch (error) {
                    console.log(error);
                }

            } else {
                // console.log('showErrorMsg3')
                this.showErrorMsg(jsonData['error_msg']);
            }
        }
    }

    checkScoreInvalid() {
        return this.state.flightDetailModel.getFlight().getUserRounds()[0].getHoldUserList().find((currentItem) => {
            return currentItem.getGross() === 0;
        })
    }

    checkIsEnterScore() {
        return this.state.flightDetailModel.getFlight().getUserRounds()[0].getHoldUserList().find((currentItem) => {
            return currentItem.getGross() != 0;
        })
    }

    checkUrlScorecard() {
        let flight = this.state.flightDetailModel.getFlight();
        if (flight.getUserRounds().length === 1) {
            if (!flight.getUrlScorecard()) {
                return false;
            }
        }
        return true;
    }

    onExportScorecardClick() {
        console.log('onExportScorecardClick', this.checkScoreInvalid());
        if (this.checkScoreInvalid()) {
            console.log('enter_full_hole');
            this.showWarningMsg(this.t('enter_full_hole'));
        } else if (!this.checkUrlScorecard()) {
            console.log('require_take_photo');
            this.showWarningMsg(this.t('require_take_photo'), () => { this.popupAttachImage.show() });
        } else {
            // show full 18 hole
            console.log('EXPORT_SCORECARD');
            this.onEnterScoring(ENTER_SCORE_TYPE.EXPORT_SCORECARD);
        }

    }

    showLoading() {
        if (this.loading) {
            this.loading.showLoading();
        }
    }

    hideLoading() {
        if (this.loading) {
            this.loading.hideLoading();
        }
    }

    onEnterScoring(enterType) {
        let flight = this.state.flightDetailModel.getFlight();
        if (this.isJustCreated) {
            global.shouldUpdateFinishFlight = true;
        }

        global.flightIdRefresh = flight.getId();
        if (!this.isEditFlight || JSON.stringify(flight) != this.oldFlightModel) {
            console.log('onEnterScoring', true);
            let self = this;
            this.showLoading();
            let url = this.getConfig().getBaseUrl() + ApiService.enter_scoring(flight.getId(), this.isEditFlight ? 1 : 0);
            console.log("url : ", url);
            let formData = {
                "players": flight.getUserRounds().map(item => {
                    return {
                        "user_id": item.getUserId(),
                        "tee_id": item.getTee(),
                        "holes": item.getHoldUserList()
                    }
                })
            };
            console.log('formData', JSON.stringify(formData));
            if (enterType === ENTER_SCORE_TYPE.EXPORT_SCORECARD) {
                Networking.httpRequestPost(url, this.onExportScorecardResponse.bind(this), formData, () => {
                    //time out
                    self.hideLoading();
                    // console.log('showErrorMsg4')
                    self.showErrorMsg(self.t('time_out'))
                });
            } else {
                Networking.httpRequestPost(url, this.onEnterScoringResponse.bind(this), formData, () => {
                    //time out
                    self.hideLoading();
                    // console.log('showErrorMsg5')
                    self.showErrorMsg(self.t('time_out'))
                });
            }
        }
        //  else if (this.isEditFlight && (this.oldFlightModel != JSON.stringify(this.state.flightDetailModel.getFlight()))) {
        //     console.log('onRequestEditScore');
        //     this.onRequestEditScore();
        // }
        else {
            console.log('onEnterScoring', false);
            if (enterType === ENTER_SCORE_TYPE.EXPORT_SCORECARD) {
                if (this.isEditFlight) {
                    this.props.navigation.replace('scorecard_view',
                        {
                            onCloseScorecard: this.onCloseScorecardListener.bind(this),
                            'FlightDetailModel': this.state.flightDetailModel,
                            'notifyId': this.notifyId,
                            'sourceDirection': 'EnterFlightScoreView',
                            'isHostUser': this.isHostUser,
                            'type': this.isPreview ? 'preview' : null
                        });
                } else {
                    this.props.navigation.navigate('scorecard_view',
                        {
                            onCloseScorecard: this.onCloseScorecardListener.bind(this),
                            'FlightDetailModel': this.state.flightDetailModel,
                            'notifyId': this.notifyId,
                            'sourceDirection': 'EnterFlightScoreView',
                            'isHostUser': this.isHostUser,
                            'type': this.isPreview ? 'preview' : null
                        });
                }

            } else {
                this.onEnterScoringResponse();
            }
        }


    }

    onEnterScoringResponse(jsonData) {
        this.hideLoading();
        let { navigation } = this.props;
        if (navigation.state.params.onDispatchCallback) {
            navigation.state.params.onDispatchCallback();

            if (!this.isPreview) {
                navigation.goBack();
            } else {
                navigation.replace('app_screen');
            }
        } else {
            if (!this.isPreview) {
                navigation.dispatch(resetAction);
            } else {
                let { navigation } = this.props;
                console.log('resetHomeView.isPreview', this.isPreview)
                navigation.replace('app_screen');
            }
        }

    }
    resetHomeView() {
        if (!this.isPreview) {
            this.props.navigation.dispatch(resetHome);
        } else {
            let { navigation } = this.props;
            console.log('resetHomeView.isPreview', this.isPreview)
            navigation.replace('app_screen');
        }
    }

    onExportScorecardResponse(jsonData) {
        console.log('onExportScorecardResponse', JSON.stringify(jsonData));
        this.hideLoading();
        this.model = new FlightDetailModel();
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            // this.model.setFlightPath(this.state.flightDetailModel.getFlightPath());
            let flight = this.model.getFlight();
            let playerList = flight.getUserRounds();
            let indexMe = playerList.findIndex((user) => {
                return this.uid.toString().indexOf('VGA') > -1 ? user.getUser().getUserId() === this.uid : user.getUserId() === this.uid;
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
            if (this.isEditFlight) {
                this.props.navigation.replace('scorecard_view',
                    {
                        onCloseScorecard: this.onCloseScorecardListener.bind(this),
                        'FlightDetailModel': this.model,
                        'sourceDirection': 'EnterFlightScoreView',
                        'notifyId': this.notifyId,
                        'isHostUser': isHostUser,
                        'type': this.isPreview ? 'preview' : null
                    });
            } else {
                this.props.navigation.navigate('scorecard_view',
                    {
                        onCloseScorecard: this.onCloseScorecardListener.bind(this),
                        'FlightDetailModel': this.model,
                        'sourceDirection': 'EnterFlightScoreView',
                        'notifyId': this.notifyId,
                        'isHostUser': isHostUser,
                        'type': this.isPreview ? 'preview' : null
                    });
            }

            // this.deleteDatabaseFLight();
        } else {
            // console.log('showErrorMsg6')
            this.showErrorMsg(jsonData['error_msg']);
        }
    }

    onCloseScorecardListener() {
        this.Mxpo.ScreenOrientation.allow(this.Mxpo.ScreenOrientation.Orientation.PORTRAIT);

    }

    onDeleteFlightClick() {
        this.popupDeleteFlight.show();
    }

    onConfirmDeleteFlight(isPopup = false) {
        this.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.out_flight(this.flightId);
        console.log('url', url);
        Networking.httpRequestGet(url, this.onDeleteFlightResponse.bind(this, this.flightId, isPopup), () => {
            //time out
            self.hideLoading();
            // console.log('showErrorMsg7')
            self.showErrorMsg(self.t('time_out'))
        });
    }

    onDeleteFlightResponse(flightId, isPopup, jsonData) {
        this.hideLoading();
        if (!this.isJustCreated || isPopup) {
            if (jsonData && jsonData.hasOwnProperty('error_code')) {
                if (jsonData['error_code'] === 0) {
                    if (jsonData.hasOwnProperty("error_msg")) {
                        let msg = jsonData['error_msg']; //"Bạn đã ra khỏi flight thành công"
                        this.showSuccessMsg(msg);
                    }
                    deleteFlightById(flightId);
                    if (this.props.navigation.state.params.onDispatchCallback) {
                        this.props.navigation.state.params.onDispatchCallback();
                    }
                    this.props.navigation.dispatch(resetAction);
                    // this.deleteDatabaseFLight();
                } else {
                    // console.log('showErrorMsg8')
                    this.showErrorMsg(jsonData['error_msg']);
                }
            }
        }

    }

    onLongPressPlayerListener(player, index) {
        this.playerSelected = player;
        this.playerPositionSelected = index;
        if (this.isHostUser || (!this.isHostUser && index === 0)) {
            this.popupChangePlayerInfo.show();
        } else {
            this.showWarningMsg(this.t('guest_cannot_edit_other_people'));
        }

    }

    onEditPlayerClick() {
        // let user = this.state.flightDetailModel.getFlight().getUserRounds()[this.playerPositionSelected];
        // this.props.navigation.navigate('change_tee_view',
        //     {
        //         onChangeTeeCallback: this.onChangeTeeCallback.bind(this, user),
        //         'PlayerSelected': user,
        //         'flightName': this.state.flightDetailModel.getFlight().getFlightName(),
        //         "teeListAvailable": this.teeListAvailable
        //     }
        // );
        this.refPopupSelectTeeView.setVisible(this.teeListAvailable, this.playerPositionSelected);
    }

    onChangeTeeCallback(user, teeObj) {
        user.getUser().setDefaultTeeID(teeObj.getTeeColor());
        user.setTeeId(teeObj.getTeeColor());
        user.setTee(teeObj.getTeeColor());

        this.setState({
            flightDetailModel: this.state.flightDetailModel
        });
        // this.updateDatabaseFlight(this.state.flightDetailModel.getFlight());
    }

    onTeeSelectedListener(data, playerPosition) {
        // this.isTeeInvalid = true;
        console.log('onTeeSelectedListener', data, playerPosition)
        let {
            flightDetailModel
        } = this.state;
        let userRounds = flightDetailModel.getFlight().getUserRounds();
        if (userRounds.length > playerPosition) {
            let player = userRounds[playerPosition];
            player.getUser().setDefaultTeeID(data.tee);
            player.setTeeId(data.tee);
            player.setTee(data.tee);

            this.setState({
                flightDetailModel: flightDetailModel
            });
        }

    }

    /**
     * 
     * @param {*} type 0: front, 1: back
     */
    onChangePathCallback(type, pathSelected) {
        this.pathType = type;
        this.setState({
            pathNeedChange: pathSelected
        });
        if (this.selectType != 1) {
            this.popupChangePath.show();
        } else {
            this.showWarningMsg(this.t('cannot_change_path'));
        }
    }

    onAddMorePath() {
        this.refPopupSelectPath.show();
    }

    onPathAddCallback(path) {
        let flight = this.state.flightDetailModel.getFlight();
        console.log('onPathAddCallback', path)
        if (this.type_flight === 1) { // 18 hole
            let path1 = this.pathList.find((path) => {
                return path.getId() === flight.getPathId1();
            });
            let path2 = this.pathList.find((path) => {
                return path.getId() === flight.getPathId2();
            });
            this.requestUpdateFlight(path1, path2, path, 3, null, false);
        } else if (this.type_flight === 2) { // 9 hole
            let path1 = this.pathList.find((path) => {
                return path.getId() === flight.getPathId1();
            });
            this.requestUpdateFlight(path1, path, null, 1, null, false);
        }

    }

    onPathChanged(path) {
        let flight = this.state.flightDetailModel.getFlight();
        if (this.pathType === 0) {
            let path2 = null;
            let path3 = null;
            if (flight.getPathId2()) {
                path2 = this.pathList.find((path) => {
                    return path.getId() === flight.getPathId2();
                });
            }
            if (flight.getPathId3()) {
                path3 = this.pathList.find((path) => {
                    return path.getId() === flight.getPathId3();
                });
            }
            this.requestUpdateFlight(path, path2, path3, this.type_flight, null, true);
        } else if (this.pathType === 1) {
            let path1 = null;
            let path3 = null;
            if (flight.getPathId1()) {
                path1 = this.pathList.find((path) => {
                    return path.getId() === flight.getPathId1();
                });
            }
            if (flight.getPathId3()) {
                path3 = this.pathList.find((path) => {
                    return path.getId() === flight.getPathId3();
                });
            }
            this.requestUpdateFlight(path1, path, path3, this.type_flight, null, true);
        } else {
            let path1 = null;
            let path2 = null;
            if (flight.getPathId1()) {
                path1 = this.pathList.find((path) => {
                    return path.getId() === flight.getPathId1();
                });
            }
            if (flight.getPathId2()) {
                path2 = this.pathList.find((path) => {
                    return path.getId() === flight.getPathId2();
                });
            }
            this.requestUpdateFlight(path1, path2, path, this.type_flight, null, true);
        }
    }

    requestUpdateFlight(path1 = null, path2 = null, path3 = null, type_flight = 1, timestamp = null, isChangePath = true) {
        this.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.flight_update(this.flightId, type_flight);
        console.log("url : ", url);
        let formData = {
            "path1": path1,
            "path2": path2,
            "path3": path3,
            "type": type_flight,
            "teetime": timestamp
        };
        console.log("formData: ", formData);
        Networking.httpRequestPost(url, this.onUpdateFlightResponse.bind(this, isChangePath, type_flight), formData, () => {
            //time out
            self.hideLoading();
            // console.log('showErrorMsg9')
            self.showErrorMsg(self.t('time_out'))
        });
    }

    onUpdateFlightResponse(isChangePath, type_flight, jsonData) {
        // console.log("jsonData: ", jsonData);
        this.hideLoading();
        this.model = new FlightDetailModel();
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {

            this.type_flight = type_flight;
            let flightHole = this.model.getFlightHoles();
            let flightDetail = this.state.flightDetailModel;
            let flight = flightDetail.getFlight();
            let userRounds = flight.getUserRounds();
            let path1 = this.model.getFlight().getPathId1();
            let path2 = this.model.getFlight().getPathId2();
            let path3 = this.model.getFlight().getPathId3();
            flight.setPathId1(path1);
            flight.setPathId2(path2);
            flight.setPathId3(path3);
            flight.setFlightName(this.model.getFlight().getFlightName());

            if (isChangePath) {
                if (this.pathType === 0) {
                    userRounds.map((userRoundModel) => {
                        let holes = flightHole.slice(0, 9).map(a => Object.assign(new HoleUserModel, a));
                        userRoundModel.getHoldUserList().splice(0, 9, ...holes);

                    })
                } else if (this.pathType === 1) {
                    userRounds.map((userRoundModel) => {
                        let holes = flightHole.slice(9, 18).map(a => Object.assign(new HoleUserModel, a));
                        userRoundModel.getHoldUserList().splice(9, 9, ...holes);
                    })
                } else if (this.pathType === 2) {
                    userRounds.map((userRoundModel) => {
                        let holes = flightHole.slice(9, 18).map(a => Object.assign(new HoleUserModel, a));
                        userRoundModel.getHoldUserList().splice(18, 9, ...holes);
                    })
                }

                flightDetail.getFlightHoles().splice(0, flightHole.length, ...flightHole);
                this.setState({
                    flightDetailModel: flightDetail
                }, () => {
                    this.enterScoreView.setDataFlight(flightDetail);
                    this.requestFacilityNew(path1, path2, path3);
                });
            } else {
                if (this.type_flight === 1) {
                    // add from 9 to 18 hole
                    userRounds.map((userRoundModel) => {
                        let holes = flightHole.slice(9, 18).map(a => Object.assign(new HoleUserModel, a));
                        userRoundModel.setHoldUserList([...userRoundModel.getHoldUserList(), ...holes]);
                    })
                } else if (this.type_flight === 3) {
                    userRounds.map((userRoundModel) => {
                        let holes = flightHole.slice(18, 27).map(a => Object.assign(new HoleUserModel, a));
                        userRoundModel.setHoldUserList([...userRoundModel.getHoldUserList(), ...holes]);
                    })
                }

                try {
                    flight.setTypeFlight(this.type_flight);
                    this.setState({
                        flightDetailModel: flightDetail
                    }, () => {
                        this.enterScoreView.setDataFlight(flightDetail, this.type_flight);
                        this.requestFacilityNew(path1, path2, path3);
                    });
                } catch (error) {
                    console.log('this.pathList.error', error)
                }
            }
            global.flightIdRefresh = this.flightId;
            // this.updateDatabaseFlight(flight);
        } else {
            // console.log('showErrorMsg10')
            this.showErrorMsg(jsonData['error_msg']);
        }
    }

    requestFacilityNew(path1, path2, path3) {
        if (this.selectType === 2) {
            let holeNumber = this.type_flight === 2 ? 9 : this.type_flight === 3 ? 27 : 18
            if (holeNumber === 9 && !path1) return;
            if (holeNumber === 27 && !path2) return;
            console.log('path1_selected', path1, path2, path3)
            let url = this.getConfig().getBaseUrl() + ApiService.get_course_by_path(this.facilityId, path1, path2, path3);
            console.log('url: ', url);
            let self = this;
            Networking.httpRequestGet(url, (jsonData) => {
                console.log('requestFacilityNew', jsonData);
                if (jsonData.error_code === 0) {
                    let courseModel = new CourseModel();
                    courseModel.parseData(jsonData.data);
                    self.teeListAvailable = courseModel.getTeeInfoGender();
                    // self.setCoursePathCallback(2);
                    if (self.enterScoreView) {
                        self.enterScoreView.setListTeeAvailable(self.teeListAvailable);
                    }
                }

            }, () => {
            })
        }
    }

    onDeletePlayerClick() {
        if (this.playerPositionSelected != 0) {
            this.popupDeletePlayer.show();
        }
    }

    onConfirmDeletePlayer() {
        this.state.flightDetailModel.getFlight().getUserRounds().splice(this.playerPositionSelected, 1);
        // this.setState({
        //     flightDetailModel: this.state.flightDetailModel
        // });
        if (this.enterScoreView) {
            this.enterScoreView.removePlayerResponse(this.state.flightDetailModel, this.playerPositionSelected);
        } else if (this.enterEachHoldView) {
            this.enterEachHoldView.removePlayerResponse(this.state.flightDetailModel, this.playerPositionSelected);
        }

        // this.updateDatabaseFlight(this.state.flightDetailModel.getFlight());
    }

    // updateDatabaseFlight(flight) {
    //     let sql = `update ${global.db_table[0].name} set ${global.db_table[0].colum[1]} = ? where ${global.db_table[0].colum[0]} = ?`;
    //     this.getDatabase().transaction(
    //         tx => {
    //             tx.executeSql(sql,
    //                 [JSON.stringify(flight), this.flightId],
    //                 (success) => { console.log('updateDatabaseFlight success') },
    //                 (error) => console.log('updateDatabaseFlight error', error));
    //         }
    //     )
    // }

    // deleteDatabaseFLight() {
    //     let sql = `delete from ${global.db_table[0].name} where ${global.db_table[0].colum[0]} = ?`;
    //     this.getDatabase().transaction(
    //         tx => {
    //             tx.executeSql(sql,
    //                 [this.flightId],
    //                 (success) => { console.log('deleteDatabaseFLight success') },
    //                 (error) => console.log('deleteDatabaseFLight error', error));
    //         }
    //     )
    // }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    container_segment: {
        flexDirection: 'row',
        height: verticalScale(50),
        backgroundColor: '#F2F2F2',
        paddingLeft: scale(15),
        paddingRight: scale(15),
        paddingTop: verticalScale(6),
        paddingBottom: verticalScale(6),
    },
    touchable_enter_hold: {
        flex: 1,
        backgroundColor: 5,
        borderColor: '#00ABA7',
        borderWidth: 1,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    touchable_enter_all: {
        flex: 1,
        borderColor: '#00ABA7',
        backgroundColor: 5,
        borderWidth: 1,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn_title: {
        fontSize: fontSize(17, scale(3)),// 17
    },
    enter_score_content: {
        flex: 1
    }
});