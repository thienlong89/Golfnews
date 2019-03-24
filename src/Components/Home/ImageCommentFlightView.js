import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler,
    FlatList
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import { scale, verticalScale, moderateScale } from '../../Config/RatioScale';
import ImageFlightItemFull from '../Social/Item/ImageFlightItemFull';

export default class ImageCommentFlightView extends BaseComponent {

    constructor(props) {
        super(props);

        this.page = 1;
        this.state = {
            imgList: []
        }

        this.onBackPress = this.onBackPress.bind(this);
        this.onOpenImage = this.onOpenImage.bind(this);
        this.onLoadMoreData = this.onLoadMoreData.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.imgList.length != this.state.imgList.length;
    }

    render() {
        let {
            imgList
        } = this.state;
        return (
            <View style={styles.container}>
                <HeaderView
                    title={this.t('comment')}
                    handleBackPress={this.onBackPress} />
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={imgList}
                        ItemSeparatorComponent={() => <View style={styles.line} />}
                        onEndReached={this.onLoadMoreData}
                        onEndReachedThreshold={0.2}
                        initialNumToRender={5}
                        renderItem={({ item }) =>
                            <ImageFlightItemFull
                                uri={item.img_path}
                                data={item}
                                onOpenImage={this.onOpenImage} />
                        }
                        style={{ marginTop: scale(5) }}
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

        this.requestImageList();
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

    onLoadMoreData() {
        this.page++;
        this.requestImageList();
    }

    requestImageList() {
        let url = this.getConfig().getBaseUrl() + ApiService.get_all_img_upload_flight(this.page);
        console.log('url: ', url);
        this.internalLoading.showLoading();
        let self = this;
        Networking.httpRequestGet(url, (jsonData) => {
            self.internalLoading.hideLoading();
            let { error_code, data, error_msg } = jsonData;
            if (error_code === 0) {
                if (data instanceof Array && data.length > 0) {
                    self.setState({
                        imgList: [...self.state.imgList, ...data]
                    })
                }
            } else {
                self.showErrorMsg(error_msg);
            }
        }, () => {
            self.internalLoading.hideLoading();
        })
    }

    onOpenImage(uri, data) {
        console.log('onOpenImage', data);
        if (this.props.navigation) {
            this.props.navigation.navigate('show_scorecard_image', {
                'imageUri': data.img_path,
                'imgList': [data.img_path],
                'position': 0,
                'flightId': data.flight_id,
                'isPortrait': true
            })
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column'
    },
    line: {
        height: scale(5),
        backgroundColor: '#EFEFF4',
        borderColor: '#EBEBEB',
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5
    }
});