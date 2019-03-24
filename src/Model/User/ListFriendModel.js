import BaseModel from '../../Core/Model/BaseModel';
import UserProfileModel from '../Home/UserProfileModel';

export default class ListFriendModel extends BaseModel {
    constructor(baseComponent) {
        super(baseComponent);

        this.friendList = [];
        this.total_friends = 0;
    }

    parseData(jsonData) {
        super.parseData(jsonData);

        if (this.data.hasOwnProperty('list_friend_display')) {
            let array = this.data['list_friend_display'];
            for (let obj of array) {
                let user = new UserProfileModel();
                user.parseData(obj);
                this.friendList.push(user);
            }
        }
        if (this.data.hasOwnProperty('total_friends')) {
            this.total_friends = this.data['total_friends'];
        }
    }

    getFriendList() {
        return this.friendList || [];
    }

    getTotalFriend() {
        return this.total_friends || 0;
    }

}