import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    // View,
    ImageBackground
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import { Image } from 'react-native-animatable';
import MyView from '../../../Core/View/MyView';
import { View } from 'react-native-animatable';
import { Avatar } from 'react-native-elements';
import { fontSize, scale } from '../../../Config/RatioScale';
import TournamentModel from '../../../Model/Events/TournamentModel';

const ANIMATE_TIME = 800;

export default class TraditionalItemView extends BaseComponent {

    static defaultProps = {
        eventObject: {},
        uid: ''
    }

    constructor(props) {
        super(props);
        this.state = {
            isShowDelete: false
        }

        this.onEventItemLongPress = this.onEventItemLongPress.bind(this);
        this.onEventItemPress = this.onEventItemPress.bind(this);
        this.onTournamentPress = this.onTournamentPress.bind(this);
    }

    render() {
        let { eventObject } = this.props;
        let { isShowDelete } = this.state;

        let month = eventObject.getMonth();
        let day = eventObject.getDay();
        let eventName = eventObject.getName();
        let courseName = eventObject.getCourseName();
        let teeTime = eventObject.getTeeTimeDisplay();
        let club = eventObject.getClub();
        let listPlayer = eventObject.getListPlayer();
        let isAccepted = eventObject.getIsAccepted();
        let totalImg = eventObject.getTotalTraditionImg();

        return (
            <Touchable
                //  onLongPress={this.onEventItemLongPress}
                onPress={this.onEventItemPress}>
                <View>
                    <View style={styles.container}>
                        <ImageBackground style={styles.view_left}
                            imageStyle={{ resizeMode: 'contain' }}
                            source={this.getResources().avatar_default_larger}>
                            <View style={{ backgroundColor: '#000', opacity: 0.6, flex: 1 }} />
                            <View style={styles.view_date_time}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_month}>{month.toUpperCase()}</Text>
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_day}>{day.toUpperCase()}</Text>
                            </View>

                        </ImageBackground>
                        <View style={{ flex: 1 }}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_event_name}>{eventName}</Text>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_course_name}>{`${this.t('san')}: ${courseName}`}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: scale(10) }}>
                                <View style={styles.view_row}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_course_name}
                                        numberOfLines={1}>
                                        {`${this.t('tee_time')}: ${teeTime}`}
                                    </Text>
                                    <MyView hide={isAccepted != 1}>
                                        <Image
                                            style={styles.img_checked}
                                            source={this.getResources().btn_selected} />
                                    </MyView>
                                </View>
                                <MyView hide={totalImg === 0} style={styles.view_right}>
                                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_total_img}>{totalImg}</Text>
                                    <Image
                                        style={styles.img_icon}
                                        source={this.getResources().ic_picture_blue} />
                                </MyView>
                            </View>

                            {/* <View style={styles.view_row}>
                                <View style={{ flex: 1 }}>


                                </View>
                                
                            </View> */}

                        </View>

                    </View>
                    {/* <MyView hide={!isShowDelete}
                        style={styles.view_delete}>
                        <View ref={(refViewDelete) => { this.refViewDelete = refViewDelete; }}
                            style={{ flex: 1 }}>
                            <Touchable style={styles.touchable_delete_group}
                                onPress={this.onDeleteEventClick.bind(this)}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_delete}>{this.t('delete')}</Text>
                            </Touchable>
                        </View>

                    </View> */}
                </View>
            </Touchable>

        );
    }


    onEventItemPress() {
        this.hideDeleteBtn();

        if (this.props.onPress) {
            this.props.onPress();
        }
    }

    onTournamentPress() {
        let {
            eventObject,
            onTournamentPress
        } = this.props;
        if (onTournamentPress) {
            onTournamentPress(eventObject);
        }
    }

    onEventItemLongPress() {
        let { eventObject, uid } = this.props;
        if (uid === eventObject.getUserCreated() && !this.state.isShowDelete) {
            this.setState({
                isShowDelete: true
            }, () => {
                if (this.refViewDelete)
                    this.refViewDelete.animate('bounceInRight', ANIMATE_TIME);
            });
        }

    }

    onDeleteEventClick() {
        if (this.props.onLongPress) {
            this.props.onLongPress();
        }
        this.hideDeleteBtn();
    }

    hideDeleteBtn() {
        if (this.state.isShowDelete) {
            if (this.refViewDelete)
                this.refViewDelete.animate('bounceOutRight', ANIMATE_TIME);
            setTimeout(() => {
                this.setState({
                    isShowDelete: false
                });
            }, ANIMATE_TIME);
            return;
        }
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center'
    },
    view_left: {
        width: 50,
        height: 50,
        margin: 10,
    },
    view_date_time: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt_month: {
        fontSize: 15,
        color: '#fff'
    },
    txt_day: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold'
    },
    txt_event_name: {
        color: '#242424',
        fontSize: 16,
        fontWeight: 'bold',
        justifyContent: 'space-between',
        marginTop: 10
    },
    txt_course_name: {
        color: '#858585',
        fontSize: fontSize(13)
    },
    view_row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: scale(10)
    },
    img_logo: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
    },
    img_checked: {
        height: 15,
        width: 15,
        resizeMode: 'contain',
        marginLeft: scale(5),
        // tintColor: '#6AC259'
    },
    view_delete: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0
    },
    touchable_delete_group: {
        minWidth: 70,
        backgroundColor: '#EE3030',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    txt_delete: {
        color: '#fff',
        fontSize: 13
    },
    avatar_container: {
        backgroundColor: '#fff',
        position: 'absolute'
    },
    avatar_style: {
        borderColor: '#FFFFFF',
        borderWidth: 2
    },
    view_overlay: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        left: 0,
        top: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt_over: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold'
    },
    view_right: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        marginRight: scale(10)
    },
    txt_total_img: {
        color: '#5A5A5A',
        fontSize: fontSize(13)
    },
    img_icon: {
        width: scale(15),
        height: scale(15),
        resizeMode: 'contain',
        tintColor: '#5A5A5A',
        marginLeft: scale(5)
    }
});