import { isIphoneX,getStatusBarHeight } from 'react-native-iphone-x-helper'
var Orientation = require('react-native-orientation');
import Permissions from 'react-native-permissions'
var _SQlite = require('react-native-sqlite-storage')
var ImagePicker = require('react-native-image-picker');
import { Platform } from 'react-native';

var optionsCamera = {
  title: 'Select Avatar',
  customButtons: [
    {name: 'fb', title: 'Choose Photo'},
  ],
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};
// var {FBLoginManager} = require('react-native-facebook-login');
// FBLoginManager.setLoginBehavior(FBLoginManager.LoginBehaviors.Web);
function  getCurrentPositionAsync(params, callback){
    console.log("navigator.geolocation.getCurrentPosition");
    navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log("position geolocation getCurrentPosition", position);
      callback(position);
    },
    (error) => {
      // resolve(null);
    },
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
  );
}



async function logInWithReadPermissionsAsync(fbid, ...params){
  // return  new Promise(resolve => {
  //       console.log("logInWithReadPermissionsAsync",fbid,  params);
  //        FBLoginManager.loginWithPermissions(params.permissions || ['public_profile'], function(error, data){
  //         if (!error) {
  //           console.log("Login data: ", data);
  //           resolve({type:'success',token: data.credentials.token});

  //         } else {
  //           console.log("Error: ", error);
  //           resolve({type:'error', token:""});
  //         }
  //       });
  //   });
}

var _Facebook = {
  logInWithReadPermissionsAsync
}


async function permissionsAskAsync(textPermission){
    return new Promise(resolve => {
        console.log("textPermission", textPermission);
        Permissions.request(textPermission).then(response => 
            {
                console.log("Permissions.request", response);

                resolve(response.replace('authorized','granted'));
            });
    });
}
async function permissionsAskAsyncDict(textPermission){
    return new Promise(resolve => {
        console.log("textPermission", textPermission);
        Permissions.request(textPermission).then(response => 
            {
                console.log("Permissions.request", response);

                resolve({status:response.replace('authorized','granted')});
            });
    });
}

async function launchCameraAsync(){
    return new Promise(resolve => {
        console.log("launchCameraAsync");
        ImagePicker.launchCamera(optionsCamera, (response)  => {

                resolve(response);
        });
       
        
    });
}
async function launchImageLibraryAsync(...params){
    return new Promise(resolve => {
        console.log("launchImageLibraryAsync");
        // Open Image Library:
        ImagePicker.launchImageLibrary(optionsCamera, (response)  => {
          // Same code as in above section!
          console.log("launchImageLibraryAsync", response);
           resolve(response);
        });

      
        
    });
}

rotateToLandscape = ()=>{
  console.log("rotateToLandscape");
     Orientation.lockToLandscape();
}

rotateToPortrait = () =>{
        console.log("rotateToPortrait");
        Orientation.lockToPortrait();
}

var _Constants = {
  marginTopBuild: Platform.OS === 'ios' ? 40:0,
  isDevice:true,
  statusBarHeight: 25 //getStatusBarHeight()
}
_Permissions = {
    LOCATION:'location',
    NOTIFICATIONS:'notifications',
    askAsync:permissionsAskAsyncDict
  }

var _mapOrientation = {
    1:rotateToPortrait,
    0:rotateToLandscape
}

 async function _getProviderStatusAsync(){
    return new Promise(resolve => {
        console.log("_getProviderStatusAsync");
         resolve({gpsAvailable:true});
    });
}

var _Location  = {
  getProviderStatusAsync: _getProviderStatusAsync,
  getCurrentPositionAsync: getCurrentPositionAsync
}
var _Permissions = {
  LOCATION:'location',
  askAsync:permissionsAskAsyncDict
}

var _ImagePicker = {
  launchCameraAsync,
  launchImageLibraryAsync
}

var _Expo = {
  Location:_Location,
  Facebook:_Facebook,
  Permissions:_Permissions,
  ScreenOrientation:{
    allow:(key)=>{
      console.log('ScreenOrientation');
      _mapOrientation[key]();
    },
    Orientation:{
      PORTRAIT:1,
      LANDSCAPE:0
    }

  },
  Constants:{
    deviceName:'deviceName',
    platform:{
      ios:{
        model: isIphoneX()?'iphone x':'iphone cui'
      },
      android:{
        model:'Sansum S9'
      }
    }
  }
}

module.exports = {
  rotateToLandscape,
  rotateToPortrait,
  permissionsAskAsync,
  launchCameraAsync,
  Facebook:_Facebook,
  launchImageLibraryAsync,
  Permissions:_Permissions,
  Location:_Location,
  Constants: _Constants,
  Expo: _Expo,
  ImagePicker: {},
  SQLite : _SQlite,
  ImagePicker:_ImagePicker,
  Asset: null,
  Font: null,
  Notifications:null,
  IntentLauncherAndroid:null
}


