import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import HeaderView from '../../HeaderView';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import { scale, verticalScale, moderateScale, fontSize } from '../../../Config/RatioScale';
import FastImageGridView from '../../Common/FastImageGridView';
import StaticProps from '../../../Constant/PropsStatic';

const { width } = Dimensions.get('window')

export default class CommentImageGridView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);

        this.state = {
            imgs: [],
            total_img: 0
        }

        this.onPressImage = this.onPressImage.bind(this);
        this.onAddMoreImagePress = this.onAddMoreImagePress.bind(this);

    }

    render() {
        let {
            imgs,
            total_img
        } = this.state;
        let data = imgs.map((img) => {
            return img.img_path;
        })
        return (
            <View style={styles.container}>
                <View style={styles.view_row}>
                    <Text style={styles.txt_image}>{this.t('photo')}</Text>
                    <Text style={styles.txt_add_image}
                        onPress={this.onAddMoreImagePress}>{this.t('add_photo')}</Text>
                </View>
                <View style={{ marginLeft: scale(10), marginRight: scale(10) }}>
                    <FastImageGridView
                        data={imgs}
                        onPressImage={this.onPressImage}
                        // numberImagesToShow={total_img}
                        width={width - scale(40)}
                        height={300} />
                </View>
                {this.renderInternalLoading()}
            </View>
        );
    }

    componentDidMount() {
        this.registerMessageBar();

    }

    componentWillUnmount() {
    }

    setData(dataList = []) {
        console.log('setData', dataList)
        this.setState({
            imgs: dataList
        })
    }

    requestImageList() {
        let url = this.getConfig().getBaseUrl() + ApiService.get_list_img_upload_flight();
        console.log('url: ', url);
        this.internalLoading.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.internalLoading.hideLoading();
            let { error_code, data, error_msg } = jsonData;
            if (error_code === 0) {
                let dataList = data.list_img_display;
                let total = data.total_img;
                self.setState({
                    imgs: dataList ? dataList : [],
                    total_img: total
                })
            }
        }, () => {
            self.internalLoading.hideLoading();
        })
    }

    onPressImage(data, { isLastImage, index }) {
        console.log('onPressImage', data, isLastImage, index);
        if (this.props.onOpenImage) {
            this.props.onOpenImage(data.img_path, index);
        }
        // let navigation = StaticProps.getAppSceneNavigator();
        // if (navigation) {
        //     if (isLastImage) {
        //         navigation.navigate('image_comment_flight_view')
        //     } else {
        //         navigation.navigate('show_scorecard_image', {
        //             'imageUri': data.img_path,
        //             'imgList': [data.img_path],
        //             'position': 0,
        //             'flightId': data.flight_id,
        //             'isPortrait': true
        //         })
        //     }

        // }
    }

    onAddMoreImagePress() {
        if (this.props.onAddMoreImagePress) {
            this.props.onAddMoreImagePress();
        }
    }

}

const styles = StyleSheet.create({
    container: {
        paddingBottom: verticalScale(10),
        borderColor: 'rgba(0,0,0,0.25)',
        borderRadius: 5,
        borderWidth: 1,
        marginLeft: scale(10),
        marginRight: scale(10),
        marginTop: verticalScale(10)
    },
    view_row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: scale(10)
    },
    txt_image: {
        color: '#444444',
        fontSize: fontSize(15)
    },
    txt_add_image: {
        color: '#00BAB6',
        fontSize: fontSize(15),
        paddingLeft: scale(15),
        paddingRight: scale(10),
        paddingTop: scale(10),
        paddingBottom: scale(10)
    }
});