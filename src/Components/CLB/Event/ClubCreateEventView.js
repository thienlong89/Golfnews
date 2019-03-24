import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    // View,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    ImageBackground,
    KeyboardAvoidingView,
    Dimensions,
    BackHandler,
    FlatList,
    Keyboard
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import HeaderView from '../../HeaderView';
import Networking from '../../../Networking/Networking';
import ApiService, { list_recent_course } from '../../../Networking/ApiService';
import DatePicker from 'react-native-datepicker';
import PopupAttachImage from '../../Common/PopupAttachImage';
import FacilityCourseModel from '../../../Model/Facility/FacilityCourseModel';
import { View } from 'react-native-animatable';
import MyView from '../../../Core/View/MyView';
import ImageLoad from '../../Common/ImageLoad';
import CheckHandicapItem from '../../Common/CheckHandicapItem';
import moment from 'moment';
import PopupSelectClub from '../Items/PopupSelectClub';
import ClubEventItemModel from '../../../Model/Events/ClubEventItemModel';
import { scale, fontSize } from '../../../Config/RatioScale';
import PopupNotifyView from '../../Common/PopupNotifyView';

const TIME_FORMAT = 'HH:mm, DD/MM/YYYY';
const screenHeight = Dimensions.get('window').height;

const animate_height = 140;

export default class ClubCreateEventView extends BaseComponent {

    constructor(props) {
        super(props);
        const timestamp = Date.now();
        let minDate = new Date(timestamp);
        this.facilityPage = 1;
        this.listFacilityRecent = [];
        this.inputFacilityPosition = 0;
        this.page = 1;
        let { clubId, clubList, isUpdate, eventDetailModel, isPersonal, isAddImage } = this.props.navigation.state.params;
        console.log('ClubCreateEventView', clubId)
        this.clubId = clubId;
        this.isAddImage = isAddImage;
        this.clubList = clubList;
        this.isUpdate = isUpdate;
        this.isPersonal = isPersonal;
        this.eventDetailModel = eventDetailModel;
        let currentTime = `${minDate.getHours()}:${minDate.getMinutes()}, ${minDate.getDate()}/${minDate.getMonth() + 1}/${minDate.getFullYear()}`;
        this.strMinDate = this.isPersonal ? currentTime : null;
        this.facilitySelected = this.isUpdate && this.eventDetailModel ? this.eventDetailModel.getCourse() : {};
        this.state = {
            date_time: this.isUpdate && this.eventDetailModel ? this.eventDetailModel.getTeeTimeDisplay() : currentTime,
            location: this.isUpdate && this.facilitySelected ? this.facilitySelected.getTitle() : '',
            isSearching: false,
            title: this.isUpdate && this.eventDetailModel ? this.eventDetailModel.getName() : '',
            listFacility: []
        }

        this.onItemCoursePress = this.onItemCoursePress.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
        this.onMenuHeaderClick = this.onMenuHeaderClick.bind(this);
        this.onTitleChangeText = this.onTitleChangeText.bind(this);
        this.onSearchFacilityFocused = this.onSearchFacilityFocused.bind(this);
        this.onSearchFacilityChangeText = this.onSearchFacilityChangeText.bind(this);
        this.onClubSelectedPress = this.onClubSelectedPress.bind(this);
        this.onPopupNotifyConfirm = this.onPopupNotifyConfirm.bind(this);
    }

