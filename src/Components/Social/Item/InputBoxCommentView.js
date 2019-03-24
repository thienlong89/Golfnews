import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    TextInput
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';


export default class InputBoxCommentView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.sendCommentCallback = null;
        this.state = {
            commentType: 0 // 0: comment text, 1: comment emoji
        }
        this.text = '';
    }

    clear(){
        if(this.inputRef){
            this.inputRef.clear();
        }
    }

    render() {
        let { commentType } = this.state;
        return (
            <View style={styles.container} >
                <TouchableOpacity style={styles.touchable_camera}>
                    <Image
                        style={styles.img_camera}
                        source={this.getResources().ic_camera}
                    />
                </TouchableOpacity>
                <View style={styles.view_input}>
                    <TextInput allowFontScaling={global.isScaleFont} style={styles.input_text}
                        ref={(inputRef) => { this.inputRef = inputRef; }}
                        placeholder={this.t('enter_comment')}
                        placeholderTextColor='#8A8A8F'
                        underlineColorAndroid='rgba(0,0,0,0)'
                        onChangeText={this.onInputTextChange.bind(this)}
                        onSubmitEditing={this.onSubmitComment.bind(this)}
                    />
                    <TouchableOpacity onPress={this.onSubmitPress.bind(this)}>
                        <Image
                            style={styles.img_face}
                            source={commentType === 1 ? this.getResources().ic_submit : this.getResources().ic_face_happiness}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    onInputTextChange(input) {
        if (input.length > 0) {
            // this.setState({
            //     commentType: 1
            // })
            this.text = input;
        } else {
            // this.setState({
            //     commentType: 0
            // })
        }
    }

    onSubmitComment() {
        if(this.sendCommentCallback){
            this.sendCommentCallback(this.text);
        }
    }

    /**
     * send comment den sever
     */
    onSubmitPress() {
       
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F1F1F1',
        flexDirection: 'row',
        minHeight: 40,
        borderTopColor: '#D6D4D4',
        borderWidth: 1
    },
    img_camera: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        tintColor: '#8F8F8F',
        marginLeft: 10
    },
    view_input: {
        flex: 1,
        flexDirection:'row',
        backgroundColor: '#FFFFFF',
        borderColor: '#A1A1A1',
        borderWidth: 0.5,
        borderRadius: 20,
        margin: 10,
        alignItems: 'center',
        height: 40
    },
    touchable_camera: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    input_text: {
        color: '#888888',
        flex: 1,
        paddingLeft: 10,
        paddingRight: 30,
        fontSize:  (Platform.OS === 'ios') ? 16 : 14,
        lineHeight : (Platform.OS === 'ios') ? 20 : 15,
    },
    img_face: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        marginRight: 10
    }
});