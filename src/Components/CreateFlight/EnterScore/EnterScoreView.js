
import React from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import PlayerListView from '../Items/PlayerListView';
import HandicapKeyboard from '../Items/HandicapKeyboard';
import InputScoreItemView from '../Items/InputScoreItemView';
import AppUtil from '../../../Config/AppUtil';
import ApiService from '../../../Networking/ApiService';
import HandicapFacilityModel from '../../../Model/Facility/HandicapFacilityModel';
import Networking from '../../../Networking/Networking';
import UserRoundModel from '../../../Model/CreateFlight/Flight/UserRoundModel';
import UserProfileModel from '../../../Model/Home/UserProfileModel';
import MyView from '../../../Core/View/MyView';
import EnterScorePathOut from '../Items/EnterScorePathOut';
import EnterScorePathIn from '../Items/EnterScorePathIn';
import MsgInputScoreMode from '../Items/MsgInputScoreMode';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import HoleUserModel from '../../../Model/CreateFlight/Flight/HoleUserModel';
import AnimatedLinearGradient from 'react-native-animated-linear-gradient';
import Swiper from 'react-native-swiper';

var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

const DURATION_DISMISS = 5000;

const HOLD_LENGTH = 18;

const colorAnimate = {
    left: [
        '#FFFFFF',
        '#00ABA7',
    ],
    right: [
        '#00ABA7',
        '#FFFFFF',
    ]
}

export default class EnterScoreView extends BaseComponent {

    static defaultProps = {
        flightDetailModel: {},
        userSelected: 0,
        holdSelected: 0,
        holdUserSelected: [0, 0, 0, 0],
        isHostUser: false,
        database: null
    }

    constructor(props) {
        super(props);
        let alert_is_show = false;
        this.path1_selected;
        this.path2_selected;
        this.path3_selected;
        this.flight = this.props.flightDetailModel.getFlight();
        this.type_flight = this.flight.getTypeFlight(); // 1: length = 18, 2: length = 9, 3: length: 27
        console.log('EnterScoreView', this.type_flight)
        HOLD_LENGTH = this.type_flight === 2 ? 9 : this.type_flight === 3 ? 27 : 18;
        console.log('EnterScoreView.HOLD_LENGTH', HOLD_LENGTH)
        this.flightId = this.flight.getId();
        this.user_ids = this.flight.getUserRounds().map(item => { return item.getUserId() });
        this.hold_user_selected = this.props.holdUserSelected;
        // this.db = this.getDatabase();
        this.playerList = this.flight.getUserRounds();
        this.userSelected = this.props.userSelected;
        this.isHostUser = this.props.isHostUser;
        this.disableChangeScore = !this.isHostUser && this.userSelected != 0;
        this.hold_selected = this.props.holdSelected;
        this.isGrossMode = false;
        this.scoreBoard = [];
        this.refScrollView = [];
        this.listTeeAvailable = [];
        this.selectType = 2;
        this.state = {
            flightDetailModelState: this.props.flightDetailModel,
            isShowAnimation: false,
            animateDirection: colorAnimate.left
        }
        this.flight_holes = this.state.flightDetailModelState.getFlightHoles();

        this.onFrontScoreSelected = this.onFrontScoreSelected.bind(this);
        this.onGuestChangePathWarning = this.onGuestChangePathWarning.bind(this);
        this.onChangeFontPath = this.onChangeFontPath.bind(this);
        this.onBackScoreSelected = this.onBackScoreSelected.bind(this);
        this.onChangeBackPath = this.onChangeBackPath.bind(this);
        this.onChangeExtrasPath = this.onChangeExtrasPath.bind(this);
        this.onViewScoreBoardChange = this.onViewScoreBoardChange.bind(this);
        this.onAddPlayerClick = this.onAddPlayerClick.bind(this);
        this.onGuestAddPlayerWarning = this.onGuestAddPlayerWarning.bind(this);
        this.onPlayerChangeSelected = this.onPlayerChangeSelected.bind(this);
        this.onLongPressPlayerListener = this.onLongPressPlayerListener.bind(this);
        this.onHandicapKeyboardClick = this.onHandicapKeyboardClick.bind(this);
        this.onAttachImage = this.onAttachImage.bind(this);
        this.onChangeInputMode = this.onChangeInputMode.bind(this);
        this.onAddMorePath = this.onAddMorePath.bind(this);
    }

    clone_user_model() {
        let list = [];
        for (let holeUserModel of this.flight_holes) {
            let userModel = new HoleUserModel();
            userModel.tee_club = holeUserModel.getTeeClub();
            userModel.tee_direction = holeUserModel.getTeeDirection();
            userModel.sand = holeUserModel.getSand();
            userModel.putt = holeUserModel.getPutt();
            userModel.ob = holeUserModel.getOb();
            userModel.water = holeUserModel.getWater();
            userModel.hole_id = holeUserModel.getId();
            userModel.round_id = holeUserModel.getRoundId();
            userModel.hole_stt = holeUserModel.getHoleStt();
            userModel.gross = holeUserModel.getGross();
            userModel.par = holeUserModel.getPar();
            userModel.length = holeUserModel.getLength();
            userModel.hole_length = holeUserModel.getHoleLength();
            userModel.hole_index = holeUserModel.getHoleIndex();
            userModel.id = holeUserModel.getId();
            userModel.black_length = holeUserModel.getBlackLength();
            userModel.gold_length = holeUserModel.getGoldLength();
            userModel.blue_length = holeUserModel.getBlueLength();
            userModel.white_length = holeUserModel.getWhiteLength();
            userModel.red_length = holeUserModel.getRedLength();

            list.push(userModel);
        }
        return list;
    }

