import React from 'react';
import { Platform, StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import MyView from '../../Core/View/MyView';
import AppUtil from '../../Config/AppUtil';
import BaseComponent from '../../Core/View/BaseComponent';
import CustomAvatar from '../Common/CustomAvatar';
import Touchable from 'react-native-platform-touchable';

import { scale, verticalScale, fontSize } from '../../Config/RatioScale';

export default class FinishedFlightItem extends BaseComponent {

    constructor(props) {
        super(props);
        this.onDeleteFlightClick = this.onDeleteFlight.bind(this);
        // this.state = {
        //     teeColor: AppUtil.getColorTee(this.props.finishedFlight.getTeeId())
        // }
        this.onViewDetailClick = this.onViewDetailClick.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log('shouldComponentUpdate1', JSON.stringify(nextProps.finishedFlight))
        // console.log('shouldComponentUpdate2', JSON.stringify(this.props.finishedFlight))
        return JSON.stringify(nextProps.finishedFlight) != JSON.stringify(this.props.finishedFlight);
    }

    static defaultProps = {
        finishedFlight: {}
    }

    // renderListUser(listPlayer) {
    //     return (
    //         listPlayer.map((player) => {
    //             // console.log(".....................player : ",player);
    //             return (
    //                 <View style={styles.view_item_user}>
    //                     <CustomAvatar
    //                         height={50}
    //                         width={50}
    //                         puid={player.getUserId()}
    //                         uri={player.getAvatar()}
    //                     />
    //                     <Text allowFontScaling={global.isScaleFont}
    //                         style={styles.txt_user_name}
    //                         numberOfLines={1}>
    //                         {player.getFullName()}
    //                     </Text>
    //                 </View>
    //             )
    //         })

    //     )
    // }
    onViewDetailClick() {
        let { onViewDetailClick, finishedFlight } = this.props;
        if (onViewDetailClick && finishedFlight) {
            onViewDetailClick(finishedFlight);
        }
    }

    render() {

        let roundItem = this.props.finishedFlight;
        let flight = roundItem.getFlight();
        console.log('FinishedFlightItem.render', flight.getId())
        let gross = roundItem.getGross();
        let isImageFlight = flight.getSource() === 'image' ? true : false;
        let courseDisplay = roundItem.getCoursesHandicapDisplay();
        let teeColor = AppUtil.getColorTee(roundItem.getTeeId());
        let postStatus = roundItem.getPostStatus();
        let listPlayer = flight.getUserProfiles();
        return (
            <Touchable onPress={this.onViewDetailClick}>
                <View style={[styles.finish_flight_container, { backgroundColor: (roundItem.getType().indexOf('unfinished') >= 0) ? '#F5F5FA' : '#FFFFFF' }]} >

                    <View style={styles.view_info_container} >
                        <View style={styles.left_item} >
                            <ImageBackground style={[styles.bg_handicap, { marginTop: 3 }]}
                                imageStyle={{ resizeMode: 'contain', height: this.getRatioAspect().verticalScale(25) }}
                                source={(courseDisplay != '') ? this.getResources().ic_circle_blue : null}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.handicap_facility}>
                                    {(courseDisplay != '') ? courseDisplay : ''}
                                </Text>
                            </ImageBackground>

                            <MyView hide={!roundItem.getSelectedRoundForHandicapIndex()}
                                style={styles.view_star}>
                                <Image
                                    style={styles.item_star}
                                    source={this.getResources().ic_star}
                                />
                            </MyView>

                        </View>

                        <View style={styles.center_item}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.flight_name} numberOfLines={1}>{flight.getFlightName()}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.flight_time}>{roundItem.getDatePlayDisplay()}</Text>
                            <View style={styles.flight_status_group}>
                                <MyView hide={!isImageFlight}>
                                    <Image
                                        style={styles.icon_image}
                                        source={this.getResources().ic_picture_blue}
                                    />
                                </MyView>
                                <MyView hide={isImageFlight}>
                                    <View style={[styles.flight_tee, { backgroundColor: teeColor }]}></View>
                                </MyView>

                                <Text allowFontScaling={global.isScaleFont} style={[styles.flight_award, { color: roundItem.getTextColor() }]}>
                                    {roundItem.getTextDisplay()}
                                </Text>
                            </View>
                        </View>

                        {/* </View> */}

                        <View style={styles.right_item}>
                            <MyView hide={roundItem.getAllowDelete()} style={styles.flight_gross_over}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.flight_gross}>{roundItem.getGrossDisplay()}</Text>
                                <MyView hide={gross === 0 ? true : false}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.flight_over}>{roundItem.getOverDisplay()}</Text>
                                </MyView>
                                <Text allowFontScaling={global.isScaleFont} style={styles.flight_over}>{roundItem.getNet()}</Text>

                            </MyView>
                            <MyView hide={!roundItem.getAllowDelete()}>
                                <TouchableOpacity style={styles.touchable_flight_delete} onPress={this.onDeleteFlightClick}>
                                    <Image
                                        style={styles.flight_delete}
                                        source={this.getResources().delete}
                                    />
                                </TouchableOpacity>

                            </MyView>

                        </View>
                    </View>
                    {/* <View style={styles.view_user_list}>
                    {this.renderListUser(listPlayer)}
                </View> */}

                </View>
            </Touchable>
        );
    }

    onDeleteFlight() {
        if (this.props.onDeleteFlight) {
            this.props.onDeleteFlight(this.props.finishedFlight);
        }
    }

}

