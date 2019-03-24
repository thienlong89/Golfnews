import BaseModel from '../../Core/Model/BaseModel';
import NewsItemModel from './NewsItemModel';

export default class NewsModel extends BaseModel {
    constructor(baseComponent) {
        super(baseComponent);
        this.list_item = [];
        this.list_id_remove = [];
    }

    parseData(jsonData) {
        super.parseData(jsonData);
        if (this.getErrorCode() === 0) {
            if (this.data.hasOwnProperty('magazines')) {
                let magazines = this.data['magazines'];
                for (let d of magazines) {
                    let itemModel = new NewsItemModel();
                    itemModel.parseData(d);
                    // console.log("item model : ",itemModel);
                    this.list_item.push(itemModel);
                }
            }
            if (this.data.hasOwnProperty('list_id_remove')) {
                this.list_id_remove = this.data['list_id_remove'];
            }

            if (this.data.hasOwnProperty('magazine')) {
                this.data = this.data['magazine'];
            }

            let length = this.data.length;
            if(typeof this.data === 'object' && length){
                for (let d of this.data) {
                    let itemModel = new NewsItemModel();
                    itemModel.parseData(d);
                    // console.log("item model : ",itemModel);
                    this.list_item.push(itemModel);
                }
            }
        }
    }

    getListNews() {
        return this.list_item;
    }

    getListRemove() {
        return this.list_id_remove;
    }
}