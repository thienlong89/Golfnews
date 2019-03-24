import BaseModel from '../../Core/Model/BaseModel';
import GroupItemModel from '../Group/GroupItemModel';
import CLBItemModel from '../CLB/CLBItemModel';
import FriendItemModel from '../Friends/FriendItemModel';
import FacilityCourseItemModel from '../Facility/FacilitiCourseItemModel';

export default class SearchAllModel extends BaseModel {
    constructor(baseComponent) {
        super(baseComponent);

        this.groups = [];
        this.clubs = [];
        this.users = [];
        this.facilities = [];
    }

    parseData(jsonData) {
        super.parseData(jsonData);

        if (this.data.hasOwnProperty('groups')) {
            let groupLs = this.data['groups'];
            for (let obj of groupLs) {
                let group = new GroupItemModel();
                group.paserData(obj);
                this.groups.push(group);
            }

        }

        if (this.data.hasOwnProperty('clubs')) {
            let clubLs = this.data['clubs'];
            for (let obj of clubLs) {
                let club = new CLBItemModel();
                club.paserData(obj);
                this.clubs.push(club);
            }
        }

        if (this.data.hasOwnProperty('users')) {
            let userLs = this.data['users'];
            for (let obj of userLs) {
                let user = new FriendItemModel();
                user.paserData(obj);
                this.users.push(user);
            }
        }

        if (this.data.hasOwnProperty('facility')) {
            let facilityLs = this.data['facility'];
            for (let obj of facilityLs) {
                let facility = new FacilityCourseItemModel();
                facility.paserData(obj);
                this.facilities.push(facility);
            }
        }

    }

    getGroups() {
        return this.groups;
    }

    getClubs() {
        return this.clubs;
    }

    getUsers() {
        return this.users;
    }

    getFacilities() {
        return this.facilities;
    }
}
