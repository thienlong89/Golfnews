import React from 'react';
import { Text, View, TextInput, Image,BackHandler } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import Touchable from 'react-native-platform-touchable';
import stylesHeaderBar from '../../../Styles/Common/HeaderBar/StyleHeaderBar';

export default class SearchHeaderView extends BaseComponent {
    constructor(props) {
        super(props);
        // this.searchCallback = null;
        this.backCallback = null;
        this.cancelCallback = null;

        this.onCancelClick = this.onCancelClick.bind(this);
        this.onBackClick = this.onBackClick.bind(this);

        this.backHandler = null;
    }

    componentDidMount(){
        this.backHandler = BackHandler.addEventListener('hardwareBackPress',this.onBackClick);
    }

    componentWillUnmount(){
        if(this.backHandler) this.backHandler.remove();
    }

    /**
     * back về màn hình trước đó
     */
    onBackClick() {
        if (this.backCallback) {
            this.backCallback();
        }
        let{navigation} = this.props;
        if(navigation){
            navigation.goBack();
        }
        return true;
    }

    /**
     * Hủy tìm kiếm
     */
    onCancelClick() {
        // this.setState({
        //     isSearchClick: false,
        //     textSearch: ''
        // });
        if (this.cancelCallback) {
            this.cancelCallback();
        }
        let{navigation} = this.props;
        if(navigation){
            navigation.goBack();
        }
    }

    render() {
        // let { isSearchClick } = this.state;
        // let self = this;
        return (
            <View style={stylesHeaderBar.content_view}>
                <View style={stylesHeaderBar.header_view}>
                    <Touchable style={stylesHeaderBar.touch_back} onPress={this.onBackClick}>
                        <Image
                            style={stylesHeaderBar.back_image}
                            source={this.getResources().ic_back}
                        />

                    </Touchable>
                    <Text allowFontScaling={global.isScaleFont} style={stylesHeaderBar.title_text}>{this.t('leaderboard_title')}</Text>
                    <Touchable style={stylesHeaderBar.touch_right} onPress={this.onCancelClick}>
                        <Image
                            style={stylesHeaderBar.right_image}
                            source={this.getResources().ic_Search1}
                        />
                    </Touchable>
                </View>
            </View>
        );
    }
}