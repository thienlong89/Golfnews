import React from 'react';
import { Platform, StyleSheet, Text, View, Image,Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
var urlencode = require('urlencode');

import {scale, verticalScale, fontSize} from '../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

export default class WeatherInfoView extends BaseComponent {

    static defaultProps = {
        facilityId: '',
        time: '',
        hide: false
    }

    constructor(props) {
        super(props);
        this.state = {
            weather_txt: '',
            weather_icon: '',
            hide: this.props.hide
        }
    }

    setDateTime(dateTime) {
        this.requestWeatherInfo(dateTime);
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     // You can access `this.props` and `this.state` here
    //     // This function should return a boolean, whether the component should re-render.
    //     return (!this.state.hide && (this.state.hide === nextState.hide)) ? false : true;
    // }

    render() {
        if (this.state.hide) {
            return null;
        } else {
            return (
                <View style={styles.view_weather_group} >
                    <Image
                        style={styles.icon_weather}
                        resizeMethod={'resize'}
                        source={{ uri: this.state.weather_icon }}
                    />
                    <Text allowFontScaling={global.isScaleFont} style={styles.facility_info_weather}>{this.state.weather_txt}</Text>
                </View>
            );
        }

    }

    componentDidMount() {
        if (!this.state.hide) {
            this.requestWeatherInfo(urlencode(this.props.time));
        }
    }

    requestWeatherInfo(time) {
        let url = this.getConfig().getBaseUrl() + ApiService.get_weather_info(this.props.facilityId, time / 1000);
        console.log("url : ", url);
        let self = this;
        Networking.httpRequestGet(url, this.onWeatherResponse.bind(this), () => {

        });
    }

    onWeatherResponse(jsonData) {
        // console.log('onWeatherResponse', jsonData)
        if (jsonData && jsonData.hasOwnProperty('error_code')) {
            if (jsonData['error_code'] === 0) {
                if (jsonData.hasOwnProperty("data")) {
                    let weather = jsonData['data'].weather;
                    this.setState({
                        weather_txt: weather.text,
                        weather_icon: weather.icon,
                        hide: false
                    });

                }
            }
        }
    }

    getWeatherResource(weather_icon) {
        switch (weather_icon) {
            case 'sun.png':
                return this.getResources().sun;
            case 'nangmua.png':
                return this.getResources().nangmua;
            case 'mua.png':
                return this.getResources().mua;
            case 'may.png':
                return this.getResources().may;
            default:
                return null;
        }
    }

}

const styles = StyleSheet.create({
    view_weather_group: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon_weather: {
        height: verticalScale(30),
        width: verticalScale(30),
        resizeMode: 'contain',
        marginRight: scale(5)
    },
    facility_info_weather: {
        color: '#6B6B6B',
        fontSize: fontSize(13,-scale(2)),// 13,
        marginRight: scale(5)
    },
});