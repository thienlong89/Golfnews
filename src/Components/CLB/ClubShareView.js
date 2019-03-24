import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    FlatList,
    BackHandler,
    Image,
    ScrollView,
    Dimensions
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import CustomLoading from '../Common/CustomLoadingView';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import ClubMemberShare from './Items/ClubMemberShare';
import Share from 'react-native-share';
import ViewShot from "react-native-view-shot";
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
let { width, height } = Dimensions.get('window');
import MyView from '../../Core/View/MyView';
import Constant from '../../Constant/Constant';
import CheckHandicapMemberItem from './Items/CheckHandicapMemberItem';
import ClubMemberPayFeeModel from '../../Model/CLB/ClubMemberPayFeeModel';
import FloatBtnActionView from '../Common/FloatBtnActionView';

const screenWidth = width;

export default class ClubShareView extends BaseComponent {
    constructor(props) {
        super(props);
        let { data, list_users, page, clubId, course, teeSelected } = this.props.navigation.state.params;
        this.backHandler = null;
        this.img_share = [];
        this.player_list_copy = [];
        this.currentPage = 1;
        this.totalPage = 1;
        this.page = page;
        this.clubId = clubId;
        this.courseData = course;
        this.teeSelected = teeSelected;
        this.allMemberList = list_users;
        this.data = data;
        this.state = {
            dataSource: this.allMemberList, //new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            isSharing: false
        }

        this.onShareClick = this.onShareClick.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
    }

    onBackPress() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();

        this.requestCheckHandicapAll();

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

    requestCheckHandicapAll() {
        let formData = {
            "club_id": this.clubId
        }

        if (this.courseData) {
            formData.course = this.courseData.getCourse();
        }

        if (this.teeSelected && this.teeSelected.tee) {
            formData.tee = this.teeSelected.tee;
        }

        this.formData = formData;
        console.log('formData check cap ', formData);
        let url = this.getConfig().getBaseUrl() + ApiService.club_get_course_handicap_by_club_id_with_page(this.clubId, this.page + 1);
        console.log('url', url);
        this.internalLoading.showLoading();
        let self = this;
        Networking.httpRequestPost(url, (jsonData) => {
            console.log('check cap san : ', jsonData);
            this.model = new ClubMemberPayFeeModel(this);
            this.model.parseData(jsonData);
            if (this.model.getErrorCode() === 0) {
                let listMember = this.model.getMemberList();
                if (listMember.length > 0) {
                    this.setState({
                        dataSource: [...this.state.dataSource, ...listMember],
                    }, () => {
                        this.allMemberList = this.state.dataSource;
                    })
                }
            } else {
                this.showErrorMsg(this.model.getErrorMsg())
            }
            self.internalLoading.hideLoading();
        }, formData, () => {
            if (this.page > 1) this.page--;
            self.internalLoading.hideLoading();
        });
    }

