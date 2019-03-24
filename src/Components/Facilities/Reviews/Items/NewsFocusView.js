import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../../Core/View/BaseComponent';
import { scale, verticalScale, moderateScale, fontSize } from '../../../../Config/RatioScale';
import Swiper from 'react-native-swiper';
import * as Progress from 'react-native-progress';
import { createImageProgress } from 'react-native-image-progress';
import FastImage from 'react-native-fast-image';
const Images = createImageProgress(FastImage);
import { Avatar } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

export default class NewsFocusView extends BaseComponent {

    static defaultProps = {
        title: null,
        isShowInfo: false
    }

    constructor(props) {
        super(props);

        this.state = {
            urlReviewList: [],
            facilityList: [],
            isShow: true
        }
        // this.onFacilityPress = this.onFacilityPress.bind(this);
    }

    render() {
        let {
            title,
            isShowInfo
        } = this.props;
        let {
            urlReviewList,
            facilityList,
            isShow
        } = this.state;
        if (urlReviewList.length === 0 || !isShow) {
            return null;
        }
        let imgList = null;
        if (isShowInfo && facilityList.length > 0) {
            imgList = facilityList.map((facilityObj, index) => {
                let img_review = facilityObj.img_review;
                if(!img_review) return null;
                return (
                    <TouchableOpacity
                        onPress={this.onFacilityPress.bind(this, facilityObj)} >
                        <Images
                            style={styles.img_course}
                            source={{
                                uri: img_review,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                            indicator={Progress.Circle}
                        />
                        <LinearGradient colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0)']}
                            style={styles.view_header}>
                            {/* <View style={styles.view_header}> */}
                            <Avatar rounded
                                // containerStyle={[{ backgroundColor: '#CCCCCC' }]}
                                avatarStyle={styles.avatar_style}
                                source={facilityObj.Facility ? { uri: facilityObj.Facility.img_country } : this.getResources().world}
                                height={scale(40)}
                                width={scale(40)}
                            />
                            <View style={styles.view_right}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_course_name}>{facilityObj.Facility.sub_title}</Text>
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_country}>{facilityObj.Facility.country_name}</Text>
                            </View>
                            {/* </View> */}
                        </LinearGradient>

                    </TouchableOpacity>
                )
            })
        } else {
            imgList = urlReviewList.map((imgUrl, index) => {
                return (
                    <Images
                        style={styles.img_course}
                        source={{
                            uri: imgUrl,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                        indicator={Progress.Circle}
                    />
                )
            })
        }

        return (
            <View style={styles.view_new_focus}>
                <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{title ? title : this.t('focus')}</Text>
                <Swiper
                    ref={(swiper) => { this.swiper = swiper; }}
                    showsButtons={false}
                    loop={true}
                    showsPagination={true}
                    autoplay={true}
                    autoplayTimeout={5}
                    autoplayDirection={true}
                    style={styles.swiper}
                    paginationStyle={{ position: 'absolute', bottom: scale(10) }}
                >
                    {imgList}
                </Swiper>
                <View style={styles.big_line} />
            </View>
        );
    }

    setUrlReviewImages(imgList = []) {
        console.log('setUrlReviewImages', imgList)
        this.setState({
            urlReviewList: imgList
        })
    }

    setFacilityList(facilityList = []) {
        let urlImage = facilityList.map((facilityReview) => {
            return facilityReview.img_review;
        })
        this.setState({
            facilityList: facilityList,
            urlReviewList: urlImage
        })
    }

    onFacilityPress(facilityObj) {
        if (this.props.onFacilityPress) {
            this.props.onFacilityPress(facilityObj);
        }
    }

    setVisible(visible = true) {
        this.setState({
            isShow: visible
        })
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    txt_title: {
        fontSize: fontSize(17, scale(6)),
        color: '#424242',
        fontWeight: 'bold',
        marginLeft: scale(10),
        marginTop: scale(20),
        marginBottom: scale(10)
    },
    img_course: {
        width: width - scale(20),
        height: width / 2,
        resizeMode: 'contain',
        marginLeft: scale(10)
    },
    view_new_focus: {
        width: width,
        height: width / 2 + scale(40),

    },
    swiper: {
        width: width,
        height: width / 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    big_line: {
        color: '#DADADA',
        height: scale(5)
    },
    view_header: {
        position: 'absolute',
        left: scale(10),
        right: scale(10),
        top: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: scale(5),
        paddingBottom: scale(5),
        paddingLeft: scale(5),
        paddingRight: scale(5)
    },
    avatar_style: {
        borderColor: '#CCCCCC',
        borderWidth: 2,
    },
    txt_course_name: {
        color: '#fff',
        fontSize: fontSize(15),
        fontWeight: 'bold'
    },
    view_right: {
        marginLeft: scale(10),
        justifyContent: 'center'
    },
    txt_country: {
        color: '#BDBDBD',
        fontSize: fontSize(13)
    }
});