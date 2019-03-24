import React from 'react';
import BaseComponent from "../../Core/View/BaseComponent";
import { View, StyleSheet, Keyboard, Dimensions } from "react-native";
import ChatSliderFont from '../Chats/ChatSliderFont';
import CustomLoadingView from '../Common/CustomLoadingView';
import ApiService from '../../Networking/ApiService';
import Networking from '../../Networking/Networking';
import CommentListView from '../Social/Item/CommentListView';
import ChatIconView from '../Chats/ChatIcons/ChatIconView';
let { width } = Dimensions.get('window');
import ChatBottomView from '../Chats/ChatBottomView';
import{scale} from '../../Config/RatioScale';
// import { setTimeout } from 'timers';
/**
 * luu cac tin nhan khong gui duoc
 */
const listCommentErrors = [];
/**
 * Man hinh comment dung chung
 */
export default class CommentScreen extends BaseComponent {
    constructor(props) {
        super(props);
        this.listMessage = [];

        this.isLoadPre = true;
        this.sendMsgCallback = null;
        this.sendMsgSuccessCallback = null;
        this.keyboardDidHideListener = null;
        this.loadMoreCallback = null;
        this.keyboardDidShowListener = null;

        this.hideHeaderCallback = null;
        this.updateFontCallback = null;

        this.onCameraClick = this.onCameraClick.bind(this);
        this.onLikeClick = this.onLikeClick.bind(this);
        this.onScaleFontClick = this.onScaleFontClick.bind(this);
        this.onSendClick = this.onSendClick.bind(this);
        this.onSendFileClick = this.onSendFileClick.bind(this);
        this.onItemSmileChat = this.onItemSmileChat.bind(this);
        this.onSmileClick = this.onSmileClick.bind(this);

        this.id_topic = 0;
        this.type_topic = '';

        this.key_icon_send = 0;
        this.icon_object_send = null;
    }

    scrollEnd() {
        this.commentListView.scrollEnd();
    }

    renderView(listData) {
        //let list = this.messager.listMessage;//socket.socket.listMessage;
        this.listMessage = listData;
        this.commentListView.fillData(listData);
    }

    /**
     * thiet lap id va type topic comment
     * @param {*} _id 
     * @param {*} _type 
     */
    setTypeTopic(_id, _type) {
        this.id_topic = _id;
        this.type_topic = _type;
    }

    sendPostTotalComment() {
        console.log("post total comment : ", this.id_topic, this.type_topic);
        if (!this.id_topic || !this.type_topic) {
            console.warn("Ban chua goi ham setTypeTopic nen khong the post duoc tong comment len sv : ",this.id_topic,this.type_topic);
            return;
        }
        let url = this.getConfig().getBaseUrl() + ApiService.post_total_comment(this.id_topic, this.type_topic);
        console.log('................................ url post comment : ',url);
        Networking.httpRequestGet(url, (jsonData) => {
            console.log('post total comment ', jsonData);
        }, () => {
            console.log('Khong post duoc tong comment');
        });
    }

    showLoading() {
        if (this.customLoading) {
            this.customLoading.showLoading();
        }
    }

    hideLoading() {
        if (this.customLoading) {
            this.customLoading.hideLoading();
        }
    }

    /**
     * Xu ly tin nhan neu ko gui duoc
     * @param {*} comment 
     * @param {*} error 
     */
    handleSendComment(comment, error) {
        console.log("______________________________handle comment ", comment, error);
        if (error) {
            listCommentErrors.push(comment);
        } else {
            this.sendPostTotalComment();
            let obj = this.listMessage.find(d => parseInt(d.createdAt) === parseInt(comment.createdAt));
            if (obj) {
                obj.send_status = true;
                let { icon, like } = comment;
                if (icon || like) return;
                this.commentListView.renderRow(comment);
                // this.commentListView.setState({});
            }
        }
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
        this.bottomComment.hideOrShowButtonSmartChat(false);
        this.chatSliderFont.fontSizeChoosenCallback = this.changeFont.bind(this);
    }

