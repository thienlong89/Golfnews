import BaseModel from '../../Core/Model/BaseModel';
import ClubEventItemModel from './ClubEventItemModel';
import CLBItemModel from '../CLB/CLBItemModel';
import TournamentModel from './TournamentModel';

class ClubEventModel extends BaseModel {

    constructor(baseComponent) {
        super(baseComponent);

        this.admin_list = [];
        this.future_event = [];
        this.pass_event = [];
        this.appointment = [];
        this.list_tour = [];
    }

    parseData(jsonData) {
        super.parseData(jsonData);

        if (this.data.hasOwnProperty('event_now')) {
            for (let obj of this.data['event_now']) {
                let event = new ClubEventItemModel();
                event.parseData(obj);
                this.future_event.push(event);
            }
        }

        if (this.data.hasOwnProperty('appointment')) {
            for (let obj of this.data['appointment']) {
                let event = new ClubEventItemModel();
                event.parseData(obj);
                this.appointment.push(event);
            }
        }

        if (this.data.hasOwnProperty('event_done')) {
            for (let obj of this.data['event_done']) {
                let event = new ClubEventItemModel();
                event.parseData(obj);
                this.pass_event.push(event);
            }
        }

        if (this.data.hasOwnProperty('user_admin_club')) {
            for (let obj of this.data['user_admin_club']) {
                let club = new CLBItemModel();
                club.paserData(obj.Club);
                this.admin_list.push(club);
            }
        }

        if (this.data.hasOwnProperty('list_tour')) {
            for (let obj of this.data['list_tour']) {
                let tournament = new TournamentModel();
                tournament.parseData(obj);
                this.list_tour.push(tournament);
            }
        }
    }

    getFutureEvents() {
        return this.future_event;
    }

    getPassEvents() {
        return this.pass_event;
    }

    getClubAdminList() {
        return this.admin_list;
    }

    getAppointmentList() {
        return this.appointment;
    }

    getTournamentList() {
        return this.list_tour;
    }
}

module.exports = ClubEventModel;