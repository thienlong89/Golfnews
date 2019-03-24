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
import MyView from '../../../../Core/View/MyView';
import Networking from '../../../../Networking/Networking';
import ApiService from '../../../../Networking/ApiService';
import { scale, verticalScale, moderateScale, fontSize } from '../../../../Config/RatioScale';
import CheckHandicapView from '../../../Common/CheckHandicapView';
import AdminMemberHdcItem from '../../Items/AdminMemberHdcItem';
import ClubMemberModel from '../../../../Model/CLB/ClubMemberModel';
import ListViewShow from '../../../Common/ListViewShow';
import PopupSelectTeeView from '../../../Common/PopupSelectTeeView';
import ClubMemberPayFeeModel from '../../../../Model/CLB/ClubMemberPayFeeModel';

export default class CheckHdcTabView extends BaseComponent {

    constructor(props) {
        super(props);
        let { clubName, clubId, logoUrl, totalMember, isAdmin, isGeneralSecretary, isModerator } = this.props.screenProps.navigation.state.params;
        this.clubName = clubName;
        this.clubId = clubId;
        this.isAdmin = isAdmin;
        this.isGeneralSecretary = isGeneralSecretary;
        this.isModerator = isModerator;
        this.totalMember = totalMember;
        this.page = 1;
        this.teeListAvailable = [];
        this.teeSelected = null;
        this.isCheckHandicapAll = true;
        this.courseData = '';
        this.state = {
            listMember: []
        }

        this.onChangeTeeAll = this.onChangeTeeAll.bind(this);
        this.loadMoreData = this.loadMoreData.bind(this);
        this.onTeeSelected = this.onTeeSelected.bind(this);
        this.onMemberPress = this.onMemberPress.bind(this);
    }

    render() {
        let {
            listMember
        } = this.state;
        return (
            <View style={styles.container}>
                <CheckHandicapView ref={(checkHandicap) => { this.checkHandicap = checkHandicap; }}
                    onChangeTeeAll={this.onChangeTeeAll} />
                <View style={styles.view_member_list}>
                    {/* <View style={styles.view_title}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('danh_sach_thanh_vien')}</Text>
                    </View> */}
                    {/* <MyView hide={listType != 0} style={styles.view_description}> */}
                    {/* <Text allowFontScaling={global.isScaleFont} style={styles.txt_description}>{this.t('accuracy_hdc')}</Text> */}
                    {/* </MyView> */}

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
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_list}>{this.t('hdc_index')}</Text>
                        </View>
                        <View style={styles.view_line} />
                        <View style={styles.view_hdc}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_list}>{this.t('hdc_course')}</Text>
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
                            <AdminMemberHdcItem
                                playerItem={item}
                                index={index + 1}
                                onItemPress={this.onMemberPress} />
                        }
                        style={styles.flatlist}
                    />
                    {this.renderInternalLoading()}
                </View>
                <ListViewShow ref={(listShow) => { this.listShow = listShow; }} />
                <PopupSelectTeeView
                    ref={(refPopupSelectTeeView) => { this.refPopupSelectTeeView = refPopupSelectTeeView; }}
                    onTeeSelected={this.onTeeSelected} />
                {this.renderMessageBar()}
            </View>
        );
    }


    componentDidMount() {
        this.registerMessageBar();
        this.checkHandicap.completeCallback = this.onSearchCheckHandicap.bind(this);
        this.checkHandicap.showPopupCallback = this.onCheckListClick.bind(this);
        this.checkHandicap.enableLoadingCallback = this.enableLoadingSearch.bind(this);
        this.listShow.itemClickCallback = this.onSelectedFacility.bind(this);

        // this.getListMember();
        this.requestCheckHandicapAll();
    }

    componentWillUnmount() {
        this.unregisterMessageBar();

    }

    onChangeTeeAll() {
        this.isCheckHandicapAll = true;
        this.refPopupSelectTeeView.setVisible(this.teeListAvailable);
    }

    onTeeSelected(teeObject, extrasData) {
        this.teeSelected = teeObject;
        this.page = 1;
        this.state.listMember = [];
        if (this.isCheckHandicapAll) {
            this.checkHandicap.setTeeSelected(teeObject);
            this.requestCheckHandicapAll();
        }
    }

    loadMoreData() {
        this.page++;
        // if (this.courseData) {
        this.requestCheckHandicapAll();
        // } else {
        //     this.getListMember();
        // }

    }

    getListMember() {
        this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.list_member_club_with_star(this.clubId, this.page);
        console.log("url ", url);
        let self = this;
        Networking.httpRequestGet(url, this.onResponseData.bind(this), () => {
            //time out
            if (self.page > 1) self.page--;
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

    onSearchCheckHandicap(listData) {
        if (this.listShow) {
            this.listShow.hideLoading();
            this.listShow.setFillData(listData);
        }
    }

    onCheckListClick() {
        this.listShow.switchShow()
    }

    enableLoadingSearch() {
        this.listShow.show();
        this.listShow.showLoading();
        this.listShow.setFillData([]);
    }

    onSelectedFacility(data) {
        this.page = 1;
        this.state.listMember = [];
        this.courseData = data;
        this.teeListAvailable = data.getTeeList();
        this.Logger().log('......................................... teeListAvailable', this.teeListAvailable);
        this.checkHandicap.setDataSearch(data, this.teeSelected);

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
                        listMember: [...this.state.listMember, ...listMember],
                    }, () => {

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
        borderWidth: 1,
        // borderRadius: 10,
        margin: 10,
        // paddingBottom: scale(10)
    },
    view_title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: scale(10)
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
        minHeight: scale(35)
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
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_hdc: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt_title_list: {
        color: '#707070',
        fontWeight: 'bold',
        fontSize: fontSize(13)
    },
    view_line: {
        backgroundColor: '#D4D4D4',
        width: 1
    },
    listview_separator: {
        height: 1,
        backgroundColor: '#D4D4D4'
    },
    flatlist: {
        // borderColor: '#D6D4D4',

        flexGrow: 0
    },
});