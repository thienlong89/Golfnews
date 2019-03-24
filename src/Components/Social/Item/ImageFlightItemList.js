import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import { scale, verticalScale, moderateScale } from '../../../Config/RatioScale';
import * as Progress from 'react-native-progress';
import { createImageProgress } from 'react-native-image-progress';
import FastImage from 'react-native-fast-image';
const Images = createImageProgress(FastImage);
import CustomAvatar from '../../Common/CustomAvatar';
import ProgressUpload from '../../Common/ProgressUpload';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';

const width = Dimensions.get('window').width;
const imgWidth = (width - 50) / 3;

export default class ImageFlightItemList extends BaseComponent {

    static defaultProps = {
        data: null,
        index: 0,
        flightId: ''
    }

    constructor(props) {
        super(props);

        this.state = {

        }
        this.isUploading = false;
        this.imgPath = '';
        this.onOpenImage = this.onOpenImage.bind(this);

    }

    shouldComponentUpdate(nextProps) {
        return nextProps.data.img_path != this.props.data.img_path;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data.isUploading) {
            this.isUploading = true;
        }
    }

    componentDidMount(){
        if (this.props.data.isUploading && this.imgPath != this.props.data.img_path) {
            this.isUploading = false;
            this.imgPath = this.props.data.img_path;
            console.log('componentDidMount', this.imgPath)
            this.requestUpload(this.imgPath);
        }
    }

    componentDidUpdate() {
        if (this.isUploading && this.imgPath != this.props.data.img_path) {
            this.isUploading = false;
            this.imgPath = this.props.data.img_path;
            console.log('componentDidUpdate2', this.imgPath)
            this.requestUpload(this.imgPath);
        }
    }

    render() {
        let {
            data
        } = this.props;

        if (!data) return null

        let avatar = data.avatar;
        let img_path = data.img_path;
        console.log('render.img_path', img_path)
        if (!this.isUploading && img_path) {
            return (
                <Touchable style={styles.container}
                    onPress={this.onOpenImage}>
                    <View style={{ backgroundColor: '#E9E9E9' }}>
                        <Images
                            style={styles.img_item}
                            source={{
                                uri: `${img_path}&type=small`,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                            indicator={Progress.Circle}
                        // onLoadEnd={() => this.setState({ isLoadEnd: true })}
                        />
                        <View style={styles.avatar}>
                            <CustomAvatar
                                width={scale(30)}
                                height={scale(30)}
                                // containerStyle={styles.avatar}
                                uri={avatar} />
                        </View>

                    </View>

                </Touchable>
            );
        } else {
            return (
                <Touchable style={styles.container}
                    onPress={this.onOpenImage}>
                    <View style={{ backgroundColor: '#E9E9E9' }}>

                        <Image
                            style={styles.img_item}
                            source={{ uri: img_path }} />
                        <View style={styles.avatar}>
                            <CustomAvatar
                                width={scale(30)}
                                height={scale(30)}
                                // containerStyle={styles.avatar}
                                uri={avatar} />
                        </View>
                        <ProgressUpload
                            ref={(progressUpload) => { this.progressUpload = progressUpload; }}
                            isModalView={false} />
                    </View>


                </Touchable>
            );
        }

    }

    onOpenImage() {
        let {
            uri,
            index,
            onOpenImage
        } = this.props;

        if (onOpenImage) {
            onOpenImage(uri, index);
        }
    }

    requestUpload(imgPath) {
        if (imgPath) {
            if (this.progressUpload)
                this.progressUpload.showLoading();
            let self = this;
            let url = this.getConfig().getBaseUrl() + ApiService.user_add_img_status_flight(this.props.flightId);
            console.log('requestUpload.url', url);
            this.getAppUtil().upload_mutil(url, [imgPath],
                this.onUploadSuccess.bind(this),
                (error) => {
                    if (self.progressUpload)
                        self.progressUpload.hideLoading();
                    try {
                        self.showErrorMsg(error);
                    } catch (error) {

                    }
                }, (progress) => {
                    if (self.progressUpload)
                        self.progressUpload.setProgress(progress);
                });
        }

    }

    onUploadSuccess(jsonData) {
        if (this.progressUpload)
            this.progressUpload.hideLoading();
        let {
            imgStatusList
        } = this.state;
        let {
            index,
        } = this.props;
        console.log('onUploadSuccess', jsonData);
        if (jsonData != null && jsonData.hasOwnProperty('error_code')) {
            if (jsonData['error_code'] === 0) {
                // let objData = {};
                // objData.avatar = this.userProfile ? this.userProfile.avatar : '';
                // objData.img_path = jsonData.data.length > 0 ? jsonData.data[0] : '';
                // objData.created_at_timestamp = (new Date()).getTime();
                // imgStatusList.unshift(objData);
                // this.setState({
                //     imgStatusList: imgStatusList
                // })
                if (this.props.uploadCallback) {
                    this.props.uploadCallback(jsonData.data.length > 0 ? jsonData.data[0] : '', index);
                }
            } else {
                try {
                    this.showErrorMsg(jsonData.error_msg);
                } catch (error) {

                }
            }
        }
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'column'
    },
    img_item: {
        width: imgWidth,
        height: imgWidth,
        resizeMode: 'center'
    },
    avatar: {
        position: 'absolute',
        left: 5,
        top: 5
    }
});