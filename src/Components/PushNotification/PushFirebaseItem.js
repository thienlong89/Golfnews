import React from 'react';
import {
    StyleSheet,
    // Text,
    View,
    Image,
    // Dimensions,
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import MyView from '../../Core/View/MyView';
import HtmlBoldText from '../../Core/Common/HtmlBoldText';
import ExpoUtils from '../../Core/Common/ExpoUtils';
import{scale,verticalScale,fontSize} from '../../Config/RatioScale';

export default class PushFirebaseItem extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            msg: '',
            isShow: false,
            title: ''
        }

        this.onItemClick = this.onItemClick.bind(this);
    }

    showMsg(_title, _msg) {
        console.log("show push fire base ", _title, _msg);
        this.setState({
            msg: _msg,
            isShow: true,
            title: _title
        });
        this.delayHidden();
    }

    delayHidden() {
        var refreshIntervalId = setInterval(() => {
            this.setState({
                isShow: false
            });
            clearInterval(refreshIntervalId);
        }, 3000);
    }

    onItemClick(){
        let{itemClickCallback,data} = this.props;
        if(itemClickCallback && data){
            itemClickCallback(data);
        }  
    }

    render() {
        let { isShow, title, msg } = this.state;
        return (
            // <Touchable onPress={this.onItemClick}>
                <MyView style={styles.container} hide={!isShow}>
                    <View style={styles.body}>
                        <Image style={styles.logo}
                            source={this.getResources().ic_logo_push} />
                        <View style={styles.content}>
                            <HtmlBoldText style={styles.title} message={title}></HtmlBoldText>
                            <HtmlBoldText style={styles.msg} message={msg}></HtmlBoldText>
                        </View>
                    </View>
                </MyView>
            // </Touchable>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        minHeight: 72 + ExpoUtils.Constants.statusBarHeight
    },

    msg: {
        marginLeft: scale(5),
        fontSize: fontSize(14),
        color: '#fff'
    },

    title: {
        marginLeft: scale(5),
        fontSize: fontSize(16,scale(2)),
        color: '#fff',
        fontWeight: 'bold'
    },

    content: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10),
        paddingRight: scale(10)
    },

    logo: {
        marginLeft: scale(10),
        width: verticalScale(40),
        height: verticalScale(40),
        resizeMode: 'contain'
    },

    body: {
        minHeight: verticalScale(50),
        marginTop: ExpoUtils.Constants.statusBarHeight,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00aba7'
    }
})