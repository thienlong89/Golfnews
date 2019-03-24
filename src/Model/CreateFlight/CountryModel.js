class CountryModel{
    constructor(){
        this.id = '';
        this.name = '';
        this.sortname = '';
        this.image = '';
    }

    paserData(data){
        if(data.hasOwnProperty('id')){
            this.id = data['id'];
        }
        if(data.hasOwnProperty('name')){
            this.name = data['name'];
        }
        if(data.hasOwnProperty('sortname')){
            this.sortname =  data['sortname'];
        }
        if(data.hasOwnProperty('number_states')){
            this.number_states = data['number_states'];
        }
        if(data.hasOwnProperty('image')){
            this.image = data['image'];
        }
    }

    getNumberState(){
        return this.number_states ? this.number_states : 0;
    }

    getId(){
        return this.id;
    }

    getName(){
        return this.name;
    }

    getSortName(){
        return this.sortname;
    }

}

module.exports = CountryModel;