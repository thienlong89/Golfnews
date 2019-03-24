import BaseModel from '../../Core/Model/BaseModel';
/**
 * Thông tin invitation
 */
class InvitationItem {
    constructor() { }

    parseData(data) {
        if (data.hasOwnProperty('id')) {
            this.id = data['id'];
        }
        if (data.hasOwnProperty('user_id')) {
            this.user_id = data['user_id'];
        }
        if (data.hasOwnProperty('event_id')) {
            this.event_id = data['event_id'];
        }
        if (data.hasOwnProperty('is_accepted')) {
            this.is_accepted = data['is_accepted'];
        }
        if (data.hasOwnProperty('accepted_time')) {
            this.accepted_time = data['accepted_time'];
        }
    }

    getId() {
        return this.id ? this.id : '';
    }

    getUserId() {
        return this.user_id ? this.user_id : '';
    }

    getEventId() {
        return this.event_id ? this.event_id : '';
    }

    isAccepted() {
        return this.is_accepted ? true : false;
    }

    getAcceptTime() {
        return this.accepted_time ? this.accepted_time : '';
    }
}

/**
 * Thông tin từng event
 */
class ItemModel {
    constructor() {
        this.list_invitation = [];
        this.host = null;
        this.facility = null;
    }

    parseData(data) {
        if (data.hasOwnProperty('id')) {
            this.id = data['id'];
        }
        if (data.hasOwnProperty('name')) {
            this.name = data['name'];
        }
        if (data.hasOwnProperty('facility_id')) {
            this.facility_id = data['facility_id'];
        }
        if (data.hasOwnProperty('path_id1')) {
            this.path_id1 = data['path_id1'];
        }
        if (data.hasOwnProperty('path_id2')) {
            this.path_id2 = data['path_id2'];
        }
        if (data.hasOwnProperty('host_user_id')) {
            this.host_user_id = data['host_user_id'];
        }
        if (data.hasOwnProperty('host_admin_id')) {
            this.host_admin_id = data['host_admin_id'];
        }
        if (data.hasOwnProperty('approved_admin_id')) {
            this.approved_admin_id = data['approved_admin_id'];
        }
        if (data.hasOwnProperty('approved_time')) {
            this.approved_time = data['approved_time'];
        }
        if (data.hasOwnProperty('tee_time')) {
            this.tee_time = data['tee_time'];
        }
        if (data.hasOwnProperty('is_approved')) {
            this.is_approved = data['is_approved'];
        }
        if (data.hasOwnProperty('total_joined')) {
            this.total_joined = data['total_joined'];
        }
        if (data.hasOwnProperty('created_at')) {
            this.created_at = data['created_at'];
        }
        if (data.hasOwnProperty('updated_at')) {
            this.updated_at = data['updated_at'];
        }
        if (data.hasOwnProperty('created_at_timestamp')) {
            this.created_at_timestamp = data['created_at_timestamp'];
        }
        if (data.hasOwnProperty('Invitation')) {
            let Invitations = data['Invitation'];
            for (let d of Invitations) {
                let invite_item = new InvitationItem();
                invite_item.parseData(d);
                this.list_invitation.push(invite_item);
            }
        }
        if (data.hasOwnProperty('HostUser')) {
            let host_user = data['HostUser'];
            this.host = new Host();
            this.host.parseData(host_user);
        }
        if (data.hasOwnProperty('Facility')) {
            let facility = data['Facility'];
            this.facility = new Facility();
            this.facility.parseData(facility);
        }
        if(data.hasOwnProperty('coming')){
            this.coming = parseInt(data['coming']);
        }
    }

    isComing(){
        return this.coming ? this.coming : 0;
    }

    getId() {
        return this.id ? this.id : '';
    }

    getName() {
        return this.name ? this.name : '';
    }

    getHostId() {
        return this.host_user_id ? parseInt(this.host_user_id) : 0;
    }

    getHostUser() {
        return this.host ? this.host : null;
    }

    getFacility() {
        return this.facility ? this.facility : null;
    }

    getFacilityId() {
        return this.facility_id ? this.facility_id : null;
    }

    getTotalJoin() {
        return this.total_joined ? parseInt(this.total_joined) : 0;
    }

    getTeeTime() {
        return this.tee_time ? this.tee_time : '';
    }

    getDateCreate() {
        return this.created_at ? this.created_at : '';
    }

    getDateCreateTimestamp() {
        return this.created_at_timestamp ? parseInt(this.created_at_timestamp) : (new Date()).getTime();
    }

    getListInvitation() {
        return this.list_invitation;
    }
}

class Facility {
    constructor() { }

    parseData(data) {
        if (data.hasOwnProperty('id')) {
            this.id = data['id'];
        }
        if (data.hasOwnProperty('title')) {
            this.title = data['title'];
        }
        if (data.hasOwnProperty('sub_title')) {
            this.sub_title = data['sub_title'];
        }
    }

    getId() {
        return this.id ? this.id : '';
    }

    getSubTitle() {
        return this.sub_title ? this.sub_title : '';
    }
}

class Host {
    constructor() { }

    parseData(data) {
        if (data.hasOwnProperty('id')) {
            this.id = data['id'];
        }
        if (data.hasOwnProperty('avatar')) {
            this.avatar = data['avatar'];
        }
    }

    getId() {
        return this.id ? this.id : '';
    }

    getAvatar() {
        return this.avatar ? this.avatar : '';
    }
}

/**
 * Model event lớn
 */
export default class EventModel extends BaseModel {
    constructor(baseComponent) {
        super(baseComponent);
        this.list_item = [];
    }

    parseData(jsonData) {
        super.parseData(jsonData);
        if (this.getErrorCode() === 0) {
            if (this.data.hasOwnProperty('events')) {
                this.data = this.data['events'];
                for (let d of this.data) {
                    let itemModel = new ItemModel();
                    itemModel.parseData(d);
                    this.list_item.push(itemModel);
                }
            }
            if (this.data.hasOwnProperty('event')) {
                this.data = this.data['event'];
                let itemModel = new ItemModel();
                itemModel.parseData(this.data);
                this.list_item.push(itemModel);
            }
        }
    }

    getListItem() {
        return this.list_item;
    }
}