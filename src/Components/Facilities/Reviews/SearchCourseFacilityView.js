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
// import BaseComponent from '../../Core/View/BaseComponent';
// import SelectCourseNavigator from './SelectCourseNavigator';
import HeaderSearchView from '../../HeaderSearchView';
import { Constants, Location, Permissions, IntentLauncherAndroid } from '../../../Core/Common/ExpoUtils';
import UserInfo from '../../../Config/UserInfo';
import MyView from '../../../Core/View/MyView';
import BaseComponent from '../../../Core/View/BaseComponent';
import FacilityListModel from '../../../Model/Facility/FacilityListModel';
import ListFacilityView from './ListFacilityView';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';

var isQuestionGps = false;

export default class SearchCourseFacilityView extends BaseComponent {

  constructor(props) {
    super(props);

    this.list_callback = [];

    this.onChangeSearch = this.requestSearchFacility.bind(this);
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
        <View style={{ flex: 1, paddingBottom: this.getAppUtil().isIphoneX() ? 15 : 0 }} >
          <ListFacilityView ref={(listView)=>{this.refListView = listView;}}/>
        </View>
      </View>
    );
  }

  onCancelSearchClick() {
    this.onBackPress();
  }

  onBackPress() {
    if (this.props.navigation) {
      let{params} = this.props.navigation.state;
      if(params && params.refresh){
        params.refresh();
      }
      this.props.navigation.goBack();
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

  onStartTutorialUpgrade() {
    if (this.props.onStartTutorialUpgrade) {
      this.props.onStartTutorialUpgrade();
    }
  }

  requestSearchFacility(input) {
    let self = this;
    let url = this.getConfig().getBaseUrl() + ApiService.search_facility_review(input);
    console.log('url', url);
    Networking.httpRequestGet(url, (jsonData) => {
      self.model = new FacilityListModel();
      self.model.parseData(jsonData);
      if (self.model.getErrorCode() === 0) {
        self.courseList = self.model.getFacilityList();
        console.log('self.courseList.length', self.courseList.length)
        if (self.courseList.length > 0) {
          self.refListView.setFillData(self.courseList)
          // self.emptyDataView.hideEmptyView();
        } else if (input) {
          self.refListView.setFillData([]);
          // self.emptyDataView.showEmptyView();
        }

      } else {
        // self.showErrorMsg(self.model.getErrorMsg());
      }
    }, (error) => {
      // self.showErrorMsg(self.t('time_out'));
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});