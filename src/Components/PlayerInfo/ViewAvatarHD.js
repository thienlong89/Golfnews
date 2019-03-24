import React from 'react';
import { StyleSheet,View, Image, Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import { Avatar } from 'react-native-elements';

var dimensions = Dimensions.get('window');
var screenWidth = dimensions.width - 20;
var screenHeight = screenWidth;

/**
 * View man hình avatar full HD
 */
export default class ViewAvatarHD extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }

    onBackClick() {
        let { navigation } = this.props;
        if (navigation) {
            navigation.goBack();
        }
        return true;
    }

    render() {
        let { url_avatar } = this.props.navigation.state.params;
        url_avatar = url_avatar.replace('normal','larger');
        return (
            <View style={styles.container}>
                <View style={styles.container_avatar}>
                    <Avatar
                        rounded={true}
                        width={screenWidth}
                        height={screenHeight}
                        avatarStyle={{ borderColor: '#00aba7', borderWidth: 4 }}
                        source={{ uri: url_avatar }}
                    />
                </View>
                <Touchable style={styles.touch_quit} onPress={this.onBackClick.bind(this)}>
                    <Image
                        style={styles.image}
                        source={this.getResources().ic_remove}
                    />
                </Touchable>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container : {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },

    container_avatar : {
        width: screenWidth, 
        height: screenHeight, 
        justifyContent: 'center', 
        alignItems: 'center'
    },

    touch_quit : {
        position: 'absolute', 
        top: 30, 
        right: 10, 
        width: 40, 
        height: 40
    },

    image : {
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: 40, 
        height: 40, 
        resizeMode: 'contain',
        ///tinyColor : '#000' 
    }
});