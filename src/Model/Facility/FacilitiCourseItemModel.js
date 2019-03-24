class FacilityCourseItemModel {
    constructor() {
        this.id = 0;
        this.facility_id = 0;
        this.path_id1 = 0;
        this.path_id2 = 0;
        this.title = '';
        this.sub_title = '';
        this.distance = '';
        this.address = '';
        this.rate = 0;
        this.black_slope = '';
        this.gold_slope = '';
        this.blue_slope = '';
        this.white_slope = '';
        this.red_slope = '';
        this.distance_km = 0;
        this.distance_display = '';
        this.longitude = 0;
        this.latitude = 0;
        this.teeList = [];
        this.country_name = '';
        this.img_country = '';
        //toan bo thong tin do sever trar ve
        this.course_object = {};
    }

    paserData(data) {
        this.course_object = Object.assign({},data);
        // console.log('.......................................... course_object',this.course_object)
        if (data.hasOwnProperty('id')) {
            this.id = data['id'];
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
        if (data.hasOwnProperty('title')) {
            this.title = data['title'];
        }
        if (data.hasOwnProperty('sub_title')) {
            this.sub_title = data['sub_title'];
        }
        if (data.hasOwnProperty('distance')) {
            this.distance = data['distance'];
        }
        if (data.hasOwnProperty('address')) {
            this.address = data['address'];
        }
        if (data.hasOwnProperty('rate')) {
            this.rate = data['rate'];
        }
        if (data.hasOwnProperty('black_slope')) {
            this.black_slope = data['black_slope'];
        }
        if (data.hasOwnProperty('gold_slope')) {
            this.gold_slope = data['gold_slope'];
        }
        if (data.hasOwnProperty('blue_slope')) {
            this.blue_slope = data['blue_slope'];
        }
        if (data.hasOwnProperty('white_slope')) {
            this.white_slope = data['white_slope'];
        }
        if (data.hasOwnProperty('red_slope')) {
            this.red_slope = data['red_slope'];
        }
        if (data.hasOwnProperty('distance_km')) {
            this.distance_km = data['distance_km'];
        }
        if (data.hasOwnProperty('distance_display')) {
            this.distance_display = data['distance_display'];
        }
        if (data.hasOwnProperty('longitude')) {
            this.longitude = data['longitude'];
        }
        if (data.hasOwnProperty('latitude')) {
            this.latitude = data['latitude'];
        }
        if (data.hasOwnProperty('country_name')) {
            this.country_name = data['country_name'];
        }
        if (data.hasOwnProperty('img_country')) {
            this.img_country = data['img_country'];
        }
        if (data.hasOwnProperty('list_tee')) {
            for (let obj of data['list_tee']) {
                let newObj = {
                    tee: obj.tee,
                    color: obj.color
                }
                this.teeList.push(newObj);
            }
        }
        if(data.hasOwnProperty('tees_info')){
            this.teeListAvailable = [];
            let tees_info = data['tees_info'];
            let keys = Object.keys(tees_info);
            for(let key of keys){
                let obj_tee = tees_info[key];
                //{ tee: 'black', color: 'black' }
                let tee = {tee : key,color : key , rating : obj_tee['rating'],slope : obj_tee['slope'],length : obj_tee['length']};
                this.teeListAvailable.push(tee);
            }
        }

        if (data.hasOwnProperty('tees_info_gender')) {
			let tees_info_gender = data['tees_info_gender'];
			// console.log('tee info full..................................... ', this.tee_info_full);

			this.teeListAvailable2 = [];
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
				this.teeListAvailable2.push(tee);
			}
		}
        
    }

    getCourse(){
        return this.course_object;
    }

    getBlackSlope() {
        return this.black_slope ? this.black_slope : 0;
    }

    getGoldSlope() {
        return this.gold_slope ? this.gold_slope : 0;
    }

    getBlueSlope() {
        return this.blue_slope ? this.blue_slope : 0;
    }

    getRedSlope() {
        return this.red_slope ? this.red_slope : 0;
    }

    getWhiteSlope() {
        return this.white_slope ? this.white_slope : 0;
    }

    getId() {
        return this.id ? this.id : 0;
    }

    getFacilityId() {
        return this.facility_id ? this.facility_id : 0;
    }

    getPathId1() {
        return this.path_id1 ? this.path_id1 : 0;
    }

    getPathId2() {
        return this.path_id2 ? this.path_id2 : 0;
    }

    getTitle() {
        return this.title ? this.title : '';
    }

    getSubTitle() {
        return this.sub_title ? this.sub_title : '';
    }

    getDistance() {
        return this.distance;
    }

    getAddress() {
        return this.address;
    }

    getRate() {
        return this.rate;
    }

    getDistanceKm() {
        return this.distance_km;
    }

    getDistanceDisplay() {
        return this.distance_display;
    }

    getLongitude() {
        return this.longitude;
    }

    getLatitude() {
        return this.latitude;
    }

    getCountryName() {
        return this.country_name;
    }

    getCountryFlag() {
        return this.img_country;
    }

    getTeeList() {
        return this.teeListAvailable ? this.teeListAvailable : this.teeList;
    }

    getTeeListAvailable(){
        return this.teeListAvailable ? this.teeListAvailable : [];
    }

    getTeeInfoGender() { return this.teeListAvailable2 ? this.teeListAvailable2 : []; }

}

module.exports = FacilityCourseItemModel;