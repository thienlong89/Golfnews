import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import RoundItemModel from '../../Model/Home/RoundItemModel';
import MyView from '../../Core/View/MyView';
import FriendFlightItem from '../Home/FriendFlightItem';
import FinishedFlightItem from '../Home/FinishedFlightItem';
import { fontSize, scale } from '../../Config/RatioScale';

/**
 * render header trong component flight comment
 * tach component de tang hieu nang tranh bi render lai ca 1 component lon
 */
export default class HeaderCommentFlight extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            h: 200,
            keyboard_show : false
        }
    }

    setHeight(h) {
        this.setState({
            h: h
        });
    }

    setKeyBoardShow(isShow){
        this.setState({
            keyboard_show : isShow
        })
    }

    render() {
        // let { h } = this.state;
        let {flight} = this.props;
        let isFlightModel = flight instanceof RoundItemModel;
        let { keyboard_show } = this.state;
        let component = null;
        if (!flight) {
            // finish flight
            component = (
                <MyView hide={keyboard_show}>
                    {/* <FinishedFlightItem finishedFlight={flight} /> */}
                </MyView>
            );
        } else {
            component = (
                <MyView hide={keyboard_show}>
                    <View style={styles.item_friend_flight}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.flight_name} numberOfLines={1}>
                            {flight.getFlightName()}
                        </Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.flight_time} numberOfLines={1}>
                            {this.getUtils().getFormatAgoTime(flight.getDatePlayedTimestamp())}
                        </Text>
                    </View>
                    <FriendFlightItem friend_flight={flight} />
                </MyView>
            );
        }
        return (
            component
        );
    }
}

const styles = StyleSheet.create({
    flight_time: {
        flex: 1,
        color: '#B8B8B8',
        fontSize: fontSize(11, -3),
        textAlignVertical: 'center',
        textAlign: 'right'
    },

    item_friend_flight: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: scale(10),
        marginRight: scale(10),
        marginBottom: scale(5)
    },

    flight_name: {
        flex: 3,
        color: '#1A1A1A',
        fontSize: fontSize(13),
        marginRight: scale(5),
        textAlignVertical: 'center'
    },
});