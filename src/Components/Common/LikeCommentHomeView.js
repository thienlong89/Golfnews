import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    // View,
    Image,
    TouchableOpacity,
    Dimensions,
    Modal,
    TouchableWithoutFeedback
} from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import MyView from '../../Core/View/MyView';
import { View } from 'react-native-animatable';
import PopupLoveLikeStatus from './PopupLoveLikeStatus';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import { scale, fontSize } from '../../Config/RatioScale';

import ListennerCommentManager from '../Comments/ListennerCommentManager';
import CommentManager from '../Comments/CommentManager';
import TextCountComment from '../Social/Item/TextCountComment';

const width = Dimensions.get("window").width;
const COLOR_STATUS = ['#555555', '#00ABA7', '#D1403F', '#005B59'];

export default class LikeCommentHomeView extends BaseComponent {

    static defaultProps = {
        postStatus: {},
        flight_id: '',
        bgColor: '#fff',
        showImgComment: false,
        isDisable: false,
        data: null
    }

    constructor(props) {
        super(props);
        this.sourceStatus = [this.getResources().ic_like, this.getResources().ic_like, this.getResources().ic_heart, this.getResources().ic_dislike];
        this.txtStatus = [this.t('like'), this.t('like'), this.t('love'), this.t('dislike')];
        let { like_count, love_count, unlike_count, comment_count, total_count, myStatus, img_upload_count } = this.props.postStatus;
        this.like_count = like_count || 0;
        this.love_count = love_count || 0;
        this.unlike_count = unlike_count || 0;
        this.comment_count = comment_count || 0;
        this.total_count = total_count || 0;
        this.myStatus = myStatus || 0;
        this.img_upload_count = img_upload_count || 0;
        this.state = {
            statusType: this.myStatus, // 0: invalid, 1: like, 2: love, 3: dislike,
            total_count: total_count,
            comment_count: comment_count,
            love_count: love_count,
            like_count: like_count,
            unlike_count: unlike_count,
            img_upload_count: img_upload_count
        }

        this.onLikePress = this.onLikePress.bind(this);
        this.onViewInteractUserPress = this.onViewInteractUserPress.bind(this);
        this.onCommentClick = this.onCommentClick.bind(this);
        this.onSetHeartClick = this.onSetHeartClick.bind(this);
        this.onSetLikeClick = this.onSetLikeClick.bind(this);
        this.onSetDislikeClick = this.onSetDislikeClick.bind(this);
        this.onOpenOtherPress = this.onOpenOtherPress.bind(this);
        this.onLikeLongPress = this.onLikeLongPress.bind(this);

        let { flight_id } = this.props;
        // [typeof(CommentManager)]
        this.commentManager = null;
        if (flight_id) {
            let key_comment = 'flight-' + flight_id;
            this.commentManager = ListennerCommentManager.getListennerComment(key_comment);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextProps.postStatus) != JSON.stringify(this.props.postStatus)
            || nextState.statusType != this.state.statusType
            || nextState.img_upload_count != this.state.img_upload_count
            || nextState.comment_count != this.state.comment_count
            || nextProps.isDisable != this.props.postStatus;
    }

    componentDidMount() {
        let { flight_id, isDisable } = this.props;
        if (isDisable) return;
        if (this.commentManager && flight_id) {
            this.commentManager.create('flight', flight_id);
            this.commentManager.setRenderUpdateBagdeComment(this.renderBagde.bind(this));
            this.commentManager.loadMessanger();
            console.log('........................ componentDidMount, dang ky nhan comment');
        }
    }

