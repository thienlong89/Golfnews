import React from 'react';
import { Platform, StyleSheet, Text, View, ImageBackground, ListView,Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import FriendFlightItem from '../Home/FriendFlightItem';
import PopupYesOrNo from '../Common/PopupYesOrNo';
import {scale, verticalScale, fontSize} from '../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

export default class FLightSuggestedView extends BaseComponent {

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.FlightSuggestedList = this.props.navigation.state.params != null ? this.props.navigation.state.params.FLightSuggested : [];
        this.date = this.props.navigation.state.params != null ? this.props.navigation.state.params.Date : '';
        this.flightSelected;
        this.state = {
            dataSource: ds.cloneWithRows(this.FlightSuggestedList),
            popupContent: ''
        }
    }

    render() {

        return (
            <View style={styles.container}>
                <HeaderView title={this.t('suggest_flight')} handleBackPress={this.onBackPress.bind(this)} />
                <ImageBackground style={styles.title_container}
                    imageStyle={{ resizeMode: 'contain' }}
                    source={this.getResources().ic_rectangle_dashed}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.title_txt}>{this.date}</Text>
                </ImageBackground>
                <View style={styles.view_relate_flight_title}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_relate_flight_title}>{this.t('relate_flights')}</Text>
                </View>

                <ListView
                    renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    keyboardShouldPersistTaps='always'
                    renderRow={(rowData, itemId) =>
                        <View >
                            <Touchable onPress={this.onItemFlightClick.bind(this, rowData)}>

                                <View style={styles.item_friend_flight_container}>
                                    <View style={styles.item_friend_flight}>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.flight_name} numberOfLines={1}>{rowData.getFlightName()}</Text>
                                        <Text allowFontScaling={global.isScaleFont} style={styles.flight_time} numberOfLines={1}>{this.getUtils().getFormatAgoTime(rowData.getDatePlayedTimestamp())}</Text>
                                    </View>
                                    <FriendFlightItem friend_flight={rowData} />

                                    <Text allowFontScaling={global.isScaleFont} style={styles.player_created_flight_title}>
                                        {this.t('player_created_flight')}
                                        <Text allowFontScaling={global.isScaleFont} style={styles.player_created_flight}>{this.getPlayerCreated(rowData)}</Text>
                                    </Text>
                                </View>
                            </Touchable>
                        </View>
                    }
                />
                <Touchable style={styles.touchable_skip}
                    onPress={this.onItemFlightClick.bind(this, null)}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_skip}>{this.t('skip_upper_case')}</Text>
                </Touchable>

                <PopupYesOrNo
                    ref={(popupConfirmMerge) => { this.popupConfirmMerge = popupConfirmMerge; }}
                    content={this.state.popupContent}
                    confirmText={this.t('agree')}
                    cancelText={this.t('cancel')}
                    onConfirmClick={this.onConfirmMergeFlight.bind(this)} />
            </View>
        );
    }

    onBackPress() {
        if (this.props.navigation != null) {
            this.props.navigation.goBack();
        }
        return true;
    }

    getPlayerCreated(flightItem) {
        let player = flightItem.getUserRounds().find((userRound) => {
            return userRound.getSttUser() === 1;
        });
        return player ? `${player.getUser().getFullName()} - ${player.getUser().getUserId()}` : '';
    }

    onItemFlightClick(flightDetail) {
        if(flightDetail){
            this.flightSelected = flightDetail;
            this.popupConfirmMerge.setContent(this.t('merge_flight_confirm').format(flightDetail.getFlightName()));
        } else {
            this.onConfirmMergeFlight();
        }

    }

    onConfirmMergeFlight() {
        if (this.props.navigation.state.params.onFLightSuggestSelected) {
            this.props.navigation.state.params.onFLightSuggestSelected(this.flightSelected);
        }
        this.props.navigation.goBack();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    title_container: {
        margin: scale(10),
        minHeight: verticalScale(50),
        padding: scale(7)
    },
    title_txt: {
        color: '#00ABA7',
        fontSize: fontSize(15),// 15,
        margin: scale(7)
    },
    view_relate_flight_title: {
        backgroundColor: '#F2F2F2',
        paddingTop: verticalScale(7),
        paddingBottom: verticalScale(7),
        paddingLeft: scale(10),
        paddingRight: scale(10)
    },
    txt_relate_flight_title: {
        color: '#716A6A',
        fontSize: fontSize(15),// 15,
        fontWeight: 'bold'
    },
    listview_separator: {
        flex: 1,
        height: verticalScale(1),
        backgroundColor: '#E3E3E3',
    },
    touchable_skip: {
        backgroundColor: '#00ABA7',
        justifyContent: 'center',
        alignItems: 'center',
        margin: scale(3)
    },
    txt_skip: {
        color: '#FFFFFF',
        fontSize: fontSize(15),// 15,
        fontWeight: 'bold',
        paddingTop: verticalScale(12),
        paddingBottom: verticalScale(12)
    },
    player_created_flight_title: {
        color: '#6E6E6E',
        fontSize: fontSize(15),// 15,
        marginLeft: scale(10),
        marginBottom: verticalScale(10)
    },
    player_created_flight: {
        color: '#6E6E6E',
        fontSize: fontSize(15),// 15,
        fontWeight: 'bold'
    },
    item_friend_flight_container: {
        flex: 1,
        paddingTop: verticalScale(10)
    },
    item_friend_flight: {
        flex: 1,
        flexDirection: 'row',
        height: verticalScale(30),
        justifyContent: 'space-between',
        marginLeft: scale(5),
        marginRight: scale(5)
    },
    flight_name: {
        flex: 3,
        color: '#1A1A1A',
        fontSize: fontSize(16,scale(2)),// 16,
        textAlignVertical: 'center'
    },
    flight_time: {
        flex: 1,
        color: '#B8B8B8',
        fontSize: fontSize(13,-scale(1)),// 13,
        textAlignVertical: 'center',
        textAlign: 'right'
    },
});