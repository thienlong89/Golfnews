import React from 'react';
import {
    Text,
    View,
    FlatList,
    BackHandler,
    TouchableOpacity
} from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import Networking from '../../Networking/Networking';
import HeaderView from '../HeaderView';
import Touchable from 'react-native-platform-touchable';
import FriendFlightModel from '../../Model/Home/FriendFlightModel';
import styles from '../../Styles/PlayerInfo/StyleFlightHistory';
import ApiService from '../../Networking/ApiService';
import FlightDetailModel from '../../Model/CreateFlight/Flight/FlightDetailModel';
import EmptyDataView from '../../Core/Common/EmptyDataView';
import FlightHistoryItem from '../PlayerInfo/FlightHistoryItem';

import PropsStatic from '../../Constant/PropsStatic';


export default class FlightListAddImageView extends BaseComponent {

    static defaultProps = {
        puid: '',
        isInScrollView: false,
        parentNavigator: null
    }

    constructor(props) {
        super(props);
        this.page = 1;
        this.puid = this.props.puid;
        this.uid = this.getUserInfo().getId();
        this.state = {
            flightList: [],
            isHideFlightStatus: false,
        }

        this.onBackPress = this.onBackPress.bind(this);
        this.loadMoreData = this.loadMoreData.bind(this);
    }

    renderFlightItem = ({ item, index }) => (
        <TouchableOpacity onPress={this.onItemListClick.bind(this, item)}
            style={{ backgroundColor: (parseInt(index) % 2 === 0) ? '#FFFFFF' : '#F5F5F5' }}>
            <FlightHistoryItem flightHistory={item} itemId={(parseInt(index) + 1)} />
        </TouchableOpacity>
    );

    render() {
        let {
            flightList
        } = this.state;

        return (
            <View style={styles.container} >
                <HeaderView
                    title={this.t('add_photo')}
                    handleBackPress={this.onBackPress} />

                <Text style={styles.txt_select_flight}>{this.t('select_flight_add_img')}</Text>

                <View style={styles.view_note}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.text_bold}>R: </Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.text_detail}>{this.t('rating')}</Text>

                    <Text allowFontScaling={global.isScaleFont} style={styles.text_bold}>S: </Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.text_detail}>{this.t('slope')}</Text>

                    <Text allowFontScaling={global.isScaleFont} style={styles.text_bold}>G: </Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.text_detail}>{this.t('gross')}</Text>

                    <Text allowFontScaling={global.isScaleFont} style={styles.text_bold}>A: </Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.text_detail}>{this.t('adj')}</Text>
                </View>

                <View style={styles.title_list}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.text_rnd}>{this.t('rnd')}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.text_course_tee}>{this.t('course_tee')}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.text_r}>R</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.text_s}>S</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.text_g}>G</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.text_a}>A</Text>
                </View>
                <View style={{ marginTop: 5, flex: 1 }}>
                    <FlatList
                        data={flightList}
                        renderItem={this.renderFlightItem}
                        ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
                        onEndReached={this.loadMoreData}
                        onEndReachedThreshold={0.2}
                        initialNumToRender={5}
                        keyboardShouldPersistTaps='always'
                        scrollEventThrottle={16}
                        keyExtractor={item => item.id}
                    />
                    <EmptyDataView
                        ref={(emptyDataView) => { this.emptyDataView = emptyDataView; }}
                    />
                    {this.renderInternalLoading()}
                </View>
                {this.renderMessageBar()}
            </View>
        );
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();

        this.requestFlightHistory();
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

    showLoading() {
        if (this.internalLoading) {
            this.internalLoading.showLoading();
        }
    }

    hideLoading() {
        if (this.internalLoading) {
            this.internalLoading.hideLoading();
        }
    }

    requestFlightHistory() {
        this.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.history_flight(this.page, this.puid);
        console.log("url = ", url);
        Networking.httpRequestGet(url, this.onResponseFlightHistory.bind(this), () => {
            //time out
            //self.loading.hideLoading();
            self.hideLoading();
            if (self.state.flightList.length === 0) {
                self.emptyDataView.showEmptyView();
            }
        });
    }

    /**
     * response lấy dữ liệu lịch sử trận đánh
     * @param {*} jsonData 
     */
    onResponseFlightHistory(jsonData) {
        this.hideLoading();
        this.model = new FriendFlightModel(this);
        //console.log("json history : ",jsonData);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            let dataList = this.model.getFriendFlightList();
            if (dataList.length === 0) {
                this.page = -1;
            }
            if (dataList.length > 0) {
                this.setState({
                    flightList: [...this.state.flightList, ...dataList],
                });
            }

        } else {
            if (this.state.flightList.length === 0)
                this.emptyDataView.showEmptyView();
            this.showErrorMsg(this.model.getErrorMsg());
        }
    }

    /**
     * load thêm dữ liệu
     */
    loadMoreData() {
        console.log('loadMoreData');
        if (this.page === -1) return;
        this.page++;
        this.requestFlightHistory();
    }

    onItemListClick(flight) {
        if (this.props.navigation) {
            this.props.navigation.replace('comment_flight_view',
                {
                    addImageCallback: this.props.navigation.state.params.addImageCallback,
                    'flight': flight,
                    'isAddImage': true
                });
        }
        
    }

}

