import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import CustomAvatar from '../../Common/CustomAvatar';
import LikeCommentItemView from '../../Social/Item/LikeCommentItemView';
import PhotoGridView from '../../Common/PhotoGridView';
import MyView from '../../../Core/View/MyView';
import PropsStatic from '../../../Constant/PropsStatic';

export default class PostStatusItemView extends BaseComponent {

    static defaultProps = {
        postStatus: {},
        type: ''
    }

    constructor(props) {
        super(props);
        this.state = {
            images: []
        }

        this.onCommentStatusPress = this.onCommentStatusPress.bind(this);
        this.onEditStatusPress = this.onEditStatusPress.bind(this);
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

    render() {

        let {
            postStatus,
            type
         } = this.props;

        let id = postStatus.getId();
        let user = postStatus.getUser();
        let playerName = user.getFullName();
        let avatar = user.getAvatar();

        let dateTime = postStatus.getTimeDisplay();
        let contentStatus = postStatus.getContent();
        let images = postStatus.getImgContent();
        let logo = postStatus.getClub().logo ? postStatus.getClub().getLogo() : '';
        let topic = postStatus.getTopic().name;
        let status = postStatus.getPostStatus();
        // console.log('render.item',topic,  logo)
        return (
            <View style={styles.container}>
                <View style={styles.view_top}>
                    <CustomAvatar
                        width={40}
                        height={40}
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
                <View style={styles.view_center}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_content_status}>
                        {contentStatus}
                    </Text>
                    {this.renderImageGrid(images)}
                </View>
                <View style={styles.view_bottom}>
                    <LikeCommentItemView
                        stt_id={id}
                        postType={type}
                        postStatus={status ? status : {}}
                        onCommentStatusPress={this.onCommentStatusPress} />
                </View>
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

    /**
     * Click vao button comment để chuyển sang màn hình comment
     */
    onCommentStatusPress() {
        // if (this.props.onCommentStatusPress) {
        //     this.props.onCommentStatusPress();
        // }
        let navigation = PropsStatic.getAppSceneNavigator();
        let { postStatus } = this.props;
        if (navigation && postStatus) {
            navigation.navigate('comment_dicussion', { data: postStatus });
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    view_top: {
        flexDirection: 'row',
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 10,
        paddingBottom: 10
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