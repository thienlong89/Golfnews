import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import { scale, verticalScale, moderateScale, fontSize } from '../../Config/RatioScale';

const colorArr = ['#FF9533', '#0AB726', '#FF0000', '#3A3A3A'];

export default class PerformanceContentItem extends BaseComponent {

    static defaultProps = {
        index: -1,
        defaultData: ['', '', '', '', '', '', '', '', '', ''],
    }

    constructor(props) {
        super(props);

        this.state = {
            dataList: this.props.defaultData
        }

    }

    renderData(dataList, itemIndex) {
        let itemView = dataList.map((data, index) => {
            if (index <= 4) {
                return (
                    <View style={[styles.view_item, { backgroundColor: itemIndex === 0 ? '#F5F5FA' : '#fff' }]}>
                        <Text allowFontScaling={global.isScaleFont} style={[styles.txt_data, { color: colorArr[3], textAlign:  'center' }]}>{itemIndex != -1 && data != '' ? `${data}%` : data}</Text>
                    </View>
                )
            } else {
                return (
                    <View style={[styles.view_item, { backgroundColor: itemIndex === 0 ? '#F5F5FA' : '#fff' }]}>
                        <Text allowFontScaling={global.isScaleFont} style={[styles.txt_data, { textAlign: 'center', color: data >= 0 && data <= 2 ? colorArr[data] : colorArr[3] }]}>
                            {itemIndex != -1 ? this.setForecast(data) : data}</Text>
                    </View>
                )
            }

        })
        return (
            <View >
                {itemView}
            </View>
        )
    }

    render() {
        let {
            dataList
        } = this.state;

        let {
            index,
        } = this.props;

        return (
            <View style={[styles.container, { flex: index === -1 ? 1.3 : 1 }]}>
                {this.renderData(dataList, index)}
            </View>
        );
    }

    setData(dataList = []) {
        this.setState({
            dataList: dataList.length > 0 ? dataList : this.props.defaultData
        })
    }

    setForecast(data) {
        switch (data) {
            case 0:
                return this.t('a_draw');
            case 1:
                return this.t('can_win');
            case 2:
                return this.t('can_lose');
            default:
                return data;
        }
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'column'
    },
    view_item_header: {
        borderColor: '#D4D4D4',
        borderWidth: 0.5,
        height: scale(80),
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_item: {
        borderColor: '#D4D4D4',
        borderWidth: 0.5,
        height: scale(50),
        justifyContent: 'center',
        alignItems: 'center'
    },
    txt_data: {
        // opacity: 0.8,
        fontSize: fontSize(15),
        marginLeft: scale(5),
        marginBottom: scale(5),
        marginTop: scale(5)
    },
    touchable_delete: {
        position: 'absolute',
        right: 0,
        width: 40,
        height: 40,
        alignItems: 'flex-end'
    },
    img_delete: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        tintColor: 'red'
    },
    avatar_style: {
        borderColor: '#00ABA7',
        borderWidth: 2,
    },
});