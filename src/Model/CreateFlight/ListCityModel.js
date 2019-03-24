import BaseModel from '../../Core/Model/BaseModel';
import CityModel from './CityModel';

class ListCityModel extends BaseModel {
    constructor(baseComponent) {
        super(baseComponent);
        this.cityList = [];
    }

    parseData(jsonData) {
        super.parseData(jsonData);
        if (this.data.hasOwnProperty('cities')) {
            let cities = this.data['cities'];
            for (let _obj of cities) {
                let city = new CityModel();
                city.paserData(_obj);

                this.cityList.push(city);
            }
        }
        if(this.data.hasOwnProperty('result')){
            let cities = this.data['result'];
            for (let _obj of cities) {
                let city = new CityModel();
                city.paserData(_obj);

                this.cityList.push(city);
            }
        }

    }

    getCityList() {
        return this.cityList;
    }

}

module.exports = ListCityModel;