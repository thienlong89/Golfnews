import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, Animated, InteractionManager } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import HeaderScreen from './HeaderScreen';
import ComCheckHandicap from './coms/ComCheckHandicap';
import { verticalScale, scale, fontSize } from '../../../Config/RatioScale';
import ComLeaderboard from './coms/ComLeaderboard';
import ComClubJoind from './coms/ComClubJoind';
import ComButtonHistory from './coms/ComButtonHistory';
import StatisticsItemView from '../../PlayerInfo/Items/StatisticsItemView';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import ComAward from './coms/ComAward';
import ComChart from './coms/ComChart';
import StaticProps from '../../../Constant/PropsStatic';
import Touchable from 'react-native-platform-touchable';
import PopupSelectTeeView from '../../Common/PopupSelectTeeView';
import BaseComponentAddBackHandler from '../../../Core/View/BaseComponentAddBackHandler';
import PopupNotificationView from '../../Popups/PopupNotificationView';
import ComFriends from './coms/ComFriends'
import ComPersonalImages from './coms/ComPersonalImages'

let { width, height } = Dimensions.get('window');
let btn_width = parseInt((width - scale(30)) / 2);

export default class ProfileScreen extends BaseComponentAddBackHandler {
    constructor(props) {
        super(props);

        this.onCertificateClick = this.onCertificateClick.bind(this);
        this.onStatisticalClick = this.onStatisticalClick.bind(this);
        this.onHdcUsgaPress = this.onHdcUsgaPress.bind(this);
        this.onSystemRankingPress = this.onSystemRankingPress.bind(this);
        this.onHdcTamTinhPress = this.onHdcTamTinhPress.bind(this);
        this.onViewAllFriend = this.onViewAllFriend.bind(this);
        //=========================================END======================================
        let { screenProps } = this.props;
        if (screenProps) {
            this.scroll = screenProps.scroll;
        } else {
            this.scroll = null;
        }
        this.state = {
            scrollY: this.props.scrollY
        }

        this.onFlatlistScroll = this.onFlatlistScroll.bind(this);
        this.flatListOffset = 0;

        this.showFlightHistory = this.showFlightHistory.bind(this);

        this.uid = this.getUserInfo().getId();
        this.userProfile = this.getUserInfo().getUserProfile();
        this.isLoadedData = false;
    }

    onFlatlistScroll(event) {
        // let currentOffset = event.nativeEvent.contentOffset.y;
        // let isUp = (currentOffset > 0 && currentOffset > this.flatListOffset)
        //     ? false
        //     : true;
        // if (this.scroll) {
        //     // console.log('............................... scorll : ', isUp);
        //     this.scroll(isUp);
        // }

        // // Update your scroll position
        // this.flatListOffset = currentOffset
        this.scroll(event);
    }

    componentDidMount() {
        this.addListenerBackHandler();
        this.getStatistics();

        // InteractionManager.runAfterInteractions(() => {
        //     this.setTabChange();
        // })
    }

    componentWillUnmount() {
        this.removeListenerBackHandler();
    }

    // setTabChange(offset) {
    //     console.log('setTabChange')
    //     if (!this.isLoadedData) {
    //         this.userProfile = this.getUserInfo().getUserProfile();
    //         this.getStatistics();
    //     } else {
    //         if (this.refScrollView) {
    //             this.refScrollView.scrollTo({ x: 0, y: verticalScale(110), animated: true })
    //         }
    //     }
    // }

    // componentDidUpdate(){
    //     if (this.refScrollView){
    //         this.refScrollView.scrollTo({x: 0, y: verticalScale(110), animated: true})
    //     }
    // }

