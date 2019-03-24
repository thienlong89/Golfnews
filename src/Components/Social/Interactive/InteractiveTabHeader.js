import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import MyView from '../../../Core/View/MyView';
import { scale, fontSize } from '../../../Config/RatioScale';

const TAB_TYPE = {
    All: {
        color: '#00ABA7'
    },
    Love: {
        color: '#D1403F'
    },
    Like: {
        color: '#00ABA7'
    },
    Dislike: {
        color: '#005B59'
    }
}

export default class InteractiveTabHeader extends BaseComponent {

    static defaultProps = {
        loveCount: 0,
        likeCount: 0,
        dislikeCount: 0
    }

    constructor(props) {
        super(props);
        this.state = {
            tabType: 'All',
            tabSelected: TAB_TYPE.All.color
        }
    }

    render() {

        let { tabSelected, tabType } = this.state;
        let { loveCount, likeCount, dislikeCount } = this.props;
        let allCount = loveCount + likeCount + dislikeCount;

        return (
            <View>
                <View style={styles.view_tab_header}>
                    <View style={styles.tab_navigator}>
                        <View style={styles.view_center}>
                            <Text allowFontScaling={global.isScaleFont} style={[styles.view_all_group, { color: tabType === 'All' ? tabSelected : '#707070' }]}>{`${this.t('all')} ${allCount}`}</Text>
                        </View>

                        <View style={[styles.line_indicator, { backgroundColor: tabType === 'All' ? tabSelected : 'rgba(0,0,0,0)' }]} />
                    </View>

                    <MyView style={styles.tab_navigator} hide={loveCount === 0}>
                        <View style={styles.view_icon_group}>
                            <Image
                                style={styles.icon_heart}
                                source={this.getResources().ic_group_heart}
                            />
                            <Text allowFontScaling={global.isScaleFont} style={[styles.txt_number, { color: tabType === 'Love' ? tabSelected : '#707070' }]}>{loveCount}</Text>
                        </View>

                        <View style={[styles.line_indicator, { backgroundColor: tabType === 'Love' ? tabSelected : 'rgba(0,0,0,0)' }]} />
                    </MyView>

                    <MyView style={styles.tab_navigator} hide={likeCount === 0}>
                        <View style={styles.view_icon_group}>
                            <Image
                                style={styles.icon_heart}
                                source={this.getResources().ic_group_like}
                            />
                            <Text allowFontScaling={global.isScaleFont} style={[styles.txt_number, { color: tabType === 'Like' ? tabSelected : '#707070' }]}>{likeCount}</Text>
                        </View>
                        <View style={[styles.line_indicator, { backgroundColor: tabType === 'Like' ? tabSelected : 'rgba(0,0,0,0)' }]} />
                    </MyView>

                    <MyView style={styles.tab_navigator} hide={dislikeCount === 0}>
                        <View style={styles.view_icon_group}>
                            <Image
                                style={styles.icon_heart}
                                source={this.getResources().ic_group_dislike}
                            />
                            <Text allowFontScaling={global.isScaleFont} style={[styles.txt_number, { color: tabType === 'Dislike' ? tabSelected : '#707070' }]}>{dislikeCount}</Text>
                        </View>
                        <View style={[styles.line_indicator, { backgroundColor: tabType === 'Dislike' ? tabSelected : 'rgba(0,0,0,0)' }]} />
                    </MyView>
                </View>
                <View style={styles.view_line_vertical}/>
            </View>
        );
    }

    setTabType(type) {
        this.setState({
            tabSelected: TAB_TYPE[`${type}`].color,
            tabType: type
        })
    }

}

const styles = StyleSheet.create({
    view_tab_header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10
    },
    tab_navigator: {
        // justifyContent: 'center',
        // alignItems: 'center',
        minHeight: scale(50),
        // justifyContent: 'space-between',
    },
    view_center: {
        justifyContent: 'center',
        alignItems: 'center',
        height: scale(50),
    },
    view_all_group: {
        paddingLeft: scale(15),
        paddingRight: scale(15),
        alignItems: 'center',
        fontSize: fontSize(15),
    },
    line_indicator: {
        height: 1,
        // marginTop: 15
    },
    view_icon_group: {
        flexDirection: 'row',
        paddingLeft: scale(15),
        paddingRight: scale(15),
        justifyContent: 'center',
        alignItems: 'center',
        height: scale(50),
    },
    icon_heart: {
        width: 23,
        height: 23,
        resizeMode: 'contain',
        marginRight: 3
    },
    txt_number: {
        fontSize: fontSize(15)
    },
    view_line_vertical: {
        backgroundColor: '#E0E0E0',
        height: 1,
        marginLeft: 10,
        marginRight: 10
    }
});