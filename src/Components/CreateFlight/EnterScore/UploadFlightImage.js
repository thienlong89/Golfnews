import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    BackHandler
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import HeaderView from '../../HeaderView';
import PopupAttachImage from '../../Common/PopupAttachImage';
import PopupYesOrNo from '../../Common/PopupYesOrNo';
import MyView from '../../../Core/View/MyView';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import AppUtil from '../../../Config/AppUtil';
import { StackActions, NavigationActions } from 'react-navigation';
import ProgressUpload from '../../Common/ProgressUpload';
import LoadingView from '../../../Core/Common/LoadingView';
var urlencode = require('urlencode');
import Swiper from 'react-native-swiper';
import { deleteFlightById } from '../../../DbLocal/FinishFlightRealm';
import { scale, fontSize } from '../../../Config/RatioScale';

// 0: chua attach anh; 1: da attach anh, 2: dang upload, 3: upload lai, 4: hoan tat upload, 5: thoat, 6: gioi thieu
const bg_upload_btn = ['#C9C9C9', '#00C25D', '#FFFFFF', '#00C25D', '#00C25D', '#00ABA7', '#00C25D']

const resetHome = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'home_screen' })
    ]
});

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const imageWidth = width - 30;
const imageHeight = imageWidth * 2 / 3;
const MAX_IMG_LENGTH = 3;

export default class UploadFlightImage extends BaseComponent {

    constructor(props) {
        super(props);
        this.isIphoneX = this.getAppUtil().isIphoneX();
        this.userProfile = this.getUserInfo();
        this.facility = this.props.navigation.state.params.Facility != null ? this.props.navigation.state.params.Facility : '';
        this.roundModel = this.props.navigation.state.params.RoundItemModel;
        this.flightModel = this.roundModel ? this.roundModel.getFlight() : null;
        this.fromData = this.props.navigation.state.params.FromData;
        this.image_data = this.flightModel ? this.flightModel.getUrlScorecardArray() : [];
        this.state = {
            upload_state: 6, // 0: chua attach anh; 1: da attach anh, 2: dang upload, 3: upload lai, 4: hoan tat upload, 5: thoat
            upload_text: this.t('start_upper_case'),
            isError: false,
        }

        this.onBackPress = this.onBackPress.bind(this);
        this.onLoadStart = this.onLoadStart.bind(this);
        this.onLoadEnd = this.onLoadEnd.bind(this);
        this.deleteFLightClick = this.deleteFLightClick.bind(this);
        this.uploadButtonClick = this.uploadButtonClick.bind(this);
        this.onTakePhotoClick = this.onTakePhotoClick.bind(this);
        this.onImportGalleryClick = this.onImportGalleryClick.bind(this);
        this.onConfirmDeleteFlight = this.onConfirmDeleteFlight.bind(this);

    }

