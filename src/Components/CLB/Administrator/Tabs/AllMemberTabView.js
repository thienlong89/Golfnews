import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SectionList,
    Image,
    ScrollView
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../../Core/View/BaseComponent';
import Networking from '../../../../Networking/Networking';
import ApiService from '../../../../Networking/ApiService';
import { scale, verticalScale, moderateScale, fontSize } from '../../../../Config/RatioScale';
import ClubMemberItem from '../../Items/ClubMemberItem';
import ClubMemberModel from '../../../../Model/CLB/ClubMemberModel';
import MyView from '../../../../Core/View/MyView';
import PopupRemoteMemberModal from './../../Items/PopupRemoteMemberModal';
import PopupConfirm from '../../../Common/PopupConfirm';
import AdminMemberView from '../../Items/AdminMemberView';

export default class AllMemberTabView extends BaseComponent {

    constructor(props) {
        super(props);
        // console.log('AllMemberTabView', this.props);
        let { clubName, clubId, logoUrl, totalMember, isAdmin, isGeneralSecretary, isModerator } = this.props.screenProps.navigation.state.params;
        this.clubName = clubName;
        this.clubId = clubId;
        this.isAdmin = isAdmin;
        this.isGeneralSecretary = isGeneralSecretary;
        this.isModerator = isModerator;
        this.totalMember = totalMember;

        this.page = 1;
        this.isSearching = false;
        this.playerSelected = '';
        this.sectionSelected = 0;
        this.state = {
            adminList: [],  // chu tich clb
            memberList: [],
            moderatorList: [], // quan tri vien/ban dieu hanh
            generalSecretaryList: [], // tong thu ky
            birthdayMemberList: [] // thanh vien sinh nhat trong thang
        }

        this.onAddMemberClick = this.onAddMemberClick.bind(this);
        this.onAddModeratorClick = this.onAddModeratorClick.bind(this);
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
        this.jumpToBirthday = this.jumpToBirthday.bind(this);
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

                <TouchableOpacity style={styles.touchable_add_member}
                    onPress={this.onAddMemberClick}>
                    <View style={styles.view_add_member}>
                        <Image
                            style={styles.img_add_member}
                            source={this.getResources().ic_add_member} />
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_add_member}>{this.t('add_member')}</Text>
                    </View>
                </TouchableOpacity>

