import React from 'react';
import { Platform, StyleSheet, Text, View, Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import MyView from '../../../Core/View/MyView';
import InputScoreItemView from '../Items/InputScoreItemView';

import { scale, verticalScale, moderateScale } from '../../../Config/RatioScale';
let { width, height } = Dimensions.get('window');

export default class EnterScorePathIn extends BaseComponent {

    static defaultProps = {
        isHostUser: false,
        pathName: '',
        selectType: 0,
        type_flight: 1
    }

    constructor(props) {
        super(props);
        this.playerSelected = 0;
        this.disableChangeScore = false;
        this.isHostUser = this.props.isHostUser;
        this.state = {
            flightDetailState: null,
            hole_selected: 0,
            isGrossMode: true
        }
    }

    initInData(isHostUser = false) {
        this.isHostUser = isHostUser;
    }

    setInData(flightDetailModel, playerSelected, hole_selected, isGrossMode = true) {
        this.playerSelected = playerSelected;
        this.disableChangeScore = !this.isHostUser && playerSelected != 0;
        this.setState({
            flightDetailState: flightDetailModel,
            hole_selected: hole_selected,
            isGrossMode: isGrossMode
        });
    }

    render() {

        let {
            flightDetailState,
            isGrossMode,
            hole_selected
        } = this.state;

        let {
            type_flight,
            selectType,
            pathName
        } = this.props;

        let isEighteenHole = type_flight === 1;

        if (flightDetailState) {
            let flight = flightDetailState.getFlight();
            let holeDetailBack = isEighteenHole ? (flight.getUserRounds()[this.playerSelected].getHoldUserList()).slice(9, 18) :
                (flight.getUserRounds()[this.playerSelected].getHoldUserList()).slice(18, 27);

            let parIn = 0;
            let scoreIn = 0;

            let backScoreListView = holeDetailBack.map((item, index) => {
                parIn += item.getPar();
                scoreIn += isGrossMode ? parseInt(item.getGross()) :
                    (parseInt(item.getGross()) != 0 ? parseInt(item.getGross()) - parseInt(item.getPar()) : 0);
                index = isEighteenHole ? index + holeDetailBack.length : index + holeDetailBack.length + 9;
                console.log('index', index)
                return (
                    <Touchable style={styles.input_content_container}
                        onPress={this.disableChangeScore ? null : () => this.onBackScoreSelected(item, index)}>
                        <View style={{ flex: 1 }}>
                            <InputScoreItemView hole={item} isGrossMode={isGrossMode} />
                            <MyView hide={hole_selected != index || this.disableChangeScore} style={[styles.view_item_overlap, styles.hold_selected]}></MyView>
                        </View>
                    </Touchable>
                );
            });

            return (
                <View style={styles.container_input_row}>
                    <View style={styles.input_title_group}>
                        <Touchable onPress={!this.isHostUser ? this.onGuestChangePathWarning.bind(this) : this.onChangeBackPath.bind(this)}
                            disabled={selectType === 1}
                            style={{ flex: 1 }}>
                            <Text allowFontScaling={global.isScaleFont} style={[styles.input_title_text_path,
                            selectType === 1 ? { color: '#828282' } : { color: '#1996F1', textDecorationLine: 'underline' }]}
                                numberOfLines={1}>
                                {pathName}
                            </Text>
                        </Touchable>

                        <Text allowFontScaling={global.isScaleFont} style={styles.input_title_text_par}>Par</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.input_title_text}>Index</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.input_title_text_score}>Score</Text>
                    </View>
                    <View style={styles.input_score_group}>
                        {backScoreListView}
                    </View>
                    <View style={styles.input_total_group}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.input_title_text}>IN</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.input_title_text_par}>{parIn}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.input_title_text_hide}></Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.input_total_score}>{scoreIn}</Text>
                    </View>
                </View>
            );
        } else {
            return null;
        }
    }

    onBackScoreSelected(item, index) {
        if (this.props.onBackScoreSelected) {
            this.props.onBackScoreSelected(item, index);
        }
    }

    onGuestChangePathWarning() {
        console.log('onGuestChangePathWarning');
        if (this.props.onGuestChangePathWarning) {
            this.props.onGuestChangePathWarning();
        }
    }

    onChangeBackPath() {
        console.log('onChangeBackPath');
        if (this.props.onChangeBackPath) {
            this.props.onChangeBackPath();
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
        borderWidth: scale(0.5),
        paddingTop: verticalScale(5),
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