    render() {

        let { location, date_time, isSearching, title, listFacility } = this.state;

        return (
            <KeyboardAvoidingView style={styles.container}
                behavior="padding"
                enabled>
                {/* <MyView hide={isSearching} style={{ flex: 1 }}> */}

                <HeaderView
                    ref={(refHeaderView) => { this.refHeaderView = refHeaderView }}
                    title={this.isUpdate ? this.t('update_event') : this.isPersonal ? this.t('make_appointment') : this.t('tao_su_kien')}
                    handleBackPress={this.onBackPress}
                    menuTitle={this.isUpdate ? this.t('done') : this.t('create')}
                    isEnable={false}
                    onMenuHeaderClick={this.onMenuHeaderClick} />

                <View style={{ flex: 1 }}>
                    <ScrollView ref={(refScrollView) => { this.refScrollView = refScrollView; }}
                        contentContainerStyle={{ flexGrow: 1 }}>

                        {/* <View style={{ minHeight: screenHeight + 80 }}> */}
                        <MyView style={styles.view_title} hide={isSearching}>
                            <TextInput allowFontScaling={global.isScaleFont} style={[styles.txt_title]}
                                placeholder={this.t('tieu_de_su_kien')}
                                placeholderTextColor='#A8A8A8'
                                underlineColorAndroid='rgba(0,0,0,0)'
                                value={title}
                                onChangeText={this.onTitleChangeText}
                                numberOfLines={2}
                                multiline={true}
                            // onSubmitEditing={this.onSignInClick.bind(this)}
                            />

                        </MyView>

                        <View style={styles.view_more_info}>
                            <MyView style={styles.view_item_datetime} hide={isSearching}>
                                <DatePicker
                                    ref={(datePicker) => { this.datePicker = datePicker; }}
                                    style={styles.date_picker}
                                    mode='datetime'
                                    allowFontScaling={global.isScaleFont}
                                    date={date_time}
                                    // placeholder={this.t('enter_play_time')}
                                    format={TIME_FORMAT}
                                    minDate={`${this.strMinDate}`}
                                    confirmBtnText={this.t('agree')}
                                    cancelBtnText={this.t('cancel')}
                                    androidMode='spinner'
                                    iconSource={this.getResources().tee_time_icon}
                                    customStyles={{
                                        dateInput: {
                                            borderWidth: 0
                                        },
                                        placeholderText: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            bottom: 0,
                                            flex: 1,
                                            fontSize: 16,
                                            color: '#242424',
                                            textAlign: 'center',
                                            ...Platform.select({
                                                ios: {
                                                    paddingTop: 10
                                                },
                                                android: {
                                                    textAlignVertical: 'center'
                                                }
                                            }),

                                        },
                                        dateText: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            bottom: 0,
                                            flex: 1,
                                            fontSize: 16,
                                            color: '#242424',
                                            textAlign: 'center',
                                            ...Platform.select({
                                                ios: {
                                                    paddingTop: 10
                                                },
                                                android: {
                                                    textAlignVertical: 'center'
                                                }
                                            }),
                                        },
                                        dateTouchBody: {
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        },
                                        dateIcon: {
                                            height: 25,
                                            width: 25
                                        }
                                    }}
                                    onDateChange={this.onDateChange.bind(this)}
                                />
                            </MyView>
                            <View style={styles.line} />
                            <View style={styles.view_item}>
                                <TextInput allowFontScaling={global.isScaleFont} style={styles.txt_location}
                                    // editable={false}
                                    placeholderTextColor={'#737373'}
                                    placeholder={this.t('san')}
                                    value={location}
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    onFocus={this.onSearchFacilityFocused}
                                    onChangeText={this.onSearchFacilityChangeText}
                                    numberOfLines={1} />

                                <Image
                                    style={styles.img_icon_pin}
                                    source={this.getResources().ic_map_header}
                                />

                            </View>
                            <View style={styles.line} />

                        </View>
                        {/* </View> */}
                    </ScrollView>
                    {/* </MyView> */}

                    <MyView hide={!isSearching} style={styles.container_list_facility}>
                        <FlatList style={styles.flatlist_style}
                            data={listFacility}
                            onEndReachedThreshold={1}
                            keyboardShouldPersistTaps='always'
                            ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                            // onEndReached={this.onLoadMoreFacility.bind(this)}
                            enableEmptySections={true}
                            renderItem={({ item }) =>
                                // <Touchable onPress={this.onItemCoursePress.bind(this, item)}
                                //     style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <CheckHandicapItem facilityCourseModel={item}
                                    onItemClickCallback={this.onItemCoursePress} />
                                // </Touchable>

                            }
                        />
                    </MyView>
                </View>
                <PopupSelectClub
                    ref={(refPopupSelectClub) => { this.refPopupSelectClub = refPopupSelectClub }}
                    onClubSelected={this.onClubSelectedPress}
                    clubList={this.clubList}
                />

                <PopupNotifyView
                    ref={(popupNotify) => { this.popupNotify = popupNotify; }}
                    content={this.t('event_created')}
                    confirmText={this.t('ok')}
                    onConfirmClick={this.onPopupNotifyConfirm} />

