import React from 'react';
import {
    // Platform,
    StyleSheet,
    // Text,
    View,
    // ScrollView,
    // Image,
    // ImageBackground,
    BackHandler,
    // TouchableOpacity,
    Keyboard
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import HeaderView from '../../HeaderView';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
// import ImageLoad from '../../Common/ImageLoad';
// import Weather from '../../Common/WeatherInfoView';
import LikeCommentItemView from '../../Comments/LikeView';//'../../Social/Item/LikeCommentItemView';
import EventDetailsModel from '../../../Model/Events/EventDetailsModel';
// import MyView from '../../../Core/View/MyView';
// import PopupYesOrNo from '../../Common/PopupYesOrNo';
import CommentManager from '../../Comments/CommentManager';
import CommentScreen from '../../Comments/CommentScreen';
import HeaderEventComment from './HeaderEventComment';
import ComponentKeyboard from '../../Social/ComponentKeyboard';

export default class ClubEventCommentView extends BaseComponent {

    constructor(props) {
        super(props);
        let { eventDetailModel, statusType } = this.props.navigation.state.params;
        this.eventId = eventDetailModel.getId();
        this.userId = this.getUserInfo().getId();

        this.onBackPress = this.onBackPress.bind(this);
        this.comment_key = 'event';
        this.commentManager = new CommentManager();
        this.statusType = statusType;
        this.state = {
            eventDetailModel: eventDetailModel
        }

        this.likeCallback = this.likeCallback.bind(this);
        this.onViewInteractUserPress = this.onViewInteractUserPress.bind(this);
    }

    initComment() {
        if (!this.eventId) return;
        this.commentManager.init(this.comment_key, this.eventId, this.renderView.bind(this), this.handleSendComment.bind(this));
    }

    handleSendComment(message, error) {
        if (this.commentScreen) {
            message.topic = this.commentManager.generateId();
            this.commentScreen.handleSendComment(message, error);
        }
    }

    renderView(listData) {
        if (this.likeCommentView) {
            let {
                eventDetailModel
            } = this.state;
            this.likeCommentView.updateCountComment(this.commentManager.countComment);
            eventDetailModel.total_feel.comment_count = this.commentManager.countComment;
            let { likeCallback } = this.props.navigation.state.params;
            if (likeCallback) {
                likeCallback({ total_feel: eventDetailModel.total_feel, type: eventDetailModel.user_feel_status })
            }
        }
        if (this.commentScreen) {
            this.commentScreen.renderView(listData);
        }
    }

    /**
    * Ban phim an
    * @param {*} e 
    */
    _keyboardDidHide(e) {
        // this.headerEvent.show();
        this.componentKeyboard.handleKeyboard(0, false);
        // this.setState({
        //     keyboard_show: false,
        //     keyboard_height: 0
        // });
    }

    /**
     * ban phim show
     * @param {*} e 
     */
    _keyboardDidShow(e) {
        console.log("chieu cao ban phim la : ", e.endCoordinates.height);
        // this.headerEvent.hide();
        this.componentKeyboard.handleKeyboard(e.endCoordinates.height, true);
        this.commentScreen.hideListIcon();
        setTimeout(() => {
            this.commentScreen.scrollEnd();
        }, 50);
    }

    render() {
        let { eventDetailModel } = this.state;
        return (
            <View style={styles.container}>
                <HeaderView
                    title={this.t('comment')}
                    handleBackPress={this.onBackPress} />
                {/* <HeaderEventComment ref={(headerEvent) => { this.headerEvent = headerEvent; }}
                    eventDetailModel={eventDetailModel} /> */}
                <LikeCommentItemView
                    ref={(likeCommentView) => { this.likeCommentView = likeCommentView; }}
                    eventId={this.eventId}
                    stt_id={this.eventId}
                    postType={this.statusType}
                    postStatus={eventDetailModel ? eventDetailModel.getPostStatus() : {}}
                    likeCallback={this.likeCallback}
                    onViewInteractUserPress={this.onViewInteractUserPress} />
                {this.renderInternalLoading()}
                <View style={{ height: 1, backgroundColor: '#adadad', marginLeft: 5, marginRight: 5 }} />
                <CommentScreen ref={(commentScreen) => { this.commentScreen = commentScreen; }} />
                <ComponentKeyboard ref={(componentKeyboard) => { this.componentKeyboard = componentKeyboard; }} />
                {this.renderMessageBar()}
            </View>
        );
    }

    /**
     * gui comment
     * @param {*} msg 
     */
    sendComment(msg) {
        this.commentManager.sendMsg(msg);
    }

    /**
     * an header event de hien ban phim
     */
    hideHeaderView(show) {
        // this.headerEvent.change(show);
    }

    componentDidMount() {
        this.initComment();
        this.commentManager.listenForItems();
        this.commentManager.loadTotalComment();
        if (this.commentScreen) {
            this.commentScreen.sendMsgCallback = this.sendComment.bind(this);
            this.commentScreen.hideHeaderCallback = this.hideHeaderView.bind(this);
            this.commentScreen.setTypeTopic(this.eventId, this.statusType);
            this.commentScreen.updateFontCallback = this.changeFontSize.bind(this);
            // this.commentScreen.hideHeaderCallback = this.hideHeaderView.bind(this);
        }
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }

    changeFontSize(font) {
        this.commentManager.changeFontComment(font);
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
        if (this.backHandler) {
            this.backHandler.remove();
        }
        if (this.commentManager) {
            this.commentManager.offComment();
        }
        if (this.keyboardDidHideListener) this.keyboardDidHideListener.remove();
        if (this.keyboardDidShowListener) this.keyboardDidShowListener.remove();
    }

    handleHardwareBackPress() {
        let self = this;
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
            self.onBackPress();
            return true;
        });
    }

    onBackPress() {
        if (this.commentScreen && this.commentScreen.checkActionBack()) {
            return true;
        }
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
        return true;
    }

    likeCallback({ total_feel, type }) {
        this.statusType = type;
        this.state.eventDetailModel.total_feel = total_feel;
        this.state.eventDetailModel.user_feel_status = type;
        let { likeCallback } = this.props.navigation.state.params;
        if (likeCallback) {
            likeCallback({ total_feel, type })
        }
    }

    onViewInteractUserPress() {
        this.props.navigation.navigate('interactive_tab_view', {
            'flightId': this.eventId,
            'statusType': this.statusType
            // 'uid': this.uid
        })
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'//'#DADADA',
    },
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
        marginLeft: 10
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
    view_list_flight: {
        backgroundColor: '#fff',
        marginTop: 8,
        flex: 1
    },
    view_list_flight_title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10
    },
    txt_list_participants: {
        fontSize: 13,
        color: '#828282'
    },
    txt_participant: {
        fontSize: 15,
        color: '#fff',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5
    },
    txt_leave_event: {
        fontSize: 15,
        color: '#5E5E5E',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5
    },
    touchable_participant: {
        backgroundColor: '#00ABA7',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
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
        width: 15,
        height: 15,
        resizeMode: 'contain',
        tintColor: '#858585'
    },
    touchable_leave_event: {
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#5E5E5E',
        borderWidth: 1
    },
    img_edit: {
        width: 20,
        height: 20,
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
    }

});