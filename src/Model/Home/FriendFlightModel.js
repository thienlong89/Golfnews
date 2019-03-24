import BaseModel from '../../Core/Model/BaseModel';
import FlightModel from './FlightModel';
import UserRoundModel from '../CreateFlight/Flight/UserRoundModel';
import FlightSummaryModel from '../CreateFlight/Flight/FlightSummaryModel';

class FriendFlightModel extends BaseModel {
    constructor(baseComponent) {
        super(baseComponent);
        this.friendList = [];
        this.list_id_remove = [];
    }

    parseData(jsonData) {
        super.parseData(jsonData);
        if (typeof this.data === 'object') {
            if (this.data.hasOwnProperty('rounds')) {
                let rounds = this.data['rounds'];
                for (let _obj of rounds) {
                    let flight = new FlightSummaryModel();
                    flight.parseData(_obj);

                    this.friendList.push(flight);
                }
            }
            if (this.data.hasOwnProperty('flights')) {
                let flights = this.data['flights'];
                for (let _obj of flights) {
                    let flight = new FlightSummaryModel();
                    flight.parseData(_obj);

                    this.friendList.push(flight);
                }
            }

            if (this.data.hasOwnProperty('list_id_remove')) {
                this.list_id_remove = this.data['list_id_remove'];
            }
        }
    }

    getFriendFlightList() {
        return this.friendList;
    }

    getListRemove(){
        return this.list_id_remove;
    }

}

module.exports = FriendFlightModel;
