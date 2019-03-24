import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
// import BaseComponent from '../../../../Core/View/BaseComponent';
import { scale, verticalScale, fontSize } from '../../../../Config/RatioScale';
import StaticProps from '../../../../Constant/PropsStatic';
import BaseComponentAddLoading from '../../../../Core/View/BaseComponentAddLoading';
import FlightDetailModel from '../../../../Model/CreateFlight/Flight/FlightDetailModel';
import ApiService from '../../../../Networking/ApiService';
import Networking from '../../../../Networking/Networking';

export default class ComAward extends BaseComponentAddLoading {
    constructor(props) {
        super(props);

        this.state = {
            bestNet: 20,
            bestGross: 30,
        }

        this.onHioAlbatrossClick = this.onHioAlbatrossClick.bind(this);
        this.onBestNetClick = this.onBestNetClick.bind(this);
        this.onBestGrossClick = this.onBestGrossClick.bind(this);

        this.puid = this.props.puid ? this.props.puid : '';
    }

    openScorecard(flightId) {
        this.showModalLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.view_flight_detail(flightId);
        console.log('url', url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.showModalLoading();
            self.model = new FlightDetailModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                let navigation = StaticProps.getAppSceneNavigator();
                navigation.navigate('scorecard_view', {
                    onCloseScorecard: self.rotateToPortrait.bind(this),
                    'FlightDetailModel': self.model
                });
            } else {
                self.popupNotify.setMsg(self.model.getErrorMsg())
            }
        }, () => {
            //time out
            self.hideModalLoading();
            // self.showErrorMsg(self.t('time_out'));
        });
    }

    onHioAlbatrossClick() {
        // let { puid } = this.props;
        let navigation = StaticProps.getAppSceneNavigator();
        navigation.navigate('player_achievement_view',
            {
                'puid': this.puid
            });
    }

    onBestNetClick() {
        let { bestNet } = this.state;
        if (bestNet) {
            this.openScorecard(bestNet.flight_id);
        }
    }

    onBestGrossClick() {
        let { bestGross } = this.state;
        if (bestGross) {
            this.openScorecard(bestGross.flight_id);
        }
    }

    /**
     * Update data va View khi user la ban be
     * @param {String|Number} puid 
     */
    updateData(puid) {
        this.puid = puid;
        this.props.isShow = true;
        let uid = this.getAppUtil().replaceUser(this.puid);
        let url = this.getConfig().getBaseUrl() + ApiService.user_chart(uid);
        console.log('.................url user award : ',url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            let error_code = jsonData['error_code'];
            if (error_code === 0) {
                let data = jsonData['data'];
                // self.chart1Data = data.hasOwnProperty('info_chart1') ? data['info_chart1'] : null;
                // self.chart2Data = data.hasOwnProperty('info_chart2') ? data['info_chart2'] : null;
                // self.chart3Data = data.hasOwnProperty('info_chart3') ? data['info_chart3'] : null;
                // self.refComChart.setChartData(self.chart1Data, self.chart2Data, self.chart3Data);

                self.setBestNetBestGross(data);
            }
        }, () => {

        });
    }

    setBestNetBestGross(data) {
        this.setState({
            bestGross: data.best_gross,
            bestNet: data.best_net
        });
    }

    render() {
        let {
            bestGross,
            bestNet
        } = this.state;
        let { isShow } = this.props;
        console.log('isShow ========== ',isShow);
        if (!isShow) return null;
        return (
            <View style={{ flexDirection: 'row', paddingTop: verticalScale(10), paddingBottom: verticalScale(10), borderColor: 'rgba(0,0,0,0.25)', borderRadius: 5, borderWidth: 1, marginLeft: scale(10), marginRight: scale(10), marginTop: verticalScale(10) }}>
                {/* <View style={{ flexDirection: 'row', margin: 10 }}> */}
                <TouchableOpacity style={{ flex: 1 }}
                    onPress={this.onBestGrossClick}>
                    <View style={styles.view_touchable}>
                        <ImageBackground style={styles.img_background}
                            imageStyle={{ resizeMode: 'contain' }}
                            source={this.getResources().ic_best_gross}>
                            <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(20, scale(6)), color: '#E8A700', fontWeight: 'bold' }}>{bestGross ? bestGross.gross : ''}</Text>
                        </ImageBackground>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_value}>{this.t('best_gross_new')}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={{ flex: 1 }}
                    onPress={this.onBestNetClick}>
                    <View style={styles.view_touchable}>
                        <ImageBackground style={styles.img_background}
                            imageStyle={{ resizeMode: 'contain' }}
                            source={this.getResources().ic_best_net}>
                            <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(20, scale(6)), color: '#1796A3', fontWeight: 'bold' }}>{bestNet ? bestNet.best_net : ''}</Text>
                        </ImageBackground>
                        <Text allowFontScaling={global.isScaleFont}  style={styles.txt_value}>{this.t('best_net_new')}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={{ flex: 1 }}
                    onPress={this.onHioAlbatrossClick}>
                    <View style={styles.view_touchable}>
                        <ImageBackground style={styles.img_background}
                            imageStyle={{ resizeMode: 'contain' }}
                            source={this.getResources().ic_hio_albatross}>
                        </ImageBackground>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_value}>{this.t('hio_albatross')}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            // </View>
        );
    }
}

const styles = StyleSheet.create({
    img_background: {
        width: verticalScale(70),
        height: verticalScale(70),
        justifyContent: 'center',
        alignItems: 'center'
    },

    view_touchable: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    txt_value: {
        fontSize: fontSize(14),
        color: '#666666',
        textAlign: 'center'
    }
});