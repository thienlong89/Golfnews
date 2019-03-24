/**
 * model chứa các term trong group
 * màn hinh điều khoản và luật golf thì có nhiều group
 */

import BaseModel from '../../Core/Model/BaseModel';

class TermConditionItemModel{
    constructor(){

    }

    parseData(data){
        if(data.hasOwnProperty('id')){
            this.id = data['id'];
        }
        if(data.hasOwnProperty('group_id')){
            this.group_id = data['group_id'];
        }
        if(data.hasOwnProperty('title')){
            this.title = data['title'];
        }
        if(data.hasOwnProperty('url')){
            this.url = data['url'];
        }
        if(data.hasOwnProperty('created_at')){
            this.created_at = data['created_at'];
        }
        if(data.hasOwnProperty('updated_at')){
            this.updated_at = data['updated_at'];
        }
    }

    getId(){
        return this.id ? this.id : '';
    }

    getGroupId(){
        return this.group_id ? this.group_id : '';
    }

    getTitle(){
        return this.title ? this.title : '';
    }

    getUrl(){
        return this.url ? this.url : '';
    }

    getUpdateAt(){
        return this.updated_at ? this.updated_at : '';
    }

    getCreateAt(){
        return this.created_at ? this.created_at : '';
    }
}

export default class TermConditionModel extends BaseModel{
    constructor(baseComponent){
        super(baseComponent);
        this.list_item = [];
    }

    parseData(jsonData){
        super.parseData(jsonData);
        if(this.getErrorCode() === 0){
            if(this.data.hasOwnProperty('terms')){
                this.data = this.data['terms'];
                for(let d of this.data){
                    let itemModel = new TermConditionItemModel();
                    itemModel.parseData(d);
                    this.list_item.push(itemModel);
                }
            }
        }
    }

    getListItem(){
        return this.list_item;
    }
}