    setListTeeAvailable(listTee = []) {
        if (listTee)
            this.listTeeAvailable = listTee;
    }

    renderPath2(selectType, backPath, isHostUser, index) {
        if (this.type_flight === 1 || this.type_flight === 3) {
            return (
                <EnterScorePathIn
                    ref={(enterScorePathIn) => { this.scoreBoard[[index, 1]] = enterScorePathIn; }}
                    isHostUser={this.props.isHostUser}
                    onBackScoreSelected={this.onBackScoreSelected}
                    onGuestChangePathWarning={this.onGuestChangePathWarning}
                    selectType={selectType}
                    onChangeBackPath={this.onChangeBackPath}
                    pathName={backPath}
                />
            )
        } else {
            return null;
        }
    }

    renderPath3(selectType, backPath, isHostUser, index) {
        console.log('renderPath3', this.type_flight)
        if (this.type_flight === 3) {
            return (
                <EnterScorePathIn
                    ref={(enterScorePathIn) => { this.scoreBoard[[index, 2]] = enterScorePathIn; }}
                    isHostUser={this.props.isHostUser}
                    onBackScoreSelected={this.onBackScoreSelected}
                    onGuestChangePathWarning={this.onGuestChangePathWarning}
                    selectType={selectType}
                    onChangeBackPath={this.onChangeExtrasPath}
                    pathName={backPath}
                    type_flight={this.type_flight}
                />
            )
        } else if (!this.disableChangeScore && selectType != 1) {
            return (
                <TouchableOpacity onPress={this.onAddMorePath}>
                    <View style={styles.touchable_add_path}>
                        <Image
                            style={styles.img_add_path}
                            source={this.getResources().add_phone} />
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_add_path}
                            textDecorationLine={'underline'}>{this.t('add_path')}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else {
            return null;
        }
    }

    render() {
        let flightDetailModel = this.state.flightDetailModelState;
        let flight = flightDetailModel.getFlight();
        let playerList = flight.getUserRounds();
        this.type_flight = flight.getTypeFlight(); // 1: length = 18, 2: length = 9, 3: length: 27
        let flightPath = flightDetailModel.getFlightPath();
        let frontPath = '';
        let backPath = '';
        let extrasPath = '';

        let pathList = flightPath.getPathList();
        this.selectType = flightPath.getSelectType();
        if (this.selectType === 1) {
            backPath = frontPath = pathList.find((path) => {
                return path.getId() === flight.getPathId1();
            }).getName();
        } else {
            this.path1_selected = pathList.find((path) => {
                return path.getId() === flight.getPathId1();
            });
            this.path2_selected = pathList.find((path) => {
                return path.getId() === flight.getPathId2();
            });

            this.path3_selected = pathList.find((path) => {
                return path.getId() === flight.getPathId3();
            });
            frontPath = this.path1_selected ? this.path1_selected.getName() : '';

            backPath = this.path2_selected ? this.path2_selected.getName() : '';

            extrasPath = this.path3_selected ? this.path3_selected.getName() : '';
        }
        let scoreBoard = playerList.map((player, index) => {
            return (
                <ScrollView
                    ref={(refScrollView) => { this.refScrollView[index] = refScrollView }}
                    style={styles.container_input}
                    contentContainerStyle={{ justifyContent: 'center', flexGrow: 1 }}>
                    {/* Đường đi */}
                    <EnterScorePathOut
                        ref={(enterScorePathOut) => { this.scoreBoard[[index, 0]] = enterScorePathOut; }}
                        isHostUser={this.isHostUser}
                        onFrontScoreSelected={this.onFrontScoreSelected}
                        onGuestChangePathWarning={this.onGuestChangePathWarning}
                        selectType={this.selectType}
                        onChangeFontPath={this.onChangeFontPath}
                        pathName={frontPath}
                    />

                    {this.renderPath2(this.selectType, backPath, this.isHostUser, index)}
                    {this.renderPath3(this.selectType, extrasPath, this.isHostUser, index)}
                </ScrollView>
            )
        })

        let swiperView =
            (
                <Swiper
                    ref={(swiper) => { this.swiper = swiper; }}
                    showsButtons={false}
                    loop={false}
                    showsPagination={false}
                    onIndexChanged={this.onViewScoreBoardChange}
                    index={this.userSelected}
                    key={scoreBoard.length}
                >
                    {scoreBoard}
                </Swiper>
            )

        return (
            <View style={styles.container}>

                {/* Danh sách player */}
                <PlayerListView
                    ref={(playerListView) => { this.playerListView = playerListView; }}
                    listPlayer={this.playerList}
                    userSelected={this.userSelected}
                    onAddPlayerClick={this.onAddPlayerClick}
                    onGuestAddPlayerWarning={this.onGuestAddPlayerWarning}
                    onPlayerSelected={this.onPlayerChangeSelected}
                    onLongPressPlayerListener={this.onLongPressPlayerListener}
                    isHostUser={this.isHostUser} />

                <View style={styles.container_center}>
                    {swiperView}
                    <MessageBarAlert ref="info_alert" />
                </View>

                {/* bàn phím */}
                <HandicapKeyboard
                    ref={(handicapKeyboard) => { this.handicapKeyboard = handicapKeyboard; }}
                    onScore={this.onHandicapKeyboardClick}
                    onAttachImage={this.onAttachImage}
                    onChangeInputMode={this.onChangeInputMode} />

            </View>
        );
    }

    componentDidMount() {
        // console.log('componentDidMount.EnterScoreView');
        MessageBarManager.registerMessageBar(this.refs.info_alert);
        this.setPlayerListView(this.playerList);
        for (let i = 0; i < this.playerList.length; i++) {
            this.scoreBoard[[i, 0]].setOutData(this.state.flightDetailModelState, this.userSelected, this.hold_selected, this.isGrossMode, this.isHostUser);
            if (this.scoreBoard[[i, 1]])
                this.scoreBoard[[i, 1]].setInData(this.state.flightDetailModelState, this.userSelected, this.hold_selected, this.isGrossMode);
            if (this.scoreBoard[[i, 2]])
                this.scoreBoard[[i, 2]].setInData(this.state.flightDetailModelState, this.userSelected, this.hold_selected, this.isGrossMode);
        }

    }

    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
    }

