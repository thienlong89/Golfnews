import UserProfileModel from '../Home/UserProfileModel';

class FlightModel {
    constructor() {
        this.id = 0;
        this.facility_id = 0;
        this.path_id1 = 0;
        this.path_id2 = 0;
        this.date_played = '';
        this.date_create = '';
        this.date_last_update = '';
        this.flight_name = '';
        this.status = -1;
        this.url_scorecards = '';
        this.array_url_scorecard = [];
        this.white_slope = 0;
        this.gold_slope = 0;
        this.blue_slope = 0;
        this.red_slope = 0;
        this.type = -1;
        this.date_create_timestamp = '';
        this.date_played_timestamp = '';
        this.date_last_update_timestamp = '';
        this.course_rating = 0.0;
        this.slope_rating = 0.0;
        this.gross = 0;
        this.over = 0;
        this.adjust = 0.0;
        this.selected_round_for_handicap_index = false;
        this.tee_id = '';
        this.awards = '';
        this.source = '';
        this.date_played_display = '';
        this.InfoUserFlightTags = [];
    }

    parseData(jsonData) {
        if (jsonData.hasOwnProperty('id')) {
            this.id = jsonData['id'];
        }
        if (jsonData.hasOwnProperty('facility_id')) {
            this.facility_id = jsonData['facility_id'];
        }
        if (jsonData.hasOwnProperty('path_id1')) {
            this.path_id1 = jsonData['path_id1'];
        }
        if (jsonData.hasOwnProperty('path_id2')) {
            this.path_id2 = jsonData['path_id2'];
        }
        if (jsonData.hasOwnProperty('date_played')) {
            this.date_played = jsonData['date_played'];
        }
        if (jsonData.hasOwnProperty('date_create')) {
            this.date_create = jsonData['date_create'];
        }
        if (jsonData.hasOwnProperty('date_last_update')) {
            this.date_last_update = jsonData['date_last_update'];
        }
        if (jsonData.hasOwnProperty('flight_name')) {
            this.flight_name = jsonData['flight_name'];
        }
        if (jsonData.hasOwnProperty('status')) {
            this.status = jsonData['status'];
        }
        if (jsonData.hasOwnProperty('url_scorecards')) {
            this.url_scorecards = jsonData['url_scorecards'];
        }
        if (jsonData.hasOwnProperty('array_url_scorecard')) {
            let scorecards = jsonData['array_url_scorecard'];
            if (scorecards) {
                for (let obj of scorecards) {
                    this.array_url_scorecard.push(obj);
                }
            }
        }
        if (jsonData.hasOwnProperty('white_slope')) {
            this.white_slope = jsonData['white_slope'];
        }
        if (jsonData.hasOwnProperty('gold_slope')) {
            this.gold_slope = jsonData['gold_slope'];
        }
        if (jsonData.hasOwnProperty('blue_slope')) {
            this.blue_slope = jsonData['blue_slope'];
        }
        if (jsonData.hasOwnProperty('red_slope')) {
            this.red_slope = jsonData['red_slope'];
        }
        if (jsonData.hasOwnProperty('type')) {
            this.type = jsonData['type'];
        }
        if (jsonData.hasOwnProperty('date_create_timestamp')) {
            this.date_create_timestamp = jsonData['date_create_timestamp'];
        }
        if (jsonData.hasOwnProperty('date_played_timestamp')) {
            this.date_played_timestamp = jsonData['date_played_timestamp'];
        }
        if (jsonData.hasOwnProperty('date_last_update_timestamp')) {
            this.date_last_update_timestamp = jsonData['date_last_update_timestamp'];
        }
        if (jsonData.hasOwnProperty('course_rating')) {
            this.course_rating = jsonData['course_rating'];
        }
        if (jsonData.hasOwnProperty('slope_rating')) {
            this.slope_rating = jsonData['slope_rating'];
        }
        if (jsonData.hasOwnProperty('gross')) {
            this.gross = jsonData['gross'];
        }
        if (jsonData.hasOwnProperty('over')) {
            this.over = jsonData['over'];
        }
        if (jsonData.hasOwnProperty('adjust')) {
            this.adjust = jsonData['adjust'];
        }
        if (jsonData.hasOwnProperty('selected_round_for_handicap_index')) {
            this.selected_round_for_handicap_index = jsonData['selected_round_for_handicap_index'];
        }
        if (jsonData.hasOwnProperty('tee_id')) {
            this.tee_id = jsonData['tee_id'];
        }
        if (jsonData.hasOwnProperty('awards')) {
            this.awards = jsonData['awards'];
        }
        if (jsonData.hasOwnProperty('source')) {
            this.source = jsonData['source'];
        }
        if (jsonData.hasOwnProperty('date_played_display')) {
            this.date_played_display = jsonData['date_played_display'];
        }

        if (jsonData.hasOwnProperty('InfoUserFlightTags')) {
            let users = jsonData['InfoUserFlightTags'];
            for (let obj of users) {
                let user = new UserProfileModel();
                user.parseData(obj);
                this.InfoUserFlightTags.push(user);
            }
        }
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }

