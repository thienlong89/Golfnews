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
import PhotoView from 'react-native-photo-view';
import CustomLoadingView from '../Common/CustomLoadingView';

const { height, width } = Dimensions.get('window');

export default class ShowScorecardImage extends BaseComponent {

    constructor(props) {
        super(props);
        this.isIphoneX = this.getAppUtil().isIphoneX();
        this.onCloseImageClick = this.onCloseImage.bind(this);
        this.isPortrait = this.props.navigation.state.params.isPortrait || false;
        this.flightId = this.props.navigation.state.params.flightId || '';
        if (this.isPortrait) {
            this.rotateToPortrait();
            if (width > height) {
                let w = width;
                width = height;
                height = w;
            }

        } else {
            this.rotateToLandscape();
            if (height > width) {
                let w = width;
                width = height;
                height = w;
            }
        }
        let { position, imageUri, imgList } = this.props.navigation.state.params;
        this.position = position || 0;
        this.state = {
            imageUri: imageUri || '',
            imgList: imgList || [],
            isLoadEnd: false
        }

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

    renderImageSwipe(imgList) {
        console.log('renderImageSwipe', imgList);

        let scoreBoard = imgList.map((imageUri) => {
            return (
                <View style={{ width: width, height: height }}>
                    {/* {this.renderImageBlur()} */}
                    <PhotoView
                        style={{ width: width, height: height, resizeMode: 'contain' }}
                        source={{ uri: imageUri }}
                        maximumZoomScale={3}
                        androidScaleType="fitCenter"
                    // onLoad={() => console.log("Image loaded!")}
                    // onLoadStart={this.onLoadStart}
                    // onLoadEnd={this.onLoadEnd}
                    />

                </View>
            )
        })
        return (
            <Swiper
                ref={(swiper) => { this.swiper = swiper; }}
                showsButtons={true}
                loop={false}
                showsPagination={true}
                key={imgList.length}
                index={this.position}
                nextButton={
                    <View style={{ backgroundColor: 'rgba(0,0,0,0)', width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <Text allowFontScaling={global.isScaleFont} style={{ color: '#00ABA7', fontSize: 50, }}>{'›'}</Text>
                    </View>}
                prevButton={
                    <View style={{ backgroundColor: 'rgba(0,0,0,0)', width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <Text allowFontScaling={global.isScaleFont} style={{ color: '#00ABA7', fontSize: 50, }}>{'‹'}</Text>
                    </View>}
            >
                {scoreBoard}

            </Swiper>
        )
    }

    renderShowInfo() {
        console.log('renderShowInfo', this.flightId)
        if (!this.flightId) return null;
        return (
            <Touchable style={{ padding: 5 }} onPress={this.onOpenImageInfo.bind(this, this.flightId)}>
                <Image
                    style={styles.image_close}
                    source={this.getResources().ic_group_info}
                />
            </Touchable>
        )
    }

    render() {
        let {
            imgList
        } = this.state;

        return (
            <View style={styles.container}>
                <StatusBar hidden={true} />
                <LoadingView
                    ref={(loading) => { this.loading = loading; }}
                    isShowOverlay={false}
                />

                {this.renderImageSwipe(imgList)}

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
        this.setState({
            isLoadEnd: true
        }, () => {
            if (this.loading)
                this.loading.hideLoading();
        })
    }

    onOpenImageInfo(flightId) {
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