import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BaseComponent from '../../../../Core/View/BaseComponent';
import { scale, verticalScale, fontSize } from '../../../../Config/RatioScale';
import CourseSearchBar from '../../../Facilities/CourseSearchBar';
import ComHeader from './ComHeader';
import StaticProps from '../../../../Constant/PropsStatic';
import CheckHandicapShowView from '../../../PlayerInfo/Items/CheckHandicapShowView';
import PopupSelectTeeView from '../../../Common/PopupSelectTeeView';
import ApiService from '../../../../Networking/ApiService';
import Networking from '../../../../Networking/Networking';


export default class ComCheckHandicap extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            isSearching: false
        }

        this.courseSearchFocus = this.courseSearchFocus.bind(this);
        this.onFocusSearch = this.onFocusSearch.bind(this);
        this.onChangeTeeAll = this.onChangeTeeAll.bind(this);
        this.onTeeSelected = this.onTeeSelected.bind(this);

        this.text_check_handicap = this.t('hdc_course');

        this.isMe = this.props.isMe ? this.props.isMe : true;

        this.default_tee_id = this.isMe ? this.getUserInfo().getUserProfile() ? this.getUserInfo().getUserProfile().getDefaultTeeID() : '' : '';
    }

    courseSearchFocus() {

    }

    onFocusSearch() {
        console.log('onFocusSearch')
        let navigation = StaticProps.getAppSceneNavigator();
        if (navigation) {
            navigation.navigate('search_course_view', { callbackSearch: this.callbackSearch.bind(this) });
        }
    }

    requestCheckHandicap(teeName, facilityCourseModel) {
        let formData = {
            "user_ids": [this.puid ? this.getAppUtil().replaceUser(this.puid) : this.getUserInfo().getUserProfile().getId()],
            "tee": teeName,
            "course": facilityCourseModel.course_object
        }
        console.log('formData--------------------------- ', formData);
        let url = this.getConfig().getBaseUrl() + ApiService.check_handicap_facility();
        console.log('url', url);
        // this.showLoading();
        let self = this;
        Networking.httpRequestPost(url, (jsonData) => {
            // console.log('jsonData check cap .......................................... ', jsonData);
            if (jsonData.hasOwnProperty('error_code')) {
                let error_code = parseInt(jsonData['error_code']);
                if (error_code === 0) {
                    let data = jsonData['data'];
                    if (data['courses_handicap'].length > 0) {
                        let handicap = data['courses_handicap'][0];
                        // self.updateHandicapData(handicap, friendModel, index, isMe);
                        self.viewCheckHandicap.setDataCourse(this.teeSelected.color, self.text_check_handicap + ' ' + facilityCourseModel.title + ':', handicap.display_course.value);
                    }
                }
            }
            // self.hideLoading();
        }, formData, () => {
            // self.hideLoading();
        });
    }

    callbackSearch(facilityCourseModel) {
        console.log('.................callback search : ', facilityCourseModel);
        this.teeListAvailable = facilityCourseModel.getTeeInfoGender();
        // let profile = this.getUserInfo().getUserProfile();
        this.teeSelected = this.teeListAvailable.find((teeObject) => {
            // console.log('teeObject.tee', teeObject.tee, profile.getDefaultTeeID())
            return teeObject.tee === this.default_tee_id;// profile.getDefaultTeeID();
        })
        this.teeSelected = this.teeSelected ? this.teeSelected : this.teeListAvailable.length > 0 ? this.teeListAvailable[0] : {};
        this.courseSearchBar.setTeeSelected(this.teeSelected);

        this.facilityCourseModel = Object.assign({}, facilityCourseModel);
        if (this.courseSearchBar) {
            this.courseSearchBar.onBlur();//tat ban phim search course
        }
        this.requestCheckHandicap('', this.facilityCourseModel);
    }

    updateTeeDefault(_tee) {
        this.default_tee_id = _tee;
    }

    onChangeTeeAll() {
        // this.isCheckHandicapAll = true;
        this.refPopupSelectTeeView.setVisible(this.teeListAvailable);
    }

    onTeeSelected(teeObject, extrasData) {
        this.teeSelected = teeObject;
        this.courseSearchBar.setTeeSelected(teeObject);
        this.requestCheckHandicap(teeObject.tee, this.facilityCourseModel);
    }

    render() {
        let { isSearching } = this.state;
        return (
            <View style={styles.container}>
                {/* <View style={{ borderTopLeftRadius: 5, borderTopRightRadius: 5, backgroundColor: '#efeff4', height: verticalScale(30), justifyContent: "center", alignItems: 'center' }}>
                    <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(16, scale(2)), color: '#444' }}>{this.t('check_handicap').toUpperCase()}</Text>
                </View> */}
                <ComHeader title={this.t('check_handicap')} />
                <CourseSearchBar ref={(courseSearchBar) => { this.courseSearchBar = courseSearchBar; }}
                    onChangeText={this.courseSearchFocus}
                    isSearching={isSearching}
                    onFocusSearch={this.onFocusSearch}
                    onChangeTeeAll={this.onChangeTeeAll} />

                <CheckHandicapShowView ref={(viewCheckHandicap) => { this.viewCheckHandicap = viewCheckHandicap; }} />
                <PopupSelectTeeView
                    ref={(refPopupSelectTeeView) => { this.refPopupSelectTeeView = refPopupSelectTeeView; }}
                    onTeeSelected={this.onTeeSelected} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        borderColor: 'rgba(0,0,0,0.25)',
        borderRadius: 5,
        borderWidth: 1,
        marginLeft: scale(10),
        marginRight: scale(10),
        marginTop: verticalScale(10)
    }
});