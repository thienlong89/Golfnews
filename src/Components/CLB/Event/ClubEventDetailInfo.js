import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    Image
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import MyView from '../../../Core/View/MyView';
import Weather from '../../Common/WeatherInfoView';
import EventDetailsModel from '../../../Model/Events/EventDetailsModel';
import LikeCommentItemView from '../../Social/Item/LikeCommentItemView';
import { scale } from '../../../Config/RatioScale';

export default class ClubEventDetailInfo extends BaseComponent {

    static defaultProps = {
        eventId: '',
        isAppointment: false,
        isAllowEdit: true
    }

    constructor(props) {
        super(props);

        this.userId = this.getUserInfo().getId();
        this.state = {
            eventDetailModel: null,
            isCreator: false
        }

        this.onViewInteractUserPress = this.onViewInteractUserPress.bind(this);
        this.onUpdateEvent = this.onUpdateEventPress.bind(this);
        this.onCommentEvent = this.onCommentEventPress.bind(this);
        this.likeCallback = this.likeCallback.bind(this);
    }

    render() {
        let { eventDetailModel, isCreator } = this.state;
        let {
            eventId,
            isAppointment
        } = this.props;

        let month = eventDetailModel ? eventDetailModel.getMonth() : '';
        let day = eventDetailModel ? eventDetailModel.getDay() : '';
        let eventName = eventDetailModel ? eventDetailModel.getName() : '';
        let creator = eventDetailModel ? eventDetailModel.getCreator().getFullName() : '';
        let teeTime = eventDetailModel ? eventDetailModel.getTeeTimeDisplay() : '';
        let courseName = eventDetailModel ? eventDetailModel.getCourse().getTitle() : '';
        let facilityId = eventDetailModel ? eventDetailModel.getFacilityId() : '';
        let tee_time = eventDetailModel ? eventDetailModel.getTeeTimestamp() : '';
        return (
            <View style={{ justifyContent: 'space-between' }}>
                <View style={styles.view_event_info}>
                    <View style={{ justifyContent: 'space-between' }}>
                        <ImageBackground style={styles.img_calendar}
                            source={this.getResources().ic_calendar}
                            imageStyle={{ resizeMode: 'contain' }}
                            resizeMethod={'resize'}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_month}>{month}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_day}>{day}</Text>
                        </ImageBackground>

