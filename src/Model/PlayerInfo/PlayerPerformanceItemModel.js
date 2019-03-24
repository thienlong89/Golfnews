import AppUtil from '../../Config/AppUtil';

class PlayerPerformanceItemModel {

    constructor() {
        this.id = 0;
        this.fullname = '';
        this.avatar = '';
        this.permance_user = 0;
        this.uid_compare_uid2 = 0;
        this.dataList = [];
    }

    parseData(data, isMe) {
        if (data.hasOwnProperty('id')) {
            this.id = AppUtil.replaceUser(data['id']);
        }
        if (data.hasOwnProperty('fullname')) {
            this.fullname = data['fullname'];
        }
        if (data.hasOwnProperty('avatar')) {
            this.avatar = data['avatar'];
        }
        if (data.hasOwnProperty('permance_user')) {
            this.permance_user = data['permance_user'];
            this.dataList.push(this.permance_user.underpars);
            this.dataList.push(this.permance_user.pars);
            this.dataList.push(this.permance_user.pars_and_under_pars);
            this.dataList.push(this.permance_user.bogey);
            this.dataList.push(this.permance_user.dbogey);
            if (isMe) {
                this.dataList.push('');
                this.dataList.push('');
                this.dataList.push('');
                this.dataList.push('');
                this.dataList.push('');
            }
        }
        if (data.hasOwnProperty('uid_compare_uid2')) {
            this.uid_compare_uid2 = data['uid_compare_uid2'];
            this.dataList.push(this.uid_compare_uid2.forecast_hole);
            this.dataList.push(this.uid_compare_uid2.forecast_gross);
            this.dataList.push(this.uid_compare_uid2.forecast_9_hole_first);
            this.dataList.push(this.uid_compare_uid2.forecast_9_hole_after);
            this.dataList.push(this.uid_compare_uid2.uid1_total_compare_uid2);
        }

    }
    getId() { return this.id || 0; }
    getFullName() { return this.fullname || ''; }
    getDataList() { return this.dataList || []; }

}

module.exports = PlayerPerformanceItemModel;
