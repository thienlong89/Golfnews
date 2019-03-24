import React, { Component } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import ItemPlayer from './ItemPlayer';
import {scale, verticalScale, moderateScale} from '../../Config/RatioScale';

export default class FriendFlightItem extends Component {

    static defaultProps = {
        friend_flight: {}
    }

    shouldComponentUpdate(nextProps, nextState) {
        return JSON.stringify(nextProps.friend_flight) != JSON.stringify(this.props.friend_flight);
    }

    render() {
        let playerList = this.props.friend_flight.getUserRounds();
        let viewArray = playerList.map((item, key) => {
            return <ItemPlayer key={key} player={item} />;
        });
        if (playerList.length < 4) {
            for (let i = playerList.length; i < 4; i++) {
                viewArray.push(<ItemPlayer key={'friend_flight_item' + i} player={null} />);
            }
        }
        return (
            <View style={styles.item_flight_player} >
                {viewArray}
            </View>
        );
    }


}

const styles = StyleSheet.create({
    item_flight_player: {
        flexDirection: 'row',
        height: verticalScale(90),
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 8
    }

});
