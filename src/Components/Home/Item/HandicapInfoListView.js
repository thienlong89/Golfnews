import React from 'react';
import { Text, View, ListView, StyleSheet, Dimensions } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import Networking from '../../../Networking/Networking';
import Touchable from 'react-native-platform-touchable';
import FlighHistoryItem from '../../PlayerInfo/HandicapHistoryItem';
import FriendFlightModel from '../../../Model/Home/FriendFlightModel';
import ApiService from '../../../Networking/ApiService';
//import FlightDetailModel from '../../../Model/CreateFlight/Flight/FlightDetailModel';
import EmptyDataView from '../../../Core/Common/EmptyDataView';

let dimemsion = Dimensions.get('window');
const screenHeight = dimemsion.height - 80;
const screenWidth = dimemsion.width;
export default class HandicapInfoListView extends BaseComponent {

    static defaultProps = {
        //puid: '',
        //isInScrollView: false,
        //parentNavigator: null
    }

    constructor(props) {
        super(props);
        //this.page = 1;
        this.flightHistoryList = [];
        //this.puid = this.props.puid;
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

    genItemView(){
        let listView = [];
        let length = this.flightHistoryList.length;
        for(let i =0;i<length;i++){
            let rowData = this.flightHistoryList[i];
            listView.push(<FlighHistoryItem
                flightHistory={rowData} 
                itemId={(i+ 1)}/>);
        }
        return listView;
    }

    render() {
        // let listFlight = this.flightHistoryList.map((rowData) => {
        //     return (<FlighHistoryItem
        //         flightHistory={rowData} />);
        // });
        return (
            <View style={styles.container} >
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
                <View style={{ flex: 1 }}>
                    {this.genItemView()}
                    {/* <ListView
                       // onEndReached={!this.props.isInScrollView ? this.loadMoreData.bind(this) : null}
                        onEndReachedThreshold={5}
                        enableEmptySections={true}
                        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
                        dataSource={this.state.dataSource}
                        renderRow={(rowData, sectionID, itemId) =>
                            // <Touchable onPress={this.onItemListClick.bind(this, rowData)}
                                // style={{ backgroundColor: (parseInt(itemId) % 2 === 0) ? '#FFFFFF' : '#F5F5F5' }}>
                                <FlighHistoryItem flightHistory={rowData} itemId={(parseInt(itemId) + 1)} />
                            // {/* </Touchable> */}
                    {/* // }
                    /> */}
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
        let url = this.getConfig().getBaseUrl() + ApiService.list_best_round();
        console.log("url = ", url);
        Networking.httpRequestGet(url, this.onResponseFlightHistory.bind(this), () => {
            //time out
            //self.loading.hideLoading();
            self.hideLoading();
            self.isFinishRequest();
            if (!self.flightHistoryList.length) {
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
            } else {
                this.emptyDataView.showEmptyView();
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
    // loadMoreData() {
    //     console.log('loadMoreData');
    //     if (!this.internalLoading || this.flightHistoryList.length < 10 || this.page === -1) return;
    //     this.page++;
    //     this.requestFlightHistory();
    // }

    // loadNextPageData() {
    //     console.log('loadNextPageData');
    //     if (this.page != -1) {
    //         this.page++;
    //         this.requestFlightHistory();
    //     }

    // }

    // onItemListClick(flight) {
    //     this.loading.showLoading();
    //     let url = this.getConfig().getBaseUrl() + ApiService.view_flight_detail(flight.getId());
    //     console.log('url', url);
    //     let self = this;
    //     Networking.httpRequestGet(url, (jsonData) => {
    //         self.loading.hideLoading();
    //         self.model = new FlightDetailModel(self);
    //         self.model.parseData(jsonData);

    //         let flight = self.model.getFlight();
    //         let playerList = flight.getUserRounds();
    //         let indexMe = playerList.findIndex((user) => {
    //             return user.getUserId() === self.uid;
    //         });
    //         let isHostUser = false;
    //         if (indexMe != -1) {
    //             playerList.splice(0, 0, ...playerList.splice(indexMe, 1));
    //             try {
    //                 if (playerList.length > 0 && playerList[0].getSttUser() === 1) {
    //                     isHostUser = true;
    //                 }
    //             } catch (error) {
    //                 console.log('parseCourseData.isHostUser.error', error);
    //             }

    //         }
    //         if (self.model.getErrorCode() === 0) {
    //             try {
    //                 self.props.parentNavigator.navigate('scorecard_view',
    //                     {
    //                         onCloseScorecard: self.onCloseScorecardListener.bind(self),
    //                         'FlightDetailModel': self.model
    //                     });
    //             } catch (error) {
    //                 console.log('onItemListClick.error', error);
    //             }

    //         } else {
    //             self.showErrorMsg(self.model.getErrorMsg());
    //         }
    //     }, () => {
    //         //time out
    //         self.loading.hideLoading();
    //         self.showErrorMsg(self.t('time_out'));
    //     });
    // }

    onCloseScorecardListener() {
        this.rotateToPortrait();
    }
}

const styles = StyleSheet.create({
    container: {
        width: screenWidth,
        marginTop : 1
        //height: screenHeight / 2,
        //flex : 1,
        // backgroundColor : 'blue'
    },
    view_note: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10
    },
    text_bold: {
        color: '#000000',
        fontWeight: 'bold'
    },
    text_detail: {
        color: '#949494',
        marginRight: 10
    },
    title_list: {
        flexDirection: 'row',
        backgroundColor: '#00BAB6',
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 3,
        paddingRight: 3
    },
    text_rnd: {
        flex: 1,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    text_course_tee: {
        flex: 5,
        color: '#FFFFFF',
        fontWeight: 'bold'
    },
    text_r: {
        minWidth: 33,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    text_s: {
        minWidth: 33,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    text_g: {
        minWidth: 33,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    text_a: {
        minWidth: 33,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    listview_separator: {
        flex: 1,
        height: 1,
        backgroundColor: '#E3E3E3',
    }
});

