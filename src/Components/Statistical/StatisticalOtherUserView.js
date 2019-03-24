import React from 'react';
import {
    StyleSheet,
    View,
    BackHandler
} from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../Common/HeaderView';
import OtherScreen from './Screens/OtherScreen';


/**
 * Mở màn hình thông kê 10 trân gần nhất
 */
export default class StatisticalView extends BaseComponent{
    constructor(props){
        super(props);
        this.backHandler = null;
    }

    onBackClick(){
        let {navigation} = this.props;
        if(navigation){
            navigation.goBack();
        }
        return true;
    }

    componentDidMount(){
        this.backHandler = BackHandler.addEventListener('hardwareBackPress',this.onBackClick.bind(this));
        if(this.headerView){
            this.headerView.setTitle(this.t('thong_ke'));
            this.headerView.callbackBack = this.onBackClick.bind(this);
        }
    }

    componentWillUnmount(){
        if(this.backHandler) this.backHandler.remove();
    }

    render(){
        let{puid} = this.props.navigation.state.params;
        return(
            <View style={styles.container}>
                <HeaderView ref={(headerView)=>{this.headerView = headerView;}}/>
                <OtherScreen puid={puid}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
    },
});