                        <MyView hide={!isCreator}>
                            <TouchableOpacity onPress={this.onUpdateEvent}>
                                <View style={styles.view_edit}>
                                    <Image
                                        style={styles.img_edit}
                                        source={this.getResources().pen} />
                                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_edit}>
                                        {this.t('edit_')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </MyView>

                    </View>

                    <View style={{ marginLeft: 10, marginRight: 10 }}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_event_name}>{eventName}</Text>

                        <View style={[styles.view_item, { marginBottom: 5 }]}>
                            <Image
                                style={styles.img_icon}
                                source={this.getResources().ic_creator} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_label}>
                                {this.t('player_created_flight')}
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_label_content}>{creator}</Text>
                            </Text>
                        </View>

                        <View style={[styles.view_item, { marginBottom: 5 }]}>
                            <Image
                                style={styles.img_icon}
                                source={this.getResources().ic_map_header} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_label}>
                                {`${this.t('san')}: `}
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_label_content}>{courseName}</Text>
                            </Text>
                        </View>

                        <View style={[styles.view_tee_time]}>
                            <View style={styles.view_item}>
                                <Image
                                    style={styles.img_icon}
                                    source={this.getResources().tee_time_icon} />
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_label}>
                                    {`${this.t('tee_time')}: `}
                                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_label_content}>{teeTime}</Text>
                                </Text>
                            </View>

                            <Weather
                                hide={true}
                                facilityId={facilityId}
                                time={tee_time * 1000} />
                        </View>
                    </View>


                </View>
                <LikeCommentItemView
                    ref={(refLikeCommentItemView) => { this.refLikeCommentItemView = refLikeCommentItemView }}
                    eventId={eventId}
                    stt_id={eventId}
                    postType={isAppointment ? 5 : 2}
                    postStatus={eventDetailModel ? eventDetailModel.getPostStatus() : {}}
                    onCommentStatusPress={this.onCommentEvent}
                    onViewInteractUserPress={this.onViewInteractUserPress}
                    likeCallback={this.likeCallback} />
                {this.renderInternalLoading()}
            </View>
        );
    }

    componentDidMount() {
        this.requestGetEventInfo()
    }

    updateEventInfo(isMustUpdate) {
        if (isMustUpdate) {
            this.requestGetEventInfo(isMustUpdate);
        }
    }

    requestGetEventInfo(isMustUpdate = false) {
        let self = this;
        this.internalLoading.showLoading();
        let url;
        if (this.props.isAppointment) {
            url = this.getConfig().getBaseUrl() + ApiService.get_appointment_detail(this.props.eventId);
        } else {
            url = this.getConfig().getBaseUrl() + ApiService.get_event_info_details(this.props.eventId);
        }
        console.log("url = ", url);
        Networking.httpRequestGet(url, this.onEventInfoResponse.bind(this, isMustUpdate), () => {
            self.internalLoading.hideLoading();
        });
    }

    onEventInfoResponse(isMustUpdate, jsonData) {
        this.internalLoading.hideLoading();
        this.model = new EventDetailsModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {

            this.state.isCreator = this.checkCreator(this.model);
            this.setState({
                eventDetailModel: this.model,
                isCreator: this.props.isAllowEdit ? this.state.isCreator : false
            }, () => {
                if (this.props.teeCourse && !isMustUpdate) {
                    this.props.teeCourse(this.model.getListTee(), this.model.getCourse(), this.state.eventDetailModel, this.state.isCreator);
                }
            })

        } else {
            this.showErrorMsg(this.model.getErrorMsg());
        }
    }

    checkCreator(eventDetailModel) {
        return eventDetailModel.getUserCreated() === this.userId;
    }

    onUpdateEventPress() {
        if (this.props.onUpdateEventPress) {
            this.props.onUpdateEventPress();
        }
    }

    onCommentEventPress() {
        if (this.state.eventDetailModel) {
            this.props.navigation.navigate('club_event_comment_view', {
                eventDetailModel: this.state.eventDetailModel,
                statusType: this.props.isAppointment ? 5 : 2,
                likeCallback: this.onLikeCallback.bind(this)
            })
        }

    }

    onViewInteractUserPress() {
        if (this.props.onViewInteractUserPress) {
            this.props.onViewInteractUserPress();
        }
    }

    onLikeCallback({ total_feel, type }) {
        console.log('onLikeCallback', total_feel, type)
        let { eventDetailModel } = this.state;
        eventDetailModel.setPostStatus(total_feel);
        eventDetailModel.setUserStatus(type);
        this.refLikeCommentItemView.setStatus({ total_feel, type });
    }

    likeCallback({ total_feel, type }) {
        console.log('likeCallback', total_feel, type)
        let { eventDetailModel } = this.state;
        eventDetailModel.setPostStatus(total_feel);
        eventDetailModel.setUserStatus(type);
    }

}

const styles = StyleSheet.create({
    view_event_info: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff'
    },
    txt_event_name: {
        color: '#242424',
        fontSize: 18,
        fontWeight: 'bold',
        justifyContent: 'space-between',
        marginBottom: 15,
        marginRight: 10
    },
    txt_label: {
        fontSize: 15,
        color: '#858585',
        marginLeft: 5
    },
    txt_label_content: {
        fontSize: 13,
        color: '#858585',
        fontWeight: 'bold'
    },
    view_tee_time: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    line: {
        height: 1,
        marginLeft: 10,
        marginRight: 10
    },
    img_calendar: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 8
    },
    txt_title_month: {
        color: '#00ABA7',
        fontSize: 18,
        // fontWeight: 'bold'
    },
    txt_title_day: {
        color: '#2A2A2A',
        fontSize: 20,
        // fontWeight: 'bold'
    },
    view_item: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    img_icon: {
        width: scale(15),
        height: scale(15),
        resizeMode: 'contain',
        tintColor: '#858585'
    },
    img_edit: {
        width: scale(15),
        height: scale(15),
        resizeMode: 'contain',
        tintColor: '#00ABA7'
    },
    txt_edit: {
        color: '#00ABA7',
        fontSize: 11
    },
    view_edit: {
        justifyContent: 'center',
        alignItems: 'center'
    },
});