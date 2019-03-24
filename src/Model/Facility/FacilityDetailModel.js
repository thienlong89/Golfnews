import BaseModel from '../../Core/Model/BaseModel';
import FacilityCourseItemModel from './FacilitiCourseItemModel';

class FacilityDetailModel extends BaseModel {

    constructor(baseComponent) {
        super(baseComponent);

        this.id = '';
        this.facility_id = '';
        this.description = '';
        this.total_rate = 0;
        this.total_user_rate = 0;
        this.list_img_review = [];
        this.video_review = '';
        this.Facility = '';
    }

    parseData(jsonData) {
        super.parseData(jsonData);

        if (this.data.hasOwnProperty('id')) {
            this.id = this.data['id'];
        }
        if (this.data.hasOwnProperty('facility_id')) {
            this.facility_id = this.data['facility_id'];
        }
        if (this.data.hasOwnProperty('description')) {
            this.description = this.data['description'];
        }
        if (this.data.hasOwnProperty('total_rate')) {
            this.total_rate = this.data['total_rate'];
        }
        if (this.data.hasOwnProperty('total_user_rate')) {
            this.total_user_rate = this.data['total_user_rate'];
        }
        if (this.data.hasOwnProperty('list_img_review')) {
            let list_img_review = this.data['list_img_review'];
            if (list_img_review instanceof Array) {
                for (let obj of list_img_review) {
                    this.list_img_review.push(obj);
                }
            }
        }

        if (this.data.hasOwnProperty('video_review')) {
            this.video_review = new VideoReview();
            this.video_review.parseData(this.data['video_review']);
        }
        if (this.data.hasOwnProperty('Facility')) {
            let facility = this.data['Facility'];
            this.Facility = new FacilityCourseItemModel();
            if (facility) {
                this.Facility.paserData(facility);
            }

        }
    }

    getImageList() {
        return this.list_img_review || [];
    }
}

class VideoReview {

    constructor() {
        this.id = '';
        this.image_link = '';
        this.review_id = '';
        this.video_link = '';
        this.type = '';
    }

    parseData(data) {

        if (data) {
            if (data.hasOwnProperty('id')) {
                this.id = data['id'];
            }
            if (data.hasOwnProperty('image_link')) {
                this.image_link = data['image_link'];
            }
            if (data.hasOwnProperty('review_id')) {
                this.review_id = data['review_id'];
            }
            if (data.hasOwnProperty('video_link')) {
                this.video_link = data['video_link'];
            }
            if (data.hasOwnProperty('type')) {
                this.type = data['type'];
            }
        }

    }

}

module.exports = FacilityDetailModel;