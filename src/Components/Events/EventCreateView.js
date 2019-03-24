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
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import Networking from '../../Networking/Networking';
import ApiService, { list_recent_course } from '../../Networking/ApiService';
import DatePicker from 'react-native-datepicker';
import PopupAttachImage from '../Common/PopupAttachImage';
import FacilityCourseModel from '../../Model/Facility/FacilityCourseModel';
import { View } from 'react-native-animatable';
import MyView from '../../Core/View/MyView';
import CheckHandicapItem from '../Common/CheckHandicapItem';
import moment from 'moment';
import ClubEventItemModel from '../../Model/Events/ClubEventItemModel';
import EventTab from './EventTab';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';

const TIME_FORMAT = 'HH:mm, DD/MM/YYYY';
const screenHeight = Dimensions.get('window').height;

const animate_height = 140;

export default class EventCreateView extends BaseComponent {

    constructor(props) {
        super(props);
        const timestamp = Date.now();
        let minDate = new Date(timestamp);
        this.strMinDate = `${minDate.getHours()}:${minDate.getMinutes()}, ${minDate.getDate()}/${minDate.getMonth() + 1}/${minDate.getFullYear()}`;
        this.facilityPage = 1;
        this.facilityList = [];
        this.inputFacilityPosition = 0;
        this.page = 1;
        let { isUpdate, eventDetailModel } = this.props.navigation.state.params;
        this.isUpdate = isUpdate;
        this.eventDetailModel = eventDetailModel;
        this.facilitySelected = this.isUpdate && this.eventDetailModel ? this.eventDetailModel.getCourse() : {};
        this.listFacilityRecent = [];
        this.state = {
            date_time: this.isUpdate && this.eventDetailModel ? this.eventDetailModel.getTeeTimeDisplay() : this.strMinDate,
            location: this.isUpdate && this.facilitySelected ? this.facilitySelected.getTitle() : '',
            isSearching: false,
            title: this.isUpdate && this.eventDetailModel ? this.eventDetailModel.getName() : '',
            listFacility: [],
            isCreated: false,
            event_id: ''
        }

        this.onItemCoursePress = this.onItemCoursePress.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
        this.onMenuHeaderClick = this.onMenuHeaderClick.bind(this);
        this.onIconMenuClick = this.onIconMenuClick.bind(this);
    }

