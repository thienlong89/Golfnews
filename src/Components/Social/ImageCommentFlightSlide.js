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
import MyImage from '../../Core/Common/MyImage';
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
        // if (width > height) {
        //     let w = width;
        //     width = height;
        //     height = w;
        // }

        let { imgList, index } = this.props.navigation.state.params;
        this.position = index || 0;
        this.page = 1;
        this.state = {
            imgList: imgList || [],
        }

        this.onPageSelected = this.onPageSelected.bind(this);
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

        return (
            <View style={styles.container}>
                <StatusBar hidden={true} />

                {this.renderGallery(imgList)}

                <View style={[styles.view_header, this.isIphoneX ? { left: 0 } : {}]}>
                    <Touchable style={{ padding: 5 }} onPress={this.onCloseImageClick}>
                        <Image
                            style={styles.image_close}
                            source={this.getResources().ic_x}
                        />
                    </Touchable>

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

    onPageSelected(index) {
        this.position = index;
       
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