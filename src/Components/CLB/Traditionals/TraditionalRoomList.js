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
import TraditionalItemView from '../Items/TraditionalItemView';
import ClubEventModel from '../../../Model/Events/ClubEventModel';
import PopupYesOrNo from '../../Common/PopupYesOrNo';
import { scale, fontSize } from '../../../Config/RatioScale';

export default class TraditionalRoomList extends BaseComponent {

    constructor(props) {
        super(props);
        this.userProfile = this.getUserInfo().getUserProfile();
        let { view_all, clubName, clubId, logoUrl, totalMember, isAdmin, isAddImage } = this.props.navigation.state.params;
        console.log('TraditionalRoomList', clubId)
        this.clubName = clubName;
        this.clubId = clubId;
        this.isAddImage = isAddImage;
        this.isAdmin = isAdmin;
        this.totalMember = totalMember;
        this.page = 1;
        this.clubList = [];
        this.state = {
            futureEvent: [],
            passEvent: []
        }

        this.onBackPress = this.onBackPress.bind(this);
        this.onIconMenuClick = this.onIconCalendarClick.bind(this);
        this.onScreenCallback = this.onScreenCallback.bind(this);
        this.onCreateEventPress = this.onCreateEventPress.bind(this);
    }

    renderCreateEventBtn() {
        if (this.isAddImage) {
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
        }
        return null;
    }

    render() {
        let { futureEvent, passEvent } = this.state;
        let isShowSession = futureEvent.length > 0 || passEvent.length > 0;
        let dataSections = [];

        if (futureEvent.length > 0) {
            dataSections.push({ title: 0, data: futureEvent })
        }
        if (passEvent.length > 0) {
            dataSections.push({ title: 1, data: passEvent })
        }
        return (
            <View style={styles.container}>

                <HeaderView
                    title={this.isAddImage ? this.t('add_photo') : this.t('traditional_room')}
                    handleBackPress={this.onBackPress}
                // iconMenu={this.getResources().ic_calender}
                // iconMenuStyle={styles.icon_menu_style}
                // onIconMenuClick={this.onIconMenuClick}
                />

                {this.renderCreateEventBtn()}

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
                                    this.generateStyle(item, index, section, futureEvent, passEvent)]
                                }>
                                    <TraditionalItemView
                                        eventObject={item}
                                        uid={this.userProfile.getId()}
                                        onPress={this.onEventItemPress.bind(this, item, section)} />
                                </View>

                            }
                            renderSectionHeader={({ section: { title } }) => (
                                <View style={{ backgroundColor: '#fff', paddingTop: 10 }}>
                                    <View style={styles.view_section}>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_section}>
                                            {title === 0 ? this.t('recent_event') : this.t('pass_event')}
                                        </Text>
                                        <View style={{ backgroundColor: '#D6D4D4', height: 1, flex: 1 }} />
                                    </View>
                                </View>
                            )}
                            ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                            sections={dataSections}
                            keyExtractor={(item, index) => item + index}
                            stickySectionHeadersEnabled={true}
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

                {/* <PopupYesOrNo
                    ref={(refPopupYesOrNo) => { this.refPopupYesOrNo = refPopupYesOrNo; }}
                    content={''}
                    confirmText={this.t('agree')}
                    cancelText={this.t('cancel')}
                    onConfirmClick={this.onConfirmDeleteEventClick} /> */}

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

    generateStyle(item, index, section, futureEvent, passEvent) {

        if (section.title === 0 && futureEvent.length - 1 === index ||
            section.title === 1 && passEvent.length - 1 === index) {
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

    onEventItemPress(event, section) {
        console.log('onEventItemPress', event)
        this.props.navigation.navigate('traditional_detail_view', {
            eventProps: event,
            onScreenCallback: this.onScreenCallback,
            isAddImage: this.isAddImage
        })

    }

    onScreenCallback() {
        console.log('onScreenCallback');
        this.requestListEvent(true);
        if(this.props.navigation.state.params.updateCallback){
            this.props.navigation.state.params.updateCallback();
        }
    }

    requestListEvent(isMustClear = false) {
        let self = this;
        this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.club_traditional_list(this.clubId, this.page);
        console.log("url = ", url);
        Networking.httpRequestGet(url, this.onListEventResponse.bind(this, isMustClear), () => {
            self.internalLoading.hideLoading();
            //self.popupTimeOut.showPopup();
            if (this.refEmptyData && this.page === 1)
                this.refEmptyData.showEmptyView();
        });
    }

    onListEventResponse(isMustClear, jsonData) {
        let { futureEvent, passEvent } = this.state;
        if (isMustClear) {
            futureEvent = [];
            passEvent = [];
            this.page = 1;
        }
        this.model = new ClubEventModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            let futureEvent = this.model.getFutureEvents();
            let passEvent = this.model.getPassEvents();
            if (futureEvent.length > 0 || passEvent.length > 0) {
                this.setState({
                    futureEvent: futureEvent,
                    passEvent: passEvent
                }, () => {
                })
            } else {
                this.setState({}, () => {
                    if (this.refEmptyData && this.page === 1)
                        this.refEmptyData.showEmptyView();
                });

            }

        } else {
            this.showErrorMsg(this.model.getErrorMsg());
        }
        this.internalLoading.hideLoading();
    }

    onIconCalendarClick() {
    }

    onCreateEventPress() {
        this.props.navigation.navigate('club_create_event_view', {
            clubId: this.clubId,
            clubList: [],
            isPersonal: false,
            isAddImage: true,
            onScreenCallback: this.onScreenCallback
        })
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
    txt_sub_content: {
        color: '#A4A4A4',
        fontSize: fontSize(13),
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
        minHeight: scale(40),
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