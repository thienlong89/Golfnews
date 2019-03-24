import React from 'react';
import { Rating } from 'react-native-elements';

export default class CustomRate extends React.Component {

    constructor() {
        super();
        this.state = {
            rate_value: 0
        }
    }

    /**
     * Set giá trị rate sân
     * @param {number} value 
     */
    setRateValue(value = 0) {
        if (value === 0) return;
        this.setState({
            rate_value: value
        });
    }

    render() {
        let { style, imageSize } = this.props;
        let { rate_value } = this.state;
        console.log('.......................rate_value : ', rate_value);
        if (!rate_value) {
            return null
        } else
            return (
                <Rating style={style} imageSize={imageSize} readonly startingValue={rate_value} />
            );
    }
}