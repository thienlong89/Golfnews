export default class HoleModel {
	constructor(){
		this.holeIndex=0 ;
		this.id=0 ;
		this.pathId=0 ;
		this.stt=0 ;
		this.par=0 ;
		this.urlPreview='' ;
		this.blackLength='' ;
		this.goldLength=0 ;
		this.blueLength=0 ;
		this.whiteLength=0 ;
		this.redLength=0 ;
		this.blackHandicap='' ;
		this.goldHandicap=0 ;
		this.blueHandicap=0 ;
		this.whiteHandicap=0 ;
		this.redHandicap=0 ;
	}
	parseData(data){
		if(data.hasOwnProperty('hole_index')){
			this.holeIndex=parseFloat(data['hole_index']);
		}
		if(data.hasOwnProperty('id')){
			this.id=parseFloat(data['id']);
		}
		if(data.hasOwnProperty('path_id')){
			this.pathId=parseFloat(data['path_id']);
		}
		if(data.hasOwnProperty('stt')){
			this.stt=parseFloat(data['stt']);
		}
		if(data.hasOwnProperty('par')){
			this.par=parseFloat(data['par']);
		}
		if(data.hasOwnProperty('url_preview')){
			this.urlPreview=data['url_preview'];
		}
		if(data.hasOwnProperty('black_length')){
			this.blackLength=data['black_length'];
		}
		if(data.hasOwnProperty('gold_length')){
			this.goldLength=parseFloat(data['gold_length']);
		}
		if(data.hasOwnProperty('blue_length')){
			this.blueLength=parseFloat(data['blue_length']);
		}
		if(data.hasOwnProperty('white_length')){
			this.whiteLength=parseFloat(data['white_length']);
		}
		if(data.hasOwnProperty('red_length')){
			this.redLength=parseFloat(data['red_length']);
		}
		if(data.hasOwnProperty('black_handicap')){
			this.blackHandicap=data['black_handicap'];
		}
		if(data.hasOwnProperty('gold_handicap')){
			this.goldHandicap=parseFloat(data['gold_handicap']);
		}
		if(data.hasOwnProperty('blue_handicap')){
			this.blueHandicap=parseFloat(data['blue_handicap']);
		}
		if(data.hasOwnProperty('white_handicap')){
			this.whiteHandicap=parseFloat(data['white_handicap']);
		}
		if(data.hasOwnProperty('red_handicap')){
			this.redHandicap=parseFloat(data['red_handicap']);
		}
	}
	getHoleIndex(){ return this.holeIndex || 0 ;}
	getId(){ return this.id || 0 ;}
	getPathId(){ return this.pathId || 0 ;}
	getStt(){ return this.stt || 0 ;}
	getPar(){ return this.par || 0 ;}
	getUrlPreview(){ return this.urlPreview || '' ;}
	getBlackLength(){ return this.blackLength || '' ;}
	getGoldLength(){ return this.goldLength || 0 ;}
	getBlueLength(){ return this.blueLength || 0 ;}
	getWhiteLength(){ return this.whiteLength || 0 ;}
	getRedLength(){ return this.redLength || 0 ;}
	getBlackHandicap(){ return this.blackHandicap || '' ;}
	getGoldHandicap(){ return this.goldHandicap || 0 ;}
	getBlueHandicap(){ return this.blueHandicap || 0 ;}
	getWhiteHandicap(){ return this.whiteHandicap || 0 ;}
	getRedHandicap(){ return this.redHandicap || 0 ;}

}
