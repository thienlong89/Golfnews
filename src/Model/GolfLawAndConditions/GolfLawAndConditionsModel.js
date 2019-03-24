import BaseModel from '../../Core/Model/BaseModel';

class TermItemModel {
    constructor() {

    }

    parseData(data) {
        if (data.hasOwnProperty('id')) {
            this.id = data['id'];
        }
        if (data.hasOwnProperty('title')) {
            this.title = data['title'];
        }
        if (data.hasOwnProperty('created_at')) {
            this.created_at = data['created_at'];
        }
        if (data.hasOwnProperty('updated_at')) {
            this.updated_at = data['updated_at'];
        }
    }

    getTitle() {
        return this.title ? this.title : '';
    }

    getId() {
        return this.id ? this.id : '';
    }

    getCreateAt() {
        return this.created_at ? this.created_at : '';
    }

    getUpdateAt() {
        return this.updated_at ? this.updated_at : '';
    }
}

export default class GolfLawAndConditionsModel extends BaseModel {
    constructor(baseComponent) {
        super(baseComponent);
        this.list_item = [];
    }

    parseData(jsonData) {
        super.parseData(jsonData);
        if (this.getErrorCode() === 0) {
            if (this.data.hasOwnProperty('groups')) {
                this.data = this.data['groups'];
                for (let d of this.data) {
                    let itemModel = new TermItemModel();
                    itemModel.parseData(d);
                    this.list_item.push(itemModel);
                }
            }
        }
    }

    getListItem() {
        return this.list_item;
    }
}