import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    SectionList,
    TouchableOpacity,
    Image
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import MemberFlightEventItem from '../Items/MemberFlightEventItem';
import PopupSelectTeeView from '../../Common/PopupSelectTeeView';
import FlightEventModel from '../../../Model/Events/FlightEventModel';
import TeeViewHorizontal from '../../Common/TeeViewHorizontal';
import ModalDropdown from 'react-native-modal-dropdown';
import MyView from '../../../Core/View/MyView';
import PopupYesOrNo from '../../Common/PopupYesOrNo';
import PopupSwapPlayerEvent from './PopupSwapPlayerEvent';

import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';

export default class MemberFlightListView extends BaseComponent {

    static defaultProps = {
        eventId: '',
        isCreator: false,
        isAppointment: false
    }

    constructor(props) {
        super(props);
        this.listTeeAvailable = [];
        this.course = null;
        this.page = 1;
        this.teeAll = '';
        this.isSwapping = false;
        this.playerSwap;
        this.refDropdown = [];
        this.refMemberFlightEvent = [];
        this.sourceLock = [this.getResources().ic_unlock, this.getResources().ic_lock];
        this.state = {
            memberFlightList: []
        }

        this.onChangeTeeAll = this.onChangeTeeAll.bind(this);
        this.onTeeSelected = this.onTeeSelected.bind(this);
        this.randomSwapUser = this.randomSwapUser.bind(this);
        this.loadMoreData = this.loadMoreData.bind(this);
        this.onSwapPlayerCallback = this.onSwapPlayerCallback.bind(this);
    }

    renderSwapBtn(isCreator, is_block) {
        if (!isCreator || is_block) {
            return (
                <View style={{ width: scale(30), height: scale(30) }}>

                </View>
            )
        }
        return (
            <TouchableOpacity onPress={this.randomSwapUser}
                style={{ padding: scale(5) }}>
                <Image style={{ width: scale(20), height: scale(20), resizeMode: 'contain', tintColor: '#fff' }}
                    source={this.getResources().ic_swap_player} />
            </TouchableOpacity>
        )
    }

    renderSectionHeader({ index, max_member, event_id, flight_event_id, is_block }) {
        let { isCreator } = this.props;
        return (
            <View style={styles.view_section}>
                <Text allowFontScaling={global.isScaleFont} style={styles.txt_section}>
                    {`FLIGHT ${index}`.toUpperCase()}
                </Text>
                <View style={styles.view_header_setting}>
                    {this.renderDropdown(index, max_member, event_id, flight_event_id)}

                    <MyView hide={!isCreator}>
                        <TouchableOpacity onPress={this.onLockUnlockFlight.bind(this, flight_event_id, event_id, is_block, index)}
                            style={{ padding: scale(5) }}>
                            <Image
                                style={styles.img_lock}
                                source={this.sourceLock[is_block]} />
                        </TouchableOpacity>
                    </MyView>

                    {this.renderSwapBtn(isCreator, is_block)}
                </View>
            </View>
        )
    }

    renderDropdown(indexTitle, maxMember, event_id, flight_event_id) {
        if (this.props.isCreator) {
            return (
                <TouchableOpacity onPress={this.onDropdownPress.bind(this, indexTitle)}>
                    <View style={styles.view_option}>
                        <ModalDropdown
                            options={['1', '2', '3', '4']}
                            defaultValue={maxMember}
                            ref={(refDropdown) => { this.refDropdown[indexTitle] = refDropdown; }}
                            style={styles.dropdown_tee}
                            textStyle={styles.dropdown_text}
                            dropdownStyle={styles.dropdown_style}
                            onSelect={this.onChangeMaxNumber.bind(this, event_id, flight_event_id)}
                            renderRow={(rowData, index, isSelected) =>
                                <View style={{ backgroundColor: isSelected ? '#99E6FF' : '#FFFFFF' }}>
                                    {/* <Touchable onPress={() => this.onSelectedTee(rowData, index)}> */}
                                    <Text allowFontScaling={global.isScaleFont} style={styles.text_dropdown}>{rowData}</Text>
                                    {/* </Touchable> */}
                                </View>
                            } />
                        <Image
                            style={styles.img_dropdown}
                            source={this.getResources().ic_arrow_down} />
                    </View>
                </TouchableOpacity>
            )
        } else {
            return null;
        }
    }

