import React from 'react';
import { Platform, StyleSheet, Text, View, Image, BackHandler } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import { Avatar } from 'react-native-elements';
import AppUtil from '../../Config/AppUtil';
import TeeListView from './Items/TeeListView';
import FriendItemModel from '../../Model/Friends/FriendItemModel';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import UserProfile from '../../Model/Home/UserProfileModel';
import UserRoundModel from '../../Model/CreateFlight/Flight/UserRoundModel';
import Toast, { DURATION } from 'react-native-easy-toast'
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';

export default class ChangeTeeView extends BaseComponent {

    constructor(props) {
        super(props);
        this.flightName = this.props.navigation.state.params != null ? this.props.navigation.state.params.flightName : '';
        this.state = {
            player: this.props.navigation.state.params != null ? this.props.navigation.state.params.PlayerSelected : '',
            teeListAvailable: this.props.navigation.state.params != null ? this.props.navigation.state.params.teeListAvailable : '',
        }
    }

    render() {
        if (this.state.player instanceof FriendItemModel || this.state.player instanceof UserRoundModel) {
            return (
                <View style={styles.container}>
                    {this.renderLoading()}
                </View>
            )
        } else {
            let user = this.state.player;
            let hdc_tt = user.getUsgaHcIndex() >= 0 ? user.getUsgaHcIndex() : '+' + Math.abs(user.getUsgaHcIndex());
            let hdc_usga = user.getMonthlyHandicap() >= 0 ? user.getMonthlyHandicap() : '+' + Math.abs(user.getMonthlyHandicap());
            let top_ranking = user.getDisplay_ranking_type();
            let top_ranking_value = user.getRanking() > 0 ? user.getRanking() : '-';
            let system_ranking = user.getSystem_ranking() > 0 ? user.getSystem_ranking() : '-';

            return (
                <View style={styles.container}>
                    {this.renderLoading()}
                    <HeaderView title={this.flightName} handleBackPress={this.onBackPress.bind(this)} />

                    <View style={styles.player_info_view}>
                        <View style={styles.player_view}>
                            <Avatar large rounded
                                containerStyle={styles.avatar_container}
                                avatarStyle={styles.avatar_style}
                                source={user.getAvatar() ? { uri: user.getAvatar() } : this.getResources().avatar_default_larger}
                            />

                            <Text allowFontScaling={global.isScaleFont} style={styles.user_name} >{user.getFullName()}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.user_id} >{user.getUserId()}</Text>
                        </View>

                        <View style={styles.ranking_view}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.ranking_title}>{this.t('leaderboard_title')}</Text>
                            <View style={[styles.ranking_view_item, { marginTop: 5 }]}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.ranking_text}>{this.t('hdc_tt')}</Text>
                                <Text allowFontScaling={global.isScaleFont} style={styles.ranking_value}>{hdc_tt}</Text>
                            </View>
                            <View style={styles.ranking_line} />

