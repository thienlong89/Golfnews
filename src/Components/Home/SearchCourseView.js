import React from 'react';
import { View, Text, ListView, StyleSheet, BackHandler } from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import MyTextInput from '../Common/MyTextInput';
import FacilityCourseItem from '../Facilities/FacilityCourseItem';
import HeaderListChat from '../Chats/ListChats/HeaderListChat';
import FacilityCourseModel from '../../Model/Facility/FacilityCourseModel';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import ListCourseView from './Item/ListCourseView';
import {scale} from '../../Config/RatioScale';

/**
 * Tách riêng màn hình search course để check handicap
 */
export default class SearchCourseView extends BaseComponent {
    constructor(props) {
        super(props);
        this.onClearSearch = this.onClearSearch.bind(this);
        let { params } = this.props.navigation.state;
        this.params = params;
        this.callbackSearch = (this.params && this.params.callbackSearch) ? this.params.callbackSearch : null;
        this.backHandler = null;
        this.onBackClick = this.onBackClick.bind(this);
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBackClick);
        if (this.header) {
            this.header.backCallback = this.onBackClick;
            this.header.onFocusCallback = this.onFocus.bind(this);
            this.header.searchCallback = this.courseSearchFocus.bind(this);
            this.header.focus();
        }
        this.refListCourse.onCourseItemClick = this.onItemCourseClick.bind(this);
    }

    componentWillUnmount() {
        if (this.backHandler) this.backHandler.remove();
    }

    onItemCourseClick(data){
        if(this.callbackSearch){
            this.callbackSearch(data);
        }
        this.onBackClick();
    }

    onBackClick() {
        // if (this.callbackSearch) {
        //     this.callbackSearch();
        // }
        let { navigation } = this.props;
        if (navigation) {
            navigation.goBack();
        }
        return true;
    }

    onFocus() {
        this.courseSearchFocus('');
    }

    onClearSearch() {
        this.courseSearchFocus('');
    }

    courseSearchFocus(input) {
        let url = this.getConfig().getBaseUrl() + ApiService.search_course(input);
        console.log('url', url);
        Networking.httpRequestGet(url, this.onCourseSearchResponse.bind(this));
    }

    onCourseSearchResponse(jsonData) {
        this.model = new FacilityCourseModel(this);
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {
            // let courseList = [];
            // this.setState({
            //     dataSource: this.state.dataSource.cloneWithRows(courseList),
            // });
            let courseList = this.model.getListFacilityCourse();
            if (courseList.length > 0) {
                // this.setState({
                //     dataSource: this.state.dataSource.cloneWithRows(courseList),
                // });
                this.refListCourse.fillData(courseList);
            } else {
                this.refListCourse.fillData([]);
                // this.setState({
                //     dataSource: this.state.dataSource.cloneWithRows([])
                // });
            }
        }
    }

    render() {
        // let { dataSource } = this.state;
        return (
            <View style={styles.container}>
                <HeaderListChat clearSearchClick={this.onClearSearch} ref={(header) => { this.header = header; }} />
                <ListCourseView ref={(refListCourse)=>{this.refListCourse = refListCourse;}} />
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    list_spinner: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        borderColor: '#C7C7C7',
        borderWidth: 1,
        marginLeft: scale(10),
        marginRight: scale(10)
    },
    listview_separator: {
        flex: 1,
        height: 1,
        backgroundColor: '#E3E3E3',
    },
});