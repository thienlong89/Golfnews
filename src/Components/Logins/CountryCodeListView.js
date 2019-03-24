import React, { PureComponent } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler,
    FlatList,
    Image,
    ActivityIndicator,
    KeyboardAvoidingView,
    ListView,
    Keyboard
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import CountryModel from '../../Model/Login/CountryModel';
import EmptyDataView from '../../Core/Common/EmptyDataView';
import SearchInputText from '../Common/SearchInputText';
import { insertCountryPhoneCode, queryCountryPhoneCode } from '../../DbLocal/CountryPhoneCodeRealm';
import { remove } from 'diacritics';
import { verticalScale, scale, fontSize } from '../../Config/RatioScale';
// var countryCodeList = require('../../../CountryCode.json');
import { CountryCodes } from '../../../CountryCode';

const ITEM_HEIGHT = verticalScale(50);

export default class CountryCodeListView extends BaseComponent {


    constructor(props) {
        super(props);
        this.loadMoreData = this.loadMoreData.bind(this);
        this.onChangeSearchText = this.onChangeSearchText.bind(this);
        this.renderItem = this.renderItem.bind(this);

        this.countryListData = CountryCodes;
        this.page = 1;
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            title: this.props.navigation.state.params && this.props.navigation.state.params.title ? this.props.navigation.state.params.title : this.t('select_country_code'),
            countryCodes: this.ds.cloneWithRows(this.countryListData),
            loading: true
        }
    }

    renderItem(item) {
        return (
            <CountryCodeItem
                item={item}
                onPress={this.onItemCountryCodePress.bind(this)} />
        )
    }

    renderFooter = () => {
        if (!this.state.loading) return null;

        return (
            <View
                style={{
                    paddingVertical: verticalScale(20),
                    borderTopWidth: 1,
                    borderColor: "#CED0CE"
                }}
            >
                <ActivityIndicator animating size="large" />
            </View>
        );
    };

    getItemLayout = (data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index
    })

    render() {

        let { countryCodes, title } = this.state;

        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                <HeaderView
                    title={title}
                    handleBackPress={this.onBackPress.bind(this)} />

                <SearchInputText
                    onChangeSearchText={this.onChangeSearchText}
                    wait_interval={0}
                    autoFocus={true} />

                <View style={{ backgroundColor: '#DFDFDF', height: 1 }} />

                <View style={{ flex: 1 }}>
                    {/* <FlatList
                        data={countryCodes}
                        renderItem={this.renderItem}
                        ItemSeparatorComponent={() => <View style={{ backgroundColor: '#DFDFDF', height: 1 }} />}
                        // ListFooterComponent={this.renderFooter}
                        // ListEmptyComponent={() => <EmptyDataView />}
                        // onEndReached={this.loadMoreData}
                        // onEndReachedThreshold={5}
                        keyExtractor={item => item.id}
                        keyboardShouldPersistTaps={'always'}
                        // initialNumToRender={10}
                        // maxToRenderPerBatch={10}
                        getItemLayout={this.getItemLayout}
                        extraData={this.state}
                    /> */}
                    <ListView
                        renderSeparator={(sectionId, rowId) => <View style={{ backgroundColor: '#DFDFDF', height: 1 }} />}
                        dataSource={countryCodes}
                        enableEmptySections={true}
                        keyboardShouldPersistTaps='always'
                        renderRow={this.renderItem}
                    />
                    {this.renderInternalLoading()}
                </View>

                {this.renderMessageBar()}

            </KeyboardAvoidingView>
        );
    }

    onBackPress() {
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
        return true;
    }

    componentDidMount() {
        this.rotateToPortrait();
        this.registerMessageBar();
        this.handleHardwareBackPress();

        // queryCountryPhoneCode()
        //     .then((countryListData) => {
        //         if (countryListData.length === 0) {
        //             this.getListCountryCode();
        //         } else {
        //             this.setState({
        //                 countryCodes: this.ds.cloneWithRows(countryListData)
        //             }, () => { this.countryListData = countryListData; });

        //         }
        //     })
        //     .catch(error => {
        //         this.getListCountryCode();
        //     });

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

    loadMoreData() {
        this.setState({
            loading: true
        }, () => {
            this.page++;
            this.getListCountryCode();
        })
    }

    onChangeSearchText(input) {

        let filterData = this.countryListData.filter((country) =>
            remove(`${country.name}`.toLowerCase()).indexOf(remove(input.toLowerCase().trim())) >= 0
            || `${country.phone_code}`.toLowerCase().indexOf(input.toLowerCase().trim()) >= 0
            || `${country.sortname}`.toLowerCase().indexOf(input.toLowerCase().trim()) >= 0
        );
        this.setState({
            // countryCodes: filterData
            countryCodes: this.ds.cloneWithRows(filterData)
        })
    }

    getListCountryCode() {
        let self = this;
        let url = this.getConfig().getBaseUrl() + ApiService.get_country_list(this.page);
        console.log('url', url);
        this.internalLoading.showLoading();
        Networking.httpRequestGet(url, this.onListCountryCodeResponse.bind(this), () => {
            self.showErrorMsg(this.t('time_out'));
            self.internalLoading.hideLoading();
        });
    }

    onListCountryCodeResponse(jsonData) {
        this.internalLoading.hideLoading();
        this.model = new CountryModel();
        this.model.parseData(jsonData);
        if (this.model.getErrorCode() === 0) {

            this.setState({
                countryCodes: this.ds.cloneWithRows(this.model.getCountryList())
            }, () => {
                this.countryListData = this.model.getCountryList();
                insertCountryPhoneCode(this.countryListData);
            });
        } else {
            self.showErrorMsg(this.model.getErrorMsg());
        }

    }

    onItemCountryCodePress(language) {
        let { params } = this.props.navigation.state;
        if (params.countryCodeCallback) {
            params.countryCodeCallback(language);
        }
        Keyboard.dismiss();
        this.onBackPress();
    }

}

class CountryCodeItem extends PureComponent {


    render() {
        let { item } = this.props;

        return (
            <Touchable onPress={this.onItemCountryCodePress.bind(this, item)}>
                <View style={styles.view_item}>
                    {/* <Image
                        style={styles.img_flag}
                        source={{uri: item.image}} /> */}
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_language}>
                        {item.name}
                    </Text>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_code}>
                        {`+${item.phone_code}`}
                    </Text>
                </View>
            </Touchable>
        )
    }

    onItemCountryCodePress(item) {
        if (this.props.onPress) {
            this.props.onPress(item);
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