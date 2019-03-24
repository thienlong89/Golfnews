import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler,
    SectionList
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import PlayerAchievementModel from '../../Model/PlayerInfo/PlayerAchievementModel';
import FlightItemView from './Items/FlightItemView';
import FlightDetailModel from '../../Model/CreateFlight/Flight/FlightDetailModel';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';

export default class PlayerAchievementView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.onBackPress = this.onBackPress.bind(this);
        this.puid = this.props.navigation.state.params.puid;
        this.state = {
            hioList: [],
            albatrossList: [],
            eagleList: []
        }
        this.renderItemView = this.renderItemView.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
        this.onCloseScorecard = this.onCloseScorecard.bind(this);
    }

    renderSectionHeader(title) {
        return (
            <View style={styles.view_header}>
                <View style={styles.line_vertical} />
                <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{title}</Text>
            </View>
        )
    }

    renderItemView({ item, index, section }) {
        if (item)
            return (
                <FlightItemView
                    flight={item}
                    onItemClick={this.onItemClick} />
            )
        else
            return (
                <Text allowFontScaling={global.isScaleFont} style={styles.txt_notify}>{this.t('have_not_yet_flight').format(section.title)}</Text>
            )
    }

    render() {

        let {
            hioList,
            albatrossList,
            eagleList
        } = this.state;
        console.log('................debug : ',hioList,albatrossList,eagleList);
        return (
            <View style={styles.container}>
                <HeaderView
                    title={this.t('player_achievement')}
                    handleBackPress={this.onBackPress} />

                <View style={{ flex: 1 }}>
                    <SectionList
                        renderItem={this.renderItemView}
                        renderSectionHeader={({ section: { title } }) => this.renderSectionHeader(title)}
                        ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                        sections={[
                            { title: this.t('hole_in_one'), data: hioList },
                            { title: this.t('albatross'), data: albatrossList },
                            { title: this.t('eagle'), data: eagleList },
                        ]}
                        keyExtractor={(item, index) => item + index}
                        // stickySectionHeadersEnabled={true}
                    />
                    {this.renderInternalLoading()}
                </View>
                {this.renderLoading()}
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
        this.getAchievement();
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

    getAchievement() {
        this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.get_achievement(this.getAppUtil().replaceUser(this.puid));
        console.log('url', url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.internalLoading.hideLoading();
            self.model = new PlayerAchievementModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                let hioList = self.model.getHIOList();
                let albatrossList = self.model.getAlbatrossList();
                let eagleList = self.model.getEagleList();
                console.log('.................... check : ',hioList,albatrossList,eagleList);
                this.setState({
                    // hioList: !hioList.length ? hioList : [],
                    // albatrossList: !albatrossList.length ? albatrossList : [],
                    // eagleList: !eagleList.length ? eagleList : []
                    hioList:  hioList,
                    albatrossList: albatrossList,
                    eagleList: eagleList
                })
            } else {
                self.showErrorMsg(self.model.getErrorMsg());
                self.internalLoading.hideLoading();
            }
        }, () => {
            self.showErrorMsg(self.t('time_out'))
            self.internalLoading.hideLoading();
        });
    }

    onItemClick(roundItem) {
        if (roundItem) {
            let flight = roundItem.getFlight();
            if (flight) {
                this.openScorecard(flight.getId())
            }
        }
    }

    openScorecard(flightId) {
        this.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.view_flight_detail(flightId);
        console.log('url', url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.hideLoading();
            self.model = new FlightDetailModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                self.props.navigation.navigate('scorecard_view', {
                    onCloseScorecard: self.onCloseScorecard,
                    'FlightDetailModel': self.model
                });
            } else {
                self.popupNotify.setMsg(self.model.getErrorMsg())
            }
        }, () => {
            //time out
            self.hideLoading();
            // self.showErrorMsg(self.t('time_out'));
        });
    }

    onCloseScorecard() {
        this.rotateToPortrait();
    }

    showLoading() {
        if (this.loading) {
            this.loading.showLoading();
        }
    }

    hideLoading() {
        if (this.loading) {
            this.loading.hideLoading();
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column'
    },
    view_header: {
    },
    separator_view: {
        height: scale(0.7),
        backgroundColor: '#D6D4D4'
    },
    txt_title: {
        color: 'black',
        fontSize: fontSize(18),
        fontWeight: 'bold',
        marginLeft: scale(10),
        marginTop: scale(10),
        marginBottom: scale(10)
    },
    line_vertical: {
        height: 5,
        backgroundColor: '#DADADA',
    },
    txt_notify: {
        color: '#1A1A1A',
        fontSize: fontSize(15),
        margin: scale(10)
    }
});