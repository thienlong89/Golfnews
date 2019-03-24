import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Platform,
    Dimensions
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
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

export default class YearScreen extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            year0: '',
            year1: '',
            year2: '',
            all: '',
            obj_year0: {},
            obj_year1: {},
            obj_year2: {},
            obj_all: {}
        }
    }

    static navigationOptions = () => ({
        title: I18n.t("figures_by_year"),
        tabBarLabel: I18n.t("figures_by_year"),
    });

    componentDidMount() {
        this.sendRequestStatistical();
    }

    /**
     * Gửi yêu cầu lấy thông kê theo năm
     */
    sendRequestStatistical() {
        let date_year = new Date().getFullYear();
        // console.log("date_year : ",date_year);
        let obj_year0 = {};
        let obj_year1 = {};
        let obj_year2 = {};
        let obj_all = {};
        let url = this.getConfig().getBaseUrl() + ApiService.statistical_list_year();
        console.log("url full : ", url);
        this.customLoading.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('jsonData : ', jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    let data = jsonData.data || [];
                    for (let d of data) {
                        let type = parseInt(d.type) || -1;
                        if (type === date_year) {
                            obj_year2 = d;
                            self.state.year2 = type;
                        } else if (type === -1) {
                            //all
                            obj_all = d;
                            self.state.all = d.type;
                        } else if (type === date_year - 1) {
                            obj_year1 = d;
                            self.state.year1 = type;
                        } else if (type === date_year - 2) {
                            obj_year0 = d;
                            self.state.year0 = type;
                        }
                    }
                    self.setState({
                        // year1 : '',
                        // year2 : '',
                        obj_year0: obj_year0,
                        obj_year1: obj_year1,
                        obj_year2: obj_year2,
                        obj_all: obj_all
                    });
                } else if (error_code === 2) {
                    self.onCheckErrorCode(2, '');
                }
            }
            self.customLoading.hideLoading();
        }, () => {
            //time out
            self.customLoading.hideLoading();
            self.popupTimeOut.showPopup();
        });
    }

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
        console.log("view url ",url);
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
        console.log("thong ke ", parentNavigation);
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
        console.log("viewDetailScorecardBest", flight_id);
        if (!flight_id) return;
        //flight_id = 210;//fake
        this.sendRequestFlight(flight_id);
    }

    render() {
        let { mode, year0, year1, year2, obj_year0, obj_year1, obj_year2, obj_all, all } = this.state;
        //console.log('obj_year1 : ',obj_year1);
        let self = this;
        //let state = this.state;
        return (
            <View style={styles.container}>
                {/* {this.renderLoading()} */}
                <View style={styles.title_view}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.title_label_text}>{this.t('so_lieu')}</Text>
                    <View style={styles.line_horizontal} />
                    <Text allowFontScaling={global.isScaleFont} style={styles.title_item_text}>{`<${year0}`}</Text>
                    <View style={styles.line_horizontal} />
                    <Text allowFontScaling={global.isScaleFont} style={styles.title_item_text}>{year1}</Text>
                    <View style={styles.line_horizontal} />
                    <Text allowFontScaling={global.isScaleFont} style={styles.title_item_text}>{year2}</Text>
                    <View style={styles.line_horizontal} />
                    <Text allowFontScaling={global.isScaleFont} style={styles.title_item_text}>{this.t('all')}</Text>
                </View>
                <ScrollView>
                    <View style={styles.content}>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('round_count')}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year0, PAGE_KEY.PAGE1, VALUE_KEY.COUNT_ROUND)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year1, PAGE_KEY.PAGE1, VALUE_KEY.COUNT_ROUND)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year2, PAGE_KEY.PAGE1, VALUE_KEY.COUNT_ROUND)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_all, PAGE_KEY.PAGE1, VALUE_KEY.COUNT_ROUND)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('best_net')}</Text>
                            <View style={styles.line_horizontal} />
                            <Touchable style={{ width: scale(65) }} onPress={() => {
                                self.viewDetailScorecardBest(obj_year0.info[INFO_KEY.ID_BEST_NET]);
                            }}><Text allowFontScaling={global.isScaleFont} style={styles.item_value_text_best}>{this.checkData(obj_year0, PAGE_KEY.PAGE1, VALUE_KEY.BEST_NET)}</Text>
                            </Touchable>
                            <View style={styles.line_horizontal} />
                            <Touchable style={{ width: scale(65) }} onPress={() => {
                                self.viewDetailScorecardBest(obj_year1.info[INFO_KEY.ID_BEST_NET]);
                            }}><Text allowFontScaling={global.isScaleFont} style={styles.item_value_text_best}>{this.checkData(obj_year1, PAGE_KEY.PAGE1, VALUE_KEY.BEST_NET)}</Text>
                            </Touchable>
                            <View style={styles.line_horizontal} />
                            <Touchable style={{ width: scale(65) }} onPress={() => {
                                self.viewDetailScorecardBest(obj_year2.info[INFO_KEY.ID_BEST_NET]);
                            }}><Text allowFontScaling={global.isScaleFont} style={styles.item_value_text_best}>{this.checkData(obj_year2, PAGE_KEY.PAGE1, VALUE_KEY.BEST_NET)}</Text>
                            </Touchable>
                            <View style={styles.line_horizontal} />
                            <Touchable style={{ width: scale(65) }} onPress={() => {
                                self.viewDetailScorecardBest(obj_all.info[INFO_KEY.ID_BEST_NET]);
                            }}><Text allowFontScaling={global.isScaleFont} style={styles.item_value_text_best}>{this.checkData(obj_all, PAGE_KEY.PAGE1, VALUE_KEY.BEST_NET)}</Text>
                            </Touchable>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('best_gross')}</Text>
                            <View style={styles.line_horizontal} />
                            <Touchable style={{ width: scale(65) }} onPress={() => {
                                self.viewDetailScorecardBest(obj_year0.info[INFO_KEY.ID_BEST_GROSS]);
                            }}><Text allowFontScaling={global.isScaleFont} style={styles.item_value_text_best}>{this.checkData(obj_year0, PAGE_KEY.PAGE1, VALUE_KEY.BEST_GROSS)}</Text>
                            </Touchable>
                            <View style={styles.line_horizontal} />
                            <Touchable style={{ width: scale(65) }} onPress={() => {
                                self.viewDetailScorecardBest(obj_year1.info[INFO_KEY.ID_BEST_GROSS]);
                            }}><Text allowFontScaling={global.isScaleFont} style={styles.item_value_text_best}>{this.checkData(obj_year1, PAGE_KEY.PAGE1, VALUE_KEY.BEST_GROSS)}</Text>
                            </Touchable>
                            <View style={styles.line_horizontal} />
                            <Touchable style={{ width: scale(65) }} onPress={() => {
                                self.viewDetailScorecardBest(obj_year2.info[INFO_KEY.ID_BEST_GROSS]);
                            }}><Text allowFontScaling={global.isScaleFont} style={styles.item_value_text_best}>{this.checkData(obj_year2, PAGE_KEY.PAGE1, VALUE_KEY.BEST_GROSS)}</Text>
                            </Touchable>
                            <View style={styles.line_horizontal} />
                            <Touchable style={{ width: scale(65) }} onPress={() => {
                                self.viewDetailScorecardBest(obj_all.info[INFO_KEY.ID_BEST_GROSS]);
                            }}><Text allowFontScaling={global.isScaleFont} style={styles.item_value_text_best}>{this.checkData(obj_all, PAGE_KEY.PAGE1, VALUE_KEY.BEST_GROSS)}</Text>
                            </Touchable>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('d_bogey')}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year0, PAGE_KEY.PAGE2, VALUE_KEY.DBOGEY)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year1, PAGE_KEY.PAGE2, VALUE_KEY.DBOGEY)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year2, PAGE_KEY.PAGE2, VALUE_KEY.DBOGEY)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_all, PAGE_KEY.PAGE2, VALUE_KEY.DBOGEY)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('bogey')}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year0, PAGE_KEY.PAGE2, VALUE_KEY.BOGEY)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year1, PAGE_KEY.PAGE2, VALUE_KEY.BOGEY)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year2, PAGE_KEY.PAGE2, VALUE_KEY.BOGEY)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_all, PAGE_KEY.PAGE2, VALUE_KEY.BOGEY)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('par')}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year0, PAGE_KEY.PAGE2, VALUE_KEY.PAR)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year1, PAGE_KEY.PAGE2, VALUE_KEY.PAR)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year2, PAGE_KEY.PAGE2, VALUE_KEY.PAR)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_all, PAGE_KEY.PAGE2, VALUE_KEY.PAR)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('birdie')}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year0, PAGE_KEY.PAGE2, VALUE_KEY.BIRDIE)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year1, PAGE_KEY.PAGE2, VALUE_KEY.BIRDIE)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year2, PAGE_KEY.PAGE2, VALUE_KEY.BIRDIE)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_all, PAGE_KEY.PAGE2, VALUE_KEY.BIRDIE)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('eagle_hio')}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year0, PAGE_KEY.PAGE2, VALUE_KEY.EAGLE_HIO)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year1, PAGE_KEY.PAGE2, VALUE_KEY.EAGLE_HIO)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year2, PAGE_KEY.PAGE2, VALUE_KEY.EAGLE_HIO)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_all, PAGE_KEY.PAGE2, VALUE_KEY.EAGLE_HIO)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('putt')}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year0, PAGE_KEY.PAGE3, VALUE_KEY.PUTT)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year1, PAGE_KEY.PAGE3, VALUE_KEY.PUTT)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year2, PAGE_KEY.PAGE3, VALUE_KEY.PUTT)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_all, PAGE_KEY.PAGE3, VALUE_KEY.PUTT)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('failse')}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year0, PAGE_KEY.PAGE3, VALUE_KEY.FAILSE)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year1, PAGE_KEY.PAGE3, VALUE_KEY.FAILSE)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year2, PAGE_KEY.PAGE3, VALUE_KEY.FAILSE)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_all, PAGE_KEY.PAGE3, VALUE_KEY.FAILSE)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('drawn')}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year0, PAGE_KEY.PAGE3, VALUE_KEY.DRAWN)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year1, PAGE_KEY.PAGE3, VALUE_KEY.DRAWN)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year2, PAGE_KEY.PAGE3, VALUE_KEY.DRAWN)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_all, PAGE_KEY.PAGE3, VALUE_KEY.DRAWN)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('slice')}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year0, PAGE_KEY.PAGE3, VALUE_KEY.SLICE)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year1, PAGE_KEY.PAGE3, VALUE_KEY.SLICE)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year2, PAGE_KEY.PAGE3, VALUE_KEY.SLICE)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_all, PAGE_KEY.PAGE3, VALUE_KEY.SLICE)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('fairway')}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year0, PAGE_KEY.PAGE3, VALUE_KEY.FAIRWAY)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year1, PAGE_KEY.PAGE3, VALUE_KEY.FAIRWAY)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_year2, PAGE_KEY.PAGE3, VALUE_KEY.FAIRWAY)}</Text>
                            <View style={styles.line_horizontal} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(obj_all, PAGE_KEY.PAGE3, VALUE_KEY.FAIRWAY)}</Text>
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
        // borderTopWidth: (Platform.OS === 'ios') ? verticalScale(1) : verticalScale(0.5),
        // borderBottomColor: '#424242',
        // borderBottomWidth: (Platform.OS === 'ios') ? verticalScale(1) : verticalScale(0.5),
        backgroundColor: '#fff'
    },
    line_horizontal: {
        backgroundColor: '#DFDFDF',
        width: 1,
        height: verticalScale(40),
    },

    content: {
        flex: 1,
        justifyContent: 'center'
    },

    title_label_text: {
        marginLeft: scale(10),
        flex: 1,
        fontSize: fontSize(16, scale(1)),// 16,
        color: '#000',
        fontWeight: 'bold',
        textAlignVertical: 'center'
    },

    title_item_text: {
        width: scale(65),
        fontSize: fontSize(16, scale(1)),// 16,
        color: '#000',
        fontWeight: 'bold',
        textAlignVertical: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    },

    title_view: {
        height: verticalScale(35),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eaeaea'
        //marginLeft : 10,
        //justifyContent: 'space-between'
    },

    item_view: {
        height: verticalScale(40),
        flexDirection: 'row',
        borderTopColor: '#DFDFDF',
        alignItems: 'center',
        borderTopWidth: (Platform.OS === 'ios') ? verticalScale(0.6) : verticalScale(0.3)
    },

    item_label_text: {
        marginLeft: scale(10),
        flex: 1,
        fontSize: fontSize(14),// 14,
        color: '#424242',
        textAlignVertical: 'center'
    },

    item_value_text: {
        width: scale(65),
        fontSize: fontSize(14),// 14,
        color: '#424242',
        textAlign: 'center',
        textAlignVertical: 'center'
    },

    item_value_text_best: {
        width: scale(65),
        fontSize: fontSize(14),// 14,
        color: '#00aba7',
        textDecorationLine: 'underline',
        textAlign: 'center',
        //backgroundColor : 'blue',
        // textAlignVertical: 'center'
    },
});