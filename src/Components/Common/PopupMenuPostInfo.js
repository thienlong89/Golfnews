import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    Modal,
    TouchableWithoutFeedback
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../Core/View/BaseComponent';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';

export default class PopupMenuPostInfo extends BaseComponent {

    static defaultProps = {
        itemList: []
    }

    constructor(props) {
        super(props);
        this.extrasData = {};
        this.state = {
            itemList: [
                {
                    icon: this.getResources().pen,
                    name: this.t('edit_post'),
                    type: "EDIT"
                },
                {
                    icon: this.getResources().ic_trash,
                    name: this.t('delete_post'),
                    type: "DELETE"
                }
            ],
            showPopup: false
        }

        this.onRequestClose = this.onRequestClose.bind(this);
    }

    renderItemMenu(itemList) {

        let menuItem = itemList.map((item, index) => {
            return (
                <Touchable onPress={this.onPostMenuItemPress.bind(this, item)}>
                    <View>
                        <View style={[styles.view_item, index === 0 ? styles.view_first_item : {}]}>
                            <Image
                                style={styles.img_logo}
                                source={item.icon} />
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_club_name}
                                numberOfLines={1}>{item.name}
                            </Text>
                        </View>
                        <View style={{ height: 1, backgroundColor: '#E0E0E0' }} />
                    </View>
                </Touchable>
            )
        })
        return (
            <View style={styles.container_content}>
                {menuItem}
            </View>
        )
    }

    render() {
        let { itemList, showPopup } = this.state;

        const slideAnimation = new SlideAnimation({
            slideFrom: 'bottom',
        });


        return (
            // <PopupDialog
            //     ref={(popupDialog) => { this.popupDialog = popupDialog; }}
            //     dialogAnimation={slideAnimation}
            //     containerStyle={{ position: 'absolute', bottom: 0 }}
            //     dialogStyle={[styles.popup_style, { height: itemList.length * 60 }]}>
            <Modal
                visible={showPopup}
                animationType="fade"
                transparent={true}
                onRequestClose={this.onRequestClose}>
                <TouchableWithoutFeedback onPress={this.onRequestClose}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
                        <View style={styles.container}>
                            {this.renderItemMenu(itemList)}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    }

    onRequestClose() {
        console.log('onRequestClose')
        this.setState({
            showPopup: false
        })
    }

    show(itemList = [], extrasData) {
        this.extrasData = extrasData;

        if (itemList.length > 0) {
            this.setState({
                itemList: itemList,
                showPopup: true
            })
        } else {
            this.setState({
                showPopup: true
            })
        }

    }

    dismiss() {
        // this.popupDialog.dismiss();
        this.setState({
            showPopup: false
        })
    }

    onPostMenuItemPress(item) {
        this.setState({
            showPopup: false
        }, () => {
            if (this.props.onPostMenuItemPress) {
                this.props.onPostMenuItemPress(item.type, this.extrasData);
            }
        })
        // this.popupDialog.dismiss();
        // if (this.props.onPostMenuItemPress) {
        //     this.props.onPostMenuItemPress(item.type, this.extrasData);
        // }
    }

}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0)',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    popup_style: {
        position: 'absolute',
        bottom: 0,
        width: Dimensions.get('window').width,
        backgroundColor: 'rgba(0,0,0,0)'
    },
    container_content: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10
    },
    view_first_item: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    view_item: {
        flexDirection: 'row',
        minHeight: 60,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
    img_logo: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
    txt_club_name: {
        color: '#252525',
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 10
    }

});