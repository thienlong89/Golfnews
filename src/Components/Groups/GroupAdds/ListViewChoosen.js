import React from 'react';
import { View, ListView, StyleSheet } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import GroupAddMemberItem from '../Items/GroupAddMemberItem';
import GroupItemChoosen from '../Items/GroupItemChoosen';

export default class ListViewChoosen extends BaseComponent {
    constructor(props) {
        super(props);
        this.listMe = [
            {
                _id : this.getUserInfo().getId(),
                avatar : this.getUserInfo().getUserAvatar()
            }
        ]
        this.state = {
            dataSource: (new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })).cloneWithRows(this.listMe),
        }
        this.onRemoveItem = this.onRemoveItem.bind(this);
    }

    onRemoveItem(item) {
        let { onRemoveItem } = this.props;
        if (onRemoveItem) {
            onRemoveItem(item);
        }
    }

    setFillData(list) {
        if (list) {
            let arrays = [...list];
            let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });//.cloneWithRows([
            this.setState({
                dataSource: dataSource.cloneWithRows(arrays)
            });
        }
    }

    render() {
        let { dataSource } = this.state;
        return (
            <ListView
                ref={(flatList) => { this.flatList = flatList; }}
                style={{flex : 1}}
                dataSource={dataSource}
                onEndReachedThreshold={5}
                keyboardShouldPersistTaps='always'
                horizontal={true}
                // renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                enableEmptySections={true}
                renderRow={(rowData) =>
                    <GroupItemChoosen data={rowData} onRemoveItem={this.onRemoveItem}/>
                } />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    separator_view: {
        backgroundColor: '#D6D4D4',
        height: 1,
        marginLeft: 43
    }
});