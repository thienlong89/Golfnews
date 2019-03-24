import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    SectionList
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../../Core/View/BaseComponent';
import MyView from '../../../../Core/View/MyView';
import Networking from '../../../../Networking/Networking';
import ApiService from '../../../../Networking/ApiService';
import { scale, verticalScale, moderateScale, fontSize } from '../../../../Config/RatioScale';
import CheckHandicapView from '../../../Common/CheckHandicapView';
import AdminMemberItem from '../../Items/AdminMemberItem';
import ClubMemberModel from '../../../../Model/CLB/ClubMemberModel';
import ClubBirthdayModel from '../../../../Model/CLB/ClubBirthdayModel';
import ListViewShow from '../../../Common/ListViewShow';

export default class BirthdayTabView extends BaseComponent {

    constructor(props) {
        super(props);
        let { clubName, clubId } = this.props.screenProps.navigation.state.params;
        this.clubName = clubName;
        this.clubId = clubId;
        this.page = 1;
        this.currentMonth = (new Date()).getMonth() + 1;
        this.month = this.currentMonth

        this.state = {
            listMember: []
        }

        this.loadMoreData = this.loadMoreData.bind(this);
        this.onMemberPress = this.onMemberPress.bind(this);
    }

    renderCategory(length) {
        if (length === 0) {
            return (
                <View style={styles.view_empty}>
                    <View style={styles.line} />
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_empty}>{this.t('no_birthday_member')}</Text>
                </View>
            )
        }
        return (
            <View style={styles.view_header_list}>
                <View style={styles.view_stt}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_list}>{this.t('stt')}</Text>
                </View>
                <View style={styles.view_line} />
                <View style={styles.view_player_name}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_list}>{this.t('member_name_title')}</Text>
                </View>
                <View style={styles.view_line} />
                <View style={styles.view_birthday}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_list}>{this.t('birthday')}</Text>
                </View>
                <View style={styles.view_line} />
                <View style={styles.view_hdc}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_list}>{this.t('hdc_index')}</Text>
                </View>
            </View>
        )
    }

    renderSectionHeader(title, data) {
        return (
            <View style={{ backgroundColor: '#fff', paddingTop: 10 }}>
                <View style={styles.view_title}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{title === 0 ? this.t('member_birthday_list') : this.t('birthday_in_month').format(title)}</Text>
                </View>
                {this.renderCategory(data.length)}
            </View>
        )
    }

    render() {
        let {
            listMember
        } = this.state;
        return (
            <View style={styles.container}>

                <View style={styles.view_member_list}>
                    <SectionList
                        renderItem={({ item, index, section }) =>
                            <View
                                style={[
                                    {
                                        // borderWidth: 1,
                                        borderLeftWidth: 1,
                                        borderRightWidth: 1,
                                        borderTopWidth: 0,
                                        backgroundColor: '#fff'
                                    },
                                    this.generateStyle(item, index, section, listMember)
                                ]}>
                                <AdminMemberItem
                                    player={item}
                                    index={index + 1}
                                    onItemPress={this.onMemberPress} />
                            </View>

                        }
                        renderSectionHeader={({ section: { title, data } }) => this.renderSectionHeader(title, data)}
                        ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
                        sections={listMember}
                        keyExtractor={(item, index) => item + index}
                        onEndReached={this.loadMoreData}
                        onEndReachedThreshold={0.2}
                        stickySectionHeadersEnabled={true}
                    />
                    {this.renderInternalLoading()}
                </View>
                {this.renderMessageBar()}
            </View>
        );
    }


    componentDidMount() {
        this.registerMessageBar();
        if (this.month === 1) {
            this.month = 12;
        } else {
            this.month--;
        }
        this.getBirthdayNextMonth(true);
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
    }

    generateStyle(item, index, section, listMember) {
        if (section.data.length - 1 === index) {
            return {
                borderBottomColor: '#D6D4D4',
                borderBottomWidth: 1,
                borderBottomLeftRadius: scale(10),
                borderBottomRightRadius: scale(10),
                borderLeftColor: '#D6D4D4',
                borderRightColor: '#D6D4D4',
                // marginBottom: 10,
                // paddingBottom: 15,
                // backgroundColor: '#fff'
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

    loadMoreData() {
        this.month += 2;
        if (this.month === 13) {
            this.month = 1;
        } else if (this.month === 14) {
            this.month = 2;
        }
        if (this.state.listMember.length < 12) {
            console.log('loadMoreData', this.month, this.currentMonth);
            this.getBirthdayNextMonth();
        }
    }

    getListMember() {
        this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.club_list_member_birthday_next_by_month(this.clubId, this.month);
        console.log("url ", url);
        let self = this;
        Networking.httpRequestGet(url, this.onResponseData.bind(this), () => {
            //time out
            self.page--;
            self.internalLoading.hideLoading();
            self.showErrorMsg(self.t('time_out'))
        });
    }

    onResponseData(jsonData) {
        this.model = new ClubMemberModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            let listMember = this.model.getMemberList();
            if (listMember.length > 0) {
                this.setState({
                    listMember: [...this.state.listMember, ...listMember],
                }, () => {

                })
            }

        } else {
            // this.page--;
            this.showErrorMsg(this.model.getErrorMsg())
        }
        this.internalLoading.hideLoading();
    }

    getBirthdayNextMonth(isCurrentMonth = false) {
        let {
            listMember
        } = this.state;
        this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.club_list_member_birthday_next_by_month(this.clubId, this.month);
        console.log("url ", url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.internalLoading.hideLoading();
            self.model = new ClubBirthdayModel(self);
            self.model.parseData(jsonData, isCurrentMonth);
            if (self.model.getErrorCode() === 0) {
                let month = this.month;
                let month1 = self.model.getMonth1();
                let month2 = self.model.getMonth2();
                console.log('getBirthdayNextMonth', month1.length, month2.length);
                let birthdayList = [];
                if (isCurrentMonth) {
                    birthdayList.push({ title: 0, data: month1 });
                    month += 2;
                    if (month === 13) {
                        month = 1;
                    }
                    birthdayList.push({ title: month, data: month2 });
                } else {
                    month++;
                    if (month === 13) {
                        month = 1;
                    }
                    birthdayList.push({ title: month, data: month1 });
                    month++;
                    if (month === 13) {
                        month = 1;
                    }
                    birthdayList.push({ title: month, data: month2 });
                }

                self.setState({
                    listMember: [...listMember, ...birthdayList]
                })

            } else {
                // this.page--;
                self.showErrorMsg(self.model.getErrorMsg())
            }

        }, () => {
            //time out
            self.internalLoading.hideLoading();
            if (self.month === 1) {
                self.month = 11;
            } else if (self.month === 2) {
                self.month = 12;
            }
            self.showErrorMsg(self.t('time_out'))
        });
    }

    onMemberPress(player) {
        let { screenProps } = this.props;
        if (screenProps) {
            screenProps.navigation.navigate('member_profile_navigator',
                {
                    player: player
                })
        }
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    view_member_list: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderColor: '#D6D4D4',
        // borderWidth: 1,
        // borderRadius: scale(10),
        margin: scale(10),
    },
    flatlist: {
        borderColor: '#D6D4D4',
        borderBottomLeftRadius: scale(10),
        borderBottomRightRadius: scale(10),
        borderLeftWidth: 1,
        borderTopWidth: 0,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        flexGrow: 0
    },
    view_title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: scale(10),
        borderColor: '#D6D4D4',
        borderTopLeftRadius: scale(10),
        borderTopRightRadius: scale(10),
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 0,
    },
    txt_title: {
        fontSize: fontSize(17),
        color: '#252525',
        fontWeight: 'bold'
    },
    txt_more: {
        color: '#00ABA7',
        fontSize: fontSize(15)
    },
    txt_description: {
        color: '#999999',
        fontSize: fontSize(15),
        marginLeft: scale(10),
        marginRight: scale(10),
        marginBottom: scale(10)
    },
    view_description: {
        marginLeft: scale(10),
        marginRight: scale(10),
        marginBottom: scale(10)
    },
    view_header_list: {
        flexDirection: 'row',
        backgroundColor: '#E8E8E8',
        minHeight: scale(35),
        borderColor: '#D6D4D4',
        borderLeftWidth: 1,
        borderTopWidth: 0,
        borderRightWidth: 1,
        borderBottomWidth: 0,
    },
    view_stt: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_player_name: {
        flex: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_birthday: {
        flex: 2.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_hdc: {
        flex: 2.1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt_title_list: {
        color: '#707070',
        fontWeight: 'bold',
        fontSize: fontSize(15),
        textAlign: 'center'
    },
    view_line: {
        backgroundColor: '#D4D4D4',
        width: 1
    },
    line: {
        backgroundColor: '#D4D4D4',
        height: 1
    },
    listview_separator: {
        height: 1,
        backgroundColor: '#DADADA',
    },
    txt_empty: {
        textAlign: 'center',
        marginTop: scale(10),
        marginBottom: scale(10),
        fontSize: fontSize(15),
        color: '#9F9F9F'
    },
    view_empty: {
        borderColor: '#D6D4D4',
        borderLeftWidth: 1,
        borderTopWidth: 0,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderBottomLeftRadius: scale(10),
        borderBottomRightRadius: scale(10)
    }
});