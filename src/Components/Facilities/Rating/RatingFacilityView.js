import React from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import Touchable from 'react-native-platform-touchable';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
import ItemRating from './Items/ItemRating';
import CustomText from '../Reviews/Items/TextCount';
import MyView from '../../../Core/View/MyView';
let { width } = Dimensions.get('window');
let item_width = width - scale(40);
let button_width = parseInt((item_width - scale(30)) / 2);

export default class RatingFacilityView extends BaseComponent {
    constructor(props) {
        super(props);
        this.onCancelClick = this.onCancelClick.bind(this);
        this.onSendClick = this.onSendClick.bind(this);
        this.state = {
            show : true
        }
    }

    componentDidMount() {
        this.refTitle.updateValue('LONG BIEN GOLF COURSE');
    }

    refresh(){
        this.refCaddy.refresh();
        this.refClubHouse.refresh();
        this.refDiffucuty.refresh();
        this.refExe.refresh();
        this.refGrassfairway.refresh();
        this.refGreen.refresh();
        this.refService.refresh();
        this.refYourfeeling.refresh();
    }

    hide(){
        this.setState({
            show : false
        });
    }

    onCancelClick() {
        this.refresh();
        this.hide();
    }

    onSendClick() {
        this.refresh();
        this.hide();
    }

    render() {
        let{show} = this.state;
        return (
            <MyView style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)' }} hide={!show}>
                <View style={styles.view_content}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.text_header}>{this.t('rating_facility').toUpperCase()}</Text>
                    <CustomText ref={(refTitle) => { this.refTitle = refTitle; }} style={styles.text_title} />
                    {/* <View style={{minHeight : 60,width : item_width,borderColor : '#d8d8d8' ,borderRadius : 10,borderWidth : 1,marginLeft : scale(10),marginRight : scale(10),marginTop : verticalScale(10)}}></View> */}
                    <ScrollView>
                        <ItemRating ref={(refDiffucuty) => { this.refDiffucuty = refDiffucuty; }}
                            title={this.t('difficuty_of_facility').toUpperCase()}
                            style={styles.item_start} />
                        <ItemRating ref={(refGrassfairway) => { this.refGrassfairway = refGrassfairway; }}
                            title={this.t('grass_fairway').toUpperCase()}
                            style={styles.item_normal} />
                        <ItemRating ref={(refGreen) => { this.refGreen = refGreen; }}
                            title={this.t('green').toUpperCase()}
                            style={styles.item_normal} />
                        <ItemRating ref={(refClubHouse) => { this.refClubHouse = refClubHouse; }}
                            title={this.t('club_house').toUpperCase()}
                            style={styles.item_normal} />
                        <ItemRating ref={(refCaddy) => { this.refCaddy = refCaddy; }}
                            title={this.t('caddy').toUpperCase()}
                            style={styles.item_normal} />
                        <ItemRating ref={(refYourfeeling) => { this.refYourfeeling = refYourfeeling; }}
                            title={this.t('your_feeling').toUpperCase()}
                            style={styles.item_normal} />
                        <ItemRating ref={(refView) => { this.refView = refView; }}
                            title={this.t('view').toUpperCase()}
                            style={styles.item_normal} />
                        <ItemRating ref={(refExe) => { this.refExe = refExe; }}
                            title={this.t('executive_yard').toUpperCase()}
                            style={styles.item_normal} />
                        <ItemRating ref={(refService) => { this.refService = refService; }}
                            title={this.t('service').toUpperCase()}
                            style={styles.item_normal} />
                    </ScrollView>
                    <View style={styles.view_button}>
                        <Touchable onPress={this.onCancelClick}>
                            <View style={styles.button_cancel}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.text_cancel}>{this.t('cancel_title').toUpperCase()}</Text>
                            </View>
                        </Touchable>
                        <Touchable onPress={this.onSendClick}>
                            <View style={styles.button_send}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.text_cancel}>{this.t('send').toUpperCase()}</Text>
                            </View>
                        </Touchable>
                    </View>
                </View>
            </MyView>
        );
    }
}

const styles = StyleSheet.create({

    text_title: {
        marginTop: verticalScale(10),
        fontSize: fontSize(19, scale(5)),
        color: '#424242',
        marginBottom: verticalScale(10)
    },

    text_header: {
        fontSize: fontSize(17, scale(3)),
        color: '#424242',
        fontWeight: 'bold',
        marginTop: verticalScale(10)
    },

    view_content: {
        flex: 1,
        marginLeft: scale(10),
        marginRight: scale(10),
        marginTop: verticalScale(30),
        marginBottom: verticalScale(20),
        backgroundColor: 'white',
        borderRadius: 7,
        alignItems: 'center'
    },

    text_send: {
        fontSize: fontSize(16, scale(2)),
        color: '#fff',
        fontWeight: 'bold'
    },

    button_send: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: scale(10),
        width: button_width,
        marginTop: verticalScale(5),
        marginBottom: verticalScale(10),
        backgroundColor: '#00aba7',
        borderRadius: 6,
        height : verticalScale(40)
    },

    item_start: {
        minHeight: verticalScale(50),
        width: item_width,
        borderColor: '#d8d8d8',
        borderRadius: 10,
        borderWidth: 1,
        marginLeft: scale(10),
        marginRight: scale(10),
        marginTop: verticalScale(30)
    },

    item_normal: {
        minHeight: verticalScale(50),
        width: item_width,
        borderColor: '#d8d8d8',
        borderRadius: 10,
        borderWidth: 1,
        marginLeft: scale(10),
        marginRight: scale(10),
        marginTop: verticalScale(10)
    },

    view_button: {
        height: verticalScale(60),
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: verticalScale(10)
    },

    button_cancel: {
        justifyContent: 'center',
        alignItems: 'center',
        width: button_width,
        marginTop: verticalScale(5),
        marginBottom: verticalScale(10),
        backgroundColor: '#e8e8e8',
        borderRadius: 6,
        height : verticalScale(40)
    },

    text_cancel: {
        fontSize: fontSize(16, scale(2)),
        color: '#696969',
        fontWeight: 'bold'
    }
});