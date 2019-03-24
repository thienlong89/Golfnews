import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, Image, Dimensions } from 'react-native';
import { Rating } from 'react-native-elements';
import MyView from '../../Core/View/MyView';
var screenWidth = Dimensions.get('window').width - 20;
import Touchable from 'react-native-platform-touchable';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
import Files from '../Common/Files';
import CustomAvatar from '../Common/CustomAvatar';
import { Avatar } from 'react-native-elements';

export default class CheckHandicapItem extends PureComponent {

    constructor(props) {
        super(props);
        this.onItemClick = this.onItemClick.bind(this);
    }

    static defaultProps = {
        facilityCourseModel: {}
    }

    // shouldComponentUpdate() {
    //     return false;
    // }

    onItemClick() {
        let { onItemClickCallback, facilityCourseModel } = this.props;
        if (onItemClickCallback && facilityCourseModel) {
            onItemClickCallback(facilityCourseModel);
        }
    }

    render() {
        let facility = this.props.facilityCourseModel;
        return (
            <Touchable onPress={this.onItemClick}>
                <View style={styles.container}>
                    <View style={styles.course_title_group}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.course_name}>{facility.getTitle()}</Text>
                        <Text allowFontScaling={global.isScaleFont} style={styles.country_name}>{facility.getCountryName()}</Text>
                    </View>

                    <View style={styles.view_country}>
                        {/* <CustomAvatar
                            width={35}
                            height={35}
                            uri={facility.getCountryFlag()}
                            defaultSource = {require('../../Images/World.png')}
                            resizeMode={'center'}
                        /> */}
                        <Avatar rounded
                            containerStyle={[{ backgroundColor: '#CCCCCC' }]}
                            avatarStyle={styles.avatar_style}
                            source={facility.getCountryFlag() ? { uri: facility.getCountryFlag() } : require('../../Images/World.png')}
                            height={35}
                            width={35}
                        />
                        <Image
                            style={styles.img_arrow_right}
                            source={Files.sprites.ic_arrow_right}
                        />
                    </View>
                </View>
            </Touchable>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: 'green',
        alignItems: 'center',
        minHeight: verticalScale(40),
        width: screenWidth,
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10)
    },
    course_title_group: {
        flex: 1,
        paddingLeft: 10,
    },
    course_name: {
        color: '#1A1A1A',
        //fontWeight: 'bold',
        // marginLeft: scale(10),
        //backgroundColor: 'red',
        fontSize: fontSize(16, scale(2)),// 16
    },
    country_name: {
        color: '#BDBDBD',
        fontSize: fontSize(14),
        marginTop: verticalScale(3)
    },
    course_distance: {
        color: '#979797',
        fontSize: fontSize(15, scale(1)),// 15
    },
    course_rating_group: {
        width: scale(80),
        flexDirection: 'row',
        alignItems: 'center'
    },
    view_country: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    img_arrow_right: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        tintColor: '#B0B0B0',
        marginLeft: 8,
        marginRight: 10
    },
    avatar_style: {
        borderColor: '#CCCCCC',
        borderWidth: 2,
    },
});