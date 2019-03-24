import BaseModel from '../../Core/Model/BaseModel';
import FlightEventItemModel from './FlightEventItemModel';

class FlightEventModel extends BaseModel {

    constructor() {
        super();

        this.flightEvent = [];
    }
    parseData(index, data) {
        super.parseData(data);

        if (this.data instanceof Array) {
            for (let object of this.data) {
                let max_member = 4;
                let event_id = '';
                let flight_event_id = '';
                let is_block = 0;
                if(object.hasOwnProperty('max_member')){
                    max_member = object['max_member'];
                }
                if(object.hasOwnProperty('event_id')){
                    event_id = object['event_id'];
                }
                if(object.hasOwnProperty('flight_event_id')){
                    flight_event_id = object['flight_event_id'];
                }
                if(object.hasOwnProperty('is_block')){
                    is_block = object['is_block'];
                }
                let flightMember = [];
                for (let obj of object['list_member']) {
                    // console.log('parseData.obj', obj)
                    let member = new FlightEventItemModel();
                    member.parseData(obj);
                    member.is_block = is_block;
                    flightMember.push(member);
                }
                // console.log('parseData', flightMember)
                if (flightMember.length > 0) {
                    index++;
                    this.flightEvent.push({ title: { index, max_member, event_id, flight_event_id, is_block }, data: flightMember });
                }

            }
        }

    }

    getFlightEvent() { return this.flightEvent || []; }

}

module.exports = FlightEventModel;