    /**
     * Ban phim an
     * @param {*} e 
     */
    _keyboardDidHide(e) {
        // this.keyboardView.handleKeyboard(0, false);
        this.bottomComment.hideOrShowButtonCamera(true);
        this.bottomComment.hideOrShowButtonImage(true);
        this.bottomComment.hideOrShowButtonScaleFont(true);
        this.bottomComment.hideOrShowButtonLike(true);
        this.bottomComment.hideOrShowButtonSend(false);
        setTimeout(() => {
            this.bottomComment.unexpandedInputText();
        }, 50);
    }

    /**
     * an man hinh chat
     */
    hideListIcon() {
        if (this.chatIcon) {
            this.chatIcon.hide();
        }
        if (this.bottomView) {
            this.bottomView.hideButtonSmile();
        }
    }

    /**
     * ban phim show
     * @param {*} e 
     */
    _keyboardDidShow(e) {
        this.chatIcon.hide();
        this.bottomComment.unChoosenBtnSmile();
        // this.keyboardView.handleKeyboard(e.endCoordinates.height, true);
        this.bottomComment.hideOrShowButtonCamera(false);
        this.bottomComment.hideOrShowButtonImage(false);
        this.bottomComment.hideOrShowButtonScaleFont(false);
        this.bottomComment.hideOrShowButtonLike(false);
        this.bottomComment.hideOrShowButtonSend(true);
        setTimeout(() => {
            this.commentListView.scrollEnd();
            this.bottomComment.expandedInputText();
        }, 50);
    }

    componentWillUnmount() {
        if (this.keyboardDidHideListener) this.keyboardDidHideListener.remove();
        if (this.keyboardDidShowListener) this.keyboardDidShowListener.remove();
    }

    loadMoreChat() {
        // if (!this.isLoadPre) return;
        //this.loadMessageMore();
        if (this.loadMoreCallback) {
            this.loadMoreCallback();
        }
    }

    changeFont(font) {
        this.listMessage.forEach(element => {
            element.fontSize = font
        });
        if (this.updateFontCallback) {
            this.updateFontCallback(font);
        }
        //this.cleared = true;
        this.renderView(this.listMessage);
    }

    // onBackClick() {
    //     let { navigation } = this.props;
    //     navigation.goBack();
    //     return true;
    // }
    checkActionBack(){
        if(this.chatIcon && this.chatIcon.isShow()){
            this.chatIcon.hide();
            return true;
        }
        return false;
    }

    onSendClick() {
        let textchat = this.bottomComment.getTextChat();
        if (!textchat.length) return;
        let date = new Date();
        let message_obj = {
            text: textchat,
            type: 'text',
            user: {
                id: (this.user && this.user.uid) ? this.user.uid : '',
                userid: this.getUserInfo().getUserId(),
                fullname: this.getUserInfo().getFullname(),
                avatar: this.getUserInfo().getUserAvatar(),
                //avatar: avatar
            },
            message: textchat,
            createdAt: date.getTime(),
            content: textchat,
            order: -1 * date.getTime(),
            fontSize: this.getFontSize()
        }
        this.listMessage.push(message_obj);
        this.renderView(this.listMessage);
        if (this.sendMsgCallback) {
            this.sendMsgCallback(message_obj);
            this.bottomComment.clearChat();
        }
        //this.sendMsg(textchat);
    }

    onSmileClick() {
        let show = this.bottomComment.isButtonSmileChoosen();
        this.isShowListIcon = true;
        this.bottomComment.blur();
        // this.chatIcon.showListIcon();
        if (this.hideHeaderCallback) {
            this.hideHeaderCallback(show);
        }

        this.chatIcon.showListIcon(() => {
            setTimeout(() => {
                this.commentListView.scrollEnd();
            }, 100);
        });
    }

    getFontSize() {
        return this.chatSliderFont.getFontSizeChoosen();
    }


    /**
    * upload anh len sever
    * @param {*} path 
    */
    sendUploadImageToSever(path, isResize = true) {
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.comment_upload();
        this.getAppUtil().upload(url, path, (jsonData) => {
            console.log("Da upload anh len sever ", jsonData);
            let { error_code, data } = jsonData;
            if (error_code === 0) {
                let image_paths = data.image_paths;
                if (image_paths.length) {
                    let obj = image_paths[0];
                    let _url = obj.url;
                    let { w, h } = self.getSizeImage(self.width_img, self.height_img, isResize);
                    // console.log(".................image w,h : ", w, h);
                    let message = self.createMessageImg(_url, w, h);
                    self.sendMsgCallback(message);
                    self.listMessage.push(message);
                    self.renderView(self.listMessage);
                    //self.sendToFirebase(message);
                }
            }
        }, (error) => {

        });
    }

