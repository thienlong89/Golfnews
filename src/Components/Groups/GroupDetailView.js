import React from 'react';
import {
    StyleSheet,
    NativeModules,
    Text,
    View,
    Alert,
    Image,
    SectionList,
    BackHandler,
    Platform,
    LayoutAnimation,
    TouchableOpacity
} from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import Touchable from 'react-native-platform-touchable';
import GroupItemAdd from '../Groups/GroupItemAdd';
import FriendModel from '../../Model/Friends/FriendsModel';
import HeaderView from '../HeaderView';
import CheckHandicapView from '../Common/CheckHandicapView';
import MyView from '../../Core/View/MyView';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import AppUtil from '../../Config/AppUtil';
import ListViewShow from '../Common/ListViewShow';
// import PopupConfirmFullView from '../Popups/PopupConfirmFullView';
import PopupSelectTeeView from '../Common/PopupSelectTeeView';
import MemberFlightEventItem from '../CLB/Items/MemberFlightEventItem';
import FlightGroupModel from '../../Model/Group/FlightGroupModel';
import FloatBtnActionView from '../Common/FloatBtnActionView';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
import PopupYesOrNo from '../Common/PopupYesOrNo';
import ModalDropdown from 'react-native-modal-dropdown';
import PopupSwapTypeSelect from '../Common/PopupSwapTypeSelect';
import PopupSwapPlayer from './PopupSwapPlayer';

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);

export default class GroupDetailView extends BaseComponent {

    constructor(props) {
        super(props);

        this.isIphoneX = this.getAppUtil().isIphoneX();
        let { data, isMustUpdate,show_chat } = this.props.navigation.state.params;
        this.groupId = data.groupId;
        console.log('..................show chat : ',this.show_chat);
        this.show_chat = show_chat ? true :false;
        this.groupName = data.groupName;
        this.isHost = data.host;
        this.page = 1;
        this.isCheckedHandicap = false;
        this.teeListAvailable = [];
        this.refMemberFlightEvent = [];
        this.teeSelected = undefined;
        this.courseData = '';
        this.flatListOffset = 0;
        this.shareShowing = false;
        this.isSwapping = false;
        this.playerSwap;
        console.log('GroupDetailView.isMustUpdate', isMustUpdate)
        this.isMustUpdate = isMustUpdate || false;
        this.refDropdown = [];
        this.sourceLock = [this.getResources().ic_unlock, this.getResources().ic_lock];
        this.state = {
            memberFlightList: [],
            isCreator: true
        };

        this.onTeeSelected = this.onTeeSelected.bind(this);
        this.randomSwapUser = this.requestRandomSwapUser.bind(this);
        this.onConfirmSwap = this.onConfirmSwap.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
        this.onGroupInfoPress = this.onGroupInfoPress.bind(this);
        this.onChangeTeeAll = this.onChangeTeeAllPress.bind(this);
        this.onShareClick = this.onShareGroupClick.bind(this);
        this.onScroll = this.onScrollFlatList.bind(this);
        this.loadMoreData = this.loadMoreData.bind(this);
        this.onHDCSwap = this.onHDCSwap.bind(this);
        this.onRandomSwap = this.onRandomSwap.bind(this);
        this.onSwapPlayerCallback = this.onSwapPlayerCallback.bind(this);
    }

    /**
     * random swap user trong flight
     */
    requestRandomSwapUser() {
        this.refPopupSwapTypeSelect.show();
    }

    onHDCSwap() {
        this.popupConfirmSwap.setContent(this.t('confirm_swap_by_hdc'), null, 0)
    }

    onRandomSwap() {
        this.popupConfirmSwap.setContent(this.t('confirm_swap_player_flight'), null, 1)
    }

    onDropdownPress(index) {
        this.refDropdown[index].show();
    }

    onConfirmSwap(type, extrasData) {
        if (extrasData === 0) {
            this.requestSwap(2);    // hdc
        } else {
            this.requestSwap(1);    // random
        }

    }

