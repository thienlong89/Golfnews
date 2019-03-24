import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Animated
} from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import CustomAvatar from '../../Common/CustomAvatar';
import utils from '../../../Utils';
import relativeDate from 'relative-date';
import MyView from '../../../Core/View/MyView';
import FastImage from 'react-native-fast-image';
import { verticalScale, scale, fontSize } from '../../../Config/RatioScale';
import { Avatar } from 'react-native-elements';

export default class ItemCommentView extends BaseComponent {
    constructor(props) {
        super(props);
        let { icon, like } = this.props.data;
        if (icon || like) {
            this.shouldRender = false;
            let { width, height } = icon ? icon : like;
            // console.log("icon width , height : ", width, height);
            this.icon_width = width;
            this.icon_height = height;
            // this.xy = new Animated.Value(width);
            // this.xy = new Animated.ValueXY({
            //     x: width,
            //     y: width
            // });
            // this.animation = Animated.timing(                    // Animate over time
            //     this.xy,             // The animated value to drive, this would be a new Animated.Value(0) object.
            //     {
            //         toValue: 200,                   // Animate the value
            //         duration: 5000,                 // Make it take a while
            //     }
            // );

            // this.position = {
            //     transform: [
            //         {
            //             translateX: this.xy.x.interpolate({
            //                 inputRange: [0, 1],
            //                 outputRange: [60, 1]
            //             })
            //         },
            //         {
            //             translateY: this.xy.y.interpolate({
            //                 inputRange: [0, 1],
            //                 outputRange: [parseInt(this.xy.y._value) / 2, parseInt(this.xy.y._value) / 2]
            //             })
            //         }
            //     ]
            // };
        }
    }

    startAnimation(data) {
        console.log("..................................startAnimation");
        // if (!this.animation) return;
        // // let self = this;
        // this.isStartAniamtion = true;
        // this.animation.start(() => {
        //     this.stopAnimationCallback(data);
        // });
    }

    stopAnimationCallback(data) {
        // let { icon, like } = data;
        // if (icon) {
        //     let size = parseInt(this.xy.x._value);
        //     icon.width = size;
        //     icon.height = size;
        //     console.log(".........................stop animation : ", size);
        // } else
        //     if (like) {
        //         let size = parseInt(this.xy.x._value)
        //         like.width = size;
        //         like.height = size;
        //     }
    }

    stopAnimation(data) {
        // if (!this.animation || !this.isStartAniamtion) return;
        // this.animation.stop();
        // this.stopAnimationCallback(data);
    }

    getElementTypeLike() {
        let { user, createdAt, finish_animation, like } = this.props.data;
        return (
            <View style={styles.container}>
                <CustomAvatar
                    width={verticalScale(40)}
                    height={verticalScale(40)}
                    uri={user.avatar}
                />
                <Image
                    style={{ marginLeft: 20, width: like.width, height: like.height, resizeMode: 'contain' }}
                    source={this.getResources().icon_like_chat}
                />
            </View>
        );
        // return finish_animation ?
        //     (
        //         <View style={styles.container}>
        //             <CustomAvatar
        //                 width={40}
        //                 height={40}
        //                 uri={user.avatar}
        //             />
        //             <Image
        //                 style={{ marginLeft: 20, width: like.width, height: like.height, resizeMode: 'contain' }}
        //                 source={this.getResources().icon_like_chat}
        //             />
        //         </View>
        //     ) :
        //     (
        //         <View style={styles.container}>
        //             <Image
        //                 style={{ marginLeft: 60, width: this.xy.x, height: this.xy.y, resizeMode: 'contain' }}
        //                 source={this.getResources().icon_like_chat}
        //             />
        //         </View>
        //     );
    }

