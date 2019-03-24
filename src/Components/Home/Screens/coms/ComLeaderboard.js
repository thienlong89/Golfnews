import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    Image,
    ImageBackground
} from 'react-native';
import BaseComponent from '../../../../Core/View/BaseComponent';
import { scale, verticalScale, fontSize } from '../../../../Config/RatioScale';
import ComHeader from './ComHeader';
import TextCount from '../../../Facilities/Reviews/Items/TextCount';
let { width } = Dimensions.get('window');
let com_width = (width - scale(20)) / 3;

export default class ComLeaderboard extends BaseComponent {
    constructor(props) {
        super(props);
        // this.state = {
        //     isSearching: false
        // }

        this.userProfile = this.getUserInfo().getUserProfile();
        this.onHdcUsgaPress = this.onHdcUsgaPress.bind(this);
        this.onSystemRankingPress = this.onSystemRankingPress.bind(this);
        this.onHdcTamTinhPress = this.onHdcTamTinhPress.bind(this);
    }

    render() {
        let { display_ranking_type, system_ranking, usga_hc_index, monthly_handicap, usga_hc_index_expected, ranking } = this.userProfile;
        console.log('usga_hc_index', usga_hc_index);
        return (
            <View style={styles.container}>
                <ComHeader title={this.t('your_ranking')} />
                <ImageBackground style={{}}
                    source={this.getResources().ic_huyhieu}
                    resizeMethod={'resize'}
                    resizeMode={'contain'}
                    imageStyle={{ marginTop: 10, marginBottom: 10 }}
                >

                    <View style={styles.view_content}>
                        <View style={{ flex: 1 }}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('hdc_tam_tinh')}</Text>
                            <TextCount style={styles.txt_title} count={this.t('usga_hc')}></TextCount>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{display_ranking_type}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('system_ranking_title')}</Text>
                        </View>

                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text allowFontScaling={global.isScaleFont} style={[styles.txt_value_underline]}
                            onPress={this.onHdcTamTinhPress}>
                                {usga_hc_index !== null ? usga_hc_index : ''}
                            </Text>
                            <Text
                                style={[styles.txt_value_underline]}
                                onPress={this.onHdcUsgaPress}>
                                {monthly_handicap !== null ? monthly_handicap : ''}
                            </Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_value}>{ranking > 0 ? ranking : 'N/A'}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_value_underline}
                            onPress={this.onSystemRankingPress}>{system_ranking}</Text>
                        </View>
                    </View>

                </ImageBackground>




            </View>
        )
    }

    onHdcUsgaPress() {
        if (this.props.onHdcUsgaPress) {
            this.props.onHdcUsgaPress();
        }
    }

    onSystemRankingPress(){
        if (this.props.onSystemRankingPress) {
            this.props.onSystemRankingPress();
        }
    }

    onHdcTamTinhPress(){
        if (this.props.onHdcTamTinhPress) {
            this.props.onHdcTamTinhPress();
        }
    }
}

const styles = StyleSheet.create({
    container: {
        borderColor: 'rgba(0,0,0,0.25)',
        borderRadius: 5,
        borderWidth: 1,
        marginLeft: scale(10),
        marginRight: scale(10),
        marginTop: verticalScale(10)
    },
    view_content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10)
    },
    txt_title: {
        fontSize: fontSize(15, scale(1)),
        color: '#1b1b1b',
        marginLeft: scale(15)
    },
    txt_value: {
        fontSize: fontSize(15, scale(1)),
        color: '#1b1b1b',
        marginRight: scale(15)
    },
    txt_value_underline: {
        fontSize: fontSize(15, scale(1)),
        color: '#00BAB6',
        marginRight: scale(15),
        textDecorationLine: 'underline'
    }
});