    render() {

        let {
            location,
            date_time,
            isSearching,
            title,
            listFacility,
            isCreated,
            event_id
         } = this.state;

        return (
            <KeyboardAvoidingView style={styles.container}
                behavior="padding"
                enabled>

                <HeaderView
                    ref={(refHeaderView) => { this.refHeaderView = refHeaderView }}
                    title={this.isUpdate ? this.t('update_appointment') : this.t('make_appointment')}
                    handleBackPress={this.onBackPress}
                    menuTitle={isCreated ? '' : this.isUpdate ? this.t('done') : this.t('create')}
                    isEnable={false}
                    iconMenu={isCreated ? this.getResources().btn_save : null}
                    showBack={isCreated ? false : true}
                    iconMenuStyle={styles.img_menu}
                    onMenuHeaderClick={this.onMenuHeaderClick}
                    onIconMenuClick={this.onIconMenuClick} />

                <MyView hide={isCreated}>
                    <ScrollView ref={(refScrollView) => { this.refScrollView = refScrollView; }}
                        contentContainerStyle={{ flexGrow: 1 }}>

                        <View style={{ minHeight: screenHeight }}>
                            <MyView hide={isSearching} style={styles.view_title}>
                                <TextInput allowFontScaling={global.isScaleFont} style={[styles.txt_title]}
                                    placeholder={this.t('tieu_de_su_kien')}
                                    placeholderTextColor='#A8A8A8'
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    value={title}
                                    onChangeText={(input) => this.onTitleChangeText(input)}
                                    numberOfLines={2}
                                // multiline={true}
                                // onSubmitEditing={this.onSignInClick.bind(this)}
                                />

                            </MyView>

                            <View style={styles.big_line} />

                            <View style={styles.view_more_info}>
                                <MyView hide={isSearching} style={styles.view_item_datetime}>
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
                                <MyView hide={isSearching} style={styles.line} />
                                <View style={styles.view_item}>
                                    <TextInput allowFontScaling={global.isScaleFont} style={styles.txt_location}
                                        // editable={false}
                                        placeholderTextColor={'#737373'}
                                        placeholder={this.t('san')}
                                        value={location}
                                        underlineColorAndroid='rgba(0,0,0,0)'
                                        onFocus={this.onSearchFacilityFocused.bind(this)}
                                        onChangeText={(input) => this.onSearchFacilityChangeText(input)}
                                        numberOfLines={1} />

                                    <Image
                                        style={styles.img_icon_pin}
                                        source={this.getResources().ic_map_header}
                                    />

                                </View>
                                <View style={styles.line} />

                            </View>
                        </View>
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
                                <CheckHandicapItem facilityCourseModel={item}
                                    onItemClickCallback={this.onItemCoursePress} />
                            }
                        />
                    </MyView>
                </MyView>

                <MyView style={styles.send_invite_myview} hide={!isCreated}>

                    <View style={styles.send_invite_view}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.create_success}>{this.t('appointment_created')}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.send_invite_text}>{this.t('event_gui_loi_moi')}</Text>
                    </View>
                    {/* <View style={styles.line} /> */}
                    <EventTab screenProps={{ event_id: event_id }} />
                </MyView>

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
        let {
            isCreated,
            isSearching
        } = this.state;
        if (isSearching) {
            this.setState({
                isSearching: false
            })
        } else {
            if (this.props.navigation) {
                this.props.navigation.goBack();
            }
            let params = this.props.navigation.state.params;
            if (params && isCreated) {
                params.onScreenCallback();
            }
        }


    }

    onMenuHeaderClick() {
        console.log('onMenuHeaderClick', this.isUpdate);
        if (this.isUpdate) {
            this.requestUpdateEvent();
        } else {
            this.requestCreateEvent();
        }

    }

    onIconMenuClick() {
        this.onBackPress();
    }

    onTitleChangeText(input) {
        this.setState({
            title: input
        }, () => {
            this.setValidate();
        })
    }

    onSearchFacilityFocused() {

        this.setState({
            isSearching: true
        }, () => {
            // this.refScrollView.scrollTo({ x: 0, y: animate_height, animated: true });
            if (this.listFacilityRecent && this.listFacilityRecent.length === 0) {
                this.requestSearchRecentCourse();
            } else {
                this.setState({
                    listFacility: this.listFacilityRecent
                })
            }
        })
    }

    onItemCoursePress(course) {
        this.facilitySelected = course;
        console.log('onItemCoursePress', course)
        this.setState({
            isSearching: false,
            location: course.getTitle()
        }, () => {
            this.refScrollView.scrollTo({ x: 0, y: 0, animated: true });
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
        if (location.length > 0 && date_time.length > 0 && title.length > 0) {
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
            "tee_time": timestamp / 1000,
            "course": this.facilitySelected
        }

        let url = this.getConfig().getBaseUrl() + ApiService.event_create();
        this.loading.showLoading();
        Networking.httpRequestPost(url, (jsonData) => {
            self.loading.hideLoading();

            if (jsonData.error_code === 0) {
                console.log('requestCreateEvent', jsonData)
                // let model = new ClubEventItemModel();
                // model.parseData(jsonData.data);
                // self.openEventDetails(self, model);
                self.setState({
                    isCreated: true,
                    event_id: jsonData.data.event.id
                })
            } else {
                self.showErrorMsg(jsonData.error_msg);
            }

        }, fromData, () => {
            //time out
            self.loading.hideLoading();
        });
    }

    openEventDetails(self, event) {
        self.props.navigation.replace('club_event_detail_view', {
            eventProps: event,
            isNewCreated: true,
            onScreenCallback: self.props.navigation.state.params.onScreenCallback
        })
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

        let url = this.getConfig().getBaseUrl() + ApiService.event_update();
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
        backgroundColor: '#fff',
    },
    img_wall_container: {
        height: 200
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
        fontSize: 18,
        flex: 1,
        paddingLeft: 10
    },
    touchable_camera: {
        width: 30,
        height: 30,
        backgroundColor: '#E5E5E5',
        padding: 10,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    img_camera: {
        width: 15,
        height: 15,
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
        minHeight: 50,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    view_item_datetime: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 5,
        minHeight: 50,
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
    big_line: {
        height: 8,
        backgroundColor: '#D6D4D4'
    },
    txt_location: {
        fontSize: 16,
        color: '#242424',
        flex: 1,
        paddingRight: 5,
    },
    img_icon_pin: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        tintColor: '#858585',
        marginRight: 10
    },
    txt_more_info: {
        color: '#242424',
        fontSize: 16,
        padding: 10,
        minHeight: 50
    },
    container_list_facility: {
        position: 'absolute',
        top: 60,
        right: 0,
        left: 0,
        bottom: 0,
        paddingTop: 10,
        paddingBottom: 10
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
        borderWidth: 1,
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: -3,
        },
        elevation: 4,
    },
    send_invite_myview: {
        flex: 1,
    },

    send_invite_text: {
        fontSize: fontSize(16),// 14,
        color: '#333333',
        marginLeft: scale(10),
        marginBottom: scale(5),
        textAlignVertical: 'center'
    },
    create_success: {
        fontSize: fontSize(16),// 14,
        color: '#333333',
        marginLeft: scale(10),
        marginTop: scale(20),
        marginBottom: scale(5),
        textAlignVertical: 'center',
        fontWeight: 'bold'
    },

    send_invite_view: {
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    img_menu: {
        width: scale(20),
        height: scale(20),
        resizeMode: 'contain'
    }
});