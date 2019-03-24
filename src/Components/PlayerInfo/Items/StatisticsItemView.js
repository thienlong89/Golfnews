import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BasePureComponent from '../../../Core/View/BasePureComponent';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import PieChartView from '../../Charts/PieChartView';
import CircelChartView from '../../Charts/CircleChartView';
import AreaChartView from '../../Charts/AreaChartView';
let { width, height } = Dimensions.get('window');
import { verticalScale, fontSize, scale } from '../../../Config/RatioScale';
import FlightDetailModel from '../../../Model/CreateFlight/Flight/FlightDetailModel';
import PopupNotify from '../../Popups/PopupNotificationView';

export default class StatisticsItemView extends BasePureComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);

        this.state = {
            bestGross: {},
            bestNet: {}
        }

        this.onBestGrossClick = this.onBestGrossClick.bind(this);
        this.onBestNetClick = this.onBestNetClick.bind(this);
        this.onHioAlbatrossClick = this.onHioAlbatrossClick.bind(this);
        this.onCloseScorecard = this.onCloseScorecard.bind(this);
    }

    render() {
        let {
            bestGross,
            bestNet
        } = this.state;

        return (
            <View style={styles.container}>
                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: verticalScale(10), paddingBottom: verticalScale(10) }}> */}
                    {/* <PieChartView
                        height={90}
                    /> */}
                     <CircelChartView ref={(chart1View)=>{this.chart1View = chart1View;}}
                        height={verticalScale(100)}
                        marginTop={verticalScale(10)}
                    />

                    <CircelChartView ref={(chart2View)=>{this.chart2View = chart2View;}}
                        marginTop={verticalScale(10)}
                        height={verticalScale(100)}
                    />
                {/* </View> */}
                <AreaChartView
                    height={120}
                    width={width-20}
                    marginLeft={10}
                    marginTop={verticalScale(10)}
                />
                <View style={styles.line_vertical} />
                <View style={{ flexDirection: 'row', margin: 10 }}>
                    <TouchableOpacity style={{ flex: 1 }}
                        onPress={this.onBestGrossClick}>
                        <View style={styles.view_touchable}>
                            <ImageBackground style={styles.img_background}
                                imageStyle={{ resizeMode: 'contain' }}
                                source={this.getResources().ic_best_gross}>
                                <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(20,scale(6)), color: '#E8A700', fontWeight: 'bold' }}>{bestGross ? bestGross.gross : ''}</Text>
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
                                <Text allowFontScaling={global.isScaleFont} style={{ fontSize: 20, color: '#1796A3', fontWeight: 'bold' }}>{bestNet ? bestNet.best_net : ''}</Text>
                            </ImageBackground>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_value}>{this.t('best_net_new')}</Text>
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

                <PopupNotify ref={(popupNotify) => { this.popupNotify = popupNotify; }} />
                {this.renderLoading()}
            </View>
        );
    }


    componentDidMount() {
        this.getStatistics();
    }

    getStatistics() {
        let url = this.getConfig().getBaseUrl() + ApiService.user_chart();
        console.log('...............url chart : ', url);
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            let error_code = jsonData['error_code'];
            if (error_code === 0) {
                let data = jsonData['data'];
                self.chart1Data = data.hasOwnProperty('info_chart1') ? data['info_chart1'] : null;
                self.chart2Data = data.hasOwnProperty('info_chart2') ? data['info_chart2'] : null;
                this.setState({
                    bestGross: data.best_gross,
                    bestNet: data.best_net
                },()=>{
                    self.chart1View.setFillData(self.chart1Data);
                    self.chart2View.setFillDataPar(self.chart2Data);
                });
            }
        }, () => {

        });
    }

    onBestGrossClick() {
        let { bestGross } = this.state;
        if (bestGross) {
            this.openScorecard(bestGross.flight_id);
        }
    }

    onBestNetClick() {
        let { bestNet } = this.state;
        if (bestNet) {
            this.openScorecard(bestNet.flight_id);
        }
    }

    onHioAlbatrossClick() {
        let { puid } = this.props;
        this.props.navigation.navigate('player_achievement_view',
            {
                'puid': puid
            });
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
    },
    line_vertical: {
        height: 5,
        backgroundColor: '#DADADA',
        width: width
    },
    img_background: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_touchable: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt_value: {
        fontSize: 13,
        color: '#666666',
        textAlign: 'center'
    }
});