    renderBagde() {
        if (this.refTextComment) {
            this.refTextComment.setTextBold();
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let { like_count, love_count, unlike_count, comment_count, total_count, myStatus, img_upload_count } = nextProps.postStatus;
        this.like_count = like_count || 0;
        this.love_count = love_count || 0;
        this.unlike_count = unlike_count || 0;
        this.comment_count = comment_count || 0;
        this.total_count = total_count || 0;
        this.myStatus = myStatus || 0;
        this.img_upload_count = img_upload_count || 0
        if (myStatus !== prevState.statusType) {
            return {
                statusType: myStatus,
                total_count: total_count,
                comment_count: comment_count,
                love_count: love_count,
                like_count: like_count,
                unlike_count: unlike_count,
                img_upload_count: img_upload_count
            };
        }
        else return null;
    }

    render() {
        let {
            statusType,
            total_count,
            comment_count,
            love_count,
            like_count,
            unlike_count,
            img_upload_count
        } = this.state;
        let { bgColor, showImgComment, isDisable } = this.props;
        let hide = !total_count && comment_count;
        let heart = love_count && love_count != 0;
        let like = like_count && like_count != 0;
        let dislike = unlike_count && unlike_count != 0;

        return <View style={[styles.container, { backgroundColor: bgColor, opacity: 1 }]}>
            <Image
                style={styles.img_dash_line}
                source={this.getResources().ic_dash_line}
            />
            <TouchableWithoutFeedback onPress={isDisable ? this.onOpenOtherPress : this.onCommentClick}>
                <View style={styles.view_container}>
                    <View style={styles.view_like_container}>
                        <TouchableOpacity onPress={this.onLikePress}
                            onLongPress={this.onLikeLongPress}
                            disabled={isDisable}
                            style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 5 }}>
                            <View style={styles.view_like_btn}>
                                <Image
                                    style={[styles.icon_like, { tintColor: COLOR_STATUS[statusType] }]}
                                    source={this.sourceStatus[statusType]}
                                />
                                <Text allowFontScaling={global.isScaleFont} style={[styles.txt_like, { color: COLOR_STATUS[statusType] }]}>
                                    {this.txtStatus[statusType]}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.onViewInteractUserPress}
                            disabled={isDisable}>
                            <MyView hide={false}
                                style={[styles.view_like_group, { flex: 1 }]} >
                                <View style={styles.horizontal_line} />
                                <View style={[styles.view_like_group, { height: 24 }]}>
                                    <MyView hide={!heart}
                                        style={[styles.view_heart]}>
                                        <Image
                                            style={styles.icon_heart}
                                            source={this.getResources().ic_group_heart}
                                        />
                                    </MyView>
                                    <MyView hide={!like}
                                        style={[styles.view_like, heart ? { left: 18 } : {}]}>
                                        <Image
                                            style={styles.icon_heart}
                                            source={this.getResources().ic_group_like}
                                        />
                                    </MyView>
                                    <MyView hide={!dislike}
                                        style={[styles.view_dislike, heart && like ? { left: 38 } : (heart || like) ? { left: 18 } : {}]}>
                                        <Image
                                            style={styles.icon_heart}
                                            source={this.getResources().ic_group_dislike}
                                        />
                                    </MyView>

                                    <Text allowFontScaling={global.isScaleFont} style={[styles.txt_comment, {
                                        marginLeft: heart && like && dislike ? 64 :
                                            (heart && like || heart && dislike || dislike && like) ? 44 : (heart || like || dislike) ? 25 : 0
                                    }]}>
                                        {total_count || ''}
                                    </Text>
                                </View>

                            </MyView>
                        </TouchableOpacity>
                    </View>

                    <MyView hide={!showImgComment || img_upload_count === 0} style={styles.view_center}>
                        <Image
                            style={styles.img_upload}
                            source={this.getResources().ic_picture_blue} />
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_img_upload}>{img_upload_count}</Text>
                    </MyView>

                    <TouchableOpacity onPress={this.onCommentClick}
                        style={{ justifyContent: 'center', flex: 1, alignItems: 'flex-end' }}
                        disabled={isDisable}>
                        <View style={styles.view_comment_container}>
                            <Image
                                source={this.getResources().ic_comment}
                                style={styles.img_comment}
                            />
                            <TextCountComment ref={(refTextComment) => { this.refTextComment = refTextComment; }}
                             showText={true}
                              style={styles.txt_comment}
                              commentNumber={this.comment_count} />
                            {/* <Text allowFontScaling={global.isScaleFont} style={styles.txt_comment}>{this.comment_count > 0 ? `${this.comment_count} ${this.t('comment')}` : this.t('comment')}</Text> */}
                        </View>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
            <PopupLoveLikeStatus
                ref={(refPopupLoveLikeStatus) => { this.refPopupLoveLikeStatus = refPopupLoveLikeStatus }}
                onSetHeartClick={this.onSetHeartClick}
                onSetLikeClick={this.onSetLikeClick}
                onSetDislikeClick={this.onSetDislikeClick} />

        </View>
    }

    setStatus({ total_feel, type }) {
        console.log('setStatus', total_feel, type)
        this.like_count = parseInt(total_feel.like_count);
        this.love_count = parseInt(total_feel.love_count);
        this.unlike_count = parseInt(total_feel.unlike_count);
        this.comment_count = parseInt(total_feel.comment_count);
        this.img_upload_count = total_feel.img_upload_count;
        this.myStatus = type;
        this.total_count = this.like_count + this.love_count + this.unlike_count;
        this.setState({
            statusType: type,
            total_count: this.total_count,
            comment_count: this.comment_count,
            love_count: this.love_count,
            like_count: this.like_count,
            unlike_count: this.unlike_count,
            img_upload_count: this.img_upload_count
        }, () => {
            if (this.refTextComment) {
                this.refTextComment.updateCommentNumber(this.comment_count);
            }
        })
    }

    onOpenOtherPress() {
        if (this.props.onOpenOtherPress) {
            this.props.onOpenOtherPress(this.props.data);
        }
    }

    onLikePress() {
        // this.updateCount(this.state.statusType === 0 ? 1 : 0);
        // this.setState({
        //     statusType: this.state.statusType === 0 ? 1 : 0
        // }, () => {
        //     this.requestLikeStatus(this.state.statusType);
        // })
        if (global.isVipAccount) {
            this.requestLikeStatus(this.state.statusType === 0 ? 1 : 0);
        } else {
            this.onCommentClick();
        }

    }

    onLikeLongPress(event) {
        if (global.isVipAccount) {
            let object = {};
            object.locationX = event.nativeEvent.locationX;
            object.locationY = event.nativeEvent.locationY;
            object.pageY = event.nativeEvent.pageY;
            object.pageX = event.nativeEvent.pageX;
            object.target = event.nativeEvent.target;
            console.log(JSON.stringify(object));
            this.refPopupLoveLikeStatus.setVisible(true, object.pageY);
        } else {
            this.onCommentClick();
        }

    }

    onSetHeartClick() {
        // this.updateCount(2);
        // this.setState({
        //     statusType: 2
        // }, () => {
        //     this.requestLikeStatus(2);
        // })
        this.requestLikeStatus(2);
    }

    onSetLikeClick() {
        // this.updateCount(1);
        // this.setState({
        //     statusType: 1
        // }, () => {
        //     this.requestLikeStatus(1);
        // })
        this.requestLikeStatus(1);
    }

    onSetDislikeClick() {
        // this.updateCount(3);
        // this.setState({
        //     statusType: 3
        // }, () => {
        //     this.requestLikeStatus(3);
        // })
        this.requestLikeStatus(3);
    }

    onCommentClick() {
        if (this.refTextComment) {
            this.refTextComment.setTextNormal();
        }
        if (this.props.onCommentClick) {
            this.props.onCommentClick();
        }
    }

    onViewInteractUserPress() {
        if (global.isVipAccount) {
            if (this.props.onViewInteractUserPress) {
                this.props.onViewInteractUserPress();
            }
        } else {
            this.onCommentClick();
        }

    }

    requestLikeStatus(type = 0) {
        let { flight_id } = this.props;
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.like_status(flight_id, type);
        console.log('url', url);
        Networking.httpRequestGet(url, this.onRequestLikeStatusResponse.bind(this, type), () => {

        });
    }

    onRequestLikeStatusResponse(type, jsonData) {
        console.log('onRequestLikeStatusResponse', jsonData)
        if (jsonData.error_code === 0) {
            let total_feel = jsonData.data.total_feel;
            this.like_count = parseInt(total_feel.like_count);
            this.love_count = parseInt(total_feel.love_count);
            this.unlike_count = parseInt(total_feel.unlike_count);
            this.comment_count = parseInt(total_feel.comment_count);
            this.img_upload_count = total_feel.img_upload_count;
            total_feel.myStatus = type;
            this.myStatus = type;
            this.total_count = this.like_count + this.love_count + this.unlike_count;
            this.setState({
                statusType: type,
                total_count: this.total_count,
                comment_count: this.comment_count,
                love_count: this.love_count,
                like_count: this.like_count,
                unlike_count: this.unlike_count,
                img_upload_count: this.img_upload_count
            }, () => {
                if (this.props.likeCallback) {
                    this.props.likeCallback({ total_feel, type })
                }
            })
        }
    }

    updateCount(type = 0) {
        switch (type) {
            case 0: {
                this.updateCurrentCount();
                break;
            }
            case 1: {
                this.updateCurrentCount();
                if (this.myStatus != 1) {
                    this.like_count++;
                }
                break;
            }
            case 2: {
                this.updateCurrentCount();
                if (this.love_count != 2) {
                    this.love_count++;
                }
                break;
            }
            case 3: {
                this.updateCurrentCount();
                if (this.unlike_count != 3) {
                    this.unlike_count++;
                }
                break;
            }
        }
        this.myStatus = type;
        this.total_count = this.like_count + this.love_count + this.unlike_count;
    }

    updateCurrentCount() {
        if (this.myStatus === 1) {
            this.like_count--;
        } else if (this.myStatus === 2) {
            this.love_count--;
        } else if (this.myStatus === 3) {
            this.unlike_count--;
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    view_container: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingRight: 10,
    },
    view_like_container: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    view_comment_container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    view_like_btn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon_like: {
        width: scale(16),
        height: scale(16),
        resizeMode: 'contain',
        marginRight: 4
    },
    txt_like: {
        fontSize: 12
    },
    horizontal_line: {
        height: 15,
        width: 1,
        backgroundColor: '#C7C7C7',
        marginRight: 5
    },
    view_like_group: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon_heart: {
        width: 23,
        height: 23,
        resizeMode: 'contain'
    },
    img_comment: {
        width: 17,
        height: 17,
        resizeMode: 'contain',
        marginRight: 5
    },
    txt_comment: {
        color: '#555555',
        fontSize: fontSize(12, -scale(2))
    },
    view_heart: {
        position: 'absolute',
        zIndex: 3,
        width: 23,
    },
    view_like: {
        position: 'absolute',
        zIndex: 2,
        width: 23,
    },
    view_dislike: {
        position: 'absolute',
        zIndex: 1,
        width: 23,
    },
    img_dash_line: {
        width: width,
        height: 2,
        resizeMode: 'contain',
    },
    view_like_popup_group: {
        height: 45,
        width: 150,
        borderRadius: 25,
        backgroundColor: '#fff',
        flexDirection: 'row',
        marginLeft: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 5,
        paddingRight: 5,
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: -3,
        },
        elevation: 4,
    },
    img_icon_popup: {
        height: 40,
        width: 40,
        resizeMode: 'contain',
    },
    view_center: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1
    },
    img_upload: {
        width: scale(15),
        height: scale(15),
        resizeMode: 'contain',
        tintColor: '#555555'
    },
    txt_img_upload: {
        fontSize: fontSize(12),
        color: '#555555',
        marginLeft: scale(5)
    }
});