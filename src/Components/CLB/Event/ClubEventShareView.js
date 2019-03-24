import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    SectionList,
    BackHandler,
    Image,
    Dimensions,
    ScrollView,
    LayoutAnimation,
    PermissionsAndroid
} from 'react-native';
import HeaderView from '../../HeaderView';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import CustomLoading from '../../Common/CustomLoadingView';
import Share from 'react-native-share';
import ViewShot from "react-native-view-shot";
import Weather from '../../Common/WeatherInfoView';
import MyView from '../../../Core/View/MyView';
import MemberFlightEventItem from '../Items/MemberFlightEventItem';
import FloatBtnActionView from '../../Common/FloatBtnActionView';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import FlightEventModel from '../../../Model/Events/FlightEventModel';

const screenWidth = Dimensions.get('window').width;
const PAGING_SHARE = 3;

export default class ClubEventShareView extends BaseComponent {

    constructor(props) {
        super(props);
        this.backHandler = null;
        this.player_list_copy = [];
        this.img_share = [];
        this.totalPage = 1;
        this.currentPage = 0;
        this.flatListOffset = 0;
        this.shareShowing = true;

        this.tee = this.props.navigation.state.params.tee;
        this.eventDetailModel = this.props.navigation.state.params.eventDetailModel || {};
        this.event_id = this.eventDetailModel ? this.eventDetailModel.getId() : null;
        this.course = this.eventDetailModel ? this.eventDetailModel.getCourse() : {};
        this.isAppointment = this.props.navigation.state.params.isAppointment;
        this.state = {
            memberFlightList: this.props.navigation.state.params.memberFlightList || [],
            isSharing: false
        }

        this.onShareClick = this.onShareClick.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }

    onBackPress() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.handleHardwareBackPress();

