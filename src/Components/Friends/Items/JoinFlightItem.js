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
import CustomAvatar from '../../Common/CustomAvatar';

export default class JoinFlightItem extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {

        let flightName = 'Long bien golf';
        let number = '3/4';
        let distance = '15 km';
        let teeTime = '11:00 - 13/9/2018';

        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row' }}>
                    <CustomAvatar
                        width={60}
                        height={60}
                        style={styles.custom_avatar} />
                    <View style={styles.view_content}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.flight_name}>{flightName}</Text>
                        <View style={styles.view_more_info}>
                            <View style={styles.view_group}>
                                <Image
                                    style={styles.img_icon}
                                    source={this.getResources().ic_group}
                                />
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_number}>{number}</Text>
                            </View>

                            <View style={styles.view_group}>
                                <Image
                                    style={styles.img_icon}
                                    source={this.getResources().ic_pin}
                                />
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_number}>{distance}</Text>
                            </View>

                            <View style={styles.view_group}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_number}>
                                    {`${this.t('tee_time')}: `}
                                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_tee_time}>
                                        {teeTime}
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 10
    },
    custom_avatar: {

    },
    view_content: {
        flex: 1,
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 5,
        justifyContent: 'space-between'
    },
    flight_name: {
        color: '#000',
        fontSize: 15,
        fontWeight: 'bold'
    },
    view_more_info: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    view_group: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    img_icon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        marginRight: 4
    },
    txt_number: {
        color: '#858585',
        fontSize: 13
    },
    txt_tee_time: {
        fontWeight: 'bold'
    }
});