    render() {
        let {
            upload_state,
            isError,
            upload_text
        } = this.state;

        let imagesLength = this.image_data.length;

        let imagesView = this.image_data.map((image, index) => {
            return (
                <MyView hide={upload_state === 6} >
                    <Touchable style={styles.touchable_image_scorecard} onPress={this.onPressImage.bind(this, image, index)}>
                        <Image
                            style={styles.image_scorecard}
                            source={{ uri: image }}
                            resizeMethod={'resize'}
                            onLoadStart={this.onLoadStart}
                            onLoadEnd={this.onLoadEnd}
                        />
                    </Touchable>
                    <MyView style={styles.view_delete} hide={upload_state === 4 || upload_state === 5}>
                        <TouchableOpacity style={styles.touchable_close}
                            onPress={this.onRemoveUriImages.bind(this, index)}>
                            <Image
                                style={styles.img_close}
                                source={this.getResources().ic_x} />
                        </TouchableOpacity>
                    </MyView>

                    <MyView style={styles.view_line} hide={imagesLength === 1 || imagesLength - 1 === index} />

                </MyView>

            )
        })

        return (
            <View style={styles.container}>
                {this.renderLoading()}
                <HeaderView title={this.userProfile.getFullname()}
                    handleBackPress={this.onBackPress} />
                <View style={styles.center_content}>
                    <ScrollView
                        ref={(refScrollView) => { this.refScrollView = refScrollView }}
                        style={{ flex: 1 }}
                        onContentSizeChange={(contentWidth, contentHeight) => {
                            this.refScrollView.scrollToEnd({ animated: true });
                        }}>
                        <MyView hide={upload_state != 5}
                            style={styles.flight_info_container}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.flight_name}>{this.flightModel ? this.flightModel.getFlightName() : ''}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.play_time}>{this.flightModel ? this.flightModel.getDatePlayedDisplay() : ''}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.image_wait_process}>{this.roundModel ? this.roundModel.getTextDisplay() : this.t('image_wait_process')}</Text>
                        </MyView>

                        <View style={[styles.container_image,]}>
                            {/* <MyView hide={upload_state === 6}>
                            <Touchable style={styles.touchable_image_scorecard} onPress={this.onPressImage}>
                                <Image
                                    style={styles.image_scorecard}
                                    source={{ uri: image_uri }}
                                    resizeMethod={'resize'}
                                    onLoadStart={this.onLoadStart}
                                    onLoadEnd={this.onLoadEnd}
                                />
                            </Touchable>
                        </MyView>
                        <MyView hide={!isError} style={styles.error_container}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.error_text}>{this.t('upload_flight_image_error')}</Text>
                        </MyView> */}
                            {imagesView}

                            <MyView hide={!isError} style={styles.error_container}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.error_text}>{this.t('upload_flight_image_error')}</Text>
                            </MyView>

                            <MyView hide={upload_state != 6} style={styles.touchable_image_scorecard}>
                                <Swiper
                                    showsButtons={false}
                                    loop={false}
                                    showsPagination={true}
                                    width={imageWidth}
                                    style={{ justifyContent: 'center', alignItems: 'center' }}
                                    activeDotColor='#00ABA7'>
                                    <Image
                                        style={styles.image_scorecard}
                                        source={this.getResources().scorecard_sample1}
                                        resizeMethod={'resize'}
                                        onLoadStart={this.onLoadStart}
                                        onLoadEnd={this.onLoadEnd}
                                    />

                                    <Image
                                        style={styles.image_scorecard}
                                        source={this.getResources().scorecard_sample2}
                                        resizeMethod={'resize'}
                                        onLoadStart={this.onLoadStart}
                                        onLoadEnd={this.onLoadEnd}
                                    />
                                </Swiper>
                            </MyView>

                            <LoadingView
                                ref={(loading) => { this.loading = loading; }}
                                isShowOverlay={false}
                            />
                        </View>

                        <View style={styles.container_description}>
                            <MyView hide={upload_state != 6} style={styles.container_description}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.guide_upload_scorecard_header}>{this.t('guide_upload_scorecard_header')}</Text>
                                <Text allowFontScaling={global.isScaleFont} style={styles.guide_upload_scorecard}>{this.t('guide_upload_scorecard')}</Text>
                            </MyView>
                            <MyView hide={upload_state === 2 || upload_state === 4 || upload_state === 5 || upload_state === 6 || imagesLength === MAX_IMG_LENGTH}
                                style={styles.container_description}>
                                <Touchable style={styles.touchable_select_other_img}
                                    onPress={() => this.popupAttachImage.show()}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.chose_other_image}>{this.t('add_photo')}</Text>
                                </Touchable>
                            </MyView>

                            <MyView hide={upload_state != 5}
                                style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Touchable onPress={this.deleteFLightClick}>
                                    <Image
                                        style={styles.icon_complete}
                                        source={this.getResources().ic_trash}
                                    />
                                </Touchable>
                            </MyView>


                            <MyView hide={upload_state != 4} style={styles.container_description}>

                                <Image
                                    style={styles.icon_complete}
                                    source={this.getResources().ic_complete}
                                />
                                <Text allowFontScaling={global.isScaleFont} style={styles.upload_success}>{this.t('upload_success')}</Text>
                                <Text allowFontScaling={global.isScaleFont} style={styles.upload_success_msg}>{this.t('upload_success_msg')}</Text>
                            </MyView>
                        </View>
                    </ScrollView>
                </View>
                <View>
                    <Touchable style={[styles.touchable_upload_btn,
                    {
                        backgroundColor: bg_upload_btn[upload_state],
                        paddingBottom: this.isIphoneX ? 30 : 20
                    }
                    ]}
                        disabled={upload_state === 0}
                        onPress={this.uploadButtonClick}>
                        <Text allowFontScaling={global.isScaleFont} style={[styles.upload_txt, { color: upload_state === 2 ? '#383838' : '#FFFFFF' }]}>{upload_text}</Text>
                    </Touchable>
                </View>

                <PopupAttachImage
                    ref={(popupAttachImage) => { this.popupAttachImage = popupAttachImage; }}
                    onTakePhotoClick={this.onTakePhotoClick}
                    onImportGalleryClick={this.onImportGalleryClick} />

                <PopupYesOrNo
                    ref={(popupDeleteFlight) => { this.popupDeleteFlight = popupDeleteFlight; }}
                    content={this.t('delete_flight_content')}
                    confirmText={this.t('agree')}
                    cancelText={this.t('cancel')}
                    onConfirmClick={this.onConfirmDeleteFlight} />
                {this.renderMessageBar()}
                <ProgressUpload
                    ref={(progressUpload) => { this.progressUpload = progressUpload; }}
                />
            </View>
        );
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();
        if (this.flightModel) {
            this.setState({
                upload_state: 5,
                upload_text: this.t('exit')
            });
        }
        //  else {
        //     this.popupAttachImage.show();
        // }
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    handleHardwareBackPress() {
        let self = this;
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
            self.onBackPress();
            return true;
        });
    }

    onBackPress() {
        if (this.state.upload_state === 4) {
            this.props.navigation.dispatch(resetHome);
        } else {
            if (this.props.navigation != null) {
                this.props.navigation.goBack();
            }
        }
        return true;
    }

    onLoadStart() {
        if (this.loading)
            this.loading.showLoading();
    }

    onLoadEnd() {
        if (this.loading)
            this.loading.hideLoading();
    }

    async onTakePhotoClick() {
        let imageUri = await AppUtil.onTakePhotoClick(false);
        // console.log('imageUri', imageUri);

        // this.image_data.push(imageUri.path);
        if (!imageUri.didCancel) {
            this.getAppUtil().resizeImage(imageUri.path, imageUri.width, imageUri.height, imageUri.size)
            .then(({ uri }) => {
                console.log('uri', uri);
                this.image_data.push(uri);
                this.setState({
                    isError: false,
                    upload_state: 1
                }, () => {
                });
            })
            .catch(err => {
                console.log(err);
                this.image_data.push(imageUri.path);
                this.setState({
                    isError: false,
                    upload_state: 1
                }, () => {
                });
            });
            // this.setState({
            //     isError: false,
            //     upload_state: 1
            // }, () => {
            // });
        }

    }

    async onImportGalleryClick() {
        let imageUri = await AppUtil.onImportGalleryClick(false);
        // console.log('imageUri', Platform.OS === 'android' ? 'file://' + imageUri.path : imageUri);

        console.log('onImportGalleryClick', this.image_data)
        if (!imageUri.didCancel) {
            this.getAppUtil().resizeImage(imageUri.path, imageUri.width, imageUri.height, imageUri.size)
                .then(({ uri }) => {
                    console.log('uri', uri);
                    this.image_data.push(uri);
                    this.setState({
                        isError: false,
                        upload_state: 1
                    }, () => {
                    });
                })
                .catch(err => {
                    console.log(err);
                    this.image_data.push(imageUri.path);
                    this.setState({
                        isError: false,
                        upload_state: 1
                    }, () => {
                    });
                });
        }
    }

    onRemoveUriImages(index) {
        this.image_data.splice(index, 1);
        this.setState({});
    }

    onPressImage(image, index) {
        if (this.state.upload_state != 6)
            this.props.navigation.navigate('show_scorecard_image', {
                'imageUri': image,
                'imgList': this.image_data,
                'position': index,
                onCloseImage: this.onCloseViewImage.bind(this)
            });
    }

    onCloseViewImage() {
        this.rotateToPortrait();
    }

    uploadButtonClick() {
        if (this.state.upload_state === 2) {

        } else if (this.state.upload_state === 4) {
            this.props.navigation.dispatch(resetHome);
        } else if (this.state.upload_state === 5) {
            this.props.navigation.goBack();
        } else if (this.state.upload_state === 6) {
            this.setState({
                upload_state: 0,
                upload_text: this.t('upload')
            }, () => this.popupAttachImage.show())
        } else {
            this.requestUploadScorecard();
        }
    }

    requestUploadScorecard() {
        if (this.image_data.length > 0) {
            this.progressUpload.showLoading();
            this.setState({
                upload_state: 2,
                upload_text: this.t('upload_processing')
            });

            let self = this;
            let players = this.fromData.players.map((player) => {
                return `${player.user_id}:${player.tee_id}`
            });
            let paths;
            if (this.fromData.path1) {
                paths = urlencode(`${this.fromData.path1.id}`);
            }
            if (this.fromData.path2) {
                paths = paths + urlencode(`,${this.fromData.path2.id}`);
            } else {
                paths = paths + urlencode(',');
            }
            if (this.fromData.path3) {
                paths = paths + urlencode(`,${this.fromData.path3.id}`);
            } else {
                paths = paths + urlencode(',');
            }
            console.log('requestUploadScorecard.players', players);
            players = urlencode(`${JSON.stringify(players)}`);

            let params = `${this.facility.getId()}&teetime=${this.fromData.teetime}&path=${paths}&players=${players}&type=${this.fromData.type}&is_hide_this_flight=${this.fromData.is_hide_this_flight}`;
            // params = `${this.facility.getId()}&teetime=${this.fromData.teetime}`
            let url = this.getConfig().getBaseUrl() + ApiService.create_flight_by_image(params);
            console.log('requestUploadScorecard', url, params);
            AppUtil.upload_mutil(url, this.image_data,
                this.onUploadSuccess.bind(this),
                (error) => {
                    self.progressUpload.hideLoading();
                    try {
                        self.showErrorMsg(error);
                    } catch (error) {

                    }
                }, (progress) => {
                    self.progressUpload.setProgress(progress);
                });
        }

    }

    onUploadSuccess(jsonData) {
        this.progressUpload.hideLoading();
        console.log('onUploadSuccess', jsonData);
        if (jsonData != null && jsonData.hasOwnProperty('error_code')) {
            if (jsonData['error_code'] === 0) {
                global.shouldUpdateFinishFlight = true;
                this.setState({
                    isError: false,
                    upload_state: 4,
                    upload_text: this.t('complete')
                });
            } else {
                this.setState({
                    isError: true,
                    upload_state: 3,
                    upload_text: this.t('re_upload')
                });
            }
        }
    }

    deleteFLightClick() {
        this.popupDeleteFlight.show();
    }

    onConfirmDeleteFlight() {
        this.loading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.out_flight(this.roundModel.getFlightId());
        console.log('url', url);
        Networking.httpRequestGet(url, this.onDeleteFlightResponse.bind(this, this.roundModel.getFlightId()), () => {
            //time out
            self.loading.hideLoading();
            self.showErrorMsg(self.t('time_out'))
        });
    }

    onDeleteFlightResponse(flightId, jsonData) {
        this.loading.hideLoading();
        console.log('onDeleteFlightResponse', jsonData);
        if (jsonData != null && jsonData.hasOwnProperty('error_code')) {
            if (jsonData['error_code'] === 0) {
                deleteFlightById(flightId);
                this.props.navigation.dispatch(resetHome);
            } else {
                if (jsonData.hasOwnProperty("error_msg")) {
                    let error = jsonData['error_msg'];
                    this.showErrorMsg(error);
                }
            }
        }

    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2',
    },
    center_content: {
        flex: 1,
        backgroundColor: '#F2F2F2',
        paddingBottom: scale(10)
    },
    touchable_upload_btn: {
        paddingTop: scale(20),
        paddingBottom: scale(20),
        justifyContent: 'center',
        alignItems: 'center'
    },
    upload_txt: {
        fontSize: fontSize(15),
    },
    container_image: {
        margin: scale(10),
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container_description: {
        // flex: 1,
        alignItems: 'center'
    },
    image_scorecard: {
        resizeMode: 'contain',
        // flex: 1,
        width: imageWidth,
        height: imageHeight
    },
    touchable_image_scorecard: {
        // flex: 1,
        width: imageWidth,
        height: imageHeight,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chose_other_image: {
        color: '#5E5E5E',
        fontSize: fontSize(15),
        paddingLeft: scale(10),
        paddingRight: scale(10),
    },
    touchable_select_other_img: {
        padding: scale(10),
        borderColor: '#B2B2B2',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: scale(20),
    },
    error_container: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        top: 0,
        left: 0,
        backgroundColor: '#FFFFFF',
        opacity: 0.85,
        justifyContent: 'center',
        alignItems: 'center'
    },
    error_text: {
        color: '#FF0000',
        fontSize: fontSize(16)
    },
    icon_complete: {
        height: scale(30),
        width: scale(30),
        marginTop: scale(10),
        marginBottom: scale(10),
        resizeMode: 'contain'
    },
    upload_success: {
        color: '#333333',
        fontSize: fontSize(17),
        fontWeight: 'bold',
        marginBottom: scale(5),
    },
    upload_success_msg: {
        color: '#333333',
        fontSize: fontSize(17),
        marginLeft: scale(20),
        marginRight: scale(20),
        textAlign: 'center'
    },
    guide_upload_scorecard_header: {
        fontSize: fontSize(17),
        marginLeft: scale(20),
        marginRight: scale(20),
    },
    guide_upload_scorecard: {
        color: 'red',
        fontSize: fontSize(17),
        marginLeft: scale(20),
        marginRight: scale(20),
        // textAlign: 'center'
    },
    play_time: {
        color: '#8C8C8C',
        fontSize: fontSize(15),
    },
    flight_name: {
        color: '#333333',
        fontSize: fontSize(17),
        fontWeight: 'bold'
    },
    image_wait_process: {
        color: 'red',
        fontSize: fontSize(17),
        marginTop: scale(25),
    },
    flight_info_container: {
        marginTop: scale(10),
        marginLeft: scale(10),
        marginRight: scale(10),
    },
    img_close: {
        width: scale(20),
        height: scale(20),
        resizeMode: 'contain',
        tintColor: '#fff'
    },
    touchable_close: {
        // position: 'absolute',
        // right: 5,
        // top: 5,
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.1)'
    },
    view_delete: {
        position: 'absolute',
        right: 5,
        top: 5,
    },
    view_line: {
        height: scale(6),
        backgroundColor: '#F2F2F2'
    }
}); 