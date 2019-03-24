import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import CustomAvatar from '../Common/CustomAvatar';
import LikeCommentItemView from './Item/LikeCommentItemView';
import PhotoGridView from '../Common/PhotoGridView';
import CommentListView from './Item/CommentListView';
import InputBoxCommentView from './Item/InputBoxCommentView';

export default class CommentClubView extends BaseComponent {

    constructor(props) {
        super(props);
        this.isIphoneX = this.getAppUtil().isIphoneX();
        this.state = {
            images: [
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9YhaRUBH86eOW2v03YJYnjiyTKqZhCUz7EPsigPz9EgS6lDz9'
            ]
        }
    }

    render() {
        let playerName = 'ABC';
        let dateTime = 'Thu ba luc 16:13';
        let contentStatus = 'Hop bao ra mat ung dung vHandicap';

        let { images } = this.state;

        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                <View style={[styles.view_top, { marginTop: this.isIphoneX ? 30 : 25 }]}>

                    <TouchableOpacity style={styles.touchable_back}
                        onPress={() => this.onBackPress()} >
                        <Image style={styles.icon_back}
                            source={this.getResources().ic_back_large}
                        />
                    </TouchableOpacity>

                    <View style={styles.view_header}>
                        <CustomAvatar
                            width={40}
                            height={40} />
                        <View style={styles.view_top_right}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_player_name}>
                                {playerName}
                            </Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_date_time}>
                                {dateTime}
                            </Text>
                        </View>
                    </View>

                </View>

                <ScrollView style={{ flex: 1 }}>
                    <View style={styles.view_center}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_content_status}>
                            {contentStatus}
                        </Text>
                        <PhotoGridView
                            source={images}
                            onPressImage={source => this.showImage(source.uri)} />
                    </View>
                    <LikeCommentItemView />
                    <View style={styles.line} />
                    <CommentListView />
                </ScrollView>

                <InputBoxCommentView />

            </KeyboardAvoidingView>
        );
    }

    onBackPress() {
        if (this.props.navigation != null) {
            this.props.navigation.goBack();
        }
    }

    showImage() {

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    view_top: {
        flexDirection: 'row',
        paddingBottom: 10
    },
    view_top_right: {
        height: 40,
        flex: 1,
        paddingRight: 10,
        paddingLeft: 10
    },
    txt_player_name: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 15
    },
    txt_date_time: {
        color: '#AEAEAE',
        fontSize: 13
    },
    view_header: {
        flex: 1,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    touchable_back: {
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
    },
    icon_back: {
        height: 22,
        width: 22,
        resizeMode: 'contain',
        marginLeft: 4,
        tintColor: 'black'
    },
    view_center: {
        paddingBottom: 10
    },
    txt_content_status: {
        color: '#292929',
        fontSize: 15,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10
    },
    line: {
        backgroundColor: '#E9E9E9',
        height: 1,
        marginRight: 10,
        marginLeft: 10,
        marginBottom: 10,
    },
});