import React from 'react';
import { View} from 'react-native';
// import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
// import ModalDropdown from 'react-native-modal-dropdown';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import ListCountryModel from '../../../Model/CreateFlight/ListCountryModel';
import ListStateModel from '../../../Model/CreateFlight/ListStateModel';
import ListCityModel from '../../../Model/CreateFlight/ListCityModel';
import FacilityListModel from '../../../Model/Facility/FacilityListModel';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from '../../../Styles/CreateFlight/StyleAllCourseTab';
// import FacilityCourseItem from '../../Facilities/FacilityCourseItem';
// import MyView from '../../../Core/View/MyView';
import CountryDropdown from './Items/CountryDropdow';
import SearchFacilityView from './Items/SearchFacilityView';

import {scale, verticalScale, moderateScale} from '../../../Config/RatioScale';
import ListCourseView from './Items/ListCourseView';
// let{width,height} = Dimensions.get('window');

// import MyTextInput from '../../Common/MyTextInput';
import MyListView from '../../Common/MyListView';

import I18n from 'react-native-i18n';
import EmptyDataView from '../../../Core/Common/EmptyDataView';
import NoDataView from './Items/NoDataView';
require('../../../../I18n/I18n');

export default class AllCourseTab extends BaseComponent {
  constructor(props) {
    super(props);
    this.searchList = [];
    // const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.country_id = '';
    this.country_sortname = '';
    this.list_cities = [];
    this.state_id = null;
    this.list_states = [];
    this.city_id = '';
    this.listFacility = [];
    this.inputSearchFacility = '';
    this.state = {
      // dataSource: ds.cloneWithRows([]),
      isState: false
    }

    this.onCourseItemClick = this.onCourseItemClick.bind(this);
    this.onCountryFocus = this.onCountryFocus.bind(this);
    this.onCountrySubmit = this.onCountrySubmit.bind(this);

    this.onStateFocus = this.onStateFocus.bind(this);
    this.onStateSubmit = this.onStateSubmit.bind(this);

    this.onCityFocus = this.onCityFocus.bind(this);
    this.onCitySubmit = this.onCitySubmit.bind(this);

    this.onChangeInputSearchFacility = this.onChangeInputSearchFacility.bind(this);
    this.onCourseDropDownClick = this.onCourseDropDownClick.bind(this);
  }

  static navigationOptions = () => ({
    title: I18n.t("all"),               // it stay in french whatever choosen langage
    tabBarLabel: I18n.t("all"),
  });

