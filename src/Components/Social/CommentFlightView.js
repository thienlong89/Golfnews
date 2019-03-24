import React from 'react';
import {
    // Platform,
    StyleSheet,
    // Text,
    StatusBar,
    View,
    // KeyboardAvoidingView,
    Dimensions,
    Image,
    FlatList,
    // TouchableOpacity,
    // ScrollView,
    Text,
    BackHandler,
    Keyboard
} from 'react-native';
// import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import FlightSummaryModel from '../../Model/CreateFlight/Flight/FlightSummaryModel';
// import FinishedFlightItem from '../Home/FinishedFlightItem';
// import InputBoxCommentView from './Item/InputBoxCommentView';
import MyView from '../../Core/View/MyView';
import DrawerView from '../Common/DrawerView';
import InteractiveTabView from './InteractiveTabView';
// import LikeCommentItemView from './Item/LikeCommentItemView';
// import CommentListView from './Item/CommentListView';
// import RoundItemModel from '../../Model/Home/RoundItemModel';
import CommentManager from '../Comments/CommentManager';
import CommentScreen from '../Comments/CommentScreen';
import LikeCommentHomeView from '../Comments/LikeView';
import HeaderFlightView from './HeaderCommentFlight';
import ComponentKeyboard from './ComponentKeyboard';
import { scale, fontSize } from '../../Config/RatioScale';
import PopupAttachImage from '../Common/PopupAttachImage';
import ImageFlightItemList from './Item/ImageFlightItemList';
import { updateFlight } from '../../DbLocal/FinishFlightRealm';
import CommentImageGridView from './Item/CommentImageGridView';
import UploadPostProgress from '../CLB/Items/UploadPostProgress';
// import FinishFlightRealm from '../../DbLocal/FinishFlightRealm';

import ListennerCommentManager from '../Comments/ListennerCommentManager';

const width = Dimensions.get("window").width;

export default class CommentFlightView extends BaseComponent {

    constructor(props) {
        super(props);
        // this.refLikeComment = [];
        this.flight = this.props.navigation.state.params.flight;
        this.isAddImage = this.props.navigation.state.params.isAddImage;
        this.uid = this.getAppUtil().replaceUser(this.getUserInfo().getId());
        this.userProfile = this.getUserInfo().getUserProfile();
        try {
            this.flightId = this.flight.getFlightId();
            // this.flight_name = this.flight ? this.flight.getFlight().getFlightName() : '';
        } catch (error) {
            this.flightId = this.flight.getId();
            // this.flight_name = this.flight ? this.flight.getFlightName() : '';
        }

        this.comment_key = "flight";
        // this.commentManager = new CommentManager;
        this.commentManager = ListennerCommentManager.getListennerComment(this.comment_key + '-' + this.flightId);
        this.imageUploaded = false;
        this.imageCount = 0;
        this.state = {
            flightComment: '',
            isShowInteractive: false,
            keyboard_height: 0,
            keyboard_show: false,
            imgStatusList: [],
            existMe: false,
            isDataLoaded: false
        }

        this.onRequestClose = this.onRequestClose.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
        this.onViewInteractUserPress = this.onViewInteractUserPress.bind(this);
        this.onLikeCallback = this.onLikeCallback.bind(this);
        this.onAddPhotoAlbum = this.onAddPhotoAlbum.bind(this);
        this.onTakePhotoClick = this.onTakePhotoClick.bind(this);
        this.onImportGalleryClick = this.onImportGalleryClick.bind(this);
        this.onImageCommentPress = this.onImageCommentPress.bind(this);
        this.uploadImageCallback = this.uploadImageCallback.bind(this);

        this.onCommentClick = this.onCommentClick.bind(this);
    }

    /**
     * Khoi tao tham so comment
     */

    initComment() {
        console.log('initComment ------------------------ ', this.flightId);
        if (!this.flightId) return;
        let id = this.flightId;

        this.commentManager.init(this.comment_key, id, this.renderView.bind(this), this.handleSendComment.bind(this));
    }

    handleSendComment(message, error) {
        if (this.commentScreen) {
            message.topic = this.commentManager.generateId();
            this.commentScreen.handleSendComment(message, error);
        }
    }

