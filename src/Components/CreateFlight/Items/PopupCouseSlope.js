import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    FlatList
} from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { scale, verticalScale, fontSize } from '../../../Config/RatioScale';
import SlopeItemView from './SlopeItemView';

const slideAnimation = new SlideAnimation({
    slideFrom: 'bottom',
});

export default class PopupCouseSlope extends BaseComponent {

    static defaultProps = {
        courseList: null,
        path1: {},
        path2: {},
        teeList: []
    }

    constructor(props) {
        super(props);
        this.type = -1;
        this.extrasData = null;
        this.state = {
            content: this.props.content
        }
        this.onCancelClick = this.onCancelClick.bind(this);
    }

    setContent(content, typeData = -1, extrasData = null) {
        this.setState({
            content: content
        }, () => {
            this.show();
            this.type = typeData;
            this.extrasData = extrasData;
        });
    }

    render() {
        let {
            teeList
        } = this.props;
        console.log('teeList', teeList)
        return (
            <PopupDialog
                ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                dialogAnimation={slideAnimation}
                dialogStyle={styles.popup_style}>
                <View style={styles.container}>
                    <View style={styles.popup_header}>
                        <Text allowFontScaling={global.isScaleFont} style={styles.popup_title_style}>{this.t('course_slope')}</Text>
                        <TouchableOpacity onPress={this.onCancelClick}
                            style={styles.touchable_close}>
                            <Image
                                style={styles.img_close}
                                source={this.getResources().ic_x} />
                        </TouchableOpacity>
                    </View>
                   
                    <View style={styles.view_row}>
                        <View style={styles.view_gender}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_gender}>{`Men`}</Text>
                            <FlatList
                                numColumns={2}
                                initialNumToRender={5}
                                ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
                                data={teeList}
                                enableEmptySections={true}
                                keyboardShouldPersistTaps='always'
                                renderItem={({ item, index }) =>
                                    <SlopeItemView
                                        teeInfo={item}
                                        isMen={true}
                                    />
                                }
                                contentContainerStyle={{
                                    flexGrow:1
                                }}
                                style={{flexGrow: 0}}
                            />
                        </View>

                        <View style={styles.line_horizontal}/>

                        <View style={styles.view_gender}>
                            <Text allowFontScaling={global.isScaleFont} style={styles.txt_gender}>{`Women`}</Text>

                            <FlatList
                                numColumns={2}
                                initialNumToRender={5}
                                ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
                                data={teeList}
                                enableEmptySections={true}
                                keyboardShouldPersistTaps='always'
                                renderItem={({ item, index }) =>
                                    <SlopeItemView
                                        teeInfo={item}
                                        isMen={false}
                                    />
                                }
                                contentContainerStyle={{
                                }}
                                style={{flexGrow: 0}}
                            />
                        </View>
                    </View>
                </View>
            </PopupDialog>
        );
    }

    show(extrasData = null) {
        this.extrasData = extrasData;
        this.popupDialog.show();
        //console.log('popupDialog.show()');
    }

    dismiss() {
        this.popupDialog.dismiss();
        //console.log('popupDialog.dismiss()');
    }

    onConfirmClick() {
        this.popupDialog.dismiss();
        if (this.props.onConfirmClick != null) {
            this.props.onConfirmClick(this.type, this.extrasData);
        }
    }

    onCancelClick() {
        this.popupDialog.dismiss();
        if (this.props.onCancelClick != null) {
            this.props.onCancelClick(this.type);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 7
    },
    popup_style: {
        width: scale(470),
        height: verticalScale(220),
        backgroundColor: '#FFFFFF',
        borderRadius: 7
    },
    popup_header: {
        flexDirection: 'row',
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 7,
        borderTopRightRadius: 7
    },
    header_icon: {
        position: 'absolute',
        width: verticalScale(40),
        height: verticalScale(40),
        resizeMode: 'contain',
        left: scale(3)
    },
    popup_title_style: {
        color: '#685D5D',
        fontWeight: 'bold',
        fontSize: fontSize(17, scale(3)),// 17,
        marginTop: verticalScale(10),
        marginBottom: verticalScale(10),
        textAlign: 'center'
    },
    popup_content: {
        color: '#685D5D',
        fontSize: fontSize(15, scale(1)),// 15,
        marginTop: verticalScale(10),
        marginBottom: verticalScale(10),
        textAlign: 'center',
        justifyContent: 'center'
    },
    container_btn: {
        flexDirection: 'row'
    },
    line: {
        backgroundColor: '#ADADAD',
        height: verticalScale(0.5),
        marginTop: verticalScale(10)
    },
    line_horizontal: {
        backgroundColor: '#ADADAD',
        width: 1,
        height: verticalScale(150),
        marginTop: scale(15),
        marginBottom: scale(15),
        marginLeft: scale(10),
        marginRight: scale(10)
    },
    touchable_btn: {
        flex: 1,
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(10),
        justifyContent: 'center',
        alignItems: 'center'
    },
    confirm_text: {
        color: '#757575',
        fontSize: fontSize(17, scale(3)),// 17
    },
    img_close: {
        width: scale(17),
        height: scale(17),
        resizeMode: 'contain',
    },
    touchable_close: {
        position: 'absolute',
        right: 10,
        top: 0,
        bottom: 0,
        padding: scale(10),
        justifyContent: 'center',
        alignItems: 'center'
    },
    listview_separator: {
        height: scale(10)
    },
    view_row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    view_gender: {
        flex: 1
    },
    txt_gender: {
        color: '#685D5D',
        fontWeight: 'bold',
        fontSize: fontSize(17, scale(3)),// 17,
        marginBottom: scale(15),
        // marginTop: verticalScale(10),
        // marginBottom: verticalScale(10),
        textAlign: 'center'
    }
});