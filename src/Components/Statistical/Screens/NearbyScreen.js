import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Platform,
    Dimensions
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import ModalDropdown from 'react-native-modal-dropdown';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import LoadingView from '../../../Core/Common/LoadingView';
import FlightDetailModel from '../../../Model/CreateFlight/Flight/FlightDetailModel';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
let { width, height } = Dimensions.get('window');

import I18n from 'react-native-i18n';
require('../../../../I18n/I18n');

const PAGE_KEY = {
    PAGE1: 'page1',
    PAGE2: 'page2',
    PAGE3: 'page3'
}

const VALUE_KEY = {
    COUNT_ROUND: 'count_round',
    BEST_NET: 'best_net',
    BEST_GROSS: 'best_gross',
    PAR: 'Par',
    DBOGEY: 'DBogie',
    BOGEY: 'Bogie',
    BIRDIE: 'Birdie',
    EAGLE_HIO: 'Eagle/HIO',
    PUTT: 'Putt',
    FAILSE: 'Failse',
    DRAWN: 'Drawn',
    SLICE: 'Slice',
    FAIRWAY: 'Fairway'
}

const INFO_KEY = {
    ID_BEST_NET: 'id_best_net_gross',
    ID_BEST_GROSS: 'id_best_over_gross'
}

export default class NearbyScreen extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            mode: '10',
            data: {},
            mode_10: {},
            mode_20: {},
            mode_50: {}
        }
    }

    static navigationOptions = () => ({
        title: I18n.t("recent_figures"),
        tabBarLabel: I18n.t("recent_figures"),
    });

    checkData(obj, page_key, value_key) {
        if (!Object.keys(obj).length) return '0';
        if (obj.hasOwnProperty(page_key)) {
            let page = obj[page_key];
            if (page.hasOwnProperty(value_key)) {
                return page[value_key];
            }
        }
        return '0';
    }

    componentDidMount() {
        this.sendRequestStatistical(this.state.mode);
    }

    /**
     * Gui yeu cau lay du lieu thong ke
     */
    sendRequestStatistical(mode) {
        this.customLoading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.statistical_list_nearby(mode);
        console.log('url: ', url);
        Networking.httpRequestGet(url, (jsonData) => {
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    let mode_10 = jsonData.mode_10 || {};
                    let mode_20 = jsonData.mode_20 || {};
                    let mode_50 = jsonData.mode_50 || {};
                    self.setState({
                        mode: mode,
                        mode_10: mode_10,
                        mode_20: mode_20,
                        mode_50: mode_50,
                    });
                } else if (error_code === 2) {
                    self.onCheckErrorCode(2, '');
                }
            }
            // self.loading.hideLoading();
            self.customLoading.hideLoading();
        }, () => {
            //time out
            //self.loading.hideLoading();
            self.customLoading.hideLoading();
            self.popupTimeOut.showPopup();
        });
    }

    /**
     * Tìm tên hiển thị theo mode
     * @param {*} mode 
     */
    findModeName(mode) {
        let mode_obj = global.statistical_mode.find(d => d.mode.toString().indexOf(mode) >= 0);
        return mode_obj ? mode_obj.name : '';
    }

    onSelectedMode(data, index) {
        console.log("data mode : ", data);
        this.dropdown_mode.hide();
        this.setState({
            mode: data.mode
        });
        this.sendRequestStatistical(data.mode);
    }

    showCustomLoading() {
        if (this.customLoading) {
            this.customLoading.showLoading();
        }
    }

    hideCustomLoading() {
        if (this.customLoading) {
            this.customLoading.hideLoading();
        }
    }

    /**
     * lay flight
     * @param {*} flight_id 
     */
    sendRequestFlight(flight_id) {
        this.showCustomLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.view_flight_detail(flight_id);
        //console.log("view url ",url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            //console.log('flight data',jsonData);
            self.hideCustomLoading();
            let model = new FlightDetailModel(self);
            model.parseData(jsonData);
            if (model.getErrorCode() === 0) {
                self.openScoreView(model);
            } else {
                //self.showErrorMsg(model.getErrorMsg())
            }
        }, () => {
            self.hideCustomLoading();
        });
    }

    /**
    * Xoay lai man hinh
    */
    onCloseScorecardListener() {
        this.Mxpo.ScreenOrientation.allow(this.Mxpo.ScreenOrientation.Orientation.PORTRAIT);
    }

    openScoreView(FlightDetailModel) {
        let { parentNavigation } = this.props.screenProps;
        // console.log("thong ke ", this.props);
        if (!parentNavigation) return;
        let isHostUser = false;
        parentNavigation.navigate('scorecard_view',
            {
                onCloseScorecard: this.onCloseScorecardListener.bind(this),
                'FlightDetailModel': FlightDetailModel,
                'isHostUser': isHostUser,
                //refresh: self.onRefresh.bind(self)
            });

    }

    viewDetailScorecardBest(flight_id) {
        console.log("view score card", flight_id);
        if (!flight_id) return;
        //flight_id = 210;//fake
        this.sendRequestFlight(flight_id);
    }

    render() {
        let {
            mode,
            data,
            mode_10,
            mode_20,
            mode_50
         } = this.state;
        let self = this;
        return (
            <View style={styles.container}>
                {/* {this.renderLoading()} */}
                <View style={styles.title_view}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.title_text}>{this.t('so_lieu_lay_theo')}</Text>
                    <View style={styles.line_horizontal} />
                    <Text allowFontScaling={global.isScaleFont} style={styles.title_item_text}>{this.t('mode_10')}</Text>
                    <View style={styles.line_horizontal} />
                    <Text allowFontScaling={global.isScaleFont} style={styles.title_item_text}>{this.t('mode_20')}</Text>
                    <View style={styles.line_horizontal} />
                    <Text allowFontScaling={global.isScaleFont} style={styles.title_item_text}>{this.t('mode_50')}</Text>

                    {/* <ModalDropdown
                        defaultValue={this.findModeName(mode)}
                        ref={(dropdown_mode) => { this.dropdown_mode = dropdown_mode; }}
                        style={styles.dropdown}
                        textStyle={styles.dropdown_text}
                        dropdownStyle={styles.dropdown_dropdown}
                        options={global.statistical_mode}
                        renderRow={(rowData, index, isSelected) =>
                            <View style={{ backgroundColor: isSelected ? '#99E6FF' : '#FFFFFF' }}>
                                <Touchable onPress={() => this.onSelectedMode(rowData, index)}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.text_dropdown}>{rowData.name}</Text>
                                </Touchable>
                            </View>
                        }
                    />
                    <Image
                        style={styles.image}
                        source={this.getResources().arrow_right}
                    /> */}
                </View>
                <ScrollView>
                    <View style={styles.content}>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('round_count')}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_10, PAGE_KEY.PAGE1, VALUE_KEY.COUNT_ROUND)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_20, PAGE_KEY.PAGE1, VALUE_KEY.COUNT_ROUND)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_50, PAGE_KEY.PAGE1, VALUE_KEY.COUNT_ROUND)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('best_score')}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text_best}
                                onPress={() => {
                                    self.viewDetailScorecardBest(mode_10.info[INFO_KEY.ID_BEST_NET]);
                                }}>{this.checkData(mode_10, PAGE_KEY.PAGE1, VALUE_KEY.BEST_NET)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text_best}
                                onPress={() => {
                                    self.viewDetailScorecardBest(mode_20.info[INFO_KEY.ID_BEST_NET]);
                                }}>{this.checkData(mode_20, PAGE_KEY.PAGE1, VALUE_KEY.BEST_NET)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text_best}
                                onPress={() => {
                                    self.viewDetailScorecardBest(mode_50.info[INFO_KEY.ID_BEST_NET]);
                                }}>{this.checkData(mode_50, PAGE_KEY.PAGE1, VALUE_KEY.BEST_NET)}</Text>
                            {/* <Touchable style={{ width: scale(145) }} onPress={() => {
                                self.viewDetailScorecardBest(mode_10.info[INFO_KEY.ID_BEST_NET]);
                            }}><Text allowFontScaling={global.isScaleFont} style={styles.item_value_text_best}>{this.checkData(mode_10, PAGE_KEY.PAGE1, VALUE_KEY.BEST_NET)}</Text></Touchable> */}
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('best_gross')}</Text>
                            <View style={styles.line_horizontal} />
                            {/* <Touchable style={{ width: scale(145) }} onPress={() => {
                                self.viewDetailScorecardBest(mode_10.info[INFO_KEY.ID_BEST_GROSS]);
                            }}><Text allowFontScaling={global.isScaleFont} style={styles.item_value_text_best}>{this.checkData(mode_10, PAGE_KEY.PAGE1, VALUE_KEY.BEST_GROSS)}</Text></Touchable> */}
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text_best}
                                onPress={() => {
                                    self.viewDetailScorecardBest(mode_10.info[INFO_KEY.ID_BEST_GROSS]);
                                }}>{this.checkData(mode_10, PAGE_KEY.PAGE1, VALUE_KEY.BEST_GROSS)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text_best}
                                onPress={() => {
                                    self.viewDetailScorecardBest(mode_20.info[INFO_KEY.ID_BEST_GROSS]);
                                }}>{this.checkData(mode_20, PAGE_KEY.PAGE1, VALUE_KEY.BEST_GROSS)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text_best}
                                onPress={() => {
                                    self.viewDetailScorecardBest(mode_50.info[INFO_KEY.ID_BEST_GROSS]);
                                }}>{this.checkData(mode_50, PAGE_KEY.PAGE1, VALUE_KEY.BEST_GROSS)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('d_bogey')}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_10, PAGE_KEY.PAGE2, VALUE_KEY.DBOGEY)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_20, PAGE_KEY.PAGE2, VALUE_KEY.DBOGEY)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_50, PAGE_KEY.PAGE2, VALUE_KEY.DBOGEY)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('bogey')}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_10, PAGE_KEY.PAGE2, VALUE_KEY.BOGEY)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_20, PAGE_KEY.PAGE2, VALUE_KEY.BOGEY)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_50, PAGE_KEY.PAGE2, VALUE_KEY.BOGEY)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('par')}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_10, PAGE_KEY.PAGE2, VALUE_KEY.PAR)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_20, PAGE_KEY.PAGE2, VALUE_KEY.PAR)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_50, PAGE_KEY.PAGE2, VALUE_KEY.PAR)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('birdie')}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_10, PAGE_KEY.PAGE2, VALUE_KEY.BIRDIE)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_20, PAGE_KEY.PAGE2, VALUE_KEY.BIRDIE)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_50, PAGE_KEY.PAGE2, VALUE_KEY.BIRDIE)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('eagle_hio')}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_10, PAGE_KEY.PAGE2, VALUE_KEY.EAGLE_HIO)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_20, PAGE_KEY.PAGE2, VALUE_KEY.EAGLE_HIO)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_50, PAGE_KEY.PAGE2, VALUE_KEY.EAGLE_HIO)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('putt')}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_10, PAGE_KEY.PAGE3, VALUE_KEY.PUTT)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_20, PAGE_KEY.PAGE3, VALUE_KEY.PUTT)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_50, PAGE_KEY.PAGE3, VALUE_KEY.PUTT)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('failse')}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_10, PAGE_KEY.PAGE3, VALUE_KEY.FAILSE)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_20, PAGE_KEY.PAGE3, VALUE_KEY.FAILSE)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_50, PAGE_KEY.PAGE3, VALUE_KEY.FAILSE)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('drawn')}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_10, PAGE_KEY.PAGE3, VALUE_KEY.DRAWN)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_20, PAGE_KEY.PAGE3, VALUE_KEY.DRAWN)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_50, PAGE_KEY.PAGE3, VALUE_KEY.DRAWN)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('slice')}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_10, PAGE_KEY.PAGE3, VALUE_KEY.SLICE)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_20, PAGE_KEY.PAGE3, VALUE_KEY.SLICE)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_50, PAGE_KEY.PAGE3, VALUE_KEY.SLICE)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('fairway')}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_10, PAGE_KEY.PAGE3, VALUE_KEY.FAIRWAY)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_20, PAGE_KEY.PAGE3, VALUE_KEY.FAIRWAY)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(mode_50, PAGE_KEY.PAGE3, VALUE_KEY.FAIRWAY)}</Text>
                        </View>
                    </View>
                </ScrollView>
                <LoadingView ref={(customLoading) => { this.customLoading = customLoading; }}
                    isShowOverlay={false} />
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        marginTop: verticalScale(5),
        // borderTopColor: '#424242', 
        // borderTopWidth: verticalScale(0.5), 
        // borderBottomColor: '#424242', 
        // borderBottomWidth: verticalScale(0.5),
        backgroundColor: '#fff'
    },

    content: {
        flex: 1,
        justifyContent: 'center'
    },

    image: {
        height: verticalScale(20),
        width: verticalScale(20),
        marginRight: scale(5),
        alignSelf: 'center',
        resizeMode: 'contain'
    },

    title_text: {
        marginLeft: scale(10),
        flex: 1,
        fontSize: fontSize(16, scale(1)),// 16, 
        color: '#000',
        fontWeight: 'bold',
        textAlignVertical: 'center'
    },
    title_item_text: {
        width: scale(70),
        fontSize: fontSize(16, scale(1)),// 16,
        color: '#000',
        fontWeight: 'bold',
        textAlignVertical: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    },

    title_view: {
        height: verticalScale(40),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eaeaea'
    },
    line_horizontal: {
        backgroundColor: '#DFDFDF',
        width: 1,
        height: verticalScale(40),
    },

    item_view: {
        height: verticalScale(40),
        flexDirection: 'row',
        borderTopColor: '#DFDFDF',
        alignItems: 'center',
        borderTopWidth: (Platform.OS === 'ios') ? verticalScale(1) : verticalScale(0.3)
    },

    item_label_text: {
        marginLeft: scale(10),
        flex: 1,
        fontSize: fontSize(14),// 14,
        color: '#424242',
        textAlignVertical: 'center'
    },

    item_value_text: {
        width: scale(70),
        fontSize: fontSize(14),// 14,
        color: '#424242',
        textAlignVertical: 'center',
        textAlign: 'center'
    },

    dropdown: {
        width: scale(120),
        height: verticalScale(30),
        marginLeft: 0,
        // borderRadius : 5,
        //backgroundColor : 'blue',
        justifyContent: 'center',
    },

    dropdown_text: {
        //marginVertical: 10,
        //marginHorizontal: 6,
        fontSize: fontSize(16, scale(1)),// 16,
        color: '#8f8e94',
        textAlign: 'left',
        marginLeft: 0,
        textAlignVertical: 'center',
    },

    text_dropdown: {
        color: '#615B5B',
        paddingLeft: scale(20),
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10)
    },

    dropdown_dropdown: {
        width: scale(120),
        borderColor: 'cornflowerblue',
        marginRight: 0,
        marginTop: verticalScale(2),
        borderWidth: scale(2),
        borderRadius: scale(3),
    },

    item_value_text_best: {
        width: scale(70),
        fontSize: fontSize(14),// 14,
        color: '#00aba7',
        textDecorationLine: 'underline',
        textAlign: 'center'
    },
});