    requestSwap(type = 1) {
        this.loading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.random_swap_user_group_flight(this.groupId, type);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            this.loading.hideLoading();
            console.log("jsonData random swap : ", jsonData);
            if (jsonData.hasOwnProperty('error_code'));
            {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    //thanh cong thi reload lai page
                    self.page = 1;
                    self.requestGroupFlight(this.teeSelected ? this.teeSelected.tee : undefined, this.courseData, false, false);
                }
            }
        }, () => {
            this.loading.hideLoading();
        });
    }

    renderDropdown(indexTitle, maxMember, group_id, flight_group_id) {
        if (this.isHost) {
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
                            onSelect={this.onChangeMaxNumber.bind(this, group_id, flight_group_id)}
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

    renderSwapBtn(is_block) {
        if (!this.isHost || is_block) {
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

    renderSectionHeader({ index, max_member, group_id, flight_group_id, is_block }) {
        return (
            <View style={styles.view_section_header}>
                <Text allowFontScaling={global.isScaleFont} style={styles.txt_section}>
                    {`FLIGHT ${index}`.toUpperCase()}
                </Text>

                <View style={styles.view_header_setting}>
                    {this.renderDropdown(index, max_member, group_id, flight_group_id)}

                    <MyView hide={!this.isHost}>
                        <TouchableOpacity onPress={this.onLockUnlockFlight.bind(this, flight_group_id, group_id, is_block, index)}
                            style={{ padding: scale(5) }}>
                            <Image
                                style={styles.img_lock}
                                source={this.sourceLock[is_block]} />
                        </TouchableOpacity>
                    </MyView>

                    {this.renderSwapBtn(is_block)}
                </View>

            </View>
        )
    }

    render() {

        let { memberFlightList, isCreator } = this.state;
        isCreator = (this.state.memberFlightList.length > 1) ? true : false;
        // console.log('isCreator', isCreator);
        return (
            <View style={[styles.container, this.isIphoneX? {paddingBottom: 15} : {}]}>
                <HeaderView
                    title={this.groupName}
                    handleBackPress={this.onBackPress}
                    iconMenuStyle={styles.icon_menu_style}
                    iconMenu={this.getResources().ic_group_info}
                    onIconMenuClick={this.onGroupInfoPress} />

                <View style={styles.container_content}>
                    <CheckHandicapView ref={(checkHandicap) => { this.checkHandicap = checkHandicap; }}
                        onChangeTeeAll={this.onChangeTeeAll} />
                    <View style={[styles.view_section_list]}>
                        <SectionList
                            renderItem={({ item, index, section }) =>
                                <MemberFlightEventItem
                                    ref={(refMemberFlightEventItem) => this.refMemberFlightEvent[[section.title.index, index]] = refMemberFlightEventItem}
                                    memberItem={item}
                                    onChangeTeePress={this.onChangeTeePress.bind(this, item, index, section)}
                                    onSwapPlayer={this.onSwapPlayerPress.bind(this, item, index, section)}
                                    isShowSwap={this.isHost}
                                    index={index} />
                            }
                            renderSectionHeader={({ section: { title } }) => this.renderSectionHeader(title)}
                            ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                            sections={memberFlightList}
                            keyExtractor={(item, index) => item + index}
                            onScroll={this.onScroll}
                            onEndReached={this.loadMoreData}
                            onEndReachedThreshold={0.1}
                            stickySectionHeadersEnabled={true}
                        />

                        {this.renderInternalLoading()}
                    </View>

                    <FloatBtnActionView
                        ref={(refFloatActionView) => { this.refFloatActionView = refFloatActionView; }}
                        icon={this.getResources().share_logo}
                        isShowing={this.isCheckedHandicap}
                        onFloatActionPress={this.onShareClick}
                        text={this.t('share')} />

                    <ListViewShow ref={(listCheckHandicap) => { this.listCheckHandicap = listCheckHandicap; }} />

                </View>

                <PopupSelectTeeView
                    ref={(refPopupSelectTeeView) => { this.refPopupSelectTeeView = refPopupSelectTeeView; }}
                    onTeeSelected={this.onTeeSelected} />

                <PopupSwapPlayer
                    ref={(refPopupSwapPlayer) => { this.refPopupSwapPlayer = refPopupSwapPlayer; }}
                    group_id={this.groupId}
                    onCallbackPress={this.onSwapPlayerCallback} />

                <PopupYesOrNo
                    ref={(popupConfirmSwap) => { this.popupConfirmSwap = popupConfirmSwap; }}
                    content={this.t('confirm_swap_player_flight')}
                    confirmText={this.t('agree')}
                    cancelText={this.t('cancel')}
                    onConfirmClick={this.onConfirmSwap} />

                <PopupSwapTypeSelect
                    ref={(refPopupSwapTypeSelect) => { this.refPopupSwapTypeSelect = refPopupSwapTypeSelect; }}
                    onHDCSwap={this.onHDCSwap}
                    onRandomSwap={this.onRandomSwap} />
                {this.renderMessageBar()}
                {this.renderLoading()}
            </View >
        );
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();

        //this.checkHandicap.selectedCallback = this.onSelectedFacility.bind(this);
        this.checkHandicap.completeCallback = this.onSearchCheckHandicap.bind(this);
        this.checkHandicap.showPopupCallback = this.onCheckListClick.bind(this);
        this.checkHandicap.enableLoadingCallback = this.enableLoadingSearch.bind(this);
        this.listCheckHandicap.itemClickCallback = this.onSelectedFacility.bind(this);

        this.requestGroupFlight();
    }

    enableLoadingSearch() {
        this.listCheckHandicap.show();
        this.listCheckHandicap.showLoading();
        this.listCheckHandicap.setFillData([]);
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
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

    onBackPress() {
        if (this.refPopupSwapPlayer && this.refPopupSwapPlayer.isShowing()) {
            this.refPopupSwapPlayer.dismiss();
        } else if (this.props.navigation) {
            this.props.navigation.goBack();

            if (this.props.navigation.state.params.refresh && this.isMustUpdate) {
                this.props.navigation.state.params.refresh();
            }
        }

        return true;
    }

    loadMoreData() {
        this.page++;
        console.log('loadMoreData', this.page)
        this.requestGroupFlight(this.teeSelected ? this.teeSelected.tee : undefined, this.courseData);
    }

    onChangeMaxNumber(group_id, flight_group_id, idx, maxMember) {
        console.log('onChangeMaxNumber', group_id, flight_group_id, idx, maxMember)
        let self = this;
        this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.change_max_member_flight(group_id, flight_group_id, maxMember);
        console.log("url = ", url);
        Networking.httpRequestGet(url, (jsonData) => {
            self.internalLoading.hideLoading();
            console.log("onChangeMaxNumber", jsonData);
            if (jsonData.error_code === 0) {
                self.page = 1;
                self.requestGroupFlight(self.teeSelected ? self.teeSelected.tee : undefined, self.courseData);
            }
        }, () => {
            self.internalLoading.hideLoading();
        });
    }

    onGroupInfoPress() {
        this.props.navigation.navigate('group_info_view', {
            data: this.props.navigation.state.params.data,
            course: this.courseData,
            memberFlightList: this.state.memberFlightList,
            refreshCallBack: this.onRefreshCallBack.bind(this),
            show_chat : this.show_chat,
        })
    }

    onRefreshCallBack(isMustUpdate, groupName) {
        this.isMustUpdate = isMustUpdate;
        if (isMustUpdate) {
            this.groupName = groupName;
            this.setState({

            }, () => {
                this.page = 1;
                this.requestGroupFlight(this.teeSelected ? this.teeSelected.tee : undefined, this.courseData);
            })
        }
    }

    onScrollFlatList(event) {
        const CustomLayoutLinear = {
            duration: 100,
            create: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
            update: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
            delete: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity }
        }
        // Check if the user is scrolling up or down by confronting the new scroll position with your own one
        const currentOffset = event.nativeEvent.contentOffset.y;
        const direction = (currentOffset > 0 && currentOffset > this.flatListOffset)
            ? 'down'
            : 'up'
        // If the user is scrolling down (and the action-button is still visible) hide it
        const isActionButtonVisible = direction === 'up'
        if (isActionButtonVisible !== this.shareShowing) {
            LayoutAnimation.configureNext(CustomLayoutLinear)
            this.shareShowing = isActionButtonVisible;
            if (this.isCheckedHandicap) {
                this.refFloatActionView.setVisible(this.shareShowing);
            }
        }
        // Update your scroll position
        this.flatListOffset = currentOffset
    }

    requestGroupFlight(teeName, course, isChangeTee = false, showLoading = true) {
        if (showLoading) {
            this.internalLoading.showLoading();
        }
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.group_member_flight(this.page);
        this.Logger().log("url", url);
        let formData = {
            "group_id": this.groupId,
        }

        if (course) {
            formData.course = course;
        }
        if (teeName) {
            formData.tee = teeName;
        }

        this.Logger().log('formData', formData);

        Networking.httpRequestPost(url, (jsonData) => {
            self.internalLoading.hideLoading();
            self.model = new FlightGroupModel();
            self.model.parseData(isChangeTee || self.page === 1 ? 0 : self.state.memberFlightList.length, jsonData);
            if (self.model.getErrorCode() === 0) {
                let ls = self.model.getFlightGroup();
                if (ls.length > 0) {
                    if (self.page === 1) {
                        self.state.memberFlightList = [];
                    }
                    if (self.isSwapping) {
                        ls.map((flightSection, index) => {
                            flightSection.data.map((flightEventItem) => {
                                flightEventItem.isSelectSwap = 1;
                            })
                        });
                    }
                    self.setState({
                        memberFlightList: isChangeTee ? [...ls] : [...self.state.memberFlightList, ...ls],
                    }, () => {
                        if (self.isCheckedHandicap) {
                            self.shareShowing = true;
                            self.refFloatActionView.setVisible(self.shareShowing);
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
        //this.onGroupFlightResponse.bind(this, isChangeTee)
    }

    /**
     * show du lieu khi tim kiem xong
     * @param {*} listData 
     */
    onSearchCheckHandicap(listData) {
        // console.log('list search data........................... ',listData);
        if (!listData.length) {
            this.listCheckHandicap.hide();
        }
        if (this.listCheckHandicap) {
            this.listCheckHandicap.hideLoading();
            this.listCheckHandicap.setFillData(listData);
        }
    }

    /**
     * show popup
     */
    onCheckListClick() {
        this.listCheckHandicap.switchShow()
    }

    onSelectedFacility(data) {
        this.isCheckedHandicap = true;

        // this.courseData = data;
        this.courseData = data.getCourse();
        this.teeListAvailable = data.getTeeInfoGender();
        // this.teeSelected = this.teeListAvailable.length > 0 ? this.teeListAvailable[0] : {};
        this.checkHandicap.setDataSearch(data, this.teeSelected);
        // this.Logger().log('...................................... teeSelected',this.teeSelected);

        this.page = 1;
        this.requestGroupFlight(this.teeSelected ? this.teeSelected.tee : undefined, this.courseData, true);
    }

    onShareGroupClick() {
        let { data } = this.props.navigation.state.params;
        this.props.navigation.navigate('group_share_view', {
            data: data,
            tee: this.teeSelected ? this.teeSelected.tee : undefined,
            course: this.courseData,
            group_id: this.groupId,
            memberFlightList: this.state.memberFlightList
        })
    }

    onChangeTeeAllPress() {
        if (this.teeListAvailable.length != 0)
            this.refPopupSelectTeeView.setVisible(this.teeListAvailable);
    }

    onChangeTeePress(flightGroupItem, index, section) {
        this.refPopupSelectTeeView.setVisible(this.teeListAvailable, { flightGroupItem, index, section });
    }

    onTeeSelected(teeObject, extrasData) {
        if (extrasData != '') {
            this.requestCheckHandicapFriend(teeObject, extrasData)
        } else {
            this.page = 1;
            this.teeSelected = teeObject;
            this.checkHandicap.setTeeSelected(teeObject);
            this.requestGroupFlight(teeObject.tee, this.courseData, true)
        }
    }

    requestCheckHandicapFriend(teeObject, { flightGroupItem, index, section }) {
        let { memberFlightList } = this.state;
        let formData = {
            "user_ids": flightGroupItem.getUserId(),
            "tee": teeObject.tee,
            "course": this.courseData
        }
        // console.log('formData', formData);
        let url = this.getConfig().getBaseUrl() + ApiService.check_handicap_facility();
        console.log('url', url);
        // this.internalLoading.showLoading();
        let self = this;
        Networking.httpRequestPost(url, (jsonData) => {
            console.log("jsonData.................. ", jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                if (parseInt(jsonData['error_code']) === 0) {
                    let data = jsonData['data'];
                    if (data['courses_handicap'].length > 0) {
                        let handicap = data['courses_handicap'][0];
                        // console.log('handicap', handicap)
                        // if (section.length > index) {
                        memberFlightList[section.title.index - 1].data[index].course_index = handicap.display_course.value;
                        memberFlightList[section.title.index - 1].data[index].teeDisplay = teeObject;
                        // }
                        // console.log('memberFlightList', memberFlightList[section.title - 1].data[index])
                        this.setState({
                            memberFlightList: memberFlightList
                        })
                    }
                }
            }
            // self.internalLoading.hideLoading();
        }, formData, () => {
            // self.internalLoading.hideLoading();
        });
    }

    onSwapPlayerPress(item, indexItem, section) {
        let { memberFlightList } = this.state;
        // this.playerSwap = { item, indexItem, section };
        // console.log('onSwapPlayerPress', indexItem, section)
        console.log('onSwapPlayerPress', memberFlightList.length)
        // this.refPopupSwapPlayer.show(item, memberFlightList.slice(), this.page, section, memberFlightList.length);
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
            }, () => {

            })

        } else {
            this.requestSwapPlayerFlight(item, indexItem, section);
        }

        this.isSwapping = !this.isSwapping;
    }

    onSwapPlayerCallback(player, index, section) {
        let self = this;
        let fromData = {
            "group_id": this.groupId,
            "uid1": this.playerSwap.item.getUserId(),
            "id_flight_group_uid1": this.playerSwap.item.getFlightGroupId(),
            "uid2": player.getUserId(),
            "id_flight_group_uid2": player.getFlightGroupId()
        }
        this.Logger().log("formData swap player....................... , ", fromData);
        let url = this.getConfig().getBaseUrl() + ApiService.group_member_swap();
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

    requestSwapPlayerFlight(flightEventItem, indexItem, section) {

        let self = this;
        let fromData = {
            "group_id": this.groupId,
            "uid1": this.playerSwap.item.getUserId(),
            "id_flight_group_uid1": this.playerSwap.item.getFlightGroupId(),
            "uid2": flightEventItem.getUserId(),
            "id_flight_group_uid2": flightEventItem.getFlightGroupId()
        }
        this.Logger().log("formData swap player....................... , ", fromData);
        let url = this.getConfig().getBaseUrl() + ApiService.group_member_swap();
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
            self.showErrorMsg(this.t('time_out'));
        });
    }

    implementSwapAnimation(playerSwap2, indexItem2, section2) {
        try {
            let { memberFlightList } = this.state;
            let { item, indexItem, section } = this.playerSwap;

            let flight_group_id2 = playerSwap2.flight_group_id;
            memberFlightList[section.title.index - 1].data[indexItem] = playerSwap2;
            memberFlightList[section.title.index - 1].data[indexItem].flight_group_id = item.flight_group_id;

            if (section2.title.index - 1 < memberFlightList.length) {
                memberFlightList[section2.title.index - 1].data[indexItem2] = item;
                memberFlightList[section2.title.index - 1].data[indexItem2].flight_group_id = flight_group_id2;
            }

            memberFlightList.map((flightSection, index) => {
                flightSection.data.map((flightEventItem) => {
                    flightEventItem.isSelectSwap = -1;
                })
            });

            this.setState({
                memberFlightList: memberFlightList
            }, () => {
                // setTimeout(()=>{
                this.refMemberFlightEvent[[section2.title.index, indexItem2]].startAnimate();
                // }, 50)

            })
        } catch (error) {
            console.log('implementSwapAnimation.error', error)
        }

    }

    onLockUnlockFlight(flight_group_id, group_id, is_block, index) {
        let { memberFlightList } = this.state;
        let self = this;
        this.internalLoading.showLoading();
        let block = is_block === 0 ? 1 : 0;
        let url = this.getConfig().getBaseUrl() + ApiService.group_block_unlock_flight(group_id, flight_group_id, block);
        console.log("url = ", url);
        Networking.httpRequestGet(url,
            (jsonData) => {
                self.internalLoading.hideLoading();
                console.log('onLockUnlockFlight.jsonData', jsonData)
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
                    console.log('onLockUnlockFlight.data', block, memberFlightList[index - 1].data)
                    this.setState({
                        memberFlightList: memberFlightList
                    }, () => {
                        if (block === 1) {
                            for (let i = 0; i < 4; i++) {
                                if (this.refMemberFlightEvent[[index, i]]) {
                                    console.log('refMemberFlightEvent.setCollapse', index, i)
                                    this.refMemberFlightEvent[[index, i]].setCollapse();
                                }

                            }
                        } else {
                            for (let i = 0; i < 4; i++) {
                                if (this.refMemberFlightEvent[[index, i]]) {
                                    console.log('refMemberFlightEvent.setExpand', index, i)
                                    this.refMemberFlightEvent[[index, i]].setExpand();
                                }

                            }
                        }

                    })
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
    container_content: {
        flex: 1,
    },
    view_section_list: {
        flex: 1,
        marginTop: verticalScale(10)
    },
    view_section_header: {
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
        marginRight: scale(10),
        marginLeft: scale(10)
    },
    section_header_right: {

    },
    view_check_tee_all: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: verticalScale(40),
        marginLeft: scale(10),
        marginRight: scale(10),
        marginBottom: verticalScale(10),
        borderColor: '#919191',
        borderWidth: (Platform.OS === 'ios') ? 1 : 0.5
    },
    txt_select_tee: {
        color: '#707070',
        fontSize: fontSize(15, scale(1)),
        marginLeft: scale(5)
    },
    view_tee: {
        height: verticalScale(40),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: scale(10),
        borderColor: '#C7C7C7',
        borderWidth: (Platform.OS === 'ios') ? 1 : 0.5,
        // borderRadius: 5,
        borderRadius: verticalScale(3),
    },
    icon_menu_style: {
        width: verticalScale(25),
        height: verticalScale(25),
        resizeMode: 'contain'
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