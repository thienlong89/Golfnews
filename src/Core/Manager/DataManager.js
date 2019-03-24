import { AsyncStorage } from 'react-native';
import { error } from '../Debug/Logger';

/**
 * Lưu id firebase của user
 */
module.exports.save_fuid_firebase = function(_fuid){
    AsyncStorage.setItem('fuid_firebase',_fuid)
}

/**
 * Load id firebase của user
 */
module.exports.load_fuid_firebase = function(callback,errorCallback=null){
    // let fuid = ''
    new Promise(()=>{
        AsyncStorage.getItem('fuid_firebase',(error,result)=>{
            if (error) {
                if (errorCallback) {
                    errorCallback();
                }
            }else{
                if(callback){
                    callback(result);
                }
            }
        })
    });
}

module.exports.clear = async function () {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.log("Clear du lieu bi loi ", error);
    }
}

module.exports.saveSingleLocalData = async function (key, value, callback = null) {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        // Error saving data
        if (callback !== null) {
            callback(error);
        }
    }
}

module.exports.saveLocation = function(value){
    AsyncStorage.setItem('check_location',value.toString());
}

module.exports.loadCheckLocalPermission = async function (callback, errorCallback=null) {
    try {
        await AsyncStorage.getItem('check_location', (error, result) => {
            console.log('.............................. error : result : ',error,result);
            if (error) {
                if (errorCallback) {
                    errorCallback();
                }
            }else{
                if(callback){
                    callback(result);
                }
            }
        });
    } catch (error) {
        //return false;
    }
}

module.exports.loadSingleLocalData = async function load(keys, callback, errorCallback) {
    try {
        const value = await AsyncStorage.getItem(keys);
        if (callback) {
            callback(value);
        }
    } catch (error) {
        // Error retrieving data
        console.log('loadSingleLocalData', error);
        if (errorCallback) {
            errorCallback();
        }
    }
}

module.exports.saveLocalData = function save(keyValuePairs, callback = null) {
    try {
        console.log('keyValuePairs', keyValuePairs);
        AsyncStorage.multiSet(keyValuePairs, (err) => {
            console.log('keyValuePairs.err', err);
            if (callback !== null) {
                callback(err);
            }
        });
    } catch (error) {
        console.error('saveLocalData.error', error);
        return false;
    }
    return true;
}

module.exports.loadLocalData = function load(keys, callback) {
    try {
        AsyncStorage.multiGet(keys, (err, result) => callback(err, result));

        //return '';
    } catch (error) {
        console.error(error);
        //return null;
    }
}

module.exports.saveListNews = function (value, callback = null) {
    try {
        AsyncStorage.setItem("notification_news", value, (err) => {
            if (callback) {
                callback(err);
            }
        });
    } catch (error) {
        console.error(error);
        return false;
    }
    return true;
}

/**
 * load list id tin tuc tu dien thoai
 * @param {*} value 
 * @param {*} callback 
 */
module.exports.loadListNews = function (callback = null) {
    try {
        AsyncStorage.getItem("notification_news", (err, result) => callback(err, result));
    } catch (error) {
        console.error(error);
        return false;
    }
    return true;
}