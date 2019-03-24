import React from 'react';
import { Text, View, Alert, TouchableWithoutFeedback,Dimensions } from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import HideShowView from '../../Core/View/MyView';
import Touchable from 'react-native-platform-touchable';
import styles from '../../Styles/Group/StyleGroupItem';
import { Avatar } from 'react-native-elements';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import ItemLoading from '../Common/ItemLoadingView';
import MyView from '../../Core/View/MyView';
import PopupConfirmView from '../Popups/PopupConfirmView';

import {scale, verticalScale, moderateScale} from '../../Config/RatioScale';

const screenWidth = Dimensions.get('window').width;
export default class GroupItem extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            is_member: false,
            isLoading: false,
            showPopup: false,
        }

        this.onItemClick = this.onItemClick.bind(this);
        this.onItemPressAndHole = this.onItemPressAndHole.bind(this);
        this.onRemoveUserClick = this.onRemoveUserClick.bind(this);
    }

    static defaultProps = {
        group_id: '',
        isAdd: true,
        callbackAddMember: null,
        data: {},
        isChecked: false
        // parent: null
    }

    componentDidMount() {
        let { data } = this.props;
        //console.log("data.is_group_member : ", data.is_group_member);
        if (data.hasOwnProperty('is_group_member')) {
            this.setState({
                is_member: data.is_group_member
            });
        }
    }

    getColorView() {
        let { is_member } = this.state;
        return (is_member) ? '#fff' : '#4294f7';
    }

    getColorText() {
        let { is_member } = this.state;
        return (is_member) ? '#4294f7' : '#fff';
    }

    getText() {
        let { is_member } = this.state;
        //console.log("is member : ", is_member);
        return is_member ? this.t('member') : this.t('add');
    }

    //chi check 1 lan
    checkSetMemberState() {
        if (this.props.isChecked) return;
        let { data } = this.props;
        this.state.is_member = data.is_group_member;
        this.props.isChecked = true;
    }

    onRemoveUserClick() {
        let{data} = this.props;
        let msg = this.t('group_remove_user').format(data.fullname);
        this.popupComfirm.okCallback = this.sendRequestRemoveMember.bind(this);
        this.popupComfirm.cancelCallback = this.cancelDeleteUser.bind(this);
        this.popupComfirm.setMsg(msg);
       // this.sendRequestRemoveMember();
    }

    showRemoveLoading(){
        if(this.itemRmoveLoading){
            this.itemRmoveLoading.showLoading();
        }
    }

    hideRemoveLoading(){
        if(this.itemRmoveLoading){
            this.itemRmoveLoading.hideLoading();
        }
    }

    cancelDeleteUser(){
        this.setState({
            showPopup : false
        });
    }

    sendRequestRemoveMember(){
        let{data,removeFromListView,group_id} = this.props;
        let url = this.getConfig().getBaseUrl() + ApiService.group_remove_member(group_id);
        this.showRemoveLoading();
        let self = this;
        this.setState({
            isLoading : true
        });
        let formData =  {
	        "user_ids": [data.userId]
        }
        console.log("url : ",url);
        console.log("fromData xoa user khoi group : ",formData);
        Networking.httpRequestPost(url,(jsonData)=>{
            self.hideRemoveLoading();
            if(jsonData.hasOwnProperty('error_code')){
                let error_code = jsonData['error_code'];
                if(error_code === 0){
                    self.setState({
                        isLoading : false,
                        showPopup : false
                    });
                    if(removeFromListView){
                        removeFromListView(data);
                    }
                }else{
                    self.setState({
                        isLoading : false
                    });
                }
            }else{
                self.setState({
                    isLoading : false
                });
            }
        },formData,()=>{
            self.hideRemoveLoading();
            self.setState({
                isLoading : false
            });
        });
    }

    onItemPressAndHole(){
        let{data,isHost} = this.props;
        console.log("check host ");
        if((this.getAppUtil().replaceUser(data.userId) === this.getAppUtil().replaceUser(this.getUserInfo().getId())) || (!isHost)){
            return;
        }
        this.setState({
            showPopup: true
        });
    }

    onItemClick(){
        if(this.state.showPopup){
            this.setState({
                showPopup : false
            });
            return;
        }
    }

    render() {
        this.checkSetMemberState();
        let { data } = this.props;
        let { showPopup,isLoading } = this.state;
        return (
            <TouchableWithoutFeedback onPress={() => { this.setState({ showPopup: false }) }}>
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: showPopup ? verticalScale(5) : 0 }}>
                    <PopupConfirmView ref={(popupComfirm)=>{this.popupComfirm = popupComfirm;}}/>
                    <MyView style={{ height: verticalScale(23), flexDirection: 'row', alignItems: 'center' }} hide={!showPopup}>
                        <View style={{ flex: 1 }}></View>
                        <Touchable onPress={this.onItemClick} onPress={this.onRemoveUserClick}>
                            <MyView style={styles.button_delete_group} hide={isLoading}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.delete_group_text}>{this.t('xoa_user')}</Text>
                            </MyView>
                        </Touchable>
                        <ItemLoading ref={(itemRmoveLoading) => { this.itemRmoveLoading = itemRmoveLoading; }} bottom={verticalScale(3)} right={scale(15)} />
                    </MyView>
                    <Touchable onPress={this.onItemClick} onLongPress={this.onItemPressAndHole}>
                        <View style={[styles.container,{ width: screenWidth, borderTopColor: showPopup ? '#e3e3e3' : null, borderTopWidth: showPopup ? 1 : 0 }]}>
                            {/* <View style={styles.container_avatar}> */}
                                <Avatar
                                    width={verticalScale(50)}
                                    height={verticalScale(50)}
                                    containerStyle={{marginLeft : scale(10)}}
                                    rounded={true}
                                    source={(data.avatar && data.avatar.length ? { uri: data.avatar } : this.getResources().avatar_default)}
                                />
                            {/* </View> */}
                            <View style={styles.container_body}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.text_body_fullname}>{data.fullname}</Text>
                                <Text allowFontScaling={global.isScaleFont} style={styles.text_body_userid}>{this.showUserId()}</Text>
                                <Text allowFontScaling={global.isScaleFont} style={styles.text_body_hdc}>{this.t('handicap_title')}: {this.getAppUtil().handicap_display(data.handicap)}</Text>
                            </View>
                            <HideShowView hide={(data.facility_handicap !== undefined) ? false : true}>
                                <View style={styles.handicap_facility_view}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.handicap_facility_text}>{this.getAppUtil().handicap_display(data.facility_handicap)}</Text>
                                </View>
                            </HideShowView>
                            <HideShowView style={styles.container_add} hide={this.state.isLoading || !this.props.isAdd}>
                                <Touchable onPress={this.onAddClick.bind(this)}>
                                    <View style={[styles.button_add, { backgroundColor: this.getColorView(), borderColor: this.getColorText() }]}>
                                        <Text allowFontScaling={global.isScaleFont} style={[styles.text, { color: this.getColorText() }]}>{this.getText()}</Text>
                                    </View>
                                </Touchable>
                            </HideShowView>
                            <ItemLoading ref={(itemLoading) => { this.itemLoading = itemLoading; }}
                                right={scale(40)}
                                top={verticalScale(20)} />
                        </View >
                    </Touchable>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    onAddClick() {
        let { data } = this.props;
        if (data.is_group_member) return;
        let {callbackAddMember} = this.props;
        if (callbackAddMember) {
            callbackAddMember();
        }
        //console.log("prop : ",this.props);
        // let url = this.getConfig().getBaseUrl() + ApiService.group_add_member(this.props.group_id);
        // let self = this;
        // //this.loading.showLoading();
        // this.itemLoading.showLoading();
        // this.setState({
        //     isLoading: true
        // });
        // Networking.httpRequestPost(url, (jsonData) => {
        //     console.log("add member group : ", jsonData);
        //     self.itemLoading.hideLoading();
        //     self.setState({
        //         isLoading: false
        //     });
        //     if (jsonData.hasOwnProperty('error_code')) {
        //         let error_code = parseInt(jsonData['error_code']);
        //         if (error_code === 0) {
        //             if (self.props.callbackAddMember) {
        //                 self.props.callbackAddMember();
        //             }
        //         } else {
        //             //loi
        //             Alert.alert(
        //                 self.t('thong_bao'),
        //                 jsonData['error_msg'],
        //                 [
        //                     { text: 'OK', onPress: () => console.log('OK Pressed') },
        //                 ],
        //                 { cancelable: false }
        //             )
        //         }
        //     }
        // }, { "user_ids": [this.props.data.userId] }, () => {
        //     //time out
        //     self.itemLoading.hideLoading();
        //     self.setState({
        //         isLoading: false
        //     });
        //     //self.popupTimeOut.showPopup();
        // });
    }

    showUserId() {
        return (this.props.data.eHandicap_member_id && this.props.data.eHandicap_member_id.length) ? this.props.data.userId + '-' + this.props.data.eHandicap_member_id : this.props.data.userId;
    }
}