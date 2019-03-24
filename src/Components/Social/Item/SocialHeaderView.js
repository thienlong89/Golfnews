import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import { Constants } from '../../../Core/Common/ExpoUtils';
import BaseComponent from '../../../Core/View/BaseComponent';

export default class SocialHeaderView extends BaseComponent {

    static defaultProps = {
        cancelTitle: '',
        rightTitle: '',
        centerTitle: ''
    }


    constructor(props) {
        super(props);
        this.isIphoneX = this.getAppUtil().isIphoneX();
        this.onCancelPost = this.onCancelPostPress.bind(this);
        this.onCreatePost = this.onCreatePostPress.bind(this);
        this.state = {

        }
    }

    render() {

        let { cancelTitle, rightTitle, centerTitle } = this.props;
        cancelTitle = cancelTitle || this.t('cancel_title');
        rightTitle = rightTitle || this.t('share');

        return (
            <View style={styles.container} >
                <View style={[styles.container_header, this.isIphoneX ? { marginTop: 30 } : {}]}>
                    <TouchableOpacity style={styles.touchable_left}
                        onPress={this.onCancelPost}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_touchable}>{cancelTitle}</Text>
                    </TouchableOpacity>
                    <View style={styles.touchable_center}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{centerTitle}</Text>
                    </View>
                    <TouchableOpacity style={styles.touchable_right}
                        onPress={this.onCreatePost}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_touchable}>{rightTitle}</Text>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }

    onCancelPostPress() {
        if (this.props.onCancelPostPress) {
            this.props.onCancelPostPress();
        }
    }

    onCreatePostPress() {
        if (this.props.onCreatePostPress) {
            this.props.onCreatePostPress();
        }
    }

}

const styles = StyleSheet.create({
    container: {
        height: 80,
        backgroundColor: '#F2F2F2',
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: -3,
        },
        elevation: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#D2D2D2'
    },
    container_header: {
        flex: 1,
        flexDirection: 'row',
        marginTop: Constants.statusBarHeight,
        alignItems: 'center'
    },
    touchable_left: {
        minWidth: 50,
        justifyContent: 'center',
        paddingLeft: 10
    },
    touchable_center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    touchable_right: {
        minWidth: 50,
        justifyContent: 'center',
        paddingRight: 10
    },
    txt_touchable: {
        color: '#00ABA7',
        fontSize: 15
    },
    txt_title: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold'
    }

});

