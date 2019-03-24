import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    Animated,
    Dimensions
} from 'react-native';
import BaseComponent from '../../../../Core/View/BaseComponent';
import Touchable from 'react-native-platform-touchable';
import { fontSize, scale, verticalScale } from '../../../../Config/RatioScale';
import TextCount from './TextCount';
import ReviewListView from './ReviewListView';
import PopupReviewFacilityView from '../../../Popups/PopupReviewFacilityView';
let { height, width } = Dimensions.get('window');

export default class ReviewView extends BaseComponent {
    constructor(props) {
        super(props);
        this.onWriteReviewClick = this.onWriteReviewClick.bind(this);

        this.isMore = false;
    }

    onWriteReviewClick() {
        let { writeReviewClick } = this.props;
        if (writeReviewClick) writeReviewClick();
    }

    fillData(listData) {
        this.listReview.fillData(listData);
    }

    updateCountReview(count) {
        this.refCountReview.updateCommentNumber(count);
    }

    render() {
        return (
            <View style={[styles.container]}>
                <View style={styles.view_header}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_review}>{this.t('danh_gia').toUpperCase()}</Text>
                    <Text allowFontScaling={global.isScaleFont} style={{color:'#9E9E9E', marginLeft: scale(5), fontSize: fontSize(20)}}>{'•'}</Text>
                    <TextCount ref={(refCountReview) => { this.refCountReview = refCountReview; }}
                        count={0}
                        style={styles.txt_review_count} />
                    <View style={{ flex: 1 }}></View>
                    <Touchable onPress={this.onWriteReviewClick}>
                        <View style={styles.view_write_review}>
                            <Image style={styles.img_pen}
                                source={this.getResources().pen}
                            />
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_write_review}>{this.t('write_review')}</Text>
                        </View>
                    </Touchable>
                </View>
                <ReviewListView ref={(listReview) => { this.listReview = listReview; }} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff'
    },
    view_header: {
        height: verticalScale(50),
        flexDirection: 'row',
        alignItems: 'center'
    },
    txt_review: {
        fontSize: fontSize(15, scale(4)),
        color: '#424242',
        fontWeight: 'bold',
        marginLeft: scale(10)
    },
    txt_review_count: {
        fontSize: fontSize(15, scale(4)),
        color: '#424242',
        fontWeight: 'bold',
        marginLeft: scale(5)
    },
    view_write_review: {
        flexDirection: 'row',
        marginRight: scale(10),
        alignItems: 'center',
        borderColor: '#a3a3a3',
        borderRadius: 5,
        borderWidth: 1,
        minHeight: verticalScale(30)
    },
    img_pen: {
        marginLeft: scale(5),
        width: verticalScale(15),
        height: verticalScale(15),
        resizeMode: 'contain',
        tintColor: '#474747'
    },
    txt_write_review: {
        marginLeft: scale(7),
        marginRight: scale(7),
        fontSize: fontSize(14, scale(2)),
        color: '#474747'
    }
});