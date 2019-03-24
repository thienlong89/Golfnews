/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {
    Text,
    View,
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
//import UserInfo from '../../../Config/UserInfo';
import CLBModel from '../../../Model/CLB/CLBModel';
import styles from '../../../Styles/LeaderBoard/Screens/StyleTopSingleScreen';
import BaseComponent from '../../../Core/View/BaseComponent';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import Constant from '../../../Constant/Constant';
import LoadingView from '../../../Core/Common/LoadingView';
import ListViewClub from '../Items/ListViewLeaderBoardClub';
import I18n from 'react-native-i18n';
require('../../../../I18n/I18n');

// const TAG = "[Vhandicap-v1] TopCLBScreen : ";

var listDataTopCLB = [];
var page = 1;
var startTime = 0;
export default class TopCLBScreen extends BaseComponent {
    constructor(props) {
        super(props);
        this.isSearch = false;
        this._parent = null;
    }

    static defaultProps = {
        parentNavigation: null,
    }

    static navigationOptions = () => ({
        title: I18n.t("top_club"),               // it stay in french whatever choosen langage
        tabBarLabel: I18n.t("top_club"),
    });

    showLoading(){
        if(this.loading2){
            this.loading2.showLoading();
        }
    }

    hideLoading(){
        if(this.loading2){
            this.loading2.hideLoading();
        }
    }

    sendData() {
        //this._parent.loading.showLoading();
        this.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.club_list(page);
        console.log("url club : ", url);
        Networking.httpRequestGet(url, this.onResponse.bind(this), () => {
            //time out
            // self._parent.loading.hideLoading();
            self.hideLoading();
            //self._parent.popupTimeOut.showPopup();
        });
    }

    onResponse(jsonData) {
        console.log("data top club : ", jsonData);
        this.hideLoading();
        this.model = new CLBModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            for (let objData of this.model.getListCLB()) {
                let obj = {
                    id: objData.getId(),
                    clbName: objData.getName(),
                    logoUrl: objData.getLogo(),
                    totalMember: objData.getTotalMember(),
                    score: objData.getAvgHandicapDisplay(),
                    rank: objData.getRank(),
                    manners: objData.getManners(),
                    country_image : objData.getCountryImage()
                }
                // console.log("push obj : ", obj);
                listDataTopCLB.push(obj);
            }
            if (listDataTopCLB.length) {
                this.listViewClub.setFillData(listDataTopCLB);
            }
        }
    }

    componentDidMount() {
        const { screenProps } = this.props;
        this.listViewClub.loadMoreCallback = this.onLoadMore.bind(this);
        this.listViewClub.itemClickCallback = this.onItemClick.bind(this);
        if (screenProps != null) {
            let parent = screenProps.parent;
            this._parent = parent;
            parent.completeSearchCallback = this.fillDataSearch.bind(this);
            parent.cancelSearchCallback = this.cancelSearch.bind(this);

            parent.callbackStartSearch = this.onStartSearch.bind(this);
            parent.addToListCompleteCallback(Constant.LEADER_BOARD.SCREEN_INDEX.CLUB,this.fillDataSearch.bind(this));
            parent.addToListCancelCallback(Constant.LEADER_BOARD.SCREEN_INDEX.BOGEY,this.cancelSearch.bind(this));
            parent.addToListStartCallback(Constant.LEADER_BOARD.SCREEN_INDEX.BOGEY,this.onStartSearch.bind(this));

            parent.rank_type = Constant.LEADER_BOARD.RANK_TYPE.CLUB;
            this.isSearch = screenProps.is_search;
            //parent.clearSearch();
            if (!this.isSearch) {
                let endTime = (new Date()).getTime();
                if (startTime && (endTime - startTime) > Constant.LEADER_BOARD.CACHE_TIME) {
                    //lơn hơn tgian cache thi load lại
                    listDataTopCLB = [];
                    page = 1;
                    startTime = endTime;
                    this.sendData();
                } else {
                    if (listDataTopCLB.length) {
                        //co roi thi fill vao list view
                        // this.setState({
                        //     dataSource: this.state.dataSource.cloneWithRows(listDataTopCLB)
                        // });
                        this.listViewClub.setFillData(listDataTopCLB);
                        return;//chi load 1 lan
                    }
                    page = 1;
                    startTime = endTime;
                    this.sendData();
                }
            }
        }
    }

    onStartSearch() {
        this.isSearch = true;
        this.listViewClub.setFillData([], true);
        this.listViewClub.showLoading();
    }

    //khi nguoi choi nhan huy tim kiem
    cancelSearch() {
        this.isSearch = false;
        this.listViewClub.setFillData(listDataTopCLB);
        // this.setState({
        //     dataSource: this.state.dataSource.cloneWithRows(listTop18Users),
        // });
    }

    //filldu lieu khi tim kiem
    fillDataSearch(jsonData) {
        //console.log("data : ", jsonData);
        this.listViewClub.hideLoading();
        if (!this.isSearch) return;
        this.model = new CLBModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            var listClub = [];
            for (let objData of this.model.getListCLB()) {
                let obj = {
                    id: objData.getId(),
                    clbName: objData.getName(),
                    logoUrl: objData.getLogo(),
                    totalMember: objData.getTotalMember(),
                    score: objData.getHandicap(),
                    rank: objData.getRank(),
                    manners: objData.getManners(),
                    country_image : objData.getCountryImage()
                }
                // console.log("push obj : ", obj);
                listClub.push(obj);
            }
            this.listViewClub.setFillData(listClub, true);
            // this.setState({
            //     dataSource: this.state.dataSource.cloneWithRows(listClub),
            // });
        }
    }

    onItemClick(data) {
        const { screenProps } = this.props;
        let club_id = data.id;
        let club_title = data.clbName;
        console.log('onItemClick', data)
        if (screenProps != null) {
            // screenProps.parentNavigation.navigate('club_detail_view', { "club_id": club_id, "club_title": club_title });
            screenProps.parentNavigation.navigate('introduce_club_view',
                {
                    clubId: club_id,
                    clubName: club_title,
                    // logoUrl: this.logoUrl,
                    // isAdmin: data.getIsUserAdmin(),
                    // isGeneralSecretary: data.getIsGeneralSecretary(),
                    // isModerator: data.getIsModerator(),
                    // isAccepted: data.getIsAccepted() === 1,
                    // isMember: data.getIsAccepted() === 1,
                    // invitation_id: data.getId(),
                    // totalMember: totalMember,
                    // callback: this.onClubDetailCallback.bind(this),
                    // refreshCallback: this.onRefreshCallback.bind(this)
                });
        }

    }

    onLoadMore() {
        if (!this.isSearch) {//load more khi khong phai o man hinh tim kiem
            page++;
            this.sendData();
            // console.log("load more friend : ", self.state.page);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.rank}>{this.t('rank_title')}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.name}>{this.t('clb_title')}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.hdc}>{this.t('member_title')}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.system_rank}>{this.t('score_title')}</Text>
                </View>
                <View style={styles.body}>
                    <ListViewClub ref={(listViewClub) => { this.listViewClub = listViewClub; }} />
                    <LoadingView ref={(loading2) => { this.loading2 = loading2; }}
                        isShowOverlay={false} />
                </View>
            </View>
        );
    }
}