    /**
     * dang element vs type icon
     */
    getElementTypeIcon() {
        let { data } = this.props;
        console.log("....................icon data ", data);
        let { user, createdAt, finish_animation, icon } = data;
        createdAt = parseInt(createdAt);
        return (
            <View style={styles.container}>
                <CustomAvatar
                    width={verticalScale(40)}
                    height={verticalScale(40)}
                    uri={user.avatar}
                />
                {/* <View style={{ marginLeft: 10 }}> */}
                <Image
                    style={{ marginLeft: 20, width: icon.width, height: icon.height, resizeMode: 'contain' }}
                    source={this.getResourcesIconChatView()[icon.species][icon.name]}
                />
                {/* </View> */}
            </View>

        );

        // return finish_animation ?
        //     (
        //         <View style={styles.container}>
        //             <CustomAvatar
        //                 width={40}
        //                 height={40}
        //                 uri={user.avatar}
        //             />
        //             {/* <View style={{ marginLeft: 10 }}> */}
        //             <Image
        //                 style={{ marginLeft: 20, width: icon.width, height: icon.height, resizeMode: 'contain' }}
        //                 source={this.getResourcesIconChatView()[icon.species][icon.name]}
        //             />
        //             {/* </View> */}
        //         </View>
        //     ) :
        //     (
        //         <View style={styles.container}>
        //             {/* <View style={{ marginLeft: 10 }}> */}
        //             <Image
        //                 style={{ marginLeft: 60, width: this.xy.x, height: this.xy.y, resizeMode: 'contain' }}
        //                 source={this.getResourcesIconChatView()[icon.species][icon.name]}
        //             />
        //             {/* </View> */}
        //         </View>
        //     );
    }

    getElementTypeText() {
        let { data } = this.props;
        console.log('.....................text data ', data);
        let { user, createdAt, content, send_status } = data;
        let _font = data.fontSize;
        createdAt = parseInt(createdAt);
        let isMe = (user.userid.toLowerCase() === this.getUserInfo().getUserId().toLowerCase());
        return (
            <View style={styles.container}>
                <Avatar
                    width={scale(40)}
                    height={scale(40)}
                    // uri={user.avatar}
                    rounded
                    source={{uri : user.avatar}}
                />
                <View style={{ marginLeft: 10 }}>
                    <View style={styles.comment_group}>
                        <Text allowFontScaling={global.isScaleFont} style={[styles.txt_name, { fontSize: _font ? _font : fontSize(13,-scale(1)) }]}>
                            {user.fullname}
                        </Text>
                        <Text allowFontScaling={global.isScaleFont} style={[styles.txt_comment, { fontSize: _font ? _font : fontSize(13,-scale(1)) }]}>
                            {content}
                        </Text>
                    </View>
                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_time}>
                            {utils.relativeDate(createdAt)}
                        </Text>
                        {/* <MyView hide={!isMe}>
                            <Image style={{ width: scale(20), height: verticalScale(16), marginLeft: scale(10), resizeMode: 'contain', tintColor: send_status ? '#00A3FF' : '#a3a3a3' }}
                                source={this.getResources().status_msg_send} />
                        </MyView> */}
                    </View>
                </View>
            </View>
        );
    }

    getElementTypeImg() {
        let { data } = this.props;
        console.log('.....................img data ', data);
        let { user, createdAt, url, width, height } = data;
        createdAt = parseInt(createdAt);
        return (
            <View style={styles.container}>
                <CustomAvatar
                    width={verticalScale(40)}
                    height={verticalScale(40)}
                    uri={user.avatar}
                />
                <FastImage style={{ width: width, height: height, borderColor: 'red', boderWidth: 2, marginLeft: scale(5) }}
                    source={{
                        uri: url,
                        // headers: { Authorization: 'someAuthToken' },
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
            </View>
        );
    }

    render() {
        let { type } = this.props.data;
        let element = null;
        if (type === 'text') {
            element = this.getElementTypeText();
        } else if (type === 'icon') {
            element = this.getElementTypeIcon();
        } else if (type === 'like') {
            element = this.getElementTypeLike();
        } else if (type === 'img') {
            element = this.getElementTypeImg();
        }
        return (
            element
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: scale(10),
        paddingRight: scale(10),
        marginTop: verticalScale(10)
    },
    comment_group: {
        backgroundColor: '#EEEEEE',
        borderRadius: verticalScale(10),
        padding: 2,
        justifyContent: 'center'
    },
    txt_name: {
        color: '#474747',
        fontWeight: 'bold',
        // fontSize: 13,
        marginBottom: 1,
        marginLeft: scale(5),
    },
    txt_comment: {
        color: '#1F1F1F',
        marginLeft: scale(5)
        // fontSize: 13
    },
    txt_time: {
        color: '#A3A3A3',
        fontSize: fontSize(11, -scale(3)),
        paddingTop: verticalScale(3),
        paddingLeft: scale(10),
        paddingBottom: scale(10)
    }
});