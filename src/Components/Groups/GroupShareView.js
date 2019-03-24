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
    PermissionsAndroid,
    LayoutAnimation
} from 'react-native';
import HeaderView from '../HeaderView';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import CustomLoading from '../Common/CustomLoadingView';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import Share from 'react-native-share';
import ViewShot from "react-native-view-shot";
import Weather from '../Common/WeatherInfoView';
import MyView from '../../Core/View/MyView';
import MemberFlightEventItem from '../CLB/Items/MemberFlightEventItem';
import moment from 'moment';
import FlightGroupModel from '../../Model/Group/FlightGroupModel';
import FloatBtnActionView from '../Common/FloatBtnActionView';
import ShareHeaderItem from './Items/ShareHeaderItem';
import { fontSize, scale, verticalScale } from '../../Config/RatioScale';

const screenWidth = Dimensions.get('window').width;
const PAGING_SHARE = 3;

export default class GroupShareView extends BaseComponent {

    constructor(props) {
        super(props);
        this.onShareClick = this.onShareClick.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.backHandler = null;
        this.player_list_copy = [];
        this.img_share = [];
        this.totalPage = 1;
        this.currentPage = 0;
        this.tee = this.props.navigation.state.params.tee;
        this.group_id = this.props.navigation.state.params.group_id;
        this.flatListOffset = 0;
        this.shareShowing = true;
        this.state = {
            memberFlightList: this.props.navigation.state.params.memberFlightList || [],
            dataGroup: this.props.navigation.state.params.data || {},
            course: this.props.navigation.state.params.course || {},
            isSharing: false
        }
    }

    onBackPress() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.handleHardwareBackPress();

        let groupList = this.state.memberFlightList;
        if (groupList.length > 0) {
            try {
                let flight_group_id = groupList[groupList.length - 1].data[0].flight_group_id;
                this.requestGroupFlight(flight_group_id);
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

    requestGroupFlight(flight_group_id) {
        this.showCustomLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.list_flight_group_by_id_flight_start(flight_group_id);
        console.log("requestGroupFlight", url);
        let formData = {
            "group_id": this.group_id,
        }
        if (this.state.course) {
            formData.course = this.state.course;
        }
        if (this.tee) {
            formData.tee = this.tee;
        }
        Networking.httpRequestPost(url, (jsonData) => {
            self.hideCustomLoading();
            self.model = new FlightGroupModel();
            self.model.parseData(self.state.memberFlightList.length, jsonData);
            if (self.model.getErrorCode() === 0) {
                let ls = this.model.getFlightGroup();
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
            this.refFloatActionView.setVisible(false);
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
                .catch((error) => {
                    // console.log('shareEvent.error', error)
                    this.hideCustomLoading();
                });
        } else {
            this.hideCustomLoading();
        }
        this.setState({
            isSharing: false,
            memberFlightList: memberFlightList
        }, () => {
            this.refFloatActionView.setVisible(true);
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

    renderSectionHeader({ index, max_member, group_id, flight_group_id }) {
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
                onScroll={this.onScroll}
                keyExtractor={(item, index) => item + index}
            />
        );
    }

    render() {
        let { isSharing, dataGroup, memberFlightList, course } = this.state;
        console.log('data', dataGroup, course)
        let eventName = dataGroup.groupName;
        let courseName = course.title;
        let facilityId = course.facility_id;
        let teeTimestamp = Date.now();
        let teeTime = moment(teeTimestamp).format("HH:mm, DD/MM/YYYY"); //eventDetailModel.getTeeTimeDisplay();
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


                <ShareHeaderItem
                    eventName={eventName}
                    courseName={courseName}
                    teeTime={teeTime}
                    teeTimestamp={teeTimestamp}
                    facilityId={facilityId} />
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
                {/* <MyView hide={isSharing}>
                    <Touchable onPress={this.onShareClick.bind(this)}>
                        <View style={styles.share_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.share_text}>{this.t('continue_lower_case')}</Text>
                        </View>
                    </Touchable>
                    
                </MyView> */}
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    share_text: {
        fontSize: fontSize(18, scale(4)),
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: verticalScale(10),
        paddingTop: verticalScale(10)
    },
    share_view: {
        backgroundColor: '#00aba7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    teetime: {
        fontSize: fontSize(14),
        color: '#adadad',
        textAlign: 'center',
        marginLeft: scale(10)
    },

    title_event: {
        fontSize: fontSize(22, scale(8)),
        color: '#383838',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    facility_name: {
        fontSize: fontSize(20, scale(6)),
        color: '#383838',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    logo_vgs: {
        marginLeft: fontSize(15, scale(1)),
        width: verticalScale(50),
        height: verticalScale(50),
        resizeMode: 'contain'
    },
    logo_view: {
        height: verticalScale(60),
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: verticalScale(15)
    },
    logo_usga: {
        width: verticalScale(50),
        height: verticalScale(50),
        resizeMode: 'contain'
    },
    separator_view: {
        height: 1,
        backgroundColor: '#d6d4d4',
        marginRight: scale(10),
        marginLeft: scale(10)
    },
    line: {
        height: 1,
        backgroundColor: '#d6d4d4',
        marginTop: verticalScale(15)
    },
    body: {
        flex: 1,
        marginLeft: scale(10),
        marginRight: scale(10),
        marginBottom: verticalScale(10),
        borderWidth: scale(2),
        marginTop: verticalScale(15),
        borderColor: '#a1a1a1',
        backgroundColor: '#fff'
    },
    view_section: {
        backgroundColor: '#37B2E7',
        justifyContent: 'space-between',
        marginLeft: scale(10),
        marginRight: scale(10)
    },
    txt_section: {
        color: '#fff',
        fontSize: fontSize(15, scale(1)),
        paddingLeft: scale(5),
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5)
    },
});