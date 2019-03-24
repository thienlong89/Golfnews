import BaseModel from '../../Core/Model/BaseModel';

class CertificateItemModel{
    constructor(){

    }

    parseData(data){
        if(data.hasOwnProperty('gross')){
            this.gross = data['gross'];
        }
        if(data.hasOwnProperty('date_played')){
            this.date_played = data['date_played'];
        }
        if(data.hasOwnProperty('is_selected')){
            this.is_selected = data['is_selected'];
        }
    }

    getGross(){
        return this.gross ? this.gross : '';
    }

    getDatePlayed(){
        return this.date_played ? this.date_played : '';
    }

    isSelected(){
        return this.is_selected ? this.is_selected : false;
    }
}

export default class CertificateModel extends BaseModel{
    constructor(baseComponent){
        super(baseComponent);
        this.list_items = [];
        this.user = {};
    }

    parseData(jsonData){
        super.parseData(jsonData);
        if(this.getErrorCode() === 0){
            if(this.data.hasOwnProperty('title')){
                this.title = this.data['title'];
            }
            if(this.data.hasOwnProperty('user')){
                this.user = this.data['user'];
            }
            if(this.data.hasOwnProperty('rounds')){
                let rounds = this.data['rounds'];
                for(let round of rounds){
                    let itemModel = new CertificateItemModel();
                    itemModel.parseData(round);
                    this.list_items.push(itemModel);
                }
            }
        }
    }

    getTitle(){
        return this.title ? this.title : '';
    }

    getListItem(){
        return this.list_items;
    }

    getUser(){
        return this.user;
    }
}