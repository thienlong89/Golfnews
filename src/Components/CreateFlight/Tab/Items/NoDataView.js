import React from 'react';
import BaseComponent from "../../../../Core/View/BaseComponent";
import {View} from 'react-native';
import EmptyDataView from '../../../../Core/Common/EmptyDataView';
import MyView from '../../../../Core/View/MyView';

export default class NoDataView extends BaseComponent{
    constructor(props){
        super(props);
        this.state = {
            isShow : false
        }
    }

    show(){

        return;

        let{isShow} = this.state;
        if(isShow) return;
        this.setState({
            isShow : true
        },()=>{
            setTimeout(()=>{
                this.empty.showEmptyView();
            },50)
        });
    }

    hide(){
        let{isShow} = this.state;
        if(!isShow) return;
        this.setState({
            isShow : false
        });
    }

    render(){
        let{isShow} = this.state;
        return(
            <MyView style={{flex : 1,marginTop : this.getRatioAspect().verticalScale(5)}} hide={!isShow}>
                <EmptyDataView ref={(empty)=>{this.empty = empty}} />
            </MyView>
        );
    }
}