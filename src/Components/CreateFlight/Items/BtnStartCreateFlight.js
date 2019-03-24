import React from 'react';
import { Platform, StyleSheet, Text, View, Image, AsyncStorage, Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import MyView from '../../../Core/View/MyView';
// import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
// import AnimatedLinearGradient from 'react-native-animated-linear-gradient'
import Swiper from 'react-native-swiper';

import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
let { width, height } = Dimensions.get('window');


export default class BtnStartCreateFlight extends BaseComponent {

    static defaultProps = {
        userProfile: null,
        defaultIndex: 1
    }

    constructor(props) {
        super(props);
        this.isIphoneX = this.getAppUtil().isIphoneX();
        this.onViewPagerBtnChange = this.onViewPagerBtnChange.bind(this);
        this.onStartUploadFlightImage = this.onStartUploadFlightImage.bind(this);

        this.state = {
            disabledBtnStart: true,
            isEnterScore: false,
            isShowAnimation: false
        }
    }

    onChangeState(disabledBtnStart) {
        this.setState({
            disabledBtnStart: disabledBtnStart
        });
    }

    render() {
        let { defaultIndex } = this.props;
        let {
            disabledBtnStart,
            isEnterScore
        } = this.state;
        return (
            <View style={styles.container}>
                {/* nut bat dau */}
                {/* <MyView hide={userProfile === null || userProfile.getAllow_using_scorecard_image() === 1}>
                    <Touchable
                        disabled={disabledBtnStart}
                        style={[styles.touchable_btn_start,
                        {
                            backgroundColor: disabledBtnStart ? '#C9C9C9' : '#00C25D',
                            paddingBottom: this.isIphoneX ? 30 :  verticalScale(20)
                        }]}
                        onPress={this.onStartCreateFlight.bind(this, 1)}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.btn_start} >{this.t('start_upper_case')}</Text>
                    </Touchable>
                </MyView> */}

                <MyView //hide={userProfile != null && userProfile.getAllow_using_scorecard_image() != 1}
                    style={{ height: this.isIphoneX ? 90 : verticalScale(70) }}>
                    <Swiper
                        ref={(swiperBtn) => { this.swiperBtn = swiperBtn; }}
                        showsButtons={false}
                        loop={true}
                        showsPagination={false}
                        // index={isEnterScore || defaultIndex === 1 ? 1 : 0}
                        onIndexChanged={this.onViewPagerBtnChange}>

                        {/* nut chup anh */}
                        <Touchable
                            disabled={disabledBtnStart}
                            style={[styles.touchable_swipe_start,
                            {
                                backgroundColor: disabledBtnStart ? '#C9C9C9' : '#00C25D',
                                paddingBottom: this.isIphoneX ? 20 : 0
                            }]}
                            onPress={this.onStartUploadFlightImage}>
                            <View>
                                <View style={styles.upload_score_view}>
                                    <Image
                                        style={styles.icon_camera}
                                        source={this.getResources().ic_camera}
                                    />
                                    <Text allowFontScaling={global.isScaleFont} style={styles.btn_start} >{this.t('upload_scorecard')}</Text>
                                </View>
                                <Text allowFontScaling={global.isScaleFont} style={styles.swipe_left_to_typing} >{this.t('swipe_left_to_typing')}</Text>
                            </View>

                        </Touchable>

                        {/* nut nhap diem */}

                        <Touchable
                            disabled={disabledBtnStart}
                            style={[styles.touchable_swipe_start,
                            {
                                backgroundColor: disabledBtnStart ? '#C9C9C9' : '#00C25D',
                                paddingBottom: this.isIphoneX ? 20 : 0
                            }]}
                            onPress={this.onStartCreateFlight.bind(this, 1)}>
                            <View>
                                <View style={styles.upload_score_view}>
                                    <Image
                                        style={styles.icon_camera}
                                        source={this.getResources().ic_scoreboard}
                                    />
                                    <Text allowFontScaling={global.isScaleFont} style={styles.btn_start} >{this.t('enter_score_upper_case')}</Text>
                                </View>
                                <Text allowFontScaling={global.isScaleFont} style={styles.swipe_left_to_typing} >{this.t('swipe_right_to_upload')}</Text>
                            </View>
                        </Touchable>

                    </Swiper>

                </MyView>
            </View>
        );
    }

    async componentDidMount() {
        let isEnter = await AsyncStorage.getItem('@isEnterScore');
        if (!(isEnter && isEnter === 'false')) {
            this.setState({
                isEnterScore: true
            })
        }
    }

    onStartUploadFlightImage() {
        let { userProfile, requestUpgrade, onStartUploadFlightImage } = this.props;
        if (userProfile != null && userProfile.getAllow_using_scorecard_image() != 1) {
            if (requestUpgrade) {
                requestUpgrade();
            }
            this.swiperBtn.scrollBy(1);
        } else if (onStartUploadFlightImage) {
            onStartUploadFlightImage();
        }
    }

    onViewPagerBtnChange(index) {
        let { userProfile } = this.props;
        if (userProfile != null && userProfile.getAllow_using_scorecard_image() != 1 && index === 0) {
            if (this.props.requestUpgrade) {
                this.props.requestUpgrade();
            }
            this.swiperBtn.scrollBy(1);
        } else {
            if (index === 0) {
                AsyncStorage.setItem('@isEnterScore', `false`);
            } else {
                AsyncStorage.setItem('@isEnterScore', `true`);
            }
        }

    }

    onSwipeLeftToEnter(gestureState) {
        console.log('You swiped left');
        this.setState({
            isEnterScore: !this.state.isEnterScore,
            isShowAnimation: true
        }, () => {
            AsyncStorage.setItem('@isEnterScore', `${this.state.isEnterScore}`);
            setTimeout(() => {
                this.setState({
                    isShowAnimation: false
                });
            }, 1000);
        });

        if (this.props.onSwipeLeftToEnter) {
            this.props.onSwipeLeftToEnter(gestureState);
        }
    }

    onSwipeRightToUpload(gestureState) {
        console.log('You swiped right');
        this.setState({
            isEnterScore: !this.state.isEnterScore,
            isShowAnimation: true
        }, () => {
            AsyncStorage.setItem('@isEnterScore', `${this.state.isEnterScore}`);
            setTimeout(() => {
                this.setState({
                    isShowAnimation: false
                });
            }, 1000);
        });
        if (this.props.onSwipeRightToUpload) {
            this.props.onSwipeRightToUpload(gestureState);
        }
    }

    onStartCreateFlight(suggestType) {
        if (this.props.onStartCreateFlight) {
            this.props.onStartCreateFlight(suggestType);
        }
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    touchable_btn_start: {
        paddingBottom: verticalScale(20),
        paddingTop: verticalScale(20),
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn_start: {
        color: '#FFFFFF',
        fontSize: fontSize(20, scale(6)),// 20
    },
    swipe_left_to_typing: {
        fontSize: fontSize(12, -scale(2)),// 12,
        color: '#FFEF9C',
        textAlign: 'center'
    },
    touchable_swipe_start: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    upload_score_view: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    icon_camera: {
        height: verticalScale(25),
        width: scale(25),
        resizeMode: 'contain',
        marginRight: scale(15)
    },
});