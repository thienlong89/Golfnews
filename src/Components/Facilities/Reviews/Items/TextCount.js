import React from 'react';
import {
    Text,
} from 'react-native';
import BaseComponent from '../../../../Core/View/BaseComponent';

export default class TextCount extends BaseComponent {

    static defaultProps = {
        count: 0
    }

    constructor(props) {
        super(props);
        this.state = {
            count: this.props.count
        }
    }

    updateCommentNumber(count = 0) {
        this.setState({
            count: count
        });
    }

    /**
     * Cập nhật giá trị cho text
     * @param {*} value 
     */
    updateValue(value = '') {
        this.setState({
            count: value
        });
    }

    render() {
        let { style } = this.props;
        let { count } = this.state;
        console.log('.......................... count : ', count);

        if (count === 0) return null;
        return (
            <Text allowFontScaling={global.isScaleFont} style={style} numberOfLines={1}>{count}</Text>
        );
    }
}