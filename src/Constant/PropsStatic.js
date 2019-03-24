/**
 * Chỉ lưu phục vụ chức năng đăng nhập máy khác
 */
class PropsStatic {
    static staticNavigator = null;
    static mainComponent = null;
    static appSceneNavigator = null;
    static parentNavigator = null;

    static callFun = null;

    static objectFunc = {};

    static globalDialog = null;
    static dialogMessage = null;

    static popupShare = null;
    static popupShareInNews = null;

    static componentInfoApp = null;

    static setComponentInfoApp(_com){
        this.componentInfoApp = _com;
    }

    static getComponentInfoApp(){
        return this.componentInfoApp;
    }
    /**
     * Hàm transfer chát có tham số là nội dung tin nhắn
     */
    static funcTransferChat = null;

    static setFuncTransferChat(_fun){
        this.funcTransferChat = _fun;
    }

    static getFuncTransferChat(){
        return this.funcTransferChat;
    }

    static setPopupShare(_popup){
        this.popupShare = _popup;
    }

    static getPopupShare(){
        return this.popupShare;
    }

    static setPopupShareInNews(_popup){
        this.popupShareInNews = _popup;
    }

    static getPopupShareInNews(){
        return this.popupShareInNews;
    }

    /**
     * Dialog thông báo(chỉ có nội dung thông báo và 1 button tắt app)
     * @param {*} _dialog 
     */
    static setDialogMessageApp(_dialog){
        this.dialogMessage = _dialog;
    }

    static getDialogMessageApp(){
        return this.dialogMessage;
    }

    static setDialogApp(_dialog){
        this.globalDialog = _dialog;
    }

    static getDialogApp(){
        return this.globalDialog;
    }

    static setBadgeChat(_render){
        this.callFun = _render;
    }

    static getBadgeChat(){
        return this.callFun;
    }

    static setCallFun(key, _call){
        if(!this.objectFunc.hasOwnProperty(key)){
            this.objectFunc[key] = _call;
        }
        // this.callFun = _call;
    }

    static getObjectCallFun(){
        return this.objectFunc;
    }

    static setAppSceneNavigator(_navigator){
        this.appSceneNavigator = _navigator;
    }

    static getAppSceneNavigator(){
        return this.appSceneNavigator;
    }

    //other relevant code here
    static setNavigator(navigator){
    	staticNavigator = navigator;
    }

    static getNavigator() {
        return staticNavigator;
    }

    static setMainAppComponent(_app){
        this.mainComponent = _app;
    }

    static getMainAppComponent(){
        return this.mainComponent;
    }

    static setParentNavigator(parentNavigator){
        this.parentNavigator = parentNavigator;
    }

    static getParentNavigator(){
        return this.parentNavigator;
    }
}
module.exports = PropsStatic