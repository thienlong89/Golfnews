// import { Permissions, Notifications } from 'expo';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import Config from '../../Config/Config';
import { permissionsAskAsync } from '../../../ExpoUtils/ExpoUtils';
import { Platform } from 'react-native';
import * as firebase from 'react-native-firebase';
import FCM, { NotificationActionType } from "react-native-fcm";

// firebase.initializeApp({
//     apiKey: "AIzaSyDEvmIJT8aRj9Y6vq3DIBkE7m8rtIAHDYY",
//     authDomain: "golfervn-staging.firebaseapp.com",
//     databaseURL: "https://golfervn-staging.firebaseio.com",
//     projectId: "golfervn-staging",
//     storageBucket: "golfervn-staging.appspot.com",
//     messagingSenderId: "849858867063"
// });

export default (async function FirebaseNotificationsAsync() {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    if (Platform.OS === 'ios') {
        let status = await permissionsAskAsync('notification');
        console.log('FirebaseNotificationsAsync status', status)
        // Stop here if the user did not grant permissions
        if (!['granted', 'authorized'].includes(status)) {
            console.log("FirebaseNotificationsAsync return");
            return;
        }

    }

    try {
        let result = await FCM.requestPermissions({
            badge: false,
            sound: false,
            alert: true
        });
    } catch (e) {
        console.error(e);
    }

    // Get the token that uniquely identifies this device
    let token = await new Promise(resolve => {
        console.log("'Device FCM Token request");

        FCM.getFCMToken().then(token => {
            console.log("TOKEN (getFCMToken)", token);
            resolve(token)

        });

    });
    console.log('Firebase', token);

    const channel = new firebase.notifications.Android.Channel('vhandicap-channel',
        'Test Channel', firebase.notifications.Android.Importance.Max)
        .setDescription('My apps test channel')
        .setSound('golf_swng.mp3');
    // Create the channel
    firebase.notifications().android.createChannel(channel)

    let url = Config.getBaseUrl() + ApiService.push_register(token);
    console.log('url', url);
    Networking.httpRequestGet(url, (jsonData) => {
        console.log('FirebaseRegister', jsonData);
    });

});