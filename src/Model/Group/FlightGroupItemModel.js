import UserProfileModel from '../Home/UserProfileModel';

class FlightGroupItemModel {

    constructor() {
        this.id = 0;
        this.group_id = 0;
        this.user_id = 0;
        this.flight_group_id = 0;
        this.course_index = undefined;
        this.user = {};
        this.teeDisplay = {};
        this.isSelectSwap = -1;
    }
    parseData(data) {
        if (data.hasOwnProperty('id')) {
            this.id = parseFloat(data['id']);
        }
        if (data.hasOwnProperty('group_id')) {
            this.group_id = parseFloat(data['group_id']);
        }
        if (data.hasOwnProperty('user_id')) {
            this.user_id = parseFloat(data['user_id']);
        }
        if (data.hasOwnProperty('flight_group_id')) {
            this.flight_group_id = parseFloat(data['flight_group_id']);
        }
        if (data.hasOwnProperty('course_index')) {
            this.course_index = parseFloat(data['course_index']);
        }
        if (data.hasOwnProperty('User')) {
            this.user = new UserProfileModel();
            this.user.parseData(data['User']);
        }
        if (data.hasOwnProperty('displayTee')) {
            this.teeDisplay.tee = data['displayTee'].name;
            this.teeDisplay.color = data['displayTee'].color;
        }
    }
    getId() { return this.id || 0; }
    getGroupId() { return this.group_id || 0; }
    getUserId() { return this.user_id || 0; }
    getFlightGroupId() { return this.flight_group_id || 0; }
    getCourseIndex() { return this.course_index !== undefined ? this.course_index : null; }
    getUserProfile() { return this.user || {}; }
    getTeeDisplay() { return this.teeDisplay || {}; }
}

module.exports = FlightGroupItemModel;