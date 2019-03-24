import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Platform,
    Dimensions
} from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import LoadingView from '../../../Core/Common/LoadingView';
import {scale, verticalScale, fontSize} from '../../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

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

/**
 * man hinh thong ke chi xem 10 tran gan nhat
 */
export default class OtherScreen extends BaseComponent {
    constructor(props) {
        super(props);
        this.mode = 10;
        this.state = {
            data : {},
        }
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

    componentDidMount(){
        this.sendRequestStatistical(this.mode);
    }

    /**
     * Gui yeu cau lay du lieu thong ke
     */
    sendRequestStatistical(mode) {
        this.customLoading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl()+ApiService.statistical_list_other_user(this.props.puid);
        console.log('url thong ke ',url);
        Networking.httpRequestGet(url,(jsonData)=>{
            console.log("thong ke data ",jsonData);
            if(jsonData.hasOwnProperty('error_code')){
                let error_code = parseInt(jsonData['error_code']);
                if(error_code === 0){
                    let data = jsonData.data || {};
                    self.setState({
                        data : data,
                    });
                }else if(error_code === 2){
                    self.onCheckErrorCode(2,'');
                }
            }
           // self.loading.hideLoading();
           self.customLoading.hideLoading();
        },()=>{
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

    render() {
        let {data } = this.state;
        return (
            <View style={styles.container}>
                {/* {this.renderLoading()} */}
                <View style={styles.title_view}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.title_text}>{this.t('so_lieu_lay_theo')}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.title_text_right}>{this.t('mode_10')}</Text>
                </View>
                <ScrollView>
                    <View style={styles.content}>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('round_count')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(data,PAGE_KEY.PAGE1,VALUE_KEY.COUNT_ROUND)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('best_score')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(data,PAGE_KEY.PAGE1,VALUE_KEY.BEST_NET)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('best_gross')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(data,PAGE_KEY.PAGE1,VALUE_KEY.BEST_GROSS)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('d_bogey')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(data,PAGE_KEY.PAGE2,VALUE_KEY.DBOGEY)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('bogey')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(data,PAGE_KEY.PAGE2,VALUE_KEY.BOGEY)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('par')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(data,PAGE_KEY.PAGE2,VALUE_KEY.PAR)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('birdie')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(data,PAGE_KEY.PAGE2,VALUE_KEY.BIRDIE)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('eagle_hio')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(data,PAGE_KEY.PAGE2,VALUE_KEY.EAGLE_HIO)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('putt')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(data,PAGE_KEY.PAGE3,VALUE_KEY.PUTT)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('failse')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(data,PAGE_KEY.PAGE3,VALUE_KEY.FAILSE)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('drawn')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(data,PAGE_KEY.PAGE3,VALUE_KEY.DRAWN)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('slice')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(data,PAGE_KEY.PAGE3,VALUE_KEY.SLICE)}</Text>
                        </View>
                        <View style={styles.item_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_label_text}>{this.t('fairway')}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.item_value_text}>{this.checkData(data,PAGE_KEY.PAGE3,VALUE_KEY.FAIRWAY)}</Text>
                        </View>
                    </View>
                </ScrollView>
                <LoadingView ref={(customLoading)=>{this.customLoading = customLoading;}} 
                            isShowOverlay={false}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container : {
        flex: 1, 
        borderTopColor: '#424242', 
        borderTopWidth: verticalScale(0.5), 
        borderBottomColor: '#424242', 
        borderBottomWidth: verticalScale(0.5),
        backgroundColor : '#fff'
    },

    content : {
        flex: 1, 
        justifyContent: 'center' 
    },

    image : {
        height: verticalScale(20), 
        width: verticalScale(20), 
        marginRight: scale(5), 
        alignSelf: 'center', 
        resizeMode: 'contain' 
    },

    title_text_right : {
        width: scale(145),
        fontSize: fontSize(16,scale(2)), 
        color: '#000', 
        fontWeight: 'bold', 
        textAlignVertical: 'center'
    },

    title_text : {
        marginLeft: scale(10), 
        flex: 1, 
        fontSize: fontSize(16,scale(1)),// 16, 
        color: '#000', 
        fontWeight: 'bold', 
        textAlignVertical: 'center'
    },

    title_view : {
        height: verticalScale(30), 
        flexDirection: 'row', 
        justifyContent: 'center',
        alignItems : 'center',
        backgroundColor : '#eaeaea' 
    },

    item_view: {
        height: verticalScale(40),
        flexDirection: 'row',
        borderTopColor: '#404040',
        alignItems : 'center',
        borderTopWidth: (Platform.OS === 'ios') ? 1 : 0.3
    },

    item_label_text: {
        marginLeft: scale(10),
        flex: 1,
        fontSize: fontSize(14),// 14,
        color: '#424242',
        textAlignVertical: 'center'
    },

    item_value_text: {
        width: scale(145),
        fontSize: fontSize(14),// 14,
        color: '#424242',
        textAlignVertical: 'center'
    },

    dropdown: {
        width: scale(120),
        height: verticalScale(30),
        marginLeft: 0,
        //backgroundColor : 'blue',
        justifyContent: 'center',
    },

    dropdown_text: {
        //marginVertical: 10,
        //marginHorizontal: 6,
        fontSize: fontSize(16,scale(1)),// 16,
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
        marginTop: verticalScale(5),
        borderWidth: scale(2),
        borderRadius: scale(3),
    },
});