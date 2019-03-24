import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import MyView from '../../../Core/View/MyView';
import PopupLoveLikeStatus from '../../Common/PopupLoveLikeStatus';
import CommentCountView from './TextCountComment';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import { scale } from '../../../Config/RatioScale';
import PopupUpgradeVip from '../../Common/PopupUpgradeVip';
import StaticProps from '../../../Constant/PropsStatic';

const width = Dimensions.get("window").width;
const COLOR_STATUS = ['#555555', '#00ABA7', '#D1403F', '#005B59'];

export default class LikeCommentItemView extends BaseComponent {

    static defaultProps = {
        postStatus: {},
        flightId: '',
        eventId: '',
        stt_id: '',
        postType: ''
    }

    constructor(props) {
        super(props);

        this.isVip = global.isVipAccount;
        this.sourceStatus = [this.getResources().ic_like, this.getResources().ic_like, this.getResources().ic_heart, this.getResources().ic_dislike];
        this.txtStatus = [this.t('like'), this.t('like'), this.t('love'), this.t('dislike')];

        let { like_count, love_count, unlike_count, comment_count, total_count, myStatus } = this.props.postStatus;

        this.like_count = like_count || 0;
        this.love_count = love_count || 0;
        this.unlike_count = unlike_count || 0;
        this.comment_count = comment_count || 0;
        this.total_count = total_count || 0;
        this.myStatus = myStatus || 0;
        this.state = {
            statusType: this.myStatus, // 0: invalid, 1: like, 2: love, 3: dislike,
            total_count: total_count,
            comment_count: comment_count,
            love_count: love_count,
            like_count: like_count,
            unlike_count: unlike_count
        }

        this.onLikeStatusPress = this.onLikeStatusPress.bind(this);
        this.onViewInteractUserPress = this.onViewInteractUserPress.bind(this);
        this.onSetHeartClick = this.onSetHeartClick.bind(this);
        this.onSetLikeClick = this.onSetLikeClick.bind(this);
        this.onSetDislikeClick = this.onSetDislikeClick.bind(this);
        this.onCommentStatusPress = this.onCommentStatusPress.bind(this);
        this.onConfirmUpgrade = this.onConfirmUpgrade.bind(this);
    }

