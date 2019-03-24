import React from 'react';
import {
    Platform,
    StyleSheet,
    View,
    BackHandler,
    StatusBar,
    Dimensions,
    Image,
    Text
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import { Constants } from '../../Core/Common/ExpoUtils';
import LoadingView from '../../Core/Common/LoadingView';
import Swiper from 'react-native-swiper';
import FlightSummaryModel from '../../Model/CreateFlight/Flight/FlightSummaryModel';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import PhotoView from 'react-native-photo-view';

const { height, width } = Dimensions.get('window');

export default class ShowImageSlideView extends BaseComponent {

    constructor(props) {
        super(props);
        this.isIphoneX = this.getAppUtil().isIphoneX();
        this.onCloseImageClick = this.onCloseImage.bind(this);
        this.rotateToPortrait();

        let { index, imageUri, dataList, flightId } = this.props.navigation.state.params;
        this.flightId = flightId || '';
        this.position = index || 0;
        this.page = 1;
        this.state = {
            imageUri: imageUri || '',
            imgList: dataList || [],
            isLoadEnd: false
        }

        this.onPageSelected = this.onPageSelected.bind(this);
        this.onOpenImageInfo = this.onOpenImageInfo.bind(this);
        this.onLoadStart = this.onLoadStart.bind(this);
        this.onLoadEnd = this.onLoadEnd.bind(this);
    }

    renderImageBlur() {
        if (!this.state.isLoadEnd) {
            return (
                <Image
                    style={{ width: width, height: height }}
                    source={this.getResources().ic_picture_blue}
                    blurRadius={Platform.OS === 'ios' ? 10 : 5}
                />
            )
        } else {
            return null;
        }
    }

    renderShowInfo() {
        return (
            <Touchable style={{ padding: 5 }} onPress={this.onOpenImageInfo}>
                <Image
                    style={styles.image_close}
                    source={this.getResources().ic_group_info}
                />
            </Touchable>
        )
    }

    renderGallery(imgList) {

        let sourceList = imgList.map((imgObj) => {
            return (
                {
                    url: imgObj.img_path
                }
            )
        })

        let viewLs = sourceList.map((data) => {
            return (
                <PhotoView
                    style={{ width: width, height: height, resizeMode: 'contain' }}
                    source={{ uri: data.url }}
                    maximumZoomScale={3}
                    androidScaleType="fitCenter"
                    // onLoad={() => console.log("Image loaded!")}
                    // onLoadStart={this.onLoadStart}
                    // onLoadEnd={this.onLoadEnd}
                />
            )
        })
        return (

            <Swiper
                ref={(swiper) => { this.swiper = swiper; }}
                loop={false}
                onIndexChanged={this.onPageSelected}
                index={this.position}
                showsPagination={false}
            >
                {viewLs}

            </Swiper>
        );
    }

    render() {
        let {
            imgList
        } = this.state;
        console.log('render.imgList', imgList)
        return (
            <View style={styles.container}>
                <StatusBar hidden={true} />
                <LoadingView
                    ref={(loading) => { this.loading = loading; }}
                    isShowOverlay={false}
                />

                {this.renderGallery(imgList)}


                <View style={[styles.view_header, this.isIphoneX ? { left: 0 } : {}]}>
                    <Touchable style={{ padding: 5 }} onPress={this.onCloseImageClick}>
                        <Image
                            style={styles.image_close}
                            source={this.getResources().ic_x}
                        />
                    </Touchable>

                    {this.renderShowInfo()}
                </View>

            </View>
        );
    }

    componentDidMount() {

        let self = this;
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
            self.onCloseImage();
            return true;
        });
        // if (this.position && this.swiper)
        //     this.swiper.scrollBy(this.position);
    }

    componentWillUnmount() {
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    onCloseImage() {
        if (this.props.navigation.state.params.onCloseImage) {
            this.props.navigation.state.params.onCloseImage();
        }
        this.props.navigation.goBack();
    }

    onLoadStart() {
        if (this.loading)
            this.loading.showLoading();
    }

    onLoadEnd() {
        if (this.loading)
            this.loading.hideLoading();
    }

    onOpenImageInfo() {
        let {
            imgList
        } = this.state;
        let flightId = imgList[this.position].flight_id;
        if (this.props.navigation) {
            let flight = new FlightSummaryModel();
            flight.id = flightId;
            this.props.navigation.navigate('comment_flight_view',
                {
                    // onCommentBack: this.onCommentBackListener.bind(this, itemId),
                    'flight': flight,
                });
        }
    }

    onPageSelected(index) {
        this.position = index;
        console.log('onPageSelected', this.position, this.state.imgList.length)
        if (this.position === this.state.imgList.length - 1) {
            this.page++;
            this.requestImageList();
        }

    }

    requestImageList() {
        let url = this.getConfig().getBaseUrl() + ApiService.get_all_img_upload_flight(this.page);
        console.log('url: ', url);
        // this.loading.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            // self.internalLoading.hideLoading();
            let { error_code, data, error_msg } = jsonData;
            if (error_code === 0) {
                if (data instanceof Array && data.length > 0) {
                    self.setState({
                        imgList: [...self.state.imgList, ...data]
                    }, () => {
                        console.log('requestImageList', self.state.imgList)
                    })
                }
            } else {
                self.showErrorMsg(error_msg);
            }
        }, () => {
            // self.internalLoading.hideLoading();
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        marginTop: Constants.marginTopBuild,
    },
    image_score: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0)',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
        // resizeMode: 'contain'
    },
    touchable_close: {
        position: 'absolute',
        padding: 5
    },
    image_close: {
        height: 25,
        width: 25,
        resizeMode: 'contain',
        tintColor: '#fff'
    },
    view_header: {
        position: 'absolute',
        flexDirection: 'row',
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'space-between',
        padding: 5
    }
});