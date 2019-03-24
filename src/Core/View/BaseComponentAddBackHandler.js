import {BackHandler} from 'react-native';
import BaseComponent from "./BaseComponent";

export default class BaseComponentAddBackHandler extends BaseComponent{
    constructor(props){
        super(props);
        this.backHandler = null;
        this.navigation = this.props.navigation;

        console.log('......................... this.navigation : ',this.navigation);
    }

    addListenerBackHandler(isFirstScreen = false){
        console.log('..................................... addListenerBackHandler ',isFirstScreen);
        if(this.backHandler || !this.navigation) return;
        this.backHandler = BackHandler.addEventListener('hardwareBackPress',()=>{
            // this.navigation.goBack();
            //back ve man hinh dau tien
            if(isFirstScreen){
                BackHandler.exitApp();
            }
            this.navigation.navigate('finish_flight');
            console.log('..............back navigator : ');
            return true;
        });
    }

    removeListenerBackHandler(){
        if(this.backHandler) this.backHandler.remove();
    }
}