import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BasePureComponent from '../../../Core/View/BasePureComponent';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';

export default class RankingInfoView extends BasePureComponent {

    static defaultProps = {
        hdc_tt: '',
        hdc_usga: '',
        top_ranking: '',
        top_ranking_value: '',
        system_ranking: '',
        ranking_manner: ''
    }

    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        let {
            hdc_tt,
            hdc_usga,
            top_ranking,
            top_ranking_value,
            system_ranking,
            ranking_manner
        } = this.props;
        return (
            <ImageBackground style={styles.ranking_view}
                source={this.getResources().ic_ranking}
                resizeMethod={'resize'}
                resizeMode={'contain'}
                imageStyle={{ marginTop: 35, marginBottom: 20 }}
            >

                <Text allowFontScaling={global.isScaleFont} style={styles.ranking_title}>{this.t('leaderboard_title')}</Text>
                <View style={[styles.ranking_view_item, { marginTop: this.getRatioAspect().verticalScale(5) }]}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.ranking_text}>{this.t('hdc_tt')}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.ranking_value}>{hdc_tt}</Text>
                </View>
                <View style={styles.ranking_line} />

                <View style={styles.ranking_view_item}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.ranking_text}>{this.t('usga_hc')}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.ranking_value}>{hdc_usga}</Text>
                </View>
                <View style={styles.ranking_line} />

                <View style={styles.ranking_view_item}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.ranking_text}>{top_ranking}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.ranking_value}>{top_ranking_value}</Text>
                </View>
                <View style={styles.ranking_line} />

                <View style={[styles.ranking_view_system, { marginBottom: this.getRatioAspect().verticalScale(5) }]}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.ranking_text}>{this.t('system_ranking_title')}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.ranking_system_value}>{system_ranking}</Text>
                    <Image style={styles.ranking_manner}
                        source={this.getAppUtil().getSourceRankingManner(ranking_manner)}
                    />
                </View>
            </ImageBackground>
        );
    }


}

const styles = StyleSheet.create({
    ranking_view: {
        flex: 4,
        backgroundColor: '#6BAD6A',
        borderRadius: scale(10),
        marginTop: verticalScale(10),
        marginRight : scale(10)
    },

    ranking_title: {
        backgroundColor: '#EFEFF4',
        borderTopLeftRadius: scale(8),
        borderTopRightRadius: scale(8),
        color: '#444444',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: fontSize(15),// 15,
        paddingTop: verticalScale(3),
        paddingBottom: verticalScale(3)
    },
    ranking_view_item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: scale(20),
        marginLeft: scale(10)
    },
    ranking_text: {
        color: '#FFFFFF',
        fontSize: fontSize(13)
    },
    ranking_value: {
        color: '#FFE24A',
        fontWeight: 'bold',
        fontSize: fontSize(13),
        marginLeft: scale(5)
    },
    ranking_manner: {
        position: 'absolute',
        height: verticalScale(10),
        width: scale(10),
        resizeMode: 'contain',
        right: scale(5)
    },
    ranking_view_system: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 0,
        marginLeft: scale(10),
        alignItems: 'center'
    },
    ranking_system_value: {
        color: '#FFE24A',
        fontWeight: 'bold',
        marginRight: scale(20)
    },
    ranking_line: {
        backgroundColor: '#FFFFFF',
        marginRight: scale(20),
        marginLeft: scale(10),
        marginTop: verticalScale(3),
        marginBottom: verticalScale(3),
        height: 0.5
    },
});