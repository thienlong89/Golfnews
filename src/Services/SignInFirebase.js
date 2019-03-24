import firebaseServices from './firebase';
import ApiService from '../Networking/ApiService';
import Networking from '../Networking/Networking';
import Config from '../Config/Config';

/**
 * Send fuid len sever
 * @param {*} fuid 
 */
function sendFirebaseUid(fuid){
    let url = Config.getBaseUrl() + ApiService.user_add_fuid();
    console.log("url ----------------- ",url);
    let formData = {"id_firebase" : fuid};
    //console.log("formData ============== ",formData);
    Networking.httpRequestPost(url,(jsonData)=>{
        console.log("add fuid firebase ------- ",jsonData);
    },formData,(error)=>{
        console.log("error ------------------- ",error);
    });
}

module.exports.sendFirebaseUid = sendFirebaseUid;

/**
 * login vao firebase chat
 * @param {*} phone 
 * @param {*} password 
 */
module.exports.signInFirebase = function(phone,password) {
    // var appVerifier = new firebaseServices.auth().RecaptchaVerifier('recaptcha-container');
    console.log("dang ky chat firebase appVerifier : ",phone);    
    let user = firebaseServices.auth().currentUser;
    if (user) {
        console.log("user da login vao firebase ", user.uid);
        sendFirebaseUid(user.uid);
    } else {
        let mail = `${phone}` + "@gmail.com";
        console.log("mail------------------ ",mail);
        //let password = '123123';
        firebaseServices.auth().createUserWithEmailAndPassword(mail, password)
            .then(confirmResult =>{
                console.log(`message Code has been sent! to ${confirmResult}`);
                let fuid = firebaseServices.auth().currentUser.uid;
                sendFirebaseUid(fuid);
            })
            .catch(error => {
                console.log(`message Sign In With Phone Number Error: ${error.message}`);
                firebaseServices.auth().signInWithEmailAndPassword(mail,password).then(result=>{
                    let fuid = firebaseServices.auth().currentUser.uid;
                    sendFirebaseUid(fuid);
                });
        });
    }
}