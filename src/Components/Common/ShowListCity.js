import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler,
    ListView,
    Keyboard,
    Image
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import { scale, verticalScale, moderateScale, fontSize } from '../../Config/RatioScale';
import SearchInputText from './SearchInputText';
import ListCityModel from '../../Model/CreateFlight/ListCityModel';
import { remove } from 'diacritics';

const ITEM_HEIGHT = verticalScale(50);

export default class ShowListCity extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);

        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.cityList = [];
        this.country = this.props.navigation.state.params.country;
        this.state_id = this.props.navigation.state.params.state_id;
        this.state = {
            cityListState: this.ds.cloneWithRows(this.cityList),
        }

        this.onBackPress = this.onBackPress.bind(this);
        this.onChangeSearchText = this.onChangeSearchText.bind(this);
        // this.onItemCountryCodePress = this.onItemCountryCodePress.bind(this);
    }

    render() {
        let {
            cityListState
        } = this.state;

        return (
            <View style={styles.container}>
                <HeaderView
                    title={this.t('city_list')}
                    handleBackPress={this.onBackPress} />
                <SearchInputText
                    onChangeSearchText={this.onChangeSearchText}
                    wait_interval={0}
                    autoFocus={true} />

                <View style={{ backgroundColor: '#DFDFDF', height: 1 }} />

                <View style={{ flex: 1 }}>
                    <ListView
                        renderSeparator={(sectionId, rowId) => <View style={{ backgroundColor: '#DFDFDF', height: 1 }} />}
                        dataSource={cityListState}
                        enableEmptySections={true}
                        keyboardShouldPersistTaps='always'
                        renderRow={(rowData) =>
                            <CountryCodeItem
                                item={rowData}
                                onItemPress={this.onItemCityPress.bind(this)} />
                        }
                    />
                    {this.renderInternalLoading()}
                </View>
                {this.renderMessageBar()}
            </View>
        );
    }

    onBackPress() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();

        this.requestListCountry();
    }

    componentWillUnmount() {
        this.unregisterMessageBar();
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

    /**
     * Lấy danh sách quốc gia
     */
    requestListCountry() {
        
        if (this.cityList.length) {
            this.setState({
                cityListState: this.state.cityListState.cloneWithRows(this.cityList)
            });
            return;
        }

        let url = this.getConfig().getBaseUrl() + ApiService.list_cities(this.country, this.state_id);
        console.log("list city url : ", url);
        this.internalLoading.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.model = new ListCityModel(self);
            self.model.parseData(jsonData);
            console.log("city data ",jsonData);
            if (self.model.getErrorCode() === 0) {
                self.cityList = self.model.getCityList();
                self.setState({
                    cityListState: this.state.cityListState.cloneWithRows(self.cityList)
                })
            }
            self.internalLoading.hideLoading();
        }, () => {
            //time out
            self.internalLoading.hideLoading();
            self.showErrorMsg(this.t('time_out'))
        });
    }

    onItemCityPress(city) {
        console.log('onItemCountryCodePress', city)
        let { params } = this.props.navigation.state;
        if (params.cityCallback) {
            params.cityCallback(city);
        }
        Keyboard.dismiss();
        this.onBackPress();
    }

    onChangeSearchText(input) {

        let filterData = this.cityList.filter((country) =>
            remove(`${country.name}`.toLowerCase()).indexOf(remove(input.toLowerCase().trim())) >= 0
            || `${country.phone_code}`.toLowerCase().indexOf(input.toLowerCase().trim()) >= 0
            || `${country.sortname}`.toLowerCase().indexOf(input.toLowerCase().trim()) >= 0
        );
        this.setState({
            // countryCodes: filterData
            cityListState: this.state.cityListState.cloneWithRows(filterData)
        })
    }

}

class CountryCodeItem extends Component {


    render() {
        let { item, onItemPress } = this.props;

        return (
            <Touchable onPress={this.onCountryCodePress.bind(this, item, onItemPress)}>
                <View style={styles.view_item}>
                    {/* <Image
                        style={styles.img_flag}
                        source={{ uri: item.image }} /> */}
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_language}>
                        {item.name}
                    </Text>
                    {/* <Text allowFontScaling={global.isScaleFont} style={styles.txt_code}>
                        {`+${item.phone_code}`}
                    </Text> */}
                </View>
            </Touchable>
        )
    }

    onCountryCodePress(item, onItemPress) {
        if (onItemPress) {
            onItemPress(item);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    view_item: {
        height: ITEM_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: scale(10),
        marginLeft: scale(10)
    },
    img_flag: {
        width: verticalScale(30),
        height: verticalScale(30),
        resizeMode: 'contain',
        marginLeft: scale(10),
        marginRight: scale(10)
    },
    txt_language: {
        flex: 1,
        fontSize: fontSize(15, scale(1)),
        color: '#000'
    },
    txt_code: {
        fontSize: fontSize(15, scale(1)),
        color: '#000'
    }
});