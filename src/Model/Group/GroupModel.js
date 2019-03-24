import BaseModel from '../../Core/Model/BaseModel';
import GroupItemModel from './GroupItemModel';

class GroupModel extends BaseModel {
    constructor(baseComponent) {
        super(baseComponent);
        this.listGroup = [];
    }

    parseData(jsonData) {
        super.parseData(jsonData);
        if (this.getErrorCode() === 0) {
            if (this.data.hasOwnProperty('groups')) {
                let array_group = this.data['groups'];
                for (let obj of array_group) {
                    let itemModel = new GroupItemModel();
                    itemModel.paserData(obj);
                    this.listGroup.push(itemModel);
                }
            }
        }
    }

    getListGroup() {
        return this.listGroup ? this.listGroup : [];
    }
}

module.exports = GroupModel;