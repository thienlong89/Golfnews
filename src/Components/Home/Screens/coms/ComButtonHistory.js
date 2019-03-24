import React from 'react';
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import BaseComponent from '../../../../Core/View/BaseComponent';
import { fontSize, scale, verticalScale } from '../../../../Config/RatioScale';
let { width } = Dimensions.get('window');
let view_width = width - scale(20);

export default class ComButtonHistory extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }

    updateData(playerInfo) {
        this.userProfile = playerInfo.getPlayerProfile();
        this.puid = playerInfo.getPuid();
        let friend_status = playerInfo.getFriendStatus();
        if (friend_status === 1){
            let{show} = this.state;
            if(show) return;
            this.setState({
                show : true
            });
        }
    }

    render() {
        let { isMe } = this.props;
        let { show } = this.state;
        if (isMe || show) {
            return (
                <View style={styles.container}>
                    <Image style={styles.img}
                        source={this.getResources().history_flight}
                    />
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt}>{this.t('flight_history')}</Text>
                </View>
            );
        } else {
            return null;
        }
    }
}

const styles = StyleSheet.create({
    container: {
        height: verticalScale(50),
        width: view_width,
        borderColor: 'rgba(0,0,0,0.25)',
        borderRadius: 5,
        borderWidth: 1,
        marginLeft: scale(10),
        marginRight: scale(10),
        marginTop: verticalScale(10),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    img: {
        height: verticalScale(32),
        width: verticalScale(30),
        resizeMode: 'contain',
        tintColor: '#282828'
    },
    txt: {
        fontSize: fontSize(16, scale(2)),
        color: '#505050',
        marginLeft: scale(15),
    }
});