    setDataFlight(flightDetailModel, type_flight) {
        this.setState({
            flightDetailModelState: flightDetailModel
        }, () => {
            if (type_flight) {
                this.type_flight = type_flight;
                HOLD_LENGTH = this.type_flight === 2 ? 9 : this.type_flight === 3 ? 27 : 18;
            }

            for (let i = 0; i < this.playerList.length; i++) {
                this.scoreBoard[[i, 0]].setOutData(this.state.flightDetailModelState, this.userSelected, this.hold_selected, this.isGrossMode, this.isHostUser);
                if (this.scoreBoard[[i, 1]])
                    this.scoreBoard[[i, 1]].setInData(this.state.flightDetailModelState, this.userSelected, this.hold_selected, this.isGrossMode);
                if (this.scoreBoard[[i, 2]])
                    this.scoreBoard[[i, 2]].setInData(this.state.flightDetailModelState, this.userSelected, this.hold_selected, this.isGrossMode);
            }
        })
    }

    registerMessage() {
        MessageBarManager.registerMessageBar(this.refs.info_alert);
    }

    setInitData(isHostUser) {
        this.isHostUser = isHostUser;
        this.playerListView.initData(this.isHostUser);
    }

    refreshData(flightDetailModel) {
        MessageBarManager.registerMessageBar(this.refs.info_alert);
        if (flightDetailModel) {
            this.setPlayerListView(flightDetailModel.getFlight().getUserRounds());
            this.user_ids = flightDetailModel.getFlight().getUserRounds().map(item => { return item.getUserId() });
        }
    }

    onAddPlayerClick(index) {
        this.props.navigation.navigate('search_user_view', { onSearchCallback: this.onSearchCallback.bind(this), 'user_ids': this.user_ids });
    }

    onGuestAddPlayerWarning() {
        this.showAlertMsg(this.t('cannot_add_player'));
    }

    onSearchCallback(friendItemModel) {
        let { flightDetailModelState } = this.state;
        // let clone = Object.assign({},flightDetailModelState);
        if (friendItemModel != null) {
            let userRoundModel = new UserRoundModel();
            let user = new UserProfileModel();
            user.setAvatar(friendItemModel.getAvatar());
            user.setFullname(friendItemModel.getFullname());
            user.setDefaultTeeID(friendItemModel.getDefaulTeeId());
            user.setUserId(friendItemModel.getUserId());

            userRoundModel.setUser(user);
            userRoundModel.setUserId(friendItemModel.getId());
            userRoundModel.setHoldUserList(this.clone_user_model());
            //console.log("flight holes : ",this.state.flightDetailModelState.getFlightHoles());
            let teeAvailable = this.listTeeAvailable.find((tee) => {
                return String(tee.tee).toLowerCase() === String(friendItemModel.getDefaulTeeId()).toLowerCase();
            })
            let players = this.state.flightDetailModelState.getFlight().getUserRounds();
            if (teeAvailable) {
                userRoundModel.setTee(friendItemModel.getDefaulTeeId());
            } else {
                userRoundModel.setTee(players[0].getTee());
            }

            if (players.length < 4) {
                players.push(userRoundModel);
                this.setPlayerListView(players);

                this.setState({
                    flightDetailModelState: this.state.flightDetailModelState
                }, () => {
                    for (let i = 0; i < this.playerList.length; i++) {
                        this.scoreBoard[[i, 0]].setOutData(this.state.flightDetailModelState, this.userSelected, this.hold_selected, this.isGrossMode, this.isHostUser);
                        if (this.scoreBoard[[i, 1]])
                            this.scoreBoard[[i, 1]].setInData(this.state.flightDetailModelState, this.userSelected, this.hold_selected, this.isGrossMode);
                        if (this.scoreBoard[[i, 2]])
                            this.scoreBoard[[i, 2]].setInData(this.state.flightDetailModelState, this.userSelected, this.hold_selected, this.isGrossMode);
                    }
                })

                this.user_ids.push(friendItemModel.getId());
                // this.checkHandicapFacility(players, friendItemModel.getId(), this.state.flightDetailModelState.getFlight());
                if(this.selectType === 1){
                    this.checkHandicapFacilityPlayerOld(players, {tee: userRoundModel.getTee()},friendItemModel.getId())
                } else {
                    this.checkHandicapFacilityPlayerNew(players, {tee: userRoundModel.getTee()},friendItemModel.getId())
                }
                
            }
        }
    }

