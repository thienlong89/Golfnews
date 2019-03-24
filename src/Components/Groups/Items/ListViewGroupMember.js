import React from 'react';
import { ListView,View } from 'react-native';
import BaseComponent from "../../../Core/View/BaseComponent";
import UserChoosen from '../GroupChoosenItem';

export default class ListViewGroupMember extends BaseComponent {
    constructor(props) {
        super(props);
        this.onLoadMoreMember = this.onLoadMoreMember.bind(this);
        this.onRemoveMember = this.onRemoveMember.bind(this);

        this.state = {
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            height : 0
        }
    }

    setFillData(listData) {
        if (listData.length) {
            let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
            this.setState({
                dataSource: dataSource.cloneWithRows(listData),
                height : 60
            });
        }else{
            this.setState({
                height : 0
            });
        }
    }

    onRemoveMember(data) {
        let { removeMemberCallback } = this.props;
        if (removeMemberCallback) {
            removeMemberCallback(data);
        }
    }

    onLoadMoreMember() {
        let { loadMoreCallback } = this.props;
        if (loadMoreCallback) {
            loadMoreCallback();
        }
    }

    render() {
        let { style, group_id } = this.props;
        let{height} = this.state;
        return (
            <View style={{height : height}}>
                <ListView style={style}
                    horizontal={true}
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    onEndReachedThreshold={5}
                    keyboardShouldPersistTaps='always'
                    onEndReached={this.onLoadMoreMember}
                    renderRow={(rowData) =>
                        <UserChoosen data={rowData}
                            group_id={group_id}
                            callbackRemoveMember={this.onRemoveMember} />
                    }
                />
            </View>
        );
    }
}