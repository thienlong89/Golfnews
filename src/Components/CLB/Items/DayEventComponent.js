import React, { PureComponent } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Utils from '../../../Utils'

export default class DayEventComponent extends PureComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);

    }

    renderDot(date, marking) {
        if (marking.marked) {
            return <View style={styles.view_dot} />
        } else {
            return null;
        }
    }

    render() {
        let { date, state, marking } = this.props;
        
        let lunarDate = Utils.convertSolarToLunar(date.day - 1, date.month, date.year);
        let lunarDay = lunarDate[0] || '';
        let lunarMonth = lunarDate[1] || '';
        let day = date.thu;
        return (
            <View style={[styles.container, { backgroundColor: state === 'today' ? '#00BAB6' : '#fff' }]}>

                <View style={styles.view_solar}>
                    <Text allowFontScaling={global.isScaleFont} style={[styles.txt_day_solar, { color: day===0||day===6? '#FF0000' : state === 'disabled' ? 'gray' : state === 'today' ? 'white' : 'black' }]}>
                        {date.day}
                    </Text>
                    {this.renderDot(date, marking)}
                </View>

                <Text allowFontScaling={global.isScaleFont} style={[styles.txt_day_lunar, { color: lunarDay === 1 ? '#FF0000' : state === 'today' ? 'white' : '#777777' }]}>
                    {lunarDay === 1 ? `${lunarDay}/${lunarMonth}` : lunarDay}
                </Text>

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#E5ECED',
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5
    },
    view_solar: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    txt_day_solar: {
        textAlign: 'center',
        marginBottom: 4,
        fontWeight: 'bold',
        fontSize: 17,
    },
    view_dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#F60000',
        marginTop: 4
    },
    txt_day_lunar: {
        fontSize: 13
    }
});