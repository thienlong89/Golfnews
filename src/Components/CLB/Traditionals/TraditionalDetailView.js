import React from 'react';
import {
    Platform,
    StyleSheet,
    StatusBar,
    Text,
    View,
    ScrollView,
    Image,
    ImageBackground,
    BackHandler,
    TouchableOpacity,
    Animated
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import HeaderView from '../../HeaderView';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import ImageLoad from '../../Common/ImageLoad';
import MyView from '../../../Core/View/MyView';
import PopupYesOrNo from '../../Common/PopupYesOrNo';
import ClubEventDetailInfo from '../Event/ClubEventDetailInfo';
import PopupAttachImage from '../../Common/PopupAttachImage';
import TraditionalImageList from './TraditionalImageList';
import UploadPostProgress from '../Items/UploadPostProgress';
import ImageResizer from 'react-native-image-resizer';

const HEADER_COLLAPSED_HEIGHT = 80;

export default class TraditionalDetailView extends BaseComponent {

    constructor(props) {
        super(props);

        this.isIphoneX = this.getAppUtil().isIphoneX();
        let { eventProps, isNewCreated, eventId, clubId, isAddImage } = this.props.navigation.state.params;
        this.clubId = clubId;
        this.sourceIntro = this.clubId ? true : false;
        this.eventId = eventProps ? eventProps.getId() : eventId;
        this.isAddImage = isAddImage;
        this.userId = this.getUserInfo().getId();
        this.isMustUpdate = isNewCreated ? true : false;
        this.userProfile = this.getUserInfo().getUserProfile();
        this.avatar = this.getUserInfo().getUserAvatar();
        this.state = {
            image_uri: null,
            eventDetailModel: null,
            isCreator: true,

            scrollY: new Animated.Value(0),
            header_expanded_height: 280
        }

        this.teeCourse = this.teeCourseResponse.bind(this);
        this.onCommentEvent = this.onCommentEventPress.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
        this.onAddImagePress = this.onAddImagePress.bind(this);
        this.onHeaderLayout = this.onHeaderLayout.bind(this);
        this.onConfirmAction = this.onConfirmAction.bind(this);
        this.onImportGalleryClick = this.onImportGalleryClick.bind(this);
        this.onTakePhotoClick = this.onTakePhotoClick.bind(this);
        this.onViewInteractUserPress = this.onViewInteractUserPress.bind(this);
    }

    render() {
        let {
            image_uri,
            eventDetailModel,
            isCreator,
            scrollY,
            header_expanded_height,
         } = this.state;

        const headerHeight = scrollY.interpolate({
            inputRange: [0, header_expanded_height - HEADER_COLLAPSED_HEIGHT],
            outputRange: [header_expanded_height, HEADER_COLLAPSED_HEIGHT],
            extrapolate: 'clamp'
        });
        const heroTitleOpacity = scrollY.interpolate({
            inputRange: [0, header_expanded_height - HEADER_COLLAPSED_HEIGHT],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        });

        return (
            <View style={[styles.container, this.isIphoneX ? { paddingBottom: 15 } : {}]}>
                <StatusBar hidden={false} />
                <Animated.View style={[{
                    backgroundColor: 'rgba(0,0,0,0)',
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    left: 0,
                    zIndex: 2
                }, { height: headerHeight }]}>
                    <HeaderView
                        title={this.t('event')}
                        handleBackPress={this.onBackPress}
                        iconMenu={this.getResources().ic_image_add}
                        onIconMenuClick={this.onAddImagePress}
                        iconMenuStyle={styles.img_share} />
                    <UploadPostProgress ref={(refUploadPostProgress) => { this.refUploadPostProgress = refUploadPostProgress }} />

                    <Animated.View style={[{ opacity: heroTitleOpacity }]}
                    >
                        <View onLayout={this.onHeaderLayout}>

                            <ClubEventDetailInfo
                                ref={(refClubEventDetailInfo) => { this.refClubEventDetailInfo = refClubEventDetailInfo }}
                                eventId={this.eventId}
                                teeCourse={this.teeCourse}
                                // onUpdateEventPress={this.onUpdateEvent}
                                // onCommentEventPress={this.onCommentEvent}
                                onViewInteractUserPress={this.onViewInteractUserPress}
                                isAppointment={this.isAppointment}
                                navigation={this.props.navigation}
                                isAllowEdit={false} />
                            {/* <View style={styles.line} /> */}

                        </View>
                    </Animated.View>
                </Animated.View>

                <ScrollView
                    ref={(refScrollView) => { this.refScrollView = refScrollView; }}
                    contentContainerStyle={{ paddingTop: header_expanded_height }}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        {
                            // useNativeDriver: true,
                            listener: event => {
                                const offsetY = event.nativeEvent.contentOffset.y
                                // do something special
                                // this.isCloseToBottom(event.nativeEvent)

                            },
                        },
                    )}
                    scrollEventThrottle={16}
                >

                    <View style={styles.container}>
                        <TraditionalImageList
                            ref={(refTraditionalImageList) => { this.refTraditionalImageList = refTraditionalImageList; }}
                            clubId={this.eventId}
                            navigation={this.props.navigation} />

                    </View>
                </ScrollView>
                <PopupYesOrNo
                    ref={(refPopupYesOrNo) => { this.refPopupYesOrNo = refPopupYesOrNo; }}
                    content={''}
                    confirmText={this.t('agree')}
                    cancelText={this.t('cancel')}
                    onConfirmClick={this.onConfirmAction} />

                <PopupAttachImage
                    ref={(popupAttachImage) => { this.popupAttachImage = popupAttachImage; }}
                    onTakePhotoClick={this.onTakePhotoClick}
                    onImportGalleryClick={this.onImportGalleryClick} />


                {this.renderMessageBar()}
                {this.renderInternalLoading()}
            </View>
        );
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();

        if(this.isAddImage){
            this.popupAttachImage.show();
        }
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
        if (this.sourceIntro) {
            this.props.navigation.replace('traditional_room_list', {
                clubId: this.clubId,
            })
        } else {
            if (this.props.navigation) {
                this.props.navigation.goBack();
            }
            let { params } = this.props.navigation.state;
            if (this.isMustUpdate && params.onScreenCallback) {
                params.onScreenCallback();
            }
        }

    }

    teeCourseResponse(listTee, course, eventDetailModel, isCreator) {
        this.setState({
            isCreator: isCreator,
            eventDetailModel: eventDetailModel
        }, () => {
            // this.refMemberFlightListView.setListTeeAndCourse(listTee, course)
        })

    }

    // onParticipateClubPress() {
    //     this.refPopupYesOrNo.setContent(this.t('join_event_confirm'), null, -2);
    // }

    // onLeaveClubPress() {
    //     this.refPopupYesOrNo.setContent(this.t('out_event_msg').format(`${this.state.eventDetailModel.getName()}`), null, -1);
    // }

    onConfirmAction(type, extrasData) {
        // if (extrasData === -1) {
        //     this.requestLeaveEvent();
        // } else if (extrasData === 0) {
        //     // this.refMemberFlightListView.requestSwap(2);    // hdc
        // } else if (extrasData === 1) {
        //     // this.refMemberFlightListView.requestSwap(1);    // random
        // } else if (extrasData === -2) {
        //     this.requestJoinEvent();
        // }
    }

    requestJoinEvent() {
        let { eventDetailModel } = this.state;
        let self = this;
        this.internalLoading.showLoading();
        let url;
        if (this.isAppointment) {
            url = this.getConfig().getBaseUrl() + ApiService.member_accept_invitation_appointment(this.eventId);
        } else {
            url = this.getConfig().getBaseUrl() + ApiService.event_club_participate(this.eventId);
        }
        console.log("url = ", url);
        Networking.httpRequestGet(url, (jsonData) => {
            self.internalLoading.hideLoading();
            if (jsonData.error_code === 0) {
                eventDetailModel.is_accepted = 1;
                eventDetailModel.total_joined += 1;
                self.setState({
                    eventDetailModel: eventDetailModel
                }, () => {
                    if (self.refMemberFlightListView)
                        self.refMemberFlightListView.refreshList();
                    this.isMustUpdate = true;
                })
            } else {
                self.showErrorMsg(jsonData.error_msg);
            }

        }, () => {
            self.internalLoading.hideLoading();
            self.showErrorMsg(self.t('time_out'));
        });
    }

    requestLeaveEvent() {
        let self = this;
        this.internalLoading.showLoading();
        let url;
        if (this.isAppointment) {
            url = this.getConfig().getBaseUrl() + ApiService.member_cancel_invitation_appointment(this.eventId);
        } else {
            url = this.getConfig().getBaseUrl() + ApiService.player_leave_event(this.eventId);
        }

        console.log("url = ", url);
        Networking.httpRequestGet(url, (jsonData) => {
            self.internalLoading.hideLoading();
            if (jsonData.error_code === 0) {
                this.isMustUpdate = true;
                self.onBackPress();
            } else {
                self.showErrorMsg(jsonData.error_msg)
            }
        }, () => {
            self.internalLoading.hideLoading();
        });
    }

    onUpdateEventPress() {
        if (this.isAppointment) {
            this.props.navigation.navigate('event_create', {
                isUpdate: true,
                eventDetailModel: this.state.eventDetailModel,
                clubId: this.clubId,
                clubList: this.clubList,
                onUpdateCallback: this.onUpdateEventCallback.bind(this)
            })
        } else {
            this.props.navigation.navigate('club_create_event_view', {
                isUpdate: true,
                eventDetailModel: this.state.eventDetailModel,
                clubId: this.clubId,
                clubList: this.clubList,
                onUpdateCallback: this.onUpdateEventCallback.bind(this)
            })
        }

    }

    onUpdateEventCallback(eventId) {
        this.eventId = eventId;
        this.isMustUpdate = true;
        this.refClubEventDetailInfo.updateEventInfo(this.isMustUpdate);
    }

    onCommentEventPress() {
        if (this.state.eventDetailModel) {
            this.props.navigation.navigate('club_event_comment_view', {
                eventDetailModel: this.state.eventDetailModel
            })
        }

    }

    onViewInteractUserPress() {
        this.props.navigation.navigate('interactive_tab_view', {
            'flightId': this.eventId,
            'statusType': this.isAppointment ? 5 : 2
            // 'uid': this.uid
        })
    }

    onTakePhotoClick = async () => {
        let imageUri = await this.getAppUtil().onTakePhotoClick(false, true);
        if (!imageUri.didCancel) {
            this.getAppUtil().resizeImage(imageUri.path, imageUri.width, imageUri.height, imageUri.size)
                .then(({ uri }) => {
                    console.log('uri', uri)
                    this.requestUploadImage([uri]);
                })
                .catch(err => {
                    console.log(err);
                    this.requestUploadImage([imageUri.path]);
                });

        }

    }

    onImportGalleryClick = async () => {
        let imageUris = await this.getAppUtil().onImportGalleryClick(false, true);
        console.log('imageUri', imageUris.path);
        // this.requestUploadImage(imageUri.path);
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
        if (listData.length > 0) {
            this.requestUploadImage(listData);
        }
    }

    checkCreator(eventDetailModel) {
        return eventDetailModel.getUserCreated() === this.userId;
    }

    onHeaderLayout(event) {
        let layoutHeight = event.nativeEvent.layout.height;
        let height = this.isIphoneX ? 100 + layoutHeight : 80 + layoutHeight;
        this.setState({
            header_expanded_height: height
        })
    }

    onTeeSelected(teeName) {
        this.teeNameSelected = teeName;
    }

    onAddImagePress() {
        this.popupAttachImage.show();
    }
    requestUploadImage(imgList) {
        if (imgList.length > 0) {
            this.refUploadPostProgress.setUploadProgress(0);
            let self = this;
            let url = this.getConfig().getBaseUrl() + ApiService.upload_traditional_image(this.eventId);
            console.log('requestUploadImage', url);
            this.getAppUtil().upload_mutil(url, imgList,
                this.onUploadSuccess.bind(this),
                (error) => {
                    self.refUploadPostProgress.setUploadProgress(0);
                    try {
                        self.showErrorMsg(error);
                    } catch (error) {

                    }
                }, (progress) => {
                    self.refUploadPostProgress.setUploadProgress(progress);
                });
        }

    }

    onUploadSuccess(jsonData) {
        this.isMustUpdate = true;
        this.refUploadPostProgress.setUploadProgress(0);
        console.log('onUploadSuccess', jsonData);
        if (jsonData.error_code === 0) {
            let data = jsonData.data;
            if (data && data instanceof Array) {
                let user = {};
                user.avatar = this.avatar;
                data = data.map((imgPath) => {
                    return (
                        {
                            "img_path": imgPath,
                            "Users": user
                        }
                    )
                });
                console.log('onUploadSuccess.data', data)
                this.refTraditionalImageList.addImageList(data);
            }

        } else {
            this.showErrorMsg(jsonData.error_msg);
        }
        // if (jsonData != null && jsonData.hasOwnProperty('error_code')) {
        //     if (jsonData['error_code'] === 0) {
        //         global.shouldUpdateFinishFlight = true;
        //         this.setState({
        //             isError: false,
        //             upload_state: 4,
        //             upload_text: this.t('complete')
        //         });
        //     } else {
        //         this.setState({
        //             isError: true,
        //             upload_state: 3,
        //             upload_text: this.t('re_upload')
        //         });
        //     }
        // }
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DADADA',
    },
    view_event_info: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff'
    },
    txt_event_name: {
        color: '#242424',
        fontSize: 18,
        fontWeight: 'bold',
        justifyContent: 'space-between',
        marginBottom: 15,
        marginRight: 10
    },
    txt_label: {
        fontSize: 15,
        color: '#858585',
        marginLeft: 5
    },
    txt_label_content: {
        fontSize: 13,
        color: '#858585',
        fontWeight: 'bold'
    },
    view_tee_time: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    line: {
        height: 1,
        marginLeft: 10,
        marginRight: 10
    },
    view_list_flight: {
        backgroundColor: '#fff',
        marginTop: 8,
        flex: 1
    },
    view_list_flight_title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10
    },
    txt_list_participants: {
        fontSize: 13,
        color: '#828282'
    },
    txt_participant: {
        fontSize: 15,
        color: '#fff',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5
    },
    txt_leave_event: {
        fontSize: 15,
        color: '#5E5E5E',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5
    },
    touchable_participant: {
        backgroundColor: '#00ABA7',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    img_calendar: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 8
    },
    txt_title_month: {
        color: '#00ABA7',
        fontSize: 18,
        // fontWeight: 'bold'
    },
    txt_title_day: {
        color: '#2A2A2A',
        fontSize: 20,
        // fontWeight: 'bold'
    },
    view_item: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    img_icon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        tintColor: '#858585'
    },
    touchable_leave_event: {
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#5E5E5E',
        borderWidth: 1
    },
    img_edit: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        tintColor: '#00ABA7'
    },
    txt_edit: {
        color: '#00ABA7',
        fontSize: 11
    },
    view_edit: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    img_share: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        tintColor: '#fff'
    }

});