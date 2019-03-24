import React from 'react';
import { Platform, StyleSheet, Text, Image,Dimensions } from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import MyView from '../View/MyView';
import {scale, verticalScale, fontSize} from '../../Config/RatioScale';
let{width,height} = Dimensions.get('window');

export default class EmptyDataView extends BaseComponent {

    static defaultProps = {
        msg_content: '',
        customStyle: {}
    }

    constructor(props) {
        super(props);
        this.state = {
            isShow: false
        }
    }

    showEmptyView() {
        this.setState({
            isShow: true
        });
    }

    hideEmptyView() {
        this.setState({
            isShow: false
        });
    }

    render() {
        let {
            customStyle
        } = this.props;
        return (
            <MyView hide={!this.state.isShow} style={[styles.container, customStyle]}>
                <Image
                    style={styles.gray_icon}
                    source={this.getResources().logo_gray}
                />
                <Text allowFontScaling={global.isScaleFont} style={styles.content}>{this.props.msg_content? this.props.msg_content: this.t('data_empty')}</Text>
            </MyView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top:  verticalScale(80),
        // flex : 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    gray_icon: {
        width: scale(120),
        height: verticalScale(120),
        resizeMode: 'contain'
    },
    content: {
        color: '#979797',
        fontSize: fontSize(18,scale(4)),
        textAlign: 'center'
    }
});