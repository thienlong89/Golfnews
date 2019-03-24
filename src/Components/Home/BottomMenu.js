import React from 'react';
import {
    Platform,
    Text,
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
    AppState,
    Dimensions
} from 'react-native';
import { Badge } from 'native-base';
import BaseComponent from '../../Core/View/BaseComponent';
import Touchable from 'react-native-platform-touchable';
const styles = require("../../Styles/BottomMenu/StyleBottomMenu");
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import MyView from '../../Core/View/MyView';
import DataManager from '../../Core/Manager/DataManager';
import NotifyConstant from '../Notification/NotifyConstant';
import TextEnterScoreCard from './Item/TextEnterScoreCard';

import { Constants } from '../../Core/Common/ExpoUtils';
import Tips from 'react-native-tips';

// let { width, height } = Dimensions.get('window');

export default class BottomMenu extends BaseComponent {

    constructor(props) {
        super(props);
        this.offsetTop = Platform.OS === 'ios' ? 0 : Constants.statusBarHeight;
        this.list_id_readed = [];
        this.waiting_for_request_count_notify = false;
        this.isIphoneX = this.getAppUtil().isIphoneX();
        this.state = {
            index: 0,
            tintColorHome: '#00BAB6',
            tintColorFriend: '#ABABAB',
            tintColorNotify: '#ABABAB',
            tintColorMenu: '#ABABAB',
            count_notification: 0,
            // count_notification_friend : 0
            tipsVisible: false,
            appState: AppState.currentState
        }
        //this.registerNotificationFirebase();
    }

    switchScreen(index) {
        if (this.state.index != index) {

            if (global.is_profile_loaded) {

                switch (index) {
                    case 0:
                        this.setState({
                            index: index,
                            tintColorHome: '#00BAB6',
                            tintColorFriend: '#ABABAB',
                            tintColorNotify: '#ABABAB',
                            tintColorMenu: '#ABABAB'
                        })
                        break;
                    case 1:
                        this.setState({
                            index: index,
                            tintColorHome: '#ABABAB',
                            tintColorFriend: '#00BAB6',
                            tintColorNotify: '#ABABAB',
                            tintColorMenu: '#ABABAB'
                        })
                        break;
                    case 2:
                        this.setState({
                            index: index,
                            tintColorHome: '#ABABAB',
                            tintColorFriend: '#ABABAB',
                            tintColorNotify: '#ABABAB',
                            tintColorMenu: '#ABABAB'
                        })
                        break;
                    case 3:
                        this.setState({
                            index: index,
                            tintColorHome: '#ABABAB',
                            tintColorFriend: '#ABABAB',
                            tintColorNotify: '#00BAB6',
                            tintColorMenu: '#ABABAB'
                        })
                        break;
                    case 4:
                        this.setState({
                            index: index,
                            tintColorHome: '#ABABAB',
                            tintColorFriend: '#ABABAB',
                            tintColorNotify: '#ABABAB',
                            tintColorMenu: '#00BAB6',
                            tipsVisible: false
                        })
                        break;
                }

                this.props.switchMenuCallback(index);
            } else {
                this.showErrorMsg(this.t('profile_loading'));
            }
        }
    }

    setChangeState(tipsVisible) {
        this.setState({
            tipsVisible: tipsVisible
        });
    }

    componentDidMount() {
        // AppState.addEventListener('change', this._handleAppStateChange);
        this.registerMessageBar();
        // DataManager.loadListNews(this.onLoadNewsReadedComplete.bind(this));
        this.interval = setInterval(() => {
            this.checkRequestCountNotify();//3 giay check 1 phat neu thay doi thi request len sever
        }, 3000);
        this.sendRequestCountNotification();
        //global.function_refresh_count_notify = this.sendRequestCountNotification.bind(this);
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
        // AppState.removeEventListener('change', this._handleAppStateChange);
        if(this.interval){
            clearInterval(this.interval);
        }
    }

    // _handleAppStateChange = (nextAppState) => {
    //     if (this.state.appState.match(/background/) && nextAppState === 'active') {
    //         console.log('BottomMenu.active');
    //         global.isAppJustActive = true;
    //     }
    //     this.setState({ appState: nextAppState });
    // }

    checkRequestCountNotify() {
        // this.Logger().log("refresh count notify ",global.change_notify);
        if (global.change_notify && !this.waiting_for_request_count_notify) {
            this.sendRequestCountNotification();
            this.waiting_for_request_count_notify = true;
        }
    }

    /**
     * load list notify id da doc lan dau vao app
     * @param {*} err 
     * @param {*} result 
     */
    onLoadNewsReadedComplete(err, result) {
        //if(!result) return;
        // console.log("check ",result,JSON.stringify(this.list_id_readed),(result === JSON.stringify(this.list_id_readed)));
        // if(result === JSON.stringify(this.list_id_readed)){
        //     //neu giong thi thoi ko gui nua
        //     console.log("Bo qua load count notify ",result,JSON.stringify(this.list_id_readed));
        //     return;
        // }
        if (result) {
            let array = JSON.parse(result);
            let sort_array = array.sort((r1, r2) => r1 - r2);
            global.list_notify_id_readed = sort_array;
            console.log("mang sap xep tang dan : ", sort_array);
            this.list_id_readed = this.list_id_readed.concat(sort_array);
        }
        this.sendRequestCountNotification();
    }

