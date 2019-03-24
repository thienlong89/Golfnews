import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    Image,
    ImageBackground
} from 'react-native'
import _ from 'lodash'
import ImageLoad from './ImageLoad';
import * as Progress from 'react-native-progress';
import { createImageProgress } from 'react-native-image-progress';
import FastImage from 'react-native-fast-image';
import { fontSize, scale } from '../../Config/RatioScale';
const Images = createImageProgress(FastImage);
import CustomAvatar from '../Common/CustomAvatar';
import PhotoView from 'react-native-photo-view';

const { width, height } = Dimensions.get('window')

class FastImageGridView extends PureComponent {

    static defaultProps = {
        data: null
    }

    constructor(props) {
        super(props)

        this.state = {
            width: props.width,
            height: props.height,
        }
    }

    static defaultProps = {
        numberImagesToShow: 0,
        onPressImage: () => { },
    }

    isLastImage = (index, secondViewImages) => {
        let { data, numberImagesToShow } = this.props;
        if (numberImagesToShow <= 5) {
            numberImagesToShow = 0;
        }
        return (data.length > 5 || numberImagesToShow) && index === secondViewImages.length - 1
    }

    handlePressImage = (event, { objImage, index }, position, firstViewImages, secondViewImages) => {
        this.props.onPressImage(objImage,
            {
                isLastImage: index && this.isLastImage(index, secondViewImages),
                index: position
            })
    }

    renderImageItem(imgUri, firstImageWidth, firstImageHeight, avatar) {
        if (imgUri) {
            if (avatar) {
                return (
                    <View style={[styles.image, { width: firstImageWidth, height: firstImageHeight }]}>
                        {/* <Images
                            style={[{ width: firstImageWidth, height: firstImageHeight }, this.props.imageStyle]}
                            source={{
                                uri: imgUri //`${imgUri}&type=small`,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                            indicator={Progress.Circle}
                        /> */}
                        <Image
                            style={[styles.image, { width: firstImageWidth, height: firstImageHeight }, this.props.imageStyle]}
                            source={{
                                uri: `${imgUri}&type=normal`,
                            }}
                            resizeMethod={'resize'}
                        />
                        <View style={styles.avatar}>
                            <CustomAvatar
                                width={scale(30)}
                                height={scale(30)}
                                // containerStyle={styles.avatar}
                                uri={avatar} />
                        </View>
                    </View>
                )
            }
            return (
                // <Images
                //     style={[styles.image, { width: width, height: null, transform: [{ scale: 5 }] }, this.props.imageStyle]}
                //     source={{
                //         uri: imgUri //`${imgUri}&type=small`,
                //     }}
                //     resizeMode={FastImage.resizeMode.cover}
                //     indicator={Progress.Circle}
                // />
                <Image
                    style={[styles.image, { width: firstImageWidth, height: firstImageHeight }, this.props.imageStyle]}
                    source={{
                        uri: `${imgUri}&type=normal`,
                    }}
                    resizeMethod={'resize'}
                />
                // <PhotoView
                //     style={[styles.image, { width: firstImageWidth, height: firstImageHeight }, this.props.imageStyle]}
                //     source={{ uri: imgUri }}
                //     // scale={3.0}
                //     // maximumZoomScale={1.1}
                //     androidScaleType="centerCrop"
                //     // onLoad={() => console.log("Image loaded!")}
                // // onLoadStart={this.onLoadStart}
                // // onLoadEnd={this.onLoadEnd}
                // />
            )
        }
        return null;
    }

    renderLastItem(imgUri, secondImageWidth, secondImageHeight, avatar) {
        if (avatar) {
            return (
                <ImageBackground
                    style={[styles.image, { width: secondImageWidth, height: secondImageHeight }, this.props.imageStyle]}
                    source={{ uri: imgUri }}
                    resizeMode={'cover'}>
                    <View style={styles.avatar}>
                        <CustomAvatar
                            width={scale(30)}
                            height={scale(30)}
                            // containerStyle={styles.avatar}
                            uri={avatar} />
                    </View>
                    <View style={styles.lastWrapper}>
                        <Text allowFontScaling={global.isScaleFont} style={[styles.textCount, this.props.textStyles]}>
                            +{this.props.numberImagesToShow || this.props.data.length - 5}
                        </Text>
                    </View>
                </ImageBackground>
            )
        }
        return (
            <ImageBackground
                style={[styles.image, { width: secondImageWidth, height: secondImageHeight }, this.props.imageStyle]}
                source={{ uri: imgUri }}
                resizeMode={'cover'}>
                <View style={styles.lastWrapper}>
                    <Text allowFontScaling={global.isScaleFont} style={[styles.textCount, this.props.textStyles]}>
                        +{this.props.numberImagesToShow || this.props.data.length - 5}
                    </Text>
                </View>
            </ImageBackground>
        )
    }

