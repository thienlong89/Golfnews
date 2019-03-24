import React from 'react';
import {
    StyleSheet,
    View,
    FlatList
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import BaseComponent from '../../../Core/View/BaseComponent';
import JoinFlightItem from './JoinFlightItem';
import JoinFlightPopup from './JoinFlightPopup';


export default class ListViewJoinFlight extends BaseComponent {
    constructor(props) {
        super(props);

        this.listData = ['row1', 'row2'];
        this.state = {
        }
    }



    render() {

        let { dataSource } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <FlatList style={styles.container_body_listview}
                    data={this.listData}
                    onEndReachedThreshold={5}
                    keyboardShouldPersistTaps='always'
                    ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                    // onEndReached={this.onLoadMore.bind(this)}
                    enableEmptySections={true}
                    renderItem={(rowData) =>
                        <Touchable onPress={this.onItemFlightPress.bind(this, rowData)}>
                            <JoinFlightItem />
                        </Touchable>

                    }
                // refreshControl={
                //     <RefreshControl
                //         refreshing={false}
                //         onRefresh={this.onRefresh.bind(this)}
                //     />
                // }
                />
                <JoinFlightPopup
                    ref={(refJoinFlightPopup) => { this.refJoinFlightPopup = refJoinFlightPopup }}
                />
                {this.renderInternalLoading()}
            </View>
        );
    }

    onItemFlightPress(flight){
        this.refJoinFlightPopup.show();
    }
}

const styles = StyleSheet.create({
    container_body_listview: {
        marginTop: 1,
        paddingBottom: 1,
        paddingLeft: 0,
        paddingRight: 0
    },
    separator_view: {
        height: 1,
        backgroundColor: '#E3E3E3'
    },

});