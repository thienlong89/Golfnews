import BaseModel from '../../Core/Model/BaseModel';
import FlightGroupItemModel from './FlightGroupItemModel';

class FlightGroupModel extends BaseModel {

    constructor() {
        super();

        this.flightGroup = [];
    }

    parseData(index, data) {
        super.parseData(data);

        if (this.data instanceof Array) {
            for (let object of this.data) {
                let max_member = 4;
                let group_id = '';
                let flight_group_id = '';
                let is_block = 0;
                if(object.hasOwnProperty('max_member')){
                    max_member = object['max_member'];
                }
                if(object.hasOwnProperty('group_id')){
                    group_id = object['group_id'];
                }
                if(object.hasOwnProperty('flight_group_id')){
                    flight_group_id = object['flight_group_id'];
                }
                if(object.hasOwnProperty('is_block')){
                    is_block = object['is_block'];
                }
                let flightMember = [];
                for (let obj of object['list_member']) {
                    let member = new FlightGroupItemModel();
                    member.parseData(obj);
                    member.is_block = is_block;
                    flightMember.push(member);
                }
                if (flightMember.length > 0) {
                    index++;
                    this.flightGroup.push({ title: { index, max_member, group_id, flight_group_id, is_block }, data: flightMember });
                }

            }
        }

    }

    getFlightGroup() { return this.flightGroup || []; }

}

module.exports = FlightGroupModel;