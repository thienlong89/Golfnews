import React from 'react';
import BaseComponent from '../../../Core/View/BaseComponent';
import { View, BackHandler, StyleSheet, ScrollView, Keyboard, Dimensions } from 'react-native';
import HeaderComment from './Items/HeaderComment';
import CommentScreen from '../../Comments/CommentScreen';
import ComponentKeyboard from '../../Social/ComponentKeyboard';
import CommentManager from '../../Comments/CommentManager';
import { scale, verticalScale } from '../../../Config/RatioScale';
let { height } = Dimensions.get('window');

export default class CommentDiscussionView extends BaseComponent {
    constructor(props) {
        super(props);
        let { params } = this.props.navigation.state;
        if (params && params.data) {
            this.data = params.data;
            this.dicuss_id = this.data.getId();
        } else {
            this.data = {};
        }
        this.comment_key = "discussion_club";
        this.commentManager = new CommentManager;
        this.onBackClick = this.onBackClick.bind(this);
        this.backHandler = null;
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBackClick);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));

        this.initComment();
        this.commentManager.listenForItems();
        this.commentManager.loadTotalComment();
        if (this.commentScreen) {
            this.commentScreen.sendMsgCallback = this.sendComment.bind(this);
            // this.commentScreen.hideHeaderCallback = this.hideHeaderView.bind(this);
            this.commentScreen.setTypeTopic(this.dicuss_id, global.type_topic_comment.POST_CLUB);
            this.commentScreen.updateFontCallback = this.changeFontSize.bind(this);
        }
    }

    initComment() {
        console.log('initComment ------------------------ ', this.dicuss_id);
        if (!this.dicuss_id) return;
        let id = this.dicuss_id;

        this.commentManager.init(this.comment_key, id, this.renderView.bind(this), this.handleSendComment.bind(this));
    }

    changeFontSize(font) {
        this.commentManager.changeFontComment(font);
    }

    /**
     * send comment
     * @param {*} msg 
     */
    sendComment(msg) {
        this.commentManager.sendMsg(msg);
    }

    renderView(listData) {
        if (this.headerCommentDiscuss) {
            this.headerCommentDiscuss.updateCountComment(this.commentManager.countComment);
        }
        if (this.commentScreen) {
            this.commentScreen.renderView(listData);
        }
    }

    handleSendComment(message, error) {
        if (this.commentScreen) {
            message.topic = this.commentManager.generateId();
            this.commentScreen.handleSendComment(message, error);
        }
    }

    componentWillUnmount() {
        if (this.backHandler) this.backHandler.remove();
    }

    /**
 * Ban phim an
 * @param {*} e 
 */
    _keyboardDidHide(e) {
        // this.headerFlight.setKeyBoardShow(false);
        if (!this.commentScreen.isShowListIcon) {
            this.headerCommentDiscuss.originView();
        }
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
        // this.headerFlight.setKeyBoardShow(true);
        if (this.headerCommentDiscuss) {
            this.headerCommentDiscuss.resizeView();
        }
        if (this.componentKeyboard) {
            this.componentKeyboard.handleKeyboard(e.endCoordinates.height, true);
        }
        if (this.commentScreen) {
            this.commentScreen.hideListIcon();
            setTimeout(() => {
                this.commentScreen.scrollEnd();
            }, 50);
        }
    }

    onBackClick() {
        if(this.commentScreen && this.commentScreen.checkActionBack()){
            return true;
        }
        let { navigation } = this.props;
        if (navigation) {
            navigation.goBack();
        }
        return true;
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{ height: 30 }} />

                <HeaderComment ref={(headerCommentDiscuss) => { this.headerCommentDiscuss = headerCommentDiscuss; }}
                    data={this.data}
                    backClick={this.onBackClick} />
                <View style={styles.line} />
                <CommentScreen ref={(commentScreen) => { this.commentScreen = commentScreen; }} />
                <ComponentKeyboard ref={(componentKeyboard) => { this.componentKeyboard = componentKeyboard; }} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    line: {
        backgroundColor: '#E9E9E9',
        height: 1,
        marginRight:  scale(10),
        marginLeft: scale(10),
        marginBottom: verticalScale(7)
    },
});