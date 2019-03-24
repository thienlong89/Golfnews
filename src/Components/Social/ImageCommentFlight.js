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
import ImageFlightItemFull from './Item/ImageFlightItemFull';

export default class ImageCommentFlight extends BaseComponent {

    constructor(props) {
        super(props);
        this.imgList = this.props.navigation.state.params.imgList || [];
        this.index = this.props.navigation.state.params.index || 0;

        this.onBackPress = this.onBackPress.bind(this);
        this.onOpenImage = this.onOpenImage.bind(this);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderView
                    title={this.t('comment')}
                    handleBackPress={this.onBackPress} />
                <FlatList
                    data={this.imgList}
                    ItemSeparatorComponent={() => <View style={styles.line} />}
                    initialScrollIndex={this.index}
                    renderItem={({ item }) =>
                        <ImageFlightItemFull
                            uri={item.img_path}
                            onOpenImage={this.onOpenImage} />
                    }
                    style={{ marginTop: scale(5) }}
                />
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

    onOpenImage(uri){
        console.log('onOpenImage');
        if (this.props.navigation) {
            this.props.navigation.navigate('show_scorecard_image', {
                'imageUri': uri,
                'imgList': [uri],
                'position': 0,
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