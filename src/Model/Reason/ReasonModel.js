import BaseModel from '../../Core/Model/BaseModel';

export default class ReasonModel extends BaseModel{
    constructor(baseComponent){
        super(baseComponent);
    }

    parseData(jsonData){
        super.parseData(jsonData);
        if(this.getErrorCode() === 0){
            if(this.data.hasOwnProperty('reasons')){
                this.list_reason = this.data['reasons'];
            }
        }
    }

    getListReason(){
        return this.list_reason ? this.list_reason : [];
    }
}