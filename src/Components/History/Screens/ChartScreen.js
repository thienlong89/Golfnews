import BasePureComponent from "../../../Core/View/BasePureComponent";
import React from 'react';
// import PieChartView from '../../Charts/PieChartView';
import AreaChartView from '../../Charts/AreaChartView';
import { View, Dimensions, ScrollView } from 'react-native';
import CircelChartView from "../../Charts/CircleChartView";
import { verticalScale, scale } from "../../../Config/RatioScale";
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
let { width } = Dimensions.get('window');

export default class ChartScreen extends BasePureComponent {
    constructor(props) {
        super(props);
        this.chart1Data = null;
        this.chart2Data = null;
        this.chart3Data = null;
    }

    componentDidMount(){
        this.requestChartData();
    }

    requestChartData(){
        let url = this.getConfig().getBaseUrl() + ApiService.user_chart();
        console.log('...............url chart : ',url);
        let self = this;
        Networking.httpRequestGet(url,(jsonData)=>{
            let error_code = jsonData['error_code'];
            if(error_code === 0){
                let data = jsonData['data'];
                self.chart1Data = data.hasOwnProperty('info_chart1') ? data['info_chart1'] : null;
                self.chart2Data = data.hasOwnProperty('info_chart2') ? data['info_chart2'] : null;
                self.chart3Data = data.hasOwnProperty('info_chart3') ? data['info_chart3'] : null;
                self.setFillDataChart1();
                self.setFillDataChart2();
                self.setFillDataChart3();
            }
        },()=>{

        });
    }

    /**
     * Bieu do ve so ho par,bogey,...
     */
    setFillDataChart1(){
        this.chart1.setFillData(this.chart1Data);
    }

    /**
     * Biểu đồ về các par3,par4,par5
     */
    setFillDataChart2(){
        this.chart2.setFillDataPar(this.chart2Data);
    }

    setFillDataChart3(){
        this.chart3.setFillData(this.chart3Data);
    }

    render() {
        return (
            <ScrollView>
                <View style={{ backgroundColor: 'white',flex : 1,justifyContent : 'center',paddingBottom : verticalScale(20)}}>
                    <CircelChartView ref={(chart1)=>{this.chart1 = chart1;}} marginTop={verticalScale(10)} height={verticalScale(170)} />
                    <CircelChartView ref={(chart2)=>{this.chart2 = chart2;}} marginTop={verticalScale(10)} height={verticalScale(170)} />
                    <AreaChartView ref={(chart3)=>{this.chart3 = chart3;}} marginTop={verticalScale(10)} width={width - scale(20)} height={verticalScale(300)} />
                </View>
            </ScrollView>
        );
    }
}