    getStatistics() {
        let url = this.getConfig().getBaseUrl() + ApiService.user_chart();
        console.log('...............url chart : ', url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            let error_code = jsonData['error_code'];
            if (error_code === 0) {
                let data = jsonData['data'];
                self.chart1Data = data.hasOwnProperty('info_chart1') ? data['info_chart1'] : null;
                self.chart2Data = data.hasOwnProperty('info_chart2') ? data['info_chart2'] : null;
                self.chart3Data = data.hasOwnProperty('info_chart3') ? data['info_chart3'] : null;
                // self.refComChart.setChartData(self.chart1Data, self.chart2Data, self.chart3Data);

                self.refComAward.setBestNetBestGross(data);
                // this.setState({
                //     bestGross: data.best_gross,
                //     bestNet: data.best_net
                // },()=>{
                //     self.chart1View.setFillData(self.chart1Data);
                //     self.chart2View.setFillDataPar(self.chart2Data);
                // });
                this.isLoadedData = true;
            }
        }, () => {

        });
    }

    onCertificateClick() {
        let navigation = StaticProps.getAppSceneNavigator();
        if (navigation) {
            navigation.navigate('certificate', { orientationPortrait: this.rotateToPortrait.bind(this) });
        }
    }

    onStatisticalClick() {
        let navigation = StaticProps.getAppSceneNavigator();
        if (navigation) {
            navigation.navigate('statistical');
        }
    }

    onHdcUsgaPress() {
        let navigation = StaticProps.getAppSceneNavigator();
        if (navigation) {
            navigation.navigate('recent_handicap_info_view');
        }
    }

    onSystemRankingPress() {
        this.popupNotificationFull.setMsg(this.t('system_ranking_popup'));
    }

    onHdcTamTinhPress() {
        let navigation = StaticProps.getAppSceneNavigator();
        if (navigation && this.getUserInfo().getUserProfile().getUrlInfoHandicap().length) {
            navigation.navigate('handicap_info');
        }
    }

    showFlightHistory() {
        let navigation = StaticProps.getAppSceneNavigator();
        if (!navigation) return;
        navigation.navigate('flight_history_navigator_view', { puid: this.getUserInfo().getUserId() });
    }

    onViewAllFriend() {
        let navigation = StaticProps.getAppSceneNavigator();
        if (navigation) {
            navigation.navigate('friend_screen');
        }
    }

    renderProfile() {
        if (!this.userProfile) {
            return null
        }

        return (
            <View style={{ flex: 1, paddingBottom: scale(10) }}>
                <ComCheckHandicap />
                <ComFriends
                    onViewAllFriend={this.onViewAllFriend} />
                {/* <ComLeaderboard
                    onHdcUsgaPress={this.onHdcUsgaPress}
                    onSystemRankingPress={this.onSystemRankingPress}
                    onHdcTamTinhPress={this.onHdcTamTinhPress} /> */}
                <ComClubJoind />
                <View style={{ marginTop: verticalScale(10) }}>
                    {/* <Touchable onPress={this.onStatisticalClick}>
                        <View style={styles.view_btn}>
                            <Image
                                style={styles.btn_img}
                                source={this.getResources().ic_satitistical}
                            />
                            <Text allowFontScaling={global.isScaleFont} style={styles.btn_text}>{this.t('statistical')}</Text>
                        </View>
                    </Touchable> */}
                    <Touchable onPress={this.onCertificateClick}>
                        <View style={styles.view_btn}>
                            <Image
                                style={styles.btn_img}
                                source={this.getResources().ic_certificate}
                            />
                            <Text allowFontScaling={global.isScaleFont} style={styles.btn_text}>{this.t('certificate')}</Text>
                        </View>
                    </Touchable>
                </View>
                <Touchable onPress={this.showFlightHistory}>
                    <ComButtonHistory isMe={true} />
                </Touchable>

                <ComAward puid={this.uid} isShow={true} ref={(refComAward) => { this.refComAward = refComAward; }} />
                <ComPersonalImages />
                {/* <ComChart ref={(refComChart) => { this.refComChart = refComChart; }} /> */}
                <PopupNotificationView ref={(popupNotificationFull) => { this.popupNotificationFull = popupNotificationFull; }}
                    msg_text_style={styles.msg_text_style} />
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {/* <HeaderScreen title={this.t('title_profile').toUpperCase()} /> */}
                {/* <View style={{backgroundColor: '#00ABA7', height: 25}}/> */}
                {/* <Animated.View style={{ transform: [{ translateY: this.props.tabY }], zIndex: 2, position: 'absolute', top: this.home_page_title_padding_top, backgroundColor: '#fff' }}> */}
                <HeaderScreen title={this.t('title_profile').toUpperCase()} />
                {/* </Animated.View> */}
                <ScrollView
                    ref={(refScrollView) => { this.refScrollView = refScrollView; }}
                    // style={{paddingBottom : verticalScale(20)}}
                    contentContainerStyle={{ flexGrow: 1 }}
                    onScroll={this.onFlatlistScroll}
                    scrollEventThrottle={16}
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
                // contentContainerStyle={{ paddingTop: this.home_page_scroll_padding_top, minHeight: height + this.home_page_title_padding_top }}
                >
                    {this.renderProfile()}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        // paddingTop : verticalScale(10)
    },

    btn_text: {
        marginLeft: scale(15),
        fontSize: fontSize(16, scale(2)),
        color: '#343434'
    },

    view_btn: {
        height: verticalScale(50),
        borderColor: 'rgba(0,0,0,0.25)',
        borderRadius: 5,
        borderWidth: 1,
        marginLeft: scale(10),
        marginRight: scale(10),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    btn_img: {
        width: verticalScale(30),
        height: verticalScale(30),
        marginLeft: scale(15),
        resizeMode: 'contain',
        tintColor: '#282828'
    },
    msg_text_style: {
        //flex: 1,
        alignSelf: 'center',
        margin: scale(10),
        fontSize: fontSize(14, scale(3)),// 14,
        color: '#685d5d',
    }
});