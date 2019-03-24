import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    SectionList,
    Animated,
    InteractionManager,
    ScrollView
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import CustomAvatar from '../Common/CustomAvatar';
import EmptyDataView from '../../Core/Common/EmptyDataView';
import MyView from '../../Core/View/MyView';
import ClubEventItemView from '../CLB/Items/ClubEventItemView';
import ClubEventModel from '../../Model/Events/ClubEventModel';
import PopupYesOrNo from '../Common/PopupYesOrNo';
import CalendarEventView from '../CLB/Items/CalendarEventView';
import { fontSize, scale, verticalScale } from '../../Config/RatioScale';
import HeaderScreen from '../Home/Screens/HeaderScreen';
import StaticProps from '../../Constant/PropsStatic';

const EVENT_FILTER_KEY = {
    ALL: 'all',
    TOURNAMENTS: 'tournament_info',
    RECENT_EVENT: 'recent_event',
    YOUR_APPOINTMENT: 'your_appointment',
    PASS_EVENT: 'pass_event'
}

export default class EventHomeView extends BaseComponent {

    constructor(props) {
        super(props);
        this.userProfile = this.getUserInfo().getUserProfile();
        this.navigation = StaticProps.getAppSceneNavigator();

        this.page = 1;
        this.clubList = [];
        this.state = {
            dataSections: [],
            futureEvent: [],
            passEvent: [],
            appointment: [],
            tournamentList: [],
            scrollY: this.props.scrollY,
            sectionPaddingTop: 0,
            filterType: 0 // 0: show all; 1: tournament; 2: future event; 3: appointment; 4: pass event
        }

        this.onConfirmDeleteEventClick = this.onConfirmDeleteEventClick.bind(this);
        this.onCreateEventPress = this.onCreateEventPress.bind(this);
        this.onScreenCallback = this.onScreenCallback.bind(this);
        this.onCreateAppointmentPress = this.onCreateAppointmentPress.bind(this);
        this.handleHeaderLayout = this.handleHeaderLayout.bind(this);
        this.onTournamentPress = this.onTournamentPress.bind(this);
        //=========================================END======================================
        let { screenProps } = this.props;
        if (screenProps) {
            this.scroll = screenProps.scroll;
        } else {
            this.scroll = null;
        }

        this.onFlatlistScroll = this.onFlatlistScroll.bind(this);
        this.flatListOffset = 0;
        this.isLoadedData = false;

        this.options = [
            {
                key: EVENT_FILTER_KEY.ALL,
                value: this.t('all')
            },
            {
                key: EVENT_FILTER_KEY.TOURNAMENTS,
                value: this.t('tournament_info')
            },
            {
                key: EVENT_FILTER_KEY.RECENT_EVENT,
                value: this.t('recent_event')
            },
            {
                key: EVENT_FILTER_KEY.YOUR_APPOINTMENT,
                value: this.t('your_appointment'),
            },
            {
                key: EVENT_FILTER_KEY.PASS_EVENT,
                value: this.t('pass_event'),
            }
        ]
    }

    onFlatlistScroll(event) {
        this.scroll(event);
    }

