import React, { Component } from 'react';
import {
    StyleSheet,
    Image
} from 'react-native';
/**
 * Custom lại Image của React Native đê thay đổi chỉ render lại component con
 * imageDefault là ảnh default nếu load từ server về bị lỗi(dang image caching)
 */
export default class MyImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            failed: false
        };
    }

    /**
     * handler khi load anh sever về bị lỗi
     */
    _onError = () => {
        this.setState({ failed: true });
    }

    render() {
        let { failed } = this.state
        return (
            <Image
                style={this.props.style}
                source={(failed || !this.props.uri.length) ? this.props.imageDefault : { uri: this.props.uri }}
                onError={this._onError.bind(this)}
                resizeMethod={'resize'}
                onLoadStart={this.onLoadStart.bind(this)}
                onLoadEnd={this.onLoadEnd.bind(this)}
            />
        );
    }

    onLoadStart() {
        if (this.props.onLoadStart) {
            this.props.onLoadStart();
        }
    }

    onLoadEnd() {
        if (this.props.onLoadEnd) {
            this.props.onLoadEnd();
        }
    }
}