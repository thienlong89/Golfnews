import BaseModel from '../../Core/Model/BaseModel';
import UserProfile from '../Home/UserProfileModel';

class HandicapFacilityModel extends BaseModel {
    constructor(baseComponent) {
        super(baseComponent);
        this.listHandicapFacility = [];
        this.course_handicap = [];
    }

    parseData(jsonData) {
        super.parseData(jsonData);
        if (this.data.hasOwnProperty('courses_handicap')) {
            this.course_handicap = this.data['courses_handicap'];
            for (let _obj of this.course_handicap) {
                let userProfile = new UserProfile();
                let handicapFacilityItem = new HandicapScore();
                if(_obj.hasOwnProperty('user')){
                    userProfile.parseData(_obj['user']);
                }
                if(_obj.hasOwnProperty('display_course')){
                    handicapFacilityItem.parseData(_obj['display_course']);
                }
                let item = new HandicapItem(userProfile, handicapFacilityItem);
                this.listHandicapFacility.push(item);
            }
        }

    }

    getListHandicapFacility() {
        return this.listHandicapFacility;
    }

    getCourseHandicap(){
        return this.course_handicap;
    }
}

class HandicapScore {
    constructor() {
        this.tee = '';
        this.value = 0;
    }

    parseData(jsonData) {
        if (jsonData.hasOwnProperty('tee')) {
            this.tee = jsonData['tee'];
        }
        if (jsonData.hasOwnProperty('value')) {
            this.value = jsonData['value'];
        }
    }

    getTee(){
        return this.tee;
    }

    getValue(){
        return this.value;
    }
}

class HandicapItem {
    constructor(userProfile, handicap) {
        this.user = userProfile;
        this.display_course = handicap;
    }

    getUser(){
        return this.user;
    }

    getDisplay_course(){
        return this.display_course;
    }
}

module.exports = HandicapFacilityModel;