    checkHandicapFacility(playerList, user_id, course) {
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.check_handicap_facility();
        console.log("url : ", url);
        let formData = {
            "user_ids": [user_id],
            "course":
                {
                    "facility_id": course.getFacilityId(),
                    "path_id1": course.getPathId1(),
                    "path_id2": course.getPathId2(),
                    "gold_slope": course.getGoldSlope(),
                    "blue_slope": course.getBlueSlope(),
                    "white_slope": course.getWhiteSlope(),
                    "red_slope": course.getRedSlope(),
                    "black_slope": course.getBlackSlope(),
                }
        };
        console.log('formData', JSON.stringify(formData));
        Networking.httpRequestPost(url, (jsonData) => {
            self.model = new HandicapFacilityModel();
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                playerList.find((element) => element.getUserId() === user_id)
                    .setCoursesHandicapDisplay(self.model.getListHandicapFacility()[0].getDisplay_course().getValue());
                self.setPlayerListView(playerList);
            } else {
                // self.showErrorMsg(self.model.getErrorMsg());
            }
        }, formData);
    }

    checkHandicapFacilityPlayerOld(playerList, teeObject, user_id, isPersonal = true) {
        let url = this.getConfig().getBaseUrl() + ApiService.check_handicap_facility();
        console.log("url : ", url);
        let {
            flightDetailModelState
        } = this.state;
        let flight = flightDetailModelState.getFlight();
        let teeInfo = flightDetailModelState.getFlightPath().getTeeInfo();

        let course_obj = {
            "facility_id": flight.getFacilityId(),
            "path_id1": flight.getPathId1(),
            "path_id2": flight.getPathId2(),
            "path_id3": flight.getPathId3(),
        }
        for (let tee of teeInfo) {
            course_obj[`${tee.tee}_slope`] = tee.slope;
        }

        let formData = {
            "user_ids": [user_id],
            "course": course_obj,
            // "tee": teeObject.tee,
        };
        if (teeObject) {
            formData.tee = teeObject.tee;
        }
        console.log('checkHandicapFacilityPlayerOld', JSON.stringify(formData))
        Networking.httpRequestPost(url, (jsonData) => {
            try {
                console.log('HandicapFacilityModel', jsonData)
                this.model = new HandicapFacilityModel();
                this.model.parseData(jsonData);
                if (this.model.getErrorCode() === 0) {

                    let array_handicap = this.model.getCourseHandicap();

                    if (isPersonal) {
                        let userId = this.getAppUtil().replaceUser(user_id);
                        let player = playerList.find((playerItem) => {
                            let playerId = this.getAppUtil().replaceUser(playerItem.getUserId());
                            return playerId === userId;
                        })
                        if(player){
                            let handicap_obj = array_handicap[0];
                            player.setCoursesHandicapDisplay(handicap_obj.display_course.value);
                        }
                    }
                    //  else {
                    //     playerList.map((player, index) => {
                    //         // if (teeObject) {
                    //         //     player.teeObject = teeObject;
                    //         // }
                    //         let user_id = this.getAppUtil().replaceUser(player.userId);
                    //         let handicap_obj = array_handicap.find(player => parseInt(player.user_id) === user_id);

                    //         if (handicap_obj) {
                    //             let tee = handicap_obj.display_course.tee;
                    //             player.setHandicapFacility(handicap_obj.display_course.value);
                    //             player.teeObject = {
                    //                 tee: tee,
                    //                 color: tee
                    //             }
                    //         }
                    //     })
                    // }

                    // this.setState({
                    //     playerList: playerList
                    // }, () => {
                    //     this.setPlayerChangeCallback(playerList);
                    // })
                    this.setPlayerListView(playerList);
                } else {
                    this.showErrorMsg(jsonData['error_msg']);
                }
            } catch (error) {
                console.log('checkHandicapFacilityAllUser.error', error)
            }

        }, formData);
    }

    checkHandicapFacilityPlayerNew(playerList, teeObject, user_id, isPersonal = true) {
        let url = this.getConfig().getBaseUrl() + ApiService.check_handicap_by_path();
        console.log("url : ", url);

        let {
            flightDetailModelState
        } = this.state;
        let flight = flightDetailModelState.getFlight();

        let formData = {
            "user_ids": [user_id],
            "facility_id": flight.getFacilityId(),
            "path_id1": flight.getPathId1(),
            "path_id2": flight.getPathId2(),
            "path_id3": flight.getPathId3(),
        };
        if (teeObject) {
            formData.tee = teeObject.tee;
        }
        console.log('checkHandicapFacilityPlayerNew', JSON.stringify(formData))
        Networking.httpRequestPost(url, (jsonData) => {
            try {
                console.log('HandicapFacilityModel', jsonData)
                this.model = new HandicapFacilityModel();
                this.model.parseData(jsonData);
                if (this.model.getErrorCode() === 0) {

                    let array_handicap = this.model.getCourseHandicap();

                    if (isPersonal) {
                        let userId = this.getAppUtil().replaceUser(user_id);
                        let player = playerList.find((playerItem) => {
                            let playerId = this.getAppUtil().replaceUser(playerItem.getUserId());
                            return playerId === userId;
                        })
                        if(player){
                            let handicap_obj = array_handicap[0];
                            player.setCoursesHandicapDisplay(handicap_obj.display_course.value);
                        }
                    }
                    //  else {
                    //     playerList.map((player, index) => {
                    //         // if (teeObject) {
                    //         //     player.teeObject = teeObject;
                    //         // }
                    //         let user_id = this.getAppUtil().replaceUser(player.userId);
                    //         let handicap_obj = array_handicap.find(player => parseInt(player.user_id) === user_id);

                    //         if (handicap_obj) {
                    //             let tee = handicap_obj.display_course.tee;
                    //             player.setHandicapFacility(handicap_obj.display_course.value);
                    //             player.teeObject = {
                    //                 tee: tee,
                    //                 color: tee
                    //             }
                    //         }
                    //     })
                    // }

                    // this.setState({
                    //     playerList: playerList
                    // }, () => {
                    //     this.setPlayerChangeCallback(playerList);
                    // })
                    this.setPlayerListView(playerList);
                } else {
                    this.showErrorMsg(jsonData['error_msg']);
                }
            } catch (error) {
                console.log('checkHandicapFacilityAllUser.error', error)
            }

        }, formData);
    }

    onSwipeLeft(state) {
        console.log('onSwipeLeft');
        if (this.userSelected < this.playerList.length - 1) {
            this.userSelected++;
            this.disableChangeScore = !this.isHostUser && this.userSelected != 0;
            this.hold_selected = this.hold_user_selected[this.userSelected];
            this.playerListView.setPlayerSelected(this.userSelected);
            this.setState({
                animateDirection: colorAnimate.left,
                isShowAnimation: true
            }, () => {
                setTimeout(() => {
                    this.setState({
                        isShowAnimation: false
                    });
                }, 1000);
            });
        }
    }

    onSwipeRight(state) {
        console.log('onSwipeRight');
        if (this.userSelected > 0) {
            this.userSelected--;
            this.disableChangeScore = !this.isHostUser && this.userSelected != 0;
            this.hold_selected = this.hold_user_selected[this.userSelected];
            this.playerListView.setPlayerSelected(this.userSelected);
            this.setState({
                animateDirection: colorAnimate.right,
                isShowAnimation: true
            }, () => {
                setTimeout(() => {
                    this.setState({
                        isShowAnimation: false
                    });
                }, 1000);
            });
        }
    }

    onViewScoreBoardChange(index) {
        console.log('onViewScoreBoardChange', index)
        if (index < 0) {
            index = 0;
        }
        this.playerListView.setPlayerSelected(index);
        this.actionPlayerChanged(null, index);
    }

    onPlayerChangeSelected(player, playerPosition) {
        console.log('onPlayerChangeSelected', playerPosition)
        this.swiper.scrollBy(playerPosition - this.userSelected);
    }

    actionPlayerChanged(player, playerPosition) {
        this.disableChangeScore = !this.isHostUser && playerPosition != 0;
        this.userSelected = playerPosition;
        this.hold_selected = this.hold_user_selected[playerPosition];
        this.scoreBoard[[playerPosition, 0]].setOutData(this.state.flightDetailModelState, this.userSelected, this.hold_selected, this.isGrossMode, this.isHostUser);
        if (this.scoreBoard[[playerPosition, 1]])
            this.scoreBoard[[playerPosition, 1]].setInData(this.state.flightDetailModelState, this.userSelected, this.hold_selected, this.isGrossMode);
        if (this.scoreBoard[[playerPosition, 2]])
            this.scoreBoard[[playerPosition, 2]].setInData(this.state.flightDetailModelState, this.userSelected, this.hold_selected, this.isGrossMode);
    }

    onLongPressPlayerListener(item, index) {
        if (this.props.onLongPressPlayerListener != null) {
            this.props.onLongPressPlayerListener(item, index);
        }
    }

    removePlayerResponse(flightDetail, playerPosition) {
        if ((this.userSelected === playerPosition && this.userSelected > 0) || this.userSelected > playerPosition) {
            this.userSelected--;
            this.onPlayerChangeSelected(null, this.userSelected);
            this.playerListView.setPlayerSelected(this.userSelected);
        }

        this.user_ids = this.flight.getUserRounds().map(item => { return item.getUserId() });
        this.setState({
            flightDetailModelState: flightDetail
        }, () => {
            for (let i = 0; i < this.playerList.length; i++) {
                this.scoreBoard[[i, 0]].setOutData(this.state.flightDetailModelState, this.userSelected, this.hold_selected, this.isGrossMode, this.isHostUser);
                if (this.scoreBoard[[i, 1]])
                    this.scoreBoard[[i, 1]].setInData(this.state.flightDetailModelState, this.userSelected, this.hold_selected, this.isGrossMode);
                if (this.scoreBoard[[i, 2]])
                    this.scoreBoard[[i, 2]].setInData(this.state.flightDetailModelState, this.userSelected, this.hold_selected, this.isGrossMode);
            }
        });


    }

    onFrontScoreSelected(item, index) {
        console.log('onFrontScoreSelected', this.hold_selected)
        if (this.hold_selected >= 9) {
            if (this.scoreBoard[[this.userSelected, 1]])
                this.scoreBoard[[this.userSelected, 1]].setInData(this.state.flightDetailModelState, this.userSelected, index, this.isGrossMode);
            if (this.scoreBoard[[this.userSelected, 2]])
                this.scoreBoard[[this.userSelected, 2]].setInData(this.state.flightDetailModelState, this.userSelected, index, this.isGrossMode);
        }
        this.updateHoldUserSelected(index);
    }

    onBackScoreSelected(item, index) {
        console.log('onBackScoreSelected', this.hold_selected)
        if (this.hold_selected < 9) {
            this.scoreBoard[[this.userSelected, 0]].setOutData(this.state.flightDetailModelState, this.userSelected, index, this.isGrossMode, this.isHostUser);
        } else if (this.hold_selected < 18) {
            if (this.scoreBoard[[this.userSelected, 1]])
                this.scoreBoard[[this.userSelected, 1]].setInData(this.state.flightDetailModelState, this.userSelected, index, this.isGrossMode);
        } else if (this.hold_selected < 27) {
            if (this.scoreBoard[[this.userSelected, 2]])
                this.scoreBoard[[this.userSelected, 2]].setInData(this.state.flightDetailModelState, this.userSelected, index, this.isGrossMode);
        }
        this.updateHoldUserSelected(index);
    }

    onHandicapKeyboardClick(score, isGrossMode) {
        if (this.disableChangeScore) {
            this.showWarningMsg(this.t('guest_cannot_edit'));
        } else {
            this.onEnterScoreClick(score, isGrossMode);
        }
    }

    onEnterScoreClick(score, isGrossMode) {
        this.Logger().log('onEnterScoreClick', this.disableChangeScore);
        if (this.disableChangeScore) {
            this.showAlertMsg(this.t('cannot_edit_score'));
        } else {
            if (isGrossMode) {
                this.updateScoreUser(score);
            } else {
                score = AppUtil.convertOverToGross(score, this.state.flightDetailModelState.getFlight().getUserRounds()[this.userSelected].getHoldUserList()[this.hold_selected].getPar());
                this.updateScoreUser(score);
            }
            if (this.hold_selected === HOLD_LENGTH - 1 && !this.checkScoreInvalid() && !this.alert_is_show) {
                this.showAlertFullHole();
            }
        }

    }

    checkScoreInvalid() {
        return this.state.flightDetailModelState.getFlight().getUserRounds()[0].getHoldUserList().find((currentItem) => {
            return currentItem.getGross() === 0;
        })
    }

    updateHoldUserSelected(index) {
        this.hold_user_selected.splice(this.userSelected, 1, index);
        this.updateHoldSelected(this.userSelected, index);
    }

    updateHoldSelected(userSelected, index) {
        this.hold_selected = index;
        if (index < 9) {
            this.scoreBoard[[userSelected, 0]].setOutData(this.state.flightDetailModelState, this.userSelected, index, this.isGrossMode, this.isHostUser);

        } else if (index === 9) {
            this.scoreBoard[[userSelected, 0]].setOutData(this.state.flightDetailModelState, this.userSelected, index, this.isGrossMode, this.isHostUser);
            if (this.scoreBoard[[this.userSelected, 1]])
                this.scoreBoard[[userSelected, 1]].setInData(this.state.flightDetailModelState, this.userSelected, index, this.isGrossMode);
        } else if (index > 9 && index < 18) {
            if (this.scoreBoard[[this.userSelected, 1]])
                this.scoreBoard[[userSelected, 1]].setInData(this.state.flightDetailModelState, this.userSelected, index, this.isGrossMode);
        } else if (index === 18) {
            if (this.scoreBoard[[this.userSelected, 1]])
                this.scoreBoard[[userSelected, 1]].setInData(this.state.flightDetailModelState, this.userSelected, index, this.isGrossMode);
            if (this.scoreBoard[[this.userSelected, 2]])
                this.scoreBoard[[userSelected, 2]].setInData(this.state.flightDetailModelState, this.userSelected, index, this.isGrossMode);
        } else {
            if (this.scoreBoard[[this.userSelected, 2]])
                this.scoreBoard[[userSelected, 2]].setInData(this.state.flightDetailModelState, this.userSelected, index, this.isGrossMode);
        }

    }

    updateScoreUser(score) {
        console.log('this.hold_selected', this.hold_selected, HOLD_LENGTH - 1)
        try {
            this.state.flightDetailModelState.getFlight().getUserRounds()[this.userSelected].getHoldUserList()[this.hold_selected].setGross(score);
            if (this.hold_selected < HOLD_LENGTH - 1) {
                this.updateHoldUserSelected(this.hold_selected + 1);
                if (this.hold_selected === 9) {
                    if (this.refScrollView[this.userSelected])
                        this.refScrollView[this.userSelected].scrollToEnd({ animated: true });
                }
            } else {
                // final hole
                if (this.scoreBoard[[this.userSelected, 0]] && this.hold_selected === 8)
                    this.scoreBoard[[this.userSelected, 0]].setOutData(this.state.flightDetailModelState, this.userSelected, this.hold_selected, this.isGrossMode, this.isHostUser);
                if (this.scoreBoard[[this.userSelected, 1]] && this.hold_selected === 17)
                    this.scoreBoard[[this.userSelected, 1]].setInData(this.state.flightDetailModelState, this.userSelected, this.hold_selected, this.isGrossMode);
                if (this.scoreBoard[[this.userSelected, 2]] && this.hold_selected === 26)
                    this.scoreBoard[[this.userSelected, 2]].setInData(this.state.flightDetailModelState, this.userSelected, this.hold_selected, this.isGrossMode);
            }
        } catch (error) {
            console.log('updateScoreUser.error', error)
        }

    }

    isGrossModeChange(_isGrossMode) {
        this.isGrossMode = _isGrossMode;
        this.scoreBoard[[this.userSelected, 0]].setOutData(this.state.flightDetailModelState, this.userSelected, this.hold_selected, _isGrossMode, this.isHostUser);
        if (this.scoreBoard[[this.userSelected, 1]])
            this.scoreBoard[[this.userSelected, 1]].setInData(this.state.flightDetailModelState, this.userSelected, this.hold_selected, _isGrossMode);
        if (this.scoreBoard[[this.userSelected, 2]])
            this.scoreBoard[[this.userSelected, 2]].setInData(this.state.flightDetailModelState, this.userSelected, this.hold_selected, _isGrossMode);
        this.handicapKeyboard.setInputModeChange(_isGrossMode);
    }

    onChangeInputMode(_isGrossMode) {
        this.isGrossMode = _isGrossMode;
        this.scoreBoard[[this.userSelected, 0]].setOutData(this.state.flightDetailModelState, this.userSelected, this.hold_selected, _isGrossMode, this.isHostUser);
        if (this.scoreBoard[[this.userSelected, 1]])
            this.scoreBoard[[this.userSelected, 1]].setInData(this.state.flightDetailModelState, this.userSelected, this.hold_selected, _isGrossMode);
        if (this.scoreBoard[[this.userSelected, 2]])
            this.scoreBoard[[this.userSelected, 2]].setInData(this.state.flightDetailModelState, this.userSelected, this.hold_selected, _isGrossMode);
    }

    onAttachImage() {
        if (this.props.onAttachImage != null) {
            this.props.onAttachImage();
        }
    }

    syncFlightScore() {
        if (this.props.onSyncFlightScore != null) {
            this.props.onSyncFlightScore(this.state.flightDetailModelState, this.userSelected, this.hold_selected, this.hold_user_selected);
        }
    }

    showAlertMsg(content = '') {
        try {
            MessageBarManager.showAlert({
                message: content,
                alertType: 'warning',
                animationType: 'SlideFromBottom',
                position: 'bottom',
                duration: parseInt(DURATION_DISMISS),
                onShow: () => { this.alert_is_show = true },
                onHide: () => { this.alert_is_show = false }
            });
        } catch (error) {
            this.Logger().log('showAlertMsg', error);
        }

    }

    showAlertFullHole() {
        // Simple show the alert with the manager
        try {
            let playerLength = this.state.flightDetailModelState.getFlight().getUserRounds().length;
            MessageBarManager.showAlert({
                message: this.getContentMessage(playerLength),
                alertType: playerLength === 1 && !this.state.flightDetailModelState.getFlight().getUrlScorecard() ? 'warning' : 'info',
                animationType: 'SlideFromBottom',
                position: 'bottom',
                duration: parseInt(DURATION_DISMISS),
                onTapped: this.onFullHoleAlertCallback.bind(this, playerLength),
                onShow: () => { this.alert_is_show = true },
                onHide: () => { this.alert_is_show = false }
            });
        } catch (error) {
            console.log('showAlertFullHole', error)
        }

    }

    getContentMessage(playerLength) {
        if (playerLength === 1) {
            if (this.state.flightDetailModelState.getFlight().getUrlScorecard()) {
                return this.t('alert_view_scorecard');
            } else {
                return this.t('require_take_photo');
            }
        } else {
            return this.t('view_scorecard_or_enter_score')
        }
    }

    onFullHoleAlertCallback(playerLength) {
        if (playerLength === 1 && !this.state.flightDetailModelState.getFlight().getUrlScorecard()) {
            this.onAttachImage();
        } else {
            if (this.props.onExportScorecard) {
                this.props.onExportScorecard();
            }
        }

    }

    onChangeFontPath() {
        if (this.props.onChangePathCallback != null) {
            this.props.onChangePathCallback(0, this.path1_selected);
        }
    }

    onChangeBackPath() {
        if (this.props.onChangePathCallback != null) {
            this.props.onChangePathCallback(1, this.path2_selected);
        }
    }

    onChangeExtrasPath() {
        if (this.props.onChangePathCallback != null) {
            this.props.onChangePathCallback(2, this.path3_selected);
        }
    }

    onAddMorePath() {
        if (this.props.onAddMorePath) {
            this.props.onAddMorePath();
        }
    }

    onGuestChangePathWarning() {
        this.showWarningMsg(this.t('guest_cannot_change_path'));
    }

    // updateDatabaseFlight(flight) {
    //     let sql = `update ${global.db_table[0].name} set ${global.db_table[0].colum[1]} = ? where ${global.db_table[0].colum[0]} = ?`;
    //     if (this.db) {
    //         this.db.transaction(
    //             tx => {
    //                 tx.executeSql(sql,
    //                     [JSON.stringify(flight), this.flightId],
    //                     (success) => { console.log('updateDatabaseFlight success') },
    //                     (error) => console.log('updateDatabaseFlight error', error));
    //             }
    //         );
    //     }
    // }

    setPlayerListView(players) {
        this.playerList = players;
        this.playerListView.setPlayerList(players);
        // for (let i = 0; i < this.playerList.length; i++) {
        //     this.scoreBoard[[i, 0]].setOutData(this.state.flightDetailModelState, this.userSelected, this.hold_selected, this.isGrossMode, this.isHostUser);
        //     this.scoreBoard[[i, 1]].setInData(this.state.flightDetailModelState, this.userSelected, this.hold_selected, this.isGrossMode);
        // }
        // setTimeout(() => {
        //     this.swiper.scrollBy(1);
        // }, 1000);

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container_center: {
        flex: 1,
    },
    container_input: {
        flex: 1
    },
    input_title_group: {

    },
    input_score_group: {
        flex: 1,
        flexDirection: 'row'
    },
    input_total_group: {

    },
    input_title_text: {
        minWidth: 50,
        color: '#828282',
        fontWeight: 'bold',
        textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth: 0.5,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: '#F3F3F3'
    },
    input_title_text_hide: {
        flex: 1,
        minWidth: 50,
        borderColor: '#BDBDBD',
        borderWidth: 0.5,
        backgroundColor: '#F3F3F3'
    },
    input_title_text_score: {
        minWidth: 50,
        color: '#828282',
        fontWeight: 'bold',
        textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth: 0.5,
        paddingTop: 5,
        paddingBottom: 5
    },
    input_title_text_par: {
        minWidth: 50,
        color: '#828282',
        fontWeight: 'bold',
        textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth: 0.5,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: '#FFE88B'
    },
    input_title_text_path: {
        color: '#1996F1',
        fontWeight: 'bold',
        textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth: 0.5,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: '#F3F3F3',
        textDecorationLine: 'underline',
        maxWidth: 50
    },
    input_total_score: {
        color: '#1F1F1F',
        fontWeight: 'bold',
        textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth: 0.5,
        paddingTop: 5,
        paddingBottom: 5
    },
    input_content_container: {
        flex: 1
    },
    container_input_row: {
        flexDirection: 'row',
        borderColor: '#BDBDBD',
        borderWidth: 1
    },
    hold_selected: {
        backgroundColor: '#56CCF2',
        borderColor: '#56CCF2',
        borderWidth: 0.5,
        opacity: 0.5
    },
    hold_unSelected: {

    },
    view_item_overlap: {
        position: 'absolute',
        right: 0,
        left: 0,
        bottom: 0,
        top: 0
    },
    note_input_mode: {
        color: 'red',
        marginBottom: 3,
        textAlign: 'center'
    },
    gesture_recognizer: {
        backgroundColor: '#FFFFFF',
        flex: 1
    },
    touchable_add_path: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    img_add_path: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
    txt_add_path: {
        color: '#00ABA7',
        fontSize: 16,
        marginLeft: 10,
    }

});