    /**
     * Update so luong comment
     * @param {*} count 
     */
    updateCountComment(count) {
        if (this.commentCountView) {
            this.commentCountView.updateCommentNumber(count);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log('shouldComponentUpdate1', JSON.stringify(nextProps.finishedFlight))
        // console.log('shouldComponentUpdate2', JSON.stringify(this.props.finishedFlight))

        return JSON.stringify(nextProps.postStatus) != JSON.stringify(this.props.postStatus)
            || nextState.statusType != this.state.statusType
            || nextState.comment_count != this.state.comment_count;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let { like_count, love_count, unlike_count, comment_count, total_count, myStatus } = nextProps.postStatus;
        this.like_count = like_count || 0;
        this.love_count = love_count || 0;
        this.unlike_count = unlike_count || 0;
        this.comment_count = comment_count || 0;
        this.total_count = total_count || 0;
        this.myStatus = myStatus || 0;

        if (myStatus !== prevState.statusType) {
            return {
                statusType: myStatus,
                total_count: total_count,
                comment_count: comment_count,
                love_count: love_count,
                like_count: like_count,
                unlike_count: unlike_count
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
            unlike_count
        } = this.state;
        let hideCount = (!total_count && comment_count) || 0;
        let heart = (love_count && love_count != 0) || 0;
        let like = (like_count && like_count != 0) || 0;
        let dislike = (unlike_count && unlike_count != 0) || 0;
        statusType = statusType || 0;



        return (
            <View style={styles.container}>
                <MyView hide={hideCount} style={styles.view_count_group}>
                    <TouchableOpacity onPress={this.onViewInteractUserPress}>
                        <View style={styles.view_like_group}>
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
                    </TouchableOpacity>

                    {/* <CommentCountView
                        ref={(commentCountView) => { this.commentCountView = commentCountView; }}
                        style={styles.txt_comment}
                        commentNumber={comment_count} /> */}
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_comment}>{comment_count > 0 ? `${comment_count} ${this.t('comment')}` : ''}</Text>
                </MyView>

                <View style={styles.line} />

                <View style={styles.view_like_comment}>
                    <TouchableOpacity style={styles.view_like_btn}
                        onLongPress={(event) => this.onLikeLongPress(event)}
                        onPress={this.onLikeStatusPress}>
                        <View style={styles.view_like_btn}>
                            <Image
                                style={[styles.icon_like, { tintColor: this.getColorStatus()[statusType] }]}
                                source={this.getResourceStatus()[statusType]}
                            />
                            <Text allowFontScaling={global.isScaleFont} style={[styles.txt_like, { color: this.getColorStatus()[statusType] }]}>
                                {this.getTxtStatus()[statusType]}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.view_comment}
                        onPress={this.onCommentStatusPress}>
                        <View style={styles.view_comment}>
                            <Image
                                source={this.getResources().ic_comment}
                                style={styles.img_comment}
                            />
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_comment}>{this.t('comment')}</Text>
                        </View>
                    </TouchableOpacity>

                </View>

                <PopupLoveLikeStatus
                    ref={(refPopupLoveLikeStatus) => { this.refPopupLoveLikeStatus = refPopupLoveLikeStatus }}
                    onSetHeartClick={this.onSetHeartClick}
                    onSetLikeClick={this.onSetLikeClick}
                    onSetDislikeClick={this.onSetDislikeClick} />

                <PopupUpgradeVip
                    ref={(popupUpdateVip) => { this.popupUpdateVip = popupUpdateVip; }}
                    onConfirmClick={this.onConfirmUpgrade} />
            </View>
        );
    }

    setStatus({ total_feel, type }) {
        this.like_count = parseInt(total_feel.like_count);
        this.love_count = parseInt(total_feel.love_count);
        this.unlike_count = parseInt(total_feel.unlike_count);
        this.comment_count = parseInt(total_feel.comment_count);
        console.log('setStatus', total_feel)
        this.myStatus = type;
        this.total_count = this.like_count + this.love_count + this.unlike_count;
        this.setState({
            statusType: type,
            total_count: this.total_count,
            comment_count: this.comment_count,
            love_count: this.love_count,
            like_count: this.like_count,
            unlike_count: this.unlike_count
        }, () => {

        })
    }

    onViewInteractUserPress() {
        console.log('onViewInteractUserPress')
        if (this.isVip) {
            if (this.props.onViewInteractUserPress) {
                this.props.onViewInteractUserPress();
            }
        } else {
            this.popupUpdateVip.show();
        }

    }

    onLikeStatusPress() {
        // let { statusType } = this.state;

        // this.updateCount(statusType === 0 ? 1 : 0);
        // this.setState({
        //     statusType: statusType === 0 ? 1 : 0
        // }, () => {
        //     this.requestLikeStatus(this.state.statusType);
        // })
        if (this.isVip) {
            this.requestLikeStatus(this.state.statusType === 0 ? 1 : 0);
        } else {
            this.popupUpdateVip.show();
        }

    }

    onLikeLongPress(event) {
        console.log('onLikeLongPress');
        if (this.isVip) {
            let object = {};
            object.locationX = event.nativeEvent.locationX;
            object.locationY = event.nativeEvent.locationY;
            object.pageY = event.nativeEvent.pageY;
            object.pageX = event.nativeEvent.pageX;
            object.target = event.nativeEvent.target;
            this.refPopupLoveLikeStatus.setVisible(true, object.pageY);
        } else {
            this.popupUpdateVip.show();
        }

    }

    onCommentStatusPress() {
        if (this.isVip) {
            if (this.props.onCommentStatusPress) {
                this.props.onCommentStatusPress();
            }
        } else {
            this.popupUpdateVip.show();
        }
        
    }

    onSetHeartClick() {
        // this.updateCount(2);
        // this.setState({
        //     statusType: 2
        // }, () => {
        //     this.requestLikeStatus(this.state.statusType);
        // })
        this.requestLikeStatus(2);
    }

    onSetLikeClick() {
        // this.updateCount(1);
        // this.setState({
        //     statusType: 1
        // }, () => {
        //     this.requestLikeStatus(this.state.statusType);
        // })
        this.requestLikeStatus(1);
    }

    onSetDislikeClick() {
        // this.updateCount(3);
        // this.setState({
        //     statusType: 3
        // }, () => {
        //     this.requestLikeStatus(this.state.statusType);
        // })
        this.requestLikeStatus(3);
    }

    requestLikeStatus(type = 0) {
        let { stt_id, postType } = this.props;
        let self = this;
        // let url = this.getConfig().getBaseUrl() + ApiService.like_status(flight_id, type);
        let url = this.getConfig().getBaseUrl() + ApiService.like_status(stt_id, type, postType);
        console.log('url', url);
        Networking.httpRequestGet(url, this.onRequestLikeStatusResponse.bind(this, type), () => {

        });
    }

    onRequestLikeStatusResponse(type, jsonData) {
        if (jsonData.error_code === 0) {
            let total_feel = jsonData.data.total_feel;
            this.like_count = parseInt(total_feel.like_count);
            this.love_count = parseInt(total_feel.love_count);
            this.unlike_count = parseInt(total_feel.unlike_count);
            this.comment_count = parseInt(total_feel.comment_count);
            this.myStatus = type;
            this.total_count = this.like_count + this.love_count + this.unlike_count;
            total_feel.myStatus = this.myStatus;
            total_feel.total_count = this.total_count;
            this.setState({
                statusType: type,
                total_count: this.total_count,
                comment_count: this.comment_count,
                love_count: this.love_count,
                like_count: this.like_count,
                unlike_count: this.unlike_count
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

    onConfirmUpgrade() {
        let navigation = StaticProps.getAppSceneNavigator();
        if (navigation) {
            navigation.navigate('benefits_vip_member',
                {
                    onUpgradeCallback: this.onUpgradeCallback.bind(this),
                });
        }
    }

    onUpgradeCallback(isSuccess = false) {
        if (isSuccess) {
            this.isVip = 1;
            this.setState({})
        }
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    view_count_group: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
    txt_comment: {
        color: '#555555',
        fontSize: 13
    },
    line: {
        backgroundColor: '#E9E9E9',
        height: 1,
        marginTop: scale(10),
        marginRight: scale(10),
        marginLeft: scale(10)
    },
    view_like_comment: {
        flexDirection: 'row',
        minHeight: scale(40),
    },
    view_like_btn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    view_comment: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon_like: {
        width: 16,
        height: 16,
        resizeMode: 'center',
        marginRight: 4
    },
    txt_like: {
        fontSize: 13
    },
    img_comment: {
        width: 17,
        height: 17,
        resizeMode: 'contain',
        marginRight: 5
    },
    view_ls_comment: {
        flex: 1
    },
    view_like_group: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 23
    },
    icon_heart: {
        width: 23,
        height: 23,
        resizeMode: 'contain'
    },
    view_heart: {
        position: 'absolute',
        zIndex: 3,
        width: 23,
        height: 23,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_like: {
        position: 'absolute',
        zIndex: 2,
        width: 23,
        height: 23,
        top: 0,
        bottom: 0
    },
    view_dislike: {
        position: 'absolute',
        zIndex: 1,
        width: 23,
        height: 23,
        top: 0,
        bottom: 0
    },

});