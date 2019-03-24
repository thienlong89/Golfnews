import React from 'react';
import { Platform, StyleSheet, Text, View,Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import MyView from '../../../Core/View/MyView';
import InputScoreItemView from '../Items/InputScoreItemView';

import {scale, verticalScale, moderateScale} from '../../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

export default class EnterScorePathOut extends BaseComponent {

    static defaultProps = {
        isHostUser: false,
        pathName: '',
        selectType: 0
    }

    constructor(props) {
        super(props);
        this.playerSelected = 0;
        this.disableChangeScore = false;
        this.isHostUser = false;
        this.state = {
            flightDetailState: null,
            hole_selected: 0,
            isGrossMode: true
        }
    }

    initOutData(isHostUser = false){
        this.isHostUser = isHostUser;
        console.log('setOutData.isHostUser', isHostUser);
    }

    setOutData(flightDetailModel, playerSelected, hole_selected, isGrossMode = true, isHostUser) {
        this.isHostUser = isHostUser;
        console.log('setOutData', this.isHostUser, playerSelected);
        this.playerSelected = playerSelected;
        this.disableChangeScore = !this.isHostUser && playerSelected != 0;
        this.setState({
            flightDetailState: flightDetailModel,
            hole_selected: hole_selected,
            isGrossMode: isGrossMode
        });
    }

    render() {
        if (this.state.flightDetailState) {
            // this.Logger().log('setOutData.render');
            let flight = this.state.flightDetailState.getFlight();
            let holeDetailFont = (flight.getUserRounds()[this.playerSelected].getHoldUserList()).slice(0, 9);
            let parOut = 0;
            let scoreOut = 0;

            let frontScoreListView = holeDetailFont.map((item, index) => {
                parOut += item.getPar();
                scoreOut += this.state.isGrossMode ? parseInt(item.getGross()) :
                    (parseInt(item.getGross()) != 0 ? parseInt(item.getGross()) - parseInt(item.getPar()) : 0);
                return (
                    <Touchable style={styles.input_content_container}
                        onPress={this.disableChangeScore ? null : () => this.onFrontScoreSelected(item, index)} >
                        <View style={{ flex: 1 }}>
                            <InputScoreItemView hole={item} isGrossMode={this.state.isGrossMode} />
                            <MyView hide={this.state.hole_selected != index || this.disableChangeScore} style={[styles.view_item_overlap, styles.hold_selected]}></MyView>
                        </View>
                    </Touchable>
                );
            });

            return (
                <View style={styles.container_input_row}>
                    <View style={styles.input_title_group}>
                        <Touchable
                            onPress={!this.isHostUser ? this.onGuestChangePathWarning.bind(this) : this.onChangeFontPath.bind(this)}
                            disabled={this.props.selectType === 1}
                            style={{flex: 1}}>
                            <Text allowFontScaling={global.isScaleFont} style={[styles.input_title_text_path,
                            this.props.selectType === 1 ? { color: '#828282' } : { color: '#1996F1', textDecorationLine: 'underline' }]}
                                numberOfLines={1}>
                                {this.props.pathName}
                            </Text>
                        </Touchable>

                        <Text allowFontScaling={global.isScaleFont} style={styles.input_title_text_par}>Par</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.input_title_text}>Index</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.input_title_text_score}>Score</Text>
                    </View>
                    <View style={styles.input_score_group}>
                        {frontScoreListView}
                    </View>
                    <View style={styles.input_total_group}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.input_title_text}>OUT</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.input_title_text_par}>{parOut}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.input_title_text_hide}></Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.input_total_score}>{scoreOut}</Text>
                    </View>
                </View>
            );
        } else {
            return null;
        }
    }

    onFrontScoreSelected(item, index) {
        if (this.props.onFrontScoreSelected) {
            this.props.onFrontScoreSelected(item, index);
        }
        // this.updateHoldUserSelected(index);
    }

    onGuestChangePathWarning() {
        if (this.props.onGuestChangePathWarning) {
            this.props.onGuestChangePathWarning();
        }
    }

    onChangeFontPath() {
        if (this.props.onChangeFontPath) {
            this.props.onChangeFontPath();
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    input_content_container: {
        flex: 1
    },
    container_input_row: {
        flexDirection: 'row',
        borderColor: '#BDBDBD',
        borderWidth: scale(1),
        marginBottom: verticalScale(5)
    },
    input_score_group: {
        flex: 1,
        flexDirection: 'row'
    },
    input_title_group: {

    },
    input_title_text_path: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth:  scale(0.5),
        paddingTop:  verticalScale(5),
        paddingBottom: verticalScale(5),
        backgroundColor: '#F3F3F3',
        maxWidth: scale(50)
    },
    input_title_text_par: {
        minWidth: scale(50),
        color: '#828282',
        fontWeight: 'bold',
        textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth: scale(0.5),
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        backgroundColor: '#FFE88B'
    },
    input_total_score: {
        color: '#1F1F1F',
        fontWeight: 'bold',
        textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth: scale(0.5),
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5)
    },
    input_title_text: {
        minWidth: scale(50),
        color: '#828282',
        fontWeight: 'bold',
        textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth: scale(0.5),
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5),
        backgroundColor: '#F3F3F3'
    },
    input_title_text_hide: {
        flex: 1,
        minWidth: scale(50),
        borderColor: '#BDBDBD',
        borderWidth: scale(0.5),
        backgroundColor: '#F3F3F3'
    },
    input_title_text_score: {
        minWidth: scale(50),
        color: '#828282',
        fontWeight: 'bold',
        textAlign: 'center',
        borderColor: '#BDBDBD',
        borderWidth: scale(0.5),
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(5)
    },
    input_total_group: {

    },
    view_item_overlap: {
        position: 'absolute',
        right: 0,
        left: 0,
        bottom: 0,
        top: 0
    },
    hold_selected: {
        backgroundColor: '#56CCF2',
        borderColor: '#56CCF2',
        borderWidth: scale(0.5),
        opacity: 0.5
    },
});