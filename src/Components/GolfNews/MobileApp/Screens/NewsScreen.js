import React from 'react';
import { View, BackHandler, Dimensions } from 'react-native';
import BaseScreen from './BaseScreen';
import ApiService from '../../../../Networking/ApiService';
import Networking from '../../../../Networking/Networking';
import PropStatic from '../../../../Constant/PropsStatic';
// import Config from '../../../../Config/Config';
// import { TabNavigator, TabBarBottom, TabBarTop, SafeAreaView, createBottomTabNavigator, createTabNavigator } from 'react-navigation';//TabBarBottom
// import CategoryBaseScreen from './News/CategoryBaseScreen';
// import { Tab } from 'native-base';

export default class NewsScreen extends BaseScreen {
    constructor(props) {
        super(props);
        this.data = [];
    }

    componentDidMount() {
        if (this.header) {
            this.header.setHeader('Tin tức');
        }
        this.rotateToPortrait();
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBackClick.bind(this));

        // console.log('.............. tab navigator : ', this.tab);
        this.requestCategoryNews();
    }

    componentWillUnmount() {
        if (this.backHandler) this.backHandler.remove();
    }

    requestCategoryNews() {
        let url = this.getConfig().BASE_URL + ApiService.news_category_all();
        console.log('............... news category : ', url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('............ data : ', jsonData);
            let { data, status } = jsonData;
            if (!data || !status) return;
            let { code } = status;
            if (parseInt(code) === 200) {
                // self.createCategory(data);
                self.data = data;
                self.setState({});
            }
        });
    }

    onBackClick() {
        let infoApp = PropStatic.getComponentInfoApp();
        if(infoApp && infoApp.isShowed()){
            infoApp.hideChild();
            return true;
        }

        let popup = PropStatic.getDialogApp();
        if(popup && popup.isShowed()){
            popup.hide();
            return true;
        }

        let { navigation } = this.props;
        if (navigation) {
            navigation.goBack();
        }
        return true;
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.renderHeader()}
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    {this.createCategory()}
                </View>
                {/* {this.renderAppInfo()} */}
            </View>
        )
    }
}