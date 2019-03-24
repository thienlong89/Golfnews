import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    SectionList,
    BackHandler,
    TouchableOpacity
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import LoadingView from '../../Core/Common/LoadingView';
import FriendModel from '../../Model/Friends/FriendsModel';
import MemberTabNavigator from './MemberTabNavigator';
import SearchInputText from '../Common/SearchInputText';
import ClubMemberView from './Items/ClubMemberView';
import ClubMemberModel from '../../Model/CLB/ClubMemberModel';
import MyView from '../../Core/View/MyView';
import PopupRemoteMember from './Items/PopupRemoteMember';
import PopupYesOrNo from '../Common/PopupYesOrNo';
import { scale, fontSize } from '../../Config/RatioScale';

export default class ClubMemberListView extends BaseComponent {

    constructor(props) {
        super(props);
        let { clubName, clubId, logoUrl, totalMember, isAdmin, isGeneralSecretary, isModerator } = this.props.navigation.state.params;
        this.clubName = clubName;
        this.clubId = clubId;
        this.isAdmin = isAdmin;
        this.isGeneralSecretary = isGeneralSecretary;
        this.isModerator = isModerator;
        this.totalMember = totalMember;
        console.log('ClubMemberListView', this.isAdmin, this.isModerator);
        this.page = 1;
        this.pageSearch = 1;
        this.isSearching = false;
        this.playerSelected = '';
        this.sectionSelected = 0;
        this.memberDataList = [];
        this.state = {
            adminList: [],  // chu tich clb
            memberList: [],
            moderatorList: [], // quan tri vien/ban dieu hanh
            generalSecretaryList: [] // tong thu ky
        }

        this.onAddMemberClick = this.onAddMemberClick.bind(this);
        this.onAddModeratorClick = this.onAddModeratorClick.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
        this.onChangeSearchText = this.onChangeSearchText.bind(this);
        this.onLoadMoreMember = this.onLoadMoreMember.bind(this);
        this.onRemoveMemberClick = this.onRemoveMemberClick.bind(this);
        this.onViewProfileClick = this.onViewProfileClick.bind(this);
        this.onSendMessageClick = this.onSendMessageClick.bind(this);
        this.onRemoveAdministrator = this.onRemoveAdministrator.bind(this);
        this.onSetAdministrator = this.onSetAdministrator.bind(this);
        this.onPopupConfirmClick = this.onPopupConfirmClick.bind(this);
        this.onAddSecretaryPress = this.onAddSecretaryPress.bind(this);
        this.onRemoveSecretary = this.onRemoveSecretary.bind(this);
        this.onSetSecretary = this.onSetSecretary.bind(this);
    }

