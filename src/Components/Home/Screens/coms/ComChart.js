import React from 'react';
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import BaseComponent from '../../../../Core/View/BaseComponent';
import { fontSize, scale, verticalScale } from '../../../../Config/RatioScale';
import CircelChartView from '../../../Charts/CircleChartView';
import AreaChartView from '../../../Charts/AreaChartView';
// import ApiService from '../../../../Networking/ApiService';
// import Networking from '../../../../Networking/Networking';

let { width } = Dimensions.get('window');
let view_width = width - scale(40);

export default class ComChart extends BaseComponent {
    constructor(props) {
        super(props);
    }

    /**
     * Set dữ liệu cho biểu đồ
     * @param {Object} data1 dữ liệu biểu đồ 1
     * @param {Object} data2 dữ liệu biểu đồ 2
     * @param {Object} data3 dữ liệu biểu đồ 3
     */
    setChartData(data1,data2,data3=null){
        this.chart1View.setFillData(data1);
        this.chart2View.setFillDataPar(data2);
        this.chart3View.setFillData(data3);
    }

    render() {
        return (
            <View style={styles.container}>
                {/* <Image style={styles.img}
                        source={this.getResources().history_flight}
                />
                <Text allowFontScaling={global.isScaleFont} style={styles.txt}>{this.t('flight_history')}</Text> */}
                <CircelChartView ref={(chart1View) => { this.chart1View = chart1View; }}
                    height={verticalScale(100)}
                    marginTop={verticalScale(10)}
                />

                <CircelChartView ref={(chart2View) => { this.chart2View = chart2View; }}
                    marginTop={verticalScale(10)}
                    height={verticalScale(100)} />

                <AreaChartView
                    ref={(chart3View)=>{this.chart3View = chart3View;}}
                    height={300}
                    width={width - 30}
                    // marginLeft={20}
                    marginTop={verticalScale(10)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // height: verticalScale(50),
        // width: view_width,
        borderColor: 'rgba(0,0,0,0.25)',
        borderRadius: 5,
        borderWidth: 1,
        marginLeft: scale(10),
        marginRight: scale(10),
        marginTop: verticalScale(10),
        // paddingLeft : scale(15),
        // paddingRight : scale(15),
        // flexDirection: 'row',
        alignItems: 'center',
        // just
    },
    img: {
        height: verticalScale(30),
        width: verticalScale(30),
        marginLeft: scale(40),
        tintColor: '#282828'
    },
    txt: {
        fontSize: fontSize(16, scale(2)),
        color: '#505050',
        marginLeft: scale(20),
    }
});