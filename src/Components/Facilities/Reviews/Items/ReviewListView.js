import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ListView,
    RefreshControl
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import ReviewItem from '../Items/ReviewItem';
import { verticalScale } from '../../../../Config/RatioScale';
// import ItemCommentView from '../Item/ItemCommentView';

export default class ReviewListView extends React.Component {

    constructor(props) {
        super(props);
        this.data = [];
        this.isStartRender = true;
        this.onRefresh = this.onRefresh.bind(this);
    }

    renderCommentItem = ({ item }) => (
        <ReviewItem
            ref={(itemView)=>{this.refs[`review_item_${item.createdAt}`]=itemView;}}
            data={item}
        />)

    fillData(listData) {
        if (!listData) return;
        this.data = listData;//.slice(0);
        // let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.setState({
            // dataSource: dataSource.cloneWithRows(listData)
        }, () => {
            if(this.isStartRender){
                setTimeout(() => {
                    this.scrollEnd();
                }, 500);
            }else{
                setTimeout(() => {
                    this.scrollEnd();
                }, 100);
            }
        });
        if(this.isStartRender) this.isStartRender = false;
    }

    /**
     * cuon den cuoi danh sach
     */
    scrollEnd() {
        this.flatList.scrollToEnd();
    }

    onItemClick() {

    }

    onLoadMore() {

    }

    onRefresh() {
        console.log("refresh flast list.");
    }

    render() {
        let data = this.data;
        return (
            <View style={styles.container}>

                <FlatList ref={(flatList) => { this.flatList = flatList; }}
                    data={data}
                    // extraData={this.state}
                    style={{flex : 1}}
                    keyExtractor={this._keyExtractor}
                    renderItem={this.renderCommentItem}
                    disableVirtualization={true}
                    onEndReachedThreshold={5}
                    keyboardShouldPersistTaps={false}//'always'
                    enableEmptySections={true}
                    legacyImplementation={false}
                    // inverted
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={this.onRefresh}
                        />
                    }
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom : verticalScale(15)
    },
});