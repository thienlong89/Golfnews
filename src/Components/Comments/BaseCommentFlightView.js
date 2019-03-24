import React from 'react';
import { View, StyleSheet, BackHandler, Keyboard } from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import LikeCommentHomeView from './LikeView';
import CommentScreen from './CommentScreen';
import ComponentKeyboard from '../Social/ComponentKeyboard';
import CommentManager from './CommentManager';
import ListennerCommentManager from './ListennerCommentManager';

/**
 * class hiển thị comment
 */
export default class BaseCommentFlightView extends BaseComponent {
    constructor(props) {
        super(props);
        this.backHandler = null;

        this.flight = this.props.navigation.state.params.flight;
        this.uid = this.getUserInfo().getId();
        this.userProfile = this.getUserInfo().getUserProfile();
        try {
            this.flightId = this.flight.getFlightId();
        } catch (error) {
            this.flightId = this.flight.getId();
        }
        this.comment_key = "flight";
        // this.commentManager = new CommentManager;
        this.commentManager = ListennerCommentManager.getListennerComment(this.comment_key + '-' + this.flightId);
        this.state = {
            flightComment: '',
            isShowInteractive: false,
            keyboard_height: 0,
            keyboard_show: false,
            imgStatusList: [],
            existMe: false,
            isDataLoaded: false
        }

        this.onBackClick = this.onBackClick.bind(this);
        this.onLikeCallback = this.onLikeCallback.bind(this);
        this.onViewInteractUserPress = this.onViewInteractUserPress.bind(this);
    }

    /**
     * Khoi tao tham so comment
     */

    initComment() {
        console.log('initComment ------------------------ ', this.flightId);
        if (!this.flightId) return;
        let id = this.flightId;

        this.commentManager.init(this.comment_key, id, this.renderView.bind(this), this.handleSendComment.bind(this));
    }

    handleSendComment(message, error) {
        if (this.commentScreen) {
            message.topic = this.commentManager.generateId();
            this.commentScreen.handleSendComment(message, error);
        }
        if (!error) {
            let count = this.commentManager.countComment;
            if (this.flight.total_feel) {
                this.flight.total_feel.comment_count = count
            }
            console.log('countttttttttttttttttt', count)
            this.likeCommentItemView.updateCountComment(count);
        }
    }

    // getFlightComment() {
    //     if (this.internalLoading)
    //         this.internalLoading.showLoading();
    //     let self = this;
    //     let url = this.getConfig().getBaseUrl() + ApiService.view_detail_status_for_flight(this.flightId);
    //     console.log('url', url);
    //     Networking.httpRequestGet(url,
    //         (jsonData) => {
    //             if (self.internalLoading)
    //                 self.internalLoading.hideLoading();

    //             if (jsonData.error_code === 0) {
    //                 let flight = new FlightSummaryModel();
    //                 flight.parseData(jsonData.data);
    //                 let existMe = flight.getUserRounds().findIndex((user) => {
    //                     console.log('user.user_id', user.user_id)
    //                     return this.getAppUtil().replaceUser(user.user_id) === this.uid;
    //                 });
    //                 console.log('existMe', existMe)
    //                 this.setState({
    //                     flightComment: flight,
    //                     imgStatusList: flight.getListImgUploadStatus(),
    //                     existMe: existMe !== -1,
    //                     isDataLoaded: true
    //                 })
    //             } else {
    //                 self.showErrorMsg(jsonData.error_msg);
    //             }
    //             // console.log('getFlightComment', jsonData)
    //         }, () => {
    //             //time out
    //             if (self.internalLoading)
    //                 self.internalLoading.hideLoading();
    //             self.showErrorMsg(self.t('time_out'));
    //         });
    // }

    changeFontSize(font) {
        this.commentManager.changeFontComment(font);
    }