    renderCreateEvent() {
        if (this.isAdmin || this.clubList.length > 0) {
            return (
                <TouchableOpacity onPress={this.onCreateEventPress}>
                    <View style={[styles.view_add_event, {
                        marginTop: scale(10),
                    }]}>
                        <CustomAvatar
                            width={40}
                            height={40}
                            onAvatarClick={this.onCreateEventPress}
                            uri={this.userProfile ? this.userProfile.getAvatar() : ''} />
                        <View style={{ flex: 1, justifyContent: 'space-around', paddingLeft: scale(10) }}>
                            <Text allowFontScaling={global.isScaleFont} style={[styles.txt_content]}>{`${this.t('tao_su_kien')}...`}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={[styles.txt_sub_content]}>{`${this.t('feature_leader')}`}</Text>
                        </View>
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

    renderCreateAppointment() {
        return (
            <TouchableOpacity onPress={this.onCreateAppointmentPress}>
                <View style={[styles.view_add_event, {
                    marginTop: scale(10),
                    marginBottom: scale(10),
                }]}>
                    <CustomAvatar
                        width={40}
                        height={40}
                        onAvatarClick={this.onCreateAppointmentPress}
                        uri={this.userProfile ? this.userProfile.getAvatar() : ''} />
                    <Text allowFontScaling={global.isScaleFont} style={[styles.txt_content, { flex: 1, paddingLeft: scale(10) }]}>{`${this.t('make_appointment')}...`}</Text>
                    <Image
                        style={styles.img_add_event}
                        source={this.getResources().ic_add_event} />
                </View>
            </TouchableOpacity>
        )

    }

    render() {
        let { futureEvent, passEvent, appointment, tournamentList, filterType } = this.state;
        let isShowSession = futureEvent.length > 0 || passEvent.length > 0 || appointment.length > 0 || tournamentList.length > 0;
        let dataSections = [];

        if (tournamentList.length > 0 && (filterType === 0 || filterType === 1)) {
            dataSections.push({ title: 0, data: tournamentList })
        }
        if (futureEvent.length > 0 && (filterType === 0 || filterType === 2)) {
            dataSections.push({ title: 1, data: futureEvent })
        }
        if (appointment.length > 0 && (filterType === 0 || filterType === 3)) {
            dataSections.push({ title: 2, data: appointment })
        }
        if (passEvent.length > 0 && (filterType === 0 || filterType === 4)) {
            dataSections.push({ title: 3, data: passEvent })
        }

        return (
            <View style={styles.container}>
                {/* <Animated.View style={{ transform: [{ translateY: this.props.tabY }], zIndex: 2, position: 'absolute', top: this.home_page_title_padding_top, backgroundColor: '#fff' }}
                    onLayout={this.handleHeaderLayout}> */}
                <HeaderScreen ref={(header) => { this.refHeader = header; }} title={this.t('event').toUpperCase()} show={true} color={'#00aba7'} options={this.options} />
                <ScrollView
                    onScroll={this.onFlatlistScroll}
                    onMomentumScrollEnd={({ nativeEvent }) => {
                        // if (this.isCloseToBottom(nativeEvent)) {
                        //     this.loadMoreData();
                        // }
                    }}>
                    {this.renderCreateEvent()}
                    {this.renderCreateAppointment()}
                    {/* </Animated.View> */}

                    <View style={{ flex: 1 }}>

                        <MyView hide={!isShowSession} style={{ flex: 1, padding: scale(10) }}>
                            <SectionList
                                ref={(refSectionList) => { this.refSectionList = refSectionList; }}
                                // onScroll={this.onFlatlistScroll}
                                // onScroll={Animated.event(
                                //     [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
                                //     // { useNativeDriver: true }
                                //     {
                                //         listener: event => {
                                //             const offsetY = event.nativeEvent.contentOffset.y
                                //             // do something special
                                //             console.log('scrollCallback', offsetY)
                                //             if (this.props.onScrollOffset) {
                                //                 this.props.onScrollOffset(offsetY);
                                //             }
                                //         },
                                //     },
                                // )}
                                renderItem={({ item, index, section }) =>
                                    <View style={
                                        [{
                                            // borderWidth: 1,
                                            borderLeftWidth: 1,
                                            borderRightWidth: 1,
                                            borderTopWidth: 0,
                                            backgroundColor: '#fff'
                                        },
                                        this.generateStyle(item, index, section, tournamentList, futureEvent, appointment, passEvent)]
                                    }>
                                        <ClubEventItemView
                                            eventObject={item}
                                            uid={this.userProfile ? this.userProfile.getId() : ''}
                                            onPress={this.onEventItemPress.bind(this, item, section)}
                                            onLongPress={this.onEventItemLongPress.bind(this, item, index, section)}
                                            onTournamentPress={this.onTournamentPress} />
                                    </View>

                                }
                                renderSectionHeader={({ section: { title } }) => (
                                    <View style={styles.view_section}>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_section}>
                                            {title === 0 ? this.t('tournament_info') : title === 1 ? this.t('recent_event') : title === 2 ? this.t('your_appointment') : this.t('pass_event')}
                                        </Text>
                                        <View style={{ backgroundColor: '#D6D4D4', height: 1, flex: 1 }} />
                                    </View>
                                )}
                                ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                                sections={isShowSession ? dataSections : []}
                                keyExtractor={(item, index) => item + index}
                            // stickySectionHeadersEnabled={true}
                            // contentContainerStyle={{ paddingTop: sectionPaddingTop }}
                            />

                        </MyView>

                        <MyView hide={isShowSession}
                            style={{ backgroundColor: '#FFF', flex: 1, marginTop: 10 }}>
                            <EmptyDataView
                                ref={(refEmptyData) => { this.refEmptyData = refEmptyData; }}
                            />
                        </MyView>

                    </View>
                </ScrollView>
                {this.renderInternalLoading()}
                <PopupYesOrNo
                    ref={(refPopupYesOrNo) => { this.refPopupYesOrNo = refPopupYesOrNo; }}
                    content={''}
                    confirmText={this.t('agree')}
                    cancelText={this.t('cancel')}
                    onConfirmClick={this.onConfirmDeleteEventClick} />

                {this.renderMessageBar()}
            </View>
        );
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.refHeader.filterCallback = this.filterEvent.bind(this);
        this.requestListEvent();
        // InteractionManager.runAfterInteractions(() => {
        //     this.setTabChange();
        // })
    }

    /**
     * Loc event trong màn hình list event
     * @param {String} type 
     */
    filterEvent(type) {
        console.log('......................event filter type : ', type);
        switch (type) {
            case EVENT_FILTER_KEY.ALL:
                this.setState({
                    filterType: 0
                })
                break;
            case EVENT_FILTER_KEY.TOURNAMENTS:
                this.setState({
                    filterType: 1
                })
                break;
            case EVENT_FILTER_KEY.RECENT_EVENT:
                this.setState({
                    filterType: 2
                })
                break;
            case EVENT_FILTER_KEY.YOUR_APPOINTMENT:
                this.setState({
                    filterType: 3
                })
                break;
            case EVENT_FILTER_KEY.PASS_EVENT:
                this.setState({
                    filterType: 4
                })
                break;
            default:
                this.setState({
                    filterType: 0
                })
                break;
        }
    }

    componentWillUnmount() {
        this.unregisterMessageBar();

    }

    generateStyle(item, index, section, tournamentList, futureEvent, appointment, passEvent) {

        if (section.title === 0 && tournamentList.length - 1 === index ||
            section.title === 1 && futureEvent.length - 1 === index ||
            section.title === 2 && appointment.length - 1 === index ||
            section.title === 3 && passEvent.length - 1 === index) {
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

    isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom
    }

    loadMoreData() {
        console.log('loadMoreData');
        this.page++;
        this.requestListEvent();
    }

    // setTabChange(offset) {
    //     console.log('setTabChange')
    //     if (this.refSectionList)
    //         this.refSectionList.scrollToLocation({ itemIndex: 0, sectionIndex: 0, viewOffset: 0, animated: true, });
    // }

    handleHeaderLayout(event) {
        const { x, y, width, height } = event.nativeEvent.layout
        console.log('handleHeaderLayout', x, y, width, height)
        if (this.state.sectionPaddingTop === 0 || this.state.sectionPaddingTop != height + verticalScale(170)) {
            this.setState({
                sectionPaddingTop: height + verticalScale(170)
            })
        }
    }

    onCreateEventPress() {
        this.navigation.navigate('club_create_event_view', {
            isUpdate: false,
            clubId: this.clubId,
            clubList: this.clubList,
            isPersonal: this.isPersonal,
            onScreenCallback: this.onScreenCallback
        })
    }

    onCreateAppointmentPress() {
        this.navigation.navigate('event_create', {
            isUpdate: false,
            clubId: this.clubId,
            clubList: this.clubList,
            isPersonal: this.isPersonal,
            onScreenCallback: this.onScreenCallback
        })
    }

    onTournamentPress(tournamentModel) {
        this.navigation.navigate('tournament_detail_view', {
            tournamentModel: tournamentModel,
            tournamentCallback: this.tournamentCallback.bind(this)
        })
    }

    tournamentCallback() {
        this.requestListEvent(true);
    }

    onEventItemPress(event, section) {
        let { title } = section;
        if (title === 2) {
            this.navigation.navigate('club_event_detail_view', {
                eventProps: event,
                isAppointment: true,
                onScreenCallback: this.onScreenCallback
            })
        } else {
            this.navigation.navigate('club_event_detail_view', {
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
        let isAppointment = (title === 2);
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
        let { dataSections } = this.state;
        let { title, data } = section;

        let eventIndex = data.findIndex((item) => {
            return item.getId() === event.getId();
        })
        console.log('removeEventFromList', eventIndex, index)
        if (eventIndex != -1) {
            data.splice(index, 1);
            for (let item of dataSections) {
                if (item.title === section.title) {
                    item.data = data;
                    break;
                }
            }

            this.setState({
                dataSections: dataSections
            })
        }

    }

    requestListEvent(isMustClear = false) {
        let self = this;
        if (this.internalLoading)
            this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.get_appointment_list(this.page)
        console.log("url = ", url);
        Networking.httpRequestGet(url, this.onListEventResponse.bind(this, isMustClear), () => {
            if (self.internalLoading)
                self.internalLoading.hideLoading();
            //self.popupTimeOut.showPopup();
            if (self.refEmptyData && self.page === 1) {
                self.refEmptyData.showEmptyView();
            }
            if (self.page > 1) {
                self.page--;
            }
        });
    }

    onListEventResponse(isMustClear, jsonData) {
        let { futureEvent, passEvent, appointment, tournamentList } = this.state;
        if (isMustClear) {
            futureEvent = [];
            passEvent = [];
            appointment = [];
            tournamentList = [];
        }
        this.model = new ClubEventModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            this.clubList = this.model.getClubAdminList();
            let futureEvent = this.model.getFutureEvents();
            let passEvent = this.model.getPassEvents();
            let appointment = this.model.getAppointmentList();
            let tournamentList = this.model.getTournamentList();
            if (futureEvent.length > 0 || passEvent.length > 0 || appointment.length > 0 || tournamentList.length > 0) {
                // if (tournamentList.length > 0) {
                //     dataSections.push({ title: this.t('tournament_info'), data: tournamentList })
                // }
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
                this.setState({
                    futureEvent: futureEvent,
                    passEvent: passEvent,
                    appointment: appointment,
                    tournamentList: tournamentList
                }, () => {
                    // this.refCalendarEventView.setDateEvent([...futureEvent, ...appointment]);
                })
            } else {
                this.setState({});
                if (this.refEmptyData && this.page === 1)
                    this.refEmptyData.showEmptyView();
            }

        } else {
            this.showErrorMsg(this.model.getErrorMsg());
        }
        if (this.internalLoading)
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
    view_add_event: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingBottom: 8,
        paddingTop: 8,
        paddingLeft: 10,
        paddingRight: 10,
        minHeight: scale(50),
        borderColor: '#D6D4D4',
        borderWidth: 1,
        borderRadius: scale(10),
        marginLeft: scale(10),
        marginRight: scale(10),
    },
    txt_content: {
        color: '#262626',
        fontSize: fontSize(15),
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
    txt_sub_content: {
        color: '#A4A4A4',
        fontSize: fontSize(13),
    }
});