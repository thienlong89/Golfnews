import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import MyView from '../../../Core/View/MyView';
import FriendItem from '../../Friends/Items/FriendItem';
import TeeViewHorizontal from '../../Common/TeeViewHorizontal';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
import PopupSelectTeeView from '../../Common/PopupSelectTeeView';
import HandicapFacilityModel from '../../../Model/Facility/HandicapFacilityModel';
import FriendItemModel from '../../../Model/Friends/FriendItemModel';

export default class PlayersFlightView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.teeColor = this.props.teeColor;
        this.teeListAvailable = [];
        this.course_selected = '';
        this.user_ids = this.props.user_ids;
        this.path1 = '';
        this.path2 = '';
        this.path3 = '';
        this.select_type = 1;
        this.state = {
            playerList: this.props.playerList,
            group_display: 0
        }

        this.onChangeAllTeePress = this.onChangeAllTeePress.bind(this);
        this.onChangeTeePress = this.onChangeTeePress.bind(this);
        this.onAddPlayerClick = this.onAddPlayerClick.bind(this);
        this.onTeeSelectedListener = this.onTeeSelectedListener.bind(this);
        this.onSearchPlayerCallback = this.onSearchPlayerCallback.bind(this);
    }

    render() {

        let {
            playerList,
            group_display
        } = this.state;

        console.log('PlayersFlightView.render')
        let playerListView = playerList.map((item, index) => {
            if (index == 0) {
                item.fullname = item.getFullName() ? item.getFullName() : '';
                item.userId = item.getUserId();
                item.id = item.getUserId();
                item.facility_handicap = item.getHandicap_facility();
                item.handicap = item.getUsgaHcIndex();
                item.eHandicap_member_id = item.getEhandicapMemberId();
                item.avatar = item.getAvatar();
                // item.default_tee_id = teeColor;
                item.teeObject = (item.teeObject && item.teeObject.tee) ? item.teeObject : (this.teeColor ? { tee: this.teeColor, color: this.teeColor } : { tee: item.default_tee_id, color: item.default_tee_id });

                return (
                    <View style={{ backgroundColor: '#FFFFFF' }}>
                        <FriendItem
                            ref={(itemMe) => { this.refs[`player_${item.userId}`] = itemMe }}
                            data={item}
                            // default_tee_id={teeColor}
                            isHideDelete={true}
                            onChangeTeePress={this.onChangeTeePress}
                            // teeObject={{tee : this.teeColor , color : teeColor}}
                            isCanDelete={true} />
                        <View style={[styles.line, { marginLeft: scale(80) }]} />
                    </View>
                );
            } else {
                this.Logger().log('........... ', item.teeObject, this.teeColor, item.default_tee_id);
                item.facility_handicap = item.handicap_facility;
                item.eHandicap_member_id = item.ehandicapMemberId;
                item.teeObject = (item.teeObject && item.teeObject.tee) ? item.teeObject : (this.teeColor ? { tee: this.teeColor, color: this.teeColor } : { tee: item.default_tee_id, color: item.default_tee_id });
                return (
                    // <Touchable onPress={this.onChangePlayerInfo.bind(this, item, index)}>
                    <View style={{
                        backgroundColor: '#FFFFFF', borderBottomLeftRadius: scale(5),
                        borderBottomRightRadius: scale(5)
                    }}>
                        <FriendItem
                            ref={(itemMe) => { this.refs[`player_${item.userId}`] = itemMe }}
                            data={item}
                            isHideDelete={false}
                            isCanDelete={true}
                            onChangeTeePress={this.onChangeTeePress}
                            onRemoveItemClick={() => this.onRemovePlayerClick(item, index)} />
                        <View style={[styles.line, { marginLeft: scale(80) }]} />
                    </View>
                    // </Touchable>

                );
            }

        });

        let teeGroup = (
            <MyView hide={group_display === 0}>
                <Touchable onPress={this.onChangeAllTeePress} >
                    <View style={styles.tee_group} >
                        <Text allowFontScaling={global.isScaleFont} style={styles.path_title} >{this.t('tee_box')}</Text>
                        <View style={styles.tee_select_group}>
                            <TeeViewHorizontal
                                ref={(refTeeViewHorizontal) => { this.refTeeViewHorizontal = refTeeViewHorizontal; }}
                                isNoneBoder={true}
                                teeObject={{ tee: this.teeColor, color: this.teeColor }}
                            />

                        </View>
                    </View>
                </Touchable>
                <View style={styles.line} />
            </MyView>
        );


        let playerGroup = (
            <MyView hide={group_display === 0 || group_display === 1}>
                <View style={styles.player_header}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.player_text_header} >{this.t('player')}</Text>

                </View>
                {teeGroup}

                {playerListView}

                <MyView hide={playerList.length >= 4}>
                    <TouchableOpacity style={styles.touchable_add_player} onPress={this.onAddPlayerClick}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={[styles.view_icon, {
                                width: this.getRatioAspect().scale(60),
                                height: this.getRatioAspect().scale(60),
                                borderRadius: this.getRatioAspect().scale(30),
                            }]}>
                                <Image
                                    style={styles.img_icon}
                                    source={this.getResources().ic_add_member} />
                            </View>
                            <Text allowFontScaling={global.isScaleFont} style={styles.text_add_player}>{this.t('add_player')}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.line, { marginBottom: 5, marginLeft: scale(80) }]} />
                </MyView>

            </MyView>
        );
        return (
            <View style={styles.container}>
                {playerGroup}

                <PopupSelectTeeView
                    ref={(refPopupSelectTeeView) => { this.refPopupSelectTeeView = refPopupSelectTeeView; }}
                    onTeeSelected={this.onTeeSelectedListener} />
            </View>
        );
    }

    setData(teeListAvailable = [], course, select_type, path1, path2, path3) {
        this.path1 = path1;
        this.path2 = path2;
        this.path3 = path3;
        this.select_type = select_type;
        console.log('setData', path1, path2, path3,this.state.group_display, course)
        if (select_type === 1) {
            if (this.state.group_display != 2) {
                this.setState({
                    group_display: 2
                }, () => {
                    this.teeListAvailable = teeListAvailable;
                    this.course_selected = course;
                    this.checkHandicapFacilityPlayerOld({ tee: this.teeColor, color: this.teeColor });
                });
            } else {
                this.teeListAvailable = teeListAvailable;
                this.course_selected = course;
                this.checkHandicapFacilityPlayerOld({ tee: this.teeColor, color: this.teeColor });
            }
        } else {
            if (this.state.group_display != 2) {
                this.setState({
                    group_display: 2
                }, () => {
                    this.teeListAvailable = teeListAvailable;
                    this.course_selected = course;
                    this.checkHandicapFacilityPlayer({ tee: this.teeColor, color: this.teeColor });
                });
            } else {
                this.teeListAvailable = teeListAvailable;
                this.course_selected = course;
                this.checkHandicapFacilityPlayer({ tee: this.teeColor, color: this.teeColor });
            }
        }
    }


    onChangeAllTeePress() {
        this.refPopupSelectTeeView.setVisible(this.teeListAvailable);
    }

    onChangeTeePress(friendModel) {
        this.refPopupSelectTeeView.setVisible(this.teeListAvailable, friendModel);
    }

    onAddPlayerClick() {
        this.props.navigation.navigate('search_user_create_flight', {
            onSearchCallback: this.onSearchPlayerCallback,
            'user_ids': this.user_ids,
            playerList: this.state.playerList
        });
    }

    onRemovePlayerClick(item, index) {
        let { playerList } = this.state;
        if (playerList.length > 1) {
            playerList.splice(index, 1);
            this.user_ids.splice(index, 1);
            this.setState({
                playerList: playerList
            }, () => {
                this.setPlayerChangeCallback(playerList);
            })
        }
    }

    onTeeSelectedListener(data, extrasData) {
        if (this.select_type === 1) {
            if (!extrasData) {
                this.refTeeViewHorizontal.setTeeSelected(data);
                this.checkHandicapFacilityPlayerOld(data);
            } else {
                this.checkHandicapFacilityPlayerOld(data, [extrasData], true);
            }
        } else {
            if (!extrasData) {
                this.refTeeViewHorizontal.setTeeSelected(data);
                this.checkHandicapFacilityPlayer(data);
            } else {
                this.checkHandicapFacilityPlayer(data, [extrasData], true);
            }
        }

    }

    checkHandicapFacilityPlayer(teeObject, friendItemModelList = [], isPersonal = false) {
        let url = this.getConfig().getBaseUrl() + ApiService.check_handicap_by_path();
        console.log("url : ", url);
        let teeInfo = this.course_selected.getTeeInfo();

        // for (let tee of teeInfo) {
        //     course_obj[`${tee.tee}_slope`] = tee.slope;
        // }

        let ids = friendItemModelList.map((friendItemModel) => {
            return this.getAppUtil().replaceUser(friendItemModel.id);
        })

        let formData = {
            "user_ids": ids.length > 0 ? ids : this.user_ids,
            "facility_id": this.course_selected.getFacilityId(),
            "path_id1": this.path1 ? this.path1.id : '',
            "path_id2": this.path2 ? this.path2.id : '',
            "path_id3": this.path3 ? this.path3.id : '',
        };
        if (teeObject) {
            formData.tee = teeObject.tee;
        }
        console.log('HandicapFacilityModel.formData', formData)
        Networking.httpRequestPost(url, (jsonData) => {
            try {
                console.log('HandicapFacilityModel', jsonData)
                this.model = new HandicapFacilityModel();
                this.model.parseData(jsonData);
                if (this.model.getErrorCode() === 0) {

                    let playerList = this.state.playerList;
                    let array_handicap = this.model.getCourseHandicap();

                    if (isPersonal) {
                        let user_id = this.getAppUtil().replaceUser(friendItemModelList[0].id);
                        let player = playerList.find((playerItem) => {
                            let playerId = this.getAppUtil().replaceUser(playerItem.id);
                            return playerId === user_id;
                        })
                        player.teeObject = teeObject;
                        let handicap_obj = array_handicap[0];
                        player.setHandicapFacility(handicap_obj.display_course.value);

                    } else {
                        playerList.map((player, index) => {
                            // if (teeObject) {
                            //     player.teeObject = teeObject;
                            // }
                            let user_id = this.getAppUtil().replaceUser(player.userId);
                            let handicap_obj = array_handicap.find(player => parseInt(player.user_id) === user_id);

                            if (handicap_obj) {
                                let tee = handicap_obj.display_course.tee;
                                player.setHandicapFacility(handicap_obj.display_course.value);
                                player.teeObject = {
                                    tee: tee,
                                    color: tee
                                }
                            }
                        })
                    }

                    this.setState({
                        playerList: playerList
                    }, () => {
                        this.setPlayerChangeCallback(playerList);
                    })

                } else {
                    // this.showErrorMsg(jsonData['error_msg']);
                }
            } catch (error) {
                console.log('checkHandicapFacilityAllUser.error', error)
            }

        }, formData);
    }

    checkHandicapFacilityPlayerOld(teeObject, friendItemModelList = [], isPersonal = false) {
        let url = this.getConfig().getBaseUrl() + ApiService.check_handicap_facility();
        console.log("url : ", url);
        let teeInfo = this.course_selected.getTeeInfo();

        let course_obj = {
            "facility_id": this.course_selected.getFacilityId(),
            "path_id1": this.course_selected.getPathId1(),
            "path_id2": this.course_selected.getPathId2()
        }

        for (let tee of teeInfo) {
            course_obj[`${tee.tee}_slope`] = tee.slope;
        }

        let ids = friendItemModelList.map((friendItemModel) => {
            return this.getAppUtil().replaceUser(friendItemModel.id);
        })

        let formData = {
            "user_ids": ids.length > 0 ? ids : this.user_ids,
            "course": course_obj,
            // "tee": teeObject.tee,
        };
        if (teeObject) {
            formData.tee = teeObject.tee;
        }

        Networking.httpRequestPost(url, (jsonData) => {
            try {
                console.log('HandicapFacilityModel', jsonData)
                this.model = new HandicapFacilityModel();
                this.model.parseData(jsonData);
                if (this.model.getErrorCode() === 0) {

                    let playerList = this.state.playerList;
                    let array_handicap = this.model.getCourseHandicap();

                    if (isPersonal) {
                        let user_id = this.getAppUtil().replaceUser(friendItemModelList[0].id);
                        let player = playerList.find((playerItem) => {
                            let playerId = this.getAppUtil().replaceUser(playerItem.id);
                            return playerId === user_id;
                        })
                        player.teeObject = teeObject;
                        let handicap_obj = array_handicap[0];
                        player.setHandicapFacility(handicap_obj.display_course.value);

                    } else {
                        playerList.map((player, index) => {
                            // if (teeObject) {
                            //     player.teeObject = teeObject;
                            // }
                            let user_id = this.getAppUtil().replaceUser(player.userId);
                            let handicap_obj = array_handicap.find(player => parseInt(player.user_id) === user_id);

                            if (handicap_obj) {
                                let tee = handicap_obj.display_course.tee;
                                player.setHandicapFacility(handicap_obj.display_course.value);
                                player.teeObject = {
                                    tee: tee,
                                    color: tee
                                }
                            }
                        })
                    }

                    this.setState({
                        playerList: playerList
                    }, () => {
                        this.setPlayerChangeCallback(playerList);
                    })

                } else {
                    // this.showErrorMsg(jsonData['error_msg']);
                }
            } catch (error) {
                console.log('checkHandicapFacilityAllUser.error', error)
            }

        }, formData);
    }

    onSearchPlayerCallback(playerListCallback) {
        if (playerListCallback) {

            let {
                playerList
            } = this.state;

            for (friendItemModel of playerListCallback) {
                if (friendItemModel instanceof FriendItemModel) {
                    let teeObject = { tee: this.teeColor, color: this.teeColor };
                    let isExistTee = this.teeListAvailable.find((teeObj) => {
                        return friendItemModel.default_tee_id.toLowerCase() === teeObj.tee.toLowerCase();
                    });
                    console.log('isExistTee', isExistTee)
                    if (!isExistTee) {
                        friendItemModel.teeObject = teeObject;
                    } else {
                        teeObject = { tee: friendItemModel.default_tee_id, color: friendItemModel.default_tee_id };
                        friendItemModel.teeObject = teeObject;
                    }
                    // if (playerList.length < 4) {
                    this.user_ids.push(friendItemModel.id);
                    //     playerList.push(friendItemModel);

                    // }
                }
            }

            console.log('this.user_ids', this.user_ids)

            this.setState({
                playerList: playerList
            }, () => {
                // this.checkHandicapFacility(friendItemModel.id, this.course_selected);
                // this.scrollView.scrollToEnd({ animated: true });
                this.checkHandicapFacilityPlayer('', playerList);
                // this.setPlayerChangeCallback(playerList);
            });

            // if (friendItemModel != null) {
            //     // friendItemModel.teeObject = { tee: this.state.teeColorName, color: this.state.teeColor }


            // }
        }
    }

    setPlayerChangeCallback(playerList) {
        if (this.props.onPlayerChange) {
            this.props.onPlayerChange(playerList);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: scale(5),
        borderBottomRightRadius: scale(5)
    },
    line: {
        height: verticalScale(1),
        backgroundColor: '#D6D4D4'
    },
    tee_group: {
        flexDirection: 'row',
        paddingLeft: scale(15),
        paddingTop: verticalScale(15),
        alignItems: 'center',
        paddingBottom: verticalScale(15),
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-between'
    },
    path_title: {
        color: '#454545',
        fontSize: fontSize(15, scale(1)),// 15,
        marginRight: scale(15),
        minWidth: 65
    },
    player_text_header: {
        color: '#454545',
        fontSize: fontSize(15, scale(1)),// 15
        fontWeight: 'bold'
    },
    player_header: {
        backgroundColor: '#F2F2F2',
        height: verticalScale(30),
        paddingLeft: scale(10),
        justifyContent: 'center',
        borderTopLeftRadius: scale(8),
        borderTopRightRadius: scale(8)
    },
    touchable_add_player: {
        // backgroundColor: '#FFFFFF',
        // borderColor: '#00ABA7',
        // borderWidth: 0.5,
        // justifyContent: 'center',
        alignItems: 'center',
        margin: scale(10),
        // paddingTop: verticalScale(10),
        // paddingBottom: verticalScale(10)
        borderBottomLeftRadius: scale(5),
        borderBottomRightRadius: scale(5)
    },
    text_add_player: {
        flex: 1,
        color: '#00ABA7',
        fontSize: fontSize(17, scale(2)),// 17
        marginLeft: scale(10)
    },
    view_icon: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: scale(2),
        borderColor: '#00ABA7'
    },
    img_icon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        tintColor: '#00ABA7'
    }
});