import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Alert,
  Linking,
  Animated,
  BackHandler
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import SelectCourseNavigator from './SelectCourseNavigator';
import HeaderSearchView from '../HeaderSearchView';
import { Constants, Location, Permissions, IntentLauncherAndroid } from '../../Core/Common/ExpoUtils';
import UserInfo from '../../Config/UserInfo';
import MyView from '../../Core/View/MyView';

var isQuestionGps = false;

export default class SelectCourseView extends BaseComponent {

  constructor(props) {
    super(props);

    this.list_callback = [];
    this.state = {
      errorMessage: null,
      searchInput: '',
      showTab: false,
    }

    this.onChangeSearch = this.onChangeSearchText.bind(this);
    this.onCancelSearchClick = this.onCancelSearchClick.bind(this);
  }

  render() {
    // let { fadeIn } = this.state;
    return (
      <View style={styles.container}>
        <HeaderSearchView
          isHideCancelBtn={true}
          onChangeSearchText={this.onChangeSearch}
          onCancelSearch={this.onCancelSearchClick}
          autoFocus={false} />
        <MyView hide={!this.state.showTab} style={{ flex: 1, paddingBottom: this.getAppUtil().isIphoneX()? 15: 0 }} >
          <SelectCourseNavigator onNavigationStateChange={this._onNavigationStateChange} screenProps={{ parentNavigator: this.props.navigation, parent: this }} />
        </MyView>
      </View>
    );
  }

  onCancelSearchClick() {
    this.onBackPress();
  }

  onBackPress() {
    if (this.props.navigation) {
      this.props.navigation.goBack();
    }
  }

  /**
   * Lưu lại callback tìm kiếm để set khi back lại state cũ
   * @param {*} key 
   * @param {*} callback 
   */
  setSearchCallback(key, callback) {
    let _callback_obj = this.list_callback.find(d => d.key === key);
    if (!_callback_obj || !Object.keys(_callback_obj).length) {
      let obj = {};
      obj.key = key;
      obj.value = callback;
      this.list_callback.push(obj);
    }
  }

  /**
   * hàm này tự động gọi khi chuyển state trong tabNavigator
   */
  _onNavigationStateChange = (prevState, newState) => {
    let obj = this.list_callback.find(d => d.key === newState.index);
    if (obj && Object.keys(obj).length) {
      this.onChangeTextSearch = obj.value;
    }
  }

  fadeIn() {
    this.state.fadeIn.setValue(0);
    Animated.timing(
      this.state.fadeIn,
      {
        toValue: 1,
        duration: this.timeAnimationFadeIn,
      }
    ).start();
  }

  componentDidMount() {
    this.handleHardwareBackPress();
    // this.fadeIn();
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        showTab: true,
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
      // this.setState({
      //   errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      // });
      console.log('errorMessage', 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!');
    } else {
      this._getLocationAsync();
    }
  }

  componentWillUnmount() {
    if (this.backHandler) {
      this.backHandler.remove();
    }
  }

  handleHardwareBackPress() {
    let self = this;
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
      self.onBackPress();
      return true;
    });
  }

  _getLocationAsync = async () => {
    try {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        this.setState({
          errorMessage: 'Permission to access location was denied',
          showTab: true
        });
      } else {
        let provider = await this.Mxpo.Location.getProviderStatusAsync();
        if (!provider.gpsAvailable && !isQuestionGps && Platform.OS === 'android') {
          isQuestionGps = true;
          Alert.alert(
            this.t('gps_off'),
            this.t('gps_for_app'),
            [
              { text: this.t('cancel'), onPress: () => this.setState({ showTab: true }), style: 'cancel' },
              {
                text: this.t('ok'), onPress: () => {
                  if (Platform.OS === 'ios') {
                    Linking.openURL('app-settings:');
                  } else {
                    IntentLauncherAndroid.startActivityAsync(IntentLauncherAndroid.ACTION_LOCATION_SOURCE_SETTINGS);
                  }
                  this.setState({
                    showTab: true
                  });
                }
              }
            ],
            {
              cancelable: false
            }
          );
        } else {
          this.setState({
            showTab: true
          });
        }

        Location.getCurrentPositionAsync({}, this.saveLocation);

      }
    } catch (error) {
      this.setState({
        showTab: true
      });
    }
  };


  saveLocation(location) {
    if (location.coords && location.coords.latitude && location.coords.longitude) {
      UserInfo.setLatitude(location.coords.latitude);
      UserInfo.setLongitude(location.coords.longitude);
      console.log('latitude', UserInfo.getLatitude(), 'longitude', UserInfo.getLongitude());
    }

  }

  onStartTutorialUpgrade() {
    if (this.props.onStartTutorialUpgrade) {
      this.props.onStartTutorialUpgrade();
    }
  }

  onChangeSearchText(input) {
    if (this.onChangeTextSearch) {
      this.onChangeTextSearch(input);
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});