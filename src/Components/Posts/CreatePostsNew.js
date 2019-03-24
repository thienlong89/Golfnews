import BaseComponent from "../../Core/View/BaseComponent";
import React from 'react';
import {StyleSheet,View} from 'react-native';
import Header from './PostsHeader';

export default class CreatePostsNew extends BaseComponent{
    constructor(props){
        super(props);
    }

    componentDidMount(){
        if(this.header){
            this.header.backCallback = this.onBackClick.bind(this);
        }
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
            <View style={styles.container}>
                <Header ref={(header)=>{this.header = header;}}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : '#fff'
    }
});