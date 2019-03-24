import React from 'react';
import {View,Text,BackHandler} from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from './Searchs/SearchHeaderView';
import SearchView from './Searchs/SearchInputView';

export default class LeaderboardSearchView extends BaseComponent{
    constructor(props){
        super(props);
        this.onBackClick = this.onBackClick.bind(this);
        this.backHandler = null;
    }

    componentDidMount(){
        if(this.header){
            this.header.backCallback = this.onBackClick;
        }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress',this.onBackClick);
    }

    componentWillUnmount(){
        if(this.backHandler) this.backHandler.remove();
    }

    onBackClick(){
        let{navigation} = this.props;
        if(navigation){
            navigation.goBack();
        }
        return true;
    }

    render(){
        return(
            <View style={{flex : 1,backgroundColor : 'white'}}>
                <HeaderView ref={(header)=>{this.header = header;}}/>
                <SearchView />
            </View>
        );
    }
}