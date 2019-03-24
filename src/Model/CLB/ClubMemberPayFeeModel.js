import BaseModel from '../../Core/Model/BaseModel';
import UserProfileModel from '../Home/UserProfileModel';

class ClubMemberPayFeeModel extends BaseModel {

    constructor() {
        super();

        this.memberList = [];
    }
    parseData(data) {
        super.parseData(data);

        if (this.data instanceof Array) {
            for (let obj of this.data) {
                let member = new ClubItemListModel();
                member.parseData(obj);
                this.memberList.push(member);
            }
        }
    }

    getMemberList() { return this.memberList || []; }

}

class ClubItemListModel {

    constructor() {
        this.id = 0;
        this.is_pay = '';
        this.date_expried_display = '';
        this.is_expried_time = '';
        this.Users = '';
        this.course_index = '';
        this.displayTee = '';
    }

    parseData(jsonData) {
        if (jsonData.hasOwnProperty('id')) {
            this.id = jsonData['id'];
        }
        if (jsonData.hasOwnProperty('is_pay')) {
            this.is_pay = jsonData['is_pay'];
        }
        if (jsonData.hasOwnProperty('date_expried_display')) {
            this.date_expried_display = jsonData['date_expried_display'];
        }
        if (jsonData.hasOwnProperty('is_expried_time')) {
            this.is_expried_time = jsonData['is_expried_time'];
        }
        if (jsonData.hasOwnProperty('course_index')) {
            this.course_index = jsonData['course_index'];
        }
        if (jsonData.hasOwnProperty('displayTee')) {
            this.displayTee = jsonData['displayTee'];
        }
        if (jsonData.hasOwnProperty('Users')) {
            this.Users = new UserProfileModel();
            this.Users.parseData(jsonData['Users']);
        }
    }

}

module.exports = ClubMemberPayFeeModel;