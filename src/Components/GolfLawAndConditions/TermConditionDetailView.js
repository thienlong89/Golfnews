import React from 'react';
import {View, StyleSheet, WebView } from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../Common/HeaderView';

export default class TermConditionDetailView extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            url: ''
        }
    }

    onBackClick() {
        let { navigation } = this.props;
        if (navigation) {
            navigation.goBack();
        }
        return true;
    }

    componentDidMount() {
        let { params } = this.props.navigation.state;
        this.headerView.setTitle((params && params.title) ? params.title : this.t('term_condition'));
        this.headerView.callbackBack = this.onBackClick.bind(this);
        if (params && params.url) {
            this.setState({
                url: params.url
            });
        }
    }

    showLoading(){
        if(this.internalLoading){
            this.internalLoading.showLoading();
        }
    }

    hideLoading(){
        if(this.internalLoading){
            this.internalLoading.hideLoading();
        }
    }

    onLoadStart() {
        this.showLoading();
    }

    /**
     * Webview load xong data
     */
    onLoadEnd() {
        this.hideLoading();
    }

    render() {
        return (
            <View style={styles.container}>
                {/* {this.renderLoading()} */}
                <HeaderView ref={(headerView) => { this.headerView = headerView; }} />
                <View style={{ flex: 1 }}>
                    <WebView
                        source={{ uri: this.state.url }}
                        onLoadStart={this.onLoadStart.bind(this)}
                        onLoadEnd={this.onLoadEnd.bind(this)}
                        style={styles.webview}
                    />
                    {this.renderInternalLoading()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

    webview: {
        margin: 10,
        backgroundColor: '#fff'
    }
});