    render() {
        const { imageProps } = this.props
        const data = _.take(this.props.data, 5)
        const firstViewImages = []
        const secondViewImages = []
        const firstItemCount = data.length === 5 ? 2 : 1
        let index = 0
        _.each(data, (objImage, callback) => {
            if (index === 0) {
                firstViewImages.push(objImage)
            } else if (index === 1 && firstItemCount === 2) {
                firstViewImages.push(objImage)
            } else {
                secondViewImages.push(objImage)
            }
            index++
        })

        const { width, height } = this.props
        let ratio = 0
        if (secondViewImages.length === 0) {
            ratio = 0
        } else if (secondViewImages.length === 1) {
            ratio = 1 / 2
        } else {
            ratio = this.props.ratio
        }
        const direction = data.length === 5 ? 'row' : 'column'

        const firstImageWidth = direction === 'column' ? (width / firstViewImages.length) : (width * (1 - ratio))
        const firstImageHeight = direction === 'column' ? (height * (1 - ratio)) : (height / firstViewImages.length)

        const secondImageWidth = direction === 'column' ? (width / secondViewImages.length) : (width * ratio)
        const secondImageHeight = direction === 'column' ? (height / secondViewImages.length) : (height * ratio)

        const secondViewWidth = direction === 'column' ? width : (width * ratio)
        const secondViewHeight = direction === 'column' ? (height * ratio) : height

        return data.length ? (
            <View style={[{ flexDirection: direction, width, height }, this.props.styles]}>
                <View style={{ flex: 1, flexDirection: direction === 'row' ? 'column' : 'row' }}>
                    {firstViewImages.map((objImage, index) => (
                        <TouchableOpacity activeOpacity={0.7} key={index} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                            onPress={event => this.handlePressImage(event, { objImage, index }, index, firstViewImages, secondViewImages)}>
                            {/* <ImageLoad
                                style={[styles.image, { width: firstImageWidth, height: firstImageHeight }, this.props.imageStyle]}
                                source={typeof image === 'string' ? { uri: image } : image}
                                resizeMode={'contain'}
                                {...imageProps}
                            /> */}
                            {this.renderImageItem(objImage.img_path, firstImageWidth, firstImageHeight, objImage.avatar)}
                        </TouchableOpacity>
                    ))}
                </View>
                {
                    secondViewImages.length ? (
                        <View style={{ width: secondViewWidth, height: secondViewHeight, flexDirection: direction === 'row' ? 'column' : 'row' }}>
                            {secondViewImages.map((objImage, index) => (
                                <TouchableOpacity activeOpacity={0.7} key={index} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                                    onPress={event => this.handlePressImage(event, { objImage, index }, index + firstViewImages.length, firstViewImages, secondViewImages)}>
                                    {this.isLastImage(index, secondViewImages) ? (
                                        this.renderLastItem(objImage.img_path, secondViewWidth, secondViewHeight, objImage.avatar, index)
                                    )
                                        : this.renderImageItem(objImage.img_path, secondViewWidth, secondViewHeight, objImage.avatar, index)
                                    }
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : null
                }
            </View >
        ) : null
    }
}

FastImageGridView.prototypes = {
    data: PropTypes.array.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    style: PropTypes.object,
    imageStyle: PropTypes.object,
    onPressImage: PropTypes.func,
    ratio: PropTypes.float,
    imageProps: PropTypes.object
}

FastImageGridView.defaultProps = {
    style: {},
    imageStyle: {},
    imageProps: {},
    width: width,
    height: 300,
    ratio: 1 / 3
}

const styles = {
    image: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#fff'
    },
    lastWrapper: {
        flex: 1,
        backgroundColor: 'rgba(200, 200, 200, .5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textCount: {
        color: '#fff',
        fontSize: fontSize(25)
    },
    avatar: {
        position: 'absolute',
        left: 5,
        top: 5
    }
}

export default FastImageGridView