    /**
    * Ban phim an
    * @param {*} e 
    */
    _keyboardDidHide(e) {
        // this.headerFlight.setKeyBoardShow(false);
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
        console.log("chieu cao ban phim la 222 : ", e.endCoordinates.height);
        // this.headerFlight.setKeyBoardShow(true);
        if (this.componentKeyboard) this.componentKeyboard.handleKeyboard(e.endCoordinates.height, true);
        this.commentScreen.hideListIcon();
        setTimeout(() => {
            this.commentScreen.scrollEnd();
        }, 50);
    }

    /**
     * send comment
     * @param {*} msg 
     */
    sendComment(msg) {
        this.commentManager.sendMsg(msg);
    }

    renderView(listData) {
        if (this.likeCommentItemView) {
            let count = this.commentManager.countComment;
            if (this.flight.total_feel) {
                this.flight.total_feel.comment_count = count
            }
            console.log('countttttttttttttttttt', count)
            this.likeCommentItemView.updateCountComment(count);
            let postStatus = this.flight.getPostStatus();
            postStatus.comment_count = count;
        }
        if (this.commentScreen) {
            this.commentScreen.renderView(listData);
        }
    }

    onBackClick() {

        if (this.commentScreen && this.commentScreen.checkActionBack()) {
            return true;
        }
        let { navigation } = this.props;
        if (navigation) {
            navigation.goBack();
        }
        if (this.props.navigation.state.params.onCommentBack) {
            this.props.navigation.state.params.onCommentBack(this.flight);
        }

        return true;
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBackClick);
        // this.getFlightComment();
        this.initComment();
        this.commentManager.listenForItems();
        // this.commentManager.loadTotalComment();
        if (this.commentScreen) {
            this.commentScreen.sendMsgCallback = this.sendComment.bind(this);
            // this.commentScreen.hideHeaderCallback = this.hideHeaderView.bind(this);
            this.commentScreen.setTypeTopic(this.flightId, global.type_topic_comment.FLIGHT);
            this.commentScreen.updateFontCallback = this.changeFontSize.bind(this);

            this.commentScreen.renderView(this.commentManager.listComments);
        }
        if (this.likeCommentItemView) {
            let count = this.commentManager.countComment;
            this.likeCommentItemView.updateCountComment(count);
        }

        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }

    componentWillUnmount() {
        if (this.backHandler) this.backHandler.remove();
        // if (this.commentManager) {
        //     this.commentManager.offComment();
        // }
        if (this.keyboardDidHideListener) this.keyboardDidHideListener.remove();
        if (this.keyboardDidShowListener) this.keyboardDidShowListener.remove();
    }

    onViewInteractUserPress() {
        // this.setState({
        //     isShowInteractive: true
        // }, () => {
        //     if (this.refDrawerView)
        //         this.refDrawerView.slideUp();
        // })
        // let navigation = StaticProps.getAppSceneNavigator();
        let { navigation } = this.props;
        if (navigation) {
            navigation.navigate('interactive_tab_view', {
                'flightId': this.flightId,
                'uid': this.uid,
                'statusType': 1
            })
        }
    }

    onLikeCallback({ total_feel, type }) {
        this.flight.setPostStatus(total_feel);
        this.flight.setUserStatus(type);
        // updateFlight(round);
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderView title={this.t('comment')} handleBackPress={this.onBackClick} />
                <LikeCommentHomeView
                    ref={(likeCommentItemView) => { this.likeCommentItemView = likeCommentItemView; }}
                    flightId={this.flightId}
                    stt_id={this.flightId}
                    postStatus={this.flight.getPostStatus()}
                    user_feel_status={this.flight.getUserStatus()}
                    postType={1}
                    isDisable={true}
                    onViewInteractUserPress={this.onViewInteractUserPress}
                    likeCallback={this.onLikeCallback} />

                <View style={styles.line} />
                <CommentScreen ref={(commentScreen) => { this.commentScreen = commentScreen; }} />
                <ComponentKeyboard ref={(componentKeyboard) => { this.componentKeyboard = componentKeyboard; }} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    line: {
        backgroundColor: '#E9E9E9',
        height: 1,
        // marginRight: 10,
        // marginLeft: 10,
        // marginBottom: 10
    },
});