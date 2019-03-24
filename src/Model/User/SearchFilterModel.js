import BaseModel from '../../Core/Model/BaseModel';
import GroupItemModel from '../Group/GroupItemModel';
import CLBItemModel from '../CLB/CLBItemModel';
import FriendItemModel from '../Friends/FriendItemModel';

export default class SearchFilterModel extends BaseModel {
    constructor(baseComponent) {
        super(baseComponent);

        this.groups = [];
        this.clubs = [];
        this.users = [];
    }

    parseData(jsonData, type) {
        super.parseData(jsonData);

        if (type === 1 && this.data instanceof Array) {
            for (let obj of this.data) {
                let user = new FriendItemModel();
                user.paserData(obj);
                this.users.push(user);
            }
        } else if (type === 2 && this.data instanceof Array) {
            for (let obj of this.data) {
                let club = new CLBItemModel();
                club.paserData(obj);
                this.clubs.push(club);
            }
        } else if (type === 3 && this.data instanceof Array) {

            for (let obj of this.data) {
                let group = new GroupItemModel();
                group.paserData(obj);
                this.groups.push(group);
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
}
