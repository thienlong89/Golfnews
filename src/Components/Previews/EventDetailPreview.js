import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    RefreshControl,
    BackHandler,
    Dimensions
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../Events/Header/Header';
import EventDetailHeader from '../Events/Header/EventDetailHeader';
import EventUserItem from '../Events/Items/EventUserItem';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import EventMemberModel from '../../Model/Events/EventMemberModel';
//import CustomLoading from '../Common/CustomLoadingView';
import EmptyDataView from '../../Core/Common/EmptyDataView';
import AppUtil from '../../Config/AppUtil';
import MyView from '../../Core/View/MyView';
import ItemLoading from '../Common/ItemLoadingView';

import {scale, verticalScale, fontSize} from '../../Config/RatioScale';

/**
 * chia màn hình host và user bình thường cho dễ quản lý
 * Man hình chi tiết event dành cho user không phải host
 */
export default class EventDetailPreview extends BaseComponent {
    constructor(props) {
        super(props);
        this.list_users = [];
        this.data = null;
        this.page = 1;
        this.backHandler = null;
        this.check_me = false;
        this.state = {
            total_join: 0,
            isLoading : false,
            is_join: false,
            refreshing: false,
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
        };

        this.onCancelClick = this.onCancelClick.bind(this);
        this.onAcceptClick = this.onAcceptClick.bind(this);
        this.onLoadMore = this.onLoadMore.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
    }

