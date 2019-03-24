import moment from 'moment';

export default class TournamentModel {

    constructor() {
        this.id = '';
        this.name = '';
        this.user_created = '';
        this.facility_id = '';
        this.total_member = 0;
        this.phone_created = '';
        this.fees = '';
        this.img_poster = '';
        this.rules_tour = '';
        this.facility_name = '';
        this.day = '';
        this.month = '';
        this.tee_time_display = '';
        this.is_accepted = 0;
     }

    parseData(data) {
        if (data.hasOwnProperty('id')) {
            this.id = data['id'];
        }
        if (data.hasOwnProperty('name')) {
            this.name = data['name'];
        }
        if (data.hasOwnProperty('user_created')) {
            this.user_created = data['user_created'];
        }
        if (data.hasOwnProperty('facility_id')) {
            this.facility_id = data['facility_id'];
        }
        if (data.hasOwnProperty('total_member')) {
            this.total_member = data['total_member'];
        }
        if (data.hasOwnProperty('phone_created')) {
            this.phone_created = data['phone_created'];
        }
        if (data.hasOwnProperty('fees')) {
            this.fees = data['fees'];
        }
        if (data.hasOwnProperty('img_poster')) {
            this.img_poster = data['img_poster'];
        }
        if (data.hasOwnProperty('rules_tour')) {
            this.rules_tour = data['rules_tour'];
        }
        if (data.hasOwnProperty('date_played')) {
            this.date_played = data['date_played'];
        }
        if (data.hasOwnProperty('created_at')) {
            this.created_at = data['created_at'];
        }
        if (data.hasOwnProperty('facility_name')) {
            this.facility_name = data['facility_name'];
        }
        if (data.hasOwnProperty('date_played_display')) {
            this.date_played_display = data['date_played_display'];
        }

        if (this.date_played_display && this.date_played_display != 0) {
            let teeTime = moment(this.date_played_display);//.format("MMM");
            this.tee_time_display = teeTime.format("HH:mm, DD/MM/YYYY")
            this.month = teeTime.format("MMM");
            this.day = teeTime.format("DD")
        }

        if (data.hasOwnProperty('is_accepted')) {
            this.is_accepted = data['is_accepted'];
        }
    }

    getRules_tour() {
        return this.rules_tour ? this.rules_tour : '';
    }

    // getSubTitle() {
    //     return this.sub_title ? this.sub_title : '';
    // }
}