    componentDidMount() {
        console.log("componentDidMount----------------------------------------------");
        this.getFlightComment();
        // this.initComment();
        // this.commentManager.listenForItems();
        // this.commentManager.loadTotalComment();
        // if (this.commentScreen) {
        //     this.commentScreen.sendMsgCallback = this.sendComment.bind(this);
        //     this.commentScreen.hideHeaderCallback = this.hideHeaderView.bind(this);
        //     this.commentScreen.setTypeTopic(this.flightId, global.type_topic_comment.FLIGHT);
        //     this.commentScreen.updateFontCallback = this.changeFontSize.bind(this);
        // }
        this.rotateToPortrait();
        this.handleHardwareBackPress();
        this.registerMessageBar();
        // this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        // this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
        if (this.isAddImage) {
            this.popupAttachImage.show();
        }
    }

    getFlightComment() {
        if (this.internalLoading)
            this.internalLoading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.view_detail_status_for_flight(this.flightId);
        console.log('url', url);
        Networking.httpRequestGet(url,
            (jsonData) => {
                if (self.internalLoading)
                    self.internalLoading.hideLoading();

                if (jsonData.error_code === 0) {
                    let flight = new FlightSummaryModel();
                    flight.parseData(jsonData.data);
                    let existMe = flight.getUserRounds().findIndex((user) => {
                        console.log('user.user_id', user.user_id)
                        return self.getAppUtil().replaceUser(user.user_id) === self.uid;
                    });
                    console.log('existMe', existMe);
                    let imgList = flight.getListImgUploadStatus();
                    self.setState({
                        flightComment: flight,
                        imgStatusList: imgList,
                        existMe: existMe !== -1,
                        isDataLoaded: true
                    }, () => {
                        this.imageCount = imgList.length;
                        if (this.refCommentImageGridView)
                            this.refCommentImageGridView.setData(imgList);
                        let postStatus = self.flight.getPostStatus();
                        if (!postStatus) {
                            let total_feel = flight.getPostStatus();
                            let type = flight.getUserStatus();
                            self.flight.setPostStatus(total_feel);
                            self.flight.setUserStatus(type);
                            if (self.likeCommentItemView) {
                                self.likeCommentItemView.setStatus({ total_feel, type })
                            }
                        }
                    })
                } else {
                    self.showErrorMsg(jsonData.error_msg);
                }
                // console.log('getFlightComment', jsonData)
            }, () => {
                //time out
                if (self.internalLoading)
                    self.internalLoading.hideLoading();
                self.showErrorMsg(self.t('time_out'));
            });
    }

    changeFontSize(font) {
        this.commentManager.changeFontComment(font);
    }

    /**
     * Ban phim an
     * @param {*} e 
     */
    _keyboardDidHide(e) {
        this.headerFlight.setKeyBoardShow(false);
        this.componentKeyboard.handleKeyboard(0, false);
        // this.setState({
        //     keyboard_show: false,
        //     keyboard_height: 0
        // });
    }

    /**
     * an hien header cua flight
     */
    hideHeaderView(show) {
        this.headerFlight.setKeyBoardShow(show);
    }

    /**
     * ban phim show
     * @param {*} e 
     */
    _keyboardDidShow(e) {
        console.log("chieu cao ban phim la : ", e.endCoordinates.height);
        this.headerFlight.setKeyBoardShow(true);
        this.componentKeyboard.handleKeyboard(e.endCoordinates.height, true);
        this.commentScreen.hideListIcon();
        setTimeout(() => {
            this.commentScreen.scrollEnd();
        }, 50);
    }

    /**
     * send comment
     * @param {*} msg 
     */
    sendComment(msg) {
        this.commentManager.sendMsg(msg);
    }

    renderView(listData) {
        if (this.likeCommentItemView) {
            let count = this.commentManager.countComment;
            this.likeCommentItemView.updateCountComment(count);
            let postStatus = this.flight.getPostStatus();
            postStatus.comment_count = count;
        }
        if (this.commentScreen) {
            this.commentScreen.renderView(listData);
        }
    }

    // renderImageList(existMe, imgStatusList) {
    //     if (!existMe) return null;