    componentDidMount() {
        let { data } = this.props.navigation.state.params;
        console.log("event data : ", data);
        this.data = data;
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBackClick.bind(this));
        if (this.headerView) {
            this.headerView.setTitle(this.t('event'));
            this.headerView.setRightType(false);
            this.headerView.callbackBack = this.onBackClick.bind(this);
            this.headerView.setRightCallback(this.onRightClick.bind(this));
        }
        this.sendRequestListMemberEvent();
    }

    componentWillUnmount() {
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    checkUserIsMe(){
        if(this.check_me) return;
        let me_obj = this.list_users.find(d=>AppUtil.replaceUser(d.getId()) === AppUtil.replaceUser(this.getUserInfo().getId()));
        if(me_obj && Object.keys(me_obj).length){
            this.state.is_join = me_obj.getAccepted() === 1 ? true : false;
        }
        this.check_me = true;
    }

    /**
     * Click button back lai màn hình trước đó
     */
    onBackClick() {
        let { navigation } = this.props;
        if (navigation) {
            // let{onRefresh} = navigation.state.params;
            // if(onRefresh){
            //     onRefresh();
            // }
            // navigation.goBack();
            navigation.replace('app_screen');
        }
        return true;
    }

    /**
     * Chuyển tới màn hình tiếp theo
     */
    onRightClick() {
        let{navigation} = this.props;
        navigation.navigate('event_share',{data : this.data,list_users : this.list_users});
    }

    /**
     * view theo trang thái user đã vào event hay chưa
     */
    checkViewColor() {
        let { is_join } = this.state;
        return is_join ? '#fff' : '#00aba7';
    }

    /**
     * View màu text và border theo trạng thái user đã vào event hay chưa
     */
    checkTextColor() {
        let { is_join } = this.state;
        return is_join ? '#7d7d7d' : '#fff';
    }

    checkText() {
        let { is_join } = this.state;
        return is_join ? this.t('event_huy') : this.t('event_tham_gia');
    }

    onItemClick() {

    }

    onLoadMore() {
        if(!this.internalLoading || this.list_users.length < 10) return; 
        this.page++;
        this.sendRequestListMemberEvent();
    }

    onRefresh() {
        this.list_users = [];
        this.page = 1;
        this.sendRequestListMemberEvent();
    }

    showLoading(){
        if(this.internalLoading){
            this.internalLoading.showLoading();
        }
    }

    hideLoading(){
        if(this.internalLoading){
            this.internalLoading.hideLoading();
        }
    }

    sendRequestListMemberEvent() {
        let url = this.getConfig().getBaseUrl() + ApiService.event_list_members(this.data.id, this.page);
        console.log("url event : ", url);
        // this.internalLoading.showLoading();
        this.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            //console.log("event data : ", jsonData.data.users);
            self.hideLoading();
            let model = new EventMemberModel(self);
            model.parseData(jsonData);
            if (model.getErrorCode() === 0) {
                self.list_users = self.list_users.concat(model.getListMember());
                self.state.total_join = self.list_users.length;
                if (self.list_users.length) {
                    self.checkUserIsMe();
                    self.setState({
                        dataSource: self.state.dataSource.cloneWithRows(self.list_users),
                    });
                }
            }
        }, () => {
            //time out
            self.hideLoading();
            //self.popupTimeOut.showPopup();
        });
    }

    /**
     * Gửi lời đồng ý vào event
     */
    sendRequestAcceptInvitation(){
        let url = this.getConfig().getBaseUrl() + ApiService.event_member_accept_invitation(this.data.id);
        console.log("accept invitation url : ",url);
        let self = this;
        this.setState({
            isLoading : true
        });
        //this.itemLoading.showLoading();
        this.showItemLoading();
        Networking.httpRequestGet(url,(jsonData)=>{
            console.log("accept invitation data : ",jsonData);
            if(jsonData.hasOwnProperty('error_code')){
                let error_code = jsonData['error_code'];
                self.hideItemLoading();
                //self.itemLoading.hideLoading();
                if(error_code === 0){
                    //thanh cong
                    let obj_me = self.list_users.find(d=>AppUtil.replaceUser(d.getId()) === AppUtil.replaceUser(self.getUserInfo().getId()));
                    if(obj_me && Object.keys(obj_me).length){
                        obj_me.is_accepted = 1;
                    }
                    let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
                    self.setState({
                        dataSource: dataSource.cloneWithRows(self.list_users),
                        is_join : true,
                        isLoading : false
                    });
                }else{
                    self.setState({
                        isLoading : false
                    });
                }
            }
        },()=>{
            //self.itemLoading.hideLoading();
            self.hideItemLoading();
            self.setState({
                isLoading : false
            });
        });
    }

    showItemLoading(){
        if(this.itemLoading){
            this.itemLoading.showLoading();
        }
    }

    hideItemLoading(){
        if(this.itemLoading){
            this.itemLoading.hideLoading();
        }
    }

    /**
     * Từ chối vào event hoặc dời khỏi event
     */
    sendRequestCancelInvitation(){
        let url = this.getConfig().getBaseUrl() + ApiService.event_member_cancel_event(this.data.id);
        console.log("accept invitation url : ",url);
        let self = this;
        this.setState({
            isLoading : true
        });
        //this.itemLoading.showLoading();
        this.showItemLoading();
        Networking.httpRequestGet(url,(jsonData)=>{
            console.log("accept invitation data : ",jsonData);
            if(jsonData.hasOwnProperty('error_code')){
                let error_code = jsonData['error_code'];
                //self.itemLoading.hideLoading();
                self.hideItemLoading();
                self.setState({
                    isLoading : false
                });
                if(error_code === 0){
                    //thanh cong    
                    self.onBackClick();
                }
            }
        },()=>{
            //self.itemLoading.hideLoading();
            self.hideItemLoading();
            self.setState({
                isLoading : false
            });
        });
    }

    /**
     * dong y loi moi
     */
    onAcceptClick(){
        this.sendRequestAcceptInvitation();
    }

    /**
     * 
     * tu choi loi moi
     */
    onCancelClick(){
        this.sendRequestCancelInvitation();
    }

    render() {
        let { total_join,is_join,isLoading } = this.state;
        let { data } = this.props.navigation.state.params;
        //console.log("data === ",is_join ,isLoading,this.check_me);
        return (
            <View style={styles.container}>
                <HeaderView ref={(headerView) => { this.headerView = headerView; }} />
                <EventDetailHeader data={data} />
                <View style={styles.line}></View>
                <View style={styles.user_join_view}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.user_join_text}>{this.t('event_nguoi_se_tham_gia')} ({total_join})</Text>
                    <View style={{flex : 1}}></View>
                    <Touchable onPress={this.onCancelClick}>
                        <MyView style={{ width: this.getRatioAspect().scale(60), height: this.getRatioAspect().verticalScale(25),marginRight : this.getRatioAspect().scale(5), borderColor: '#a1a1a1',backgroundColor : '#fff', borderRadius: this.getRatioAspect().verticalScale(3), borderWidth: this.getRatioAspect().verticalScale(1), justifyContent: 'center', alignItems: 'center' }} hide={isLoading || !this.check_me}>
                            <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(13,-scale(1)), color: '#a1a1a1',textAlign : 'center' }}>{this.t('event_huy')}</Text>
                        </MyView>
                    </Touchable>
                    <Touchable onPress={this.onAcceptClick}>
                        <MyView style={{ width: this.getRatioAspect().scale(60), height: this.getRatioAspect().verticalScale(25),marginRight :scale(5), borderColor: '#00aba7',backgroundColor : '#00aba7', borderRadius: verticalScale(3), borderWidth: verticalScale(1), justifyContent: 'center', alignItems: 'center' }} hide={is_join || isLoading || !this.check_me}>
                            <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(11,-scale(4)), color: '#fff',textAlign : 'center' }}>{this.t('event_tham_gia')}</Text>
                        </MyView>
                    </Touchable>
                    <ItemLoading ref={(itemLoading)=>{this.itemLoading = itemLoading;}} top={verticalScale(20)} right={scale(30)}/>
                </View>
                <View style={{ flex: 1 }}>
                    <ListView style={styles.list_view}
                        dataSource={this.state.dataSource}
                        onEndReachedThreshold={5}
                        enableEmptySections={true}
                        keyboardShouldPersistTaps='always'
                        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                        onEndReached={this.onLoadMore}
                        renderRow={(rowData) =>
                            <Touchable onPress={this.onItemClick.bind(this, rowData)}>
                                <EventUserItem data={rowData} 
                                                isHost={false}/>
                            </Touchable>
                        }
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh.bind(this)}
                            />
                        } />
                    <EmptyDataView ref={(emptyDataView)=>{this.emptyDataView = emptyDataView;}}/>
                    {this.renderInternalLoading()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

    user_join_text: {
        fontSize: fontSize(16),// 16,
        color: '#828282',
        marginLeft: scale(8)
    },

    user_join_view: {
        height: verticalScale(50),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: verticalScale(0.5),
        borderBottomColor: '#d6d4d4'
    },

    line: {
        height: verticalScale(5),
        backgroundColor: '#f0e9e9',
        marginTop: verticalScale(15)
    },

    separator_view: {
        height: 1,
        backgroundColor: '#E3E3E3'
    },

    list_view: {
        flex: 1,
        marginTop: verticalScale(5)
    }
});