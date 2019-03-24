import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import { scale, verticalScale, moderateScale, fontSize } from '../../../Config/RatioScale';
import moment from 'moment';

const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width / 4;
const TIME_FORMAT = `HH:mm;DD-MM-YYYY`;

export default class MemberFlightHistoryItem extends BaseComponent {

    static defaultProps = {
        round: null
    }

    constructor(props) {
        super(props);

        this.state = {

        }

    }

    render() {
        console.log('MemberFlightHistoryItem.render')
        let {
            round
        } = this.props;
        if (!round) return null;

        let roundId = round.getId();
        let flight = round.getFlight();
        if (!flight) return null;

        let flightId = flight.getId();
        let flightName = flight.getFlightName();
        let date = flight.getDatePlayedDisplay();
        let datePlay = date && date.includes(',') ? date.replace(',', '\n') : '';
        let hdcIndex = round.getIndex();
        let courseFacility = round.getCoursesHandicapDisplay();
        let arrayUrlScorecard = flight.getUrlScorecardArray();
        let gross = round.getGrossDisplay();
        let net = round.getNet();
        let diff = round.getDifferential();
        let time = moment(flight.getDate_create_timestamp()).format(TIME_FORMAT);
        let dateCreate = time && time.includes(';') ? date.replace(';', '\n') : '';

        return (
            <View style={styles.container}>
                <View style={styles.view_flight_id}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_id}>{roundId}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_id}>{flightId}</Text>
                </View>
                <View style={styles.view_line} />
                <View style={styles.view_flight_name}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_flight_name}>{flightName}</Text>
                </View>
                <View style={styles.view_line} />
                <View style={[styles.view_item_width]}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_flight_name}>{datePlay}</Text>
                </View>
                <View style={styles.view_line} />
                <View style={[styles.view_item_width]}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_flight_name}>{hdcIndex}</Text>
                    <View style={styles.handicap_facility_view}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.handicap_facility_text}>{courseFacility}</Text>
                    </View>
                </View>
                <View style={styles.view_line} />
                <View style={[styles.view_item_width]}>
                    <Image
                        style={styles.img_scorecard}
                        source={{ uri: arrayUrlScorecard[0] }} />
                </View>
                <View style={styles.view_line} />
                <View style={[styles.view_item_width]}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_flight_name}>{`${gross} (${net})`}</Text>
                </View>
                <View style={styles.view_line} />
                <View style={[styles.view_item_width]}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_flight_name}>{diff}</Text>
                </View>
                <View style={styles.view_line} />
                <View style={[styles.view_item_width]}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_flight_name}>{dateCreate}</Text>
                </View>
                <View style={styles.view_line} />
                <View style={[styles.view_item_width]}>

                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        height: verticalScale(100)
    },
    view_flight_id: {
        width: ITEM_WIDTH,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_flight_name: {
        width: 2.5 * ITEM_WIDTH,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_item_width: {
        width: ITEM_WIDTH,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt_id: {
        color: '#666666',
        fontSize: fontSize(15)
    },
    txt_flight_name: {
        color: '#373737',
        fontSize: fontSize(15),
        textAlign: 'center'
    },
    handicap_facility_view: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#00aba7',
        borderRadius: scale(20),
        width: scale(35),
        height: scale(35),
        borderWidth: scale(1.5),
    },
    handicap_facility_text: {
        alignSelf: 'center',
        color: '#00aba7',
        fontWeight: 'bold',
        fontSize: fontSize(15)
        //fontSize : 25
    },
    img_scorecard: {
        width: ITEM_WIDTH,
        height: null,
        resizeMode: 'contain'
    },
    view_line: {
        width: 0.8,
        backgroundColor: '#D4D4D4'
    }
});