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
import TournamentModel from '../../../Model/Events/TournamentModel';
import LikeCommentItemView from '../../Social/Item/LikeCommentItemView';
import { scale } from '../../../Config/RatioScale';

export default class TournamentInfoView extends BaseComponent {

    static defaultProps = {
        eventId: '',
        isAppointment: false,
        tournamentId: ''
    }

    constructor(props) {
        super(props);

        this.userId = this.getUserInfo().getId();
        this.state = {
            tournamentModel: null,
        }

        this.onViewInteractUserPress = this.onViewInteractUserPress.bind(this);
        this.onCommentEvent = this.onCommentEventPress.bind(this);
        this.likeCallback = this.likeCallback.bind(this);
    }

    render() {
        let { tournamentModel } = this.state;
        let { tournamentId } = this.props;

        console.log('tournamentModel.render', tournamentModel)
        let month = tournamentModel ? tournamentModel.month : '';
        let day = tournamentModel ? tournamentModel.day : '';
        let eventName = tournamentModel ? tournamentModel.name : '';
        let creator = tournamentModel ? tournamentModel.user_created : '';
        let teeTime = tournamentModel ? tournamentModel.tee_time_display : '';
        let courseName = tournamentModel ? tournamentModel.facility_name : '';
        let facilityId = tournamentModel ? tournamentModel.facility_id : '';
        let tee_time = tournamentModel ? tournamentModel.date_played_display : '';
        let numberGolfer = tournamentModel ? tournamentModel.total_member : '';
        let fees = tournamentModel ? this.getAppUtil().formatMoney(tournamentModel.fees) : '';

        return (
            <View style={{ justifyContent: 'space-between', backgroundColor: 'red' }}>
                <View style={styles.view_event_info}>
                    <View style={{ justifyContent: 'space-between' }}>
                        <ImageBackground style={styles.img_calendar}
                            source={this.getResources().ic_calendar}
                            imageStyle={{ resizeMode: 'contain' }}
                            resizeMethod={'resize'}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_month}>{month}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_day}>{day}</Text>
                        </ImageBackground>

                        {/* <MyView hide={!isCreator}>
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
                        </MyView> */}

                    </View>

                    <View style={{ marginLeft: 10, marginRight: 10, flex: 1 }}>
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
                            <Text allowFontScaling={global.isScaleFont} style={[styles.txt_label, {flex: 1}]}>
                                {`${this.t('san')}: `}
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_label_content} numberOfLines={1}>{courseName}</Text>
                            </Text>
                        </View>

                        <View style={[styles.view_tee_time, { marginBottom: 5 }]}>
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

                        <View style={[styles.view_item, { marginBottom: 5 }]}>
                            <Image
                                style={styles.img_icon}
                                source={this.getResources().cactranbanbe} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_label}>
                                {`${this.t('number_of_golfers')}: `}
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_label_content}>{numberGolfer}</Text>
                            </Text>
                        </View>

                        <View style={[styles.view_item, { marginBottom: 5 }]}>
                            <Image
                                style={styles.img_icon}
                                source={this.getResources().ic_fees} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_label}>
                                {`${this.t('fees')}: `}
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_label_content}>{`${fees} VNĐ`}</Text>
                            </Text>
                        </View>
                    </View>


                </View>
                {/* <LikeCommentItemView
                    ref={(refLikeCommentItemView) => { this.refLikeCommentItemView = refLikeCommentItemView }}
                    eventId={tournamentId}
                    stt_id={tournamentId}
                    // postType={isAppointment ? 5 : 2}
                    postStatus={tournamentModel && tournamentModel.getPostStatus() ? tournamentModel.getPostStatus() : {}}
                    onCommentStatusPress={this.onCommentEvent}
                    onViewInteractUserPress={this.onViewInteractUserPress}
                    likeCallback={this.likeCallback} /> */}
                {this.renderInternalLoading()}
            </View>
        );
    }

    componentDidMount() {
        this.requestGetEventInfo()
    }

    requestGetEventInfo(isMustUpdate = false) {
        let self = this;
        this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.tournament_view_details(this.props.tournamentId);

        console.log("url = ", url);
        Networking.httpRequestGet(url, this.onTournamentInfoResponse.bind(this, isMustUpdate), () => {
            self.internalLoading.hideLoading();
        });
    }

    onTournamentInfoResponse(isMustUpdate, jsonData) {
        this.internalLoading.hideLoading();
        this.model = new TournamentModel();
        this.model.parseData(jsonData.data);
        if (jsonData.error_code === 0) {
            console.log("onTournamentInfoResponse", this.model);
            this.setState({
                tournamentModel: this.model,
            }, () => {
                if (this.props.ruleTourCallback) {
                    this.props.ruleTourCallback(this.model.getRules_tour());
                }
            })

        } else {
            this.showErrorMsg(jsonData.error_msg);
        }
    }

    onCommentEventPress() {
        if (this.state.tournamentModel) {
            this.props.navigation.navigate('club_event_comment_view', {
                tournamentModel: this.state.tournamentModel,
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
        let { tournamentModel } = this.state;
        tournamentModel.setPostStatus(total_feel);
        tournamentModel.setUserStatus(type);
        this.refLikeCommentItemView.setStatus({ total_feel, type });
    }

    likeCallback({ total_feel, type }) {
        console.log('likeCallback', total_feel, type)
        let { tournamentModel } = this.state;
        tournamentModel.setPostStatus(total_feel);
        tournamentModel.setUserStatus(type);
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
        fontWeight: 'bold',
        flex: 1
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
        alignItems: 'center',
        flex: 1
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