                            <View style={styles.ranking_view_item}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.ranking_text}>HDC USGA</Text>
                                <Text allowFontScaling={global.isScaleFont} style={styles.ranking_value}>{hdc_usga}</Text>
                            </View>
                            <View style={styles.ranking_line} />

                            <View style={styles.ranking_view_item}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.ranking_text}>{top_ranking}</Text>
                                <Text allowFontScaling={global.isScaleFont} style={styles.ranking_value}>{top_ranking_value}</Text>
                            </View>
                            <View style={styles.ranking_line} />

                            <View style={[styles.ranking_view_system, { marginBottom: 5 }]}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.ranking_text}>{this.t('system_ranking_title')}</Text>
                                <Text allowFontScaling={global.isScaleFont} style={styles.ranking_system_value}>{system_ranking}</Text>
                                <Image style={styles.ranking_manner}
                                    source={AppUtil.getSourceRankingManner(user.getRanking_manners())}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.tee_title_container}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.tee_title}>{this.t('tee_box')}</Text>
                    </View>
                    {/* <TeeListView listTee={this.state.teeListAvailable}
                        teeDefault={user.getDefaultTeeID()}
                        onTeeSelected={this.onTeeSelectedListener.bind(this)} /> */}
                    <Toast
                        ref="toast"
                        position='top'
                        positionValue={200}
                        fadeInDuration={750}
                        fadeOutDuration={1000}
                        opacity={0.8}
                    />
                </View>
            );
        }
    }

    componentDidMount() {
        let self = this;
        if (this.state.player instanceof FriendItemModel) {
            this.getPlayerInfo(this.state.player.getId());
        } else if (this.state.player instanceof UserRoundModel) {
            this.getPlayerInfo(this.state.player.getUserId());
        }

        this.backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
            if (self.props.navigation != null) {
                self.props.navigation.goBack();
            }
            return true;
        });
    }

    componentWillUnmount() {
        if (this.backHandler) {
            this.backHandler.remove();
        }
    }

    getPlayerInfo(playerId) {
        this.loading.showLoading();
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.user_profile(playerId);
        this.Logger().log("url : ", url);
        Networking.httpRequestGet(url, this.onPlayerInfoResponse.bind(this), () => {
            //time out
            self.loading.hideLoading();
            self.refs.toast.show(self.t('time_out'), DURATION.LENGTH_SHORT);
        });
    }

    onPlayerInfoResponse(jsonData) {
        this.loading.hideLoading();
        this.model = new UserProfile();
        this.model.parseUserData(jsonData);
        if (this.model.getErrorCode() === 0) {
            this.setState({
                player: this.model
            })
        } else {
            this.refs.toast.show(this.model.getErrorMsg(), DURATION.LENGTH_SHORT);
        }
    }


    onBackPress() {
        if (this.props.navigation != null) {
            this.props.navigation.goBack();
        }
        return true;
    }

    onTeeSelectedListener(data, itemId) {
        this.Logger().log('onTeeSelected', data);
        this.props.navigation.state.params.onChangeTeeCallback(data);
        this.props.navigation.goBack();

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    player_info_view: {
        flexDirection: 'row',
        marginRight: scale(10)
    },
    player_view: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    avatar_container: {
        marginTop: verticalScale(10)
    },
    avatar_style: {
        borderColor: '#C8C7CC',
        borderWidth: 0.5
    },
    user_name: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: fontSize(15,scale(1)),
        marginTop: verticalScale(5)
    },
    user_id: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: fontSize(15,scale(1)),
        marginTop: verticalScale(2)
    },
    ranking_title: {
        backgroundColor: '#EFEFF4',
        borderRadius: verticalScale(5),
        color: '#919191',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: fontSize(15,scale(1)),
        paddingTop: verticalScale(3),
        paddingBottom: verticalScale(3)
    },
    ranking_view_item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: scale(20),
        marginLeft: scale(10)
    },
    ranking_text: {
        color: '#000000'
    },
    ranking_value: {
        color: '#000000',
        fontWeight: 'bold'
    },
    ranking_line: {
        backgroundColor: '#C8C7CC',
        marginRight: scale(20),
        marginLeft: scale(10),
        marginTop: verticalScale(3),
        marginBottom: verticalScale(3),
        height: 0.25
    },
    ranking_manner: {
        position: 'absolute',
        height: verticalScale(10),
        width: verticalScale(10),
        resizeMode: 'contain',
        right: scale(5)
    },
    ranking_view_system: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 0,
        marginLeft: scale(10),
        alignItems: 'center'
    },
    ranking_system_value: {
        color: '#000000',
        fontWeight: 'bold',
        marginRight: scale(20)
    },
    ranking_view: {
        flex: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: verticalScale(5),
        marginTop: verticalScale(10),
        borderColor: '#C8C7CC',
        borderWidth: 0.5
    },
    tee_title_container: {
        backgroundColor: '#F2F2F2',
        marginTop: verticalScale(10)
    },
    tee_title: {
        color: '#B8B8B8',
        marginLeft: scale(10),
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10)
    }
});