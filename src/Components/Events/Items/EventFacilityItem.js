import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import { Avatar } from 'react-native-elements';

import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';

export default class CheckHandicapItem extends BaseComponent {

    constructor(props) {
        super(props);
    }

    static defaultProps = {
        facilityCourseModel: {}
    }

    render() {
        let facility = this.props.facilityCourseModel;
        // this.Logger().log('............................ facility : ',facility);
        return (
            <View style={styles.container}>
                <View style={styles.course_title_group}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.course_name}>{facility.getSubTitle()}</Text>
                </View>
                {/* <View style={{ marginRight: scale(10) }}>
                    <Rating
                        imageSize={verticalScale(15)}
                        readonly
                        startingValue={facility.getRate()}
                    />
                </View> */}
                <Avatar
                    rounded={true}
                    width={verticalScale(30)}
                    height={verticalScale(30)}
                    containerStyle={{ marginRight: scale(3) }}
                    source={{ uri: facility.img_country }}
                />
                <Image style={styles.arrow_right_menu}
                    source={this.getResources().ic_arrow_right} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: verticalScale(40),
    },
    course_title_group: {
        flex: 1
    },
    course_name: {
        color: '#000',
        //fontWeight: 'bold',
        marginLeft: scale(10),
        fontSize: fontSize(16, scale(1)),// 16
    },

    arrow_right_menu: {
        width: verticalScale(20),
        height: verticalScale(20),
        resizeMode: 'contain',
    },
});