    //     return (
    //         <View>
    //             <View style={{ marginLeft: scale(5) }}>
    //                 <FlatList
    //                     data={imgStatusList}
    //                     ItemSeparatorComponent={() => <View style={{ width: scale(5) }} />}
    //                     horizontal={true}
    //                     renderItem={({ item, section, index }) =>
    //                         <ImageFlightItemList
    //                             data={item}
    //                             index={index}
    //                             flightId={this.flightId}
    //                             onOpenImage={this.onImageCommentPress}
    //                             uploadCallback={this.uploadImageCallback} />
    //                     }
    //                 />
    //             </View>
    //             <Text allowFontScaling={global.isScaleFont} style={styles.txt_add_photo}
    //                 onPress={this.onAddPhotoAlbum}>
    //                 {this.t('add_photo_to_album')}
    //             </Text>
    //         </View>
    //     )
    // }

    renderImageList(existMe, imgStatusList) {
        if (!existMe) return null;

        return (
            <CommentImageGridView
                ref={(refCommentImageGridView) => { this.refCommentImageGridView = refCommentImageGridView; }}
                onAddMoreImagePress={this.onAddPhotoAlbum}
                onOpenImage={this.onImageCommentPress} />
        )
    }

    renderHeader(isDataLoaded, flightComment) {
        if (isDataLoaded) {
            return (
                <View style={styles.view_flight}>
                    <HeaderFlightView ref={(headerFlight) => { this.headerFlight = headerFlight; }}
                        flight={flightComment} />
                </View>
            )
        }

        return null
    }

    onCommentClick() {
        // if (this.props.onCommentClick) {
        //     this.props.onCommentClick(round);
        // }
        // let navigation = StaticProps.getAppSceneNavigator();
        let { navigation } = this.props;
        if (navigation) {
            navigation.navigate('base_comment_flight_view',
                {
                    onCommentBack: this.onCommentBackListener.bind(this),
                    'flight': this.flight
                });
        }
    }

    onCommentBackListener(flight) {
        // updateFlight(this.flight);
        let total_feel = flight.getPostStatus();
        console.log('onCommentBackListenerrrrr', total_feel)
        let type = this.flight.getUserStatus();
        if (this.likeCommentItemView) {
            this.likeCommentItemView.setStatus({ total_feel, type })
        }
        this.flight.setPostStatus(total_feel);
        this.flight.setUserStatus(type);
        // this.finishFlightList[itemId] = round;
    }

    render() {
        let {
            isShowInteractive,
            imgStatusList,
            flightComment,
            existMe,
            isDataLoaded
        } = this.state;

        return (
            <View style={styles.container}>
                <StatusBar hidden={false} />
                <HeaderView title={this.t('comment')} handleBackPress={this.onBackPress} />
                <UploadPostProgress ref={(refUploadPostProgress) => { this.refUploadPostProgress = refUploadPostProgress }} />
                <View style={styles.view_content}>

                    {this.renderHeader(isDataLoaded, flightComment)}
                    {this.renderImageList(existMe, imgStatusList)}

                    {/* <Image
                        style={styles.img_dash_line}
                        source={this.getResources().ic_dash_line}
                    /> */}

                    <LikeCommentHomeView
                        ref={(likeCommentItemView) => { this.likeCommentItemView = likeCommentItemView; }}
                        flightId={this.flightId}
                        stt_id={this.flightId}
                        isDisable={false}
                        onCommentClick={this.onCommentClick}
                        postStatus={this.flight ? this.flight.getPostStatus() : {}}
                        user_feel_status={this.flight ? this.flight.getUserStatus() : 0}
                        postType={1}
                        onViewInteractUserPress={this.onViewInteractUserPress}
                        likeCallback={this.onLikeCallback} />
                    <View style={styles.line} />
                    <View style={{ flex: 1 }} />
                    {/*<View style={styles.line} />
                    <CommentScreen ref={(commentScreen) => { this.commentScreen = commentScreen; }} />
                    <ComponentKeyboard ref={(componentKeyboard) => { this.componentKeyboard = componentKeyboard; }} /> */}
                    {this.renderInternalLoading()}
                </View>

                <PopupAttachImage
                    ref={(popupAttachImage) => { this.popupAttachImage = popupAttachImage; }}
                    onTakePhotoClick={this.onTakePhotoClick}
                    onImportGalleryClick={this.onImportGalleryClick} />

                {this.renderMessageBar()}
            </View>
        );
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
        if (this.backHandler) {
            this.backHandler.remove();
        }
        // if (this.commentManager) {
        //     this.commentManager.offComment();
        // }
        // if (this.keyboardDidHideListener) this.keyboardDidHideListener.remove();
        // if (this.keyboardDidShowListener) this.keyboardDidShowListener.remove();
    }

