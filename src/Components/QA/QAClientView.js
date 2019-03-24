import React, { Component } from "react";
import { 
    Platform, 
    Text, 
    View, 
    StyleSheet, 
    WebView,
    BackHandler } from 'react-native';
import BaseComponent from "../../Core/View/BaseComponent";
import HeaderView from '../Common/HeaderView';

export default class QAClientView extends BaseComponent {
    constructor(props) {
        super(props);

        this.onBackClick = this.onBackClick.bind(this);
    }

    onLoadStart() {
        this.internalLoading.showLoading();
    }

    onLoadEnd() {
        this.internalLoading.hideLoading();
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.handleHardwareBackPress();
        this.headerView.setTitle(this.t('q_a'));
        this.headerView.callbackBack = this.onBackClick;
    }
	
	componentWillUnmount() {
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    handleHardwareBackPress() {
        let self = this;
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
            self.onBackClick();
            return true;
        });
    }

    onBackClick() {
        if (this.props.navigation)
        this.props.navigation.goBack();
        return true;
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <HeaderView ref={(headerView) => { this.headerView = headerView; }} />
                {/* {this.renderLoading()} */}
                <View style={{flex : 1}}>
                    <WebView
                        style={{ flex: 1 }}
                        url={this.getUserInfo().getQA()}
                        onLoadStart={this.onLoadStart.bind(this)}
                        onLoadEnd={this.onLoadEnd.bind(this)}
                    />
                    {this.renderInternalLoading()}
                </View>
            </View>
        );
    }
}