import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    // View
    Image,
    TextInput,
    TouchableOpacity,
    FlatList,
    BackHandler
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import { View } from 'react-native-animatable';
import FacilityCourseModel from '../../Model/Facility/FacilityCourseModel';
import CheckHandicapItem from './CheckHandicapItem';
import MyView from '../../Core/View/MyView';

const DELAY_TIME = 500;
const WAIT_INTERVAL = 250;

export default class SearchFacilityView extends BaseComponent {

    constructor(props) {
        super(props);
        this.triggerChange = this.triggerTextChange.bind(this);
        this.page = 1;
        this.state = {
            textSearch: '',
            isHideClear: true,
            listData: []
        }

        this.onBackPress = this.onBackPress.bind(this);
        this.onInputSearchChange = this.onInputSearchChange.bind(this);
        this.onClearSearchClick = this.onClearSearchClick.bind(this);
        this.onItemCoursePress = this.onItemCoursePress.bind(this);
    }

    render() {

        let { listData } = this.state;

        return (
            <View style={styles.container}
                ref={(refAnimateView) => { this.refAnimateView = refAnimateView }}>
                <HeaderView
                    title={this.t('search_course')}
                    handleBackPress={this.onBackPress} />

                <View style={styles.search_group}>
                    <Image
                        style={styles.icon_search}
                        source={this.getResources().ic_Search}
                    />
                    <TextInput allowFontScaling={global.isScaleFont}
                        ref={(textInput) => { this.textInput = textInput; }}
                        style={styles.input_search}
                        placeholder={this.t('press_to_search')}
                        placeholderTextColor='#a1a1a1'
                        underlineColorAndroid='rgba(0,0,0,0)'
                        // value={this.state.textSearch}
                        autoFocus={true}
                        // onKeyDown={this.handleKeyDown}
                        onChangeText={this.onInputSearchChange}>
                    </TextInput>
                    <MyView hide={this.state.isHideClear}>
                        <TouchableOpacity style={styles.touch_clear} onPress={this.onClearSearchClick}>
                            <Image
                                style={styles.icon_clear}
                                source={this.getResources().ic_clear}
                            />
                        </TouchableOpacity>
                    </MyView>

                </View>
                <View style={styles.line} />

                <FlatList style={styles.container_flatlist}
                    data={listData}
                    onEndReachedThreshold={5}
                    keyboardShouldPersistTaps='always'
                    ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                    // onEndReached={this.onLoadMore.bind(this)}
                    enableEmptySections={true}
                    renderItem={({ item }) =>
                        // <Touchable
                        //     onPress={this.onItemCoursePress.bind(this, item)}
                        //     style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <CheckHandicapItem facilityCourseModel={item}
                            onItemClickCallback={this.onItemCoursePress} />
                        // </Touchable>

                    }
                />
            </View>
        );
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();

        this.requestSearchFacility();
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

    slideUp() {
        if (this.refAnimateView)
            this.refAnimateView.animate('fadeInUp', DELAY_TIME)
    }

    slideDown() {
        if (this.refAnimateView)
            this.refAnimateView.animate('fadeOutDown', DELAY_TIME)
    }

    onBackPress() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
    }

    onInputSearchChange(input) {
        clearTimeout(this.timer);
        if (input.length > 0) {
            this.setState({
                isHideClear: false,
                textSearch: input
            }, () => {
                if (input.length > 1) {
                    this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL);
                } else {
                    this.triggerTextChange();
                }
            });

        } else {
            this.setState({
                isHideClear: true,
                textSearch: input
            }, () => this.triggerTextChange());
        }

    }

    // handleKeyDown(e) {
    //     if (e.keyCode === ENTER_KEY) {
    //         this.triggerChange();
    //     }
    // }

    onClearSearchClick() {
        this.setState({
            isHideClear: true,
            textSearch: ''
        }, () => {
            this.textInput.clear();
            this.triggerTextChange();
        });

    }

    triggerTextChange() {
        this.requestSearchFacility(this.state.textSearch);
    }

    requestSearchFacility(query = '') {
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.search_facility('', '', '', query, this.page);
        console.log("url search : ", url);
        Networking.httpRequestGet(url, (jsonData) => {
            self.model = new FacilityCourseModel();
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                self.setState({
                    listData: self.model.getListFacilityCourse()
                })
            }

        }, () => {
            // self.listViewFacility.hideLoading();
            // self.loading.hideLoading();
            //self.popupTimeOut.showPopup();
        });
    }

    onItemCoursePress(course) {
        let {
            params
        } = this.props.navigation.state;
        if(params.onItemCoursePress){
            params.onItemCoursePress(course);
        }
        this.onBackPress();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
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
    line: {
        height: 1,
        backgroundColor: '#E3E3E3'
    },
    search_group: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        height: 40,
        alignItems: 'center'
    },
    icon_search: {
        ...Platform.select({
            ios: {
                resizeMode: 'contain',
                width: 23,
                height: 23,
                marginLeft: 5,
                marginRight: 5
            },
            android: {
                width: 23,
                height: 23,
                marginLeft: 5,
                marginRight: 5,
                resizeMode: 'contain'
            },
        }),
    },
    input_search: {
        flex: 1,
        fontSize: (Platform.OS === 'ios') ? 16 : 13,
        lineHeight: (Platform.OS === 'ios') ? 20 : 15,
        paddingTop: 0,
        paddingBottom: 0
    },
    touch_clear: {
        padding: 10
    },
    icon_clear: {
        ...Platform.select({
            ios: {
                height: 13,
                width: 13,
                resizeMode: 'contain',
                marginRight: 5
            },
            android: {
                height: 13,
                width: 13,
                marginRight: 5,
                resizeMode: 'contain'
            },
        }),
    },
});