  render() {
    let { isState } = this.state;
    return (
      <View style={styles.container}>
        {/* {this.renderLoading()} */}
        {this.renderMessageBar()}
        <CountryDropdown ref={(refCountry)=>{this.refCountry = refCountry;}}
                          focus={this.onCountryFocus}
                          submit={this.onCountrySubmit}
                          placeholder={this.t('country')}
                          style={styles.country}/>
        <CountryDropdown ref={(refState)=>{this.refState = refState;}}
                        focus={this.onStateFocus}
                        placeholder={this.t('state_city')}
                        submit={this.onStateSubmit}
                        style={styles.country}/>

        <CountryDropdown ref={(refCity)=>{this.refCity = refCity;}}
                        focus={this.onCityFocus}
                        placeholder={this.t('city')}
                        submit={this.onCitySubmit}
                        style={styles.country}/>
        <NoDataView ref={(noDataView)=>{this.noDataView = noDataView;}}/>

        <KeyboardAwareScrollView
          enableOnAndroid={true}
          extraScrollHeight={verticalScale(50)}>
          <View style={styles.search_group}>
            {/* <View style={{ flexDirection: 'row', padding: 0.5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5', borderColor: '#DBDBDB', borderWidth: 0.5, borderRadius: 5 }}>
              <Image

                style={styles.icon_search}
                source={this.getResources().ic_Search} />
              <View style={styles.input_search}>
                <TextInput allowFontScaling={global.isScaleFont} style={styles.text_input_facility}
                  ref={(textInputFacility) => { this.textInputFacility = textInputFacility }}
                  placeholderTextColor='#A1A1A1'
                  placeholder={this.t('golf_course')}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  // value={this.state.inputSearchFacility}
                  //onFocus={this.onSearchFacilityFocus.bind(this)}
                  onChangeText={this.onChangeInputSearchFacility.bind(this)}>
                </TextInput>
              </View>

              <Touchable onPress={this.onCourseDropDownClick.bind(this)}>
                <Image
                  style={styles.arrow_down_search}
                  source={this.getResources().ic_arrow_down}
                />
              </Touchable> */}
            {/* </View> */}
            
            <SearchFacilityView ref={(refSearchFacilityView)=>{this.refSearchFacilityView = refSearchFacilityView;}}
                                onChangeInputSearchFacility={this.onChangeInputSearchFacility}
                                onCourseDropDownClick={this.onCourseDropDownClick}
            />

            {/* <ListView
              style={[styles.list_course,
              this.state.dataSource.getRowCount() === 0 ? { borderColor: '#FFFFFF', borderWidth: 0 } : { borderColor: '#DBDBDB', borderWidth: (Platform.OS === 'ios') ? 1 : 0.5 }]}
              renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
              dataSource={this.state.dataSource}
              enableEmptySections={true}
              keyboardShouldPersistTaps='always'
              renderRow={(rowData, sectionID, itemId) =>
                <View >
                  <Touchable onPress={this.onCourseItemClick.bind(this, rowData, itemId)}>
                    <FacilityCourseItem facilityCourseModel={rowData} />
                  </Touchable>
                </View>
              }
            /> */}
            <ListCourseView ref={(refListCourseView)=>{this.refListCourseView = refListCourseView;}}
                            style={styles.list_course}
                            onCourseItemClick={this.onCourseItemClick}/>
          </View>
        </KeyboardAwareScrollView>

        <MyListView ref={(listViewCountry) => { this.listViewCountry = listViewCountry; }}
          left={scale(15)}
          right={scale(15)}
          top={verticalScale(60)} />
        <MyListView ref={(listViewState) => { this.listViewState = listViewState; }}
          left={scale(15)}
          right={scale(15)}
          top={verticalScale(115)} />
        <MyListView ref={(listViewCity) => { this.listViewCity = listViewCity; }}
          left={scale(15)}
          right={scale(15)}
          top={isState ? verticalScale(170) : verticalScale(115)} />
        {this.renderInternalLoading()}
      </View>
    );
  }

  /**
   * focus o tim kiem
   */
  onCountryFocus() {
    this.listViewCountry.setFillData(global.list_countries);
    this.listViewCity.hide();
    this.refSearchFacilityView.clear();
    this.refSearchFacilityView.hide();
    if (this.listViewState) {
      this.listViewState.hide();
    }
  }

  /**
   * tim kiem quoc gia trong danh sach
   * @param {*} text 
   */
  onCountrySubmit(text) {
    let array_country = global.list_countries.filter(d => d.getName().toLowerCase().indexOf(text.toLowerCase().trim()) >= 0);
    console.log("country search : ", array_country, text)
    if (array_country.length) {
      this.listViewCountry.setFillData(array_country);
    }
  }

  onCityFocus() {
    //this.listViewCity.setFillData(this.list_cities);
    this.refSearchFacilityView.clear();
    this.refSearchFacilityView.hide();
    this.requestGetCityList();
  }

  onCitySubmit(text) {
    let array_cities = this.list_cities.filter(d => d.getName().toLowerCase().indexOf(text.toLowerCase().trim()) >= 0);
    if (array_cities.length) {
      this.listViewCity.setFillData(array_cities);
      this.refCity.textInputFocus();
    }
    this.searchFacility('');
  }

  onCityItemClick(data) {
    this.refCity.setValue(data.getName());
    this.city_id = data.getId();
    // if (this.listFacility.length) {
      this.listFacility = [];
      // this.setState({
      //   dataSource: this.state.dataSource.cloneWithRows(this.listFacility)
      // });
      this.refListCourseView.setFillData(this.listFacility);
      this.refSearchFacilityView.hide();
      this.noDataView.show();
    // }
    this.requestSearchFacility();
  }

  componentDidMount() {
    this.registerMessageBar();
    let { parent } = this.props.screenProps;
    parent.onChangeTextSearch = this.searchFacility.bind(this);
    parent.setSearchCallback(2, this.searchFacility.bind(this));

    this.listViewCountry.itemClickCallback = this.onCountryItemClick.bind(this);

    this.listViewCity.itemClickCallback = this.onCityItemClick.bind(this);
    this.requestGetCountryList();
  }

  setStateCallback() {
      this.listViewState.itemClickCallback = this.onStateItemClick.bind(this);
  }