    waiting_for_miniseconds(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async renderCapture() {
        console.log('renderCapture');
        await this.setState({
            isSharing: true,
            dataSource: this.player_list_copy//this.state.dataSource.cloneWithRows(this.player_list_copy),
        }, () => {
            this.refFloatActionView.setVisible(false);
        });
        await this.waiting_for_miniseconds(3000);
        await this.captureView();
    }

    async onShareClick() {
        this.isCaptureFinish = false;
        this.showCustomLoading();
        this.currentPage = 0;
        this.totalPage = Math.ceil(this.allMemberList.length / Constant.NUMBER_PAGE_SHARE_VIEW);
        for (let i = 0; i < this.allMemberList.length; i += Constant.NUMBER_PAGE_SHARE_VIEW) {
            this.player_list_copy = this.allMemberList.slice(i, i + Constant.NUMBER_PAGE_SHARE_VIEW);
            // console.log('onShareClick', this.player_list_copy);
            this.currentPage++;
            await this.renderCapture();
        }
        this.shareEvent();
    }

    shareEvent() {
        //this.customLoading.showLoading();
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
            dataSource: this.allMemberList//this.state.dataSource.cloneWithRows(list_users)
        }, () => {
            this.refFloatActionView.setVisible(true);
        });
    }

    async captureView() {
        let imageUri = await this.getAppUtil().onSnapshotClick(this.shareView);
        this.img_share.push(imageUri);
    }

    setTimeOut() {
        this.intervalId = setInterval(() => {
            if (this.customLoading) {
                this.customLoading.hideLoading();
            }
            clearInterval(this.intervalId);
        }, 30000);
    }

    render() {
        let { isSharing, dataSource } = this.state;
        let listMember = Platform.OS === 'ios' && isSharing ? this.player_list_copy.map((item) => {
            return (<CheckHandicapMemberItem
                data={item}
                index={index} />);
        }) : (<FlatList
            style={styles.container_body_listview}
            data={dataSource}
            onEndReachedThreshold={5}
            keyboardShouldPersistTaps='always'
            ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
            //onEndReached={this.onLoadMore.bind(this)}
            enableEmptySections={true}
            renderItem={({ item, index }) =>
                <CheckHandicapMemberItem
                    data={item}
                    index={index} />
            } />)

        let viewContent = (
            <View style={styles.body}>
                <View style={styles.logo_view}>
                    <Image style={styles.logo_usga}
                        source={this.getResources().logo_usga} />
                    <Image style={styles.logo_vgs}
                        source={this.getResources().ic_logo} />
                </View>
                <Text allowFontScaling={global.isScaleFont} style={styles.facility_name}>{this.data.facility_name}</Text>
                <Text allowFontScaling={global.isScaleFont} style={styles.club_name}>{this.t('club_name')} : {this.data.club_name}</Text>
                <View style={styles.line}></View>
                {listMember}
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
                style={{ flex: 1 }}>
                {viewContent}
            </ViewShot>
        );

        let content = (
            isSharing ? (
                <ScrollView >
                    {shareContent}
                </ScrollView>
            ) :
                (<View style={{ flex: 1 }}>
                    {viewContent}
                </View>)
        );
        return (
            <View style={styles.container}>
                <HeaderView
                    title={this.data.club_name}
                    handleBackPress={this.onBackPress} />
                <View style={{ flex: 1 }}>
                    {content}
                    <FloatBtnActionView
                        ref={(refFloatActionView) => { this.refFloatActionView = refFloatActionView; }}
                        icon={this.getResources().ic_arrow_right_new}
                        isShowing={!isSharing}
                        onFloatActionPress={this.onShareClick}
                        text={this.t('continue_lower_case')} />
                    <CustomLoading ref={(customLoading) => { this.customLoading = customLoading; }} />
                    {this.renderInternalLoading()}
                </View>

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
        fontSize: fontSize(18, 1),// 18,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },

    share_view: {
        height: verticalScale(40),
        backgroundColor: '#00aba7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(10)
    },

    text_thoi_tiet: {
        fontSize: fontSize(14, -1),// 14,
        color: '#adadad',
        marginRight: scale(10),
        textAlign: 'center'
    },

    icon_thoi_tiet: {
        width: verticalScale(22),
        height: verticalScale(22),
        resizeMode: 'contain',
        marginRight: scale(5)
    },

    teetime: {
        fontSize: fontSize(14, -1),// 14,
        color: '#adadad',
        textAlign: 'center',
        marginLeft: scale(10)
    },

    container_body_listview: {
        flex: 1
    },

    facility_name: {
        height: verticalScale(32),
        fontSize: fontSize(26, 8),// 26,
        color: '#383838',
        fontWeight: 'bold',
        textAlign: 'center'
    },

    club_name: {
        height: verticalScale(30),
        fontSize: fontSize(22, scale(8)),
        color: '#383838',
        fontWeight: 'bold',
        textAlign: 'center'
    },

    logo_vgs: {
        marginLeft: scale(15),
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
        backgroundColor: '#d6d4d4'
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
        borderWidth: verticalScale(2),
        marginTop: verticalScale(10),
        borderColor: '#a1a1a1',
        backgroundColor: '#fff'
    }
});