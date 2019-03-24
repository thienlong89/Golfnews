import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import AppUtil from '../../../Config/AppUtil';
import BasePureComponent from '../../../Core/View/BasePureComponent';
import CustomAvatar from '../../Common/CustomAvatar';
import MyView from '../../../Core/View/MyView';

import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';

export default class FlightItemView extends BasePureComponent {

    constructor(props) {
        super(props);
        this.listDefault = [0, 0, 0, 0];
        this.onItemClick = this.onItemClick.bind(this);
    }

    // shouldComponentUpdate(){
    //     return false;
    // }

    static defaultProps = {
        flight: {}
    }

    renderListUser(listPlayer) {
        listPlayer = [...listPlayer, ...this.listDefault.slice(0, 4 - listPlayer.length)];
        return (
            listPlayer.map((player) => {
                if (typeof player === 'object') {
                    return (
                        <View style={styles.view_item_user}>
                            <CustomAvatar
                                height={50}
                                width={50}
                                uri={player.getAvatar()}
                                onAvatarClick={this.onItemClick}
                            />
                            <Text allowFontScaling={global.isScaleFont}
                                style={styles.txt_user_name}
                                numberOfLines={1}>
                                {player.getFullName()}
                            </Text>
                        </View>
                    )
                } else {
                    return (
                        <View style={styles.view_item_user}></View>
                    )
                }
            })

        )
    }

    render() {
        let roundItem = this.props.flight;
        let flight = roundItem.getFlight();
        let gross = roundItem.getGross();
        let listPlayer = flight.getUserProfiles();
        return (
            <TouchableOpacity style={[styles.view_container]}
                onPress={this.onItemClick}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.view_item}>
                            <Image
                                style={styles.img_icon}
                                source={this.getResources().ic_map_header} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_flight_name}>{flight.getFlightName()}</Text>
                        </View>
                        <View style={styles.view_item}>
                            <Image
                                style={styles.img_icon}
                                source={this.getResources().tee_time_icon} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_time}>{flight.getDatePlayedDisplay()}</Text>
                        </View>
                    </View>
                    <Text allowFontScaling={global.isScaleFont} style={styles.flight_over}>{roundItem.getOverDisplay()}</Text>
                </View>

                <View style={styles.view_list_user}>
                    {this.renderListUser(listPlayer)}
                </View>

            </TouchableOpacity>

        );
    }


    onItemClick(){
        if(this.props.onItemClick){
            this.props.onItemClick(this.props.flight)
        }
    }

}

const styles = StyleSheet.create({
    view_container: {
        backgroundColor: '#fff'
    },
    txt_user_name: {
        color: '#828282',
        fontSize: scale(10),
        marginRight: scale(3)
    },
    view_list_user: {
        flexDirection: 'row',
        margin: scale(10),
        flexGrow: 4
    },
    view_item_user: {
        flex: 1,
        alignItems: 'center'
    },
    view_item: {
        flexDirection: 'row',
        marginTop: scale(5),
        marginLeft: scale(10),
        marginRight: scale(10),
        alignItems: 'center'
    },
    img_icon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        tintColor: '#606060',
        marginRight: scale(5),
        opacity: 0.8
    },
    txt_flight_name: {
        color: '#1A1A1A',
        fontSize: fontSize(15),
        marginLeft: scale(10)
    },
    txt_time: {
        color: '#888888',
        fontSize: fontSize(12),
        marginLeft: scale(10)
    },
    flight_over: {
        color: '#00ABA7',
        fontSize: fontSize(18),
        fontWeight: 'bold',
        margin: scale(10)
    },
});
