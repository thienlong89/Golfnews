import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    FlatList
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../../Core/View/BaseComponent';
import Networking from '../../../../Networking/Networking';
import ApiService from '../../../../Networking/ApiService';
import { scale, verticalScale, moderateScale, fontSize } from '../../../../Config/RatioScale';
import AdminMemberFeeItem from '../../Items/AdminMemberFeeItem';
import ClubMemberPayFeeModel from '../../../../Model/CLB/ClubMemberPayFeeModel';
import PopupSelectDate from '../../../Common/PopupSelectDate';
import moment from 'moment';

const TIME_FORMAT = 'DD/MM/YYYY';

export default class FeeClubTabView extends BaseComponent {

    constructor(props) {
        super(props);
        let { clubName, clubId } = this.props.screenProps.navigation.state.params;
        this.clubName = clubName;
        this.clubId = clubId;
        this.page = 1;
        this.refItemList = [];
        this.state = {
            listMember: []
        }

        this.loadMoreData = this.loadMoreData.bind(this);
        this.onMemberPress = this.onMemberPress.bind(this);
        this.onEditExpertDate = this.onEditExpertDate.bind(this);
        this.onConfirmClick = this.onConfirmClick.bind(this);
    }

    render() {
        let {
            listMember
        } = this.state;
        return (
            <View style={styles.container}>

                <View style={styles.view_member_list}>
                    {/* <View style={styles.view_title}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('member_birthday_list')}</Text>
                    </View> */}
                    <View style={styles.listview_separator} />
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
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_list}>{this.t('pay_fee')}</Text>
                        </View>
                        <View style={styles.view_line} />
                        <View style={styles.view_hdc}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_list}>{this.t('expiration_date')}</Text>
                        </View>
                    </View>

                    <FlatList
                        ref={(refFlatList) => { this.refFlatList = refFlatList; }}
                        onEndReached={this.loadMoreData}
                        onEndReachedThreshold={0.2}
                        initialNumToRender={5}
                        ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
                        data={listMember}
                        keyboardShouldPersistTaps='always'
                        scrollEventThrottle={16}
                        keyExtractor={item => item.id}
                        renderItem={({ item, index }) =>
                            <AdminMemberFeeItem
                                ref={(refAdminMemberFeeItem) => { this.refItemList[index] = refAdminMemberFeeItem }}
                                playerItem={item}
                                index={index + 1}
                                onItemPress={this.onMemberPress}
                                onEditExpertDate={this.onEditExpertDate} />
                        }
                        style={styles.flatlist}
                    />
                    <PopupSelectDate
                        ref={(refPopupSelectDate) => { this.refPopupSelectDate = refPopupSelectDate }}
                        onConfirmClick={this.onConfirmClick} />
                    {this.renderInternalLoading()}
                </View>
                {this.renderMessageBar()}
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

    loadMoreData() {
        this.page++;
        this.getListMember();
    }

    getListMember() {
        this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.list_member_club_by_expried_date(this.clubId, 4, this.page);
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
        this.model = new ClubMemberPayFeeModel(this);
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

    onMemberPress(player) {
        let { screenProps } = this.props;
        if (screenProps) {
            screenProps.navigation.navigate('member_profile_navigator',
                {
                    player: player
                })
        }
    }

    onEditExpertDate(playerItem, index) {
        this.refPopupSelectDate.setContentAndShow({ playerItem, index });
    }

    onConfirmClick(date, { playerItem, index }) {
        console.log('onConfirmClick', date, playerItem, index)
        this.requestEditExpertTime(date, playerItem, index);
    }

    requestEditExpertTime(date, playerItem, index) {
        let {
            listMember
        } = this.state;
        let time = moment(date, TIME_FORMAT);
        if (time) {
            let timestamp = (new Date(time)).getTime();
            let formData = '';
            try {
                formData = {
                    "club_id": this.clubId,
                    "puid": playerItem.Users._id,
                    "time_expried": timestamp
                }
            } catch (error) {

            }

            this.formData = formData;
            console.log('formData check cap ', formData);
            let url = this.getConfig().getBaseUrl() + ApiService.club_update_expried_time();
            console.log('url', url);
            this.internalLoading.showLoading();
            let self = this;
            Networking.httpRequestPost(url, (jsonData) => {
                console.log('requestEditExpertTime: ', jsonData);
                if (jsonData.error_code === 0 && listMember.length > index - 1) {
                    listMember[index - 1].date_expried_display = date;
                    listMember[index - 1].is_pay = 1;
                    if (self.refItemList[index - 1])
                        self.refItemList[index - 1].refreshItem();
                } else {
                    self.showErrorMsg(jsonData.error_msg)
                }

                self.internalLoading.hideLoading();
            }, formData, () => {
                if (this.page > 1) this.page--;
                self.internalLoading.hideLoading();
            });
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
        // paddingBottom: scale(10)
    },
    flatlist: {
        borderColor: '#D6D4D4',
        // borderBottomLeftRadius: scale(10),
        // borderBottomRightRadius: scale(10),
        borderLeftWidth: 1,
        // borderTopWidth: 0,
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
        paddingLeft: scale(10)
    },
    view_birthday: {
        flex: 2.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_hdc: {
        flex: 2.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt_title_list: {
        color: '#707070',
        fontWeight: 'bold',
        fontSize: fontSize(13),
        textAlign: 'center'
    },
    view_line: {
        backgroundColor: '#D4D4D4',
        width: 1
    },
    listview_separator: {
        height: 1,
        backgroundColor: '#D4D4D4'
    }
});