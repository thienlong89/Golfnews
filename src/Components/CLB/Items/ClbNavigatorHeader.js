import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import * as Progress from 'react-native-progress';
import { createImageProgress } from 'react-native-image-progress';
import FastImage from 'react-native-fast-image';
const Images = createImageProgress(FastImage);
import LinearGradient from 'react-native-linear-gradient';
import { fontSize, scale, verticalScale } from '../../../Config/RatioScale';
import ProgressUpload from '../../Common/ProgressUpload';
import StaticProps from '../../../Constant/PropsStatic';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default class ClbNavigatorHeader extends BaseComponent {

  static defaultProps = {
    imgBackground: null,
    isAdmin: false
  }

  constructor(props) {
    super(props);
    this.state = {
      imgBackground: this.props.imgBackground,
      width: screenWidth,
      height: 2 * screenWidth / 3
    }

    this.onChangeCoverImage = this.onChangeCoverImage.bind(this);
    this.onViewCoverClubPress = this.onViewCoverClubPress.bind(this);
  }

  renderEditImage(isAdmin) {
    if (isAdmin) {
      return (
        <TouchableOpacity onPress={this.onChangeCoverImage}>
          <View style={styles.view_edit_bg}>
            <Image
              style={styles.img_camera}
              source={this.getResources().ic_camera} />
            <Text allowFontScaling={global.isScaleFont} style={styles.txt_edt}>{this.t('edit_')}</Text>
          </View>
        </TouchableOpacity>
      )
    } else {
      return null;
    }
  }

  renderCover(imgBackground, width, height) {
    console.log('imgBackground', imgBackground, width, height)
    if (imgBackground) {
      return (
        <Images
          style={{
            width: width, height: height
          }}
          source={{
            uri: imgBackground,
          }}
          resizeMode={FastImage.resizeMode.cover}
          indicator={Progress.Circle}
        // imageStyle={{ borderRadius: 8 }}
        />
      )
    } else {
      return (
        < Image
          style={styles.image_post}
          source={this.getResources().bg_home_player} />
      )
    }
  }

  render() {
    let { clubName, clubId, logoUrl, totalMember } = this.props.navigation.state.params;
    clubName = clubName || '';
    totalMember = totalMember || '1';

    let { isAdmin } = this.props;
    let { imgBackground, width, height } = this.state;
    console.log('imgBackground', imgBackground)

    return (

      // <ImageBackground style={styles.container}
      //   source={imgBackground ? imgBackground : this.getResources().bg_home_player}
      //   imageStyle={{ resizeMode: 'cover' }}
      //   resizeMethod={'resize'}>
      <Touchable onPress={this.onViewCoverClubPress}>
        <View style={styles.container}>
          {this.renderCover(imgBackground, screenWidth, verticalScale(150))}
          <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.6)']}
            style={styles.view_cover}>
            <View style={styles.view_info_club}>
              <View style={{ flex: 1 }}>
                <Text allowFontScaling={global.isScaleFont} style={styles.txt_club_name}>{clubName}</Text>
                <Text allowFontScaling={global.isScaleFont} style={styles.txt_member_number}>{`${totalMember} ${this.t('member')}`}</Text>
              </View>
              {this.renderEditImage(isAdmin)}
            </View>

          </LinearGradient>
          <ProgressUpload
            ref={(progressUpload) => { this.progressUpload = progressUpload; }}
            isModalView={false}
          />
        </View>
      </Touchable>
      // </ImageBackground>
    );
  }

  componentDidMount() {
    if (this.state.imgBackground) {
      this.setBackgroundSize(this.state.imgBackground);
    }

  }

  setImageCover(imgUri) {
    console.log('setImageCover', imgUri)
    if (imgUri) {
      this.setBackgroundSize(imgUri);
    }

  }

  setBackgroundSize(imgBackground) {
    this.setState({
      imgBackground: imgBackground
    })
    // Image.getSize(imgBackground, (width, height) => {
    //   console.log('ImageFlightItemFull', width, height)
    //   this.setState({
    //     imgBackground: imgBackground,
    //     width: screenWidth,
    //     height: screenWidth * height / width
    //   }, () => {
    //     console.log('componentDidMount', this.state.width, this.state.height)
    //   })
    // }, (err) => {
    //   console.log('setBackgroundSize.err', err)
    // });
  }

  onChangeCoverImage() {
    console.log('onChangeCoverImage')
    if (this.props.onChangeCoverImage) {
      this.props.onChangeCoverImage();
    }
  }

  onViewCoverClubPress() {
    let navigation = StaticProps.getAppSceneNavigator();
    let {
      imgBackground
    } = this.state;
    if (navigation && imgBackground) {
      navigation.navigate('show_scorecard_image', {
        'imageUri': imgBackground,
        'imgList': [imgBackground],
        'position': 0,
        'isPortrait': true
      })
    }
  }

  requestUploadImage(imagePath, clubId) {
    let self = this;
    this.progressUpload.showLoading();
    let url = this.getConfig().getBaseUrl() + ApiService.club_upload_img_background(clubId);
    console.log('url', url);
    this.getAppUtil().upload(url, imagePath,
      this.onUploadSuccess.bind(this),
      (error) => {
        self.progressUpload.hideLoading();
        // console.log('showErrorMsg2')
        // self.showErrorMsg(error);
      }, (progress) => {
        self.progressUpload.setProgress(progress);
      });
  }

  onUploadSuccess(jsonData) {
    console.log('onUploadSuccess', jsonData);
    this.progressUpload.hideLoading();
    if (jsonData != null && jsonData.hasOwnProperty('error_code')) {

      if (jsonData['error_code'] === 0) {
        try {
          // this.state.flightDetailModel.getFlight().setUrlScorecard(jsonData['data'].flight.url_scorecards);
          let imagePath = jsonData['data'].img_background;
          this.setState({
            imgBackground: imagePath
          }, () => {
            if (this.props.backgroundUpdate) {
              this.props.backgroundUpdate(imagePath);
            }
          });
        } catch (error) {
          console.log(error);
        }

      } else {
        // console.log('showErrorMsg3')
        // this.showErrorMsg(jsonData['error_msg']);
      }
    }
  }

}

const styles = StyleSheet.create({
  container: {
    width: null,
    height: verticalScale(150)
  },
  view_info_club: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingLeft: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  txt_club_name: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold'
  },
  txt_member_number: {
    color: '#FFF',
    fontSize: 14
  },
  view_cover: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  image_post: {
    flex: 1,
    width: screenWidth,
    height: 2 * screenWidth / 3,
    resizeMode: 'cover'
  },
  view_edit_bg: {
    flexDirection: 'row',
    paddingLeft: scale(8),
    paddingRight: scale(8),
    paddingTop: scale(5),
    paddingBottom: scale(5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: scale(5),
    marginRight: scale(10)
  },
  img_camera: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    tintColor: '#00ABA7'
  },
  txt_edt: {
    fontSize: fontSize(15),
    color: '#00ABA7',
    marginLeft: scale(10)
  }
});