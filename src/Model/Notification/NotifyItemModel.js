export default class NotifyItemModel {

    constructor() {
        this.id = 0;
        this.type = '';
        this.message = '';
        this.notification_type = '';
        this.date_create_timestamp = 0;
        this.date_enter = 0;
        this.date_create_display = '';
        this.date_enter_display = '';
        this.icon_image = '';
        this.flight_id = 0;
        this.SourceUser = '';
        this.display_image = '';
        this.TargetUser = '';
        this.is_view = 0;
        this.id_stt = '';
    }

    parseData(data) {
        if (data.hasOwnProperty('id')) {
            this.id = data['id'];
        }
        if(data.hasOwnProperty('is_view')){
            this.is_view = data['is_view'];
        }
        if (data.hasOwnProperty('type')) {
            this.type = data['type'];
        }
        if (data.hasOwnProperty('message')) {
            this.message = data['message'];
        }
        if (data.hasOwnProperty('notification_type')) {
            this.notification_type = data['notification_type'];
        }
        if (data.hasOwnProperty('date_create_timestamp')) {
            this.date_create_timestamp = data['date_create_timestamp'];
        }
        if (data.hasOwnProperty('date_enter')) {
            this.date_enter = data['date_enter'];
        }
        if (data.hasOwnProperty('date_create_display')) {
            this.date_create_display = data['date_create_display'];
        }
        if (data.hasOwnProperty('date_enter_display')) {
            this.date_enter_display = data['date_enter_display'];
        }
        if (data.hasOwnProperty('icon_image')) {
            this.icon_image = data['icon_image'];
        }
        if (data.hasOwnProperty('flight_id')) {
            this.flight_id = data['flight_id'];
        }
        if (data.hasOwnProperty('SourceUser')) {
            this.SourceUser = data['SourceUser'];
        }
        if (data.hasOwnProperty('display_image')) {
            this.display_image = data['display_image'];
        }
        if (data.hasOwnProperty('TargetUser')) {
            this.TargetUser = data['TargetUser'];
        }
        if(data.hasOwnProperty('id_stt')){
            this.id_stt = data['id_stt'];
        }
    }

    getIdStt(){
        return this.id_stt;
    }

    getId() {
        return this.id ? this.id : '';
    }

    getDateCreateDisplay() {
        return this.date_create_display ? this.date_create_display : '';
    }

    getTargetUser() {
        return this.TargetUser ? this.TargetUser : {};
    }

    getDisplayImage() {
        return this.display_image ? this.display_image : '';
    }

    getFlightId() {
        return this.flight_id ? this.flight_id : 0;
    }

    getIconImage() {
        return this.icon_image ? this.icon_image : '';
    }

    getType() {
        return this.type ? this.type : '';
    }

    getDisplayDateEnter() {
        return this.date_enter_display ? this.date_enter_display : '';
    }

    getMessage() {
        return this.message ? this.message : '';
    }

    getNotificationType() {
        return this.notification_type ? this.notification_type : '';
    }

    getSourceUser() {
        return this.SourceUser ? this.SourceUser : {};
    }

    getDateEnter() {
        return this.date_enter ? this.date_enter : (new Date()).toString();
    }

    getDateCreateTimestamp() {
        return this.date_create_timestamp ? this.date_create_timestamp : (new Date()).getTime();
    }
}