import BaseModel from '../../Core/Model/BaseModel';
import UserProfileModel from '../Home/UserProfileModel';

class ClubBirthdayModel extends BaseModel {

    constructor() {
        super();
        this.month_1 = [];
        this.month_2 = [];
    }
    parseData(data, isCurrentMonth) {
        super.parseData(data);
        if (this.data.hasOwnProperty('month_1')) {
            for (let obj of this.data['month_1']) {
                let player = new UserProfileModel();
                player.parseData(obj);
                player.status_friends = obj.status_friends;
                player.is_accepted = 1;
                player.star = obj.star;
                this.month_1.push(player);
            }
        }

        if (this.data.hasOwnProperty('month_2')) {
            for (let obj of this.data['month_2']) {
                let player = new UserProfileModel();
                player.parseData(obj);
                player.status_friends = obj.status_friends;
                player.is_accepted = 1;
                player.star = obj.star;
                this.month_2.push(player);
            }
        }

    }

    getMonth1() { return this.month_1 || []; }
    getMonth2() { return this.month_2 || []; }
}

module.exports = ClubBirthdayModel;