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
import ItemCommentView from '../Item/ItemCommentView';

export default class CommentListView extends React.Component {

    constructor(props) {
        super(props);
        this.data = [];
        this.isStartRender = true;
        this.listItemComponent = [];
        // this.state = {
        //     dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        // }
        this.onRefresh = this.onRefresh.bind(this);
    }

    renderCommentItem = ({ item }) => (
        <ItemCommentView
            ref={(itemView) => { this.refs[`comment_item_${item.createdAt}`] = itemView; }}
            data={item}
        />)

    fillData(listData) {
        if (!listData) return;
        this.data = listData;//.slice(0);
        // let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.setState({
            // dataSource: dataSource.cloneWithRows(listData)
        }, () => {
            if (this.isStartRender) {
                setTimeout(() => {
                    this.scrollEnd();
                }, 500);
            } else {
                setTimeout(() => {
                    this.scrollEnd();
                }, 100);
            }
        });
        if (this.isStartRender) this.isStartRender = false;
    }

    runAnimationRow(data) {
        let name = 'comment_item_' + data.createdAt;
        // console.log("__________________________run animation ", name);
        // let com = this.refs[name];
        // //500 miligiay thi scrol listview 1 lan khi chay  animation
        // if (com) {
        //     console.log('.............................run roi nhe');
        //     com.startAnimation(data);
        // }
    }

    stopAnimationRow(data) {
        // let name = 'comment_item_' + data.createdAt;
        // // console.log("__________________________renderRow ", name);
        // let com = this.refs[name];
        // // console.log("renderRow name : ", name);
        // if(this.interval){
        //     clearInterval(this.interval);
        // }
        // if (com) {
        //     //render item
        //     com.stopAnimation(data);
        // }
    }

    /**
     * cuon den cuoi danh sach
     */
    scrollEnd() {
        if (this.flatList)
            this.flatList.scrollToEnd({ animated: true });
    }

    onItemClick() {

    }

    onLoadMore() {

    }

    onRefresh() {
        console.log("refresh flast list.");
    }

    _keyExtractor = (item, index) => item.user.userid;

    renderRow(data) {
        let name = 'comment_item_' + data.createdAt;
        // console.log("__________________________renderRow ",name);
        let com = this.refs[name];
        // console.log("renderRow name : ",name);
        if (com) {
            //render item
            console.log("render row item");
            let data = com.props.data;
            data.send_status = true;
            com.setState({});
        }
    }

    render() {
        let data = this.data;
        return (
            <View style={styles.container}>

                <FlatList ref={(flatList) => { this.flatList = flatList; }}
                    data={data}
                    // extraData={this.state}
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
                {/* <ListView
                    ref={(flatList) => { this.flatList = flatList; }}
                    // style={styles.container_body_listview}
                    dataSource={this.state.dataSource}
                    onEndReachedThreshold={5}
                    keyboardShouldPersistTaps='always'
                    renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator_view} />}
                    onEndReached={this.onLoadMore.bind(this)}
                    enableEmptySections={true}
                    renderRow={(rowData) =>
                        <Touchable onPress={this.onItemClick.bind(this, rowData)}>
                            <ItemCommentView
                                 ref={(item)=>{this.refs[`comment_item_${rowData.createdAt}`] = item;}}
                                 data={rowData} />
                        </Touchable>
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    } */}
                {/* /> */}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listview_separator: {
        flex: 1,
        height: 1,
        backgroundColor: '#E3E3E3',
        marginLeft: 47
    },
    separator_view: {
        backgroundColor: '#fff'
    }
});