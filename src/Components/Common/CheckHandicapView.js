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
    Platform
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import FacilityCourseModel from '../../Model/Facility/FacilityCourseModel';
import TeeViewHorizontal from '../Common/TeeViewHorizontal';
import TextInputCheckHandicap from './Items/TextInputCheckHandicap';
import { verticalScale, scale, fontSize } from '../../Config/RatioScale';

// const TAG = "[Vhandicap-v1] CheckHandicapView : ";

// var screenWidth = Dimensions.get('window').width - 20;
//type Props = {};
export default class CheckHandicapView extends BaseComponent {
    constructor(props) {
        super(props);
        this.selectedCallback = null;
        this.list_facility = [];
        this.completeCallback = null;
        this.showPopupCallback = null;
        this.startTime = 0;
        this.isCheckBox = false;
        this.enableLoadingCallback = null;
        //this.showListView = false;
        this.state = {
            textSearch: '',
        }

        this.onSearchClick = this.onSearchClick.bind(this);
        this.onCheckBoxClick = this.onCheckBoxClick.bind(this);
        this.onChangeTeeAll = this.onChangeTeeAll.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
    }

    onChangeText(text) {
        //if (!text.trim().length) return;
        // this.setState({
        //     textSearch: text
        // });
        if (this.enableLoadingCallback) {
            this.enableLoadingCallback();
        }
        this.sendRequestSearchFacility(text);
    }

    /**
     * tim kiem san
     */
    sendRequestSearchFacility(text) {
        let url = this.getConfig().getBaseUrl() + ApiService.search_course(text);
        console.log("url search course : ", url);
        //this.loading.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.model = new FacilityCourseModel();
            //console.log("search facility cousre : ", jsonData);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                self.list_facility = self.model.getListFacilityCourse();
                //console.log("lsit facility : ",self.list_facility);
                if (self.completeCallback) {
                    self.completeCallback(self.list_facility);
                }
            }
            // self.loading.hideLoading();
        }, () => {
            // self.loading.hideLoading();
        });
    }

    onSearchClick() {
        this.sendRequestSearchFacility();
    }

    onCheckBoxClick() {
        this.isCheckBox = true;
        this.inputText.blur();
        if (!this.list_facility.length) {
            this.sendRequesListRecentCourse();
        } else {
            if (this.showPopupCallback) {
                this.showPopupCallback();
            }
        }
    }

    /**
     * Chon 1 item
     * @param {*} data 
     */
    onItemClick(data) {
        if (this.selectedCallback) {
            this.selectedCallback(data);
        }
        // this.setState({
        //     textSearch: data.getTitle()
        // });
        this.inputText.setTitle(data.getTitle());
    }

    setDataSearch(data, teeObject) {
        this.blur();
        // this.setState({
        //     textSearch: data.getTitle()
        // }, () => {
        //     this.refTeeViewHorizontal.setTeeSelected(teeObject);
        // });
        this.inputText.setTitle(data.getTitle(),this.refTeeViewHorizontal.setTeeSelected(teeObject));
    }

    /**
     * Lay các course của sân hay chơi
     */
    sendRequesListRecentCourse() {
        // if(this.enableLoadingCallback){
        //     this.enableLoadingCallback();
        // }
        let url = this.getConfig().getBaseUrl() + ApiService.list_recent_course();
        console.log('url', url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.model = new FacilityCourseModel();
            //console.log("search facility cousre : ", jsonData);
            // self.customLoading.setVisible(false);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                self.list_facility = self.model.getListFacilityCourse();
                //console.log("lsit facility : ",self.list_facility);
                if (self.completeCallback) {
                    self.completeCallback(self.list_facility);
                }
                self.isCheckBox = false;
            }
            // self.loading.hideLoading();
        }, () => {
            // self.loading.hideLoading();
        });
    }

    onFocus() {
        // console.log('onFocus')
        if (!this.list_facility.length) {
            // console.log('sendRequesListRecentCourse')
            this.sendRequesListRecentCourse();
        }
    }

    blur() {
        if (this.inputText) {
            this.inputText.blur();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.search_container}>
                    <Touchable onPress={this.onSearchClick}>
                        <Image
                            style={styles.icon_search}
                            source={this.getResources().ic_Search}
                        />
                    </Touchable>
                    <TextInputCheckHandicap ref={(inputText) => { this.inputText = inputText; }}
                        onChangeTextCallback={this.onChangeText}
                        style={styles.input_search}
                        onFocusCallback={this.onFocus} />
                    <Touchable onPress={this.onCheckBoxClick}>
                        <Image
                            style={styles.dropdown_image}
                            source={this.getResources().s_normal}
                        />
                    </Touchable>
                </View>

                {/* <Touchable style={styles.view_tee} */}
                <Touchable
                    onPress={this.onChangeTeeAll}>
                    <TeeViewHorizontal
                        ref={(refTeeViewHorizontal) => { this.refTeeViewHorizontal = refTeeViewHorizontal; }}
                    />
                </Touchable>
            </View>
        );
    }

    setTeeSelected(teeObject = {}) {
        this.refTeeViewHorizontal.setTeeSelected(teeObject);
    }

    onChangeTeeAll() {
        if (this.props.onChangeTeeAll) {
            this.props.onChangeTeeAll();
        }
    }
}

const styles = StyleSheet.create({
    container: {
        height: verticalScale(40),
        marginTop: verticalScale(10),
        marginLeft: scale(10),
        marginRight: scale(10),
        flexDirection: 'row'
    },

    search_container: {
        flex: 1,
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
        fontSize:  fontSize(14),//Platform.OS === 'ios' ? 17 : 14,
        lineHeight:  fontSize(18,scale(7)) //Platform.OS === 'ios' ? 21 : 18
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
    }
});
