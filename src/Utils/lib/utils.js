import I18n from 'react-native-i18n';
import moment from 'moment';

const secondsInMilli = 1000,
    minutesInMilli = secondsInMilli * 60,
    hoursInMilli = minutesInMilli * 60,
    daysInMilli = hoursInMilli * 24;

var SECOND = 1000,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE,
    DAY = 24 * HOUR,
    WEEK = 7 * DAY,
    YEAR = DAY * 365,
    MONTH = YEAR / 12;

/**
 * Viết gọn hàm getFormatAgoTime
 */
module.exports.relativeDate = function relativeDate(input, reference) {

    var formats = [
        [0.7 * MINUTE, I18n.t('before_second')],
        [1.5 * MINUTE, I18n.t('before_minute')],
        [60 * MINUTE, I18n.t('before_minute'), MINUTE],
        [1.5 * HOUR, I18n.t('before_hour')],
        [DAY, I18n.t('before_hour'), HOUR],
        [2 * DAY, I18n.t('before_day')],
        [7 * DAY, I18n.t('before_day'), DAY],
        [1.5 * WEEK, I18n.t('a_week_ago')],
        [MONTH, I18n.t('week_ago'), WEEK],
        [1.5 * MONTH, I18n.t('last_month')],
        [YEAR, I18n.t('before_month'), MONTH],
        [1.5 * YEAR, I18n.t('last_year')],
        [Number.MAX_VALUE, I18n.t('before_year'), YEAR]
    ];

    !reference && (reference = (new Date).getTime());
    reference instanceof Date && (reference = reference.getTime());
    input instanceof Date && (input = input.getTime());

    var delta = reference - input,
        format, i, len;

    for (i = -1, len = formats.length; ++i < len;) {
        format = formats[i];
        if (delta < format[0]) {
            return format[2] == undefined ? format[1] : Math.round(delta / format[2]) + ' ' + format[1];
        }
    };
}

function formatString(format, args) {
    let i = 0;
    let length = args.length;
    for (; i < length; i++) {
        let param = args[i];
        if (format.indexOf('%s') >= 0) {
            format = format.replace('%s', param);
        }
    }
    return format;
}

/**
 * tra ve dinh dang ngay truoc, thang truoc, nam truoc
 * @param {*} day 
 */
function dayAgo(day) {
    if (day > 1 && day <= 30) {
        return day + ' ' + I18n.t('before_day');
    } else if (day <= 365) {
        let d = Math.round(day / 30);
        // console.log('........................check day : ',d);
        return d === 1 ? I18n.t('last_month') : d + ' ' + I18n.t('before_month');
    } else {
        //năm
        let y = Math.round(day / 365);
        return y === 1 ? I18n.t('last_year') : y + ' ' + I18n.t('before_year');
    }
}

function getFormatAgoTime(timestamp) {
    let date = new Date();
    let different = date.getTime() - timestamp;

    // console.log('......................time stem ', (51/86400000),parseInt(51/86400000),Math.round(51/86400000));

    let elapsedDays = Math.round(different / daysInMilli);
    different = different % daysInMilli;

    let elapsedHours = Math.round(different / hoursInMilli);
    different = different % hoursInMilli;

    let elapsedMinutes = Math.round(different / minutesInMilli);
    different = different % minutesInMilli;

    let elapsedSeconds = Math.round(different / secondsInMilli);
    elapsedSeconds = Math.abs(elapsedSeconds);
    if (elapsedDays > 0) {
        // return elapsedDays == 1 ? elapsedDays + ' ' + I18n.t('before_day') : elapsedDays + ' ' + I18n.t('before_day');
        return elapsedDays == 1 ? elapsedDays + ' ' + I18n.t('before_day') : dayAgo(elapsedDays);
    } else {
        if (elapsedHours > 0) {
            return elapsedHours == 1 ? elapsedHours + ' ' + I18n.t('before_hour') : elapsedHours + ' ' + I18n.t('before_hour');
        } else {
            if (elapsedMinutes > 0) {
                return elapsedMinutes == 1 ? elapsedMinutes + ' ' + I18n.t('before_minute') : elapsedMinutes + ' ' + I18n.t('before_minute');
            } else {
                return (elapsedSeconds === 0) ? I18n.t('before_second') : (elapsedSeconds + ' ' + I18n.t('before_second'));
            }
        }
    }
}

// timestamp in second
function getFormatTime(timestamp) {
    let different = parseInt((new Date()).getTime() / 1000) - timestamp;
    let secondsInMilli = 1;
    let minutesInMilli = secondsInMilli * 60;
    let hoursInMilli = minutesInMilli * 60;
    let daysInMilli = hoursInMilli * 24;

    let elapsedDays = parseInt(different / daysInMilli);
    different = different % daysInMilli;

    let elapsedHours = parseInt(different / hoursInMilli);
    different = different % hoursInMilli;

    let elapsedMinutes = parseInt(different / minutesInMilli);
    different = different % minutesInMilli;

    let elapsedSeconds = different / secondsInMilli;
    elapsedSeconds = Math.abs(elapsedSeconds);
    if (elapsedDays > 0) {
        return moment(timestamp * 1000).format("HH:mm, DD/MM/YYYY");
    } else {
        if (elapsedHours > 0) {
            return elapsedHours == 1 ? elapsedHours + ' ' + I18n.t('before_hour') : elapsedHours + ' ' + I18n.t('before_hour');
        } else {
            if (elapsedMinutes > 0) {
                return elapsedMinutes == 1 ? elapsedMinutes + ' ' + I18n.t('before_minute') : elapsedMinutes + ' ' + I18n.t('before_minute');
            } else {
                return elapsedSeconds + ' ' + I18n.t('before_second');
            }
        }
    }
}

module.exports.formatString = formatString;

module.exports.getFormatAgoTime = getFormatAgoTime;

module.exports.getFormatTime = getFormatTime;