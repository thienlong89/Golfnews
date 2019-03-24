import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler,
    FlatList,
    RefreshControl
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import { scale, verticalScale, moderateScale, fontSize } from '../../Config/RatioScale';
import EmptyDataView from '../../Core/Common/EmptyDataView';

export default class RecentHandicapInfoView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);


        this.state = {
            handicapList: []
        }

        this.onBackPress = this.onBackPress.bind(this);
        this.refreshDataPress = this.refreshDataPress.bind(this);
        this.renderItemList = this.renderItemList.bind(this);
    }

    renderItemList({ item, index }) {
        if (index === 0) {
            return (
                <View style={[styles.view_item, { backgroundColor: '#EAEAEA' }]}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_current_title}>{this.t('handicap_info_current')}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_handicap}>{item.handicap_user}</Text>
                </View>
            )
        } else {
            return (
                <View style={[styles.view_item, { backgroundColor: '#fff' }]}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_period}>{item.date_step_handicap}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_handicap}>{item.handicap_user}</Text>
                </View>
            )
        }

    }

    render() {
        let {
            handicapList
        } = this.state;
        return (
            <View style={styles.container}>
                <HeaderView
                    title={this.t('handicap_info')}
                    handleBackPress={this.onBackPress} />
                <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('handicap_info_10_period')}</Text>
                <View style={{ flex: 1 }}>

                    <FlatList
                        ref={(refFlatList) => { this.refFlatList = refFlatList; }}
                        refreshControl={
                            <RefreshControl
                                // refreshing={refreshing}
                                onRefresh={this.refreshDataPress}
                            />
                        }
                        removeClippedSubviews={true}
                        initialNumToRender={5}
                        ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
                        data={handicapList}
                        keyboardShouldPersistTaps='always'
                        // keyExtractor={item => item.getFlight().getId()}
                        renderItem={this.renderItemList}
                        // contentContainerStyle={{ paddingTop: this.home_page_scroll_padding_top }}
                        style={styles.flatlist}
                    />
                    <EmptyDataView
                        ref={(emptyFinishView) => { this.emptyFinishView = emptyFinishView; }}
                    />
                    {this.renderInternalLoading()}
                </View>
                {this.renderMessageBar()}
            </View>
        );
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

        this.getHandicapList();
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

    refreshDataPress() {
        this.getHandicapList();
    }

    getHandicapList() {
        if (this.internalLoading)
            this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.get_history_handicap();
        let self = this;
        console.log('url', url);
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('getHandicapList', JSON.stringify(jsonData));
            if (self.internalLoading)
                self.internalLoading.hideLoading();
            if (jsonData.error_code === 0) {
                let dataList = jsonData.data;
                if (dataList instanceof Array) {
                    if (dataList.length > 0)
                        dataList.unshift(dataList[0])
                    this.setState({
                        handicapList: dataList
                    }, () => {
                        self.emptyFinishView.hideEmptyView();
                    })
                }
            } else {
                try {
                    self.emptyFinishView.showEmptyView();
                    self.showErrorMsg(self.model.getErrorMsg());
                } catch (error) {
                }

            }

        }, () => {
            //time out
            if (self.internalLoading)
                self.internalLoading.hideLoading();
            self.showErrorMsg(self.t('time_out'));
            self.emptyFinishView.showEmptyView();
        });
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    listview_separator: {
        flex: 1,
        height: scale(1),
        backgroundColor: '#E3E3E3',
    },
    view_item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: scale(10),
        paddingRight: scale(10),
        minHeight: scale(40)
    },
    txt_period: {
        fontSize: fontSize(14),
        color: '#1A1A1A',
    },
    txt_handicap: {
        fontSize: fontSize(14),
        color: '#454545',
        fontWeight: 'bold'
    },
    txt_title: {
        fontSize: fontSize(15),
        fontWeight: 'bold',
        color: '#252525',
        margin: scale(10)
    },
    txt_current_title: {
        fontSize: fontSize(14),
        fontWeight: 'bold',
        color: '#424242'
    },
    flatlist: {
        margin: scale(10),
        borderWidth: 1,
        borderColor: '#D6D4D4',
        flexGrow: 0
    },
});