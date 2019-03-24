import BaseModel from '../../Core/Model/BaseModel';
import CountryModel from './CountryModel';

class ListCountryModel extends BaseModel {
    constructor(baseComponent) {
        super(baseComponent);
        this.countryList = [];
    }

    parseData(jsonData) {
        super.parseData(jsonData);
        if (this.data.hasOwnProperty('countries')) {
            let countries = this.data['countries'];
            for (let _obj of countries) {
                let country = new CountryModel();
                country.paserData(_obj);

                this.countryList.push(country);
            }
        }

    }

    getCountryList() {
        return this.countryList;
    }

}

module.exports = ListCountryModel;