    handleHardwareBackPress() {
        let self = this;
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
            self.onBackPress();
            return true;
        });
    }

    onBackPress() {
        if (this.commentScreen && this.commentScreen.checkActionBack()) {
            return true;
        }
        if (this.props.navigation != null) {
            this.props.navigation.goBack();
        }
        let {
            onCommentBack,
            addImageCallback
        } = this.props.navigation.state.params;
        if (onCommentBack) {
            try {
                if (this.imageCount)
                    this.flight.total_feel.img_upload_count = this.imageCount;
                onCommentBack(this.flight);
            } catch (error) {
                onCommentBack(this.flight);
            }

        }
        if (addImageCallback && this.imageUploaded) {
            addImageCallback();
        }
        return true;
    }

    onViewInteractUserPress() {
        // this.setState({
        //     isShowInteractive: true
        // }, () => {
        //     if (this.refDrawerView)
        //         this.refDrawerView.slideUp();
        // })
        // let navigation = StaticProps.getAppSceneNavigator();
        if (this.props.navigation) {
            this.props.navigation.navigate('interactive_tab_view', {
                'flightId': this.flightId,
                'uid': this.uid,
                'statusType': 1
            })
        }
    }

    onLikeCallback({ total_feel, type }) {
        this.flight.setPostStatus(total_feel);
        this.flight.setUserStatus(type);
        // updateFlight(round);
    }

    onRequestClose() {
        if (this.refDrawerView)
            this.refDrawerView.slideDown();
        setTimeout(() => {
            this.setState({
                isShowInteractive: false
            })
        }, 500)

    }

    onAddPhotoAlbum() {
        this.popupAttachImage.show()
    }

    onTakePhotoClick = async () => {
        let imageUri = await this.getAppUtil().onTakePhotoClick(false);

        if (!imageUri.didCancel) {
            this.getAppUtil().resizeImage(imageUri.path, imageUri.width, imageUri.height, imageUri.size)
                .then(({ uri }) => {
                    console.log('uri', uri)
                    this.requestUpload([uri]);
                })
                .catch(err => {
                    console.log(err);
                    this.requestUpload([imageUri.path]);
                });

        }

    }

    onImportGalleryClick = async () => {
        let imageUris = await this.getAppUtil().onImportGalleryClick(false, true);
        let listData = await Promise.all(imageUris.map(async (imageUri) => {
            let uri = await this.getAppUtil().resizeImage(imageUri.path, imageUri.width, imageUri.height, imageUri.size)
                .then(({ uri }) => {
                    console.log('uri', uri)
                    return uri;
                })
                .catch(err => {
                    console.log(err);
                    return imageUri.path;
                });
            return uri;
        }))

        console.log('onImportGalleryClick1', listData)
        if (imageUris.length > 0) {
            this.requestUpload(listData);
        }
    }

    // requestUpload(imgPathList) {
    //     if (imgPathList) {
    //         let {
    //             imgStatusList
    //         } = this.state;
    //         for (let imgPath of imgPathList) {
    //             let objData = {};
    //             objData.avatar = this.userProfile ? this.userProfile.avatar : '';
    //             objData.isUploading = true;
    //             objData.img_path = imgPath
    //             imgStatusList.unshift(objData);
    //         }

    //         this.setState({
    //             imgStatusList: imgStatusList
    //         })
    //     }

    // }

    requestUpload(imgPath) {
        if (imgPath) {
            if (this.refUploadPostProgress)
                this.refUploadPostProgress.setUploadProgress(0);
            let self = this;
            let url = this.getConfig().getBaseUrl() + ApiService.user_add_img_status_flight(this.flightId);
            console.log('requestUpload.url', url);
            this.getAppUtil().upload_mutil(url, imgPath,
                this.onUploadSuccess.bind(this),
                (error) => {
                    if (self.refUploadPostProgress)
                        self.refUploadPostProgress.setUploadProgress(0);
                    try {
                        self.showErrorMsg(error);
                    } catch (error) {

                    }
                }, (progress) => {
                    if (self.refUploadPostProgress)
                        self.refUploadPostProgress.setUploadProgress(progress);

                });
        }

    }

    onUploadSuccess(jsonData) {
        if (this.refUploadPostProgress)
            this.refUploadPostProgress.setUploadProgress(0);
        let {
            imgStatusList
        } = this.state;
        this.imageCount++;
        console.log('onUploadSuccess', jsonData);
        if (jsonData != null && jsonData.hasOwnProperty('error_code')) {
            if (jsonData['error_code'] === 0) {
                this.imageUploaded = true;
                let dataList = jsonData.data;
                if (dataList instanceof Array && dataList.length > 0) {
                    let avatar = this.userProfile ? this.userProfile.avatar : '';
                    dataList = dataList.map((url) => {
                        return {
                            avatar: avatar,
                            img_path: url,
                        }
                    })
                    let list = [...dataList, ...this.state.imgStatusList];
                    this.setState({
                        imgStatusList: list
                    }, () => {
                        if (this.refCommentImageGridView)
                            this.refCommentImageGridView.setData(list);

                    })
                }

            } else {
                try {
                    this.showErrorMsg(jsonData.error_msg);
                } catch (error) {

                }
            }
        }
    }

    uploadImageCallback(url, index) {
        let {
            imgStatusList
        } = this.state;
        imgStatusList[index].avatar = this.userProfile ? this.userProfile.avatar : '';
        imgStatusList[index].img_path = url;
        imgStatusList[index].created_at_timestamp = (new Date()).getTime();
        imgStatusList[index].isUploading = false;

        let total_feel = this.flight.getPostStatus();
        total_feel.img_upload_count++;
        this.flight.setPostStatus(total_feel);
    }

    onImageCommentPress(uri, index) {
        this.props.navigation.navigate('image_comment_flight_slide', {
            'imgList': this.state.imgStatusList,
            'index': index
        })
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    view_content: {
        flex: 1,
        justifyContent: 'space-between'
    },
    item_friend_flight_container: {
        //flex: 1,
    },
    item_friend_flight: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 10,
        marginRight: 10
    },
    flight_name: {
        flex: 3,
        color: '#1A1A1A',
        fontSize: 16,
        textAlignVertical: 'center'
    },
    flight_time: {
        flex: 1,
        color: '#B8B8B8',
        fontSize: 13,
        textAlignVertical: 'center',
        textAlign: 'right'
    },
    img_dash_line: {
        width: width,
        height: 2,
        resizeMode: 'contain',
        marginBottom: 5
    },
    view_like_group: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon_heart: {
        width: 23,
        height: 23,
        resizeMode: 'contain'
    },
    view_heart: {
        position: 'absolute',
        zIndex: 3,
        width: 23,
    },
    view_like: {
        position: 'absolute',
        zIndex: 2,
        width: 23,
    },
    view_dislike: {
        position: 'absolute',
        zIndex: 1,
        width: 23,
    },
    view_count_group: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
    txt_comment: {
        color: '#555555',
        fontSize: 13
    },
    line: {
        backgroundColor: '#E9E9E9',
        height: 1,
        // marginRight: 10,
        // marginLeft: 10,
        // marginBottom: 10
    },
    view_like_comment: {
        flexDirection: 'row'
    },
    view_like_btn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_comment: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon_like: {
        width: 16,
        height: 16,
        resizeMode: 'center',
        marginRight: 4
    },
    txt_like: {
        fontSize: 12
    },
    img_comment: {
        width: 17,
        height: 17,
        resizeMode: 'contain',
        marginRight: 5
    },
    view_ls_comment: {
        flex: 1
    },
    view_flight: {
        marginLeft: scale(5),
        marginRight: scale(5),
        marginTop: scale(10),
        marginBottom: scale(10),
        borderRadius: scale(8),
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.3)',
        // shadowColor: 'rgba(0, 0, 0, 0.3)',
        // shadowOffset: {
        //     width: 0,
        //     height: 5
        // },
        // shadowRadius: scale(10),
        // shadowOpacity: 1.0,
        // elevation: 1,
        paddingTop: scale(5),
        paddingBottom: scale(5)
    },
    txt_add_photo: {
        color: '#00ABA7',
        fontSize: fontSize(15),
        textAlign: 'center',
        paddingTop: scale(10),
        paddingBottom: scale(10)
    }
});