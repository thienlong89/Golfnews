import React from 'react';
import { StyleSheet, Text, View, Image, Platform } from 'react-native';
import MyView from '../../Core/View/MyView';
import BaseComponent from '../../Core/View/BaseComponent';


export default class HandicapHistoryItem extends BaseComponent {

    static defaultProps = {
        itemId: 1,
        flightHistory: {}
    }

    constructor(props) {
        super(props);
        this.state = {
            isHideFlightStatus: true
        }
    }

    checkShowAwards(type) {
        if (type.toString().trim().toLowerCase() === 'finished') {
            return true;
        }
        return false;
    }

    render() {
        let flight = this.props.flightHistory;//.Flight;
        //console.log("flight : ", flight);
        //console.log('flight.selected_round_for_handicap_index ',flight.selected_round_for_handicap_index);
        //let players = this.props.flightHistory.User;
        return (
            <View style={styles.item_listview}>
                <View style={{ width: 30, justifyContent: 'center', alignItems: 'center' }}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.item_rnd} numberOfLines={1}>{this.props.itemId}</Text>
                    <MyView style={styles.star_view} hide={!flight.selected_round_for_handicap_index}>
                        <Image style={styles.star_image}
                            source={this.getResources().ic_star} />
                    </MyView>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={styles.item_course_tee}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.item_flight_name}>{flight.getFlightName()}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.item_flight_time}>{flight.getDatePlayedDisplay()}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }} hide={!this.checkShowAwards(flight.type)}>
                            <View style={{ width: 14, height: 14, backgroundColor: this.getAppUtil().getColorTee(flight.tee_id), borderColor: '#707070', borderWidth: (Platform.OS === 'ios') ? 1 : 0.5 }}></View>
                            <Text allowFontScaling={global.isScaleFont} style={{ color: this.checkShowAwards(flight.type) ? '#707070' : '##FF0000', marginLeft: 5 }}>{this.checkShowAwards(flight.type) ? flight.getAwards() : this.t('waiting_for_accept')}</Text>
                        </View>
                    </View>

                    <Text allowFontScaling={global.isScaleFont} style={styles.item_r} numberOfLines={1}>{flight.getCourseRating()}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.item_s} numberOfLines={1}>{flight.getSlopeRating()}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.item_g} numberOfLines={1}>{flight.getGross()}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.item_a} numberOfLines={1}>{flight.getAdjust()}</Text>

                </View>

            </View>
        );

    }

}

const styles = StyleSheet.create({

    star_view: {
        width: 30,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center'
    },

    star_image: {
        width: 18,
        height: 18,
        resizeMode: 'contain'
    },

    item_listview: {
        flexDirection: 'row',
        paddingLeft: 3,
        paddingRight: 3,
        paddingTop: 3,
        paddingBottom: 3,
        borderTopColor : '#707070',
        borderTopWidth : Platform.OS === 'ios' ? 1 : 0.5
    },
    item_rnd: {
        //flex: 1,
        color: '#666666',
        textAlign: 'center'
    },
    item_course_tee: {
        flex: 1,
        flexDirection: 'column'
    },
    item_r: {
        minWidth: 33,
        color: '#454545',
        textAlign: 'center',
    },
    item_s: {
        minWidth: 33,
        color: '#454545',
        textAlign: 'center',
    },
    item_g: {
        minWidth: 33,
        color: '#00BAB6',
        textAlign: 'center',
    },
    item_a: {
        minWidth: 33,
        color: '#454545',
        textAlign: 'center',
    },
    item_flight_name: {
        color: '#1A1A1A'
    },
    item_flight_time: {
        color: '#ABABAB'
    },
    item_flight_status: {
        color: '#FF0000'
    }

});
