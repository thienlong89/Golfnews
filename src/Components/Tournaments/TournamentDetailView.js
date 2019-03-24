import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import { scale, verticalScale, moderateScale, fontSize } from '../../Config/RatioScale';
import ImageFlightItemFull from '../Social/Item/ImageFlightItemFull';
import TournamentInfoView from './Items/TournamentInfoView';
import PopupNotifyView from '../Common/PopupNotifyView';
import PopupYesOrNo from '../Common/PopupYesOrNo';

export default class TournamentDetailView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);

        this.isIphoneX = this.getAppUtil().isIphoneX();
        let { tournamentModel } = this.props.navigation.state.params;
        this.tournamentModel = tournamentModel;
        this.ruleTour = '';
        this.state = {
            isParticipate: tournamentModel.is_accepted || 0
        }

        this.onBackPress = this.onBackPress.bind(this);
        this.onParticipateTournamentPress = this.onParticipateTournamentPress.bind(this);
        this.onPopupJoinConfirm = this.onPopupJoinConfirm.bind(this);
        this.onViewTournamentRule = this.onViewTournamentRule.bind(this);
        this.ruleTourCallback = this.ruleTourCallback.bind(this);
    }

    renderPoster(posterUrl) {
        if (posterUrl) {
            return (
                <ImageFlightItemFull
                    uri={posterUrl} />
            )
        } else {
            return null;
        }
    }

    renderContent() {
        if (this.tournamentModel) {
            let {
                img_poster
            } = this.tournamentModel;

            return (
                <View>
                    {this.renderPoster(img_poster)}
                </View>
            )
        } else {
            return null;
        }
    }

    renderParticipateBtn(isParticipate) {
        if (isParticipate != 1) {
            return (
                <TouchableOpacity style={[styles.touchable_regulations, { backgroundColor: '#00ABA7' }]}
                    onPress={this.onParticipateTournamentPress}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_join}>{this.t('event_tham_gia').toLocaleUpperCase()}</Text>
                </TouchableOpacity>
            )
        } else {
            return null;
        }
    }

    render() {
        let {
            isParticipate
        } = this.state;
        return (
            <View style={[styles.container, this.isIphoneX? {paddingBottom: 15} : {}]}>
                <HeaderView
                    title={this.t('tournament_info')}
                    handleBackPress={this.onBackPress} />
                <ScrollView style={{ flex: 1, marginBottom: scale(10) }}>
                    {this.renderContent()}
                    <TournamentInfoView
                        tournamentId={this.tournamentModel.id}
                        ruleTourCallback={this.ruleTourCallback} />
                    <View style={styles.big_line} />

                    <TouchableOpacity style={styles.touchable_regulations}
                        onPress={this.onViewTournamentRule}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_regulations}>{this.t('regulations').toLocaleUpperCase()}</Text>
                    </TouchableOpacity>

                    {this.renderParticipateBtn(isParticipate)}
                    {this.renderInternalLoading()}
                </ScrollView>

                <PopupYesOrNo
                    ref={(refPopupYesOrNo) => { this.refPopupYesOrNo = refPopupYesOrNo; }}
                    content={this.t('participate_tournament_confirm')}
                    confirmText={this.t('agree')}
                    cancelText={this.t('cancel')}
                    onConfirmClick={this.onPopupJoinConfirm} />

                <PopupNotifyView
                    ref={(popupNotify) => { this.popupNotify = popupNotify; }}
                    content={this.t('participate_tournament_success')}
                    confirmText={this.t('ok')}
                // onConfirmClick={this.onPopupNotifyConfirm} 
                />

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

    onPopupJoinConfirm() {
        this.requestParticipateTournament();
    }

    ruleTourCallback(ruleTour) {
        this.ruleTour = ruleTour;
    }

    onViewTournamentRule() {
        if (this.props.navigation) {
            this.props.navigation.navigate("show_web_view_content", {
                title: this.t('regulations'),
                tournamentId: this.tournamentModel.id,
                content: this.ruleTour
            })
        }
    }

    onParticipateTournamentPress() {
        this.refPopupYesOrNo.show();
    }

    requestParticipateTournament() {
        let self = this;
        this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.tournament_participate(this.tournamentModel.id)
        console.log("url = ", url);
        Networking.httpRequestGet(url, (jsonData) => {
            self.internalLoading.hideLoading();
            if (jsonData.error_code === 0) {
                self.setState({
                    isParticipate: 1
                }, () => {
                    self.popupNotify.show();
                    if (self.props.navigation.state.params.tournamentCallback) {
                        self.props.navigation.state.params.tournamentCallback();
                    }
                })
            } else {
                self.showErrorMsg(jsonData.error_msg);
            }
        }, () => {
            self.internalLoading.hideLoading();
            self.showErrorMsg(self.t('time_out'));

        });
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column'
    },
    image_score: {
        resizeMode: 'contain'
    },
    big_line: {
        height: scale(5),
        backgroundColor: '#D0D0D0'
    },
    touchable_regulations: {
        minHeight: scale(45),
        borderWidth: 1,
        borderColor: '#00ABA7',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: scale(5),
        marginTop: scale(15),
        marginLeft: scale(15),
        marginRight: scale(15),
    },
    txt_regulations: {
        fontSize: fontSize(14),
        color: '#00ABA7'
    },
    txt_join: {
        fontSize: fontSize(14),
        color: '#fff'
    }
});