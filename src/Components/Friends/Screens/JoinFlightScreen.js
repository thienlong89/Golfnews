import React from 'react';
import {
    StyleSheet,
    View,
    Image
} from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import ApiService from '../../../Networking/ApiService';
import Networking from '../../../Networking/Networking';
import Touchable from 'react-native-platform-touchable';
import EmptyDataView from '../../../Core/Common/EmptyDataView';
import LoadingView from '../../../Core/Common/LoadingView';
import ListViewJoinFlight from '../Items/ListViewJoinFlight';

import I18n from 'react-native-i18n';
require('../../../../I18n/I18n');

export default class JoinFlightScreen extends BaseComponent {


    constructor(props) {
        super(props);

    }

    static navigationOptions = () => ({
        title: I18n.t("join_flight"),
        tabBarLabel: I18n.t("join_flight"),
    });

    /**
     * ham nay duoc goi sau khi render
     */
    componentDidMount() {
        let { screenProps } = this.props;
        this.parent = screenProps.parent;

    }

    render() {
        return (
            <View style={styles.container}>
                <ListViewJoinFlight />

                <Touchable style={styles.touchable_join_flight}
                    onPress={this.onJoinFlightClick.bind(this)} >
                    <Image
                        style={styles.img_add_group}
                        source={this.getResources().ic_join_flight}
                    />
                </Touchable>
            </View>
        );
    }

    onJoinFlightClick() {
        let { screenProps } = this.props;
        screenProps.parentNavigator.navigate('create_flight_to_join')
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    touchable_join_flight: {
        width: 44,
        height: 44,
        backgroundColor: '#00ABA7',
        borderRadius: 22,
        position: 'absolute',
        right: 10,
        bottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: -3,
        },
        elevation: 4,
    },
    img_add_group: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    }

});
