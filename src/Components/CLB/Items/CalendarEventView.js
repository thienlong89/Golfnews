import React, { PureComponent } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import Utils from '../../../Utils'
import DayEventComponent from './DayEventComponent';
import moment from 'moment';

import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
let { width, height } = Dimensions.get('window');

export default class CalendarEventView extends PureComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.dayEvents = {};
        this.state = {
            markedDates: []
        }
    }



    render() {
        let { markedDates } = this.state;
        const slideAnimation = new SlideAnimation({
            slideFrom: 'bottom',
        });
        return (
            <PopupDialog
                ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                dialogAnimation={slideAnimation}
                dialogStyle={styles.popup_style}>
                <View style={styles.container}>
                    <Calendar
                        style={styles.calendar}
                        hideExtraDays
                        firstDay={1}
                        theme={{
                            backgroundColor: '#ffffff',
                            calendarBackground: '#ffffff',
                            textSectionTitleColor: '#b6c1cd',
                            selectedDayTextColor: '#ffffff',
                            textDisabledColor: '#d9e1e8',

                            textDayFontSize: 16,
                            textDayHeaderFontSize: 16,

                            arrowColor: '#D1D1D6',
                            monthTextColor: '#00BAB6',
                            textMonthFontWeight: 'bold',
                            textMonthFontSize: 18,
                            'stylesheet.calendar.header': {
                                week: {
                                    marginTop: 5,
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    backgroundColor: '#00BAB6',
                                    // paddingLeft: 10,
                                    // paddingRight: 10
                                },
                                dayHeader: {
                                    marginTop: 4,
                                    marginBottom: 4,
                                    textAlign: 'center',
                                    fontSize: 15,
                                    color: '#fff',
                                    flex: 1
                                },
                            },
                            'stylesheet.day.basic': {
                                today: {
                                    backgroundColor: '#00BAB6'
                                },
                                todayText: {
                                    color: '#fff'
                                },
                            },
                            'stylesheet.calendar.main': {
                                container: {
                                },
                                week: {
                                    flexDirection: 'row',
                                    justifyContent: 'space-around'
                                }
                            }
                        }}

                        markedDates={markedDates}

                        dayComponent={({ date, state, marking }) =>
                            <DayEventComponent
                                ref={(refDayEventComponent) => { this.refDayEventComponent = refDayEventComponent }}
                                date={date}
                                state={state}
                                marking={marking}
                            />
                        }
                    />

                </View>
            </PopupDialog>
        );
    }

    show() {
        this.popupDialog.show();
        //console.log('popupDialog.show()');
    }

    dismiss() {
        this.popupDialog.dismiss();
        //console.log('popupDialog.dismiss()');
    }

    setDateEvent(eventList) {
        for (let day of eventList) {
            let time = moment(day.tee_timestamp * 1000).format('YYYY-MM-DD');
            this.dayEvents[time] = { marked: true };
        }
        console.log('setDateEvent', this.dayEvents);
        this.setState({
            markedDates: this.dayEvents
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-between',
        borderRadius: 10
    },
    popup_style: {
        width: scale(350),
        minHeight: 400,
        backgroundColor: '#FFFFFF',
        borderRadius: 10
    },
    calendar: {
        borderTopWidth: 1,
        paddingTop: 5,
        borderBottomWidth: 1,
        borderColor: '#eee',
        minHeight: 400,
        borderRadius: 10
    },
});