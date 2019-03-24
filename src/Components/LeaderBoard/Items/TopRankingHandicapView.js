import React from 'react';
import { View, Text,ScrollView,StyleSheet } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import { fontSize, scale, verticalScale } from '../../../Config/RatioScale';
import Touchable from 'react-native-platform-touchable';
import TopItem from './TopItem';
import StaticProps from '../../../Constant/PropsStatic';
import Constant from '../../../Constant/Constant';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import BaseComponentAddLoading from '../../../Core/View/BaseComponentAddLoading';
import TopItemRanking from './TopItemRanking';

export default class TopRankingHandicapView extends BaseComponentAddLoading {
    constructor(props) {
        super(props);
        this.onTopClick = this.onTopClick.bind(this);
        this.data = [];
    }

    componentDidMount(){
        this.sendRequestTopRanking();
    }

    sendRequestTopRanking(){
        let url = this.getConfig().getBaseUrl() + ApiService.leaderboard_top_ranking();
        console.log('.................top ranking handicap : ',url);
        let self = this;
        this.showCustomLoading();
        Networking.httpRequestGet(url,(jsonData)=>{
            self.hideCustomLoading();
            let{error_code,data} = jsonData;
            if(error_code === 0){
                let keys = Object.keys(data);
                for(let key of keys){
                    let _value = data[key];
                    let obj = {
                        ranking_handicap_type : key,
                        value : _value
                    }
                    // _value['ranking_handicap_type'] = key;//.replace('_',' ');
                    self.data.push(obj);
                }
                self.setState({});
            }
        },()=>{
            self.hideCustomLoading();
        });
    }

    onTopClick(){
        let navigation = StaticProps.getAppSceneNavigator();
        if(navigation){
            navigation.navigate('award_view');
        }
    }

    fillData(_data){
        this.data = _data;
        this.setState({});
    }

    getElementItem(){
        let length = this.data.length;
        let element= this.data.map((d,index)=>{
            return <TopItemRanking data={d} isEnd={index === length-1 ? true : false}/>
        });
        return element;
    }

    render() {
        return (
            <View style={styles.container}>
                <Touchable onPress={this.onTopClick}>
                    <View style={styles.header}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.text}>
                            {this.t('top_ranking_hdc').toUpperCase()}
                        </Text>
                    </View>
                </Touchable>
                <ScrollView>
                    {this.getElementItem()}
                </ScrollView>
                {this.renderCustomLoading()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        borderColor: 'rgba(0,0,0,0.25)', 
        borderRadius: 5, 
        borderWidth: 1,
        marginTop : verticalScale(10),
        marginLeft : scale(10),
        marginRight : scale(10),
        marginBottom : verticalScale(10) 
    },
    header : {
        minHeight: verticalScale(40), 
        borderTopLeftRadius: 5, 
        borderTopRightRadius: 5, 
        backgroundColor: '#EAEAEA', 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    text : {
        color: '#444', 
        fontSize: fontSize(15, scale(1)), 
        fontWeight: 'bold'
    }
});