                {this.renderMessageBar()}
                {this.renderLoading()}
            </KeyboardAvoidingView>
        );
    }

    componentDidMount() {
        this.registerMessageBar();
        this.handleHardwareBackPress();

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
        if (!this.state.isSearching) {
            if (this.props.navigation) {
                this.props.navigation.goBack();
            }
        } else {
            this.setState({
                isSearching: false
            })
        }

    }

    onMenuHeaderClick() {
        if (this.isUpdate) {
            this.requestUpdateEvent();
        } else {
            if (this.clubList.length > 0) {
                this.refPopupSelectClub.show(this.clubList);
            } else {
                this.requestCreateEvent(this.clubId);
            }
        }

    }

    onTitleChangeText(input) {
        this.setState({
            title: input
        }, () => {
            this.setValidate();
        })
    }

    onSearchFacilityFocused() {
        // this.setState({
        //     isSearching: true
        // }, () => {
        //     this.refScrollView.scrollTo({ x: 0, y: animate_height, animated: true });
        //     if (listFacilityRecent.length === 0) {
        //         this.requestSearchRecentCourse();
        //     } else {
        //         this.setState({
        //             listFacility: listFacilityRecent
        //         })
        //     }
        // })
        if (this.listFacilityRecent.length === 0) {
            this.setState({
                isSearching: true,
            }, () => {
                this.requestSearchRecentCourse();
            })

        } else {
            this.setState({
                isSearching: true,
                listFacility: this.listFacilityRecent
            })
        }
    }

    onItemCoursePress(course) {
        this.facilitySelected = course;
        console.log('onItemCoursePress', course)
        this.setState({
            isSearching: false,
            location: course.getTitle()
        }, () => {
            // this.refScrollView.scrollTo({ x: 0, y: 0, animated: true });
            this.setValidate();
        });
        Keyboard.dismiss();
    }

    onSearchFacilityChangeText(input) {
        this.setState({
            location: input,
            isSearching: true
        }, () => {
            // this.refScrollView.scrollTo({ x: 0, y: animate_height, animated: true });
            this.requestSearchFacility(input);
        });
    }

    onDateChange(date) {
        this.setState({ date_time: date });
    }

    setValidate() {
        let { location, date_time, title } = this.state;
        console.log('setValidate', date_time)
        if (location && location.length > 0 && date_time && date_time.length > 0 && title.length > 0) {
            this.refHeaderView.setMenuEnable(true);
        } else {
            this.refHeaderView.setMenuEnable(false);
        }
    }

    requestSearchRecentCourse() {
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.list_recent_course();
        Networking.httpRequestGet(url, (jsonData) => {
            self.model = new FacilityCourseModel();
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {

                self.setState({
                    listFacility: self.model.getListFacilityCourse()
                }, () => {
                    this.listFacilityRecent = self.model.getListFacilityCourse();
                })

            }

        }, () => {
            // self.listViewFacility.hideLoading();
            // self.loading.hideLoading();
            //self.popupTimeOut.showPopup();
        });
    }

    requestSearchFacility(query = '') {
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.search_course(query, this.page);
        Networking.httpRequestGet(url, (jsonData) => {
            self.model = new FacilityCourseModel();
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {

                self.setState({
                    listFacility: self.model.getListFacilityCourse()
                })
                if (query === '') {
                    this.listFacilityRecent = self.model.getListFacilityCourse()
                }
            }

        }, () => {
            // self.listViewFacility.hideLoading();
            // self.loading.hideLoading();
            //self.popupTimeOut.showPopup();
        });
    }

    onClubSelectedPress(club) {
        console.log('onClubSelectedPress')
        this.requestCreateEvent(club.getId());
    }

    requestCreateEvent(clubId) {
        let time = moment(this.state.date_time, TIME_FORMAT);
        let timestamp = (new Date(time)).getTime() || (new Date()).getTime();

        let self = this;
        let fromData = {
            "name": this.state.title,
            "club_id": clubId,
            "tee_time": timestamp / 1000,
            "course": this.facilitySelected
        }
        console.log('requestCreateEvent.fromData', fromData)
        let url = this.getConfig().getBaseUrl() + ApiService.event_new_create();
        console.log('requestCreateEvent.url', url)
        this.loading.showLoading();
        Networking.httpRequestPost(url, (jsonData) => {
            console.log('requestCreateEvent.jsonData', jsonData)
            self.loading.hideLoading();

            if (jsonData.error_code === 0) {
                let model = new ClubEventItemModel();
                model.parseData(jsonData.data);
                self.openEventDetails(self, model);
            } else {
                self.showErrorMsg(jsonData.error_msg);
            }

        }, fromData, () => {
            //time out
            self.loading.hideLoading();
            self.showErrorMsg(self.t('time_out'));
        });
    }

    openEventDetails(self, event) {
        self.popupNotify.setContent(self.t('event_created').format(self.state.title), event);
    }

    onPopupNotifyConfirm(event) {
        if (this.isAddImage) {
            this.props.navigation.replace('traditional_detail_view', {
                eventProps: event,
                onScreenCallback: this.props.navigation.state.params.onScreenCallback,
                isAddImage: this.isAddImage
            })
        } else {
            this.props.navigation.replace('club_event_detail_view', {
                eventProps: event,
                isNewCreated: true,
                isAddImage: this.isAddImage,
                onScreenCallback: this.props.navigation.state.params.onScreenCallback
            })
        }

    }

    requestUpdateEvent() {
        let time = moment(this.state.date_time, TIME_FORMAT);
        let timestamp = (new Date(time)).getTime() || (new Date()).getTime();
        let eventId = this.eventDetailModel.getId();
        let self = this;
        let fromData = {
            "name": this.state.title,
            "event_id": eventId,
            "tee_time": timestamp / 1000,
            "course": this.facilitySelected
        }

        let url = this.getConfig().getBaseUrl() + ApiService.event_club_update();
        this.loading.showLoading();
        Networking.httpRequestPost(url, (jsonData) => {
            self.loading.hideLoading();
            console.log('requestUpdateEvent', jsonData)
            if (jsonData.error_code === 0) {
                self.onUpdateCallback(eventId)
                self.onBackPress();
            } else {
                self.showErrorMsg(jsonData.error_msg);
            }

        }, fromData, () => {
            //time out
            self.loading.hideLoading();
        });
    }

    onUpdateCallback(eventId) {
        let { params } = this.props.navigation.state;
        if (params.onUpdateCallback) {
            params.onUpdateCallback(eventId);
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DADADA',
    },
    img_wall_style: {
        resizeMode: 'cover',
    },
    view_title: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,
        paddingTop: 10
    },
    txt_title: {
        color: '#242424',
        fontSize: fontSize(17),
        flex: 1,
        paddingLeft: 10
    },
    touchable_camera: {
        width: scale(30),
        height: scale(30),
        backgroundColor: '#E5E5E5',
        padding: 10,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    img_camera: {
        width: scale(15),
        height: scale(15),
        tintColor: '#808080',
        resizeMode: 'contain'
    },
    view_more_info: {
        flex: 1,
        marginTop: 5,
        backgroundColor: '#fff'
    },
    view_item: {
        flexDirection: 'row',
        paddingLeft: 10,
        minHeight: scale(50),
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    view_item_datetime: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 5,
        minHeight: scale(50),
        alignItems: 'center'
    },
    date_picker: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    line: {
        height: 1,
        backgroundColor: '#D6D4D4'
    },
    txt_location: {
        fontSize: fontSize(16),
        color: '#242424',
        flex: 1,
        paddingRight: 5,
    },
    img_icon_pin: {
        width: scale(23),
        height: scale(23),
        resizeMode: 'contain',
        tintColor: '#858585',
        marginRight: 10
    },
    txt_more_info: {
        color: '#242424',
        fontSize: fontSize(16),
        padding: 10,
        minHeight: scale(50),
    },
    container_list_facility: {
        position: 'absolute',
        top: scale(60),
        right: 0,
        left: 0,
        bottom: 0
    },
    separator_view: {
        height: 1,
        backgroundColor: '#E3E3E3',
        marginLeft: 10,
        marginRight: 10
    },
    flatlist_style: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        borderColor: '#E9E9E9',
        borderWidth: 1
    }
});