import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    FlatList,
    Image
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
import AccessoryItemView from './AccessoryItemView';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import AccessoriesModel from '../../../Model/User/AccessoriesModel';

let { width, height } = Dimensions.get('window');
const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

export default class PopupSelectAccessories extends BaseComponent {

    constructor(props) {
        super(props);
        this.extrasData;
        this.isPopupShowing = false;
        this.page = 1;
        this.balls = [];
        this.equipments = [];
        this.state = {
            accessories: []
        }

        this.onAccessoryItemPress = this.onAccessoryItemPress.bind(this);
        this.loadMoreData = this.loadMoreData.bind(this);
        this.onCreateNewAccessory = this.onCreateNewAccessory.bind(this);
    }


    render() {
        let {
            accessories
        } = this.state;
        return (
            <PopupDialog
                ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                dialogAnimation={slideAnimation}
                containerStyle={{ position: 'absolute', bottom: 0 }}
                dialogStyle={[styles.popup_style, { height: 2 * height / 3 }]}>
                <View style={styles.container}>
                    <TouchableOpacity onPress={this.onCreateNewAccessory}>
                        <View style={styles.view_create}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_create}>{this.t('create_accessory')}</Text>
                            <Image
                                style={[styles.pen_image, { tintColor: '#A5A5A5' }]}
                                source={this.getResources().pen}
                            />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.listview_separator} />
                    <FlatList
                        ref={(refFlatList) => { this.refFlatList = refFlatList; }}
                        removeClippedSubviews={true}
                        onEndReached={this.loadMoreData}
                        onEndReachedThreshold={0.2}
                        initialNumToRender={5}
                        ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
                        data={accessories}
                        enableEmptySections={true}
                        // ListFooterComponent={() => <FooterComponent ref={(refFooterComponent) => { this.refFooterComponent = refFooterComponent; }} />}
                        keyboardShouldPersistTaps='always'
                        renderItem={({ item, index }) =>
                            <AccessoryItemView
                                accessory={item}
                                index={index}
                                // isSelected={isSelected}
                                onItemPress={this.onAccessoryItemPress}
                            />
                        }
                    // contentContainerStyle={{ paddingTop: this.home_page_scroll_padding_top }}
                    />
                    {this.renderInternalLoading()}
                </View>

            </PopupDialog>
        );
    }

    componentDidMount() {
        this.requestGetAccessories();
    }

    loadMoreData() {
        this.page++;
        this.requestGetAccessories();
    }

    requestGetAccessories() {
        let url = this.getConfig().getBaseUrl() + ApiService.user_get_list_equipment(this.page);
        console.log("url:", url);
        if (this.internalLoading)
            this.internalLoading.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            console.log("requestGetAccessories:", jsonData);
            self.model = new AccessoriesModel(self);
            self.model.parseData(jsonData);
            if (self.model.getErrorCode() === 0) {
                let equipment = self.model.getAccessories();
                let ball = self.model.getBalls();
                self.equipments = [...self.equipments, ...equipment]
                self.balls = [...self.balls, ...ball]
                if (self.extrasData === 6) {
                    self.setState({
                        accessories: self.balls
                    }, () => {
                    })
                } else {
                    self.setState({
                        accessories: self.equipments
                    }, () => {
                    })
                }
                // if (this.equipments.length > 0) {
                //     self.setState({
                //         accessories: [...self.state.accessories, ...this.equipments]
                //     }, () => {
                //     })
                // }
            }
            if (self.internalLoading)
                self.internalLoading.hideLoading();
        }, () => {
            //time out
            if (self.internalLoading)
                self.internalLoading.hideLoading();
            if (self.page > 1) self.page--;
        });
    }

    show(extrasData = '') {
        this.extrasData = extrasData;
        if (this.state.accessories.length === 0) {
            this.requestGetAccessories();
        }
        if (this.extrasData === 6) {
            this.setState({
                accessories: this.balls
            }, () => {
                this.popupDialog.show();
                this.isPopupShowing = true;
            })
        } else {
            this.setState({
                accessories: this.equipments
            }, () => {
                this.popupDialog.show();
                this.isPopupShowing = true;
            })
        }

    }

    dismiss() {
        this.popupDialog.dismiss();
        this.isPopupShowing = false;
    }

    onAccessoryItemPress(data) {
        this.popupDialog.dismiss();
        if (this.props.onAccessoryItemPress) {
            this.props.onAccessoryItemPress(data, this.extrasData);
        }
    }

    onCreateNewAccessory() {
        this.popupDialog.dismiss();
        if (this.props.onCreateNewAccessory) {
            this.props.onCreateNewAccessory(this.extrasData);
        }
    }

}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        flex: 1,
        borderTopLeftRadius: scale(10),
        borderTopRightRadius: scale(10)
    },
    popup_style: {
        position: 'absolute',
        bottom: 0,
        width: width,
        backgroundColor: 'rgba(0,0,0,0)'
    },
    listview_separator: {
        backgroundColor: '#ADADAD',
        height: 0.5
    },
    pen_image: {
        width: scale(20),
        height: verticalScale(20),
        resizeMode: 'contain',
        alignSelf: 'center',
        marginRight: scale(5)
    },
    txt_create: {
        fontSize: fontSize(15),
        color: 'black'
    },
    view_create: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: scale(50),
        paddingLeft: scale(10),
        paddingRight: scale(5),
        borderTopLeftRadius: scale(10),
        borderTopRightRadius: scale(10)
    }
});