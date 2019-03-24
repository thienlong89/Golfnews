import React from 'react';
import { Platform, Text, View, StyleSheet, Image, Dimensions } from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import { Rating, Avatar } from 'react-native-elements';
import MyView from '../../Core/View/MyView';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';

export default class FacilityCourseItem extends BaseComponent {

    constructor(props) {
        super(props);
    }

    static defaultProps = {
        facilityCourseModel: {}
    }

    render() {
        let facility = this.props.facilityCourseModel;
        return (
            <View style={styles.container}>
                <View style={styles.course_title_group}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.course_name}>{facility.getTitle()}</Text>
                    <MyView hide={facility.getDistanceKm() === 0}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.course_distance}>{this.getDistance(facility)}</Text>
                    </MyView>
                    <MyView hide={facility.getDistanceKm() !== 0}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.course_distance}>{facility.getCourse().country_name}</Text>
                    </MyView>
                </View>
                <View style={styles.course_rating_group}>
                    {/* <Rating
                        imageSize={Platform.OS === 'ios' ? verticalScale(10) : verticalScale(15)}
                        readonly
                        startingValue={facility.getRate()}
                        style={{marginLeft: scale(3), marginRight: scale(3)}}
                    /> */}

                    <Avatar
                        rounded={true}
                        width={verticalScale(30)}
                        height={verticalScale(30)}
                        containerStyle={{ marginRight: scale(5) }}
                        // avatarStyle={{ borderColor: '#fff', borderWidth: 2 }}
                        source={facility.getCourse().img_country ? { uri: facility.getCourse().img_country } : this.getResources().world}
                    />
                    <Image style={styles.arrow_right_menu}
                        source={this.getResources().ic_arrow_right} />
                </View>
            </View>
        );
    }

    getDistance(facility) {
        if (facility.getAddress() && facility.getAddress().indexOf(",") > 0) {
            let province = facility.getAddress().substring(facility.getAddress().lastIndexOf(",") + 1).trim();
            return facility.getDistanceKm() != 0 ? `${facility.getDistanceDisplay()}, ${province}` : `${province}`
        }
        return '';
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: scale(10),
        paddingTop: verticalScale(8),
        paddingBottom: verticalScale(8)
    },
    course_title_group: {
        flex: 1
    },
    course_name: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: fontSize(16, scale(2)),// 16
    },
    course_distance: {
        color: '#979797',
        fontSize: fontSize(15),// 15
    },
    course_rating_group: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    arrow_right_menu: {
        ...Platform.select({
            ios: {
                width: verticalScale(20),
                height: verticalScale(20),
            },
            android: {
                height: verticalScale(20),
                width: verticalScale(20),
            }
        }),
        resizeMode: 'contain',
    },
});