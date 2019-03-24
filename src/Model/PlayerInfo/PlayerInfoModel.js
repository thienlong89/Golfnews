import BaseModel from '../../Core/Model/BaseModel';
import UserProfile from '../../Model/Home/UserProfileModel'
import Club from '../../Model/CLB/CLBItemModel';

class PlayerInfoModel extends BaseModel{
    constructor(baseComponent){
        super(baseComponent);
        this.friendStatus = 1,
        this.userProfile = null,
        this.clubList = []
    }

    parseData(jsonData) {
        super.parseData(jsonData);
        this.userProfile = new UserProfile();
        this.userProfile.parseUserData(jsonData);
        if(this.data.hasOwnProperty('uid_puid_friend_status')){
            this.friendStatus = this.data['uid_puid_friend_status'];
        }
        if(this.data.hasOwnProperty('puid')){
            this.puid = this.data['puid'];
        }
        let dataClub = this.data['clubs'];
        for(let _obj of dataClub){
            let club = new Club();
            club.paserData(_obj);
            this.clubList.push(club);
        }
    }

    getPuid(){
        return this.puid ? this.puid : 0;
    }

    getFriendStatus(){
        return this.friendStatus;
    }

    getPlayerProfile(){
        return this.userProfile;
    }

    getClubList(){
        return this.clubList;
    }

    
}

module.exports = PlayerInfoModel;
