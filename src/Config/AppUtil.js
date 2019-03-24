import { ImagePicker, takeSnapshotAsync, checkIphoneX } from '../Core/Common/ExpoUtils';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import { Platform, Share, PermissionsAndroid } from 'react-native';
import call from 'react-native-phone-call';
import Config from '../Config/Config';
// import Files from '../Components/Common/Files';
import ImageResizer from 'react-native-image-resizer';
// var RNFetchBlob;
// if (Platform.OS === 'android') {
var RNFetchBlob = require('react-native-fetch-blob').RNFetchBlob
if (!RNFetchBlob) {
    RNFetchBlob = require('react-native-fetch-blob').default;
}

// import RNFetchBlob from 'react-native-fetch-blob';

// var RNFetchBlob  = require('react-native-fetch-blob').RNFetchBlob

const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i;

const TEE_COLOR = ['blue', 'red', 'gold', 'white', 'black'];

let upload_android = (url, data) => {
    return RNFetchBlob.fetch('POST', url,
        {
            Authorization: "Bearer access-token",
            otherHeader: "foo",
            'Content-Type': 'multipart/form-data',
        },
        data);
}

let upload_file = (url, data) => {
    return RNFetchBlob.fetch('POST', url,
        {
            Authorization: "Bearer access-token",
            otherHeader: "foo",
            'Content-Type': 'application/octet-stream',
        },
        data);
}

const ICON_MANNER = {
    
}

const args = {
    number: Config.hotline, // String value with the number to call
    prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call
}

module.exports.call_hotline = function (callbackError = null) {
    call(args).catch(console.error);
}

/**
 * Upload ảnh lên sever
 * @param {*} url link sever
 * @param {*} imagePath đường link của ảnh từ thư mục điện thoại
 */
module.exports.upload_mutil = async function (url, arr_imagePath, callback = null, callbackError = null, progressCallback = null) {
    // ImagePicker saves the taken photo to disk and returns a local URI to it
    // Upload the image using the fetch and FormData APIs
    let arrayImage = arr_imagePath.map((imagePath, index) => {
        return {
            name: 'image[]',
            filename: `filename${index}.png`,
            data: imagePath.data ? imagePath.data : RNFetchBlob.wrap(imagePath)
        };
    })
    upload_android(url, arrayImage)
        .uploadProgress({ interval: 250 }, (written, total) => {
            if (progressCallback) {
                progressCallback(written / total);
            }
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if (callback) {
                callback(responseJson);
            }
            return responseJson;
        })
        .catch((error) => {
            console.log(error);
            if (callbackError) {
                callbackError(error)
            }
        });
}

/**
 * Upload ảnh lên sever
 * @param {*} url link sever
 * @param {*} imagePath đường link của ảnh từ thư mục điện thoại
 */
module.exports.upload = async function (url, imagePath, callback = null, callbackError = null, progressCallback = null) {
    console.log(url, imagePath);
    // if (Platform.OS === 'android' && imagePath.data) {
    try {
        upload_android(url, [{ name: 'image', filename: 'avatar.png', data: imagePath.data ? imagePath.data : RNFetchBlob.wrap(imagePath) }])
            .uploadProgress({ interval: 250 }, (written, total) => {
                if (progressCallback) {
                    progressCallback(written / total);
                }
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if (callback) {
                    callback(responseJson);
                }
                return responseJson;
            })
            .catch((error) => {
                console.log(error);
                if (callbackError) {
                    callbackError(error)
                }
            });
    } catch (error) {
        console.log('error', error)
    }

}

/**
 * Upload file lên sever
 * @param {*} url link sever
 * @param {*} imagePath đường link của file từ thư mục điện thoại
 */
module.exports.uploadPdfFile = async function (url, filePath, callback = null, callbackError = null, progressCallback = null) {
    console.log('uploadPdfFile', url, filePath);
    try {
        upload_android(url, [{ name: 'tour_rule', filename: 'regulations.pdf', data: RNFetchBlob.wrap(filePath) }])
            .uploadProgress({ interval: 250 }, (written, total) => {
                if (progressCallback) {
                    progressCallback(written / total);
                }
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if (callback) {
                    callback(responseJson);
                }
                return responseJson;
            })
            .catch((error) => {
                console.log(error);
                if (callbackError) {
                    callbackError(error)
                }
            });
    } catch (error) {
        console.log('error', error)
    }

}

