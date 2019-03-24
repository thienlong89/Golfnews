import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler,
    WebView
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import { scale, verticalScale, moderateScale, fontSize } from '../../Config/RatioScale';
import TournamentModel from '../../Model/Events/TournamentModel';

export default class ShowWebViewContent extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        let { title, content, tournamentId } = this.props.navigation.state.params;
        this.title = title;
        this.tournamentId = tournamentId;
        this.state = {
            htmlContent: ''
        }

        this.onBackPress = this.onBackPress.bind(this);
        this.onLoadStart = this.onLoadStart.bind(this);
        this.onLoadEnd = this.onLoadEnd.bind(this);
    }

    onLoadStart() {
        this.internalLoading.showLoading();
    }

    onLoadEnd() {
        this.internalLoading.hideLoading();
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderView
                    title={this.title}
                    handleBackPress={this.onBackPress} />
                <View style={{ flex: 1 }}>
                    <WebView source={{ html: this.state.htmlContent, baseUrl: '' }}
                        onLoadStart={this.onLoadStart}
                        onLoadEnd={this.onLoadEnd}
                        startInLoadingState={true}
                        style={styles.container}
                    />
                    {this.renderInternalLoading()}
                </View>
                {this.renderMessageBar()}
            </View>
        );
    }

    onBackPress() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();

        this.requestGetEventInfo()

    }

    componentWillUnmount() {
        this.unregisterMessageBar();
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    handleHardwareBackPress() {
        let self = this;
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
            self.onBackPress();
            return true;
        });
    }

    requestGetEventInfo() {
        let self = this;
        this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.tournament_view_details(this.tournamentId);
        console.log("url = ", url);
        Networking.httpRequestGet(url, this.onTournamentInfoResponse.bind(this),
            () => {
                if (self.internalLoading)
                    self.internalLoading.hideLoading();
            });
    }

    onTournamentInfoResponse(jsonData) {
        if (this.internalLoading)
        this.internalLoading.hideLoading();
        this.model = new TournamentModel();
        this.model.parseData(jsonData.data);
        if (jsonData.error_code === 0) {
            this.setState({
                htmlContent: jsonData.data.rules_tour
            });
        } else {
            this.showErrorMsg(jsonData.error_msg);
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column'
    },
});