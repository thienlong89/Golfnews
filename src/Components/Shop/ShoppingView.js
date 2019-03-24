import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    BackHandler
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../HeaderView';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';
import { scale, verticalScale, moderateScale, fontSize } from '../../Config/RatioScale';

export default class ShoppingView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);

        this.state = {

        }

        this.onBackPress = this.onBackPress.bind(this);
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderView
                    title={'Shop'}
                    handleBackPress={this.onBackPress} />
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>{this.t('function_is_developing')}</Text>
                </View>

                {this.renderMessageBar()}
            </View>
        );
    }

    onBackPress() {
        // if (this.props.navigation) {
        //     this.props.navigation.goBack();
        // }
        let { navigation } = this.props;
        if (navigation) {
            navigation.navigate('HomeView');
        }
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

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        flexDirection: 'column'
    },
    txt_title: {
        color: '#808080',
        textAlign: 'center',
        marginTop: scale(50),
        fontSize : fontSize(18,scale(4))
    }
});