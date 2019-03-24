import React from 'react';
import { Platform, StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import PlayerListView from '../Items/PlayerListView';
import MyView from '../../../Core/View/MyView';
import ApiService from '../../../Networking/ApiService';
import HandicapFacilityModel from '../../../Model/Facility/HandicapFacilityModel';
import Networking from '../../../Networking/Networking';
import HandicapOverKeyboard from '../Items/HandicapOverKeyboard';
import AppUtil from '../../../Config/AppUtil';
import UserRoundModel from '../../../Model/CreateFlight/Flight/UserRoundModel';
import UserProfileModel from '../../../Model/Home/UserProfileModel';
import HoleSwipeGestureView from '../Items/HoleSwipeGestureView';
import HoleGrossScoreView from '../Items/HoleGrossScoreView';
import HoleTeeClubView from '../Items/HoleTeeClubView';
import HoleDirectionView from '../Items/HoleDirectionView';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import Swiper from 'react-native-swiper';


export default class EnterEachHoldView extends BaseComponent {

  static defaultProps = {
    flightDetailModel: null,
    userSelected: 0,
    holdSelected: 0,
    holdUserSelected: [0, 0, 0, 0],
    isHostUser: false,
    database: null
  }

  constructor(props) {
    super(props);
    this.flight = this.props.flightDetailModel.getFlight();
    this.flightId = this.flight.getId();
    this.userRounds = this.flight.getUserRounds();
    this.type_flight = this.flight.getTypeFlight();
    this.user_ids = this.userRounds.map(item => { return item.getUserId() });
    this.onGuestCannotChangeClick = this.onGuestCannotChange.bind(this);
    // this.db = this.getDatabase();
    this.playerList = this.userRounds;
    this.isHostUser = this.props.isHostUser;
    this.userSelected = this.props.userSelected;
    this.hold_user_selected = this.props.holdUserSelected;
    this.listTeeAvailable = this.props.teeList;
    this.scoreBoard = [];
    this.selectType = this.props.flightDetailModel.getFlightPath().getSelectType();
    this.state = {
      flightDetailModelState: this.props.flightDetailModel,
      hold_selected: this.props.holdSelected,
      isHideOverMode: true,
      score: this.userRounds[this.userSelected].getHoldUserList()[this.props.holdSelected].getGross(),
      putt: this.userRounds[this.userSelected].getHoldUserList()[this.props.holdSelected].getPutt()
    }

    this.changeInputScoreMode = this.changeInputScoreMode.bind(this);
    this.holeGrossUpdateScore = this.holeGrossUpdateScore.bind(this);
    this.holeGrossUpdatePutt = this.holeGrossUpdatePutt.bind(this);
    this.onGuestCannotChangeClick = this.onGuestCannotChangeClick.bind(this);
    this.onOverKeyboardClick = this.onOverKeyboardClick.bind(this);
    this.onUpdateTeeClub = this.onUpdateTeeClub.bind(this);
    this.onUpdateHoleDirection = this.onUpdateHoleDirection.bind(this);
    this.onViewScoreBoardChange = this.onViewScoreBoardChange.bind(this);
    this.onAddPlayerClick = this.onAddPlayerClick.bind(this);
    this.onGuestAddPlayerWarning = this.onGuestAddPlayerWarning.bind(this);
    this.onPlayerChangeSelected = this.onPlayerChangeSelected.bind(this);
    this.onLongPressPlayerListener = this.onLongPressPlayerListener.bind(this);
    this.onSwipeLeftAction = this.onSwipeLeftAction.bind(this);
    this.onSwipeRightAction = this.onSwipeRightAction.bind(this);
  }

  render() {
    let flightDetailModel = this.state.flightDetailModelState;
    let holdList = flightDetailModel.getFlight().getUserRounds()[this.userSelected].getHoldUserList();
    let holdIndex = parseInt(this.state.hold_selected);
    let gross = holdList[holdIndex].getGross();
    let par = holdList[holdIndex].getPar();
    let gross_total_value = 0;
    let over_total_value = 0;
    let dotList = holdList.map((item, key) => {
      let gross = parseInt(item.getGross());
      gross_total_value += gross;
      if (gross != 0) {
        over_total_value += (gross - item.getPar());
      }
      return (
        <View style={[styles.circle_dot, { backgroundColor: (this.state.hold_selected === key) ? '#00BAB6' : (gross != 0 ? '#D4D4D4' : '#FFFFFF'), borderColor: this.state.hold_selected === key ? '#00BAB6' : '#D4D4D4' }]} />
      );
    });

    let parCenter = holdList[holdIndex].getPar();
    let holeLength = holdList[holdIndex].getHoleLength();
    let holeIndex = holdList[holdIndex].getHoleIndex();
    let over = gross != 0 ? AppUtil.convertGrossToOVer(gross, par) : 0;

    let disableChangeScore = !this.isHostUser && this.userSelected != 0;

    let teeClub = holdList[holdIndex].getTeeClub();
    let holeDirection = holdList[holdIndex].getTeeDirection();

    let scoreHole = this.playerList.map((player, index) => {
      return (
        <ScrollView contentContainerStyle={{ justifyContent: 'space-around', flexGrow: 1 }}>
          {/* Tổng điểm */}
          <View style={styles.score_summary_container}>
            <View style={styles.score_summary_gross}>
              <Text allowFontScaling={global.isScaleFont} style={styles.score_summary_title}>{this.t('gross_total')}</Text>
              <Text allowFontScaling={global.isScaleFont} style={styles.score_summary_value}>{gross_total_value}</Text>
            </View>

            <View style={styles.score_summary_over}>
              <Text allowFontScaling={global.isScaleFont} style={styles.score_summary_title}>{this.t('over_total')}</Text>
              <Text allowFontScaling={global.isScaleFont} style={styles.score_summary_value}>{over_total_value > 0 ? `+ ${over_total_value}` : over_total_value}</Text>
            </View>

            <View style={styles.score_summary_hdc}>
              <View style={styles.score_summary_hdc_row}>
                <View style={styles.score_summary_hdc_item_top_left}>
                  <Text allowFontScaling={global.isScaleFont} style={styles.score_summary_hdc_title}>PAR</Text>
                  <Text allowFontScaling={global.isScaleFont} style={styles.score_summary_hdc_value}>{parCenter}</Text>
                </View>
                <View style={styles.score_summary_hdc_item_bottom_left}>
                  <Text allowFontScaling={global.isScaleFont} style={styles.score_summary_hdc_title}>YDS</Text>
                  <Text allowFontScaling={global.isScaleFont} style={styles.score_summary_hdc_value}>{holeLength}</Text>
                </View>
              </View>
              <View style={styles.score_summary_hdc_row}>
                <View style={styles.score_summary_hdc_item_top_right}>
                  <Text allowFontScaling={global.isScaleFont} style={styles.score_summary_hdc_title}>HDC</Text>
                  <Text allowFontScaling={global.isScaleFont} style={styles.score_summary_hdc_value}>{holeIndex}</Text>
                </View>
                <View style={styles.score_summary_hdc_item_bottom_right}>
                  <Text allowFontScaling={global.isScaleFont} style={styles.score_summary_hdc_title}>OVER</Text>
                  <Text allowFontScaling={global.isScaleFont} style={styles.score_summary_hdc_value}>{over}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Phần nhập điểm */}
          <View style={styles.enter_score_container}>
            <Touchable onPress={this.changeInputScoreMode}>
              <Text allowFontScaling={global.isScaleFont} style={styles.text_score}>{this.state.isHideOverMode ? 'Score' : 'Over'}</Text>
            </Touchable>

            <View style={styles.score_line_below} />

            {/* Chế độ nhập điểm Gross */}
            <HoleGrossScoreView
              ref={(holeGrossScoreView) => { this.scoreBoard[[index, 0]] = holeGrossScoreView; }}
              disableChangeScore={disableChangeScore}
              currentScore={this.state.score}
              currentPutt={this.state.putt}
              isHideOverMode={this.state.isHideOverMode}
              onUpdateScore={this.holeGrossUpdateScore}
              onUpdatePutt={this.holeGrossUpdatePutt}
              onGuestCannotChangeClick={this.onGuestCannotChangeClick}
            />

            {/* chế độ nhập điểm over */}
            <MyView hide={this.state.isHideOverMode} style={{ width: Dimensions.get('window').width - 20 }}>
              <HandicapOverKeyboard onScore={this.onOverKeyboardClick}
                currentOver={holdList[holdIndex].getGross() != 0 ? (over === 0 ? 'Par' : (over === '+1' ? 'Bogey' : `${over}`)) : ''} />
            </MyView>
          </View>

          <HoleTeeClubView
            ref={(holeTeeClubView) => { this.scoreBoard[[index, 1]] = holeTeeClubView; }}
            teeClub={teeClub}
            disableChangeScore={disableChangeScore}
            onGuestCannotChangeClick={this.onGuestCannotChangeClick}
            onUpdateTeeClub={this.onUpdateTeeClub} />

          {/* Nhập direction */}
          <HoleDirectionView
            ref={(holeDirectionView) => { this.scoreBoard[[index, 2]] = holeDirectionView; }}
            holeDirection={holeDirection}
            onUpdateHoleDirection={this.onUpdateHoleDirection}
            disableChangeScore={disableChangeScore}
            onGuestCannotChangeClick={this.onGuestCannotChangeClick} />

        </ScrollView>
      )
    });

    let swiperView =
      (
        <Swiper
          ref={(swiper) => { this.swiper = swiper; }}
          showsButtons={false}
          loop={false}
          showsPagination={false}
          onIndexChanged={this.onViewScoreBoardChange}
          index={this.userSelected}
          key={scoreHole.length}
        >
          {scoreHole}
        </Swiper>
      )

    return (
      <View style={styles.container}>
        <View style={styles.dot_group}>
          {dotList}
        </View>

        {/* Danh sách player */}
        <PlayerListView
          ref={(playerListView) => { this.playerListView = playerListView; }}
          listPlayer={this.playerList}
          userSelected={this.userSelected}
          onAddPlayerClick={this.onAddPlayerClick}
          onGuestAddPlayerWarning={this.onGuestAddPlayerWarning}
          onPlayerSelected={this.onPlayerChangeSelected}
          onLongPressPlayerListener={this.onLongPressPlayerListener}
          isHostUser={this.isHostUser}
        />

        {/* Vuốt qua từng hố */}
        <HoleSwipeGestureView
          ref={(holeSwipeGestureView) => { this.holeSwipeGestureView = holeSwipeGestureView; }}
          hold_selected={this.state.hold_selected}
          flightDetailModel={this.state.flightDetailModelState}
          onSwipeLeftAction={this.onSwipeLeftAction}
          onSwipeRightAction={this.onSwipeRightAction}
        />

        <View style={styles.swipe_line_below} />

        {swiperView}

        {this.renderMessageBar()}
      </View>
    );
  }

  componentDidMount() {
    this.registerMessageBar();
    this.setPlayerListView(this.playerList);
    this.holeSwipeGestureView.setData(this.state.flightDetailModelState);
  }

  componentWillUnmount() {
    this.unregisterMessageBar();
  }

  setInitData(isHostUser) {
    this.isHostUser = isHostUser;
    this.playerListView.initData(this.isHostUser);
  }

  refreshData(flightDetailModel) {
    this.setPlayerListView(flightDetailModel.getFlight().getUserRounds());
    this.holeSwipeGestureView.setData(flightDetailModel);
  }

  syncFlightScore() {
    if (this.props.onSyncFlightScore != null) {
      this.props.onSyncFlightScore(this.state.flightDetailModelState, this.userSelected, this.state.hold_selected, this.hold_user_selected);
    }
  }

  onGuestCannotChange() {
    this.showWarningMsg(this.t('guest_cannot_edit'));
  }

  onAddPlayerClick(index) {
    this.props.navigation.navigate('search_user_view', { onSearchCallback: this.onSearchCallback.bind(this), 'user_ids': this.user_ids });
  }

  onGuestAddPlayerWarning() {
    this.showWarningMsg(this.t('cannot_add_player'));
  }

  onSearchCallback(friendItemModel) {
    if (friendItemModel != null) {
      let userRoundModel = new UserRoundModel();
      let user = new UserProfileModel();
      user.setAvatar(friendItemModel.getAvatar());
      user.setFullname(friendItemModel.getFullname());
      user.setDefaultTeeID(friendItemModel.getDefaulTeeId());
      user.setUserId(friendItemModel.getUserId());

      userRoundModel.setUser(user);
      userRoundModel.setUserId(friendItemModel.getId());
      userRoundModel.setHoldUserList(this.state.flightDetailModelState.getFlightHoles());
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
        this.user_ids.push(friendItemModel.getId());
        this.setPlayerListView(players);
        // this.checkHandicapFacility(players, friendItemModel.getId(), this.state.flightDetailModelState.getFlight());
        if (this.selectType === 1) {
          this.checkHandicapFacilityPlayerOld(players, { tee: userRoundModel.getTee() }, friendItemModel.getId())
        } else {
          this.checkHandicapFacilityPlayerNew(players, { tee: userRoundModel.getTee() }, friendItemModel.getId())
        }
      }
    }
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
            if (player) {
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
            if (player) {
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
    Networking.httpRequestPost(url, (jsonData) => {
      self.model = new HandicapFacilityModel();
      self.model.parseData(jsonData);
      if (self.model.getErrorCode() === 0) {
        playerList.find((element) => element.getUserId() === user_id)
          .setCoursesHandicapDisplay(self.model.getListHandicapFacility()[0].getDisplay_course().getValue());
        self.setPlayerListView(playerList);
        // self.updateDatabaseFlight(self.state.flightDetailModelState.getFlight());
      } else {
        // self.showErrorMsg(self.model.getErrorMsg());
        // self.updateDatabaseFlight(self.state.flightDetailModelState.getFlight());
      }
    }, formData);
  }

  onViewScoreBoardChange(index) {
    console.log('onViewScoreBoardChange', index)
    if (index < 0) {
      index = 0;
    }
    this.userSelected = index;
    this.onActionPlayerChange(null, this.userSelected);
    this.playerListView.setPlayerSelected(this.userSelected);
  }

  onPlayerChangeSelected(player, playerPosition) {
    this.swiper.scrollBy(playerPosition - this.userSelected);
  }

  onActionPlayerChange(player, playerPosition) {
    let disableChangeScore = !this.isHostUser && playerPosition != 0
    this.userSelected = playerPosition;
    this.setState({
      hold_selected: this.hold_user_selected[this.userSelected]
    }, () => {
      this.holeSwipeGestureView.setHolePosition(this.state.hold_selected);
      let hole = this.state.flightDetailModelState.getFlight().getUserRounds()[this.userSelected].getHoldUserList()[this.state.hold_selected];
      let score = hole.getGross();
      let putt = hole.getPutt() ? hole.getPutt() : 0;
      this.scoreBoard[[this.userSelected, 0]].setData(this.state.isHideOverMode, score, putt, disableChangeScore);
      this.scoreBoard[[this.userSelected, 1]].setData(hole.getTeeClub(), disableChangeScore);
      this.scoreBoard[[this.userSelected, 2]].setData(hole.getTeeDirection(), disableChangeScore);
    });
  }

  onLongPressPlayerListener(item, index) {
    if (this.props.onLongPressPlayerListener != null) {
      this.props.onLongPressPlayerListener(item, index);
    }
  }

  removePlayerResponse(flightDetail, playerPosition) {
    if ((this.userSelected === playerPosition && this.userSelected > 0) || this.userSelected > playerPosition) {
      this.userSelected--;
      this.onActionPlayerChange(null, this.userSelected);
      this.playerListView.setPlayerSelected(this.userSelected);
    }

    this.user_ids = this.flight.getUserRounds().map(item => { return item.getUserId() });
    this.setState({
      flightDetailModelState: flightDetail
    })
  }

  onSwipeLeftAction(holeSelected) {
    this.initScore(holeSelected);
  }

  onSwipeRightAction(holeSelected) {
    this.initScore(holeSelected);
  }

  initScore(holeSelected, disableChangeScore = null) {
    this.hold_user_selected.splice(this.userSelected, 1, holeSelected);
    let hole = this.state.flightDetailModelState.getFlight().getUserRounds()[this.userSelected].getHoldUserList()[holeSelected];
    let score = hole.getGross();
    let putt = hole.getPutt() ? hole.getPutt() : 0;
    this.setState({
      hold_selected: holeSelected,
      score: score
    });

    this.scoreBoard[[this.userSelected, 0]].setData(this.state.isHideOverMode, score, putt, disableChangeScore);
    this.scoreBoard[[this.userSelected, 1]].setData(hole.getTeeClub(), disableChangeScore);
    this.scoreBoard[[this.userSelected, 2]].setData(hole.getTeeDirection(), disableChangeScore);
  }

  holeGrossUpdateScore(score) {
    this.onUpdateScore(score);
  }

  holeGrossUpdatePutt(putt) {
    this.onUpdateScore(null, putt, null, null);
  }

  changeInputScoreMode() {
    this.setState({
      isHideOverMode: !this.state.isHideOverMode
    }, () => this.scoreBoard[[this.userSelected, 0]].setData(this.state.isHideOverMode));
  }

  onUpdateTeeClub(teeClub) {
    this.onUpdateScore(null, null, teeClub, null);
  }

  onUpdateHoleDirection(direction) {
    this.onUpdateScore(null, null, null, direction)
  }

  onOverKeyboardClick(score) {
    if (this.disableChangeScore) {
      this.onGuestCannotChange();
    } else {
      this.onEnterOverScoreClick(score);
    }
  }

  onEnterOverScoreClick(score) {
    score = AppUtil.convertOverToGross(score, this.state.flightDetailModelState.getFlight().getUserRounds()[this.userSelected].getHoldUserList()[this.state.hold_selected].getPar());
    this.onUpdateScore(score);
    this.setState({
      score: score
    })
  }

  onUpdateScore(score = null, putt = null, teeClub = null, direction = null) {
    if (score) {
      this.state.flightDetailModelState.getFlight().getUserRounds()[this.userSelected].getHoldUserList()[this.state.hold_selected].setGross(score);
    }
    if (putt === 0 || putt) {
      this.state.flightDetailModelState.getFlight().getUserRounds()[this.userSelected].getHoldUserList()[this.state.hold_selected].setPutt(putt);
    }
    if (teeClub) {
      this.state.flightDetailModelState.getFlight().getUserRounds()[this.userSelected].getHoldUserList()[this.state.hold_selected].setTeeClub(teeClub);
    }
    if (direction) {
      this.state.flightDetailModelState.getFlight().getUserRounds()[this.userSelected].getHoldUserList()[this.state.hold_selected].setDirection(direction);
    }

  }

  setPlayerListView(players) {
    this.playerList = players;
    this.playerListView.setPlayerList(players);
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  dot_group: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4
  },
  circle_dot: {
    height: 10,
    width: 10,
    backgroundColor: '#D4D4D4',
    borderRadius: 5,
    borderWidth: 1,
    marginLeft: 2,
    marginRight: 2
  },
  hold_swipe_group: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10
  },
  hold_swipe_left: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  hold_swipe_center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  hold_swipe_right: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon_arrow: {
    height: 20,
    width: 20,
    resizeMode: 'contain'
  },
  text_hold_swipe: {
    fontSize: 11,
    color: '#666666'
  },
  text_par_swipe: {
    fontSize: 11,
    color: '#9E9E9E'
  },
  text_hold_swipe_center: {
    fontSize: 15,
    color: '#212121'
  },
  text_par_swipe_center: {
    fontSize: 15,
    color: '#9E9E9E'
  },
  swipe_line_below: {
    height: 1,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#CFCFCF'
  },
  score_summary_container: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10
  },
  score_summary_gross: {
    flex: 1,
    backgroundColor: '#EFEFF4',
    alignItems: 'center',
    paddingTop: 3
  },
  score_summary_over: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#EFEFF4',
    alignItems: 'center',
    paddingTop: 3
  },
  score_summary_hdc: {
    flex: 2
  },
  score_summary_title: {
    color: '#3B3B3B',
    fontSize: 13,
  },
  score_summary_value: {
    color: '#3B3B3B',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 5
  },
  score_summary_hdc_row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  score_summary_hdc_item_top_left: {
    flex: 1,
    backgroundColor: '#EFEFF4',
    marginRight: 0.75,
    marginBottom: 0.75,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 3,
    paddingBottom: 3
  },
  score_summary_hdc_item_top_right: {
    flex: 1,
    backgroundColor: '#EFEFF4',
    marginLeft: 0.75,
    marginBottom: 0.75,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 3,
    paddingBottom: 3
  },
  score_summary_hdc_item_bottom_left: {
    flex: 1,
    backgroundColor: '#EFEFF4',
    marginTop: 0.75,
    marginRight: 0.75,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 3,
    paddingBottom: 3
  },
  score_summary_hdc_item_bottom_right: {
    flex: 1,
    backgroundColor: '#EFEFF4',
    marginLeft: 0.75,
    marginTop: 0.75,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 3,
    paddingBottom: 3
  },
  score_summary_hdc_title: {
    color: '#6E6E6E',
    fontSize: 13,
  },
  score_summary_hdc_value: {
    color: '#3B3B3B',
    fontSize: 13,
    fontWeight: 'bold'
  },
  enter_score_container: {
    borderColor: '#EBEBEB',
    borderWidth: 1,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  text_score: {
    color: '#3B3B3B',
    fontSize: 15,
    marginTop: 5,
    marginBottom: 5,
    width: Dimensions.get('window').width,
    textAlign: 'center'
  },
  row_score_container: {
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    paddingLeft: 20,
    paddingRight: 20
  },
  touchable_btn: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon_btn: {
    width: 30,
    height: 30,
    resizeMode: 'contain'
  },
  text_btn: {
    color: '#FFFFFF',
    fontSize: 25
  },
  text_score_center: {
    color: '#00ABA7',
    fontSize: 27,
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  text_putts: {
    color: '#3B3B3B',
    fontSize: 15,
    textAlign: 'center'
  },
  text_score_tee_club: {
    color: '#303030',
    fontSize: 27,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  text_score_putts: {
    color: '#00ABA7',
    fontSize: 27,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  view_putt_score: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon_btn_arrow: {
    width: 15,
    height: 15
  },
  score_line_below: {
    height: 0.5,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#EBEBEB',
    width: Dimensions.get('window').width,
  },
  enter_tee_container: {
    borderColor: '#EBEBEB',
    borderWidth: 1,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10
  },
  direction_container: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  direction_item: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  direction_icon: {
    height: 20,
    resizeMode: 'contain'
  },
  direction_text: {
    fontSize: 14
  },
  gesture_recognizer: {
    backgroundColor: '#FFFFFF',
    flex: 1
  }

});