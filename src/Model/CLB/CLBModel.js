import BaseModel from '../../Core/Model/BaseModel';
import CLBItemModel from './CLBItemModel';

class CLBModel extends BaseModel {
    constructor(baseComponent) {
        super(baseComponent);
        this.listCLB = [];
    }

    parseData(jsonData) {
        super.parseData(jsonData);
        if (this.getErrorCode() === 0) {
            if (this.data.hasOwnProperty('clubs')) {
                let array_clb = this.data['clubs'];
                let i = 0, length = array_clb.length;
                for (; i < length; i++) {
                    let item = array_clb[i];
                    let itemModel = new CLBItemModel();
                    itemModel.paserData(item);
                    this.listCLB.push(itemModel);
                }
            }

            if (this.data instanceof Array) {
                for(let obj of this.data){
                    let itemModel = new CLBItemModel();
                    itemModel.paserData(obj);
                    this.listCLB.push(itemModel);
                }
            }
        }
    }

    getListCLB() {
        return this.listCLB ? this.listCLB : [];
    }
}

module.exports = CLBModel;