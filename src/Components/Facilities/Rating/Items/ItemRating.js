import React from 'react';
import { View, Text } from 'react-native';
import BaseComponent from '../../../../Core/View/BaseComponent';
import { scale, fontSize, verticalScale } from '../../../../Config/RatioScale';
import RateFacilityItem from '../../../Popups/Items/RateFacilityItem';
let widthStar = verticalScale(28);
let heightStar = verticalScale(28);

export default class ItemRating extends BaseComponent {
    constructor(props) {
        super(props);
        this.rate = 0;
    }

    rateClick(index) {
        this.rate = index;
        this.updateComponentRate(index);
    }

    refresh() {
        for (let i = 1; i <=5; i++) {
            let component = this.getComponentRate(i);
            if (component) {
                component.unRate();
            }
        }
    }

    updateComponentRate(rate) {
        for (let i = 1; i <= 5; i++) {
            let component = this.getComponentRate(i);
            if (!component) continue;
            if (i <= rate) {
                component.rate();
            } else {
                component.unRate();
            }
        }
    }

    getComponentRate(index) {
        let com = null;
        switch (index) {
            case 1:
                com = this.rate1;
                break;
            case 2:
                com = this.rate2;
                break;
            case 3:
                com = this.rate3;
                break;
            case 4:
                com = this.rate4;
                break;
            case 5:
                com = this.rate5;
                break;
            default:
                break;
        }
        return com;
    }

    render() {
        let { style, title } = this.props;
        return (
            <View style={[style, { flexDirection: 'row', alignItems: 'center' }]}>
                <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(17, scale(3)), color: '#424242', marginLeft: scale(10) }}>{title}</Text>
                <View style={{flex : 1}}/>
                <RateFacilityItem ref={(rate1) => { this.rate1 = rate1; }} clickCallback={this.rateClick.bind(this, 1)} style={{ width: widthStar, height: heightStar }} />
                <RateFacilityItem ref={(rate2) => { this.rate2 = rate2; }} clickCallback={this.rateClick.bind(this, 2)} style={{ marginLeft: scale(5), width: widthStar, height: heightStar }} />
                <RateFacilityItem ref={(rate3) => { this.rate3 = rate3; }} clickCallback={this.rateClick.bind(this, 3)} style={{ marginLeft: scale(5), width: widthStar, height: heightStar }} />
                <RateFacilityItem ref={(rate4) => { this.rate4 = rate4; }} clickCallback={this.rateClick.bind(this, 4)} style={{ marginLeft: scale(5), width: widthStar, height: heightStar }} />
                <RateFacilityItem ref={(rate5) => { this.rate5 = rate5; }} clickCallback={this.rateClick.bind(this, 5)} style={{ marginLeft: scale(5), width: widthStar, height: heightStar }} />
            </View>
        );
    }
}