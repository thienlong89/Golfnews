import UserProfileModel from '../Home/UserProfileModel';

class FlightEventItemModel {

    constructor() {
        this.id = 0;
        this.event_id = 0;
        this.user_id = 0;
        this.flight_event_id = 0;
        this.is_full = 0;
        this.course_index = undefined;
        this.user = {};
        this.teeDisplay = {};
        this.isSelectSwap = -1;
    }
    parseData(data) {
        if (data.hasOwnProperty('id')) {
            this.id = parseFloat(data['id']);
        }
        if (data.hasOwnProperty('event_id')) {
            this.event_id = parseFloat(data['event_id']);
        }
        if (data.hasOwnProperty('user_id')) {
            this.user_id = parseFloat(data['user_id']);
        }
        if (data.hasOwnProperty('flight_event_id')) {
            this.flight_event_id = parseFloat(data['flight_event_id']);
        }
        if (data.hasOwnProperty('is_full')) {
            this.is_full = parseFloat(data['is_full']);
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
    getEventId() { return this.event_id || 0; }
    getUserId() { return this.user_id || 0; }
    getFlightEventId() { return this.flight_event_id || 0; }
    getIsFull() { return this.is_full || 0; }
    getCourseIndex() { return this.course_index !== undefined ? this.course_index : null; }
    getUserProfile() { return this.user || {}; }
    getTeeDisplay() { return this.teeDisplay || {}; }
}

module.exports = FlightEventItemModel;