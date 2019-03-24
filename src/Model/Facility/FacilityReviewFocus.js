import BaseModel from '../../Core/Model/BaseModel';
import FacilityCourseItemModel from './FacilitiCourseItemModel';

class FacilityReviewFocus extends BaseModel {

    constructor(baseComponent) {
        super(baseComponent);

        this.facilityList = [];
    }

    parseData(jsonData) {
        super.parseData(jsonData);

        if (this.data instanceof Array) {
            for (let obj of this.data) {
                let facility = new FacilityReview();
                facility.parseData(obj);
                this.facilityList.push(facility);
            }
        }

    }

    getFacilityList() {
        return this.facilityList || [];
    }
}

class FacilityReview {

    constructor() {
        this.img_review = '';
        this.facility = '';
    }

    parseData(data) {

        if (data.hasOwnProperty('img_review')) {
            this.img_review = data['img_review'];
        }
        if (data.hasOwnProperty('facility')) {
            let facility = data['facility'];
            this.Facility = new FacilityCourseItemModel();
            if (facility) {
                this.Facility.paserData(facility);
            }

        }

    }

}

module.exports = FacilityReviewFocus;