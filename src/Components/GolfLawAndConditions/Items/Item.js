import React from 'react';
import { Text, View, StyleSheet} from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import Touchable from 'react-native-platform-touchable';
import { fontSize, scale, verticalScale } from '../../../Config/RatioScale';

/**
 * item là nhóm trong danh sách điều khoản
 */
export default class ItermItemView extends BaseComponent { 
    constructor(props){
        super(props);
    }

    static defaultProps = {
        data : null
    }

    render(){
        let{data} = this.props;
        //console.log("data = ");
        return(
            <View style={styles.container}>
                <Text allowFontScaling={global.isScaleFont} style={styles.title}>{data.getTitle()}</Text>
                {/* <Text allowFontScaling={global.isScaleFont} style={styles.update}>{this.t('update')} : {data.getUpdateAt()}</Text>
                <Text allowFontScaling={global.isScaleFont} style={styles.create}>{this.t('news_create_time')} : {data.getCreateAt()}</Text> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        //height : 70,
        justifyContent : 'center'
    },

    title : {
        fontSize : fontSize(18,scale(4)),
        fontWeight : 'bold',
        color : '#000',
        marginLeft : scale(20),
        marginTop : verticalScale(10),
        marginBottom : verticalScale(10),
        marginRight : scale(10)
    },

    // update : {
    //     fontSize : fontSize(14),
    //     color : '#000',
    //     marginLeft : scale(20)
    // },

    // create : {
    //     fontSize : fontSize(14),
    //     color : '#000',
    //     marginLeft : scale(20),
    //     marginBottom : verticalScale(10)
    // }
});