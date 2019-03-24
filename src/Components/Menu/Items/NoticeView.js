import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import ItemLoadingView from '../../Common/ItemLoadingView';
import MyView from '../../../Core/View/MyView';

import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
// let{width,height} = Dimensions.get('window');

/**
 * Cac man hinh bat tat thong bao
 */
export default class NoticeView extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            on: false,
            isLoading: false
        }
        this.onClick = this.onClick.bind(this);
    }

    /**
     * update trang thai
     * @param {boolean} isSucces 
     */
    setChange(isSucces) {
        this.itemLoading.hideLoading();
        this.setState({
            on: isSucces,
            isLoading: false
        });
    }

    /**
     * Click item
     */
    onClick() {
        let { isLoading } = this.state;
        if (isLoading) return;
        let { onClickCallback } = this.props;
        let { on } = this.state;
        this.setState({
            isLoading: true
        });
        this.itemLoading.showLoading();
        if (onClickCallback) {
            let type = !on ? 0 : 1;
            onClickCallback(type);
        }
    }

    render() {
        let { style, title, subTitle } = this.props;
        let { isLoading } = this.state;
        return (
            <View style={style}>
                <View style={{ flex: 1, justifyContent: 'center',marginRight : scale(7),paddingBottom : verticalScale(7),paddingTop : verticalScale(7) }}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.alert_text}>{title}</Text>
                    <MyView hide={!subTitle || !subTitle.length}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.subTitle}>{subTitle}</Text>
                    </MyView>
                </View>


                <MyView style={styles.alert_icon_view} hide={isLoading}>
                    <Touchable onPress={this.onClick}>
                        <Image
                            style={styles.alert_icon_image}
                            source={!this.state.on ? this.getResources().ic_off : this.getResources().ic_on}
                        />
                    </Touchable>
                </MyView>
                <ItemLoadingView ref={(itemLoading) => { this.itemLoading = itemLoading; }}
                    top={verticalScale(10)} right={scale(20)} />
            </View>
        );
    }
}

const styles = StyleSheet.create({

    subTitle : {
        textAlignVertical: 'center',
        fontSize: fontSize(15, scale(1)),// 16,
        color: '#B7B6B6',
    },

    alert_text: {
        // flex: 1,
        textAlignVertical: 'center',
        fontSize: fontSize(16, scale(2)),// 16,
        color: '#424242',
        //marginLeft: 10
    },

    alert_icon_image: {
        width: scale(50),
        height: verticalScale(30),
        resizeMode: 'contain',
        marginRight: scale(10)
    },
});