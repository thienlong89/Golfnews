import BaseModel from '../../Core/Model/BaseModel';

class CountryModel extends BaseModel{

    constructor(baseComponent){
        super(baseComponent);
       
        this.countryList = [];
    }

    parseData(jsonData){
        super.parseData(jsonData);
        
        if(this.data instanceof Array){
            this.countryList = this.data;
        }
    }

    getCountryList(){
        return this.countryList;
    }
}

module.exports = CountryModel;