/**
 * BaseModel
 */
class BaseModel {
    constructor(baseComponent) {
        this.error_code = -1;
        this.data = {};
        this.error_msg = "";
        this.list = [];
        this.baseComponent = baseComponent;
    };

    parseData(jsonData) {
        //jsonData = JSON.parse(jsonData);
        if (typeof jsonData === 'object' && jsonData.hasOwnProperty("error_msg")) {
            this.error_msg = jsonData.error_msg;
        }
        if (jsonData.hasOwnProperty('error_code')) {
            this.error_code = jsonData.error_code;
            if (this.baseComponent) {
                this.baseComponent.onCheckErrorCode(this.error_code,this.error_msg);
            }
        }
        if (this.error_code === 0) {
            if (typeof jsonData === 'object' && jsonData.hasOwnProperty('data')) {
                this.data = jsonData.data;
            } else {
                this.data = jsonData;
            }
        }

    }

    getErrorCode() {
        return this.error_code;
    }

    getErrorMsg() {
        return this.error_msg;
    }

    getData() {
        return this.data;
    }
}

module.exports = BaseModel;