    /**
     * Send file update len sever
     * @param {*} image 
     * @param {*} isResize 
     */
    sendFile(image, isResize = true) {
        this.width_img = image.width;
        this.height_img = image.height;
        this.sendUploadImageToSever(image.path, isResize);
    }

    /**
     * resize kich thuoc anh
     * @param {*} origin_width 
     * @param {*} origin_height 
     */
    getSizeImage(origin_width, origin_height, isResize = true) {
        let s_w = width - scale(100);
        if (!isResize) {
            if (origin_width < s_w) {
                return { w: origin_width, h: origin_height };
            } else {
                let w = s_w;
                let h = parseInt((w * origin_height) / origin_width);
                return { w, h };
            }
        }
        if (origin_height < s_w) {
            return { w: origin_width, h: origin_height };
        } else {
            let w = s_w;
            let h = parseInt((w * origin_width) / origin_height);
            return { w, h };
        }
    }

    createMessageImg(url, width, height) {
        let date = new Date();
        let time = date.getTime();
        // let time = moment(date, 'HH : mm');
        let message_obj = {
            type: 'img',
            url: url,
            width: width,
            height: height,
            user: {
                // id: this.user.uid ? this.user.uid : '',
                userid: this.getUserInfo().getUserId(),
                fullname: this.getUserInfo().getFullname(),
                avatar: this.getUserInfo().getUserAvatar(),
                //avatar: avatar
            },
            message: '',
            createdAt: time,
            order: -1 * time,
        }
        return message_obj;
    }

    async onCameraClick() {
        this.chatIcon.hide();
        setTimeout(async () => {
            let imageUri = await this.getAppUtil().onTakePhotoClick(false);
            this.sendFile(imageUri,true);
        }, 100)
    }

    async onSendFileClick() {
        this.chatIcon.hide();
        setTimeout(async () => {
            let imageUri = await this.getAppUtil().onImportGalleryClick(false);
            this.sendFile(imageUri,false);
        }, 100);
    }

    onScaleFontClick() {
        this.chatSliderFont.change(this.viewScalefont.bind(this));
    }

    viewScalefont() {
        this.commentListView.scrollEnd();
    }

    onItemSmileChat(data, type) {
        console.log("item 2 click : ", data, type);
        if (type !== 'in') return;
        if (type === 'in') {
            let date = new Date();
            let message_obj = {
                text: `[${data.name}]`,
                content: `[${data.name}]`,
                type: 'icon',
                user: {
                    // id: this.user.uid ? this.user.uid : '',
                    userid: this.getUserInfo().getUserId(),
                    fullname: this.getUserInfo().getFullname(),
                    avatar: this.getUserInfo().getUserAvatar(),
                    //avatar: avatar
                },
                icon: {
                    name: data.name,
                    species: data.species,
                    width: data.width ? data.width : undefined,
                    height: data.height ? data.height : undefined
                },
                message: `[${data.name}]`,
                createdAt: date.getTime(),
                order: -1 * date.getTime()
            }

            this.key_icon_send = message_obj.createdAt;

            message_obj.send_status = true;
            message_obj.finish_animation = true;

            this.icon_object_send = message_obj;
            this.listMessage.push(message_obj);
            this.renderView(this.listMessage);

            if (this.sendMsgCallback) {
                // console.log("out icon : ", this.icon_object_send);
                this.sendMsgCallback(message_obj);
            }
            this.key_icon_send = 0;
        } else if (type === 'out') {
            //send
            // let icon_object = this.listMessage.find(d => d.createdAt === this.key_icon_send);
            // if (this.icon_object_send) {
            //     this.icon_object_send.send_status = true;
            //     this.icon_object_send.finish_animation = true;
            //     this.commentListView.stopAnimationRow(this.icon_object_send);
            //     if (this.sendMsgCallback) {
            //         console.log("out icon : ", this.icon_object_send);
            //         this.sendMsgCallback(this.icon_object_send);
            //     }
            //     this.key_icon_send = 0;
            // }
        } else if (type === 'press') {
            // console.log("............................................press");
            // // let icon_object = this.listMessage.find(d => d.createdAt === this.key_icon_send);
            // if (this.icon_object_send) {
            //     this.commentListView.runAnimationRow(this.icon_object_send);
            // }
        }
    }

