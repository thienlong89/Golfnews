import React from 'react';
import {
    Platform,
    Text,
    View,
    Image,
    Dimensions,
    StyleSheet,
} from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import Touchable from 'react-native-platform-touchable';
import CountEvent from './Item/CountEvent';

let { width } = Dimensions.get('window')-30;

/**
 * component chua cac button o man hinh home
 */
export default class ListButtonView extends BaseComponent {
    constructor(props) {
        super(props);
        this.countEvent = 0;
    }

    /**
     * Update so event sap dien ra
     * @param {*} _count 
     */
    setCountEvent(_count){
        if(this.countEventView){
            this.countEventView.setEventCount(_count);
        }
    }

    /**
     * review san
     */
    onFacilityInfoClick() {
        let{reviewFacilityClickCallback} = this.props;
        if(reviewFacilityClickCallback){
            reviewFacilityClickCallback();
        }
    }

    /**
     * su kien
     */
    onEventClick() {
        let{eventClickCallback} = this.props;
        if(eventClickCallback){
            eventClickCallback();
        }
    }

    /**
     * Bang xep hang
     */
    onLeaderBoardClick() {
        let{leaderBoardClickCallback} = this.props;
        if(leaderBoardClickCallback){
            leaderBoardClickCallback();
        }
    }

    /**
     * Phong do
     */
    onAwardClick() {
        let{onAwardClickCallback} = this.props;
        if(onAwardClickCallback){
            onAwardClickCallback();
        }
    }

    /**
     * Notify
     */
    onNotifyClick() {
        let{onNotifyClickCallback} = this.props;
        if(onNotifyClickCallback){
            onNotifyClickCallback();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Touchable onPress={this.onFacilityInfoClick.bind(this)}>
                    <View style={styles.view_button}>
                        <Image
                            style={styles.event}
                            source={this.getResources().ic_home_course}
                        />
                        <Text style={styles.text} allowFontScaling={global.isScaleFont}>{this.t('course_info')}</Text>
                        {/* <CountEvent ref={(countEventView) => { this.countEventView = countEventView; }} style={{ left: 24, bottom: 24 }} /> */}
                    </View>
                </Touchable>
                <Touchable onPress={this.onEventClick.bind(this)}>
                    <View style={styles.view_button}>
                        <Image
                            style={styles.event}
                            source={this.getResources().ic_event}
                        />
                        <Text style={styles.text} allowFontScaling={global.isScaleFont}>{this.t('event_ic_home')}</Text>
                        <CountEvent ref={(countEventView) => { this.countEventView = countEventView; }} style={{ left: 24, bottom: 24 }} />
                    </View>
                </Touchable>
                <Touchable
                    onPress={this.onLeaderBoardClick.bind(this)}>
                    <View style={styles.view_button}>
                        <Image
                            style={styles.home_course}
                            source={this.getResources().ic_ranking}
                        />
                        <Text style={styles.text} allowFontScaling={global.isScaleFont}>{this.t('leaderboard_title')}</Text>
                    </View>
                </Touchable>

                <Touchable onPress={this.onAwardClick.bind(this)}>
                    <View style={styles.view_button}>
                        <Image
                            style={styles.event}
                            source={this.getResources().icon_home_phongdo}
                        />
                        <Text style={styles.text} allowFontScaling={global.isScaleFont}>{this.t('awards_title')}</Text>
                        {/* <CountEvent ref={(countEventView) => { this.countEventView = countEventView; }} style={{ left: 24, bottom: 24 }} /> */}
                    </View>
                </Touchable>

                <Touchable onPress={this.onNotifyClick.bind(this)}>
                    <View style={styles.view_button}>
                        <Image
                            style={styles.event}
                            source={this.getResources().icon_home_noti}
                        />
                        <Text style={styles.text} allowFontScaling={global.isScaleFont}>{this.t('notify')}</Text>
                    </View>
                </Touchable>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: width,
        minHeight: 40,
        position: 'absolute',
        right: 15,
        left: 15,
        bottom: 0,
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor : 'blue'
    },

    view_button: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        // backgroundColor : 'green'
    },

    text : {
        fontSize: 10, 
        color: '#fff', 
        // marginTop: 6
    },

    event: {
        height: 25,
        width: 25,
        resizeMode: 'contain',
        // marginLeft: 10,
        marginBottom: 3
    },

    home_course: {
        height: 25,
        width: 25,
        resizeMode: 'contain',
        // marginLeft: 10,
        marginBottom: 4
    },
});