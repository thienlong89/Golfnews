import React from 'react';
import {
    StyleSheet,
    View,
    WebView,
    BackHandler
} from 'react-native';
// import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../Common/HeaderView';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import NewsModel from '../../Model/News/NewsModel';

export default class NewsDetailView extends BaseComponent {
    constructor(props) {
        super(props);
        this.id = '';
        this.state = {
            content: ''
        }

        this.onLoadStart = this.onLoadStart.bind(this);
        this.onLoadEnd = this.onLoadEnd.bind(this);
        this.onBackClick = this.onBackClick.bind(this);
        this.backHandler = null;

        let { id, title, data, type } = this.props.navigation.state.params;
        this.id = id;
        this.data = data;
        this.type = type;
    }

    onBackClick() {
        let { navigation } = this.props;
        if (navigation) {
            navigation.goBack();
        }
        return true;
    }

    sendRequestDetail() {
        let self = this;
        this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.news_detail(this.id);
        Networking.httpRequestGet(url, (jsonData) => {
            //console.log('detail ',jsonData);
            self.model = new NewsModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                self.setState({
                    content: self.model.data.content
                });
            }
            self.internalLoading.hideLoading();
        }, () => {
            self.internalLoading.hideLoading();
            self.popupTimeOut.showPopup();
        })
    }

    componentDidMount() {
        let { id, title, data, type } = this.props.navigation.state.params;
        this.id = id;
        this.data = data;
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBackClick);
        if (this.headerView) {
            this.headerView.setTitle(title);
            this.headerView.callbackBack = this.onBackClick;
        }
        if (type !== 'Advertisement') {
            this.sendRequestDetail();
        }
    }

    componentWillUnmount() {
        if (this.backHandler) this.backHandler.remove();
    }

    onLoadStart() {
        this.internalLoading.showLoading();
    }

    onLoadEnd() {
        this.internalLoading.hideLoading();
    }

    getElementAdvertisement() {
        return (
            <View style={styles.container}>
                <HeaderView ref={(headerView) => { this.headerView = headerView; }} />
                <View style={{ flex: 1 }}>
                    <WebView source={{ uri: this.data.url, baseUrl: '' }}
                        onLoadStart={this.onLoadStart}
                        onLoadEnd={this.onLoadEnd}
                        startInLoadingState={true}
                        style={styles.container}
                    />
                    {this.renderInternalLoading()}
                </View>
            </View>
        );
    }

    getElementNews() {
        let { content } = this.state;
        return (
            <View style={styles.container}>
                <HeaderView ref={(headerView) => { this.headerView = headerView; }} />
                <View style={{ flex: 1 }}>
                    <WebView source={{ html: content, baseUrl: '' }}
                        onLoadStart={this.onLoadStart}
                        onLoadEnd={this.onLoadEnd}
                        startInLoadingState={true}
                        style={styles.container}
                    />
                    {this.renderInternalLoading()}
                </View>
            </View>
        );
    }

    render() {
        if(this.type === 'Advertisement'){
            return this.getElementAdvertisement();
        }else{
            return this.getElementNews();
        }
        // let { content } = this.state;
        // return (
        //     <View style={styles.container}>
        //         <HeaderView ref={(headerView) => { this.headerView = headerView; }} />
        //         <View style={{ flex: 1 }}>
        //             <WebView source={{ html: content, baseUrl: '' }}
        //                 onLoadStart={this.onLoadStart}
        //                 onLoadEnd={this.onLoadEnd}
        //                 startInLoadingState={true}
        //                 style={styles.container}
        //             />
        //             {this.renderInternalLoading()}
        //         </View>
        //     </View>
        // );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
})