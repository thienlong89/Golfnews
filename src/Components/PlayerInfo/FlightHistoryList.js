import React from 'react';
import { Text, View, ListView } from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import Networking from '../../Networking/Networking';
import Touchable from 'react-native-platform-touchable';
import FlighHistoryItem from './FlightHistoryItem';
import FriendFlightModel from '../../Model/Home/FriendFlightModel';
import styles from '../../Styles/PlayerInfo/StyleFlightHistory';
import ApiService from '../../Networking/ApiService';
import FlightDetailModel from '../../Model/CreateFlight/Flight/FlightDetailModel';
import EmptyDataView from '../../Core/Common/EmptyDataView';

import PropsStatic from '../../Constant/PropsStatic';


export default class FlightHistoryList extends BaseComponent {

    static defaultProps = {
        puid: '',
        isInScrollView: false,
        parentNavigator: null
    }

    constructor(props) {
        super(props);
        this.page = 1;
        this.flightHistoryList = [];
        this.puid = this.props.puid;
        this.uid = this.getUserInfo().getId();
        this.state = {
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            isHideFlightStatus: false,
        }
    }

    componentDidMount() {
        // this.registerMessageBar();
        this.requestFlightHistory();
    }

    componentWillUnmount() {
        // this.unregisterMessageBar();
    }

    render() {
        return (
            <View style={styles.container} >
                {this.renderLoading()}
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
                    <ListView
                        onEndReached={!this.props.isInScrollView ? this.loadMoreData.bind(this) : null}
                        onEndReachedThreshold={5}
                        enableEmptySections={true}
                        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
                        dataSource={this.state.dataSource}
                        renderRow={(rowData, sectionID, itemId) =>
                            <Touchable onPress={this.onItemListClick.bind(this, rowData)}
                                style={{ backgroundColor: (parseInt(itemId) % 2 === 0) ? '#FFFFFF' : '#F5F5F5' }}>
                                <FlighHistoryItem flightHistory={rowData} itemId={(parseInt(itemId) + 1)} />
                            </Touchable>
                        }
                    />
                    <EmptyDataView
                        ref={(emptyDataView) => { this.emptyDataView = emptyDataView; }}
                    />
                    {this.renderInternalLoading()}
                </View>
                {/* {this.renderMessageBar()} */}
            </View>
        );
    }

    requestFlightHistory() {
        // this.loading.showLoading();
        this.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.history_flight(this.page, this.puid);
        console.log("url = ", url);
        Networking.httpRequestGet(url, this.onResponseFlightHistory.bind(this), () => {
            //time out
            //self.loading.hideLoading();
            self.hideLoading();
            self.isFinishRequest();
            if (self.flightHistoryList.length === 0) {
                self.emptyDataView.showEmptyView();
            }
            //self.popupTimeOut.showPopup();
        });
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

    /**
     * response lấy dữ liệu lịch sử trận đánh
     * @param {*} jsonData 
     */
    onResponseFlightHistory(jsonData) {
        this.isFinishRequest();
        // this.loading.hideLoading();
        this.hideLoading();
        this.model = new FriendFlightModel(this);
        //console.log("json history : ",jsonData);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            if (this.model.getFriendFlightList().length === 0) {
                this.page = -1;
            }
            if (this.flightHistoryList) {
                this.flightHistoryList = this.flightHistoryList.concat(this.model.getFriendFlightList());
            } else {
                this.flightHistoryList = this.model.getFriendFlightList();
            }

            if (this.flightHistoryList.length > 0) {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.flightHistoryList),
                });
            }
        } else {
            if (this.flightHistoryList.length === 0)
                this.emptyDataView.showEmptyView();
            let { showErrorMsgCallback } = this.props;
            if (showErrorMsgCallback) {
                showErrorMsgCallback(this.model.getErrorMsg());
            }
            // this.showErrorMsg(this.model.getErrorMsg());
        }
    }

    isFinishRequest() {
        if (this.props.isFinishRequest) {
            this.props.isFinishRequest();
        }
    }

    /**
     * load thêm dữ liệu
     */
    loadMoreData() {
        console.log('loadMoreData');
        if (!this.internalLoading || this.flightHistoryList.length < 10 || this.page === -1) return;
        this.page++;
        this.requestFlightHistory();
    }

    loadNextPageData() {
        console.log('loadNextPageData');
        if (this.page != -1) {
            this.page++;
            this.requestFlightHistory();
        }

    }

    onItemListClick(flight) {
        this.loading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.view_flight_detail(flight.getId());
        console.log('url', url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.loading.hideLoading();
            self.model = new FlightDetailModel(self);
            self.model.parseData(jsonData);

            let flight = self.model.getFlight();
            let playerList = flight.getUserRounds();
            let indexMe = playerList.findIndex((user) => {
                return user.getUserId() === self.uid;
            });
            let isHostUser = false;
            if (indexMe != -1) {
                playerList.splice(0, 0, ...playerList.splice(indexMe, 1));
                try {
                    if (playerList.length > 0 && playerList[0].getSttUser() === 1) {
                        isHostUser = true;
                    }
                } catch (error) {
                    console.log('parseCourseData.isHostUser.error', error);
                }

            }
            if (self.model.getErrorCode() === 0) {
                let navigation = PropsStatic.getAppSceneNavigator();
                if (navigation) {
                    navigation.navigate('scorecard_view',
                        {
                            onCloseScorecard: self.onCloseScorecardListener.bind(self),
                            'FlightDetailModel': self.model
                        });
                }
                // try {

                //     self.props.parentNavigator.navigate('scorecard_view',
                //         {
                //             onCloseScorecard: self.onCloseScorecardListener.bind(self),
                //             'FlightDetailModel': self.model
                //         });
                // } catch (error) {
                //     console.log('onItemListClick.error', error);
                // }

            } else {
                self.showErrorMsg(self.model.getErrorMsg());
            }
        }, () => {
            //time out
            self.loading.hideLoading();
            self.showErrorMsg(self.t('time_out'));
        });
    }

    onCloseScorecardListener() {
        this.rotateToPortrait();
    }
}

