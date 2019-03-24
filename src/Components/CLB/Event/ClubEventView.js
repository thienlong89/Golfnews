import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    SectionList,
    BackHandler
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import HeaderView from '../../HeaderView';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import CustomAvatar from '../../Common/CustomAvatar';
import EmptyDataView from '../../../Core/Common/EmptyDataView';
import MyView from '../../../Core/View/MyView';
import ClubEventItemView from '../Items/ClubEventItemView';
import ClubEventModel from '../../../Model/Events/ClubEventModel';
import PopupYesOrNo from '../../Common/PopupYesOrNo';
import CalendarEventView from '../../CLB/Items/CalendarEventView';
import { scale } from '../../../Config/RatioScale';

export default class ClubEventView extends BaseComponent {

    constructor(props) {
        super(props);
        this.userProfile = this.getUserInfo().getUserProfile();
        let { view_all, clubName, clubId, logoUrl, totalMember, isAdmin, isPersonal } = this.props.navigation.state.params;
        this.clubName = clubName;
        this.clubId = clubId;
        this.isAdmin = isAdmin;
        this.totalMember = totalMember;
        this.isPersonal = isPersonal;
        this.page = 1;
        this.clubList = [];
        this.state = {
            futureEvent: [],
            passEvent: [],
            appointment: []
        }

        this.onBackPress = this.onBackPress.bind(this);
        this.onIconMenuClick = this.onIconCalendarClick.bind(this);
        this.onConfirmDeleteEventClick = this.onConfirmDeleteEventClick.bind(this);
        this.onCreateEventPress = this.onCreateEventPress.bind(this);
        this.onScreenCallback = this.onScreenCallback.bind(this);
    }

    renderCreateEvent() {
        if (this.isAdmin || this.clubList.length > 0 || this.isPersonal) {
            return (
                <TouchableOpacity onPress={this.onCreateEventPress}
                    style={styles.touchable_create}>
                    <View style={styles.view_add_event}>
                        <CustomAvatar
                            width={40}
                            height={40}
                            onAvatarClick={this.onCreateEventPress}
                            uri={this.userProfile.getAvatar()} />
                        <Text allowFontScaling={global.isScaleFont} style={[styles.txt_content, { flex: 1 }]}>{this.isPersonal ? `${this.t('make_appointment')}...` : `${this.t('tao_su_kien')}...`}</Text>
                        <Image
                            style={styles.img_add_event}
                            source={this.getResources().ic_add_event} />
                    </View>
                </TouchableOpacity>

            )
        } else {
            return null;
        }

    }

    render() {
        let { futureEvent, passEvent, appointment } = this.state;
        let isShowSession = futureEvent.length > 0 || passEvent.length > 0 || appointment.length > 0;
        let dataSections = [];

        if (futureEvent.length > 0) {
            dataSections.push({ title: 0, data: futureEvent })
        }
        if (appointment.length > 0) {
            dataSections.push({ title: 1, data: appointment })
        }
        if (passEvent.length > 0) {
            dataSections.push({ title: 2, data: passEvent })
        }

        return (
            <View style={styles.container}>

                <HeaderView
                    title={this.t('event')}
                    handleBackPress={this.onBackPress}
                    iconMenu={this.getResources().ic_calender}
                    iconMenuStyle={styles.icon_menu_style}
                    onIconMenuClick={this.onIconMenuClick} />

                {this.renderCreateEvent()}
                <View style={{ flex: 1 }}>

                    <MyView hide={!isShowSession} style={{ flex: 1, padding: scale(10) }}>
                        <SectionList
                            renderItem={({ item, index, section }) =>
                                <View style={
                                    [{
                                        // borderWidth: 1,
                                        borderLeftWidth: 1,
                                        borderRightWidth: 1,
                                        borderTopWidth: 0,
                                        backgroundColor: '#fff'
                                    },
                                    this.generateStyle(item, index, section, futureEvent, appointment, passEvent)]
                                }>
                                    <ClubEventItemView
                                        eventObject={item}
                                        uid={this.userProfile.getId()}
                                        onPress={this.onEventItemPress.bind(this, item, section)}
                                        onLongPress={this.onEventItemLongPress.bind(this, item, index, section)} />
                                </View>

                            }
                            renderSectionHeader={({ section: { title } }) => (
                                <View style={styles.view_section}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_section}>
                                        {title === 0 ? this.t('recent_event') : title === 1 ? this.t('your_appointment') : this.t('pass_event')}
                                    </Text>
                                    <View style={{ backgroundColor: '#D6D4D4', height: 1, flex: 1 }} />
                                </View>
                            )}
                            ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                            sections={isShowSession ? dataSections : []}
                            keyExtractor={(item, index) => item + index}
                            // stickySectionHeadersEnabled={true}
                        />

                    </MyView>

                    <MyView hide={isShowSession}
                        style={{ backgroundColor: '#FFF', flex: 1, marginTop: 10 }}>
                        <EmptyDataView
                            ref={(refEmptyData) => { this.refEmptyData = refEmptyData; }}
                        />
                    </MyView>

                    {this.renderInternalLoading()}
                </View>

                <PopupYesOrNo
                    ref={(refPopupYesOrNo) => { this.refPopupYesOrNo = refPopupYesOrNo; }}
                    content={''}
                    confirmText={this.t('agree')}
                    cancelText={this.t('cancel')}
                    onConfirmClick={this.onConfirmDeleteEventClick} />
                <CalendarEventView
                    ref={(refCalendarEventView) => { this.refCalendarEventView = refCalendarEventView }} />
                {this.renderMessageBar()}
            </View>
        );
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();