    render() {
        console.log('MemberFlightListView.render')
        let { memberFlightList } = this.state;
        let { isCreator } = this.props;

        return (
            <View style={styles.container}>
                <View style={[styles.line, { marginBottom: 3, marginTop: 5 }]} />
                <Touchable onPress={this.onChangeTeeAll}>
                    <View style={styles.view_check_tee_all}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_select_tee}>
                            {this.t('select_tee_handicap')}
                        </Text>
                        <TeeViewHorizontal
                            ref={(refTeeViewHorizontal) => { this.refTeeViewHorizontal = refTeeViewHorizontal; }}
                            isNoneBoder={true}
                        />
                    </View>
                </Touchable>
                <View style={[styles.line, { marginBottom: 10, marginTop: 0 }]} />

                <SectionList
                    renderItem={({ item, index, section }) =>
                        <MemberFlightEventItem
                            ref={(refMemberFlightEventItem) => this.refMemberFlightEvent[[section.title.index, index]] = refMemberFlightEventItem}
                            memberItem={item}
                            onChangeTeePress={this.onChangeTeePress.bind(this, item, index, section)}
                            onSwapPlayer={this.onSwapPlayerPress.bind(this, item, index, section)}
                            isShowSwap={isCreator}
                            index={index} />
                    }
                    renderSectionHeader={({ section: { title } }) => this.renderSectionHeader(title)}
                    ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                    sections={memberFlightList}
                    keyExtractor={(item, index) => item + index}
                    onEndReached={this.loadMoreData}
                    onEndReachedThreshold={0.1}
                    stickySectionHeadersEnabled={true}
                />
                <PopupSelectTeeView
                    ref={(refPopupSelectTeeView) => { this.refPopupSelectTeeView = refPopupSelectTeeView; }}
                    onTeeSelected={this.onTeeSelected} />

                <PopupSwapPlayerEvent
                    ref={(refPopupSwapPlayer) => { this.refPopupSwapPlayer = refPopupSwapPlayer; }}
                    group_id={this.groupId}
                    onCallbackPress={this.onSwapPlayerCallback} />

                {this.renderInternalLoading()}
                {this.renderMessageBar()}
            </View>
        );
    }



    componentDidMount() {
        this.registerMessageBar();
    }

    componentWillUnmount() {
        this.unregisterMessageBar();

    }

    refreshList() {
        this.page = 1;
        this.requestMemberFlightList();
    }

    loadMoreData() {
        this.page++;
        console.log('loadMoreData', this.page)
        this.requestMemberFlightList();
    }

    requestMemberFlightList(isChangeTee = false) {
        let self = this;
        this.internalLoading.showLoading();
        let url;
        if (this.props.isAppointment) {
            url = this.getConfig().getBaseUrl() + ApiService.get_list_flight_by_event(this.page);
        } else {
            url = this.getConfig().getBaseUrl() + ApiService.event_member_list_flight(this.page);
        }

        console.log('url', url)
        let formData = {
            "event_id": this.props.eventId,
        }
        if (this.course) {
            formData.course = this.course;
        }
        if (this.teeAll) {
            formData.tee = this.teeAll;
        }

        console.log('requestMemberFlightList.formData', formData)

        Networking.httpRequestPost(url, (jsonData) => {
            self.internalLoading.hideLoading();
            self.model = new FlightEventModel();
            self.model.parseData(isChangeTee || self.page === 1 ? 0 : self.state.memberFlightList.length, jsonData);
            if (self.model.getErrorCode() === 0) {
                let ls = self.model.getFlightEvent();
                if (ls.length > 0) {
                    if (self.page === 1) {
                        self.state.memberFlightList = [];
                    }
                    self.setState({
                        memberFlightList: isChangeTee ? [...ls] : [...self.state.memberFlightList, ...ls],
                    }, () => {
                        if (this.props.memberFlightList) {
                            this.props.memberFlightList(this.state.memberFlightList);
                        }
                    })
                }

            } else {
                this.showErrorMsg(self.model.getErrorMsg());
            }
        }, formData,
            (error) => {
                self.internalLoading.hideLoading();
            });
    }

    setListTeeAndCourse(listTee = [], course) {
        this.listTeeAvailable = course ? course.getTeeInfoGender() : [];
        this.course = course;
        this.requestMemberFlightList();
    }

    onChangeTeePress(flightEventItem, index, section) {
        this.refPopupSelectTeeView.setVisible(this.listTeeAvailable, { flightEventItem, index, section });
    }

    onChangeTeeAll() {
        this.refPopupSelectTeeView.setVisible(this.listTeeAvailable);
    }

    onTeeSelected(teeObject, extrasData) {
        if (extrasData != '') {
            this.requestCheckHandicapFriend(teeObject, extrasData)
        } else {
            this.refTeeViewHorizontal.setTeeSelected(teeObject);
            this.teeAll = teeObject.tee;
            if (this.props.onTeeSelected) {
                this.props.onTeeSelected(this.teeAll);
            }
            this.requestMemberFlightList();
        }

    }

    requestCheckHandicapFriend(teeObject, { flightEventItem, index, section }) {
        let { memberFlightList } = this.state;
        let course = {};
        if (this.course) {
            course = {
                'facility_id': this.course.facility_id,
                "path_id1": this.course.path_id1,
                "path_id2": this.course.path_id2,
                "path_id3": this.course.path_id3,
                "title": this.course.title,
            }
            let teeInfo = this.course.teeListAvailable;
            for (let tee of teeInfo) {
                course[`${tee.tee}_slope`] = tee.slope;
            }
        }

        let formData = {
            "user_ids": flightEventItem.getUserProfile().getId(),
            "tee": teeObject.tee,
            "course": course
        }
        let url = this.getConfig().getBaseUrl() + ApiService.check_handicap_facility();
        console.log('url', url);
        this.internalLoading.showLoading();
        let self = this;
        console.log('requestCheckHandicapFriend', JSON.stringify(course))
        Networking.httpRequestPost(url, (jsonData) => {
            console.log('requestCheckHandicapFriend.jsonData', jsonData)
            if (jsonData.hasOwnProperty('error_code')) {
                if (parseInt(jsonData['error_code']) === 0) {
                    let data = jsonData['data'];
                    if (data['courses_handicap'].length > 0) {
                        let handicap = data['courses_handicap'][0];
                        // if (section.length > index) {
                        memberFlightList[section.title.index - 1].data[index].course_index = handicap.display_course.value;
                        memberFlightList[section.title.index - 1].data[index].teeDisplay = teeObject;
                        // }

                        this.setState({
                            memberFlightList: memberFlightList
                        })
                    }
                }
            }
            self.internalLoading.hideLoading();
        }, formData, () => {
            self.internalLoading.hideLoading();
        });
    }

    onSwapPlayerPress(item, indexItem, section) {
        let { memberFlightList } = this.state;
        // this.playerSwap = { item, indexItem, section };
        // this.refPopupSwapPlayer.show(item, memberFlightList.slice(), this.page, section, memberFlightList.length);

        // let { memberFlightList } = this.state;

        if (!this.isSwapping) {
            this.playerSwap = { item, indexItem, section };
            memberFlightList.map((flightSection, index) => {
                if (flightSection.title === section.title) {
                    let data = flightSection.data;
                    for (let i = 0; i < data.length; i++) {
                        if (indexItem === i) {
                            data[i].isSelectSwap = 0;
                        } else {
                            data[i].isSelectSwap = 2;
                        }
                    }
                } else {
                    flightSection.data.map((flightEventItem) => {
                        flightEventItem.isSelectSwap = 1;
                    })
                }
            });
            this.setState({
                memberFlightList: memberFlightList
            })
        } else {
            this.requestSwapPlayerFlight(item, indexItem, section);
        }

        this.isSwapping = !this.isSwapping;
    }

    requestSwapPlayerFlight(flightEventItem, indexItem, section) {

        let self = this;
        let fromData = {
            "event_id": this.props.eventId,
            "uid1": this.playerSwap.item.getUserId(),
            "id_flight_event_uid1": this.playerSwap.item.getFlightEventId(),
            "uid2": flightEventItem.getUserId(),
            "id_flight_event_uid2": flightEventItem.getFlightEventId()
        }

        // console.log('requestSwapPlayerFlight', fromData);

        let url = this.getConfig().getBaseUrl() + ApiService.event_club_swap_player();
        this.internalLoading.showLoading();
        Networking.httpRequestPost(url, (jsonData) => {
            self.internalLoading.hideLoading();
            if (jsonData.error_code === 0) {
                self.implementSwapAnimation(flightEventItem, indexItem, section);
            } else {
                self.showErrorMsg(jsonData.error_msg);
            }

        }, fromData, () => {
            //time out
            self.internalLoading.hideLoading();
        });
    }

    onSwapPlayerCallback(player, index, section) {
        let self = this;
        let fromData = {
            "event_id": this.props.eventId,
            "uid1": this.playerSwap.item.getUserId(),
            "id_flight_event_uid1": this.playerSwap.item.getFlightEventId(),
            "uid2": player.getUserId(),
            "id_flight_event_uid2": player.getFlightEventId()
        }
        let url;
        if (this.props.isAppointment) {
            url = this.getConfig().getBaseUrl() + ApiService.swap_player_appointment();
        } else {
            url = this.getConfig().getBaseUrl() + ApiService.event_club_swap_player();
        }

        this.internalLoading.showLoading();
        Networking.httpRequestPost(url, (jsonData) => {
            self.internalLoading.hideLoading();
            if (jsonData.error_code === 0) {
                self.implementSwapAnimation(player, index, section);
            } else {
                self.showErrorMsg(jsonData.error_msg);
            }

        }, fromData, () => {
            //time out
            self.internalLoading.hideLoading();
        });
    }

    implementSwapAnimation(playerSwap2, indexItem2, section2) {
        try {
            let { memberFlightList } = this.state;
            let { item, indexItem, section } = this.playerSwap;

            let flight_event_id2 = playerSwap2.flight_event_id;
            memberFlightList[section.title.index - 1].data[indexItem] = playerSwap2;
            memberFlightList[section.title.index - 1].data[indexItem].flight_event_id = item.flight_event_id;

            if (section2.title.index - 1 < memberFlightList.length) {
                memberFlightList[section2.title.index - 1].data[indexItem2] = item;
                memberFlightList[section2.title.index - 1].data[indexItem2].flight_event_id = flight_event_id2;
            }

            memberFlightList.map((flightSection, index) => {
                flightSection.data.map((flightEventItem) => {
                    flightEventItem.isSelectSwap = -1;
                })
            });

            this.setState({
                memberFlightList: memberFlightList
            }, () => {
                this.refMemberFlightEvent[[section2.title.index, indexItem2]].startAnimate();
            })
        } catch (error) {
            console.log('implementSwapAnimation.error', error)
        }

    }

    randomSwapUser() {
        // this.refPopupSwapTypeSelect.show();
        if (this.props.onSelectSwapType) {
            this.props.onSelectSwapType();
        }
    }

    onDropdownPress(index) {
        this.refDropdown[index].show();
    }

    onChangeMaxNumber(event_id, flight_event_id, idx, maxMember) {
        console.log('onChangeMaxNumber', event_id, flight_event_id, idx, maxMember)
        let self = this;
        this.internalLoading.showLoading();
        let url;
        if (this.props.isAppointment) {
            url = this.getConfig().getBaseUrl() + ApiService.change_max_member_appointment(event_id, flight_event_id, maxMember);
        } else {
            url = this.getConfig().getBaseUrl() + ApiService.change_max_member(event_id, flight_event_id, maxMember);
        }
        console.log("url = ", url);
        Networking.httpRequestGet(url, (jsonData) => {
            self.internalLoading.hideLoading();
            console.log("onChangeMaxNumber", jsonData);
            if (jsonData.error_code === 0) {
                self.refreshList();
            }
        }, () => {
            self.internalLoading.hideLoading();
        });
    }

    requestSwap(type = 1) {
        console.log('requestSwap', type)
        this.internalLoading.showLoading();
        let url;
        if (this.props.isAppointment) {
            url = this.getConfig().getBaseUrl() + ApiService.random_flight_appointment(this.props.eventId, type);
        } else {
            url = this.getConfig().getBaseUrl() + ApiService.event_club_random_flight(this.props.eventId, type);
        }

        console.log('url', url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            this.internalLoading.hideLoading();
            console.log("jsonData random swap : ", jsonData);
            if (jsonData.hasOwnProperty('error_code'));
            {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    //thanh cong thi reload lai page
                    self.refreshList();
                }
            }
        }, () => {
            this.internalLoading.hideLoading();
        });
    }

    onLockUnlockFlight(flight_event_id, event_id, is_block, index) {
        let { memberFlightList } = this.state;
        let self = this;
        this.internalLoading.showLoading();
        let block = is_block === 0 ? 1 : 0;
        let url;
        if (this.props.isAppointment) {
            url = this.getConfig().getBaseUrl() + ApiService.appointment_block_unlock_flight(event_id, flight_event_id, block);
        } else {
            url = this.getConfig().getBaseUrl() + ApiService.event_block_unlock_flight(event_id, flight_event_id, block);
        }
        console.log("url = ", url);
        Networking.httpRequestGet(url,
            (jsonData) => {
                self.internalLoading.hideLoading();
                if (jsonData.error_code === 0) {
                    memberFlightList[index - 1].title.is_block = block;
                    for (let i = 0; i < 4; i++) {
                        if (memberFlightList[index - 1].data[i]) {
                            memberFlightList[index - 1].data[i].is_block = block;
                        }

                    }
                    // if (block === 1) {
                    //     memberFlightList[index - 1].title.is_block = block;
                    // }
                    this.setState({
                        memberFlightList: memberFlightList
                    }, () => {
                        if (block === 1) {
                            for (let i = 0; i < 4; i++) {
                                if (this.refMemberFlightEvent[[index, i]]) {
                                    this.refMemberFlightEvent[[index, i]].setCollapse();
                                }

                            }
                        } else {
                            for (let i = 0; i < 4; i++) {
                                if (this.refMemberFlightEvent[[index, i]]) {
                                    this.refMemberFlightEvent[[index, i]].setExpand();
                                }

                            }
                        }

                    })
                } else {
                    self.showErrorMsg(jsonData.error_msg);
                }
            }, () => {
                self.internalLoading.hideLoading();
                self.showErrorMsg(this.t('time_out'));
            });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    view_section: {
        backgroundColor: '#37B2E7',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: scale(10),
        marginRight: scale(10),
        flexDirection: 'row'
    },
    txt_section: {
        flex: 1,
        color: '#fff',
        fontSize: fontSize(13, scale(1)),
        paddingLeft: scale(5),
        paddingTop: verticalScale(3),
        paddingBottom: verticalScale(3)
    },
    separator_view: {
        height: 1,
        backgroundColor: '#D6D4D4',
        marginRight: 10,
        marginLeft: 10
    },
    line: {
        height: 1,
        backgroundColor: '#D6D4D4',
        marginRight: 10,
        marginLeft: 10,
    },
    section_header_right: {

    },
    view_check_tee_all: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        // borderColor: '#919191',
        // borderWidth: 0.5
    },
    txt_select_tee: {
        color: '#454545',
        fontSize: 15,
        marginLeft: 5
    },
    view_tee: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        borderColor: '#C7C7C7',
        borderWidth: 0.5,
        borderRadius: 5,
        borderRadius: 3,
    },
    dropdown_tee: {
        // width: scale(70),
        // height: verticalScale(30),
    },
    dropdown_text: {
        //marginVertical: 10,
        //marginHorizontal: 6,
        fontSize: fontSize(15, scale(2)),// 16,
        color: 'white',
        marginRight: scale(10),
        fontWeight: 'bold',
        paddingBottom: 3,
        paddingTop: 3
    },
    dropdown_style: {
        // borderColor: 'cornflowerblue',
        // marginRight: -scale(20),
        borderWidth: 2,
        borderRadius: 3,
        width: scale(50),
        marginTop: -20,
    },
    text_dropdown: {
        color: '#615B5B',
        paddingLeft: scale(10),
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10),
        fontSize: fontSize(14),
    },
    view_option: {
        flexDirection: 'row',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 3,
        alignItems: 'center',
        marginTop: scale(3),
        marginBottom: scale(3),
        paddingLeft: scale(3),
        paddingRight: scale(3),
        justifyContent: 'center',
        marginRight: 2,
        width: scale(50)
    },
    img_dropdown: {
        width: scale(10),
        height: scale(10),
        resizeMode: 'contain',
        tintColor: 'white'
    },
    img_lock: {
        width: scale(15),
        height: scale(15),
        resizeMode: 'contain'
    },
    view_header_setting: {
        flex: 1.2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});