import Config from '../Config/Config';
import { Platform } from 'react-native';
import Constant from '../Constant/Constant';
const FETCH_TIMEOUT = 30000;
import { encode, decode } from 'base64-arraybuffer'

import RNFetchBlob from 'react-native-fetch-blob';
// const data = await getUserAgent();
// console.log("user agent : ",data);



const HEADER_INFOR = {
    'user-agent': `{}-Client`,
    'content-type': 'application/json',
    "App-Version": Config.version,
    "platfrom": Platform.OS,
    "platfrom-version": Platform.Version
}
function getHeader(){
    return {
        'user-agent': `{}-Client`,
        'content-type': 'application/json',
        "App-Version": Config.version,
        "platfrom": Platform.OS,
        "platfrom-version": Platform.Version
    }
}

console.log("header : ", getHeader());

/**	
* Lấy dữ liệu từ server theo method GET	
* @param {String} url link url
* @param {Function} callback hàm callback nếu lấy dữ liệu thành công
*/
module.exports.httpRequestGet = function (url, callback, callError = null) {
    let didTimeOut = false;
    new Promise(function (resolve, reject) {
        const timeout = setTimeout(function () {
            didTimeOut = true;
            try {
                reject('Request timed out');
            } catch (error) {
                
            }
            
        }, FETCH_TIMEOUT);

        fetch(url, {
            headers: HEADER_INFOR,
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            // mode: 'cors', // no-cors, cors, *same-origin
            // redirect: 'follow', // *manual, follow, error
            // referrer: 'no-referrer', // *client, no-referrer
        })
            .then((response) => response.json())
            .then(function (response) {
                // Clear the timeout as cleanup
                clearTimeout(timeout);
                if (!didTimeOut) {
                    //console.log('Thanh cong! ');
                    resolve(response);
                }
            })
            .catch(function (err) {
                // console.log('Co loi! ', err);
                // Rejection already happened with setTimeout
                if (didTimeOut) return;
                // Reject with error
                reject(err);
            });
    })
        .then(function (response) {
            // Request success and no timeout
            if (callback) {
                callback(response);
            }
        })
        .catch(function (err) {
            console.log(err);
            // Error: response error, request timeout or runtime error
            if (callError) {
                callError();
            }
        });
}

const fileReaderInstance = new FileReader();
module.exports.httpRequestGetBase64 = function httpRequestGetBase64(url, callback, callError = null) {

  RNFetchBlob.fetch('GET', url )
  // when response status code is 200
  .then((res) => {
    // the conversion is done in native code
    let base64Str = res.base64()
    const resHead = res.info().headers;
     if (callback) {
        callback('data:image/png;base64,' + base64Str, resHead);
    }
    console.log('base64Str', resHead)
    // the following conversions are done in js, it's SYNC
    let text = res.text()
    let json = res.json()
 
  })
  // Status code is not 200
  .catch((errorMessage, statusCode) => {
    // error handling
    if (callError) {
        callError(errorMessage, statusCode);
    }
  })

    // fetch(url)
    //     .then((response) => {
    //         console.log('response.body', response.body);
    //         response.blob().then((blob) => {
    //             fileReaderInstance.readAsDataURL(blob);
    //             fileReaderInstance.onload = () => {
    //                 if (callback) {
    //                     callback(fileReaderInstance.result, response.headers);
    //                 }
    //             }

    //         })
    //     })
    //     .catch((error) => {
    //         console.error(error);
    //         if (callError) {
    //             callError(error);
    //         }
    //     });

}

function arrayBufferToBase64(buffer) {
    // var binary = '';
    // var bytes = [].slice.call(new Uint8Array(buffer));

    // bytes.forEach((b) => binary += String.fromCharCode(b));

    return 'data:image/png;base64,' +encode(buffer);
};


/**
 * 
 * @param {*} url 
 * @param {*} callback 
 */
module.exports.httpRequestGetXMLHttp = function httpRequestGet2(url, callback) {
    try {
        //txtMessage.string = "url request : "+url;
        var request = new XMLHttpRequest();
        request.open("GET", url, true);

        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                //get status text
                //var httpStatus = request.statusText;
                if (callback) {
                    //callback.perform(request.responseText);
                    let data = request.responseText;
                    //target.onResponse(data);
                    callback(data);
                }
            }
        };
        request.send();
    } catch (error) {
        //txtMessage.string = error.toString();
        console.log(error);
    }
}

module.exports.httpRequestPost = function (url, callback, formData, callError = null) {
    let didTimeOut = false;
    new Promise(function (resolve, reject) {
        const timeout = setTimeout(function () {
            didTimeOut = true;
            try {
                reject('Request timed out');
            } catch (error) {
                
            }
        }, FETCH_TIMEOUT);

        fetch(url, {
            body: JSON.stringify(formData), // must match 'Content-Type' header
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'same-origin', // include, same-origin, *omit
            headers: HEADER_INFOR,
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            // mode: 'cors', // no-cors, cors, *same-origin
            // redirect: 'follow', // *manual, follow, error
            // referrer: 'no-referrer', // *client, no-referrer
        })
            .then((response) => response.json())
            .then(function (response) {
                // Clear the timeout as cleanup
                clearTimeout(timeout);
                if (!didTimeOut) {
                    resolve(response);
                }
            })
            .catch(function (err) {
                
                console.log('fetch failed!.url ', url);
                console.log('fetch failed! ', err);
                // Rejection already happened with setTimeout
                if (didTimeOut) return;
                // Reject with error
                reject(err);
            });
    })
        .then(function (response) {
            // Request success and no timeout
            if (callback) {
                callback(response);
            }
        })
        .catch(function (err) {
            // Error: response error, request timeout or runtime error
            if (callError) {
                callError();
            }
            // console.error(err);
        });
}