  /**
 * list state
 */
  sendRequestState() {
    if (this.country_id) {
      let arr_state = global.list_states.hasOwnProperty(this.country_sortname) ? global.list_states[this.country_sortname] : [];
      if (arr_state.length) {
        this.list_states = arr_state;
        this.listViewState.setFillData(this.list_states);
        return;
      }
    }
    let url = this.getConfig().getBaseUrl() + ApiService.list_states(this.country_id);
    this.Logger().log("list state : ", url);
    this.internalLoading.showLoading();
    let self = this;
    Networking.httpRequestGet(url, (jsonData) => {
      self.internalLoading.hideLoading();
      let model = new ListStateModel(self);
      model.parseData(jsonData);
      if (model.getErrorCode() === 0) {
        self.list_states = model.getStateList();
        global.list_states[this.country_sortname] = model.getStateList();
        self.listViewState.setFillData(self.list_states);
        self.refState.show();
      }
    }, () => {
      self.internalLoading.hideLoading();
    });
  }

  onStateFocus() {
    this.refSearchFacilityView.clear();
    this.refSearchFacilityView.hide();
    this.listViewState.hide();
    if (!this.list_states || !this.list_states.length) {
      this.sendRequestState();
      return;
    }
    this.listViewState.setFillData(this.list_states);
  }

  onStateSubmit(txtSearch) {
    if (txtSearch.trim().length) {
      let arr_states = this.list_states.filter(d => d.getName().toLowerCase().indexOf(txtSearch.toLowerCase()) >= 0);
      this.listViewState.setFillData(arr_states);
    } else {
      this.listViewState.setFillData(this.list_states);
    }
  }

  onStateItemClick(data) {
    this.state_id = data.getId();
    this.refState.setValue(data.getName());
    this.refCity.hide();
    this.listViewCity.hide();
    this.city_id = null;
    // if (this.listFacility.length) {
      this.listFacility = [];
      // this.setState({
      //   dataSource: this.state.dataSource.cloneWithRows(this.listFacility)
      // });
      this.refListCourseView.setFillData(this.listFacility);
      this.refSearchFacilityView.hide();
      this.noDataView.hide();
    // }
    this.requestGetCityList();
  }

  componentWillUnmount() {
    this.unregisterMessageBar();
  }

  searchFacility(input) {
    if (input.length > 0) {
      let url = this.getConfig().getBaseUrl() + ApiService.search_facility(this.country_id, this.state_id, this.city_id, input);
      this.Logger().log('url', url);
      Networking.httpRequestGet(url, this.onListFacilitySearchResponse.bind(this));
    } else {
      this.courseList = this.courseList ? this.courseList : [];
      this.refListCourseView.setFillData(this.courseList);
      // this.refSearchFacilityView.show();
      this.courseList.length ? this.refSearchFacilityView.show() : this.refSearchFacilityView.hide();
      this.courseList.length ? this.noDataView.hide() : this.noDataView.show();
      // this.setState({
      //   dataSource: this.state.dataSource.cloneWithRows(this.courseList ? this.courseList : [])
      // });
    }
  }

  onListFacilitySearchResponse(jsonData) {
    this.model = new FacilityListModel();
    this.model.parseData(jsonData);
    if (this.model.getErrorCode() === 0) {
      this.searchList = this.model.getFacilityList();
      // this.setState({
      //   dataSource: this.state.dataSource.cloneWithRows(this.searchList)
      // });
      this.refListCourseView.setFillData(this.searchList);
      // this.refSearchFacilityView.show();
      this.searchList.length ? this.refSearchFacilityView.show() : this.refSearchFacilityView.hide();
      this.searchList.length ? this.noDataView.hide() : this.noDataView.show();
    } else {
      this.showErrorMsg(this.model.getErrorMsg());
    }
  }

  /** Get country */
  requestGetCountryList() {
    if (global.list_countries.length) {
      //danh sach quoc gia chi load 1 lan
      this.refCountry.show();
      return;
    }
    let url = this.getConfig().getBaseUrl() + ApiService.list_countries();
    this.Logger().log('url', url);
    this.internalLoading.showLoading();
    let self = this;
    Networking.httpRequestGet(url, this.onListCountryResponse.bind(this), () => {
      self.internalLoading.hideLoading();
      //self.popupTimeOut.showPopup();
    });
  }

  onListCountryResponse(jsonData) {
    this.internalLoading.hideLoading();
    this.model = new ListCountryModel(this);
    this.model.parseData(jsonData);
    if (this.model.getErrorCode() === 0) {
      this.Logger().log('onListCountryResponse', this.model.getCountryList());
      global.list_countries = this.model.getCountryList();
      this.refCountry.show();
    }
  }

