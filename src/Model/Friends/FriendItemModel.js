class FriendItemModel{
    constructor(){
        this.userId = '';
        this.id = '';
        this.fullname = '';
        this.ehandicapMemberId = '';
        this.handicap = '';
        this.avatar = '';
        this.handicap_facility = '';
        this.default_tee_id = '';
        this.is_friend = false;
        this.is_waiting_friend_request = false;
        this.club_member = {};
        this.is_group_member = false;
        this.is_block = false;
        this.user_friends = {};
        this.in_event = false;
        this.isVip = false;
        this.id_firebase = '';
    }

    paserData(data){
       // console.log("data item : ",data);
        if(data.hasOwnProperty('id_firebase')){
            this.id_firebase = data['id_firebase'];
        }
        if(data.hasOwnProperty('in_event')){
            this.in_event = data['in_event'];
        }
        if(data.hasOwnProperty('id')){
            this.userId = data['id'];
        }
        if(data.hasOwnProperty('_id')){
            this.id = data['_id'];
        }
        if(data.hasOwnProperty('fullname')){
            this.fullname = data['fullname'];
        }
        if(data.hasOwnProperty('usga_hc_index')){
            this.handicap =  parseFloat(data['usga_hc_index']);
        }
        if(data.hasOwnProperty('ehandicap_member_id')){
            this.ehandicapMemberId = data['ehandicap_member_id'];
        }
        if(data.hasOwnProperty('avatar')){
            this.avatar = data['avatar'];
        }
        if(data.hasOwnProperty('default_tee_id')){
            this.default_tee_id = data['default_tee_id'];
        }
        if(data.hasOwnProperty('is_friend')){
            this.is_friend = data['is_friend'];
        }
        if(data.hasOwnProperty('is_waiting_friend_request')){
            this.is_waiting_friend_request = data['is_waiting_friend_request'];
        }
        if(data.hasOwnProperty('club_member')){
            this.club_member = data['club_member'];
        }
        if(data.hasOwnProperty('is_group_member')){
            this.is_group_member = data['is_group_member'];
        }
        if(data.hasOwnProperty('is_block')){
            this.is_block = parseInt(data['is_block']);
        }
        if(data.hasOwnProperty('user_friends')){
            this.user_friends = data['user_friends'];
            this.is_block = parseInt(this.user_friends.is_block);
        }
        if(data.hasOwnProperty('allow_using_scorecard_image')){
            let allow_using_scorecard_image = parseInt(data['allow_using_scorecard_image']);
           //console.log("allow_using_scorecard_image : ",allow_using_scorecard_image);
            this.isVip = (allow_using_scorecard_image === 0) ? false : true;
        }
    }

    IsVip(){
        return this.isVip;
    }

    IsBlock(){
        return this.is_block === 1 ? true : false;
    }

    IsGroupMember(){
        return this.is_group_member;
    }

    /**
     * Trả về club member dạng object
     */
    getClubMember(){
        return this.club_member || {};
    }

    isFriend(){
        return this.is_friend;
    }

    isWaitingForAccept(){
        return this.is_waiting_friend_request;
    }

    getUserId(){
        return this.userId;
    }

    getId(){
        return this.id;
    }

    getFullname(){
        return this.fullname;
    }

    getMemberId(){
        return this.ehandicapMemberId;
    }

    getHandicap(){
        return this.handicap;
    }
    
    getAvatar(){
        return this.avatar;
    }

    getDefaulTeeId(){
        return this.default_tee_id;
    }

    getHandicapFacility(){
        return this.handicap_facility;
    }

    setHandicapFacility(_handicap_facility){
        this.handicap_facility = _handicap_facility;
    }

    setDefaulTeeId(_default_tee_id){
        this.default_tee_id = _default_tee_id;
    }
}

module.exports = FriendItemModel;