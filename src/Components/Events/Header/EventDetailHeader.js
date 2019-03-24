import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    // Dimensions
} from 'react-native';
// import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import Util from '../../../Utils';
import WeatherInfoView from '../../Common/WeatherInfoView';

import {scale, verticalScale, fontSize} from '../../../Config/RatioScale';
import { Avatar } from 'react-native-elements';
// let{width,height} = Dimensions.get('window');

export default class EventDetailHeader extends BaseComponent {
    constructor(props) {
        super(props);
    }

    // shouldComponentUpdate(){
    //     return false;
    // }

    static defaultProps = {
        data: {
            name: '',
            facility_name: '',
            tee_time: '',
            create_at_timestamp: (new Date()).getTime()
        }
    }

    checkAvatar() {
        let { data } = this.props;
        return (data && data.avatar) ? { uri: data.avatar } : this.getResources().avatar_event_default;
    }

    /**
 * load icon thời tiết tương ứng
 * @param {*} id 
 */
    checkIconWeather(id = 0) {
        return this.getResources().icon_nhieu_may;
    }

    /**
     * load text thời tiết tương ứng
     * @param {*} id 
     */
    checkTextWeather(id = 0) {
        return this.t('txt_nhieu_may');
    }

    render() {
        let { data } = this.props;
        //console.log("header data : ",data);
        return (
            <View style={styles.container}>
                {/* <Image
                    style={styles.avatar}
                    source={this.checkAvatar()}
                /> */}
                <Avatar 
                        rounded
                        width={verticalScale(40)}
                        height={verticalScale(40)}
                        containerStyle={{marginLeft : scale(10)}}
                        source={this.checkAvatar()}
                />
                <View style={styles.body}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.text_name}>{data.name}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.text_facility_name}>{this.t('san')} : {data.facility_name}</Text>
                    <View style={styles.tee_time_view}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.tee_time_text}>{this.t('tee_time')} : {data.tee_time}</Text>
                        <WeatherInfoView
                            facilityId={data.facility_id}
                            time={data.create_at_timestamp}
                        />
                    </View>
                    <Text allowFontScaling={global.isScaleFont} style={styles.timestamp}>{Util.getFormatAgoTime(data.create_at_timestamp)}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: verticalScale(80),
        flexDirection: 'row',
        alignItems : 'center'
    },

    timestamp: {
        //height: 15,
        fontSize: fontSize(14),// 10,
        color: '#bdbdbd',
        marginLeft: scale(5)
    },

    tee_time_text: {
        fontSize: fontSize(14),// 10,
        color: '#6b6b6b'
    },

    tee_time_view: {
        marginLeft: scale(5),
        height: verticalScale(15),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    text_facility_name: {
        //height: 15,
        fontSize: fontSize(14),// 10,
        color: '#6b6b6b',
        marginLeft: scale(5)
    },

    text_name: {
        //height: 15,
        fontSize: fontSize(16,scale(2)),// 12,
        color: '#000',
        fontWeight: 'bold',
        marginLeft: scale(5),
        textAlignVertical: 'center'
    },

    avatar: {
        width: verticalScale(40),
        height: verticalScale(40),
        marginLeft: scale(10),
        marginTop: verticalScale(10),
        resizeMode: 'contain'
    },

    body: {
        flex: 1,
        justifyContent: 'center',
        margin: scale(10)
    }
})