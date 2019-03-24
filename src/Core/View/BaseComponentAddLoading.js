import React from 'react';
import {View} from 'react-native';
import LoadingView from '../Common/LoadingView';
import PopupTimeOutView from '../Common/PopupTimeOutView';
import CustomLoading from '../../Components/Common/CustomLoadingView';
import BaseComponent from './BaseComponent';
import BaseComponentAddBackHandler from './BaseComponentAddBackHandler';
const TIME_OUT_FOR_REQUEST = 30000;//30 giây

export default class BaseComponentAddLoading extends BaseComponentAddBackHandler{
    constructor(props){
        super(props);
    }

    /**
     * Hiển thị loading internal có check timeout
     */
    showModalLoading(){
        if(!this.modalLoading) return;
        this.modalLoading.showLoading();
        this.setModalTimeOut();
    }

    /**
     * Ẩn hiển thị loading internal tắt cả timeout
     */
    hideModalLoading(){
        if(!this.modalLoading) return;
        this.modalLoading.hideLoading();
        if (this.modalInterval) {
            clearInterval(this.modalInterval);
        }
    }

    /**
     * Hàm set thời gian timeout của một request lên sever
     * @param {number} time - thời gian timeout
     * @default {TIME_OUT_FOR_REQUEST}
     */
    setModalTimeOut(time = TIME_OUT_FOR_REQUEST) {
        this.modalInterval = setInterval(() => {
            if (this.modalInterval) {
                this.modalInterval.hideLoading();
            }
            clearInterval(this.modalInterval);
        }, time);
    }

    renderModalLoading() {
        return (
            <View>
                <LoadingView ref={(loading) => { this.modalLoading = loading; }} />
                <PopupTimeOutView ref={(popupTimeOut) => { this.dialogTimeOut = popupTimeOut; }} />
            </View>
        );
    }

    /**
     * render component loading dạng absolute view
     * @param {Number} top khoảng cách đến view chả
     */
    renderCustomLoading(top=0){
        return(
            // <CustomLoading top={top} ref={(customLoading)=>{this.customLoading = customLoading;}}/>
            <LoadingView ref={(customLoading) => { this.customLoading = customLoading; }}
                    isShowOverlay={false} />
        )
    }

    /**
     * Hiển thị loading internal có check timeout
     */
    showCustomLoading(){
        if(!this.customLoading) return;
        this.customLoading.showLoading();
        this.setCustomLoadingTimeOut();
    }

    /**
     * Ẩn hiển thị loading internal tắt cả timeout
     */
    hideCustomLoading(){
        if(!this.customLoading) return;
        this.customLoading.hideLoading();
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    /**
     * Hàm set thời gian timeout của một request lên sever
     * @param {number} time - thời gian timeout
     * @default {TIME_OUT_FOR_REQUEST}
     */
    setCustomLoadingTimeOut(time = TIME_OUT_FOR_REQUEST) {
        this.interval = setInterval(() => {
            if (this.customLoading) {
                this.customLoading.hideLoading();
            }
            clearInterval(this.customLoading);
        }, time);
    }
}