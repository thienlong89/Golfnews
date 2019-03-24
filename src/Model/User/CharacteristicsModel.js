import BaseModel from '../../Core/Model/BaseModel';

export default class CharacteristicsModel extends BaseModel{
    constructor(baseComponent){
        super(baseComponent);
    }

    parseData(jsonData){
        super.parseData(jsonData);
        console.log("jsonData",jsonData);
        if(this.getErrorCode()===0){
            if(!this.data){return;}
            if(this.data.hasOwnProperty('id')){
                this.id = this.data['id'];
            }
            if(this.data.hasOwnProperty('preferred_hand')){
                this.preferred_hand = this.data['preferred_hand'];
            }
            if(this.data.hasOwnProperty('size_span')){
                this.size_span = this.data['size_span'];
            }
            if(this.data.hasOwnProperty('size_coat')){
                this.size_coat = this.data['size_coat'];
            }
            if(this.data.hasOwnProperty('size_pants')){
                this.size_pants = this.data['size_pants'];
            }
            if(this.data.hasOwnProperty('size_shoes')){
                this.size_shoes = this.data['size_shoes'];
            }
            if(this.data.hasOwnProperty('sticks_are_in_use')){
                this.sticks_are_in_use = this.data['sticks_are_in_use'];
            }
        }
    }

    getId(){
        return this.id;
    }

    getPreferredHand(){
        return this.preferred_hand ? this.preferred_hand  : 0;
    }

    getSizeSpan(){
        return this.size_span ? this.size_span : 0;
    }

    getSizeCoat(){
        return this.size_coat ? this.size_coat : 0;
    }

    getSizePants(){
        return this.size_pants ? this.size_pants : 0;
    }

    getSizeShoes(){
        return this.size_shoes ? this.size_shoes : 0;
    }

    getSticks(){
        return this.sticks_are_in_use ? this.sticks_are_in_use : '';
    }
}