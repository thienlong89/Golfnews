import firebaseService from './firebase';
import UserInfo from '../Config/UserInfo';
import SignInFirebase from './SignInFirebase';

/**
 * class quan ly cac review san
 */
export default class EvalutionManager {
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
        this.countComment = 0;

        this.sendReviewsErrorCallback = null;
    }

    /**
     * Ham khởi tạo
     * @param {*} name 
     * @param {*} id 
     */
    init(name, id, renderViewCallback, clearCommenCallback = null) {
        this.name = name;
        this.id = id;
        this.user = UserInfo.getFuid();// firebaseService.auth().currentU;
        if (!this.user) {
            //SignInFirebase.signInFirebase(UserInfo.getPhoneNumber(), '123123');
            return;
        }
        this.renderViewCallback = renderViewCallback;
        this.clearCommenCallback = clearCommenCallback;
        this.chatRef = this.getRef().child('revews/' + this.generateId());
        console.log("comment room id ", this.generateId());
        this.chatRefData = this.chatRef;
        this.inited = true;
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
                // this.handleMessageSendError(message);
                if(this.sendReviewsErrorCallback){
                    this.sendReviewsErrorCallback(message,true);
                }
                console.log("Khong gui dc tin nhan den firebase ", error);
            } else {
                // this.handleMessageSendSucces(message);
                this.sendReviewsErrorCallback(message,false);
                console.log("gui tin nhan den firebase thanh cong!!!!!!");
            }
            // this.handleMessageSendError(message);
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
     * Lấy tông review không phân trang
     */
    loadTotalReview() {
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
                if (message.id !== 'count_update') {
                    if (!this.nextChildKey) {
                        this.nextChildKey = message.order;
                        console.log("................nextChildKey : ", this.nextChildKey);
                    }
                    //console.log("listen item message : ", message);
                    message.type = message.type ? message.type : 'text';
                    items.push(message);
                }
            });
            this.listReviews = items.slice(0);
            this.startLoad = true;
            if (this.renderViewCallback) {
                this.renderViewCallback();
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
                if (message.id !== 'count_update') {
                    if (!this.nextChildKey) {
                        this.nextChildKey = message.order;
                        console.log("................nextChildKey : ", this.nextChildKey);
                    }
                    console.log("listen item message : ", message);
                    message.type = message.type ? message.type : 'text';
                    items.push(message);
                }
            });
            this.listReviews = items.slice(0);
            this.startLoad = true;
            if (this.renderViewCallback) {
                this.renderViewCallback();
            }
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
                if (message.id !== 'count_update') {

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
                    this.addToList(items, message);
                }
            });
            if (!items.length) return;
            items = items.reverse();
            this.listReviews = items.concat(this.listReviews);
            this.startLoad = true;
            if (this.renderViewCallback) {
                this.renderViewCallback();
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
            console.log("or target ", parseInt(obj.order), parseInt(d.order));
            return parseInt(d.order) === parseInt(obj.order);
        });
        console.log("check duplicate  ", objCheck);
        if (objCheck) {
            this.isLoadPre = false;
            return;
        }
        listTemp.push(obj);
    }

    offListenningReview() {
        if (this.chatRef) this.chatRef.off();
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
            // this.countComment++;
            snap.forEach(child => {
                //var name = child.val().uid == this.user.uid ? this.user.name : name1;
                let commen = child.val();

                console.log("listen item message : ", commen);
                commen.type = commen.type ? commen.type : 'text';
                this.listReviews.push(commen);
            });
            if (this.renderViewCallback) {
                this.renderViewCallback();
            }
        });
    }
}