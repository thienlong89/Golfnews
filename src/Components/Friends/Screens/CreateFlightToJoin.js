import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler,
    TextInput,
    Image
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import HeaderView from '../../HeaderView';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import DatePicker from 'react-native-datepicker';
import SearchFacilityView from '../../Common/SearchFacilityView';
import MyView from '../../../Core/View/MyView';
import PlayerInFlightItem from '../Items/PlayerInFlightItem';

const TIME_FORMAT = 'HH:mm, DD/MM/YYYY';

export default class CreateFlightToJoin extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            isSearching: false,
            location: '',
            date_time: ''
        }
    }

    render() {

        let { isSearching, date_time, location } = this.state;

        const timestamp = Date.now();
        let minDate = new Date(timestamp);
        this.strMinDate = `${minDate.getHours()}:${minDate.getMinutes()}, ${minDate.getDate()}/${minDate.getMonth() + 1}/${minDate.getFullYear()}`;

        return (
            <View style={styles.container}>
                <MyView hide={isSearching} style={{ flex: 1 }}>


                    <HeaderView
                        ref={(refHeaderView) => { this.refHeaderView = refHeaderView }}
                        title={this.t('create_flight')}
                        handleBackPress={this.onBackPress.bind(this)}
                        menuTitle={this.t('done')}
                        onMenuHeaderClick={this.onMenuHeaderClick.bind(this)}
                        isEnable={false} />

                    <View style={styles.view_more_info}>
                        <View style={styles.view_item}>
                            <TextInput allowFontScaling={global.isScaleFont} style={styles.txt_location}
                                // editable={false}
                                placeholderTextColor={'#737373'}
                                placeholder={this.t('san')}
                                value={location}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                onFocus={this.onSearchFacilityFocused.bind(this)}
                                numberOfLines={1} />

                            <Image
                                style={styles.img_icon_pin}
                                source={this.getResources().ic_map_header}
                            />

                        </View>
                        <View style={styles.line} />
                        <View style={styles.view_item_datetime}>
                            <DatePicker
                                ref={(datePicker) => { this.datePicker = datePicker; }}
                                style={styles.date_picker}
                                mode='datetime'
                                allowFontScaling={global.isScaleFont}
                                date={date_time}
                                placeholder={this.t('tee_time')}
                                format={TIME_FORMAT}
                                minDate={`${this.strMinDate}`}
                                confirmBtnText={this.t('agree')}
                                cancelBtnText={this.t('cancel')}
                                androidMode='spinner'
                                iconSource={this.getResources().tee_time_icon}
                                customStyles={{
                                    dateInput: {
                                        borderWidth: 0
                                    },
                                    placeholderText: {
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        bottom: 0,
                                        flex: 1,
                                        fontSize: 16,
                                        color: '#737373',
                                        textAlign: 'center',
                                        ...Platform.select({
                                            ios: {
                                                paddingTop: 10
                                            },
                                            android: {
                                                textAlignVertical: 'center'
                                            }
                                        }),

                                    },
                                    dateText: {
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        bottom: 0,
                                        flex: 1,
                                        fontSize: 16,
                                        color: '#242424',
                                        textAlign: 'center',
                                        ...Platform.select({
                                            ios: {
                                                paddingTop: 10
                                            },
                                            android: {
                                                textAlignVertical: 'center'
                                            }
                                        }),
                                    },
                                    dateTouchBody: {
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    },
                                    dateIcon: {
                                        height: 25,
                                        width: 25
                                    }
                                }}
                                onDateChange={this.onDateChange.bind(this)}
                            />
                        </View>
                        <View style={styles.line} />

                        <PlayerInFlightItem
                            {...this.props} />

                        <View style={styles.line} />

                    </View>
                </MyView>

                <MyView hide={!isSearching} style={{ flex: 1 }}>
                    <SearchFacilityView
                        ref={(refMyComponent) => { this.refMyComponent = refMyComponent; }}
                        onBackPress={this.onHideSearching.bind(this)}
                        onItemCoursePress={this.onItemCoursePress.bind(this)} />
                </MyView>

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

    onMenuHeaderClick() {

    }

    onDateChange(date) {
        this.setState({
            date_time: date
        }, () => {
            this.setValidate();
        });
    }

    onSearchFacilityFocused() {
        this.setState({
            isSearching: true
        }, () => {
            if (this.refMyComponent) {
                this.refMyComponent.slideUp();
            }
        })
    }

    onHideSearching() {
        if (this.refMyComponent) {
            this.refMyComponent.slideDown();
        }
        setTimeout(() => {
            this.setState({
                isSearching: false,
            }, () => {

            })
        }, 200);
    }

    onItemCoursePress(course) {
        this.setState({
            isSearching: false,
            location: course.getTitle()
        }, () => {
            this.setValidate();
        })
    }

    setValidate() {
        let { location, date_time } = this.state;
        if (location.length > 0 && date_time.length > 0) {
            this.refHeaderView.setMenuEnable(true);
        } else {
            this.refHeaderView.setMenuEnable(false);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    view_more_info: {
        flex: 1,
    },
    view_item_datetime: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 5,
        minHeight: 50,
        alignItems: 'center'
    },
    date_picker: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    line: {
        height: 1,
        backgroundColor: '#D6D4D4'
    },
    txt_location: {
        fontSize: 16,
        color: '#242424',
        flex: 1,
        paddingRight: 5,
    },
    img_icon_pin: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        tintColor: '#858585',
        marginRight: 10
    },
    view_item: {
        flexDirection: 'row',
        paddingLeft: 10,
        minHeight: 50,
        alignItems: 'center'
    },
});