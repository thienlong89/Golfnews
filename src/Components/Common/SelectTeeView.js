import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    FlatList
} from 'react-native';
import AppUtil from '../../Config/AppUtil';
import Touchable from 'react-native-platform-touchable'
import MyView from '../../Core/View/MyView';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';

export default class SelectTeeView extends React.Component {

    static defaultProps = {
        teeList: []
    }

    constructor(props) {
        super(props);
        this.state = {
            teeList: []
        }
    }

    getRatingSlope(rating, slope) {
        if (!rating) {
            return slope;
        } else {
            return rating ? `${rating}/${slope}` : rating;
        }
    }

    getLength(length) {
        return length ? `|${length}Y` : '';
    }


    renderSlopeRatingMen(slope, rating, length) {
        if (!slope || !rating || !length) return null;
        return (
            <Text allowFontScaling={global.isScaleFont} style={{ color: '#000', fontSize: fontSize(14), fontWeight: 'bold', marginRight: scale(5) }}>
                {`Men: ${this.getRatingSlope(rating, slope, 0)}`}
                <Text allowFontScaling={global.isScaleFont} style={{ fontWeight: 'normal' }}>{this.getLength(length, 0)}</Text>
            </Text>
        )
    }

    renderSlopeRatingWomen(slope, rating, length) {
        if (!slope || !rating || !length) return null;
        return (
            <Text allowFontScaling={global.isScaleFont} style={{ color: '#000', fontSize: fontSize(14), fontWeight: 'bold', marginRight: scale(5) }}>
                {`Women: ${this.getRatingSlope(rating, slope, 1)}`}
                <Text allowFontScaling={global.isScaleFont} style={{ fontWeight: 'normal' }}>{this.getLength(length, 1)}</Text>
            </Text>
        )
    }

    renderItemView(teeObject) {
        let teeColor = teeObject.color;
        let teeName = teeObject.tee;
        let rating = teeObject.rating || null;
        let slope = teeObject.slope || null;
        let length = teeObject.length || null;

        return (
            <Touchable onPress={this.onTeeSelected.bind(this, teeObject)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MyView style={[styles.view_tee_color, { backgroundColor: teeColor }]}
                            hide={!AppUtil.checkColorValid(teeColor)} />
                        <Text allowFontScaling={global.isScaleFont} style={styles.txt_tee_name}>{teeName}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                        {this.renderSlopeRatingMen(rating.men, slope.men, length.men)}
                        {this.renderSlopeRatingWomen(rating.women, slope.women, length.women)}
                    </View>

                    {/* <View style={{flexDirection : 'row',alignItems : 'center'}}>

                    </View> */}
                </View>

            </Touchable>
        )

    }

    render() {
        let { teeList } = this.props;

        return (
            <View style={styles.container}>
                <FlatList
                    data={teeList}
                    keyboardShouldPersistTaps='always'
                    ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
                    enableEmptySections={true}
                    renderItem={({ item }) =>
                        this.renderItemView(item)
                    }
                />
            </View>
        );
    }

    onTeeSelected(teeObject) {
        let { onTeeSelected } = this.props;
        if (onTeeSelected) {
            onTeeSelected(teeObject);
        }
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        borderTopLeftRadius: verticalScale(10),
        borderTopRightRadius: verticalScale(10),
        padding: verticalScale(10)
    },
    listview_separator: {
        flex: 1,
        height: 1,
        backgroundColor: '#E3E3E3',
    },
    view_tee_color: {
        width: verticalScale(20),
        height: verticalScale(20),
        borderColor: '#919191',
        borderWidth: 0.5,
        marginTop: verticalScale(10),
        marginBottom: verticalScale(10)
    },
    txt_tee_name: {
        color: '#707070',
        fontSize: fontSize(15, scale(1)),
        marginTop: verticalScale(10),
        marginBottom: verticalScale(10),
        marginLeft: scale(10)
    }
});