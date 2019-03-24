import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    SectionList,
    TouchableOpacity
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import GroupMemberModel from '../../../Model/Group/GroupMemberModel';
import ClubMemberItem from '../../CLB/Items/ClubMemberItem';
import { verticalScale, fontSize, scale } from '../../../Config/RatioScale';
import PropsStatic from '../../../Constant/PropsStatic';

export default class GroupMemberListView extends BaseComponent {

    static defaultProps = {
        groupId: '',
        isAdmin: false
    }

    constructor(props) {
        super(props);
        this.page = 1;
        this.onAddMember = this.onAddMember.bind(this);
        this.onLoadMoreMember = this.onLoadMoreMember.bind(this);
        this.onAddAdminPress = this.onAddAdminPress.bind(this);
        this.loadEnd = false;
        this.state = {
            adminList: [],
            memberList: []
        }

        this.onScroll = this.onScroll.bind(this);
    }

    renderAddMember() {
        let { isAdmin } = this.props;
        if (isAdmin) {
            return (
                <TouchableOpacity onPress={this.onAddMember}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_add_member}>
                        {`+ ${this.t('add_member')}`}
                    </Text>
                </TouchableOpacity>
            )
        } else {
            return null;
        }
    }

    renderAddAdmin() {
        let { isAdmin } = this.props;
        if (isAdmin) {
            return (
                <TouchableOpacity onPress={this.onAddAdminPress}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_add_member}>
                        {`+ ${this.t('add_team_owner')}`}
                    </Text>
                </TouchableOpacity>
            )
        } else {
            return null;
        }
    }

    renderSectionHeader(title) {
        if (title === 0) {
            return (
                <View style={{ backgroundColor: '#fff', paddingTop: 10 }}>
                    <View style={styles.view_section}>
                        <View style={styles.view_member}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_section}>
                                {this.t('team_owner')}
                            </Text>
                            {this.renderAddAdmin()}
                        </View>


                        <View style={{ backgroundColor: '#D6D4D4', height: 1, flex: 1 }} />
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_sub_section}>
                            {this.t('team_owner_power')}
                        </Text>
                    </View>
                </View>
            )
        }
        return (
            <View style={{ backgroundColor: '#fff', paddingTop: 10 }}>
                <View style={styles.view_section}>
                    {/* <View style={{ backgroundColor: '#DADADA', height: 8 }} /> */}
                    <View style={styles.view_member}>
                        <Text allowFontScaling={global.isScaleFont} style={[styles.txt_section]}>
                            {this.t('member_title')}
                        </Text>
                        {this.renderAddMember()}
                    </View>

                    <View style={{ backgroundColor: '#D6D4D4', height: 1, flex: 1 }} />
                </View>
            </View>
        )
    }

    render() {

        let { adminList, memberList } = this.state;

        return (
            <View style={styles.container}>
                <SectionList
                    renderItem={({ item, index, section }) =>
                        <TouchableOpacity onLongPress={this.onMemberLongPress.bind(this, section, item)}
                            onPress={this.onMemberPress.bind(this, section, item)}
                            style={
                                [{
                                    // borderWidth: 1,
                                    borderLeftWidth: 1,
                                    borderRightWidth: 1,
                                    borderTopWidth: 0,
                                    backgroundColor: '#D6D4D4'
                                },
                                this.generateStyle(item, index, section)]
                            }>
                            <ClubMemberItem
                                member={item} />
                        </TouchableOpacity>
                    }
                    renderSectionHeader={({ section: { title } }) => this.renderSectionHeader(title)}
                    ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                    sections={[
                        { title: 0, data: adminList },
                        { title: 1, data: memberList },
                    ]}
                    keyExtractor={(item, index) => item + index}
                    onEndReached={this.onLoadMoreMember}
                    onEndReachedThreshold={0.1}
                    // stickySectionHeadersEnabled={true}
                    style={{ margin: 10, backgroundColor: '#fff' }}
                    onScroll={this.onScroll}
                    scrollEventThrottle={16}
                />

                {this.renderMessageBar()}
                {this.renderInternalLoading()}
            </View>
        );
    }


    componentDidMount() {
        this.registerMessageBar();

        this.requestGetListMember();
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
    }

    onScroll(event) {
        if (this.props.onScroll) {
            this.props.onScroll(event);
        }
    }

    refresh() {
        this.state.memberList = [];
        this.state.adminList = [];
        this.page = 1;
        this.loadEnd = false;
        this.requestGetListMember();
    }

    onLoadMoreMember() {
        if (!this.loadEnd) {
            this.page++;
            this.requestGetListMember();
        }

    }

    requestGetListMember() {
        this.internalLoading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.group_member_list_new(this.props.groupId, this.page);
        console.log('url', url);
        Networking.httpRequestGet(url, (jsonData) => {
            self.model = new GroupMemberModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                // if (self.model.getMemberList().length > 0 || this.model.getAdminList().length > 0) {
                self.setState({
                    adminList: [...self.state.adminList, ...self.model.getAdminList()],
                    memberList: [...self.state.memberList, ...self.model.getMemberList()]
                }, () => {
                    if (self.model.getMemberList().length === 0) {
                        self.loadEnd = true;
                    }
                })
                // }

            } else {
                self.showErrorMsg(self.model.getErrorMsg())
            }
            self.internalLoading.hideLoading();

        }, (error) => {
            self.internalLoading.hideLoading();
            self.showErrorMsg(self.t('time_out'))
        });
    }

    onMemberLongPress(section, player) {
        if (this.props.onPlayerLongPress) {
            this.props.onPlayerLongPress(section, player);
        }
    }

    onMemberPress(section, player) {
        let userId = player.getUserId() || '';
        let navigation = PropsStatic.getAppSceneNavigator();
        if (navigation) {
            navigation.navigate('player_info', { "puid": userId });
        }
    }

    setAdministrator(playerSelected) {
        this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.add_permission_group(this.props.groupId);
        console.log('url', url);
        let fromData = {
            "user_ids": [playerSelected.getId()]
        }
        console.log('onRequestInvites.fromData', fromData);
        Networking.httpRequestPost(url, (jsonData) => {
            this.internalLoading.hideLoading();
            if (jsonData.error_code === 0) {
                this.removeFromMemberList(playerSelected, true);
            } else {
                this.showErrorMsg(jsonData.error_msg);
            }
        }, fromData, () => {
            //time out
            this.internalLoading.hideLoading();
        });
    }

    removeMember(player) {
        let formData = {
            "user_ids": [player.getId()]
        }
        console.log('formData', formData)
        this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.group_remove_member(this.props.groupId);
        console.log('url', url)
        let self = this;
        Networking.httpRequestPost(url, (jsonData) => {
            console.log('removeMember: ', jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                if (jsonData.error_code === 0) {
                    self.removeFromMemberList(player, false);
                }
            }
            self.internalLoading.hideLoading();
        }, formData, () => {
            self.internalLoading.hideLoading();
        });
    }

    removeFromMemberList(playerSelected = {}, isSetAdmin = false) {
        let index = this.state.memberList.findIndex((player) => {
            return player.getId() === playerSelected.getId();
        });
        if (index != -1) {
            this.state.memberList.splice(index, 1)
        }
        if (isSetAdmin) {
            this.setState({
                adminList: [...this.state.adminList, playerSelected],
                memberList: this.state.memberList
            })
        } else {
            this.setState({
                memberList: this.state.memberList
            })
        }

    }

    onAddAdminPress() {
        if (this.props.onAddAdminPress) {
            this.props.onAddAdminPress();
        }
    }

    onAddMember() {
        if (this.props.onAddMember) {
            this.props.onAddMember();
        }
    }

    generateStyle(item, index, section) {
        console.log('generateStyle.index', index)
        if (section.title === 0 && this.state.adminList.length - 1 === index ||
            section.title === 1 && this.state.memberList.length - 1 === index) {
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
        } else return {
            borderBottomColor: '#D6D4D4',
            borderBottomWidth: 0,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            borderLeftColor: '#D6D4D4',
            borderRightColor: '#D6D4D4',
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    view_section: {
        minHeight: verticalScale(40),
        backgroundColor: '#fff',
        borderWidth: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderColor: '#D6D4D4',
    },
    txt_section: {
        fontWeight: 'bold',
        color: '#000',
        fontSize: fontSize(15, scale(1)),
        padding: verticalScale(10),
        flex: 1
    },
    view_admin: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: scale(10),
        paddingRight: scale(10),
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(5),
    },
    txt_add_admin: {
        color: '#00ABA7',
        fontSize: fontSize(15, scale(1))
    },
    txt_member_section: {
        padding: verticalScale(10)
    },
    separator_view: {
        backgroundColor: '#D6D4D4',
        height: 1,
        marginLeft: scale(10),
        marginRight: scale(10)
    },
    view_member: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    txt_add_member: {
        color: '#00ABA7',
        fontSize: fontSize(15, scale(1)),
        marginRight: scale(10),
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5)
    },
    txt_sub_section: {
        color: '#999999',
        fontSize: fontSize(13),
        paddingLeft: scale(10),
        paddingRight: scale(10),
        marginBottom: scale(8),
        marginTop: scale(8)
    },
});