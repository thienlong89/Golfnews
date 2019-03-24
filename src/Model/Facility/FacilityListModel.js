import BaseModel from '../../Core/Model/BaseModel';
import FacilityCourseItemModel from './FacilitiCourseItemModel';

class FacilityListModel extends BaseModel {
    constructor(baseComponent) {
        super(baseComponent);
        this.listFacility = [];
    }

    parseData(jsonData) {
        super.parseData(jsonData);
        if(this.data.hasOwnProperty('facilities')){
            let courses = this.data['facilities'];
            for(let _obj of courses){
                let itemModel = new FacilityCourseItemModel();
                itemModel.paserData(_obj);
                this.listFacility.push(itemModel);
            }
        }
        
    }

    getFacilityList() {
        return this.listFacility;
    }
}

module.exports = FacilityListModel;