        let flightList = this.state.memberFlightList;
        if (flightList.length > 0) {
            try {
                let flight_event_id = flightList[flightList.length - 1].data[0].flight_event_id;
                this.requestEventFlight(flight_event_id);
            } catch (error) {
                console.log('requestGroupFlight.error', error)
            }
        }
    }

    componentWillUnmount() {
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

    requestEventFlight(flight_event_id) {
        this.showCustomLoading();
        let self = this;
        let url;

        if (this.isAppointment) {
            url = this.getConfig().getBaseUrl() + ApiService.get_list_flight_event_by_id_flight_start(flight_event_id);
        } else {
            url = this.getConfig().getBaseUrl() + ApiService.list_flight_event_by_id_flight_start(flight_event_id);
        }

        console.log("url", url);
        let formData = {
            "event_id": this.event_id,
        }
        if (this.course) {
            formData.course = this.course;
        }
        if (this.tee) {
            formData.tee = this.tee;
        }
        console.log('formData', JSON.stringify(formData))
        Networking.httpRequestPost(url, (jsonData) => {
            self.hideCustomLoading();
            self.model = new FlightEventModel();
            self.model.parseData(self.state.memberFlightList.length, jsonData);
            if (self.model.getErrorCode() === 0) {
                let ls = this.model.getFlightEvent();
                if (ls.length > 0) {
                    self.setState({
                        memberFlightList: [...this.state.memberFlightList, ...ls],
                    }, () => {

                    })
                }

            } else {
                //this.showErrorMsg(self.model.getErrorMsg());
            }
        }, formData,
            (error) => {
                self.hideCustomLoading();
            });
    }

    async onShareClick() {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            );
            if (!granted) {
                const response = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                );
                if (response === 'denied' || response === 'never_ask_again') {
                    return;
                }
            }
        }

        this.showCustomLoading();
        this.currentPage = 0;
        let { memberFlightList } = this.state;
        this.totalPage = Math.ceil(memberFlightList.length / PAGING_SHARE);
        for (let i = 0; i < memberFlightList.length; i += PAGING_SHARE) {
            this.player_list_copy = memberFlightList.slice(i, i + PAGING_SHARE);
            // console.log('onShareClick', this.player_list_copy);
            this.currentPage++;
            await this.renderCapture();
        }

        this.shareEvent();
    }

    async renderCapture() {
        console.log('renderCapture');
        await this.setState({
            isSharing: true,
            memberFlightList: this.player_list_copy
        }, () => {

        });

        await this.timeout(3000);

        await this.captureView();

    }

    showCustomLoading() {
        if (this.customLoading) {
            this.customLoading.showLoading();
            this.setTimeOut();
        }
    }

    hideCustomLoading() {
        if (this.customLoading) {
            this.customLoading.hideLoading();
        }
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async captureView() {
        let imageUri = await this.getAppUtil().onSnapshotClick(this.shareView);
        this.img_share.push(imageUri);
    }

    shareEvent() {
        let { memberFlightList } = this.props.navigation.state.params;
        // this.customLoading.showLoading();
        // console.log('this.img_share', this.img_share);
        if (this.img_share) {
            Share.open({ urls: this.img_share })
                .then(() => { this.hideCustomLoading(); })
                .catch((error) => { this.hideCustomLoading(); });
        } else {
            this.hideCustomLoading();
        }
        this.setState({
            isSharing: false,
            memberFlightList: memberFlightList
        })
    }

    setTimeOut() {
        this.intervalId = setInterval(() => {
            if (this.customLoading) {
                this.customLoading.hideLoading();
            }
            clearInterval(this.intervalId);
        }, 30000);
    }

    renderSectionHeader({ index, max_member }) {
        return (
            <View style={styles.view_section}>
                <Text allowFontScaling={global.isScaleFont} style={styles.txt_section}>
                    {`FLIGHT ${index}`.toUpperCase()}
                </Text>
            </View>
        )
    }

    renderListMember(memberFlightList) {
        return (
            <SectionList
                renderItem={({ item, index, section }) =>
                    <MemberFlightEventItem
                        memberItem={item}
                        isShowSwap={false}
                        isShareView={true} />
                }
                renderSectionHeader={({ section: { title } }) => this.renderSectionHeader(title)}
                ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                sections={memberFlightList}
                keyExtractor={(item, index) => item + index}
                onScroll={this.onScroll}
            />
        );
    }

    render() {
        let { isSharing, memberFlightList } = this.state;

        let month = this.eventDetailModel.getMonth();
        let day = this.eventDetailModel.getDay();
        let eventName = this.eventDetailModel.getName();
        let creator = this.eventDetailModel.getCreator().getFullName();
        let teeTime = this.eventDetailModel.getTeeTimeDisplay();
        let courseName = this.eventDetailModel.getCourse().getTitle();
        let facilityId = this.eventDetailModel.getFacilityId();
        let teeTimestamp = this.eventDetailModel.getTeeTimestamp();
        // console.log('this.player_list_copy', this.player_list_copy.length);
        // let listMember = Platform.OS === 'ios' && isSharing ? this.player_list_copy.map((rowData) => {
        //     return (<EventUserItem data={rowData} />);
        // }) : (<ListView style={styles.container_body_listview}
        //     dataSource={this.state.dataSource}
        //     onEndReachedThreshold={5}
        //     keyboardShouldPersistTaps='always'
        //     renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
        //     //onEndReached={this.onLoadMore.bind(this)}
        //     enableEmptySections={true}
        //     renderRow={(rowData) =>
        //         <EventUserItem data={rowData} />
        //     } />)

        let viewContent = (
            <View style={styles.body}
                collapsable={false}>

                <View style={styles.logo_view}>
                    <Image style={styles.logo_usga}
                        source={this.getResources().logo_usga} />
                    <Image style={styles.logo_vgs}
                        source={this.getResources().ic_logo} />
                </View>
                <Text allowFontScaling={global.isScaleFont} style={styles.title_event}>{this.t('event') + ' - ' + eventName}</Text>
                <Text allowFontScaling={global.isScaleFont} style={styles.facility_name}>{courseName}</Text>
                <View style={{ height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginRight: 10 }}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.teetime}>{this.t('event_tee_time')} : {teeTime}</Text>
                    <Weather
                        time={teeTimestamp}
                        facilityId={facilityId} />
                </View>
                {/* <View style={styles.line}></View> */}

                {this.renderListMember(memberFlightList)}
                <Image
                    style={{ width: isSharing ? screenWidth - 40 : 0, height: isSharing ? 70 : 0, resizeMode: 'contain' }}
                    source={this.getResources().bottom_vgs}
                />
                <MyView hide={!isSharing} style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                    <Text allowFontScaling={global.isScaleFont} style={{ color: 'black' }}>{`${this.t('page')} ${this.currentPage}/${this.totalPage}`}</Text>
                </MyView>

            </View>
        );

        let shareContent = (
            <ViewShot ref={(shareView) => { this.shareView = shareView; }}
                captureMode="mount"
                style={{ flex: 1 }}
                collapsable={false}>
                {viewContent}
            </ViewShot>
        );

        let content = (
            isSharing ? (
                <ScrollView >
                    {shareContent}
                </ScrollView>
            ) :
                (<View style={{ flex: 1 }}
                    collapsable={false}>
                    {viewContent}
                </View>)
        );
        return (
            <View style={styles.container}
                collapsable={false}>
                <HeaderView
                    title={this.t('share')}
                    handleBackPress={this.onBackPress.bind(this)} />
                {content}
                <FloatBtnActionView
                    ref={(refFloatActionView) => { this.refFloatActionView = refFloatActionView; }}
                    icon={this.getResources().ic_arrow_right_new}
                    isShowing={!isSharing}
                    onFloatActionPress={this.onShareClick}
                    text={this.t('continue_lower_case')} />

                <CustomLoading ref={(customLoading) => { this.customLoading = customLoading; }} />
            </View>
        );
    }

    onScroll(event) {
        const CustomLayoutLinear = {
            duration: 100,
            create: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
            update: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
            delete: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity }
        }
        // Check if the user is scrolling up or down by confronting the new scroll position with your own one
        const currentOffset = event.nativeEvent.contentOffset.y;
        const direction = (currentOffset > 0 && currentOffset > this.flatListOffset)
            ? 'down'
            : 'up'
        // If the user is scrolling down (and the action-button is still visible) hide it
        const isActionButtonVisible = direction === 'up'
        if (isActionButtonVisible !== this.shareShowing) {
            LayoutAnimation.configureNext(CustomLayoutLinear)
            this.shareShowing = isActionButtonVisible;
            this.refFloatActionView.setVisible(this.shareShowing);
        }
        // Update your scroll position
        this.flatListOffset = currentOffset
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    share_text: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 10,
        paddingTop: 10
    },
    share_view: {
        backgroundColor: '#00aba7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    teetime: {
        fontSize: 14,
        color: '#adadad',
        textAlign: 'center',
        marginLeft: 10
    },

    title_event: {
        fontSize: 22,
        color: '#383838',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    facility_name: {
        fontSize: 20,
        color: '#383838',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    logo_vgs: {
        marginLeft: 15,
        width: 50,
        height: 50,
        resizeMode: 'contain'
    },
    logo_view: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15
    },
    logo_usga: {
        width: 50,
        height: 50,
        resizeMode: 'contain'
    },
    separator_view: {
        height: 1,
        backgroundColor: '#d6d4d4',
        marginRight: 10,
        marginLeft: 10
    },
    line: {
        height: 1,
        backgroundColor: '#d6d4d4',
        marginTop: 15
    },
    body: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        borderWidth: 2,
        marginTop: 15,
        borderColor: '#a1a1a1',
        backgroundColor: '#fff'
    },
    view_section: {
        backgroundColor: '#37B2E7',
        justifyContent: 'space-between',
        marginLeft: 10,
        marginRight: 10
    },
    txt_section: {
        color: '#fff',
        fontSize: 15,
        paddingLeft: 5,
        paddingTop: 5,
        paddingBottom: 5
    },
});