import React from 'react';
import { View, FlatList,StyleSheet } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import GroupAddMemberItem from '../Items/GroupAddMemberItem';


export default class ListViewMemberItem extends BaseComponent {
    constructor(props) {
        super(props);
        this.onLoadMoreData = this.onLoadMoreData.bind(this);
        this.state = {
            dataSource: [],
        }
    }

    onLoadMoreData() {
        let { onLoadMoreData } = this.props;
        if (onLoadMoreData) {
            onLoadMoreData();
        }
    }

    onMemberItemPress(item) {
        let { onMemberItemPress } = this.props;
        if (onMemberItemPress) {
            onMemberItemPress(item);
        }
    }

    showLoading() {
        if (this.internalLoading) {
            this.internalLoading.showLoading();
        }
    }

    hideLoading() {
        if (this.internalLoading) {
            this.internalLoading.hideLoading();
        }
    }

    setFillData(list){
        console.log('........................... list : ',list);
        if(list){
            this.setState({
                dataSource : list
            });
        }
    }

    render() {
        let{dataSource} = this.state;
        return (
            <View style={{ flex : 1, backgroundColor: 'white' }} >
                <FlatList
                    data={dataSource}
                    onEndReached={this.onLoadMoreData}
                    onEndReachedThreshold={0.2}
                    keyboardShouldPersistTaps='always'
                    ItemSeparatorComponent={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                    enableEmptySections={true}
                    // keyExtractor={item => item.id}
                    renderItem={({ item }) =>
                        <GroupAddMemberItem
                            player={item}
                            onMemberItemPress={this.onMemberItemPress.bind(this, item)} />
                    }
                />
                {this.renderInternalLoading()}
            </View>
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