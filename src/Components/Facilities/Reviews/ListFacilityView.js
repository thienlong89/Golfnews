import React from 'react';
import {
    StyleSheet,
    View,
    ListView,
    FlatList
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import ApiService from '../../../Networking/ApiService';
import FacilityCourseItem from '../../Facilities/FacilityCourseItem';
import Networking from '../../../Networking/Networking';
import FacilityListModel from '../../../Model/Facility/FacilityListModel';
import EmptyDataView from '../../../Core/Common/EmptyDataView';
import PropStatic from '../../../Constant/PropsStatic';

var courseList = [];

export default class ListFacilityView extends BaseComponent {

    static defaultProps = {
        textChange: ''
    }

    constructor(props) {
        super(props);
        // const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.page = 1;
        this.searchList = [];
        this.state = {
            dataSource: []//ds.cloneWithRows(courseList),
        }

        this.loadMoreData = this.loadMoreData.bind(this);
    }

    /**
     * fill du lieu vao listview
     * @param {Array} datas 
     */
    setFillData(datas){
        this.setState({
            dataSource : datas
        },()=>{
            setTimeout(()=>{
                if(datas.length){
                    this.emptyDataView.hideEmptyView();
                }else{
                    this.emptyDataView.showEmptyView();
                }
            },50);
        })
    }

    render() {
        let {
            dataSource
        } = this.state;
        return (
            <View style={styles.container}>
                {/* {this.renderLoading()} */}
                <FlatList
                    style={styles.list_course}
                    ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
                    data={dataSource}
                    onEndReached={this.loadMoreData}
                    onEndReachedThreshold={0.2}
                    initialNumToRender={5}
                    enableEmptySections={true}
                    keyboardShouldPersistTaps='always'
                    scrollEventThrottle={16}
                    keyExtractor={item => item.id}
                    renderItem={({ item, index }) =>
                        <Touchable onPress={this.onCourseItemClick.bind(this, item, index)}>
                            <FacilityCourseItem facilityCourseModel={item} />
                        </Touchable>
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
        // let { parent } = this.props.screenProps;
        // parent.onChangeTextSearch = this.searchFacility.bind(this);
        // parent.setSearchCallback(0, this.searchFacility.bind(this));
        console.log('courseList.length', courseList.length)
        if (courseList.length === 0) {
            this.requestFavoriteCourse();
        } else {
            this.setState({
                dataSource: courseList
            })
        }
    }

    componentWillMount() {
        this.unregisterMessageBar();
    }

    loadMoreData() {

    }

    searchFacility(input) {
        this.emptyDataView.hideEmptyView();
        if (input.length > 0) {
            let self = this;
            this.internalLoading.showLoading();
            let url = this.getConfig().getBaseUrl() + ApiService.search_facility('', '', '', input);
            console.log('url', url);
            Networking.httpRequestGet(url, this.onListFacilitySearchResponse.bind(this),
                () => {
                    self.internalLoading.hideLoading();
                });
        } else {
            if (courseList && courseList.length > 0) {
                this.setState({
                    dataSource: courseList//this.state.dataSource.cloneWithRows(courseList)
                });
            } else {
                this.requestFavoriteCourse();
            }

        }

    }

    onListFacilitySearchResponse(jsonData) {
        this.internalLoading.hideLoading();
        this.model = new FacilityListModel();
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            this.searchList = this.model.getFacilityList();
            if (this.searchList.length > 0) {
                this.emptyDataView.hideEmptyView();
                this.setState({
                    dataSource: this.searchList //this.state.dataSource.cloneWithRows(this.searchList)
                });
            } else {
                this.emptyDataView.showEmptyView();
                this.setState({
                    dataSource: []//this.state.dataSource.cloneWithRows([])
                });
            }

        } else {
            if (this.courseList.length === 0) {
                this.emptyDataView.showEmptyView();
            }
            this.showErrorMsg(this.model.getErrorMsg());
        }
    }


    requestFavoriteCourse() {
        this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.favorite_course();
        console.log('url', url);
        let self = this;
        Networking.httpRequestGet(url, this.onFavoriteCourseResponse.bind(this), () => {
            //time out
            self.internalLoading.hideLoading();
            self.emptyDataView.showEmptyView();
        });
    }

    onFavoriteCourseResponse(jsonData) {
        this.internalLoading.hideLoading();
        this.model = new FacilityListModel();
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {

            courseList = this.model.getFacilityList();
            if (courseList.length > 0) {
                this.setState({
                    dataSource: courseList //this.state.dataSource.cloneWithRows(courseList),
                })
                this.emptyDataView.hideEmptyView();
            } else {
                this.emptyDataView.showEmptyView();
                // this.setState({
                //     dataSource: this.state.dataSource.cloneWithRows([])
                // });
            }
        } else {
            this.emptyDataView.showEmptyView();
            this.showErrorMsg(this.model.getErrorMsg());
        }
    }

    onCourseItemClick(facilityCourseModel) {
        let navigation = PropStatic.getAppSceneNavigator();
        if (navigation) {
            navigation.navigate('review_facility', { id: facilityCourseModel.getId(), title: facilityCourseModel.getSubTitle() });
        }
    }

    // onCourseItemClick(facilityCourseModel, itemId) {
    //     console.log("facilityCourseModel................................ ", facilityCourseModel);
    // }
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