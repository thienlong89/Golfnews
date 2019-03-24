import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import CustomAvatar from '../../Common/CustomAvatar';
import LikeCommentItemView from '../../Social/Item/LikeCommentItemView';
import PhotoGridView from '../../Common/PhotoGridView';

export default class StatusItemView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
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

        let {images} = this.state;

        return (
            <View style={styles.container}>
                <View style={styles.view_top}>
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
                    <TouchableOpacity style={styles.touchable_edit}
                        onPress={this.onEditStatusPress.bind(this)}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_edit}>{'•••'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.view_center}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_content_status}>
                        {contentStatus}
                    </Text>
                    <PhotoGridView
                        source={images}
                        onPressImage={source => this.showImage(source.uri)} />
                </View>
                <View style={styles.view_bottom}>
                    <LikeCommentItemView
                        onCommentStatusPress={this.onCommentStatusPress.bind(this)} />
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

    onCommentStatusPress(){
        if(this.props.onCommentStatusPress){
            this.props.onCommentStatusPress();
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
        padding: 10
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
        width: 50,
        height: 50,
    },
    txt_edit: {
        color: '#6C6C6C',
        fontSize: 25,
        position: 'absolute',
        right: 0
    }
});