const styles = StyleSheet.create({
    finish_flight_container: {
        // flex: 1,
        paddingTop: scale(8),
        paddingBottom: scale(8)
    },
    view_info_container: {
        flexDirection: 'row',
        paddingLeft: scale(5),
        // paddingRight: scale(5),
        // paddingTop: verticalScale(10),
        // paddingBottom: verticalScale(10)
    },
    left_item: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: scale(5)
    },
    view_star: {
        marginTop: verticalScale(15)
    },
    center_item: {
        flex: 1,
        marginRight: scale(10),
        justifyContent: 'space-between'
    },
    right_item: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    item_flight_gross: {
        height: verticalScale(25),
        width: scale(25),
        color: '#00BAB6',
        fontSize: fontSize(12, -3),
        borderColor: '#00BAB6',
        borderRadius: verticalScale(12.5),
        borderWidth: scale(2),
        textAlign: 'center',
        textAlignVertical: 'center',
        marginLeft: scale(3)
    },
    item_star: {
        height: verticalScale(15),
        width: scale(15)
    },
    flight_name: {
        color: '#1A1A1A',
        marginRight: scale(10),
        fontSize: fontSize(16, scale(2))
    },
    flight_time: {
        color: '#B8B8B8',
        fontSize: fontSize(14)
    },
    flight_status_group: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flight_status: {
        color: '#FF0000',
        fontSize: fontSize(14) //14
    },
    flight_award: {
        fontSize: fontSize(14, -2),//14,
        flex: 1
    },
    flight_gross: {
        color: '#191919',
        fontSize: fontSize(23, scale(9)),// 23
    },
    flight_over: {
        color: '#9C9C9C',
        fontSize: fontSize(14),//14
    },
    flight_tee: {
        width: scale(15),
        height: verticalScale(15),
        marginRight: scale(5),
        borderColor: '#919191',
        borderWidth: 0.5
    },
    flight_gross_over: {
        minWidth: scale(35),
        alignItems: 'flex-end',
        marginRight: scale(5)
    },
    touchable_flight_delete: {
        width: verticalScale(50),
        height: verticalScale(50),
        justifyContent: 'center',
        alignItems: 'center'
    },
    flight_delete: {
        width: verticalScale(25),
        height: verticalScale(25),
        resizeMode: 'contain'
    },
    hiden_component: {
        width: 0,
        height: 0
    },
    bg_handicap: {
        width: verticalScale(25),
        height: verticalScale(25),
        justifyContent: 'center',
        alignItems: 'center'
    },
    handicap_facility: {
        color: '#00BAB6',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: fontSize(11, -scale(4))
    },
    icon_image: {
        ...Platform.select({
            ios: {
                width: verticalScale(30),
                height: verticalScale(30),
            },
            android: {
                height: verticalScale(20),
                width: verticalScale(20),
            }
        }),
        resizeMode: 'contain',
        marginRight: scale(10)
    },
    txt_user_name: {
        color: '#828282',
        fontSize: 10
    },
    view_item_user: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60
    },
    view_user_list: {
        marginLeft: 30,
        flexDirection: 'row'
    }

});