    /**
     * sinh object mảng các id tin tức đã đọc
     */
    genFormData() {
        let list = [];
        let list_total = [];//mang to nhat
        let temp = 0;
        this.list_id_readed = this.list_id_readed.sort(d => d > 0);
        console.log("list_id_readed sort ", this.list_id_readed);
        if (!this.list_id_readed.length) {
            return { "magazine_ids": [[]] };
        } else {
            for (let d of this.list_id_readed) {
                if (temp) {
                    if (d == temp + 1) {
                        temp = d;
                        continue;
                    } else {
                        list.push(temp);//add vao mang con
                        list_total.push(list.slice(0));//add amng con clone vao mang cha
                        list = [];//reset lai mang con
                        list.push(d);//add mang con moi
                        temp = d;
                    }
                } else {
                    temp = d;
                    list.push(d);
                }
            }
            //luu mang cuoi cung
            list.push(temp);
            //list_total = list_total.sort()
            list_total.push(list);
            //console.log("list id sau khi sap xep : ", list_total);
            console.log("formData : ", { "magazine_ids": list_total });
            return { "magazine_ids": list_total };
        }
    }

    /**
     * render lai text enter score khi đổi ngôn ngữ
     */
    reRenderTextEnterScore(){
        if(this.textEnterScore){
            this.textEnterScore.reRender();
        }
    }

    /**
     * Gửi request lấy số lượng notification
     */
    sendRequestCountNotification() {
        // reyturn;
        let url = this.getConfig().getBaseUrl() + ApiService.notification_count();
        console.log("url count notify : ",url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            console.log("jsonData : ", jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = jsonData['error_code'];
                let total = 0;
                if (error_code === 0) {
                    if (jsonData.hasOwnProperty('data')) {
                        let data = jsonData['data'];
                        total = data['total_count_display'];// || 0;
                        global.change_notify = false;
                        self.waiting_for_request_count_notify = false;
                        //
                        //NotifyConstant.setCountNotifyFriend(data['friend_count_display']);
                        global.count_notifycation = data['notification_count_display'];
                        global.count_news = data['magazine_count_display'];
                        global.count_friends = data['friend_count_display'];
                    }
                    //friend count
                    self.setState({
                        count_notification: total,
                    });
                }
            }
        },() => {
            self.waiting_for_request_count_notify = false;
        });
    }

    render() {
        let { count_notification, count_notification_friend } = this.state;
        console.log("count_notification : ", count_notification);
        return (
            <View style={[styles.bottom_container, { marginBottom: this.isIphoneX ? 10 : 0 }]}>
                <View style={styles.bottom_menu} >

                    <Touchable style={styles.item_view} onPress={() => this.switchScreen(0)}>
                        <View style={styles.item_view} >
                            <Image
                                style={[styles.icon_home, { tintColor: this.state.tintColorHome }]}
                                source={this.getResources().ic_home_focus}
                            />
                        </View>
                    </Touchable>

                    <Touchable style={styles.item_view} onPress={() => this.switchScreen(1)}>
                        <View style={styles.item_view} >
                            <Image
                                style={[styles.icon_friend, { tintColor: this.state.tintColorFriend }]}
                                source={this.getResources().ic_home_hdc}
                            />
                        </View>
                    </Touchable>

                    <View style={styles.center_item} ></View>

                    <Touchable style={styles.item_view} onPress={() => this.switchScreen(3)}>
                        <View style={styles.item_view} >
                            <Image
                                style={[styles.icon_friend, { tintColor: this.state.tintColorNotify }]}
                                source={this.getResources().ic_home_disccuss}
                            />
                            {/* <MyView style={styles.view_badge} hide={(count_notification.toString().length > 0 && count_notification.toString() !== '0') ? false : true}>
                                <Badge style={styles.badge}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.text_badge}>{count_notification}</Text>
                                </Badge>
                            </MyView> */}

                        </View>
                    </Touchable>


                    <Touchable style={styles.item_view} onPress={() => this.switchScreen(4)}>
                        <Tips
                            visible={this.state.tipsVisible}
                            text={this.t('tut_upgrade_menu')}
                            // position="left"
                            offsetTop={-this.offsetTop}
                            offsetLeft={Platform.OS === 'ios' ? 110 : 0}
                            enableChildrenInteraction={true}
                            onRequestClose={this.handleNextTips.bind(this)}
                            tooltipContainerStyle={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingRight: 100
                            }}
                        >
                            <View style={styles.item_view} >
                                <Image
                                    style={[styles.icon_menu, { tintColor: this.state.tintColorMenu }]}
                                    source={this.getResources().ic_menu}
                                />
                            </View>
                        </Tips>
                    </Touchable>

                </View>

                <TouchableOpacity onPress={() => this.switchScreen(2)} style={styles.touchable_enter_score}>
                    <ImageBackground style={styles.item_enter_score}
                        resizeMode='contain'
                        source={this.getResources().ic_enter_score_bg} >
                        <Image
                            style={styles.scoreboard}
                            source={this.getResources().cskh}
                        />
                        <TextEnterScoreCard ref={(textEnterScore)=>{this.textEnterScore = textEnterScore;}} style={styles.txt_enter_score}/>
                        {/* <Text allowFontScaling={global.isScaleFont} style={styles.txt_enter_score}>{this.t('enter_score_upper_case')}</Text> */}

                    </ImageBackground>
                </TouchableOpacity>
                {this.renderMessageBar()}
            </View>
        );
    }

    handleNextTips() {
        this.switchScreen(4);
        if (this.props.onStartTutorialUpgradeNext) {
            this.props.onStartTutorialUpgradeNext();
        }
        global.isUpgradeTut = true;
    }
}