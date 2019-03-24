class StateModel{
    constructor(){
        this.id = '';
        this.name = '';
        this.country_id = '';
    }

    paserData(data){
        if(data.hasOwnProperty('id')){
            this.id = data['id'];
        }
        if(data.hasOwnProperty('name')){
            this.name = data['name'];
        }
        if(data.hasOwnProperty('country_id')){
            this.country_id =  data['country_id'];
        }
        
    }

    getId(){
        return this.id;
    }

    getName(){
        return this.name;
    }

    getCountryId(){
        return this.country_id;
    }

}

module.exports = StateModel;