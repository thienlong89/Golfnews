import BaseModel from '../../Core/Model/BaseModel';

class EHandicapCubItemModel {
    constructor(){}

    parseData(data){
        if(data.hasOwnProperty('name')){
            this.name = data['name'];
        }
        if(data.hasOwnProperty('id')){
            this.id = data['id'];
        }
        if(data.hasOwnProperty('code')){
            this.code = data['code'];
        }
    }

    getId(){
        return this.id;
    }

    getName(){
        return this.name;
    }

    getCode(){
        return this.code;
    }
}

export default class EHandicapClubModel extends BaseModel{
    constructor(baseComponent){
        super(baseComponent);
        this.listItem = [];
    }

    parseData(jsonData){
        super.parseData(jsonData);
        if(this.getErrorCode()===0){
            for(let d of this.data){
                let itemModel = new EHandicapCubItemModel();
                itemModel.parseData(d);
                this.listItem.push(itemModel);
            }
        }
    }

    getListItem(){
        return this.listItem;
    }
}