    onLikeClick(type) {
        if (!type) type = 'in';
        if (type !== 'in') return;
        console.log("item like click : ", type);

        if (type === 'in') {
            let date = new Date();
            let sizeLike = 70;
            // let time = moment(date, 'HH : mm');
            let message_obj = {
                text: `[like]`,
                content: `[like]`,
                type: 'like',
                user: {
                    // id: this.user.uid ? this.user.uid : '',
                    userid: this.getUserInfo().getUserId(),
                    fullname: this.getUserInfo().getFullname(),
                    avatar: this.getUserInfo().getUserAvatar(),
                },
                like: {
                    width: sizeLike,
                    height: sizeLike,
                },
                message: `[like]`,
                createdAt: date.getTime(),
                order: -1 * date.getTime()
            }
            this.icon_object_send = message_obj;
            message_obj.send_status = true;
            message_obj.finish_animation = true;
            this.listMessage.push(message_obj);
            this.renderView(this.listMessage);

            // this.commentListView.stopAnimationRow(this.icon_object_send);
            if (this.sendMsgCallback) {
                // console.log("out icon : ", this.icon_object_send);
                this.sendMsgCallback(message_obj);
            }
        } else if (type === 'out') {
            //send
            // this.icon_object_send.send_status = true;
            // this.icon_object_send.finish_animation = true;
            // this.commentListView.stopAnimationRow(this.icon_object_send);
            // if (this.sendMsgCallback) {
            //     console.log("out icon : ", this.icon_object_send);
            //     this.sendMsgCallback(this.icon_object_send);
            // }
        } else if (type === 'press') {
            // this.commentListView.runAnimationRow(this.icon_object_send);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <CommentListView ref={(commentListView) => { this.commentListView = commentListView; }}
                    style={styles.container} />
                <View style={styles.line}></View>
                <View style={{ height: 1, backgroundColor: '#ebebeb' }}></View>
                <ChatSliderFont ref={(chatSliderFont) => { this.chatSliderFont = chatSliderFont }} />
                <ChatBottomView ref={(bottomComment) => { this.bottomComment = bottomComment; }}
                    smileClickCallback={this.onSmileClick}
                    imageClickCallback={this.onSendFileClick}
                    cameraClickCallback={this.onCameraClick}
                    scaleFontClickCallback={this.onScaleFontClick}
                    sendClickCallback={this.onSendClick}
                    sendLikeClickCallback={this.onLikeClick}
                />
                <ChatIconView screenProps={{ onItemSmileChat: this.onItemSmileChat }} ref={(chatIcon) => { this.chatIcon = chatIcon; }} styles={{ backgroundColor: '#fff', width: width, borderTopColor: '#a3a3a3', borderTopWidth: 1, height: 280 }} />
                <CustomLoadingView ref={(customLoading) => { this.customLoading = customLoading; }} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },

    img_smile: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginLeft: 20
    },

    img_font_scale: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginLeft: 25
    },

    img_camera: {
        width: 40,
        height: 28,
        resizeMode: 'contain',
        marginLeft: 20
    },

    img_send: {
        width: 40,
        height: 30,
        resizeMode: 'contain',
        marginLeft: 7,
        marginRight: 10,
        marginTop: 10
    },

    view_bottom: {
        height: 30,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginBottom: 10
    },

    input: {
        flex: 1,
        color: '#a6a6a6',
        //fontSize : 14,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        marginLeft: 10,
        // marginRight : 50
    },

    body: {
        flex: 1,
        backgroundColor: '#DFECE5'
    },

    list_body: {
        flex: 1,
        borderBottomColor: '#ebebeb',
        borderBottomWidth: 1
    },

    line: {
        height: 10
    },

    view_input: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#fff',
        alignItems: 'center'
    }
});