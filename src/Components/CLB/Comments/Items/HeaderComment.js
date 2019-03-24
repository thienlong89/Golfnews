import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Image
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../../Core/View/BaseComponent';
import CustomAvatar from '../../../Common/CustomAvatar';
import LikeCommentItemView from '../../../Social/Item/LikeCommentItemView';
import PhotoGridView from '../../../Common/PhotoGridView';
import MyView from '../../../../Core/View/MyView';
import { scale, verticalScale } from '../../../../Config/RatioScale';
import LikeComment from '../../../Comments/LikeView';
let{height} = Dimensions.get('window');

/**
 * Phần nội dung cần comment
 */
export default class HeaderComment extends BaseComponent {

    static defaultProps = {
        data: {}
    }

    constructor(props) {
        super(props);
        this.state = {
            images: [],
            view_height : height/2
        }

        this.onCommentStatusPress = this.onCommentStatusPress.bind(this);
        this.onEditStatusPress = this.onEditStatusPress.bind(this);
        this.onBackClick = this.onBackClick.bind(this);
    }

    /**
     * co lai phần nội dung để lấy chỗ hiển thị comment
     */
    resizeView(){
        this.setState({
            view_height : height/4
        });
    }

    /**
     * Hiển thị lại view như ban đầu
     */
    originView(){
        this.setState({
            view_height : height/2
        });
    }

    renderImageGrid(images = []) {
        if (images.length > 0 && images[0] != '') {
            return (
                <PhotoGridView
                    source={images}
                    onPressImage={source => this.showImage(source.uri)} />
            )
        } else {
            return null;
        }
    }

    onBackClick() {
        let { backClick } = this.props;
        if (backClick) {
            backClick();
        }
    }

    updateCountComment(countComment){
        if (this.likeCommentItemView) {
            this.likeCommentItemView.updateCountComment(countComment);
        }
    }

    render() {

        let { data } = this.props;

        let id = data.getId();
        let user = data.getUser();
        let playerName = user.getFullName();
        let avatar = user.getAvatar();

        let dateTime = data.getTimeDisplay();
        let contentStatus = data.getContent();
        let images = data.getImgContent();
        let logo = data.getClub().logo ? data.getClub().getLogo() : '';
        let topic = data.getTopic().name;
        let status = data.getPostStatus();

        let{view_height} = this.state;
        // console.log('render.item',topic,  logo)
        return (
            <View style={[styles.container,{height : view_height}]}>
                <View style={styles.view_top}>
                    <Touchable onPress={this.onBackClick}>
                        <Image style={{ marginLeft: scale(3),marginRight : scale(10), width: scale(30), height: verticalScale(30), resizeMode: 'contain', tintColor: 'black' }}
                            source={this.getResources().ic_back} />
                    </Touchable>
                    <CustomAvatar
                        width={verticalScale(40)}
                        height={verticalScale(40)}
                        uri={avatar} />
                    <View style={styles.view_top_right}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_player_name}>
                                {playerName}
                            </Text>
                            <MyView hide={!topic} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <Image
                                    style={styles.img_triangle}
                                    source={this.getResources().ic_triangle} />
                                <Text allowFontScaling={global.isScaleFont} style={[styles.txt_player_name, {}]}>
                                    {topic}
                                </Text>
                            </MyView>
                        </View>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_date_time}>
                            {dateTime}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            style={styles.img_club_icon}
                            source={logo ? { uri: logo } : null} />
                        <TouchableOpacity style={styles.touchable_edit}
                            onPress={this.onEditStatusPress}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_edit}>{'•••'}</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                <ScrollView >
                <View style={styles.view_center}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_content_status}>
                        {contentStatus}
                    </Text>
                    {this.renderImageGrid(images)}
                </View>
                </ScrollView>
                {/* <View style={styles.view_bottom}>
                    <LikeCommentItemView
                        stt_id={id}
                        postType={'postclub'}
                        data={status ? status : {}}
                        onCommentStatusPress={this.onCommentStatusPress} />
                </View> */}
                <LikeComment
                    ref={(likeCommentItemView) => { this.likeCommentItemView = likeCommentItemView; }}
                    stt_id={id}
                    postType={3}
                    data={status ? status : {}}
                    // onViewInteractUserPress={this.onViewInteractUserPress} 
                    />
            </View>
        ); 
    }

    showImage(uri) {
        console.log('showImage.uri', uri)
    }

    onEditStatusPress() {
        if (this.props.onEditStatusPress) {
            this.props.onEditStatusPress();
        }
    }

    onCommentStatusPress() {
        if (this.props.onCommentStatusPress) {
            this.props.onCommentStatusPress();
        }
    }

}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // height : height/2,
        backgroundColor: '#FFFFFF',
    },
    view_top: {
        flexDirection: 'row',
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 5,
        paddingBottom: 5
    },
    view_top_right: {
        height: 40,
        flex: 1,
        paddingRight: 5,
        paddingLeft: 5
    },
    txt_player_name: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 13
    },
    txt_date_time: {
        color: '#AEAEAE',
        fontSize: 13
    },
    view_center: {
        paddingBottom: 10
    },
    view_bottom: {

    },
    txt_content_status: {
        color: '#292929',
        fontSize: 15,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10
    },
    touchable_edit: {
        width: 30,
        height: 50,
    },
    txt_edit: {
        color: '#6C6C6C',
        fontSize: 20,
        position: 'absolute',
        right: 0,
        height: 50
    },
    img_club_icon: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
    img_triangle: {
        width: 13,
        height: 13,
        resizeMode: 'contain',
        marginLeft: 5,
        marginRight: 5
    }
});