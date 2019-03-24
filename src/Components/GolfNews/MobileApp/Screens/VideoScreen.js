import React from 'react';
import BaseScreen from "./BaseScreen";
import { View, BackHandler } from 'react-native';
import ApiService from '../../../../Networking/ApiService';
import Networking from '../../../../Networking/Networking';
import PropStatic from '../../../../Constant/PropsStatic';

export default class VideoScreen extends BaseScreen {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.header) {
            this.header.setHeader('Video');
        }
        this.rotateToPortrait();
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBackClick.bind(this));
        this.requestCategoryNews();
    }

    requestCategoryNews() {
        let url = this.getConfig().BASE_URL + ApiService.video_menu();
        console.log('............... video category : ', url);
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

    componentWillUnmount() {
        if (this.backHandler) this.backHandler.remove();
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
                    {this.createCategoryVideo()}
                </View>
            </View>
        )
    }
}