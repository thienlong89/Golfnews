import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import Util from '../../../Utils';
import MyImage from '../../../Core/Common/MyImage';
import MyView from '../../../Core/View/MyView';
import ItemLoading from '../../Common/ItemLoadingView';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import PopupConfirmView from '../../Popups/PopupConfirmView';
import WeatherInfoView from '../../Common/WeatherInfoView';
import { Avatar } from 'react-native-elements';

import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
let { width, height } = Dimensions.get('window');

//const screenWidth = Dimensions.get('window').width;
export default class EventItem extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            showPopup: false,
            isLoading: false
        }

        this.onDeleteEventClick = this.onDeleteEventClick.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
        this.onItemPressAndHole = this.onItemPressAndHole.bind(this);
    }

    static defaultProps = {
        data: null
    }

    checkAvatar() {
        let { data } = this.props;
        return (data && data.avatar) ? { uri: data.avatar } : this.getResources().avatar_event_default;
    }

    /**
     * load icon thời tiết tương ứng
     * @param {*} id 
     */
    checkIconWeather(id = 0) {
        return this.getResources().icon_nhieu_may;
    }

    /**
     * load text thời tiết tương ứng
     * @param {*} id 
     */
    checkTextWeather(id = 0) {
        return this.t('txt_nhieu_may');
    }

    isComing(data) {
        let coming = data.coming;
        //console.log("coming : ",coming);
        if (coming === 1) {
            return true;
        }
        return false;
    }

    showLoading() {
        if (this.itemLoading) {
            this.itemLoading.showLoading();
        }
    }

    hideLoading() {
        if (this.itemLoading) {
            this.itemLoading.hideLoading();
        }
    }

    sendRequestDelete() {
        let { data, removeFromListView } = this.props;
        let isHost = this.getAppUtil().replaceUser(data.user_host_id) === this.getAppUtil().replaceUser(this.getUserInfo().getId());
        let url = this.getConfig().getBaseUrl();
        let event_id = data.id;
        if (isHost) {
            url = url + ApiService.event_delete(event_id);
        } else {
            url = url + ApiService.event_member_cancel_event(event_id);
        }
        let self = this;
        console.log("url xoa event ", url);
        this.showLoading();
        this.setState({
            isLoading: true
        });
        Networking.httpRequestGet(url, (jsonData) => {
            self.hideLoading();
            console.log("data xoa event : ", jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = jsonData['error_code'];
                if (error_code === 0) {
                    self.setState({
                        isLoading: false,
                        showPopup: false
                    });
                    if (removeFromListView) {
                        removeFromListView();
                    }
                } else {
                    self.setState({
                        isLoading: false
                    });
                }
            }
        }, () => {
            self.hideLoading();
            self.setState({
                isLoading: false
            });
        });
    }

    cancelDeleteEvent() {
        this.setState({
            showPopup: false
        });
    }

    onDeleteEventClick() {
        let { data } = this.props;
        let isHost = this.getAppUtil().replaceUser(data.user_host_id) === this.getAppUtil().replaceUser(this.getUserInfo().getId());
        let msg = this.t('delete_event_msg').format(data.name);
        if (!isHost) {
            msg = this.t('out_event_msg').format(data.name);
        }
        this.popupConfirmView.okCallback = this.sendRequestDelete.bind(this);
        this.popupConfirmView.cancelCallback = this.cancelDeleteEvent.bind(this);
        this.popupConfirmView.setMsg(msg);
    }

    /**
     * Su kien nhấn và dữ chuột
     */
    onItemPressAndHole() {
        this.setState({
            showPopup: true
        });
    }

    onItemClick() {
        if (this.state.showPopup) {
            this.setState({
                showPopup: false
            });
            return;
        }
        let { onItemClick } = this.props;
        if (onItemClick) { onItemClick() }
    }

    render() {
        let { data } = this.props;
        let { showPopup, isLoading } = this.state;
        return (
            <TouchableWithoutFeedback onPress={() => { this.setState({ showPopup: false }) }}>
                <View style={{ justifyContent: 'center', marginTop: showPopup ? verticalScale(5) : 0 }}>
                    <PopupConfirmView ref={(popupConfirmView) => { this.popupConfirmView = popupConfirmView; }} />
                    <MyView style={{ height: verticalScale(23), flexDirection: 'row', alignItems: 'center' }} hide={!showPopup}>
                        <View style={{ flex: 1 }}></View>
                        <Touchable onPress={this.onDeleteEventClick}>
                            <MyView style={styles.button_delete_event} hide={isLoading}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.delete_event_text}>{(this.getAppUtil().replaceUser(data.user_host_id) === this.getAppUtil().replaceUser(this.getUserInfo().getId())) ? this.t('delete_event') : this.t('leave_event')}</Text>
                            </MyView>
                        </Touchable>
                        <ItemLoading ref={(itemLoading) => { this.itemLoading = itemLoading; }} bottom={verticalScale(3)} right={scale(15)} />
                    </MyView>
                    <Touchable style={{ width: width, minHeight: verticalScale(80) }} onPress={this.onItemClick} onLongPress={this.onItemPressAndHole}>
                        <View style={[styles.container, { backgroundColor: this.isComing(data) ? '#F5F5FA' : '#fff', width: width, borderTopColor: showPopup ? '#e3e3e3' : null, borderTopWidth: showPopup ? verticalScale(1) : 0 }]}>
                            {/* <MyImage
                                style={styles.avatar}
                                uri={data.avatar}
                                imageDefault={this.getResources().avatar_event_default}
                                source={this.checkAvatar()}
                            /> */}
                            <Avatar
                                rounded={true}
                                width={verticalScale(50)}
                                height={verticalScale(50)}
                                containerStyle={styles.avatar}
                                source={{ uri: data.avatar }}
                            />
                            <View style={styles.body}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.title}>{data.name}</Text>
                                <Text allowFontScaling={global.isScaleFont} style={[styles.event_facility, { fontWeight: this.isComing(data) ? "bold" : 'normal' }]}>{this.t('san')} : {data.facility_name}</Text>
                                {/* <View style={styles.view_teetime}> */}
                                <Text allowFontScaling={global.isScaleFont} style={[styles.teetime_label, { fontWeight: this.isComing(data) ? "bold" : 'normal' }]}>{this.t('tee_time')} : {data.tee_time}</Text>
                                {/* <WeatherInfoView
                                        facilityId={data.facility_id}
                                        time={data.create_at_timestamp}
                                    /> */}

                                {/* </View> */}
                                <Text allowFontScaling={global.isScaleFont} style={[styles.ago_time, { fontWeight: this.isComing(data) ? "bold" : 'normal' }]}>{Util.getFormatAgoTime(data.create_at_timestamp)}</Text>
                            </View>
                            {/* <View style={{ justifyContent: 'flex-end' }}> */}
                                <WeatherInfoView
                                    facilityId={data.facility_id}
                                    time={data.create_at_timestamp}
                                />
                            {/* </View> */}
                        </View>
                    </Touchable>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        minHeight: verticalScale(80),
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'
        // backgroundColor : '#fff'
    },

    button_delete_event: {
        width: verticalScale(100),
        marginRight: scale(3),
        height: verticalScale(22),
        borderColor: '#707070',
        borderRadius: verticalScale(11),
        borderWidth: verticalScale(1),
        justifyContent: 'center',
        alignItems: 'center'
    },

    delete_event_text: {
        fontSize: fontSize(13, -scale(1)),// 12,
        color: '#707070',
        textAlign: 'center'
    },


    ago_time: {
        // height: verticalScale(15),
        fontSize: fontSize(13, -scale(1)),// 10,
        color: '#bdbdbd',
        marginLeft: scale(5),
        marginBottom: verticalScale(5)
        // marginTop : verticalScale(3)
    },

    icon_weather: {
        width: scale(15),
        height: verticalScale(15),
        resizeMode: 'contain',
        marginLeft: scale(10)
    },

    label_weather: {
        fontSize: fontSize(13, -scale(1)),// 10,
        color: '#6b6b6b',
        marginLeft: scale(5)
    },

    teetime_label: {
        // flex: 1,
        fontSize: fontSize(14),// 10,
        color: '#6b6b6b',
        marginLeft: scale(5)
        // marginTop : verticalScale(5)
    },

    view_teetime: {
        marginLeft: scale(5),
        // height: verticalScale(15),
        flexDirection: 'row',
        alignItems: 'center',
        //marginTop : verticalScale(3)
    },

    event_facility: {
        // height: verticalScale(15),
        fontSize: fontSize(14),// 10,
        color: '#6b6b6b',
        marginLeft: scale(5),
        // marginTop : verticalScale(5)
        //marginTop : verticalScale(3)
    },

    avatar: {
        // width: verticalScale(40),
        // height: verticalScale(40),
        marginLeft: scale(10),
        // marginTop: verticalScale(10),
        // resizeMode: 'contain'
    },

    body: {
        flex: 1,
        // height : verticalScale(70),
        // width : width-scale(70),
        justifyContent: 'center',
        marginLeft: scale(10),
        marginRight: scale(10),
        paddingBottom: verticalScale(5),
        paddingTop: verticalScale(5),
        // marginTop : 5,
        // marginBottom : 5,
        // backgroundColor : 'green'
    },

    title: {
        fontSize: fontSize(16, scale(2)),// 12,
        color: '#000',
        fontWeight: 'bold',
        marginLeft: scale(5),
        marginTop: verticalScale(10)
        //textAlign: 'center'
    }
});