import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';

const screenWidth = Dimensions.get('window').width;

export default class ClbTabView extends BaseComponent {

    static defaultProps = {

    }

    constructor(props) {
        super(props);
        this.tabLs = [this.t('introduce'), this.t('check_hdc'), this.t('discuss'), this.t('event'), this.t('photo')];
        this.state = {
            itemSelected: 0,
            topPosition: 150
        }
    }

    setPosition(topPosition = 150) {
        this.setState({
            topPosition: 150 - topPosition
        })
    }

    setTabSelected(itemSelected = 0) {
        this.setState({
            itemSelected: itemSelected
        })
    }

    render() {
        let { topPosition, itemSelected } = this.state;

        let tabLsView = this.tabLs.map((name, index) => {
            return (
                <Touchable style={[styles.touchable_tab, {}]}
                    onPress={this.onClubTabPress.bind(this, index)}>
                    <View style={styles.view_tab}>
                        <Text allowFontScaling={global.isScaleFont} style={[styles.txt_header, itemSelected === index ? { color: '#00ABA7' } : { color: '#818181' }]}>{name}</Text>
                        <View style={[styles.line, itemSelected === index ? { backgroundColor: '#00ABA7' } : { backgroundColor: 'rgba(0,0,0,0)' }]} />
                    </View>
                </Touchable>
            )
        })

        return (
            <ScrollView style={[styles.container, { top: topPosition > 0 ? topPosition : 0 }]}
                horizontal={true}>

                {tabLsView}

            </ScrollView>
        );
    }

    onClubTabPress(index) {
        this.setState({
            itemSelected: index
        }, () => {
            if (this.props.onClubTabPress) {
                this.props.onClubTabPress(index);
            }
        })
    }

}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        height: 50,
        minWidth: screenWidth,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: -3,
        },
        elevation: 4,
        zIndex: 4
    },
    txt_header: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingLeft: 10,
        paddingRight: 10
    },
    line: {
        height: 3,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    touchable_tab: {
        height: 50
    },
    view_tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50
    }
});