                <ScrollView>
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
                                <ClubMemberItem
                                    member={item} />
                            </TouchableOpacity>

                        }
                        renderSectionHeader={({ section: { title } }) => this.renderSectionHeader(title)}
                        ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                        sections={[
                            { title: 0, data: adminList },
                            { title: 1, data: generalSecretaryList },
                            { title: 2, data: moderatorList },
                            // { title: 3, data: memberList }
                        ]}
                        // SectionSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={{height: 10, backgroundColor: 'red'}} />}
                        keyExtractor={(item, index) => item + index}
                        // onEndReached={this.onLoadMoreMember}
                        // onEndReachedThreshold={0.2}
                        stickySectionHeadersEnabled={true}
                        style={{ margin: 10, backgroundColor: '#fff' }}
                    />
                    <AdminMemberView
                        ref={(refMemberList) => { this.refMemberList = refMemberList }}
                        listType={0}
                        clubId={this.clubId}
                        screenProps={this.props.screenProps} />
                    {/* <AdminMemberView
                        ref={(refBirthdayMemberList) => { this.refBirthdayMemberList = refBirthdayMemberList }}
                        listType={1}
                        clubId={this.clubId}
                        screenProps={this.props.screenProps}
                        jumpToBirthday={this.jumpToBirthday} /> */}

                </ScrollView>

                <PopupRemoteMemberModal
                    ref={(refPopupRemoteMember) => { this.refPopupRemoteMember = refPopupRemoteMember; }}
                    onRemoveMemberClick={this.onRemoveMemberClick}
                    onViewProfileClick={this.onViewProfileClick}
                    onSendMessageClick={this.onSendMessageClick}
                    onRemoveAdministrator={this.onRemoveAdministrator}
                    onSetAdministrator={this.onSetAdministrator}
                    onRemoveSecretary={this.onRemoveSecretary}
                    onSetSecretary={this.onSetSecretary}
                />
                <PopupConfirm
                    ref={(refPopupYesOrNo) => { this.refPopupYesOrNo = refPopupYesOrNo; }}
                    content={''}
                    confirmText={this.t('agree')}
                    cancelText={this.t('cancel')}
                    onConfirmClick={this.onPopupConfirmClick} />
                {this.renderMessageBar()}
                {this.renderInternalLoading()}
            </View>
        );
    }


    componentDidMount() {
        this.registerMessageBar();

        this.getListMember();
    }

    componentWillUnmount() {
        this.unregisterMessageBar();

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
        let { screenProps } = this.props;
        if (screenProps) {
            screenProps.navigation.navigate('add_member_listview', {
                clubId: this.clubId
            })
        }
    }

    onAddModeratorClick() {
        let { screenProps } = this.props;
        if (screenProps) {
            screenProps.navigation.navigate('add_admin_club_view', {
                clubId: this.clubId,
                isSecretaryGeneral: false,
                updateCallback: this.onUpdateCallback.bind(this)
            })
        }
    }

    onAddSecretaryPress() {
        let { screenProps } = this.props;
        if (screenProps) {
            screenProps.navigation.navigate('add_admin_club_view', {
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
        this.refPopupYesOrNo.setContentAndShow(this.t('set_admin_confirm').format(`${this.playerSelected.getFullName()} - ${this.playerSelected.getUserId()}`), 0);
    }

    onRemoveMemberClick() {
        this.refPopupYesOrNo.setContentAndShow(this.t('remove_member_confirm').format(`${this.playerSelected.getFullName()} - ${this.playerSelected.getUserId()}`), 1);
    }

    onRemoveAdministrator() {
        this.refPopupYesOrNo.setContentAndShow(this.t('remove_administrator_confirm').format(`${this.playerSelected.getFullName()} - ${this.playerSelected.getUserId()}`), 2);
    }

    onSetSecretary() {
        this.refPopupYesOrNo.setContentAndShow(this.t('set_secretary_confirm').format(`${this.playerSelected.getFullName()} - ${this.playerSelected.getUserId()}`), 3);
    }

    onRemoveSecretary() {
        this.refPopupYesOrNo.setContentAndShow(this.t('remove_secretary_confirm').format(`${this.playerSelected.getFullName()} - ${this.playerSelected.getUserId()}`), 4);
    }

    jumpToBirthday() {
        if (this.props.jumpToBirthday) {
            this.props.jumpToBirthday();
        }
    }

    onPopupConfirmClick(type) {
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
        if (this.internalLoading)
            this.internalLoading.showLoading();
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
            if (self.internalLoading)
                self.internalLoading.hideLoading();
        }, () => {
            if (self.internalLoading)
                self.internalLoading.hideLoading();
            self.showErrorMsg(self.t('time_out'));
        });
    }

    requestSetSecretary(isSetSecretary = false, puid) {
        if (this.internalLoading)
            this.internalLoading.showLoading();
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
            if (self.internalLoading)
                self.internalLoading.hideLoading();
        }, () => {
            if (self.internalLoading)
                self.internalLoading.hideLoading();
            self.showErrorMsg(self.t('time_out'));
        });
    }

    requestRemoveMember() {
        if (this.internalLoading)
            this.internalLoading.showLoading();
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
            if (self.internalLoading)
                self.internalLoading.hideLoading();
        }, (error) => {
            if (self.internalLoading)
                self.internalLoading.hideLoading();
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
                    moderatorList.splice(index, 1)
                }
                this.playerSelected.invented_permission_type = 2;
                this.playerSelected.is_accepted = 0;
                this.setState({
                    generalSecretaryList: [...generalSecretaryList, this.playerSelected],
                    moderatorList: moderatorList
                })
            } else {
                let index = memberList.findIndex((player) => {
                    return player.getId() === this.playerSelected.getId();
                });
                if (index != -1) {
                    memberList.splice(index, 1)
                }
                this.playerSelected.invented_permission_type = 2;
                this.playerSelected.is_accepted = 0;
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
                memberList.splice(index, 1)
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
        let { screenProps } = this.props;
        if (screenProps) {
            screenProps.navigation.navigate('member_profile_navigator',
                {
                    player: player? player: this.playerSelected
                })
        }
    }

    onSendMessageClick() {

    }

    onLoadMoreMember() {
        this.page++;
        this.getListMember();
    }

    getListMember() {
        this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.admin_club_list_member(this.clubId, this.page);
        console.log("url ", url);
        let self = this;
        Networking.httpRequestGet(url, this.onResponseData.bind(this), () => {
            //time out
            self.internalLoading.hideLoading();
            self.showErrorMsg(self.t('time_out'))
        });
    }

    onResponseData(jsonData) {
        this.model = new ClubMemberModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            let memberList = this.model.getMemberList();
            let birthdayList = this.model.getBirthdayMemberList();
            if (this.model.getAdminList().length > 0) {
                this.setState({
                    adminList: this.model.getAdminList(),
                    moderatorList: this.model.getModeratorList(),
                    generalSecretaryList: this.model.getGeneralSecretaryList(),
                    memberList: [...this.state.memberList, ...memberList],
                    birthdayMemberList: birthdayList
                }, () => {
                    this.memberDataList = this.state.memberList;
                    // this.refBirthdayMemberList.setPlayerData(birthdayList);
                    this.refMemberList.setPlayerData(memberList);
                })
            } else if (memberList.length > 0) {
                this.setState({
                    memberList: [...this.state.memberList, ...memberList],
                    birthdayMemberList: this.model.getBirthdayMemberList()
                }, () => {
                    // this.refBirthdayMemberList.setPlayerData(birthdayList);
                    this.refMemberList.setPlayerData(memberList);
                })
            }

        } else {
            // this.page--;
            this.showErrorMsg(this.model.getErrorMsg())
        }
        this.internalLoading.hideLoading();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    separator_view: {
        height: 1,
        backgroundColor: '#DADADA',
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
    },
    touchable_add_member: {
        backgroundColor: '#00ABA7',
        borderRadius: scale(5),
        justifyContent: 'center',
        marginTop: scale(10),
        marginLeft: scale(10),
        marginRight: scale(10),
        marginBottom: scale(10),
        paddingTop: scale(10),
        paddingBottom: scale(10)
    },
    view_add_member: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    img_add_member: {
        width: scale(25),
        height: scale(25),
        resizeMode: 'contain',
        marginLeft: scale(15),
        marginRight: scale(15)
    },
    txt_add_member: {
        fontSize: fontSize(16),
        color: '#fff',
    }
});