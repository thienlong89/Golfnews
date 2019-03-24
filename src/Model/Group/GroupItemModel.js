class GroupItemModel{
    constructor(){
        this.logo = '',
        this.name = '';
        this.totalMember = 0;
        this.id = '';
        this.is_user_admin = 0;
    }

    paserData(data){
        if(data.hasOwnProperty('host_user_id')){
            this.host = parseInt(data['host_user_id']);
        }
        if(data.hasOwnProperty('name')){
            this.name = data['name'];
        }
        if(data.hasOwnProperty('image_path')){
            this.logo = data['image_path'];
        }
        if(data.hasOwnProperty('total_member')){
            this.totalMember = parseInt(data['total_member']) || 0;
        }
        if(data.hasOwnProperty('id')){
            this.id = data['id'];
        }
        if(data.hasOwnProperty('is_invited')){
            this.is_invited = data['is_invited'];
        }
        if(data.hasOwnProperty('created_at')){
            this.created_at = data['created_at'];
        }
        if(data.hasOwnProperty('is_user_admin')){
            this.is_user_admin = data['is_user_admin'];
        }
    }

    getCreateAt(){
        return this.created_at ? this.created_at : '';
    }

    isInvited(){
        return this.is_invited ? this.is_invited : false;
    }

    getHost(){
        return this.host;
    }

    getId(){
        return this.id;
    }

    getLogo(){
        return this.logo ? this.logo : '';
    }

    getName(){
        return this.name ? this.name : '';
    }

    getTotalMember(){
        return this.totalMember ? this.totalMember : 0;
    }

    getIsUserAdmin(){
        return this.is_user_admin ? this.is_user_admin : 0;
    }
}

module.exports = GroupItemModel;