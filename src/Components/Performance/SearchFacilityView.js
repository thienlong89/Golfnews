/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    Dimensions,
    TextInput,
    Platform,
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import FacilityCourseModel from '../../Model/Facility/FacilityCourseModel';
import { verticalScale, scale, fontSize } from '../../Config/RatioScale';

export default class SearchFacilityView extends BaseComponent {
    constructor(props) {
        super(props);

        this.recentFacility = [];
        this.state = {
            textSearch: '',
        }

        this.onCheckBoxClick = this.onCheckBoxClick.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
    }

    onChangeText(text) {
        //if (!text.trim().length) return;
        this.setState({
            textSearch: text
        }, () => {
            if (text != '') {
                this.requestSearchFacility(text);
            } else {
                this.onFocus();
            }

        });

    }

    /**
     * tim kiem san
     */
    requestSearchFacility(text) {
        let url = this.getConfig().getBaseUrl() + ApiService.search_facility('', '', '', text, 1);
        console.log("url search course : ", url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.model = new FacilityCourseModel();
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                let facilityList = self.model.getListFacilityCourse();
                if (this.props.facilityCallback) {
                    this.props.facilityCallback(facilityList);
                }
            }
            // self.loading.hideLoading();
        }, () => {
            // self.loading.hideLoading();
        });
    }

    onCheckBoxClick() {
        this.inputText.blur();
        if (!this.recentFacility.length) {
            this.requestListRecentCourse();
        } else {

        }
    }


    /**
     * sân hay chơi
     */
    requestListRecentCourse() {

        let url = this.getConfig().getBaseUrl() + ApiService.favorite_course();
        console.log('url', url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.model = new FacilityCourseModel();
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                self.recentFacility = self.model.getListFacilityCourse();
                if (self.props.facilityCallback) {
                    self.props.facilityCallback(self.recentFacility);
                }
            }
            // self.loading.hideLoading();
        }, () => {
            // self.loading.hideLoading();
        });
    }

    onFocus() {
        if (this.recentFacility.length === 0) {
            this.requestListRecentCourse();
        } else {
            if (this.props.facilityCallback) {
                this.props.facilityCallback(this.recentFacility);
            }
        }
    }

    blur() {
        if (this.inputText) {
            this.inputText.blur();
        }
    }

    render() {
        let {
            textSearch
        } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.search_container}>
                    <Image
                        style={styles.icon_search}
                        source={this.getResources().ic_Search}
                    />
                    <TextInput allowFontScaling={false}
                        ref={(inputText) => { this.inputText = inputText; }}
                        style={styles.input_search}
                        onChangeText={this.onChangeText}
                        value={textSearch}
                        placeholder={this.t('select_facility_compare_performance')}
                        placeholderTextColor='#a1a1a1'
                        onFocus={this.onFocus}
                        // onSubmitEditing={this.onSearchClick.bind(this)}
                        underlineColorAndroid='rgba(0,0,0,0)'
                    />
                    <Touchable onPress={this.onCheckBoxClick}>
                        <Image
                            style={styles.dropdown_image}
                            source={this.getResources().s_normal}
                        />
                    </Touchable>
                </View>
            </View>
        );
    }

    setItemSelected(itemSelected) {
        this.setState({
            textSearch: itemSelected
        });
    }

}

const styles = StyleSheet.create({
    container: {
        height: verticalScale(40),
        marginTop: verticalScale(10),
        marginLeft: scale(10),
        marginRight: scale(10),
    },

    search_container: {
        height: verticalScale(40),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderColor: '#ababab',
        borderRadius: verticalScale(5),
        borderWidth: 1
    },

    icon_search: {
        width: verticalScale(20),
        height: verticalScale(20),
        marginLeft: scale(10),
        resizeMode: 'contain',
        alignSelf: 'center'
    },

    input_search: {
        flex: 1,
        height: verticalScale(40),
        paddingLeft: scale(6),
        paddingTop: 0,
        paddingBottom: 0,
        fontSize: fontSize(14, scale(3)),//Platform.OS === 'ios' ? 17 : 14,
        lineHeight: fontSize(18, scale(7)) //Platform.OS === 'ios' ? 21 : 18
    },

    dropdown_image: {
        width: scale(40),
        height: verticalScale(38),
        resizeMode: 'contain'
    },
    view_tee: {
        height: verticalScale(40),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: scale(10),
        borderColor: '#C7C7C7',
        borderWidth: 0.5,
        borderRadius: verticalScale(5)
    },
    container_flatlist: {
        marginTop: 1,
        paddingBottom: 1,
        paddingLeft: 0,
        paddingRight: 0
    },
    separator_view: {
        height: 1,
        backgroundColor: '#E3E3E3',
        marginLeft: 10,
        marginRight: 10
    },
    view_absolute: {
        position: 'absolute',
        right: 0,
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'red',
    }
});
