import firebaseService from './firebase';
import SignInFirebase from './SignInFirebase';
import UserInfo from '../Config/UserInfo';
/**
 * class quan ly chuc nang chat
 */
export default class ReviewManager {
    constructor() {
        this.listReviews = [];
        this.chatRef = null;// this.getRef().child("commen/");//.orderByChild('order');
        this.chatRefData = null;// this.chatRef;//.orderByKey();
        this.renderViewCallback = null;
        this.clearCommenCallback = null;
        this.startLoad = true;
        this.limit_record = 20;
        this.nextChildKey = null;
        this.name = '';
        this.id = '';
        this.inited = false;
        this.handleSendReviewErrorCallback = null;
    }

    /**
     * Huy view
     */
    destroy() {
        this.listReviews = [];
        this.chatRef = null;
        this.chatRefData = null;
        this.renderViewCallback = null;
        this.clearCommenCallback = null;
        this.startLoad = true;
        this.limit_record = 20;
        this.nextChildKey = null;
        this.name = '';
        this.id = '';
        this.inited = false;
        this.handleSendReviewErrorCallback = null;
    }

    /**
     * lang nghe tin nhan khi co user push
     */
    initListingMsg() {
        //lang nghe khi co tin nhan ve
        this.chatRef = this.getRef().child('chat');
        console.log("initListingMSG---");
        //console.log("comment room id ", this.generateId());
        this.chatRefData = this.chatRef;
        this.inited = true;
        this.chatRef.once("child_added", snap => {
            // get children as an array
            //var items = [];
            snap.forEach(child => {
                //var name = child.val().uid == this.user.uid ? this.user.name : name1;
                let commen = child.val();
            });
            if (this.renderViewCallback) {
                this.renderViewCallback();
            }
        });
    }

    /**
     * Ham khởi tạo
     * @param {*} name 
     * @param {*} id 
     */
    init(name, id, renderViewCallback, clearCommenCallback = null) {
        this.name = name;
        this.id = id;
        this.user = UserInfo.getFuid();// firebaseService.auth().currentUs;
        if (!this.user) {
            // SignInFirebase.signInFirebase(UserInfo.getPhoneNumber(), '123123');
            console.error('Khong khoi tao duoc tai khoan firebase')
            return;
        }
        this.renderViewCallback = renderViewCallback;
        this.clearCommenCallback = clearCommenCallback;
        this.chatRef = this.getRef().child('reviews/' + this.generateId());
        console.log("comment room id ", this.generateId());
        this.chatRefData = this.chatRef;
        this.inited = true;

        this.loadMessanger();
        // this.listenForItems();
    }

    /**
     * sinh id lưu trữ comment
     * @param {*} name tên của dạng comment ví dụ flight,club
     * @param {*} id id của dạng đó ví dụ flight_id
     */
    generateId() {
        return `${this.name}-${this.id}`;
    }

    getRef() {
        return firebaseService.database().ref();
    }

    /**
     * Huy lắng nghe tin nhắn
     */
    offListeningChat() {
        this.chatRef.off();
    }

    /**
     * Gui tin nhan den firebase
     * @param {*} message 
     */
    sendToFirebase(message) {
        if(!this.inited) return;
        this.chatRef.push().set(message, (error) => {
            if (error) {
                if (this.handleSendReviewErrorCallback) {
                    this.handleSendReviewErrorCallback(message, true);
                }
                console.log("Khong gui dc tin nhan den firebase ", error);
            } else {
                if (this.handleSendReviewErrorCallback) {
                    this.handleSendReviewErrorCallback(message, false);
                }
                console.log("gui tin nhan den firebase thanh cong!!!!!!");
            }
        });
    }

    /**
     * gui commen
     * @param {*} msg 
     */
    sendMsg(msg) {
        this.sendToFirebase(msg);
        console.log("message_obj : ", msg);
        if (this.clearCommenCallback) {
            this.clearCommenCallback();
        }
    }

