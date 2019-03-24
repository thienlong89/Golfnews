import BaseModel from '../../Core/Model/BaseModel';
import NotifyItemModel from './NotifyItemModel';
//fake
//const msg = "C\u1ED9ng \u0111\u1ED3ng Java Vi\u1EC7t Nam";



export default class NotificationNoCacheModel extends BaseModel {
    constructor(baseComponent) {
        super(baseComponent);
        this.list_item = [];
        this.list_id_remove = [];
    }

    parseData(jsonData) {
        super.parseData(jsonData);
        if (this.getErrorCode() === 0) {
            for (let item of this.data) {
                let itemModel = new NotifyItemModel();
                itemModel.parseData(item);
                this.list_item.push(itemModel);
            }
            // if(this.data.hasOwnProperty('notifications')){
            //     this.data = this.data['notifications'];
            //     for(let d of this.data){
            //         let itemModel = new NotifyItemModel();
            //         itemModel.parseData(d);
            //         this.list_item.push(itemModel);
            //     }
            // }
            // if(this.data.hasOwnProperty('requests')){
            //     this.data = this.data['requests'];
            //     for(let d of this.data){
            //         let itemModel = new NotifyItemModel();
            //         itemModel.parseData(d);
            //         this.list_item.push(itemModel);
            //     }
            // }

        }
    }

    getListNotify() {
        return this.list_item;
    }

    // getListIdRemove() {
    //     return this.list_id_remove;
    // }
}