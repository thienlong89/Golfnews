import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    // View,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import MyView from '../../Core/View/MyView';
import { View } from 'react-native-animatable';
import PopupLoveLikeStatus from '../Common/PopupLoveLikeStatus';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import CommentCountView from '../Social/Item/TextCountComment';

const width = Dimensions.get("window").width;
const COLOR_STATUS = ['#555555', '#00ABA7', '#D1403F', '#005B59'];

export default class LikeCommentHomeView extends BaseComponent {

    static defaultProps = {
        postStatus: {},
        flight_id: '',
        stt_id: '',
        postType: '',
        bgColor: '#fff',
        user_feel_status: 0
    }

    constructor(props) {
        super(props);
        this.sourceStatus = [this.getResources().ic_like, this.getResources().ic_like, this.getResources().ic_heart, this.getResources().ic_dislike];
        this.txtStatus = [this.t('like'), this.t('like'), this.t('love'), this.t('dislike')];
        let { like_count, love_count, unlike_count, comment_count, total_count, myStatus } = this.props.postStatus;
        this.like_count = like_count || 0;
        this.love_count = love_count || 0;
        this.unlike_count = unlike_count || 0;
        this.comment_count = comment_count || 0;
        this.total_count = this.like_count + this.love_count + this.unlike_count;
        this.state = {
            statusType: myStatus, // 0: invalid, 1: like, 2: love, 3: dislike
            total_count: total_count,
            comment_count: comment_count,
            love_count: love_count,
            like_count: like_count,
            unlike_count: unlike_count
        }

        this.onLikePress = this.onLikePress.bind(this);
        this.onViewInteractUserPress = this.onViewInteractUserPress.bind(this);
        this.onSetHeartClick = this.onSetHeartClick.bind(this);
        this.onSetLikeClick = this.onSetLikeClick.bind(this);
        this.onSetDislikeClick = this.onSetDislikeClick.bind(this);
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

    render() {
        let { statusType } = this.state;
        let { bgColor,isDisable } = this.props;
        let hide = !this.total_count && this.comment_count;
        let heart = this.love_count && this.love_count != 0;
        let like = this.like_count && this.like_count != 0;
        let dislike = this.unlike_count && this.unlike_count != 0;
        console.log('this.comment_count0', this.comment_count)
        return <View style={[styles.container, { backgroundColor: bgColor }]}>
            <Image
                style={styles.img_dash_line}
                source={this.getResources().ic_dash_line}
            />
            <View style={styles.view_container}>
                <View style={styles.view_like_container}>
                    <TouchableOpacity onPress={this.onLikePress}
                        onLongPress={(event) => this.onLikeLongPress(event)}
                        style={{ alignItems: 'center', justifyContent: 'center' }}>
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
                    <TouchableOpacity onPress={this.onViewInteractUserPress}>
                        <MyView hide={false}
                            style={styles.view_like_group} >
                            <View style={styles.horizontal_line} />
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
                                    {this.total_count || ''}
                                </Text>
                            </View>

                        </MyView>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={this.onCommentClick.bind(this)} disabled={isDisable}>
                    <View style={styles.view_comment_container}>
                        <Image
                            source={this.getResources().ic_comment}
                            style={styles.img_comment}
                        />
                        {/* <Text allowFontScaling={global.isScaleFont} style={styles.txt_comment}>{this.comment_count > 0 ? `${this.comment_count} ${this.t('comment')}` : this.t('comment')}</Text> */}
                        <CommentCountView
                            ref={(commentCountView) => { this.commentCountView = commentCountView; }}
                            style={styles.txt_comment}
                            commentNumber={this.comment_count}
                            showText={true} />
                    </View>
                </TouchableOpacity>

            </View>

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
        this.myStatus = type;
        this.total_count = this.like_count + this.love_count + this.unlike_count;
        this.setState({
            statusType: type,
            total_count: this.total_count,
            comment_count: this.comment_count,
            love_count: this.love_count,
            like_count: this.like_count,
            unlike_count: this.unlike_count,
        }, () => {
            this.updateCountComment(this.comment_count)
        })
    }

    onLikePress() {
        // this.updateCount(this.state.statusType === 0 ? 1 : 0);
        // this.setState({
        //     statusType: this.state.statusType === 0 ? 1 : 0
        // }, () => {
        //     this.requestLikeStatus(this.state.statusType);
        // })
        this.requestLikeStatus(this.state.statusType === 0 ? 1 : 0);
    }

    onLikeLongPress(event) {
        let object = {};
        object.locationX = event.nativeEvent.locationX;
        object.locationY = event.nativeEvent.locationY;
        object.pageY = event.nativeEvent.pageY;
        object.pageX = event.nativeEvent.pageX;
        object.target = event.nativeEvent.target;
        console.log(JSON.stringify(object));
        this.refPopupLoveLikeStatus.setVisible(true, object.pageY);
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

    onCommentClick() {
        if (this.props.onCommentClick) {
            this.props.onCommentClick();
        }
    }

    onViewInteractUserPress() {
        if (this.props.onViewInteractUserPress) {
            this.props.onViewInteractUserPress();
        }
    }

    requestLikeStatus(type = 0) {
        let { stt_id, postType } = this.props;
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.like_status(stt_id, type, postType);
        console.log('url', url);
        Networking.httpRequestGet(url, this.onRequestLikeStatusResponse.bind(this), () => {

        });
    }

    onRequestLikeStatusResponse(jsonData) {
        console.log('onRequestLikeStatusResponse1', jsonData)
        if (jsonData.error_code === 0) {
            try {
                let total_feel = jsonData.data.total_feel;
                let type = jsonData.data.user_feel_status;
                this.like_count = parseInt(total_feel.like_count);
                this.love_count = parseInt(total_feel.love_count);
                this.unlike_count = parseInt(total_feel.unlike_count);
                this.comment_count = parseInt(total_feel.comment_count);
                this.myStatus = type;
                this.total_count = this.like_count + this.love_count + this.unlike_count;
                total_feel.myStatus = this.myStatus;
                total_feel.total_count = this.total_count;
                this.setState({
                    statusType: type
                }, () => {
                    if (this.props.likeCallback) {
                        this.props.likeCallback({ total_feel, type })
                    }
                })
            } catch (error) {
            }

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
        height: 46,
        paddingBottom: 8
    },
    view_container: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10
    },
    view_like_container: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center'
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
        width: 16,
        height: 16,
        resizeMode: 'center',
        marginRight: 4
    },
    txt_like: {
        fontSize: 12,
        textAlign: 'center'
    },
    horizontal_line: {
        height: 15,
        width: 1,
        backgroundColor: '#C7C7C7',
        marginLeft: 5,
        marginRight: 5
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
    img_comment: {
        width: 17,
        height: 17,
        resizeMode: 'contain',
        marginRight: 5
    },
    txt_comment: {
        color: '#555555',
        fontSize: 12
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
        marginBottom: 8,
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

    }
});