    renderSectionHeader(title) {
        if (title === 0 && !this.isSearching) {
            return (
                <View style={{ backgroundColor: '#fff', paddingTop: 10 }}>
                    <View style={styles.view_section}>
                        {/* <View style={{ backgroundColor: '#DADADA', height: 8 }} /> */}
                        <View style={styles.view_admin}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_section}>
                                {this.t('chu_tich_title')}
                            </Text>
                            {/* <MyView hide={this.isAdmin != 1}>
                            <TouchableOpacity>
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_add_admin}>
                                    {this.t('add_admin')}
                                </Text>
                            </TouchableOpacity>
                        </MyView> */}
                        </View>
                        <View style={styles.line} />

                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_sub_section}>
                            {this.t('president_power')}
                        </Text>


                    </View>
                </View>
            )
        } else if (title === 1 && !this.isSearching) {
            return (
                <View style={{ backgroundColor: '#fff', paddingTop: 10 }}>
                    <View style={styles.view_section}>
                        {/* <View style={{ backgroundColor: '#DADADA', height: 8 }} /> */}
                        <View style={styles.view_admin}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_section}>
                                {this.t('secretary')}
                            </Text>
                            <MyView hide={this.isAdmin != 1}>
                                <TouchableOpacity onPress={this.onAddSecretaryPress}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_add_admin}>
                                        {this.t('add_secretary')}
                                    </Text>
                                </TouchableOpacity>
                            </MyView>
                        </View>
                        <View style={styles.line} />

                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_sub_section}>
                            {this.t('secretary_power')}
                        </Text>


                    </View>
                </View>
            )
        } else if (title === 2 && !this.isSearching) {
            return (
                <View style={{ backgroundColor: '#fff', paddingTop: 10 }}>
                    <View style={styles.view_section}>
                        {/* <View style={{ backgroundColor: '#DADADA', height: 8 }} /> */}
                        <View style={styles.view_admin}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_section}>
                                {this.t('admin')}
                            </Text>
                            <MyView hide={this.isAdmin != 1 && this.isGeneralSecretary != 1}>
                                <TouchableOpacity onPress={this.onAddModeratorClick}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_add_admin}>
                                        {this.t('add_admin')}
                                    </Text>
                                </TouchableOpacity>
                            </MyView>
                        </View>
                        <View style={styles.line} />
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_sub_section}>
                            {this.t('power_admin')}
                        </Text>


                    </View>
                </View>
            )
        }
        return (
            <View style={{ backgroundColor: '#fff', paddingTop: 10 }}>
                <View style={styles.view_section}>
                    {/* <View style={{ backgroundColor: '#DADADA', height: 8 }} /> */}
                    {/* <Text allowFontScaling={global.isScaleFont} style={[styles.txt_section, styles.txt_member_section]}>
                    {this.t('member_title')}
                </Text> */}
                    <View style={styles.view_admin}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_section}>
                            {this.t('member_title')}
                        </Text>
                        <MyView hide={this.isAdmin != 1 && this.isGeneralSecretary != 1 && this.isModerator != 1}>
                            <TouchableOpacity onPress={this.onAddMemberClick}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_add_admin}>
                                    {`+ ${this.t('add_member')}`}
                                </Text>
                            </TouchableOpacity>
                        </MyView>
                    </View>
                    {/* <View style={styles.line} /> */}
                </View>
            </View>
        )
    }

    render() {
        let {
            adminList,
            memberList,
            moderatorList,
            generalSecretaryList } = this.state;

        return (
            <View style={styles.container}>
                <HeaderView
                    title={this.t('member_title')}
                    handleBackPress={this.onBackPress} />

                <View style={styles.border_search}>
                    <SearchInputText
                        autoFocus={false}
                        placeholder={this.t('search_member')}
                        onChangeSearchText={this.onChangeSearchText}
                    />
                </View>

                <View style={{ backgroundColor: '#DADADA', height: 1 }} />
                <View style={{ flex: 1, margin: 10 }}>
                    <SectionList
                        renderItem={({ item, index, section }) =>
                            <TouchableOpacity onLongPress={this.onMemberLongPress.bind(this, section, item)}
                                onPress={this.onViewProfileClick.bind(this, item)}
                                style={
                                    [{
                                        // borderWidth: 1,
                                        borderLeftWidth: 1,
                                        borderRightWidth: 1,
                                        borderTopWidth: 0,
                                        backgroundColor: '#fff'
                                    },
                                    this.generateStyle(item, index, section, adminList, generalSecretaryList, moderatorList, memberList)]
                                }
                            >
                                <ClubMemberView
                                    member={item} />
                            </TouchableOpacity>

                        }
                        renderSectionHeader={({ section: { title } }) => this.renderSectionHeader(title)}
                        ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                        sections={this.isSearching ? [{ title: 2, data: memberList }] : [
                            { title: 0, data: adminList },
                            { title: 1, data: generalSecretaryList },
                            { title: 2, data: moderatorList },
                            { title: 3, data: memberList },
                        ]}
                        // SectionSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={{height: 10, backgroundColor: 'red'}} />}
                        keyExtractor={(item, index) => item + index}
                        onEndReached={this.onLoadMoreMember}
                        onEndReachedThreshold={0.2}
                        stickySectionHeadersEnabled={true}
                    // style={this.isSearching ? {borderColor: '#D6D4D4', borderWidth: 1, borderRadius: 10} : {}}
                    />
                    <LoadingView ref={(customLoading) => { this.customLoading = customLoading; }}
                        isShowOverlay={false} />
                </View>

                {this.renderMessageBar()}
                {/* <MemberTabNavigator
                    screenProps={{...this.props}}
                /> */}

                <PopupRemoteMember
                    ref={(refPopupRemoteMember) => { this.refPopupRemoteMember = refPopupRemoteMember; }}
                    onRemoveMemberClick={this.onRemoveMemberClick}
                    onViewProfileClick={this.onViewProfileClick}
                    onSendMessageClick={this.onSendMessageClick}
                    onRemoveAdministrator={this.onRemoveAdministrator}
                    onSetAdministrator={this.onSetAdministrator}
                    onRemoveSecretary={this.onRemoveSecretary}
                    onSetSecretary={this.onSetSecretary}
                />
                <PopupYesOrNo
                    ref={(refPopupYesOrNo) => { this.refPopupYesOrNo = refPopupYesOrNo; }}
                    content={''}
                    confirmText={this.t('agree')}
                    cancelText={this.t('cancel')}
                    onConfirmClick={this.onPopupConfirmClick} />
            </View>
        );
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();

        this.getListMember();
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

    generateStyle(item, index, section, adminList, generalSecretaryList, moderatorList, memberList) {

        if (!this.isSearching && section.title === 0 && adminList.length - 1 === index ||
            !this.isSearching && section.title === 1 && generalSecretaryList.length - 1 === index ||
            !this.isSearching && section.title === 2 && moderatorList.length - 1 === index ||
            !this.isSearching && section.title === 3 && memberList.length - 1 === index) {
            return {
                borderBottomColor: '#D6D4D4',
                borderBottomWidth: 1,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                borderLeftColor: '#D6D4D4',
                borderRightColor: '#D6D4D4',
                marginBottom: 10,
                paddingBottom: 15,
                backgroundColor: '#fff'
            }
        }
        return {
            borderBottomColor: '#D6D4D4',
            borderBottomWidth: 0,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            borderLeftColor: '#D6D4D4',
            borderRightColor: '#D6D4D4',
        }
    }

    onAddMemberClick() {
        console.log('onIconMenuClick')
        if (this.props.navigation) {
            this.props.navigation.navigate('add_member_listview', {
                clubId: this.clubId
            })
        }
    }

    onAddModeratorClick() {
        if (this.props.navigation) {
            this.props.navigation.navigate('add_admin_club_view', {
                clubId: this.clubId,
                isSecretaryGeneral: false,
                updateCallback: this.onUpdateCallback.bind(this)
            })
        }
    }

    onAddSecretaryPress() {
        if (this.props.navigation) {
            this.props.navigation.navigate('add_admin_club_view', {
                clubId: this.clubId,
                isSecretaryGeneral: true,
                updateCallback: this.onUpdateCallback.bind(this)
            })
        }
    }

    onUpdateCallback() {
        this.page = 1;
        this.getListMember();
    }

    onMemberLongPress(section, player) {
        this.playerSelected = player;
        this.sectionSelected = section;

        console.log('onMemberLongPress', this.isAdmin, this.isGeneralSecretary, this.isModerator, section.title)
        this.refPopupRemoteMember.show(this.isAdmin, this.isGeneralSecretary, this.isModerator, section.title);
    }

    onSetAdministrator() {
        this.refPopupYesOrNo.setContent(this.t('set_admin_confirm').format(`${this.playerSelected.getFullName()} - ${this.playerSelected.getUserId()}`), 0);
    }

    onRemoveMemberClick() {
        this.refPopupYesOrNo.setContent(this.t('remove_member_confirm').format(`${this.playerSelected.getFullName()} - ${this.playerSelected.getUserId()}`), 1);
    }

    onRemoveAdministrator() {
        this.refPopupYesOrNo.setContent(this.t('remove_administrator_confirm').format(`${this.playerSelected.getFullName()} - ${this.playerSelected.getUserId()}`), 2);
    }

    onSetSecretary() {
        this.refPopupYesOrNo.setContent(this.t('set_secretary_confirm').format(`${this.playerSelected.getFullName()} - ${this.playerSelected.getUserId()}`), 3);
    }

    onRemoveSecretary() {
        this.refPopupYesOrNo.setContent(this.t('remove_secretary_confirm').format(`${this.playerSelected.getFullName()} - ${this.playerSelected.getUserId()}`), 4);
    }

    onPopupConfirmClick(type) {
        console.log('onPopupConfirmClick', type)
        switch (type) {
            case 0:
                this.requestSetAdmin(true, this.playerSelected.getId());
                break;
            case 1:
                this.requestRemoveMember();
                break;
            case 2:
                this.requestSetAdmin(false, this.playerSelected.getId());
                break;
            case 3:
                this.requestSetSecretary(true, this.playerSelected.getId());
                break;
            case 4:
                this.requestSetSecretary(false, this.playerSelected.getId());
                break;
            default:
                break;
        }
    }

    requestSetAdmin(isSetAdmin = false, puid) {
        this.customLoading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.club_set_moderator(this.clubId, puid, isSetAdmin ? 1 : 0);
        console.log('club_set_moderator', url)
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('requestSetAdmin: ', jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                if (jsonData.error_code === 0) {
                    // self.removeFromMemberList(true);
                    self.updateAdminList(isSetAdmin);

                } else {
                    self.showErrorMsg(jsonData.error_msg);
                }
            }
            self.customLoading.hideLoading();
        }, () => {
            self.customLoading.hideLoading();
            self.showErrorMsg(self.t('time_out'));
        });
    }

    requestSetSecretary(isSetSecretary = false, puid) {
        this.customLoading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.club_set_secretary(this.clubId, puid, isSetSecretary ? 1 : 0);
        console.log('requestSetSecretary', url)
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('requestSetSecretary: ', jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                if (jsonData.error_code === 0) {
                    self.updateSecretaryList(isSetSecretary);
                } else {
                    self.showErrorMsg(jsonData.error_msg);
                }
            }
            self.customLoading.hideLoading();
        }, () => {
            self.customLoading.hideLoading();
            self.showErrorMsg(self.t('time_out'));
        });
    }

    requestRemoveMember() {
        this.customLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.club_remove_member(this.playerSelected.getId(), this.clubId);
        console.log("url", url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            if (jsonData.hasOwnProperty('error_code')) {
                console.log("requestRemoveMember", jsonData);
                if (jsonData.error_code === 0) {
                    self.removeFromMemberList(false);
                    self.showSuccessMsg(jsonData.error_msg);
                } else {
                    self.showErrorMsg(jsonData.error_msg);
                }
            }
            self.customLoading.hideLoading();
        }, (error) => {
            self.customLoading.hideLoading();
            self.showErrorMsg(self.t('time_out'));
        });
    }

    removeFromMemberList(isSetAdmin = false) {
        let index = this.state.memberList.findIndex((player) => {
            return player.getId() === this.playerSelected.getId();
        });
        if (index != -1) {
            this.state.memberList.splice(index, 1)
        }
        if (isSetAdmin) {
            this.setState({
                adminList: [...this.state.adminList, this.playerSelected],
                memberList: this.state.memberList
            })
        } else {
            this.setState({
                memberList: this.state.memberList
            })
        }

    }

    updateSecretaryList(isSetSecretary = false) {
        let {
            memberList,
            moderatorList,
            generalSecretaryList
        } = this.state;
        if (isSetSecretary) {
            let sectionTitle = this.sectionSelected.title;
            if (sectionTitle === 2) {
                let index = moderatorList.findIndex((player) => {
                    return player.getId() === this.playerSelected.getId();
                });
                if (index != -1) {
                    moderatorList.splice(index, 1);
                }
                this.playerSelected.invented_permission_type = 2;
                this.playerSelected.is_accepted = 0;
                console.log('this.playerSelected', this.playerSelected)
                this.setState({
                    generalSecretaryList: [...generalSecretaryList, this.playerSelected],
                    moderatorList: moderatorList
                })
            } else {
                let index = memberList.findIndex((player) => {
                    return player.getId() === this.playerSelected.getId();
                });
                if (index != -1) {
                    memberList.splice(index, 1);
                }
                this.playerSelected.invented_permission_type = 2;
                this.playerSelected.is_accepted = 0;
                console.log('this.playerSelected', this.playerSelected)
                this.setState({
                    generalSecretaryList: [...generalSecretaryList, this.playerSelected],
                    memberList: memberList
                })
            }

        } else {
            let index = generalSecretaryList.findIndex((player) => {
                return player.getId() === this.playerSelected.getId();
            });
            if (index != -1) {
                generalSecretaryList.splice(index, 1)
            }
            this.setState({
                generalSecretaryList: generalSecretaryList,
                memberList: [...memberList, this.playerSelected]
            })
        }
    }

    updateAdminList(isSetAdmin = false) {
        let {
            memberList,
            moderatorList
        } = this.state;
        if (isSetAdmin) {
            let index = memberList.findIndex((player) => {
                return player.getId() === this.playerSelected.getId();
            });
            if (index != -1) {
                memberList.splice(index, 1);
                
            }
            this.playerSelected.invented_permission_type = 1;
            this.playerSelected.is_accepted = 0;
            this.setState({
                moderatorList: [...moderatorList, this.playerSelected],
                memberList: memberList
            })
        } else {
            let index = moderatorList.findIndex((player) => {
                return player.getId() === this.playerSelected.getId();
            });
            if (index != -1) {
                moderatorList.splice(index, 1)
            }
            this.setState({
                moderatorList: moderatorList,
                memberList: [...memberList, this.playerSelected]
            })
        }

    }

    onViewProfileClick(player) {
        const { navigation } = this.props;
        if (navigation) {
            navigation.navigate('player_info', { "puid": player ? player.getUserId() : this.playerSelected.getUserId() });
        }
    }

    onSendMessageClick() {

    }

    onLoadMoreMember() {
        if (!this.isSearching) {
            this.page++;
            this.getListMember();
        } else {
            this.pageSearch++;
            this.requestSearchPlayer(this.textSearch);
        }

    }

    getListMember() {
        this.customLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.club_list_member_new(this.clubId, this.page);
        console.log("url ", url);
        let self = this;
        Networking.httpRequestGet(url, this.onResponseData.bind(this), () => {
            //time out
            self.customLoading.hideLoading();
            self.showErrorMsg(self.t('time_out'))
        });
    }

    onResponseData(jsonData) {
        this.model = new ClubMemberModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            if (this.model.getAdminList().length > 0) {
                console.log('this.model.getAdminList.length', this.model.getAdminList().length)
                this.setState({
                    adminList: this.model.getAdminList(),
                    moderatorList: this.model.getModeratorList(),
                    generalSecretaryList: this.model.getGeneralSecretaryList(),
                    memberList: [...this.state.memberList, ...this.model.getMemberList()]
                }, () => {
                    this.memberDataList = this.state.memberList;
                })
            } else if (this.model.getMemberList().length > 0) {
                this.setState({
                    memberList: [...this.state.memberList, ...this.model.getMemberList()]
                }, () => {
                    this.memberDataList = this.state.memberList;
                })
            }

        } else {
            // this.page--;
            this.showErrorMsg(this.model.getErrorMsg())
        }
        this.customLoading.hideLoading();
    }

    onChangeSearchText(input) {
        this.pageSearch = 1;
        if (input.length > 0) {
            this.isSearching = true;
            this.requestSearchPlayer(input);
            this.textSearch = input;
        } else {
            this.isSearching = false;
            this.textSearch = '';
            this.setState({
                memberList: this.memberDataList
            })
        }
    }

    requestSearchPlayer(text) {
        let self = this;
        this.customLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.search_member_in_club(this.clubId, text, this.pageSearch);
        console.log("url = ", url);
        Networking.httpRequestGet(url, this.onSearchPlayerResponse.bind(this), () => {
            self.customLoading.hideLoading();
            //self.popupTimeOut.showPopup();
        });
    }

    onSearchPlayerResponse(jsonData) {
        console.log("json data ", jsonData);
        this.model = new ClubMemberModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            // if (this.model.getMemberList().length > 0) {
            this.setState({
                memberList: this.pageSearch === 1 ? this.model.getMemberList() : [...this.state.memberList, ...this.model.getMemberList()]
            })
            // } else {
            //     this.setState({
            //         memberList: []
            //     })
            // }
        } else {
            this.pageSearch--;
            this.showErrorMsg(this.model.getErrorMsg());
        }
        self.customLoading.hideLoading();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    icon_menu_style: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
    separator_view: {
        height: 0,
        backgroundColor: '#fff',
        // marginLeft: scale(10),
        // marginRight: scale(10)
    },
    view_section: {
        minHeight: scale(40),
        backgroundColor: '#fff',
        borderWidth: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderColor: '#D6D4D4',
    },
    txt_section: {
        fontWeight: 'bold',
        color: '#000',
        fontSize: fontSize(15)
    },
    view_admin: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: scale(10),
        paddingRight: scale(10),
        paddingTop: scale(10),
        paddingBottom: scale(10),
    },
    txt_add_admin: {
        color: '#00ABA7',
        fontSize: fontSize(15)
    },
    txt_sub_section: {
        color: '#999999',
        fontSize: fontSize(13),
        paddingLeft: scale(10),
        paddingRight: scale(10),
        marginBottom: scale(8),
        marginTop: scale(8)
    },
    txt_member_section: {
        padding: scale(10)
    },
    border_search: {
        borderWidth: 1,
        borderRadius: scale(8),
        borderColor: '#A1A1A1',
        margin: scale(10)
    },
    line: {
        backgroundColor: '#D6D4D4',
        height: 1,
        flex: 1
    }
});