        this.requestListEvent();
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
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
    }

    generateStyle(item, index, section, futureEvent, appointment, passEvent) {

        if (section.title === 0 && futureEvent.length - 1 === index ||
            section.title === 1 && appointment.length - 1 === index ||
            section.title === 2 && passEvent.length - 1 === index) {
            return {
                borderBottomColor: '#D6D4D4',
                borderBottomWidth: 1,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                borderLeftColor: '#D6D4D4',
                borderRightColor: '#D6D4D4',
                marginBottom: 10,
                paddingBottom: 15,
                backgroundColor: '#fff'
            }
        }
        return {
            borderBottomColor: '#D6D4D4',
            borderBottomWidth: 0,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            borderLeftColor: '#D6D4D4',
            borderRightColor: '#D6D4D4',
        }
    }

    onCreateEventPress() {
        if (this.isPersonal) {
            this.props.navigation.navigate('event_create', {
                isUpdate: false,
                clubId: this.clubId,
                clubList: this.clubList,
                isPersonal: this.isPersonal,
                onScreenCallback: this.onScreenCallback
            })
        } else {
            this.props.navigation.navigate('club_create_event_view', {
                isUpdate: false,
                clubId: this.clubId,
                clubList: this.clubList,
                isPersonal: this.isPersonal,
                onScreenCallback: this.onScreenCallback
            })
        }

    }

    onEventItemPress(event, section) {
        console.log('onEventItemPress', section)
        let { title } = section;
        if (title === this.t('your_appointment')) {
            this.props.navigation.navigate('club_event_detail_view', {
                eventProps: event,
                isAppointment: true,
                onScreenCallback: this.onScreenCallback
            })
        } else {
            this.props.navigation.navigate('club_event_detail_view', {
                eventProps: event,
                isAppointment: false,
                onScreenCallback: this.onScreenCallback
            })
        }

    }

    onScreenCallback() {
        console.log('onScreenCallback');
        this.requestListEvent(true);
    }

    onEventItemLongPress(event, index, section) {
        if (event.getUserCreated() && event.getUserCreated() === this.userProfile.getId()) {
            this.refPopupYesOrNo.setContent(this.t('delete_event_msg').format(`${event.getName()}`), { event, index, section });
        }
    }

    onConfirmDeleteEventClick({ event, index, section }) {
        let { title } = section;
        let isAppointment = (title === this.t('your_appointment'));
        if (isAppointment) {
            this.requestDeleteAppointment(event, index, section);
        } else {
            this.requestDeleteEvent(event, index, section);
        }
    }

    requestDeleteEvent(event, index, section) {
        let self = this;
        let fromData = {
            "event_id": event.getId()
        }
        let url = this.getConfig().getBaseUrl() + ApiService.event_club_delete();
        this.internalLoading.showLoading();
        Networking.httpRequestPost(url, (jsonData) => {
            self.internalLoading.hideLoading();
            if (jsonData.error_code === 0) {
                self.removeEventFromList(event, index, section);
            } else {
                self.showErrorMsg(jsonData.error_msg);
            }

        }, fromData, () => {
            //time out
            self.internalLoading.hideLoading();
        });
    }

    requestDeleteAppointment(event, index, section) {
        let self = this;
        this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.delete_appointment(event.getId());
        console.log("url = ", url);
        Networking.httpRequestGet(url, (jsonData) => {
            self.internalLoading.hideLoading();
            if (jsonData.error_code === 0) {
                self.removeEventFromList(event, index, section);
            } else {
                self.showErrorMsg(jsonData.error_msg);
            }
        }, () => {
            self.internalLoading.hideLoading();
        });
    }

    removeEventFromList(event, index, section) {
        let { title, data } = section;

        let eventIndex = data.findIndex((item) => {
            return item.getId() === event.getId();
        })
        console.log('removeEventFromList', eventIndex, index)
        if (eventIndex != -1) {
            data.splice(index, 1);

            this.setState({
            })
        }

    }

    requestListEvent(isMustClear = false) {
        let self = this;
        this.internalLoading.showLoading();
        let url = this.isPersonal ? this.getConfig().getBaseUrl() + ApiService.get_appointment_list(this.page) : this.getConfig().getBaseUrl() + ApiService.club_event_list(this.page, this.clubId);
        console.log("url = ", url);
        Networking.httpRequestGet(url, this.onListEventResponse.bind(this, isMustClear), () => {
            self.internalLoading.hideLoading();
            //self.popupTimeOut.showPopup();
            if (this.refEmptyData && this.page === 1)
                this.refEmptyData.showEmptyView();
        });
    }

    onListEventResponse(isMustClear, jsonData) {
        let { futureEvent, passEvent, appointment } = this.state;
        if (isMustClear) {
            futureEvent = [];
            passEvent = [];
            appointment = [];
        }
        this.model = new ClubEventModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            this.clubList = this.model.getClubAdminList();
            let futureEvent = this.model.getFutureEvents();
            let passEvent = this.model.getPassEvents();
            let appointment = this.model.getAppointmentList();
            if (futureEvent.length > 0 || passEvent.length > 0 || appointment.length > 0) {

                // if (futureEvent.length > 0) {
                //     dataSections.push({ title: this.t('recent_event'), data: futureEvent })
                // }
                // if (appointment.length > 0) {
                //     dataSections.push({ title: this.t('your_appointment'), data: appointment })
                // }
                // if (passEvent.length > 0) {
                //     dataSections.push({ title: this.t('pass_event'), data: passEvent })
                // }
                // console.log('onListEventResponse', dataSections)
                // this.setState({
                //     dataSections: dataSections
                // }, () => {
                //     this.refCalendarEventView.setDateEvent([...futureEvent, ...appointment]);
                // })
                this.setState({
                    futureEvent: futureEvent,
                    passEvent: passEvent,
                    appointment: appointment
                }, () => {
                    this.refCalendarEventView.setDateEvent([...futureEvent, ...appointment]);
                })
            } else {
                this.setState({});
                if (this.refEmptyData && this.page === 1)
                    this.refEmptyData.showEmptyView();
            }

        } else {
            this.showErrorMsg(this.model.getErrorMsg());
        }
        this.internalLoading.hideLoading();
    }

    onIconCalendarClick() {
        this.refCalendarEventView.show();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    touchable_create: {
        margin: scale(10),
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: scale(10),
        borderColor: '#D6D4D4',
        // shadowColor: 'rgba(0, 0, 0, 0.3)',
        // shadowOffset: {
        //     width: 0,
        //     height: 5
        // },
        // shadowRadius: scale(10),
        // shadowOpacity: 1.0,
        // elevation: 1,
    },
    view_add_event: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 8,
        paddingTop: 8,
        paddingLeft: 10
    },
    txt_content: {
        color: '#757575',
        fontSize: 15,
        padding: 10
    },
    img_add_event: {
        width: 26,
        height: 26,
        resizeMode: 'contain',
        marginRight: 10,
        // tintColor: '#ABABAB'
    },
    separator_view: {
        height: 1,
        backgroundColor: '#DADADA',
        marginLeft: 10,
        marginRight: 10
    },
    view_section: {
        flex: 1,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderColor: '#D6D4D4',
    },
    txt_section: {
        color: '#3C3C3C',
        fontSize: 15,
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    icon_menu_style: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        tintColor: '#fff'
    },
});