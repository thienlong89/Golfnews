import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    FlatList,
    Dimensions,
    SectionList
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../../Core/View/BaseComponent';
import Networking from '../../../../Networking/Networking';
import ApiService from '../../../../Networking/ApiService';
import { scale, verticalScale, moderateScale, fontSize } from '../../../../Config/RatioScale';
import MemberFlightHistoryItem from '../../Items/MemberFlightHistoryItem';
import EmptyDataView from '../../../../Core/Common/EmptyDataView';
import FlightHistoryModel from '../../../../Model/PlayerInfo/FlightHistoryModel';

const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width / 4;

export default class MemberFlightHistoryView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        let { player } = this.props.screenProps.navigation.state.params;
        this.player = player;
        this.page = 1;
        this.state = {
            flightHistoryList: []
        }

        this.loadMoreData = this.loadMoreData.bind(this);
    }

    renderHeaderList() {
        return (
            <View style={styles.header_container}>
                <View style={styles.view_flight_id}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_flight_name}>{this.t('round_id')}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_flight_name}>{this.t('flight_id')}</Text>
                </View>

                <View style={styles.view_line} />
                <View style={styles.view_flight_name}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_flight_name}>{this.t('flight_name')}</Text>
                </View>

                <View style={styles.view_line} />
                <View style={[styles.view_item_width]}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_flight_name}>{this.t('tee_time_history')}</Text>
                </View>

                <View style={styles.view_line} />
                <View style={[styles.view_item_width]}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_flight_name}>{this.t('hdc_index')}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_flight_name}>{this.t('hdc_course')}</Text>
                </View>

                <View style={styles.view_line} />
                <View style={[styles.view_item_width]}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_flight_name}>{this.t('scorecard_img')}</Text>
                </View>

                <View style={styles.view_line} />
                <View style={[styles.view_item_width]}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_flight_name}>{this.t('gross_net')}</Text>
                </View>

                <View style={styles.view_line} />
                <View style={[styles.view_item_width]}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_flight_name}>{this.t('differential')}</Text>
                </View>

                <View style={styles.view_line} />
                <View style={[styles.view_item_width]}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_flight_name}>{this.t('date_create')}</Text>
                </View>

                <View style={styles.view_line} />
                <View style={[styles.view_item_width]}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_flight_name}>{this.t('action')}</Text>
                </View>
            </View>
        )
    }

    render() {
        let {
            flightHistoryList
        } = this.state;
        console.log('flightHistoryList', flightHistoryList.length)
        return (
            <View style={styles.container}>
                <ScrollView horizontal={true}>
                    {/* {this.renderHeaderList()} */}
                    <SectionList
                        sections={[{ title: 'header', data: flightHistoryList }]}
                        onEndReached={this.loadMoreData}
                        onEndReachedThreshold={0.2}
                        initialNumToRender={5}
                        ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
                        keyboardShouldPersistTaps='always'
                        scrollEventThrottle={16}
                        // keyExtractor={item => item.id}
                        renderItem={({ item, index, section }) =>
                            <MemberFlightHistoryItem
                                round={item} />
                        }
                        renderSectionHeader={({ section: { title } }) => this.renderHeaderList(title)}
                        // ListHeaderComponent={this.renderHeaderList()}
                        // stickyHeaderIndices={true}
                        stickySectionHeadersEnabled={true}
                    />
                </ScrollView>
                <EmptyDataView
                    ref={(emptyDataView) => { this.emptyDataView = emptyDataView; }}
                />
                {this.renderMessageBar()}
                {this.renderInternalLoading()}
            </View>
        );
    }



    componentDidMount() {
        this.registerMessageBar();

        this.requestFlightHistory();
    }

    componentWillUnmount() {
        this.unregisterMessageBar();

    }

    requestFlightHistory() {
        let {
            flightHistoryList
        } = this.state;
        this.internalLoading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.history_flight(this.page, this.player.getId());
        console.log("url = ", url);
        Networking.httpRequestGet(url,
            (jsonData) => {
                self.internalLoading.hideLoading();
                self.model = new FlightHistoryModel(self);
                //console.log("json history : ",jsonData);
                self.model.parseData(jsonData);
                if (self.model.getErrorCode() === 0) {
                    let dataList = self.model.getHistoryFlightList();

                    if (dataList.length > 0) {
                        self.setState({
                            flightHistoryList: [...flightHistoryList, ...dataList]
                        }, () => {

                        });
                    }
                } else {
                    if (flightHistoryList.length === 0){
                        self.emptyDataView.showEmptyView();
                    }
                    self.showErrorMsg(self.model.getErrorMsg());
                }
            }, () => {
                //time out
                if (self.page > 1) self.page--;
                self.internalLoading.hideLoading();
                if (flightHistoryList.length === 0) {
                    self.emptyDataView.showEmptyView();
                }
            });
    }

    loadMoreData() {
        this.page++;
        this.requestFlightHistory();
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column'
    },
    listview_separator: {
        height: 0.8,
        backgroundColor: '#D4D4D4'
    },
    view_line: {
        width: 0.8,
        backgroundColor: '#D4D4D4'
    },
    header_container: {
        backgroundColor: '#E3E3E3',
        flexDirection: 'row',
        height: scale(50),
        // borderColor: '#D4D4D4',
        // borderWidth: 1
    },
    view_flight_id: {
        width: ITEM_WIDTH,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_flight_name: {
        width: 2.5 * ITEM_WIDTH,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_item_width: {
        width: ITEM_WIDTH,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt_flight_name: {
        color: '#595959',
        fontSize: fontSize(15),
        fontWeight: 'bold',
        textAlign: 'center'
    },
});