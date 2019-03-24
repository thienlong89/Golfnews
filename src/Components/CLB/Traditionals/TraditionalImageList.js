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
import BaseComponent from '../../../Core/View/BaseComponent';
import Networking from '../../../Networking/Networking';
import ApiService from '../../../Networking/ApiService';
import { scale, verticalScale, moderateScale } from '../../../Config/RatioScale';
import TraditionalImageItem from './TraditionalImageItem';

export default class TraditionalImageList extends BaseComponent {

    static defaultProps = {
        clubId: ''
    }

    constructor(props) {
        super(props);
        this.page = 1;
        this.state = {
            imgList: []
        }
        this.onOpenImage = this.onOpenImage.bind(this);
    }

    render() {
        let {
            imgList
        } = this.state;
        return (
            <View style={styles.container}>
                <FlatList
                    data={imgList}
                    ItemSeparatorComponent={() => <View style={styles.line} />}
                    initialScrollIndex={this.index}
                    renderItem={({ item }) =>
                        <TraditionalImageItem
                            uri={item.img_path}
                            onOpenImage={this.onOpenImage}
                            player={item.Users} />
                    }
                    style={{ marginTop: scale(5) }}
                />
                {this.renderInternalLoading()}
            </View>
        );
    }


    componentDidMount() {
        this.rotateToPortrait();

        this.requestTraditionalImageList();
    }

    componentWillUnmount() {
    }

    addImageList(imgAdds = []) {
        let {
            imgList
        } = this.state;
        this.setState({
            imgList: [...imgAdds, ...imgList]
        }, ()=>{
        })
    }

    onOpenImage(uri) {
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

    requestTraditionalImageList() {
        let self = this;
        this.internalLoading.showLoading();
        let url = this.getConfig().getBaseUrl() + ApiService.club_traditional_image_list(this.props.clubId, this.page);
        console.log("url = ", url);
        Networking.httpRequestGet(url, (jsonData) => {
            self.internalLoading.hideLoading();
            if (jsonData.error_code === 0) {
                let data = jsonData['data'];
                if (data instanceof Array) {
                    self.setState({
                        imgList: data
                    })
                }
            }
        }, () => {
            self.internalLoading.hideLoading();
            //self.popupTimeOut.showPopup();

        });
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