    /**
     * Lấy tông comment không phân trang
     */
    loadTotalChat() {
        if (!this.inited) {
            console.warn("Bạn phải gọi hàm init trước nếu không chức năng này không thể hoạt động");
            return;
        }
        ///this.chatRef.set("day la gia tri value");
        //this.chatRefData.parent.ref.num
        this.chatRef.on('value', (snapshot) => {
            var items = [];
            // this.countComment = snapshot.numChildren();
            snapshot.forEach(child => {
                //var name = child.val().uid == this.user.uid ? this.user.name : name1;
                let message = child.val();
                // if (message.id !== 'count_update') {
                if (!this.nextChildKey) {
                    this.nextChildKey = message.order;
                    console.log("................nextChildKey : ", this.nextChildKey);
                }
                //console.log("listen item message : ", message);
                message.type = message.type ? message.type : 'text';
                let { user } = message;
                if (user.userid.toLowerCase() === UserInfo.getUserId().toLowerCase()) {
                    message.direction = 2;
                } else {
                    message.direction = 1;
                }
                items.push(message);
                // }
            });
            this.listReviews = items.slice(0);
            this.startLoad = true;
            if (this.renderViewCallback) {
                this.renderViewCallback(this.listReviews);
            }
        });
    }

    /**
     * load 10 comment dau tien
     */
    loadMessanger() {
        if (!this.inited) {
            console.warn("Bạn phải gọi hàm init trước nếu không chức năng này không thể hoạt động");
            return;
        }
        ///this.chatRef.set("day la gia tri value");
        //this.chatRefData.parent.ref.num
        this.chatRef.limitToLast(this.limit_record).on('value', (snapshot) => {
            var items = [];
            snapshot.forEach(child => {
                //var name = child.val().uid == this.user.uid ? this.user.name : name1;
                let message = child.val();
                if (!this.nextChildKey) {
                    this.nextChildKey = message.order;
                    // console.log("................nextChildKey : ", this.nextChildKey);
                }
                // console.log("listen item message : ", message);
                message.type = message.type ? message.type : 'text';
                this.listReviews.push(message);
                // items.push(message);
            });
            // this.listReviews = items.slice(0);
            console.log("listen item message : ", this.listReviews);
            this.startLoad = true;
            if (this.renderViewCallback) {
                this.renderViewCallback(this.listReviews);
            }
            //dang ky lang nghe
            this.listenForItems();
        });
    }

    /**
     * load trang comment tiep theo
     */
    loadMessageMore() {
        if (!this.inited) {
            console.warn("Bạn phải gọi hàm init trước nếu không chức năng này không thể hoạt động");
            return;
        }
        this.chatRef.off();
        let key = this.nextChildKey;
        this.nextChildKey = null;
        this.chatRef.startAt(key, 'order').orderByChild('order').limitToFirst(this.limit_record).on('value', (snapshot) => {
            var items = [];
            //this.nextChildKey = snapshot.getKey();
            snapshot.forEach(child => {
                //var name = child.val().uid == this.user.uid ? this.user.name : name1;
                let message = child.val();
                // if (message.id !== 'count_update') {

                if (!this.nextChildKey) {
                    this.nextChildKey = message.order;
                    if (key === this.nextChildKey) {
                        console.log(".....................tim thay key giong nhau ", this.nextChildKey);
                        return;
                    }
                    console.log("................nextChildKey more : ", this.nextChildKey);
                }
                //console.log("listen item message : ", message);
                message.type = message.type ? message.type : 'text';
                let { user } = message;
                if (user.userid.toLowerCase() === UserInfo.getUserId().toLowerCase()) {
                    message.direction = 2;
                } else {
                    message.direction = 1;
                }
                this.addToList(items, message);
                // }
            });
            if (!items.length) return;
            items = items.reverse();
            this.listReviews = items.concat(this.listReviews);
            this.startLoad = true;
            if (this.renderViewCallback) {
                this.renderViewCallback(this.listReviews);
            }
        });
    }

    /**
     * add item vao list co kiem tra bị duplicate
     * @param {*} listTemp 
     * @param {*} obj 
     */
    addToList(listTemp, obj) {
        let objCheck = this.listReviews.find(d => {
            // console.log("or target ", parseInt(obj.createdAt), parseInt(d.createdAt));
            return (parseInt(d.order) === parseInt(obj.order));
        });
        console.log("check duplicate  ", objCheck);
        if (objCheck) {
            this.isLoadPre = false;
            return;
        }
        listTemp.push(obj);
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
        let item = [];
        this.chatRef.on("child_added", snap => {
            // get children as an array
            //var name = child.val().uid == this.user.uid ? this.user.name : name1;
            let chat = snap.val();
            // console.log("listen item message : ", chat);
            chat.type = chat.type ? chat.type : 'text';
            chat.key = snap.key;
            this.addToList(item,chat);
            // this.listReviews.push(chat);
            if (this.renderViewCallback && item.length) {
                this.listReviews.push(items[0]);
                this.renderViewCallback(this.listReviews);
            }
        });
    }
}