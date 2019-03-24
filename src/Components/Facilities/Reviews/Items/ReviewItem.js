import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions
} from 'react-native';
import BaseComponent from '../../../../Core/View/BaseComponent';
import CustomAvatar from '../../../Common/CustomAvatar';
import { verticalScale, scale, fontSize } from '../../../../Config/RatioScale';
import RateFacilityItem from '../../../Popups/Items/RateFacilityItem';
let { width } = Dimensions.get('window');
width = width - verticalScale(40) - scale(30);

export default class ReviewItem extends BaseComponent {
    constructor(props) {
        super(props);

        this.refStar = [];
    }

    componentDidMount() {
        let { rate } = this.props.data;
        this.updateRateComponent(rate);
    }

    updateRateComponent(rate) {
        for (let i = 0; i < rate; i++) {
            if (this.refStar[i])
                this.refStar[i].rate();
        }
    }

    getElementTypeText() {
        let { data } = this.props;
        // console.log('.....................text data ', data);
        let { user, createdAt, content, send_status, fontSize, date } = data;
        createdAt = parseInt(createdAt);
        return (
            <View style={styles.container}>
                <CustomAvatar
                    width={verticalScale(40)}
                    height={verticalScale(40)}
                    uri={user.avatar}
                />
                <View style={styles.comment_group}>
                    <Text allowFontScaling={global.isScaleFont} style={[styles.txt_name, { fontSize: fontSize ? fontSize : 15 }]}>
                        {user.fullname}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RateFacilityItem disable_click={true} style={{ width: scale(17), height: scale(17) }} ref={(rate) => { this.refStar[0] = rate; }} />
                        <RateFacilityItem disable_click={true} style={{ width: scale(17), height: scale(17), marginLeft: scale(5) }} ref={(rate) => { this.refStar[1] = rate; }} />
                        <RateFacilityItem disable_click={true} style={{ width: scale(17), height: scale(17), marginLeft: scale(5) }} ref={(rate) => { this.refStar[2] = rate; }} />
                        <RateFacilityItem disable_click={true} style={{ width: scale(17), height: scale(17), marginLeft: scale(5) }} ref={(rate) => { this.refStar[3] = rate; }} />
                        <RateFacilityItem disable_click={true} style={{ width: scale(17), height: scale(17), marginLeft: scale(5) }} ref={(rate) => { this.refStar[4] = rate; }} />
                        <Text allowFontScaling={global.isScaleFont} style={{ fontSize: 15, color: '#a3a3a3', marginLeft: scale(10) }}>{date}</Text>
                    </View>
                    <Text allowFontScaling={global.isScaleFont} style={[styles.txt_comment, { fontSize: fontSize ? fontSize : 15 }]}>
                        {content}
                    </Text>
                </View>
            </View>
        );
    }

    render() {
        let { type } = this.props.data;
        let element = null;
        if (type === 'text') {
            element = this.getElementTypeText();
        }
        return (
            element
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        // alignItems: 'center',
        paddingLeft: scale(10),
        // paddingRight: scale(10),
        marginTop: verticalScale(10),
        marginRight: scale(10)
        // backgroundColor : 'green'
    },
    comment_group: {
        backgroundColor: '#EEEEEE',
        borderRadius: verticalScale(10),
        padding: 5,
        // justifyContent: 'center',
        marginLeft: scale(10),
        maxWidth: width
        // marginRight : scale(20)
    },
    txt_name: {
        color: '#474747',
        fontWeight: 'bold',
        // fontSize: 13,
        marginBottom: 1,
        marginLeft: scale(5),
    },
    txt_comment: {
        color: '#1F1F1F',
        marginLeft: scale(5)
        // fontSize: 13
    },
});