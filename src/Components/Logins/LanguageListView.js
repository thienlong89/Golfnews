import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler,
    FlatList,
    Image
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import { scale, verticalScale, fontSize } from '../../Config/RatioScale';
import { language } from '../../../Language';
import { Transition } from 'react-navigation-fluid-transitions';
// import Networking from '../../Networking/Networking';
// import ApiService from '../../Networking/ApiService';

export default class LanguageListView extends BaseComponent {


    constructor(props) {
        super(props);
        this.onBackPress = this.onBackPress.bind(this);
    }

    renderItem(item) {
        return (
            <Touchable onPress={this.onItemLanguagePress.bind(this, item)}>
                <View style={styles.view_item}>
                    <Image
                        style={styles.img_flag}
                        source={item.flag} />
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_language}>
                        {item.name}
                    </Text>
                </View>
            </Touchable>
        )
    }

    render() {

        return (
            <Transition appear='horizontal'>
                <View style={styles.container}>
                    <HeaderView
                        title={this.t('select_language')}
                        handleBackPress={this.onBackPress} />

                    <FlatList
                        data={language}
                        renderItem={({ item }) => this.renderItem(item)}
                        ItemSeparatorComponent={() => <View style={{ backgroundColor: '#DFDFDF', height: 1 }} />}
                    />
                    {this.renderMessageBar()}
                </View>
            </Transition>
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

    onItemLanguagePress(language) {
        let { params } = this.props.navigation.state;
        if (params.onLanguageCallback) {
            params.onLanguageCallback(language);
        }
        this.onBackPress();
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    view_item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: verticalScale(10),
        marginBottom: verticalScale(10)
    },
    img_flag: {
        width: verticalScale(32),
        height: verticalScale(32),
        resizeMode: 'contain',
        marginLeft: scale(30),
        marginRight: scale(20),
        borderColor: '#CCC',
        borderWidth: 1
    },
    txt_language: {
        fontSize: fontSize(15, scale(1)),
        color: '#000'
    }
});