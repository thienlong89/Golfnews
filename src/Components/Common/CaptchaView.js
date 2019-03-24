import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import Networking from '../../Networking/Networking';
import ApiService from '../../Networking/ApiService';

export default class CaptchaView extends BaseComponent {

    static defaultProps = {
        uuid: '',
        customStyle: null
    }

    constructor(props) {
        super(props);
        this.getCaptchaImage = this.getCaptchaImage.bind(this);
        this.state = {
            captcha_uri: ''
        }
    }

    render() {
        let { captcha_uri } = this.state;
        let { customStyle } = this.props;

        return (
            <View style={styles.image_captcha_container}>
                <View style={customStyle ? customStyle: styles.view_captcha}>
                    <Image
                        style={styles.image_captcha}
                        source={{ uri: captcha_uri }}
                    />
                </View>

                <TouchableOpacity style={styles.touchable_image_refresh}
                    onPress={this.getCaptchaImage}>
                    <Image
                        style={styles.image_refresh}
                        source={this.getResources().ic_refresh}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    componentDidMount() {
        console.log('CaptchaView.componentDidMount')
        if (!this.state.captcha_uri)
            this.getCaptchaImage();
    }

    componentWillUnmount() {

    }

    getCaptchaImage() {
        let url = this.getConfig().getBaseUrl() + ApiService.get_captcha_auth(this.props.uuid);
        console.log('setBaseUrl', url);
        Networking.httpRequestGetBase64(url, this.onCaptchaImage.bind(this));
    }

    onCaptchaImage(base64data, header) {
        this.setState({
            captcha_uri: base64data
        }, () => {
            if (this.props.onChangeCaptcha) {
                this.props.onChangeCaptcha();
            }
        });
        //console.log("--------------header : ",header);
        try {
            if (header.hasOwnProperty('map')) {
                let map = header.map;
                this.keyData = map['keydata'];
                return;
            }
            this.keyData = header['keydata'];
        } catch (error) {
            console.log('keyData error', error);
        }
    }


}

const styles = StyleSheet.create({
    image_captcha_container: {
        flexDirection: 'row',
        height: 40,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    view_captcha: {
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image_captcha: {
        height: 40,
        width: 80,
        resizeMode: 'contain',
        tintColor: '#00ABA7',
        marginLeft: 5,
        marginRight: 5
    },
    touchable_image_refresh: {
        marginLeft: 10
    },
    image_refresh: {
        height: 35,
        width: 35,
        resizeMode: 'contain'
    },
});