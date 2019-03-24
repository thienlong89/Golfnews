import React from 'react';
import { View, Image } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import { verticalScale } from '../../../Config/RatioScale';
import { Avatar } from 'react-native-elements';
import Touchable from 'react-native-platform-touchable';

export default class GroupItemChoosen extends BaseComponent {
    constructor(props) {
        super(props);
        this.onRemoveClick = this.onRemoveClick.bind(this);
    }

    onRemoveClick() {
        let{data,onRemoveItem} = this.props;
        if(data && onRemoveItem){
            onRemoveItem(data);
        }
    }

    getElementButtonRemove(data) {
        let { _id } = data;
        if (_id === this.getUserInfo().getId()) {
            return null;
        }
        return (
            <Touchable style={{ position: 'absolute', width: 20, height: 20, top: 2, right: 0 }} onPress={this.onRemoveClick}>
                <Image style={{ width: 20, height: 20, resizeMode: 'contain', position: 'absolute', top: 0, right: 0 }}

                    source={this.getResources().delete} />
            </Touchable>
        )
    }

    render() {
        let { data } = this.props;
        // console.log('.................choosen Data : ', data);
        return (
            <View style={{ width: verticalScale(40), height: verticalScale(50), marginLeft: 5, justifyContent: 'flex-end' }}>
                <Avatar
                    width={verticalScale(40)}
                    height={verticalScale(40)}
                    rounded
                    source={{ uri: data.avatar }}
                    containerStyle={{ marginBottom: 5 }}
                >
                </Avatar>
                {/* <Touchable style={{ position: 'absolute', width: 20, height: 20, top: -3, right: 0 }} onPress={this.onRemoveClick}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', position: 'absolute', top: 0, right: 0 }}

                        source={this.getResources().delete} />
                </Touchable> */}
                {this.getElementButtonRemove(data)}
            </View>
        )
    }
}