module.exports.uploadFlightImage = async function (url, imagePath, formData, callback = null, callbackError = null) {
    console.log(url, imagePath);
    upload_android(url, [
        {
            name: 'image',
            filename: 'avatar.png',
            data: imagePath.data ? imagePath.data : imagePath
        },
        {
            name: 'flight',
            data: JSON.stringify(formData)
        }
    ])
        .then((response) => response.json())
        .then((responseJson) => {
            if (callback) {
                callback(responseJson);
            }
            return responseJson;
        })
        .catch((error) => {
            console.log(error);
            if (callbackError) {
                callbackError(error)
            }
        });
}

/**
 * Chụp ảnh từ camera trả về uri của ảnh trên điện thoại
 */
module.exports.onTakePhotoClick = async function onTakePhotoClick(isCrop = false) {

    let result = await ImagePicker.launchCameraAsync(isCrop);
    //console.log("result ",JSON.stringify(result));

    if (!result.cancelled) {
        // this.setState({ image: result.uri });
        return result;
    }
    return '';
}

/**
 * Chup anh man hinh
 * @param {*} view View hien thi can chup lai: collapsable={false}
 */
module.exports.onSnapshotClick = async function onSnapshotClick(view) {
    if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (!granted) {
            const response = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            );
            console.log('onSnapshotClick.response', response);
            if (response === 'denied' || response === 'never_ask_again') {
                return;
            }
        }
    }
    let result = await takeSnapshotAsync(view, { format: 'jpeg', quality: 1, result: 'data-uri' });
    return result;
}

/**
 * Load ảnh từ thư viện trả về uri của anh trên điện thoại
 */
module.exports.onImportGalleryClick = async function onImportGalleryClick(isCrop = false, multiple = false) {
    // if (Platform.OS === 'android') {
    //     isObj = true;
    // }
    let result = await ImagePicker.launchImageLibraryAsync(isCrop, multiple);
    if (!result.cancelled) {
        // this.setState({ image: result.uri });
        return result;
    }
    return '';
}

module.exports.resizeImage = async function resizeImage(uri, width, height, size = 0, format = 'JPEG', quality = 80) {
    console.log('resizeImage', size, uri)
    if (size > 1048576) {
        let q = size > 2097152 ? (2097152 / size) * 100 : 70;//2097152
        console.log('quality', q, size);
        return new Promise((resolve, reject) => {
            ImageResizer.createResizedImage(uri, width, height, format, q)
                .then(({ uri }) => {
                    resolve({ uri });
                })
                .catch(err => {
                    console.log(err);
                    reject(err)
                });
        });
    }
    console.log('resizeImage.none', uri)
    return { uri };
}

module.exports.onImportFile = async function onImportFile() {
    return new Promise(resolve => {
        DocumentPicker.show({
            filetype: [DocumentPickerUtil.pdf()],
        }, (error, res) => {
            // Android
            resolve(res);
        });
    });
}

module.exports.formatMoney = function (amount, decimalCount = 2, decimal = ".", thousands = ",") {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.log(e)
    }
}

module.exports.isIphoneX = function isIphoneX() {
    return checkIphoneX();
}

module.exports.getColorTee = function (tee_id) {
    if (tee_id) {
        return tee_id;
    }
    return 'blue';
}

