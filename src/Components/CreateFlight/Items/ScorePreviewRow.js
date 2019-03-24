import React from 'react';
import { Platform, StyleSheet, Text, View, ImageBackground, Dimensions } from 'react-native';
import AppUtil from '../../../Config/AppUtil';
import Files from '../../Common/Files';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
import BaseComponent from '../../../Core/View/BaseComponent';

const ICON_GROSS = {
    CIRCLE: Files.sprites.ic_score_circle,
    RECTANGLE: Files.sprites.ic_score_rectangle,
    TRITANGLE: Files.sprites.ic_score_tritangle
}

export default class ScorePreviewRow extends BaseComponent {

    static defaultProps = {
        rowIndex: 0,
        HoleList: [],
        isGrossScoreMode: true,
        isShowConfirm: false,
        isExtras: false,
        type_flight: 1
    }

    constructor(props) {
        super(props);
        this.state = {
            scoreMode: 'TOTAL'
        }
        this.onModeChangePress = this.onModeChangePress.bind(this);
        this.onScorePlayerPress = this.onScorePlayerPress.bind(this);
    }

    render() {
        let { scoreMode } = this.state;
        let {
            rowIndex,
            HoleList,
            isGrossScoreMode,
            isShowConfirm,
            isExtras,
            type_flight
         } = this.props;
        let moreData = isExtras || type_flight === 2;
        let frontHoleList = isExtras ? HoleList.slice(18, 27) : HoleList.slice(0, 9);
        let backHoleList = moreData ? HoleList.slice(0, 9) : HoleList.slice(9, 18);
        if (rowIndex === 0) {    // Hole line

            let frontHole = frontHoleList.map(item => {
                return <Text allowFontScaling={global.isScaleFont} style={styles.txt_hole_index}>{item.getHoleStt()}</Text>
            });
            let backHole = backHoleList.map(item => {
                return <Text allowFontScaling={global.isScaleFont} style={styles.txt_hole_index}>{moreData ? '' : item.getHoleStt()}</Text>
            });
            return (
                <View style={styles.container}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_hole}>Hole</Text>
                    {frontHole}
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_hole_out}>{moreData ? '' : 'OUT'}</Text>
                    {backHole}
                    {moreData ? null : <Text allowFontScaling={global.isScaleFont} style={styles.txt_hole_out}>IN</Text>}
                    <Text allowFontScaling={global.isScaleFont} style={[styles.txt_hole_total, { textDecorationLine: 'underline', color: '#00ABA7' }]}
                        onPress={this.onModeChangePress}>{scoreMode}</Text>
                </View>
            )
        } else if (rowIndex === 1) { // Par line
            let totalFontPar = 0;
            let totalBackPar = 0;
            let totalPar = 0;

            HoleList.slice(0, HoleList.length).map(item => {
                totalPar += item.getPar();
            })

            let frontHole = frontHoleList.map(item => {
                totalFontPar += item.getPar();
                return <Text allowFontScaling={global.isScaleFont} style={styles.txt_par_index}>{item.getPar()}</Text>
            });
            let backHole = backHoleList.map(item => {
                totalBackPar += item.getPar();
                return <Text allowFontScaling={global.isScaleFont} style={styles.txt_par_index}>{moreData ? '' : item.getPar()}</Text>
            });
            return (
                <View style={styles.container}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_par_bold}>Par</Text>
                    {frontHole}
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_hole_out_par}>{totalFontPar}</Text>
                    {backHole}
                    {moreData ? null : <Text allowFontScaling={global.isScaleFont} style={styles.txt_hole_out_par}>{totalBackPar}</Text>}
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_hole_total}>{totalPar}</Text>
                </View>
            )
        } else if (rowIndex === 6) { // Index line
            let frontHole = frontHoleList.map(item => {
                return <Text allowFontScaling={global.isScaleFont} style={styles.txt_index_value}>{item.getHoleIndex()}</Text>
            });
            let backHole = backHoleList.map(item => {
                return <Text allowFontScaling={global.isScaleFont} style={styles.txt_index_value}>{moreData ? '' : item.getHoleIndex()}</Text>
            });
            return (
                <View style={styles.container}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_index}>Index</Text>
                    {frontHole}
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_index_out}></Text>
                    {backHole}
                    {moreData ? null : <Text allowFontScaling={global.isScaleFont} style={styles.txt_index_out}></Text>}

                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_hole_total}></Text>
                </View>
            )
        } else {    // Score line
            let totalOut = 0;
            let totalIn = 0;
            let total = 0;

            // let holeProps = hole;
            // let score = isGrossMode ? holeProps.getGross() : (holeProps.getGross() != 0 ? AppUtil.convertGrossToOVer(parseInt(holeProps.getGross()), parseInt(holeProps.getPar())) : '');
            // let over = parseInt(holeProps.getGross()) - parseInt(holeProps.getPar());
            HoleList.slice(0, HoleList.length).map(item => {
                let gross = item.getGross();
                let over = parseInt(AppUtil.convertGrossToOVer(gross, item.getPar()));
                let score = isGrossScoreMode || gross === 0 ? gross : over;
                total += parseInt(score);
            })

            let frontHole = frontHoleList.map(item => {
                let gross = item.getGross();
                let over = parseInt(AppUtil.convertGrossToOVer(gross, item.getPar()));
                let score = isGrossScoreMode || gross === 0 ? gross : over;
                totalOut += parseInt(score);
                return (
                    <ImageBackground style={styles.view_score}
                        imageStyle={{ resizeMode: 'contain', tintColor: '#7E7D7E' }}
                        source={!isGrossScoreMode || gross === 0 || over > 0 ? '' : (over === 0 ? ICON_GROSS.CIRCLE : (over === -1 ? ICON_GROSS.TRITANGLE : ICON_GROSS.RECTANGLE))}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.text_input_score}>{score}</Text>
                    </ImageBackground>
                );//<Text allowFontScaling={global.isScaleFont} style={styles.txt_score_value}>{score}</Text>
            });
            if (isExtras) {
                // console.log('backHoleList', JSON.stringify(backHoleList))
            }
            let backHole = backHoleList.map(item => {
                let gross = item.getGross();
                let over = parseInt(AppUtil.convertGrossToOVer(gross, item.getPar()));
                let score = isGrossScoreMode || gross === 0 ? gross : over;
                totalIn += parseInt(score);
                return (
                    <ImageBackground style={styles.view_score}
                        imageStyle={{ resizeMode: 'contain', tintColor: '#7E7D7E' }}
                        source={!isGrossScoreMode || gross === 0 || over > 0 ? '' : (over === 0 ? ICON_GROSS.CIRCLE : (over === -1 ? ICON_GROSS.TRITANGLE : ICON_GROSS.RECTANGLE))}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.text_input_score}>{moreData ? '' : score}</Text>
                    </ImageBackground>
                );//<Text allowFontScaling={global.isScaleFont} style={styles.txt_score_value}>{score}</Text>

            });
            return (
                <View style={styles.container}>
                    <View style={styles.txt_score_total}>
                        <View style={styles.view_index_circle}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_user_index}>{parseInt(rowIndex) - 1}</Text>
                        </View>
                    </View>
                    {frontHole}
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_score_out}>{totalOut}</Text>
                    {backHole}
                    {moreData ? null : <Text allowFontScaling={global.isScaleFont} style={styles.txt_score_out}>{totalIn}</Text>}

                    <Text allowFontScaling={global.isScaleFont}
                        style={[styles.txt_hole_total, isShowConfirm ? { color: '#FF0000', textDecorationLine: 'underline' } : { color: '#1F1F1F' }]}
                        onPress={isShowConfirm ? this.onScorePlayerPress : null}>
                        {total}
                    </Text>
                </View>
            )
        }

    }

    onModeChangePress() {
        let { scoreMode } = this.state;
        this.setState({
            scoreMode: scoreMode === 'TOTAL' ? 'OVER' : 'TOTAL'
        }, () => {
            if (this.props.onModeChangePress) {
                this.props.onModeChangePress(this.state.scoreMode === 'TOTAL');
            }
        })

    }

    onScorePlayerPress() {
        if (this.props.onScorePlayerPress) {
            this.props.onScorePlayerPress();
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF'
    },
    txt_hole: {
        minWidth: verticalScale(50),
        color: '#1F1F1F',
        textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth: scale(0.5),
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        backgroundColor: '#F3F3F3'
    },
    txt_hole_out: {
        minWidth: verticalScale(35),
        color: '#1F1F1F',
        fontWeight: 'bold',
        textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth: scale(0.5),
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        backgroundColor: '#F3F3F3'
    },
    txt_hole_out_par: {
        minWidth: verticalScale(35),
        color: '#1F1F1F',
        fontWeight: 'bold',
        textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth: scale(0.5),
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        backgroundColor: '#FFE88B'
    },
    txt_hole_total: {
        minWidth: verticalScale(50),
        color: '#1F1F1F',
        fontWeight: 'bold',
        textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth: scale(0.5),
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        backgroundColor: '#FFE88B'
    },
    txt_hole_index: {
        flex: 1,
        color: '#1F1F1F',
        textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth: scale(0.5),
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        backgroundColor: '#F3F3F3'
    },
    txt_par: {
        minWidth: verticalScale(50),
        color: '#1F1F1F',
        textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth: scale(0.5),
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        backgroundColor: '#FFE88B'
    },
    txt_par_bold: {
        minWidth: verticalScale(50),
        color: '#1F1F1F',
        fontWeight: 'bold',
        textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth: scale(0.5),
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        backgroundColor: '#FFE88B'
    },
    txt_par_index: {
        flex: 1,
        color: '#1F1F1F',
        textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth: scale(0.5),
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        backgroundColor: '#FFE88B'
    },
    txt_user_index: {
        color: '#FFFFFF',
        textAlign: 'center',
        // backgroundColor: '#8A8A8A',
        borderRadius: scale(3),
        paddingLeft: scale(7),
        paddingRight: scale(7)
    },
    txt_score_total: {
        minWidth: verticalScale(50),
        color: '#1F1F1F',
        justifyContent: 'center',
        alignItems: 'center',
        // fontWeight: 'bold',
        // textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth: scale(0.5),
        // paddingTop:  verticalScale(5),
        // paddingBottom: verticalScale(5)
    },
    txt_score_value: {
        flex: 1,
        color: '#1F1F1F',
        textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth: scale(0.5),
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        fontSize: fontSize(12, -scale(3)),// 12
    },
    txt_score_out: {
        minWidth: verticalScale(35),
        color: '#1F1F1F',
        fontWeight: 'bold',
        textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth: scale(0.5),
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5)
    },
    txt_index: {
        minWidth: verticalScale(50),
        color: '#1F1F1F',
        textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth: scale(0.5),
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        backgroundColor: '#EBEBEB'
    },
    txt_index_value: {
        flex: 1,
        color: '#1F1F1F',
        textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth: scale(0.5),
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        backgroundColor: '#EBEBEB'
    },
    txt_index_out: {
        minWidth: verticalScale(35),
        color: '#1F1F1F',
        fontWeight: 'bold',
        textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth: scale(0.5),
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        backgroundColor: '#EBEBEB'
    },
    view_score: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#BDBDBD',
        borderWidth: scale(0.5)
    },
    image_view_score: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'stretch',
    },
    text_input_score: {
        color: '#1F1F1F',
        textAlign: 'center',
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5)
    },
    view_index_circle: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00ABA7',
        width: 22,
        height: 22,
        borderRadius: 11
    }
});