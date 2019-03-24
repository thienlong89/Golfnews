import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import Weather from '../../Common/WeatherInfoView';
import { verticalScale, scale, fontSize } from '../../../Config/RatioScale';

export default class ShareHeaderItem extends BaseComponent {

    static defaultProps = {
        teeTimestamp: '',
        facilityId: '',
        eventName: '',
        courseName: '',
        teeTime: ''
    }

    // shouldComponentUpdate(){
    //     return false;
    // }

    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        let { teeTimestamp, facilityId, eventName, courseName, teeTime } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.logo_view}>
                    <Image style={styles.logo_usga}
                        source={this.getResources().logo_usga} />
                    <Image style={styles.logo_vgs}
                        source={this.getResources().ic_logo} />
                </View>
                <Text allowFontScaling={global.isScaleFont} style={styles.title_event}>{eventName}</Text>
                <Text allowFontScaling={global.isScaleFont} style={styles.facility_name}>{courseName}</Text>
                <View style={{ height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginRight: 10 }}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.teetime}>{this.t('event_tee_time')} : {teeTime}</Text>
                    <Weather
                        time={teeTimestamp}
                        facilityId={facilityId} />
                </View>
            </View>
        );
    }



}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    logo_view: {
        height: verticalScale(60),
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: verticalScale(15)
    },
    logo_usga: {
        width: verticalScale(50),
        height: verticalScale(50),
        resizeMode: 'contain'
    },
    logo_vgs: {
        marginLeft: scale(15),
        width: verticalScale(50),
        height: verticalScale(50),
        resizeMode: 'contain'
    },
    teetime: {
        fontSize: fontSize(14),
        color: '#adadad',
        textAlign: 'center',
        marginLeft: scale(10)
    },

    title_event: {
        fontSize: fontSize(22,scale(8)),
        color: '#383838',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    facility_name: {
        fontSize: fontSize(20,scale(6)),
        color: '#383838',
        fontWeight: 'bold',
        textAlign: 'center'
    },
});