function remove(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

module.exports.remove = remove;
/**
 * Xoa doi tuong clone cua 1 doi tuong bat ky trong mang
 * @param {*} array 
 * @param {*} obj 
 */
module.exports.removeObjectUser = function removeObj(array, obj) {
    let i = 0; length = array.length;
    for (; i < length; i++) {
        let item = array[i];
        //console.log("item ",item);
        //console.log("obj ",obj);
        if (item.userId.indexOf(obj.userId) >= 0) {
            return remove(array, item);
        }
    }
    return array;
}

module.exports.formatAvatar = function formatAvata(avatar) {
    return avatar.replace('NULL', '').replace('Null', '').replace('null', '');
}

/**
 * them gia tri item vao vi tri index cua mang arr
 * @param {*} arr mảng muốn thêm giá trị
 * @param {*} index vi trí cần chèn
 * @param {*} item giá trị cần thêm vào mảng
 */
module.exports.addItemToList = function add(arr, index, item) {
    return arr.splice(index, 0, item);
}

module.exports.showUserId = function showUserId(uid, eHandicap_member_id) {
    return (eHandicap_member_id && eHandicap_member_id.length) ? uid + '-' + eHandicap_member_id : uid;
}

module.exports.convertOverToGross = function convertOverToGross(score, par) {
    if (score === 'Par') {
        return parseInt(par);
    } else if (score === 'Bogey') {
        return parseInt(par) + 1;
    } else {
        return parseInt(par) + parseInt(score);
    }
}

module.exports.convertGrossToOVer = function convertGrossToOVer(score, par) {
    if (score === par) {
        return 0;
    } else if (score > par) {
        return `+${(score - par)}`;
    } else {
        return score - par;
    }
}

module.exports.getSourceRankingManner = function getSourceRankingManner(manner) {
    if (manner === 1) {
        return ICON_MANNER.UP;
    } else if (manner === 2) {
        return ICON_MANNER.NORMAL
    } else {
        return ICON_MANNER.DOWN;
    }
}

module.exports.replaceUser = function (user_id) {
    if (user_id) {
        if (user_id.toString().toLowerCase().indexOf('vga') >= 0) {
            return parseInt(user_id.toLowerCase().replace('vga', ''));
        } else {
            return parseInt(user_id);
        }
    } else {
        return '';
    }

}

module.exports.ShareUrl = function (urlPath) {
    Share.share({
        ...Platform.select({
            ios: {
                url: urlPath,
            },
            android: {
                message: urlPath
            }
        }),
    }, {
            ...Platform.select({
                // ios: {
                //     // iOS only:
                //     excludedActivityTypes: [
                //         'com.apple.UIKit.activity.PostToTwitter'
                //     ]
                // },
                android: {
                    // Android only:
                    dialogTitle: 'Share: '
                }
            })
        });
}

module.exports.handicap_display = function (handicap) {
    if (handicap < 0) {
        return '+' + Math.abs(handicap);
    } else {
        return (handicap !== undefined) ? handicap : 'N/A';
    }
}

module.exports.checkColorValid = function (str) {
    return true;//HEX_COLOR_REGEX.test(str) || TEE_COLOR.includes(str);
}

module.exports.format_time_chat_Send = function (time) {
    if (!time) return null;
    let date = new Date();
    let date_date = date.getDate();
    let time_date = time.getDate();

    if (date_date === time_date) {
        return `${time.getHours()}:${time.getMinutes() < 10 ? '0'+time.getMinutes() : time.getMinutes()}`;
    } else {
        return `${time.getHours()}:${time.getMinutes()}, ${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`;
    }
}

module.exports.format_time_chat = function (time) {
    if (!time) return '';
    let date = new Date();
    let date_year = date.getFullYear();
    let date_month = date.getMonth();
    let date_date = date.getDate();

    let time_year = time.getFullYear();
    let time_month = time.getMonth();
    let time_date = time.getDate();

    // return `${time_date}/${time_month+1}/${time_year}`;

    if (date_year === time_year) {
        if (date_month === time_month) {
            if (date_date === time_date) {
                return `${time.getHours()}:${time.getMinutes()}`;
            } else {
                return `${time.getDate()}/${time.getMonth() + 1}`;
            }
        } else {
            return `${time.getDate()}/${time.getMonth() + 1}`;
        }
    } else {
        return `${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`;
    }
}

module.exports.guidGenerator = function () {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

module.exports.getMaxReducer = (flightId, flight) => Math.max(flightId, flight.id);

module.exports.getMinReducer = (flightId, flight) => Math.min(flightId, flight.id);

module.exports.getMaxRoundReducer = (flightId, round) => Math.max(flightId, round.Flight.id);

module.exports.getMinRoundReducer = (flightId, round) => {
    if (round.Flight.id != 0) {
        return Math.min(flightId, round.Flight.id)
    }
    return flightId;
};

var getDaysInMonth = function (month, year) {
    // Here January is 1 based
    //Day 0 is the last day in the previous month
    return new Date(year, month, 0).getDate();
    // Here January is 0 based
    // return new Date(year, month+1, 0).getDate();
};

module.exports.getDaysInThisMonth = function () {
    let date = new Date();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return getDaysInMonth(month, year);
}

module.exports.getMaxNewsReducer = (newsId, news) => Math.max(newsId, news.id);

module.exports.getMaxNotificationReducer = (notificationId, notification) => Math.max(notificationId, notification.id);

module.exports.getMinNotificationReducer = (notificationId, notification) => Math.min(notificationId, notification.id);

module.exports.getFormattedTime = function (totalSeconds) {
    let seconds = parseInt(totalSeconds % 60, 10);
    let minutes = parseInt(totalSeconds / 60, 10) % 60;
    let hours = parseInt(totalSeconds / 3600, 10);

    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    hours = hours < 10 ? '0' + hours : hours;

    hours = hours === '00' ? '' : hours + ' : ';

    return hours + minutes + ' : ' + seconds;
}

/**
 * Viết hoa chữ cái đầu của chuỗi
 * @param {string} string
 */
module.exports.toUpperCaseFirst = function jsUcfirst(string) {
    if (!string || !string.length || typeof string !== 'string') return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}