    getFacility_id() {
        return this.facility_id;
    }

    setFacility_id(facility_id) {
        this.facility_id = facility_id;
    }

    getPath_id1() {
        return this.path_id1;
    }

    setPath_id1(path_id1) {
        this.path_id1 = path_id1;
    }

    getPath_id2() {
        return this.path_id2;
    }

    setPath_id2(path_id2) {
        this.path_id2 = path_id2;
    }

    getDate_played() {
        return this.date_played;
    }

    setDate_played(date_played) {
        this.date_played = date_played;
    }

    getDate_create() {
        return this.date_create;
    }

    setDate_create(date_create) {
        this.date_create = date_create;
    }

    getDate_last_update() {
        return this.date_last_update;
    }

    setDate_last_update(date_last_update) {
        this.date_last_update = date_last_update;
    }

    getFlightName() {
        return this.flight_name;
    }

    setFlight_name(flight_name) {
        this.flight_name = flight_name;
    }

    getStatus() {
        return this.status;
    }

    setStatus(status) {
        this.status = status;
    }

    getUrl_scorecards() {
        return this.url_scorecards;
    }

    getUrlScorecardArray() { return this.array_url_scorecard || []; }

    setUrl_scorecards(url_scorecards) {
        this.url_scorecards = url_scorecards;
    }

    getWhite_slope() {
        return this.white_slope;
    }

    setWhite_slope(white_slope) {
        this.white_slope = white_slope;
    }

    getGold_slope() {
        return this.gold_slope;
    }

    setGold_slope(gold_slope) {
        this.gold_slope = gold_slope;
    }

    getBlue_slope() {
        return this.blue_slope;
    }

    setBlue_slope(blue_slope) {
        this.blue_slope = blue_slope;
    }

    getRed_slope() {
        return this.red_slope;
    }

    setRed_slope(red_slope) {
        this.red_slope = red_slope;
    }

    getSource() {
        return this.source || '';
    }

    setSource(source) {
        this.source = source;
    }

    getType() {
        return this.type;
    }

    setType(type) {
        this.type = type;
    }

    getDate_create_timestamp() {
        return this.date_create_timestamp;
    }

    setDate_create_timestamp(date_create_timestamp) {
        this.date_create_timestamp = date_create_timestamp;
    }

    getDatePlayedTimestamp() {
        return this.date_played_timestamp;
    }

    setDate_played_timestamp(date_played_timestamp) {
        this.date_played_timestamp = date_played_timestamp;
    }

    getDate_last_update_timestamp() {
        return this.date_last_update_timestamp;
    }

    setDate_last_update_timestamp(date_last_update_timestamp) {
        this.date_last_update_timestamp = date_last_update_timestamp;
    }

    getOver(over) {
        return this.over;
    }

    getCourse_rating() {
        return this.course_rating;
    }

    getSlope_rating() {
        return this.slope_rating;
    }

    getGross() {
        return this.gross;
    }

    getAdjust() {
        return this.adjust;
    }

    getSelected_round_for_handicap_index() {
        return this.selected_round_for_handicap_index;
    }
    getTee_id() {
        return this.tee_id;
    }

    getAwards() {
        return this.awards;
    }

    getDatePlayedDisplay() {
        return this.date_played_display;
    }

    getUserProfiles() { return this.InfoUserFlightTags || []; }
}

module.exports = FlightModel;
