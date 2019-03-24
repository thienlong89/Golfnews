export default class HoleUserModel {
    constructor() {
        this.tee_club = '';
        this.tee_direction = '';
        this.sand = '';
        this.putt = '';
        this.ob = '';
        this.water = '';
        this.hole_id = '';
        this.round_id = 0;
        this.hole_stt = 0;
        this.gross = 0;
        this.par = 0;
        this.length = 0;
        this.hole_length = 0;
        this.hole_index = 0;
        this.id=0 ;
        this.black_length='' ;
		this.gold_length=0 ;
		this.blue_length=0 ;
		this.white_length=0 ;
		this.red_length=0 ;
    }
    parseData(data) {
        if (data.hasOwnProperty('tee_club')) {
            this.tee_club = data['tee_club'];
        }
        if(data.hasOwnProperty('id')){
			this.id=parseFloat(data['id']);
		}
        if (data.hasOwnProperty('tee_direction')) {
            this.tee_direction = data['tee_direction'];
        }
        if (data.hasOwnProperty('sand')) {
            this.sand = data['sand'];
        }
        if (data.hasOwnProperty('putt')) {
            this.putt = data['putt'];
        }
        if (data.hasOwnProperty('ob')) {
            this.ob = data['ob'];
        }
        if (data.hasOwnProperty('water')) {
            this.water = data['water'];
        }
        if (data.hasOwnProperty('id')) {
            this.hole_id = data['id'];
        }
        if (data.hasOwnProperty('round_id')) {
            this.round_id = parseFloat(data['round_id']);
        }
        if (data.hasOwnProperty('hole_stt')) {
            this.hole_stt = parseFloat(data['hole_stt']);
        }
        if (data.hasOwnProperty('gross')) {
            this.gross = parseFloat(data['gross']);
        }
        if (data.hasOwnProperty('par')) {
            this.par = parseFloat(data['par']);
        }
        if (data.hasOwnProperty('length')) {
            this.length = parseFloat(data['length']);
        }
        if (data.hasOwnProperty('hole_length')) {
            this.hole_length = parseFloat(data['hole_length']);
        }
        if (data.hasOwnProperty('hole_index')) {
            this.hole_index = parseFloat(data['hole_index']);
        }
        if(data.hasOwnProperty('black_length')){
			this.black_length=data['black_length'];
		}
		if(data.hasOwnProperty('gold_length')){
			this.gold_length=parseFloat(data['gold_length']);
		}
		if(data.hasOwnProperty('blue_length')){
			this.blue_length=parseFloat(data['blue_length']);
		}
		if(data.hasOwnProperty('white_length')){
			this.white_length=parseFloat(data['white_length']);
		}
		if(data.hasOwnProperty('red_length')){
			this.red_length=parseFloat(data['red_length']);
		}
    }
    getTeeClub() { return this.tee_club || ''; }
    getTeeDirection() { return this.tee_direction || ''; }
    getSand() { return this.sand || ''; }
    getPutt() { return this.putt || ''; }
    getOb() { return this.ob || ''; }
    getWater() { return this.water || ''; }
    getId() { return this.hole_id || ''; }
    getRoundId() { return this.round_id || 0; }
    getHoleStt() { return this.hole_stt || 0; }
    getGross() { return this.gross || 0; }
    getPar() { return this.par || 0; }
    getLength() { return this.length || 0; }
    getHoleLength() { return this.hole_length || 0; }
    getHoleIndex() { return this.hole_index || 0; }
    getId(){ return this.id || 0 ;}
    getBlackLength(){ return this.black_length || '' ;}
	getGoldLength(){ return this.gold_length || 0 ;}
	getBlueLength(){ return this.blue_length || 0 ;}
	getWhiteLength(){ return this.white_length || 0 ;}
	getRedLength(){ return this.red_length || 0 ;}

    setGross(_gross) { this.gross = _gross; }
    setPutt(_putt) { this.putt = _putt; }
    setTeeClub(_teeClub) { this.tee_club = _teeClub; }
    setDirection(_direction) { this.tee_direction = _direction; }
}
