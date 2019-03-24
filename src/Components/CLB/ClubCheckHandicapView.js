import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    FlatList,
    Image,
    BackHandler,
    LayoutAnimation,
    Keyboard
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import CheckHandicapView from '../Common/CheckHandicapView';
import PopupSelectTeeView from '../Common/PopupSelectTeeView';
import LoadingView from '../../Core/Common/LoadingView';
import FriendModel from '../../Model/Friends/FriendsModel';
import CheckHandicapMemberItem from './Items/CheckHandicapMemberItem';
import ListViewShow from '../Common/ListViewShow';
import HeaderView from '../HeaderView';
import MyView from '../../Core/View/MyView';
import PopupYesOrNo from '../Common/PopupYesOrNo';
import FloatBtnActionView from '../Common/FloatBtnActionView';
import ClubMemberPayFeeModel from '../../Model/CLB/ClubMemberPayFeeModel';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default class ClubCheckHandicapView extends BaseComponent {

    constructor(props) {
        super(props);

        this.isIphoneX = this.getAppUtil().isIphoneX();
        let params = this.props.navigation.state.params;
        this.clubId = params.clubId;
        this.clubName = params.clubName;
        this.isAdmin = params.isAdmin;
        this.totalMember = params.totalMember;
        this.invitation_id = params.invitation_id;
        this.page = 1;
        this.array_handicap = [];
        this.isCheckedHandicap = false;
        this.teeListAvailable = [];
        this.teeSelected = {};
        this.courseData = '';
        this.flatListOffset = 0;
        this.shareShowing = false;
        this.refItemList = [];
        this.state = {
            dataMemberLs: [],
            isShowInvite: params.isAccepted
        }

        this.onChangeMyTeePress = this.onChangeTeePress.bind(this);
        this.onChangeTeeAll = this.onChangeTeeAll.bind(this);
        this.onAcceptInviteClick = this.onAcceptInviteClick.bind(this);
        this.onRejectInviteClick = this.onRejectInviteClick.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
        this.onScrollFlatList = this.onScrollFlatList.bind(this);
        this.onShareClick = this.onShareClick.bind(this);
        this.onPopupConfirmClick = this.onPopupConfirmClick.bind(this);
        this.onTeeSelected = this.onTeeSelected.bind(this);
        this.loadMoreData = this.loadMoreData.bind(this);
    }

    renderFriendItem = ({ item, index }) => (
        <CheckHandicapMemberItem
            ref={(refCheckHandicapMemberItem) => { this.refItemList[index] = refCheckHandicapMemberItem }}
            onChangeTeePress={this.onChangeMyTeePress}
            data={item}
            index={index} />
    );

    renderInputHandicap(isShowInvite) {
        if (isShowInvite) {
            return (
                <View>
                    <CheckHandicapView ref={(checkHandicap) => { this.checkHandicap = checkHandicap; }}
                        onChangeTeeAll={this.onChangeTeeAll} />
                    <View style={styles.line} />
                </View>
            )
        } else {
            // return (
            //     <View style={{ justifyContent: 'center', alignItems: 'center', width: screenWidth, backgroundColor: '#fff' }}>
            //         <Text allowFontScaling={global.isScaleFont} style={{ color: '#666666', fontSize: 15, marginTop: 5, marginBottom: 5, marginLeft: 10, marginRight: 10 }}>{this.t('you_added_club').format(this.clubName)}</Text>
            //         <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
            //             <Touchable style={{ minWidth: 80, backgroundColor: '#00ABA7', justifyContent: 'center', alignItems: 'center', borderRadius: 3, marginRight: 5 }}
            //                 onPress={this.onAcceptInviteClick}>
            //                 <Text allowFontScaling={global.isScaleFont} style={{ color: '#FFF', fontSize: 15, paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5 }}>
            //                     {this.t('chap_nhan')}
            //                 </Text>
            //             </Touchable>

            //             <Touchable style={{ minWidth: 80, borderColor: '#B3B3B3', borderWidth: 1, borderRadius: 3, justifyContent: 'center', alignItems: 'center', marginLeft: 5 }}
            //                 onPress={this.onRejectInviteClick}>
            //                 <Text allowFontScaling={global.isScaleFont} style={{ color: '#5E5E5E', fontSize: 15, paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5 }}>
            //                     {this.t('out_of_club')}
            //                 </Text>
            //             </Touchable>
            //         </View>
            //         <View style={{ backgroundColor: '#E3E3E3', width: screenWidth, height: 5, marginTop: 10 }} />

            //     </View>
            // )
            return null;
        }
    }

    render() {
        let { dataMemberLs, isShowInvite } = this.state;

        return (
            <View style={[styles.container, this.isIphoneX? {paddingBottom: 15} : {}]}>
                <HeaderView title={this.t('check_handicap')} handleBackPress={this.onBackPress} />
                <View style={styles.container_content}>
                    {this.renderInputHandicap(isShowInvite)}

                    <FlatList
                        data={dataMemberLs}
                        renderItem={this.renderFriendItem}
                        onScroll={this.onScrollFlatList}
                        ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                        onEndReached={this.loadMoreData}
                        onEndReachedThreshold={0.2}
                        initialNumToRender={5}
                        keyboardShouldPersistTaps='always'
                        scrollEventThrottle={16}
                        keyExtractor={item => item.id}
                    />

                    <ListViewShow ref={(listShow) => { this.listShow = listShow; }} />

                    {/* <MyView style={styles.share_view} hide={!this.isCheckedHandicap}>
                        <Touchable style={styles.touchable_share_logo} onPress={this.onShareClick.bind(this)} >
                            <Image
                                style={styles.img_share_logo}
                                source={this.getResources().share_logo}
                            />
                        </Touchable>
                    </MyView> */}

                    <FloatBtnActionView
                        ref={(refFloatActionView) => { this.refFloatActionView = refFloatActionView; }}
                        icon={this.getResources().share_logo}
                        isShowing={false}
                        onFloatActionPress={this.onShareClick} />

                    <LoadingView ref={(customLoading) => { this.customLoading = customLoading; }}
                        isShowOverlay={false} />

                    {this.renderInternalLoading()}

                </View>

                <PopupYesOrNo
                    ref={(refPopupYesOrNo) => { this.refPopupYesOrNo = refPopupYesOrNo; }}
                    content={''}
                    confirmText={this.t('agree')}
                    cancelText={this.t('cancel')}
                    onConfirmClick={this.onPopupConfirmClick} />

                <PopupSelectTeeView
                    ref={(refPopupSelectTeeView) => { this.refPopupSelectTeeView = refPopupSelectTeeView; }}
                    onTeeSelected={this.onTeeSelected} />

                {this.renderMessageBar()}

            </View>
        );
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();
        // console.log('componentDidMount.check', this.props.navigation.state.params)
        this.registerSearchCourseCallback(this);

        this.requestCheckHandicapAll();
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
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
    }

    registerSearchCourseCallback(self) {
        if (self.checkHandicap) {
            self.checkHandicap.completeCallback = self.onSearchCheckHandicap.bind(self);
            self.checkHandicap.showPopupCallback = self.onCheckListClick.bind(self);
            self.checkHandicap.enableLoadingCallback = self.enableLoadingSearch.bind(self);
            self.listShow.itemClickCallback = self.onSelectedFacility.bind(self);
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
        const currentOffset = event.nativeEvent.contentOffset.y
        const direction = (currentOffset > 0 && currentOffset > this.flatListOffset)
            ? 'down'
            : 'up'
        // If the user is scrolling down (and the action-button is still visible) hide it
        console.log('direction', direction)
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

    loadMoreData() {
        this.page++;
        this.requestCheckHandicapAll();
    }

    requestCheckHandicapAll() {
        let formData = {
            "club_id": this.clubId
        }

        if (this.teeSelected && this.teeSelected.tee) {
            formData.tee = this.teeSelected.tee;
        }

        if (this.courseData) {
            formData.course = this.courseData.getCourse();
        }

        this.formData = formData;
        console.log('formData check cap ', formData);
        let url = this.getConfig().getBaseUrl() + ApiService.club_get_course_handicap(this.clubId, this.page);
        console.log('url', url);
        this.internalLoading.showLoading();
        let self = this;
        Networking.httpRequestPost(url, (jsonData) => {
            console.log('check cap san : ', jsonData);
            this.model = new ClubMemberPayFeeModel(this);
            this.model.parseData(jsonData);
            if (this.model.getErrorCode() === 0) {
                let listMember = this.model.getMemberList();
                if (listMember.length > 0) {
                    this.setState({
                        dataMemberLs: [...this.state.dataMemberLs, ...listMember],
                    }, () => {
                        if (!this.isCheckedHandicap && this.courseData) {
                            this.isCheckedHandicap = true;
                            this.refFloatActionView.setVisible(true);
                        }
                    })
                }
            } else {
                this.showErrorMsg(this.model.getErrorMsg())
            }
            self.internalLoading.hideLoading();
        }, formData, () => {
            if (this.page > 1) this.page--;
            self.internalLoading.hideLoading();
        });
    }

    getListMember() {
        this.customLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.club_list_member(this.clubId, this.page);
        console.log("url ", url);
        let self = this;
        Networking.httpRequestGet(url, this.onResponseData.bind(this), () => {
            //time out
            self.customLoading.hideLoading();
        });
    }

    onResponseData(jsonData) {
        this.model = new FriendModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {

            this.setState({
                dataMemberLs: this.model.getListFriendData()
            })

        }
        this.customLoading.hideLoading();
    }

    onAcceptInviteClick() {
        let url = this.getConfig().getBaseUrl() + ApiService.club_accept_invitation(this.invitation_id);
        let self = this;
        this.customLoading.showLoading();
        Networking.httpRequestGet(url, (jsonData) => {
            self.customLoading.hideLoading();
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    self.setState({
                        isShowInvite: true
                    }, () => {
                        self.registerSearchCourseCallback(self);
                    })
                } else {
                    self.showErrorMsg(jsonData['error_msg']);
                }
            }
        }, () => {
            //time out
            self.customLoading.hideLoading();
            // self.popupTimeOut.showPopup();
        })
    }

    onRejectInviteClick() {
        this.refPopupYesOrNo.setContent(this.t('out_of_club_confirm'));
    }

    onPopupConfirmClick() {
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.club_deni_invite(this.invitation_id);
        this.customLoading.showLoading();
        Networking.httpRequestGet(url, (jsonData) => {
            self.customLoading.hideLoading();
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    self.onBackPress();
                    let { params } = self.props.navigation.state;
                    if (params.callback) {
                        params.callback(this.clubId);
                    }
                } else {
                    self.showErrorMsg(jsonData['error_msg']);
                }
            }
        }, () => {
            //time out
            self.customLoading.hideLoading();
            // self.popupTimeOut.showPopup();
        });
    }

    /**
     * show du lieu khi tim kiem xong
     * @param {*} listData 
     */
    onSearchCheckHandicap(listData) {
        if (this.listShow) {
            this.listShow.hideLoading();
            this.listShow.setFillData(listData);
        }
    }

    /**
    * show popup
    */
    onCheckListClick() {
        this.listShow.switchShow()
    }

    enableLoadingSearch() {
        this.listShow.show();
        this.listShow.showLoading();
        this.listShow.setFillData([]);
    }

    onSelectedFacility(data) {
        this.courseData = data;
        this.teeListAvailable = data.getTeeInfoGender();
        this.checkHandicap.setDataSearch(data, this.teeSelected);
        this.page = 1;
        this.state.dataMemberLs = [];
        Keyboard.dismiss();
        this.requestCheckHandicapAll();

    }

    showLoading() {
        if (this.internalLoading) {
            this.internalLoading.showLoading();
        }
    }

    hideLoading() {
        if (this.internalLoading) {
            this.internalLoading.hideLoading();
        }
    }

    emptyDataShow() {
        if (this.emptyDataView) {
            this.emptyDataView.showEmptyView();
        }
    }

    emptyDataHide() {
        if (this.emptyDataView) {
            this.emptyDataView.hideEmptyView();
        }
    }

    onChangeTeeAll() {
        this.refPopupSelectTeeView.setVisible(this.teeListAvailable, { isCheckAll: true });
    }

    onChangeTeePress(friendModel, index) {
        this.refPopupSelectTeeView.setVisible(this.teeListAvailable, { friendModel, index, isCheckAll: false });
    }

    onTeeSelected(teeObject, extrasData) {
        this.teeSelected = teeObject;

        if (extrasData.isCheckAll) {
            this.checkHandicap.setTeeSelected(teeObject);
            this.page = 1;
            this.state.dataMemberLs = [];
            this.requestCheckHandicapAll();
        } else {
            this.requestCheckHandicapFriend(extrasData);
        }
    }

    requestCheckHandicapFriend({ friendModel, index }) {
        let { dataMemberLs } = this.state;
        let formData = {
            "user_ids": friendModel.id
        }
        if (this.teeSelected && this.teeSelected.tee) {
            formData.tee = this.teeSelected.tee;
        }
        if (this.courseData) {
            formData.course = this.courseData.getCourse();
        }

        let url = this.getConfig().getBaseUrl() + ApiService.check_handicap_facility();
        console.log('url', url);
        this.showLoading();
        let self = this;
        Networking.httpRequestPost(url, (jsonData) => {
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    let data = jsonData['data'];
                    if (data['courses_handicap'].length > 0) {
                        let handicap = data['courses_handicap'][0];
                        console.log('handicap', index, handicap)
                        dataMemberLs[index].course_index = handicap.display_course.value;
                        dataMemberLs[index].displayTee = this.teeSelected;
                        // this.setState({
                        //     dataMemberLs: dataMemberLs
                        // })
                        if (this.refItemList[index])
                            this.refItemList[index].reRender();
                    }
                }
            }
            self.hideLoading();
        }, formData, () => {
            self.hideLoading();
        });
    }

    updateHandicapData(handicap, friendModel, index, isMe) {
        if (isMe) {
            this.state.meData.teeObject = this.teeSelected;
            this.state.meData.facility_handicap = handicap.display_course.value;
            this.setState({
                meData: this.state.meData
            })
        } else {
            this.listDataFriend[index].facility_handicap = handicap.display_course.value;
            this.listDataFriend[index].teeObject = this.teeSelected;
            this.listViewFriend.setFillData(this.listDataFriend, false, this.teeSelected, index);
        }

    }

    onShareClick() {

        let { navigation } = this.props;
        if (navigation) {
            let data = { club_name: this.clubName, facility_name: this.courseData.getTitle() }
            navigation.navigate('club_share_view', {
                data: data,
                list_users: this.state.dataMemberLs,
                page: this.page,
                clubId: this.clubId,
                course: this.courseData,
                teeSelected: this.teeSelected
            });
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container_content: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    separator_view: {
        height: 1,
        backgroundColor: '#E3E3E3'
    },
    line: {
        height: 1,
        backgroundColor: '#E3E3E3',
        marginTop: 10
    },
    share_view: {
        position: 'absolute',
        right: 10,
        bottom: 10,
    },
    img_share_logo: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
    touchable_share_logo: {
        width: 44,
        height: 44,
        backgroundColor: '#00ABA7',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: -3,
        },
        elevation: 4,
    },
    view_section: {
        minHeight: 40
    },
    txt_section: {
        fontWeight: 'bold',
        color: '#000',
        fontSize: 15
    },
    txt_member_section: {
        padding: 10
    }
});