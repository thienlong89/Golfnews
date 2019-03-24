class CityModel{
    constructor(){
        this.id = '';
        this.name = '';
        this.state_id = '';
    }

    paserData(data){
        if(data.hasOwnProperty('id')){
            this.id = data['id'];
        }
        if(data.hasOwnProperty('name')){
            this.name = data['name'];
        }
        if(data.hasOwnProperty('state_id')){
            this.state_id =  data['state_id'];
        }
        
    }

    getId(){
        return this.id;
    }

    getName(){
        return this.name;
    }

    getStateId(){
        return this.state_id;
    }

}

module.exports = CityModel;