  onCountryItemClick(country) {
    this.Logger().log('country: ', country, ' country.getId(): ', country.getId());
    //this.refs.country_dropdown.hide();
    this.country_id = country.getId();
    this.country_sortname = country.getSortName();
    this.refCountry.setValue(country.getName());

    this.refCity.hide();
    this.state_id = null;
    this.city_id = null;
    // if (this.listFacility.length) {
      this.listFacility = [];
      // this.setState({
      //   dataSource: this.state.dataSource.cloneWithRows(this.listFacility)
      // });
      this.refListCourseView.setFillData(this.listFacility);
      this.refSearchFacilityView.hide();
      this.noDataView.show();
    // }
    this.refState.hide();
    if (country.getNumberState() > 0) {
      // let self = this;
      this.refState.show(this.setStateCallback());
      this.state.isState = true;
      // this.setState({
      //   isState: true
      // }, () => {
      //   self.setStateCallback();
      // });
      this.sendRequestState();
    } else {
      // this.setState({
      //   isState: false
      // });
      this.state.isState = false;
      this.refState.hide();
      this.requestGetCityList();
    }
  }
  /** Finish get country */

  /** Get State */
  requestGetCityList() {
    this.list_cities = global.list_countries[this.country_sortname];
    if (this.list_cities && this.list_cities.length) {
      this.listViewCity.setFillData(this.list_cities);
      this.refCity.textInputFocus();
      return;
    }
    //let country_id_selected = this.state_id ? this.state_id : this.country_id;
    let url = this.getConfig().getBaseUrl() + ApiService.list_cities(this.country_id, this.state_id);
    console.log('url', url);
    let self = this;
    this.internalLoading.showLoading();
    Networking.httpRequestGet(url, this.onListCityResponse.bind(this), () => {
      self.internalLoading.hideLoading();
      self.popupTimeOut.showPopup();
    });
  }

  onListCityResponse(jsonData) {
    this.internalLoading.hideLoading();
    this.model = new ListCityModel(this);
    this.model.parseData(jsonData);
    if (this.model.getErrorCode() === 0) {
      this.list_cities = this.model.getCityList();
      global.list_cities[this.country_sortname] = this.model.getCityList();
      if (this.list_cities.length) {
        this.refCity.show();
        this.refCity.textInputFocus();
        this.listViewCity.setFillData(this.list_cities);
      }else{
        this.refCity.hide();
      }
    }
  }

  /** Search course */
  onCourseDropDownClick() {
    // this.refs.course_dropdown.show();
  }

  onChangeInputSearchFacility(input) {
    this.inputSearchFacility = input;
    this.requestSearchFacility();
  }

  requestSearchFacility() {
    let url = this.getConfig().getBaseUrl() + ApiService.search_facility(this.country_id, this.state_id, this.city_id, this.inputSearchFacility);
    console.log('url', url);
    Networking.httpRequestGet(url, this.onListFacilityResponse.bind(this));
  }

  onListFacilityResponse(jsonData) {
    this.model = new FacilityListModel();
    this.model.parseData(jsonData);
    if (this.model.getErrorCode() === 0) {

      this.inputSearchFacility = '';

      this.courseList = this.model.getFacilityList();
      if (this.courseList) {
        // this.setState({
        //   dataSource: this.state.dataSource.cloneWithRows(this.courseList)
        // });
        this.refListCourseView.setFillData(this.courseList);
        // this.refSearchFacilityView.show();
        this.courseList.length ? this.refSearchFacilityView.show() : this.refSearchFacilityView.hide();
        this.courseList.length ? this.noDataView.hide() : this.noDataView.show();
      }

    } else {
      this.showErrorMsg(this.model.getErrorMsg());
    }
  }

  onCourseItemClick(facilityCourseModel, itemId) {
    if (this.props.screenProps) {
      this.props.screenProps.parentNavigator.navigate('enter_flight_info_view',
        {
          'Facility': facilityCourseModel,
          onStartTutorialUpgrade: this.onStartTutorialUpgrade.bind(this)
        });
    }
  }

  onStartTutorialUpgrade() {
    if (this.props.screenProps.parent.onStartTutorialUpgrade) {
      this.props.screenProps.parent.onStartTutorialUpgrade();
    }
  }
}

