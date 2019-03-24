import React from 'react';
import { View, Text,ScrollView } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import { fontSize, scale, verticalScale } from '../../../Config/RatioScale';
import Touchable from 'react-native-platform-touchable';
import TopItem from './TopItem';
import StaticProps from '../../../Constant/PropsStatic';
import Constant from '../../../Constant/Constant';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import BaseComponentAddLoading from '../../../Core/View/BaseComponentAddLoading';

export default class TopUSGAIndexView extends BaseComponentAddLoading {
    constructor(props) {
        super(props);
        this.onTopClick = this.onTopClick.bind(this);
        this.data = [];
    }

    componentDidMount(){
        this.sendRequestTopUSGAIndex();
    }

    sendRequestTopUSGAIndex(){
        let url = this.getConfig().getBaseUrl() + ApiService.leaderboard_top_usga_index();
        console.log('............................. url : ',url);
        let self = this;
        this.showCustomLoading();
        Networking.httpRequestGet(url,(jsonData)=>{
            self.hideCustomLoading();
            if(jsonData.hasOwnProperty('error_code')){
                let {error_code,data} = jsonData;
                if(error_code === 0){
                    data.forEach(element => {
                        element.type_top = 0;
                    });
                    self.data = [...data];

                    // console.log('................. data : ',self.data);
                    self.setState({});
                }
            }
        },()=>{
            self.hideCustomLoading();
        });
    }

    onTopClick(){
        let navigation = StaticProps.getAppSceneNavigator();
        if(navigation){
            navigation.navigate('leaderboard');
        }
    }

    fillData(_data){
        this.data = _data;
        this.setState({});
    }

    getElementItem(){
        // console.log('..................this.data : ',this.data);
        if(!this.data) return null;
        let length = this.data.length;
        let element = this.data.map((d,index)=>{
            return <TopItem data={d} isEnd={index === length-1 ? true : false}/>
        });
        return element;
    }

    render() {
        return (
            <View style={{ borderColor: 'rgba(0,0,0,0.25)', borderRadius: 5, borderWidth: 1,marginTop : verticalScale(10),marginLeft : scale(10),marginRight : scale(10) }}>
                <Touchable onPress={this.onTopClick}>
                    <View style={{ minHeight: verticalScale(40), borderTopLeftRadius: 5, borderTopRightRadius: 5, backgroundColor: '#EAEAEA', justifyContent: 'center', alignItems: 'center' }}>
                        <Text allowFontScaling={global.isScaleFont} style={{ color: '#444', fontSize: fontSize(15, scale(1)), fontWeight: 'bold' }}>
                            {this.t('top_usga_index').toUpperCase()}
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