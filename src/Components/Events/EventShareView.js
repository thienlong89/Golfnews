import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ListView,
    BackHandler,
    Image,
    Dimensions,
    ScrollView
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../Common/HeaderView';
import EventUserItem from './Items/EventUserItemShare';
import CustomLoading from '../Common/CustomLoadingView';
import ApiService from '../../Networking/ApiService';
import Share from 'react-native-share';
import ViewShot from "react-native-view-shot";
import Weather from '../Common/WeatherInfoView';
import MyView from '../../Core/View/MyView';

import {scale, verticalScale, fontSize} from '../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

const screenWidth = Dimensions.get('window').width;
const PAGING_SHARE = 10;

export default class EventShareView extends BaseComponent {
    constructor(props) {
        super(props);
        this.backHandler = null;
        this.player_list_copy = [];
        this.img_share = [];
        this.totalPage = 1;
        this.currentPage = 0;
        this.state = {
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            isSharing: false
        }
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBackClick.bind(this));
        let { data, list_users } = this.props.navigation.state.params;
        if (this.headerView) {
            this.headerView.setTitle(this.t('event') + ' - ' + data.name);
            this.headerView.callbackBack = this.onBackClick.bind(this);
        }
        //console.log("lít user : ",list_users);
        if (list_users && list_users.length) {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(list_users),
            });
        }
    }

    componentWillUnmount() {
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    onBackClick() {
        let { navigation } = this.props;
        if (navigation) {
            navigation.goBack();
        }
        return true;
    }

    async onShareClick() {
        this.showCustomLoading();
        this.currentPage = 0;
        let { list_users } = this.props.navigation.state.params;
        this.totalPage = Math.ceil(list_users.length / PAGING_SHARE);
        for (let i = 0; i < list_users.length; i += PAGING_SHARE) {
            this.player_list_copy = list_users.slice(i, i + PAGING_SHARE);
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
            dataSource: this.state.dataSource.cloneWithRows(this.player_list_copy),
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
        if(this.intervalId){
            clearInterval(this.intervalId);
        }
    }

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async captureView() {

        // let imageUri = await this.getAppUtil().onSnapshotClick(this.getViewShare());
        let imageUri = await this.getAppUtil().onSnapshotClick(this.shareView);
        this.img_share.push(imageUri);
    }

    shareEvent() {
        let { list_users } = this.props.navigation.state.params;
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
            dataSource: this.state.dataSource.cloneWithRows(list_users)
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

    sendUploadEvent(uri) {
        let url = this.getConfig().getBaseUrl() + ApiService.event_upload_share();
        let self = this;
        // this.loading.showLoading();
        //console.log("url upload event image ",url);
        this.setTimeOut();
        this.customLoading.setVisible(true);
        this.getAppUtil().upload(url, uri, (jsonData) => {
            console.log("update img event shate ", jsonData);
            self.customLoading.setVisible(false);
            if (self.intervalId) {
                clearInterval(self.intervalId);
            }
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    let data = jsonData['data'];
                    let image_paths = data['image_paths'];
                    if (image_paths.length) {
                        let obj = image_paths[0];
                        let url = (obj && obj.url) ? obj.url : '';
                        this.getAppUtil().ShareUrl(url);
                    }
                }
            }
            // self.loading.hideLoading();
        }, () => {
            self.customLoading.setVisible(false);
            if (self.intervalId) {
                clearInterval(self.intervalId);
            }
        });
    }

    getViewShare() {
        let { data } = this.props.navigation.state.params;
        return (
            <ViewShot ref={(shareView) => { this.shareView = shareView; }}
                captureMode="mount"
                style={{ flex: 1 }}
                collapsable={false}>
                <View style={styles.body}
                    collapsable={false}>

                    <View style={styles.logo_view}>
                        <Image style={styles.logo_usga}
                            source={this.getResources().logo_usga} />
                        <Image style={styles.logo_vgs}
                            source={this.getResources().ic_logo} />
                    </View>
                    <Text allowFontScaling={global.isScaleFont} style={styles.title_event}>{this.t('event') + ' - ' + data.name}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.facility_name}>{data.facility_name}</Text>
                    <View style={{ height: this.getRatioAspect().verticalScal(30), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginRight: this.getRatioAspect().scale(10) }}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.teetime}>{this.t('event_tee_time')} : {data.tee_time}</Text>
                        <Weather
                            time={data.create_at_timestamp}
                            facilityId={data.facility_id} />
                    </View>
                    <View style={styles.line}></View>

                    {listMember}
                    <Image
                        style={{ width: this.state.isSharing ? screenWidth -scale(40) : 0, height: this.state.isSharing ? verticalScale(70) : 0, resizeMode: 'contain' }}
                        source={this.getResources().bottom_vgs}
                    />
                </View>
            </ViewShot>
        );
    }

    render() {
        let { data } = this.props.navigation.state.params;
        let { isSharing } = this.state;
        console.log('this.player_list_copy', this.player_list_copy.length);
        let listMember = Platform.OS === 'ios' && isSharing ? this.player_list_copy.map((rowData) => {
            return (<EventUserItem data={rowData} />);
        }) : (<ListView style={styles.container_body_listview}
            dataSource={this.state.dataSource}
            onEndReachedThreshold={5}
            keyboardShouldPersistTaps='always'
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
            //onEndReached={this.onLoadMore.bind(this)}
            enableEmptySections={true}
            renderRow={(rowData) =>
                <EventUserItem data={rowData} />
            } />)

        let viewContent = (
            <View style={styles.body}
                collapsable={false}>

                <View style={styles.logo_view}>
                    <Image style={styles.logo_usga}
                        source={this.getResources().logo_usga} />
                    <Image style={styles.logo_vgs}
                        source={this.getResources().ic_logo} />
                </View>
                <Text allowFontScaling={global.isScaleFont} style={styles.title_event}>{this.t('event') + ' - ' + data.name}</Text>
                <Text allowFontScaling={global.isScaleFont} style={styles.facility_name}>{data.facility_name}</Text>
                <View style={{ height: verticalScale(30), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginRight: scale(10) }}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.teetime}>{this.t('event_tee_time')} : {data.tee_time}</Text>
                    <Weather
                        time={data.create_at_timestamp}
                        facilityId={data.facility_id} />
                </View>
                <View style={styles.line}></View>

                {listMember}
                <Image

                    style={{ width: this.state.isSharing ? screenWidth - scale(40) : 0, height: this.state.isSharing ? verticalScale(70) : 0, resizeMode: 'contain' }}

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
                <HeaderView ref={(headerView) => { this.headerView = headerView; }} />
                {content}
                <MyView hide={isSharing}>
                    <Touchable onPress={this.onShareClick.bind(this)}>
                        <View style={styles.share_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.share_text}>{this.t('continue_lower_case')}</Text>
                        </View>
                    </Touchable>
                </MyView>

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
        fontSize: fontSize(18,2),// 18,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center'
    },

    share_view: {
        height: verticalScale(40),
        backgroundColor: '#00aba7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(10)
    },

    text_thoi_tiet: {
        fontSize: fontSize(14,-1),// 14,
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
        fontSize: fontSize(14),// 14,
        color: '#adadad',
        textAlign: 'center',
        marginLeft: scale(10)
    },

    container_body_listview: {
        flex: 1
    },

    title_event: {
        height:  verticalScale(32),
        fontSize: fontSize(26,10),// 26,
        color: '#383838',
        fontWeight: 'bold',
        textAlign: 'center'
    },

    facility_name: {
        height: verticalScale(28),
        fontSize: fontSize(22,scale(6)),// 22,
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
        marginLeft: scale(20),
        marginRight: scale(20),
        marginBottom: verticalScale(10),
        borderWidth: verticalScale(2),
        marginTop: verticalScale(15),
        borderColor: '#a1a1a1',
        backgroundColor: '#fff'
    }
});