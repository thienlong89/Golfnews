import BaseModel from '../../Core/Model/BaseModel';
import FacilityCourseItemModel from './FacilitiCourseItemModel';

class FacilityCourseModel extends BaseModel {
    constructor(baseComponent) {
        super(baseComponent);
        this.listFacilityCourse = [];
    }

    parseData(jsonData) {
        super.parseData(jsonData);
        if(this.data.hasOwnProperty('courses')){
            let courses = this.data['courses'];
            for(let _obj of courses){
                let itemModel = new FacilityCourseItemModel();
                itemModel.paserData(_obj);
                this.listFacilityCourse.push(itemModel);
            }
        }
        if(this.data.hasOwnProperty('facilities')){
            let facilities = this.data['facilities'];
            for(let _obj of facilities){
                let itemModel = new FacilityCourseItemModel();
                itemModel.paserData(_obj);
                this.listFacilityCourse.push(itemModel);
            }
        }
    }

    getListFacilityCourse() {
        return this.listFacilityCourse;
    }
}

module.exports = FacilityCourseModel;