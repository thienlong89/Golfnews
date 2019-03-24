import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import { Avatar } from 'react-native-elements';
import MyView from '../../../Core/View/MyView';

import {scale, verticalScale, fontSize} from '../../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

const screenWidth = Dimensions.get('window').width-scale(40);
export default class EventUserItemShare extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            showPopup: false
        }
    }

    static defaultProps = {
        data: null
    }

    showUserId() {
        let { data } = this.props;
        return data.getMemberId().length ? data.getId() + '-' + data.getMemberId() : data.getId();
    }

    onItemPressAndHole(){
        let{data,isHost} = this.props;
        console.log("check host ");
        if((this.getAppUtil().replaceUser(data.getId()) === this.getUserInfo().getId()) || (!isHost)){
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

    onRemoveUserClick(){
        this.sendRequestRemoveUser();
    }

    sendRequestRemoveUser(){

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

    render() {
        let { data } = this.props;
        let{isLoading,showPopup} = this.state;
        //console.log("data.getAccepted() === 0 ",(data.getAccepted() === 0),data.getAccepted(),typeof data.getAccepted());
        return (
            // <TouchableWithoutFeedback onPress={() => { this.setState({ showPopup: false }) }}>
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: showPopup ? verticalScale(5) : 0 }}
                collapsable={false}>
                    {/* <MyView style={{ height: 23, flexDirection: 'row', alignItems: 'center' }} hide={!showPopup}>
                        <View style={{ flex: 1 }}></View>
                        <Touchable onPress={this.onRemoveUserClick.bind(this)}>
                            <MyView style={styles.button_delete_group} hide={isLoading}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.delete_group_text}>{this.t('xoa_user')}</Text>
                            </MyView>
                        </Touchable>
                        <ItemLoading ref={(itemRmoveLoading) => { this.itemRmoveLoading = itemRmoveLoading; }} bottom={3} right={15} />
                    </MyView> */}
                    {/* <Touchable onPress={this.onItemClick.bind(this)} onLongPress={this.onItemPressAndHole.bind(this)}> */}
                        <View collapsable={false}
                        style={[styles.container,{ width: screenWidth, borderTopColor: showPopup ? '#e3e3e3' : null, borderTopWidth: showPopup ? 1 : 0 }]}>
                            {this.renderLoading()}
                            <View style={styles.container_avatar}
                            collapsable={false}>
                                <Avatar
                                    width={verticalScale(50)}
                                    height={verticalScale(50)}
                                    rounded={true}
                                    source={data.getAvatar().length ? { uri: data.getAvatar() } : this.getResources().avatar_default}
                                />
                            </View>
                            <View style={styles.container_body}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.text_body_fullname}>{data.getFullname()}</Text>
                                <Text allowFontScaling={global.isScaleFont} style={styles.text_body_userid}>{this.showUserId()}</Text>
                                <Text allowFontScaling={global.isScaleFont} style={styles.text_body_hdc}>{this.t('handicap_title')}: {this.getAppUtil().handicap_display(data.getHandicap())}</Text>
                            </View>
                            <MyView style={styles.wating_view} hide={data.getAccepted() === 1}>
                                <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(11,-scale(3)), color: '#adadad', textAlign: 'center' }}>{(data.getAccepted() === 0) ? this.t('waiting_for_accept') : ''}</Text>
                            </MyView>
                            <MyView style={styles.wating_view} hide={data.getAccepted() !== 1}>
                                <Image style={{ width: scale(30), height: verticalScale(22), resizeMode: 'contain', tintColor: '#00aba7' }}
                                    source={this.getResources().btn_save} />
                            </MyView>
                            <View style={styles.handicap_facility_view}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.handicap_facility_text}>{this.getAppUtil().handicap_display(data.getCourseIndex())}</Text>
                            </View>
                        </View >
                    {/* </Touchable> */}
                </View>
            // {/* </TouchableWithoutFeedback> */}
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: verticalScale(80),
        flexDirection: 'row',
        alignItems: 'center'
    },

    wating_view : {
        alignItems: 'center', 
        width: scale(80), 
        height: verticalScale(60), 
        padding: scale(5),
        justifyContent: 'center'  
    },

    handicap_facility_view: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#00aba7',
        borderRadius: verticalScale(20),
        width: verticalScale(40),
        height: verticalScale(40),
        borderWidth: verticalScale(1.5),
        marginRight: scale(10)
    },

    handicap_facility_text: {
        alignSelf: 'center',
        color: '#00aba7',
        fontWeight: 'bold',
        fontSize :  fontSize(25),// 25
    },

    container_container: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        minHeight: verticalScale(70),
        height: verticalScale(60),
        flexDirection: 'row',
        alignItems: 'center'
    },

    button_delete_group : {
        width: scale(100), 
        marginRight: scale(3), 
        height: verticalScale(22), 
        borderColor: '#707070', 
        borderRadius: verticalScale(11), 
        borderWidth: verticalScale(1), 
        justifyContent: 'center', 
        alignItems: 'center' 
    },

    delete_group_text : {
        fontSize: fontSize(12,-3),// 12, 
        color: '#707070',
        textAlign : 'center' 
    },

    container_avatar: {
        width: verticalScale(50),
        height: verticalScale(50),
        marginLeft: scale(10)
    },

    view_avatar: {
        width: verticalScale(50),
        height: verticalScale(50)
    },

    image_avatar: {
        resizeMode: 'contain',
        minHeight: verticalScale(50),
        minWidth: verticalScale(50)
    },

    container_body: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: scale(5)
    },

    view_body: {
        flex: 1,
        justifyContent: 'center'
    },

    text_body_fullname: {
        flex: 0.3,
        fontWeight: 'bold',
        color: 'black',
        fontSize: fontSize(14),// 14
    },

    text_body_userid: {
        flex: 0.3,
        color: '#adadad',
        fontSize: fontSize(13),// 13
    },

    text_body_hdc: {
        flex: 0.3,
        color: '#737373',
        fontSize : fontSize(13),
    },

    container_add: {
        width: scale(100),
        height: verticalScale(70),
        justifyContent: 'center',
        alignItems: 'center',
    },

    button_add_club: {
        height: verticalScale(30),
        width: scale(100),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(10)
    },

    button_add: {
        height: verticalScale(30),
        width: scale(100),
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor : '#4294f7',
        borderWidth: verticalScale(0.5),
        borderRadius: verticalScale(3),
        marginRight: scale(10)
    },

    text: {
        alignSelf: 'center',
        fontSize: fontSize(16),// 16
    },

    text_add_color: {
        color: 'white'
    },

    button_color: {
        color: '#4294f7'
    },
});