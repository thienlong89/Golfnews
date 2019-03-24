import React from 'react';
import {
    // Platform,
    StyleSheet,
    Text,
    View,
    // ScrollView,
    Image,
    ImageBackground,
    // BackHandler,
    // TouchableOpacity
} from 'react-native';
// import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import MyView from '../../../Core/View/MyView';
import Weather from '../../Common/WeatherInfoView';

export default class HeaderEventComment extends BaseComponent {
    constructor() {
        super();
        this.state = {
            isShowKeyboard: false
        }
    }

    change(show){
        let{isShowKeyboard} = this.state;
        if(show === isShowKeyboard) return;
        this.setState({
            isShowKeyboard : show
        });
    }

    hide(callback=null){
        let{isShowKeyboard} = this.state;
        if(isShowKeyboard) return;
        this.setState({
            isShowKeyboard : true
        },()=>{
            if(callback){
                setTimeout(()=>{
                    callback();
                },50);
            }
        });
    }

    show(callback = null){
        let{isShowKeyboard} = this.state;
        if(!isShowKeyboard) return;
        this.setState({
            isShowKeyboard : false
        },()=>{
            if(callback){
                setTimeout(()=>{
                    callback();
                },50);
            }
        });
    }

    render() {
        let { eventDetailModel } = this.props;
        let month = eventDetailModel.getMonth();
        let day = eventDetailModel.getDay();
        let eventName = eventDetailModel.getName();
        let creator = eventDetailModel.getCreator().getFullName();
        let teeTime = eventDetailModel.getTeeTimeDisplay();
        let courseName = eventDetailModel.getCourse().getTitle();
        let facilityId = eventDetailModel.getFacilityId();
        let{isShowKeyboard} = this.state;
        return (
            <MyView style={styles.view_event_info} hide={isShowKeyboard}>
                <View style={{ justifyContent: 'space-between' }}>
                    <ImageBackground style={styles.img_calendar}
                        source={this.getResources().ic_calendar}
                        imageStyle={{ resizeMode: 'contain' }}
                        resizeMethod={'resize'}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_month}>{month}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_title_day}>{day}</Text>
                    </ImageBackground>

                    {/* <MyView hide={!isCreator}>
                            <TouchableOpacity onPress={this.onUpdateEventPress.bind(this)}>
                                <View style={styles.view_edit}>
                                    <Image
                                        style={styles.img_edit}
                                        source={this.getResources().pen} />
                                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_edit}>
                                        {this.t('edit_')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </MyView> */}

                </View>

                <View style={{ marginLeft: 10, marginRight: 10 }}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_event_name}>{eventName}</Text>

                    <View style={[styles.view_item, { marginBottom: 5 }]}>
                        <Image
                            style={styles.img_icon}
                            source={this.getResources().ic_creator} />
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_label}>
                            {this.t('player_created_flight')}
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_label_content}>{creator}</Text>
                        </Text>
                    </View>

                    <View style={[styles.view_item, { marginBottom: 5 }]}>
                        <Image
                            style={styles.img_icon}
                            source={this.getResources().ic_map_header} />
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_label}>
                            {`${this.t('san')}: `}
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_label_content}>{courseName}</Text>
                        </Text>
                    </View>

                    <View style={[styles.view_tee_time]}>
                        <View style={styles.view_item}>
                            <Image
                                style={styles.img_icon}
                                source={this.getResources().tee_time_icon} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_label}>
                                {`${this.t('tee_time')}: `}
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_label_content}>{teeTime}</Text>
                            </Text>
                        </View>

                        <Weather
                            hide={true}
                            facilityId={facilityId} />
                    </View>
                </View>
            </MyView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DADADA',
    },
    view_event_info: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff'
    },
    txt_event_name: {
        color: '#242424',
        fontSize: 18,
        fontWeight: 'bold',
        justifyContent: 'space-between',
        marginBottom: 15,
        marginRight: 10
    },
    txt_label: {
        fontSize: 15,
        color: '#858585',
        marginLeft: 10
    },
    txt_label_content: {
        fontSize: 13,
        color: '#858585',
        fontWeight: 'bold'
    },
    view_tee_time: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    line: {
        height: 1,
        marginLeft: 10,
        marginRight: 10
    },
    view_list_flight: {
        backgroundColor: '#fff',
        marginTop: 8,
        flex: 1
    },
    view_list_flight_title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10
    },
    txt_list_participants: {
        fontSize: 13,
        color: '#828282'
    },
    txt_participant: {
        fontSize: 15,
        color: '#fff',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5
    },
    txt_leave_event: {
        fontSize: 15,
        color: '#5E5E5E',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5
    },
    touchable_participant: {
        backgroundColor: '#00ABA7',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    img_calendar: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 8
    },
    txt_title_month: {
        color: '#00ABA7',
        fontSize: 18,
        // fontWeight: 'bold'
    },
    txt_title_day: {
        color: '#2A2A2A',
        fontSize: 20,
        // fontWeight: 'bold'
    },
    view_item: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    img_icon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        tintColor: '#858585'
    },
    touchable_leave_event: {
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#5E5E5E',
        borderWidth: 1
    },
    img_edit: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        tintColor: '#00ABA7'
    },
    txt_edit: {
        color: '#00ABA7',
        fontSize: 11
    },
    view_edit: {
        justifyContent: 'center',
        alignItems: 'center'
    }

});