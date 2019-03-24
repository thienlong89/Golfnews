import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import BaseComponent from '../../../../../Core/View/BaseComponent';

export default class ShowInfoVideo extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
        this.hide = this.hide.bind(this);
    }

    show() {
        let { show } = this.state;
        if (show) return;
        this.setState({
            show: true
        });
    }

    hide() {
        let { show } = this.state;
        if (!show) return;
        this.setState({
            show: false
        });
    }

    render() {
        let { show } = this.state;
        if (!show) return null;
        let { info } = this.props;
        return (
            <TouchableOpacity style={{position : 'absolute',top : 0,left : 0,bottom : 0,right : 0,zIndex : 10}} onPress={this.hide}>
                <View style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 10,
                    justifyContent: 'center',
                    padding: 10,
                    borderRadius: 5,
                    borderWidth: 0.5,
                    borderColor: 'rgba(0,0,0,0.7)'
                }}>
                    <Text style={{ fontSize: 16, color: 'white' }}>{info}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}