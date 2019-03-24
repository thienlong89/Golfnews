import firebaseService from '../../Services/firebase';
import UserInfo from '../../Config/UserInfo';
import SignInFirebase from '../../Services/SignInFirebase';

export default class CommentManager {
    constructor() {
        this.listComments = [];
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
        this.countComment = 0;
        this.sendMsgSuccessCallback = null;
        //luu tong so comment
        this.listCommentTotal = [];

        this.fontSize = 14;

        this.renderUpdateBagdeComment = null;
    }

    setRenderUpdateBagdeComment(_render) {
        this.renderUpdateBagdeComment = _render;
    }

    /**
     * Ham khởi tạo
     * @param {*} name 
     * @param {*} id 
     */
    init(name, id, renderViewCallback, sendMsgSuccessCallback = null, clearCommenCallback = null) {
        // this.name = name;
        // this.id = id;
        this.create(name,id);
        this.user = UserInfo.getFuid();// firebaseService.auth().currentUs;
        if (!this.user) {
            // SignInFirebase.signInFirebase(UserInfo.getPhoneNumber(), '123123');
            return;
        }
        this.renderViewCallback = renderViewCallback;
        this.clearCommenCallback = clearCommenCallback;
        this.sendMsgSuccessCallback = sendMsgSuccessCallback;
        // this.chatRef = this.getRef().child('comments/' + this.generateId());

        // console.log("comment room id ", this.generateId());
        // this.chatRefData = this.chatRef;
        // this.inited = true;
    }

    create(name, id) {
        this.name = name;
        this.id = id;
        this.chatRef = this.getRef().child('comments/' + this.generateId());

        console.log("comment room id ", this.generateId());
        this.chatRefData = this.chatRef;
        this.inited = true;
    }

    /**
     * Update khi font thay doi
     * @param {*} _font 
     */
    changeFontComment(_font) {
        this.fontSize = _font;
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
     * update count 
     */
    setCount() {
        let obj = {
            id: 'count_update',
            count: 0
        }
        this.chatRef.push(obj);
    }

    /**
     * Gui tin nhan den firebase
     * @param {*} message 
     */
    sendToFirebase(message) {
        if (!this.inited) return;
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
        if (this.sendMsgSuccessCallback) {
            this.sendMsgSuccessCallback(message, false);
        }
    }

    /**
     * Xu ly khi gui tin nhan that bai
     * @param {*} message 
     */
    handleMessageSendError(message) {
        message.error = '';// this.t('send_msg_error');
        this.listComments.push(message);
        if (this.renderViewCallback) {
            this.renderViewCallback();
        }
        if (this.sendMsgSuccessCallback) {
            this.sendMsgSuccessCallback(message, true);
        }
    }

    /**
     * gui commen
     * @param {*} msg 
     */
    sendMsg(message_obj) {
        this.sendToFirebase(message_obj);
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
                // console.log("comments-------------------------------------- ",message);
                if (!this.nextChildKey) {
                    this.nextChildKey = message.order;
                    // console.log("................nextChildKey : ", this.nextChildKey);
                }
                //console.log("listen item message : ", message);
                message.type = message.type ? message.type : 'text';
                message.send_status = true;
                message.fontSize = this.fontSize;
                items.push(message);
            });
            // this.listComments = items.slice(0);
            this.listenForItems();
            this.listCommentTotal = items.slice(0);
            this.listCommentTotal = this.listCommentTotal.reverse();
            this.startLoad = true;
            if (this.renderViewCallback) {
                this.listComments = this.listCommentTotal.slice(0, 15);
                // this.listComments.reverse();
                this.renderViewCallback(this.listComments);
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
                    console.log("................nextChildKey : ", this.nextChildKey);
                }
                // console.log("listen item message : ", message);
                message.type = message.type ? message.type : 'text';
                items.push(message);
                this.startAt = message.createdAt;
                this.countComment++;
            });
            this.listComments = items.slice(0);
            this.startLoad = true;
            this.listenForItems();
            if (this.renderViewCallback) {
                this.renderViewCallback(this.listComments);
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
            });
            if (!items.length) return;
            items = items.reverse();
            this.listComments = items.concat(this.listComments);
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
    addToList(obj) {
        let objCheck = this.listComments.find(d => {
            // console.log("or target ", parseInt(obj.createdAt), parseInt(d.createdAt));
            return parseInt(d.createdAt) === parseInt(obj.createdAt);
        });
        // console.log("check duplicate  ", objCheck);
        if (objCheck) {
            this.isLoadPre = false;
            return false;
        }
        // obj.send_status = true;
        this.listComments.push(obj);
        return true;
    }

    offComment() {
        if (this.chatRef) this.chatRef.off();
    }

    /**
     * lang nghe khi co su thay doi comment
     */
    listenForItems() {
        console.log('...................... lang nghe comment : 0');
        if (!this.inited) {
            console.warn("Bạn phải gọi hàm init trước nếu không chức năng này không thể hoạt động");
            return;
        }
        console.log('...................... lang nghe comment : 1');
        if (!this.startLoad) return;
        this.chatRef.off();
        console.log('...................... lang nghe comment : 2');
        this.startAt = this.startAt ? this.startAt+1 : (new Date()).getTime();
        this.chatRef.orderByChild('createdAt').startAt(this.startAt).on("child_added", snap => {
            // get children as an array
            console.log('...................... lang nghe comment : 3');
            this.countComment++;
            //var name = child.val().uid == this.user.uid ? this.user.name : name1;
            let commen = snap.val();
            commen.type = commen.type ? commen.type : 'text';
            commen.fontSize = this.fontSize;
            commen.key = snap.key;
            // commen.send_status = true;
            let rerender = this.addToList(commen);
            // this.listComments.push(commen);
            if(this.renderUpdateBagdeComment){
                this.renderUpdateBagdeComment();
            }
            if (this.renderViewCallback && rerender) {
                this.renderViewCallback(this.listComments);
            }
        });
    }
}