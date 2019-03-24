import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
// import HeaderView from '../HeaderView';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import NewsTabNavigator from './NewsTabNavigator';
import HeaderView from '../Chats/ListChats/HeaderListChat';

export default class SocialNewsView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.state = {

        }
        this.onBackPress = this.onBackPress.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    render() {
        return (
            <View style={styles.container}>
                {/* <HeaderView
                    title={''}
                    handleBackPress={this.onBackPress.bind(this)} /> */}
                <HeaderView ref={(header) => { this.header = header; }} />
                <NewsTabNavigator screenProps={{ ...this.props }} />

                {this.renderMessageBar()}
            </View>
        );
    }

    onSearch(text){

    }

    onBackPress() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
        return true;
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();
        if (this.header) {
            this.header.searchCallback = this.onSearch;
            this.header.backCallback = this.onBackPress;
        }
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    handleHardwareBackPress() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress',this.onBackPress);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
});