import firebaseService from './firebase';
import SignInFirebase from './SignInFirebase';
import UserInfo from '../Config/UserInfo';
/**
 * class quan ly chuc nang ban notification chat
 */

class NotificationManager {
    constructor() {
        this.listNotify = [];
        this.chatRef = null;// this.getRef().child("commen/");//.orderByChild('order');
        this.chatRefData = null;// this.chatRef;//.orderByKey();
        this.renderViewCallback = null;
        this.clearCommenCallback = null;
        this.startLoad = true;
        this.countNotification = 0;
        this.inited = false;
        this.receiveItemCallback = null;
    }

    /**
     * lang nghe tin nhan khi co user push
     */
    initListingNotification(receiveItemCallback) {
        //lang nghe khi co tin nhan ve
        this.chatRef = this.getRef().child('notifications');
        console.log("initListingMSG---");
        this.receiveItemCallback = receiveItemCallback;
        //console.log("comment room id ", this.generateId());
        this.chatRefData = this.chatRef;
        this.inited = true;
        this.chatRef.limitToLast(1).on("value", snap => {
            // get children as an array
            var items = [];
            //this.countNotification++;
            snap.forEach(child => {
                //var name = child.val().uid == this.user.uid ? this.user.name : name1;
                let notifi = child.val();
                //if (commen.id !== 'count_update') {
                console.log("listen item message global : ", notifi);
                 //   commen.type = commen.type ? commen.type : 'text';
                    //this.listMessages.push(commen);
                //}
                items.push(notifi);
                this.handleNotify(notifi);
            });
            if (this.receiveItemCallback && items.length) {
                this.receiveItemCallback(items[0]);
            }
        });
    }

    setRenderView(_renderView){
        this.renderViewCallback = _renderView;
    }

    /**
     * Xử lý tin nhắn
     */
    handleNotify(notify){
        let{user_receive} = notify;
        let i = '';
        i.toLowerCase
        if(user_receive){
            let{userid} = user_receive;
            if(userid.toLowerCase() === UserInfo.getUserId().toLowerCase()){
                this.listNotify.push(notify);
                this.countNotification++;
                if(this.renderViewCallback){
                    this.renderViewCallback();
                }
            }
        }
    }

    getRef() {
        return firebaseService.database().ref();
    }

    /**
     * Huy lắng nghe tin nhắn
     */
    offListeningCommen() {
        this.chatRef.off();
    }

    /**
     * Gui tin nhan den firebase
     * @param {*} message 
     */
    sendToFirebase(message) {
        this.chatRef.push().set(message, (error) => {
            if (error) {
                this.handleMessageSendError(message);
                console.log("Khong gui dc tin nhan den firebase ", error);
            } else {
                this.handleMessageSendSucces(message);
                console.log("gui tin nhan den firebase thanh cong!!!!!!");
            }
            // this.handleMessageSendError(message);
        });
    }

    /**
     * Xu ly khi gui tin nhan thanh cong
     * @param {*} message 
     */
    handleMessageSendSucces(message) {

    }

    /**
     * Xu ly khi gui tin nhan that bai
     * @param {*} message 
     */
    handleMessageSendError(message) {
        message.error = '';// this.t('send_msg_error');
        this.initListingNotification.push(message);
        if (this.renderViewCallback) {
            this.renderViewCallback();
        }
    }

    /**
     * gui commen
     * @param {*} msg 
     */
    sendMsg(msg) {
        //let me = `<b>Tôi</b> : ${msg}`;
        // let me = msg;
        // let date = new Date();
        // let message_obj = {
        //     text: msg,
        //     type: 'text',
        //     user_send: {
        //         id: (this.user && this.user.uid) ? this.user.uid : '',
        //         userid: UserInfo.getUserId(),
        //         fullname: UserInfo.getFullname(),
        //         avatar: UserInfo.getUserAvatar(),
        //         //avatar: avatar
        //     },
        //    // user_receive,
        //     message: me,
        //     createdAt: date.getTime(),
        //     content: me,
        //     direction: 2,
        //    // identification,//dinh danh vi du group-1873
        //     order: -1 * date.getTime()
        // }

        this.sendToFirebase(msg);
        // console.log("message_obj : ", message_obj);
        if (this.clearCommenCallback) {
            this.clearCommenCallback();
        }
    }

    /**
     * Lấy tông comment không phân trang
     */
    loadTotalComment() {
        if (!this.inited) {
            console.warn("Bạn phải gọi hàm init trước nếu không chức năng này không thể hoạt động");
            return;
        }
        ///this.chatRef.set("day la gia tri value");
        //this.chatRefData.parent.ref.num
        this.chatRef.on('value', (snapshot) => {
            var items = [];
            this.countComment = snapshot.numChildren();
            snapshot.forEach(child => {
                //var name = child.val().uid == this.user.uid ? this.user.name : name1;
                let message = child.val();
                if (message.id !== 'count_update') {
                    if (!this.nextChildKey) {
                        this.nextChildKey = message.order;
                        console.log("................nextChildKey : ", this.nextChildKey);
                    }
                    //console.log("listen item message : ", message);
                    message.type = message.type ? message.type : 'text';
                    let { user } = message;
                    if (this.user.uid && user.id === this.user.uid) {
                        message.direction = 2;
                    } else {
                        message.direction = 1;
                    }
                    items.push(message);
                }
            });
            this.listNotify = items.slice(0);
            this.startLoad = true;
            if (this.renderViewCallback) {
                this.renderViewCallback();
            }
        });
    }

    /**
     * lang nghe khi co su thay doi comment
     */
    listenForItems() {
        if (!this.inited) {
            console.warn("Bạn phải gọi hàm init trước nếu không chức năng này không thể hoạt động");
            return;
        }
        if (!this.startLoad) return;
        this.chatRef.off();
        this.chatRef.limitToLast(1).on("value", snap => {
            // get children as an array
            //var items = [];
            this.countComment++;
            snap.forEach(child => {
                //var name = child.val().uid == this.user.uid ? this.user.name : name1;
                let commen = child.val();
                if (commen.id !== 'count_update') {
                    console.log("listen item message : ", commen);
                    commen.type = commen.type ? commen.type : 'text';
                    this.listNotify.push(commen);
                }
            });
            if (this.renderViewCallback) {
                this.renderViewCallback();
            }
        });
    }
}

var notification = null;
if(!notification){
    notification = new NotificationManager();
}

module.exports.notification = notification;