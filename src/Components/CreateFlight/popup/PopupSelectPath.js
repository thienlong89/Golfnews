import React from 'react';
import { Platform, StyleSheet, Text, View, Dimensions } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import PathModel from '../../../Model/CreateFlight/Flight/PathModel';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
let { width, height } = Dimensions.get('window');


export default class PopupSelectPath extends BaseComponent {

    static defaultProps = {
        // pathList: [],
        // pathNeedChange: null
    }

    constructor(props) {
        super(props);
        this.state = {
            pathList: [],
            item_selected: -1
        }

        this.onSelectPath = this.onSelectPath.bind(this);
    }

    render() {
        // const slideAnimation = new SlideAnimation({
        //     slideFrom: 'bottom',
        // });
        let {
            pathList,
            item_selected
        } = this.state;

        let pathViews = pathList.map((item, index) => {
            return (
                <Touchable style={[styles.touchable_path_bg, { backgroundColor: item_selected === index ? '#00ABA7' : '#FFFFFF' }]}
                    onPress={() => this.changePathClick(item, index)}>
                    <Text allowFontScaling={global.isScaleFont} style={{ padding: 10, fontSize: 17, color: item_selected === index ? '#FFFFFF' : '#00ABA7' }}>{item.getName()}</Text>
                </Touchable>
            );
        });

        return (
            <PopupDialog
                ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                // dialogAnimation={slideAnimation}
                dialogStyle={styles.popup_style}
                onDismissed={this.onDismissed.bind(this)}>
                <View style={styles.container}>
                    <Text allowFontScaling={global.isScaleFont} style={styles.txt_title}>
                        {this.t('tut_select_path')}
                    </Text>

                    <View style={styles.path_container}>
                        {pathViews}
                    </View>
                    <View>
                        <View style={styles.line} />
                        <View style={styles.btn_container}>
                            <Touchable style={styles.touchable_btn} onPress={() => this.popupDialog.dismiss()}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_btn}>{this.t('cancel')}</Text>
                            </Touchable>
                            <View style={styles.vertical_line} />
                            <Touchable style={styles.touchable_btn} onPress={this.onSelectPath}>
                                <Text allowFontScaling={global.isScaleFont} style={styles.txt_btn}>{this.t('ok')}</Text>
                            </Touchable>
                        </View>
                    </View>

                </View>

            </PopupDialog>
        );
    }

    setPathList(pathList = []) {
        this.setState({
            pathList: pathList
        })
    }

    show() {
        this.popupDialog.show();
    }

    dismiss() {
        this.popupDialog.dismiss();
    }

    changePathClick(item, index) {
        this.setState({
            item_selected: index
        })
    }

    restartPopup() {
        this.dismiss();

    }

    onDismissed() {
        //this.show();
    }

    onExitClick() {
        this.popupDialog.dismiss();
    }

    onSelectPath() {
        let {
            pathList,
            item_selected
        } = this.state;
        if (item_selected != -1 && this.props.onPathCallback) {
            this.props.onPathCallback(pathList[item_selected])
        }
        this.popupDialog.dismiss();
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: scale(5),
        flex: 1,
        justifyContent: 'space-between'
    },
    popup_style: {
        width: width - scale(30),
        backgroundColor: '#FFFFFF',
        height: verticalScale(200)
    },
    txt_title: {
        color: '#685D5D',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: verticalScale(15),
        fontSize: fontSize(17, scale(3)),// 17
    },
    txt_path_title: {
        color: '#008BF0',
        fontWeight: 'bold',
        fontSize: fontSize(17, scale(3)),// 17
    },
    path_container: {
        flexDirection: 'row',
        marginTop: verticalScale(20),
        marginBottom: verticalScale(20),
        justifyContent: 'center',
        alignItems: 'center'
    },
    touchable_path_bg: {
        minWidth: verticalScale(60),
        borderColor: '#00ABA7',
        borderWidth: scale(1),
        borderRadius: scale(5),
        marginLeft: scale(10),
        marginRight: scale(10),
        justifyContent: 'center',
        alignItems: 'center'
    },
    line: {
        height: verticalScale(1),
        backgroundColor: '#ADADAD'
    },
    vertical_line: {
        width: scale(1),
        backgroundColor: '#ADADAD'
    },
    btn_container: {
        flexDirection: 'row'
    },
    txt_btn: {
        color: '#757575',
        fontSize: fontSize(17, scale(3)),// 17,
        paddingBottom: verticalScale(10),
        paddingTop: verticalScale(10)
    },
    touchable_btn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }

});