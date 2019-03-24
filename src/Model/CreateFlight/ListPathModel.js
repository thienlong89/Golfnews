import BaseModel from '../../Core/Model/BaseModel';
import PathModel from './Flight/PathModel';
import CourseModel from './Flight/CourseModel';

class ListPathModel extends BaseModel {
    constructor(baseComponent) {
        super(baseComponent);
        this.select_type = 0;
        this.pathList = [];
        this.courseList = [];
        this.teeListAvailable = [];
        this.teeInfoList = [];
    }

    parseData(jsonData) {
        super.parseData(jsonData);
        // console.log('data', this.data);
        if (this.data.hasOwnProperty('select_type')) {
            this.select_type = this.data['select_type'];
        }

        if (this.data.hasOwnProperty('paths')) {
            let paths = this.data['paths'];
            for (let _obj of paths) {
                let path = new PathModel();
                path.parseData(_obj);
                this.pathList.push(path);
            }
        }

        if (this.data.hasOwnProperty('tees_info')) {
			let tees_info = this.data['tees_info'];
			let keys = Object.keys(tees_info);
			for (let key of keys) {
				let obj_tee = tees_info[key];
				//{ tee: 'black', color: 'black' }
				let tee = { tee: key, color: key, rating: obj_tee['rating'], slope: obj_tee['slope'], length: obj_tee['length'] };
				this.teeInfoList.push(tee);
			}
		}

        if (this.data.hasOwnProperty('tees_info_gender')) {
            let tees_info_gender = this.data['tees_info_gender'];
            let keys = Object.keys(tees_info_gender);
            for (let key of keys) {
                let obj_tee_men = tees_info_gender[key].men;
                let obj_tee_women = tees_info_gender[key].women;
                //{ tee: 'black', color: 'black' }
                let tee = {
                    tee: key,
                    color: key,
                    rating: {
                        men: obj_tee_men ? obj_tee_men['rating'] : null,
                        women: obj_tee_women ? obj_tee_women['rating'] : null
                    },
                    slope: {
                        men: obj_tee_men ? obj_tee_men['slope'] : null,
                        women: obj_tee_women ? obj_tee_women['slope'] : null
                    },
                    length: {
                        men: obj_tee_men ? obj_tee_men['length'] : null,
                        women: obj_tee_women ? obj_tee_women['length'] : null
                    }
                };
                this.teeListAvailable.push(tee);
            }
        }

        if (this.data.hasOwnProperty('courses')) {
            let courses = this.data['courses'];
            for (let _obj of courses) {
                let course = new CourseModel();
                course.parseData(_obj);
                this.courseList.push(course);
            }
        }
    }

    parseJsonData(jsonData) {
        if (jsonData.hasOwnProperty('select_type')) {
            this.select_type = jsonData['select_type'];
        }
        if (jsonData.hasOwnProperty('paths')) {
            let paths = jsonData['paths'];
            for (let _obj of paths) {
                let path = new PathModel();
                path.parseData(_obj);
                this.pathList.push(path);
            }
        }

        if (jsonData.hasOwnProperty('tees_info')) {
			let tees_info = jsonData['tees_info'];
			let keys = Object.keys(tees_info);
			for (let key of keys) {
				let obj_tee = tees_info[key];
				//{ tee: 'black', color: 'black' }
				let tee = { tee: key, color: key, rating: obj_tee['rating'], slope: obj_tee['slope'], length: obj_tee['length'] };
				this.teeInfoList.push(tee);
			}
		}

        if (jsonData.hasOwnProperty('tees_info_gender')) {
            let tees_info_gender = jsonData['tees_info_gender'];
            let keys = Object.keys(tees_info_gender);
            for (let key of keys) {
                let obj_tee_men = tees_info_gender[key].men;
                let obj_tee_women = tees_info_gender[key].women;
                //{ tee: 'black', color: 'black' }
                let tee = {
                    tee: key,
                    color: key,
                    rating: {
                        men: obj_tee_men ? obj_tee_men['rating'] : null,
                        women: obj_tee_women ? obj_tee_women['rating'] : null
                    },
                    slope: {
                        men: obj_tee_men ? obj_tee_men['slope'] : null,
                        women: obj_tee_women ? obj_tee_women['slope'] : null
                    },
                    length: {
                        men: obj_tee_men ? obj_tee_men['length'] : null,
                        women: obj_tee_women ? obj_tee_women['length'] : null
                    }
                };
                this.teeListAvailable.push(tee);
            }
        }

        if (jsonData.hasOwnProperty('courses')) {
            let courses = jsonData['courses'];
            for (let _obj of courses) {
                let course = new CourseModel();
                course.parseData(_obj);
                this.courseList.push(course);
            }
        }
    }

    getSelectType() {
        return this.select_type;
    }

    getPathList() {
        return this.pathList;
    }

    getCourseList() {
        return this.courseList;
    }

    getTeeInfoGender() { return this.teeListAvailable ? this.teeListAvailable : []; }

    getTeeInfo() { return this.teeInfoList ? this.teeInfoList : []; }

    setSelectType(_select_type) {
        this.select_type = _select_type;
    }

    setPathList(_pathList) {
        this.pathList = _pathList;
    }

    setCourseList(_courseList) {
        this.courseList = _courseList;
    }

    setTeeInfoGender(teeList = []) {
        this.teeListAvailable = teeList;
    }

}

module.exports = ListPathModel;
