import React from 'react';
import {StyleSheet, View,ListView } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import ApiService from '../../../Networking/ApiService';
import FacilityCourseItem from '../../Facilities/FacilityCourseItem';
import Networking from '../../../Networking/Networking';
import FacilityListModel from '../../../Model/Facility/FacilityListModel';
import EmptyDataView from '../../../Core/Common/EmptyDataView';

import I18n from 'react-native-i18n';
require('../../../../I18n/I18n');

export default class AroundCourseTab extends BaseComponent {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.searchList = [];
        this.courseList = [];
        this.state = {
            dataSource: ds.cloneWithRows([]),
        }
    }

    static navigationOptions = () => ({
        title: I18n.t("around_me"),               // it stay in french whatever choosen langage
        tabBarLabel: I18n.t("around_me"),
    });

    render() {
        return (
            <View style={styles.container}>
                {/* {this.renderLoading()} */}
                <ListView style={styles.list_course}
                    renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    keyboardShouldPersistTaps='always'
                    renderRow={(rowData, sectionID, itemId) =>
                        <View >
                            <Touchable onPress={this.onCourseItemClick.bind(this, rowData, itemId)}>
                                <FacilityCourseItem facilityCourseModel={rowData} />
                            </Touchable>
                        </View>
                    }
                />
                <EmptyDataView
                    ref={(emptyDataView) => { this.emptyDataView = emptyDataView; }}
                />
                {this.renderInternalLoading()}
                {this.renderMessageBar()}
            </View>
        );
    }

    componentDidMount() {
        this.registerMessageBar();
        this.requestAroundCourse();
        let { parent } = this.props.screenProps;
        parent.onChangeTextSearch = this.searchFacility.bind(this);
        parent.setSearchCallback(1, this.searchFacility.bind(this));
    }

    componentWillMount() {
        this.unregisterMessageBar();
    }

    searchFacility(input) {
        if (input.length > 0) {
            this.internalLoading.showLoading();
            let self = this;
            let url = this.getConfig().getBaseUrl() + ApiService.search_facility('', '', '', input);
            console.log('url', url);
            Networking.httpRequestGet(url, this.onListFacilitySearchResponse.bind(this),
                () => {
                    self.internalLoading.hideLoading();
                });
        } else {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.courseList ? this.courseList : [])
            });
        }

    }

    onListFacilitySearchResponse(jsonData) {
        this.internalLoading.hideLoading();
        this.model = new FacilityListModel();
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            this.searchList = this.model.getFacilityList();
            if (this.searchList.length > 0) {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.searchList)
                });
                this.emptyDataView.hideEmptyView();
            } else {
                this.emptyDataView.showEmptyView();
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows([])
                });
            }

        } else {
            this.showErrorMsg(this.model.getErrorMsg());
        }
    }

    requestAroundCourse() {
        this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.around_course();
        console.log('url', url);
        let self = this;
        Networking.httpRequestGet(url, this.onAroundCourseResponse.bind(this), () => {
            self.emptyDataView.showEmptyView();
            self.internalLoading.hideLoading();
        });
    }

    onAroundCourseResponse(jsonData) {
        this.internalLoading.hideLoading();
        this.model = new FacilityListModel();
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            this.courseList = this.model.getFacilityList();
            if (this.model.getFacilityList().length > 0) {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.courseList),
                })
                this.emptyDataView.hideEmptyView();
            } else {
                this.emptyDataView.showEmptyView();
                // this.setState({
                //     dataSource: this.state.dataSource.cloneWithRows([])
                // });
            }
        } else {
            this.showErrorMsg(this.model.getErrorMsg());
            this.emptyDataView.showEmptyView();
        }
    }

    onCourseItemClick(facilityCourseModel, itemId) {
        if (this.props.screenProps) {
            this.props.screenProps.parentNavigator.navigate('enter_flight_info_view',
                {
                    'Facility': facilityCourseModel,
                    onStartTutorialUpgrade: this.onStartTutorialUpgrade.bind(this)
                });
        }
    }

    onStartTutorialUpgrade() {
        if (this.props.screenProps.parent.onStartTutorialUpgrade) {
            this.props.screenProps.parent.onStartTutorialUpgrade();
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    list_course: {

    },
    listview_separator: {
        //flex: 1,
        height: 1,
        backgroundColor: '#E3E3E3',
    }
});