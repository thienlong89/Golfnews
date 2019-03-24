import { getStatusBarHeight } from 'react-native-iphone-x-helper'
var Orientation = require('react-native-orientation');
import Permissions from 'react-native-permissions'
var _SQlite = require('react-native-sqlite-storage')
import ImagePicker from 'react-native-image-crop-picker';
import ViewShot from "react-native-view-shot";
import { Platform, Dimensions } from 'react-native';
import { captureScreen, captureRef } from "react-native-view-shot";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const cropSize = screenHeight > screenWidth ? screenWidth : screenHeight;

var optionsCamera = {
  // title: 'Select Avatar',
  // customButtons: [
  //   { name: 'fb', title: 'Choose Photo' },
  // ],
  // storageOptions: {
  //   skipBackup: true,
  //   path: 'images'
  // }
  width: cropSize,
  height: cropSize,
  freeStyleCropEnabled: true,
  cropping: true,
  mediaType: "photo",
  includeBase64: true
};
// var { FBLoginManager } = require('react-native-facebook-login');
// FBLoginManager.setLoginBehavior(FBLoginManager.LoginBehaviors.Web);
function getCurrentPositionAsync(params, callback, errorCallback = null) {
  console.log("navigator.geolocation.getCurrentPosition");
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log("position geolocation getCurrentPosition", position);
      callback(position);
    },
    (error) => {
      // resolve(null);
      if (errorCallback)
        errorCallback(error);
      console.log("getCurrentPosition.error", error);
    },
    { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 },
  );
}

function checkIphoneX() {
  return (
    // This has to be iOS
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    // Check either, iPhone X or XR
    (isIPhoneXSize() || isIPhoneXrSize())
  );
}

async function isIPhoneXSize() {
  return screenHeight == 812 || screenWidth == 812;
}

async function isIPhoneXrSize() {
  return screenHeight == 896 || screenWidth == 896;
}

async function logInWithReadPermissionsAsync(fbid, params) {
  // return new Promise(resolve => {
  //   FBLoginManager.loginWithPermissions(params.permissions || ['public_profile'], function (error, data) {
  //     if (!error) {
  //       console.log("Login data: ", data);
  //       resolve({ type: 'success', token: data.credentials.token });

  //     } else {
  //       console.log("Error: ", error);
  //       resolve({ type: 'error', token: "" });
  //     }
  //   });
  // });
}

var _Facebook = {
  logInWithReadPermissionsAsync
}


async function permissionsAskAsync(textPermission) {
  return new Promise(resolve => {
    console.log("textPermission", textPermission);
    Permissions.request(textPermission).then(response => {
      console.log("Permissions.request", response);

      resolve(response.replace('authorized', 'granted'));
    });
  });
}
async function permissionsAskAsyncDict(textPermission) {
  return new Promise(resolve => {
    console.log("textPermission", textPermission);
    Permissions.request(textPermission).then(response => {
      console.log("Permissions.request", response);

      resolve({ status: response.replace('authorized', 'granted') });
    });
  });
}

async function launchCameraAsync(cropping = false) {
  return new Promise(resolve => {
    ImagePicker.openCamera(cropping ? optionsCamera : { includeBase64: true }).then(image => {
      //console.log('launchCameraAsync', image);
      resolve(image);
    });
  });
}

async function launchImageLibraryAsync(cropping = false, multiple = false) {
  return new Promise(resolve => {
    ImagePicker.openPicker(cropping ? optionsCamera : { includeBase64: true, mediaType: "photo", multiple: multiple }).then(image => {
      //console.log('launchImageLibraryAsync', image);
      resolve(image);
    });
  });

}

async function takeSnapshotAsync(view, config) {
  if (view) {
    return new Promise(resolve => {
      captureRef(view, config)
        .then(
          result => resolve(result),
          error => console.error("Oops, snapshot failed", error)
        );
    });

  } else {
    return new Promise(resolve => {
      captureScreen(config)
        .then(
          result => resolve(result),
          error => console.error("Oops, snapshot failed", error)
        );
    });

  }

}

rotateToLandscape = () => {
  console.log("rotateToLandscape1");
  Orientation.lockToLandscape();
}

rotateToPortrait = () => {
  console.log("rotateToPortrait1");
  Orientation.lockToPortrait();
}

var _Constants = {
  marginTopBuild: Platform.OS === 'ios' ? 40 : 0,
  isDevice: true,
  statusBarHeight: getStatusBarHeight()
}
_Permissions = {
  LOCATION: 'location',
  NOTIFICATIONS: 'notifications',
  askAsync: permissionsAskAsyncDict
}

var _mapOrientation = {
  1: rotateToPortrait,
  0: rotateToLandscape
}

async function _getProviderStatusAsync() {
  return new Promise(resolve => {
    console.log("_getProviderStatusAsync");
    resolve({ gpsAvailable: true });
  });
}

var _Location = {
  getProviderStatusAsync: _getProviderStatusAsync,
  getCurrentPositionAsync: getCurrentPositionAsync
}
var _Permissions = {
  LOCATION: 'location',
  askAsync: permissionsAskAsyncDict
}

var _ImagePicker = {
  launchCameraAsync,
  launchImageLibraryAsync
}

var _Expo = {
  Location: _Location,
  Facebook: _Facebook,
  Permissions: _Permissions,
  ScreenOrientation: {
    allow: (key) => {
      console.log('ScreenOrientation');
      _mapOrientation[key]();
    },
    Orientation: {
      PORTRAIT: 1,
      LANDSCAPE: 0
    }

  },
  Constants: {
    deviceName: 'deviceName',
    platform: {
      ios: {
        model: checkIphoneX() ? 'iphone x' : 'other'
      },
      android: {
        model: 'Sansum S9'
      }
    }
  }
}

module.exports = {
  rotateToLandscape,
  rotateToPortrait,
  permissionsAskAsync,
  launchCameraAsync,
  Facebook: _Facebook,
  launchImageLibraryAsync,
  Permissions: _Permissions,
  Location: _Location,
  Constants: _Constants,
  Expo: _Expo,
  ImagePicker: {},
  SQLite: _SQlite,
  ImagePicker: _ImagePicker,
  Asset: null,
  Font: null,
  Notifications: null,
  IntentLauncherAndroid: null,
  takeSnapshotAsync,
  checkIphoneX
}


