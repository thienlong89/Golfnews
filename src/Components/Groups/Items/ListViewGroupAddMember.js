import React from 'react';
import { Text, View, ListView } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import GroupItemAdd from '../GroupItemAdd';

export default class ListViewGroupAddMember extends BaseComponent {
    constructor(props) {
        super(props);
        this.callbackAddMember = null;
        this.group_id = '';
        this.state = {
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
        }
    }

    onAddMember(data) {
        console.log("callback item ");
        if (this.callbackAddMember) {
            this.callbackAddMember(data);
        }
    }

    setGroupId(_group_id){
        this.group_id = _group_id;
    }

    /**
     * Fill du lieu vao View
     * @param {*} listData 
     */
    setFillData(listData) {
        let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.setState({
            dataSource: dataSource.cloneWithRows(listData)
        });
    }

    showLoading(){
        if(this.internalLoading){
            this.internalLoading.showLoading();
        }
    }

    hideLoading(){
        if(this.internalLoading){
            this.internalLoading.hideLoading();
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ListView
                    style={this.props.style}
                    dataSource={this.state.dataSource}
                    renderSeparator={(sectionId, rowId) => <View key={rowId} style={this.props.style_separator_view} />}
                    enableEmptySections={true}
                    keyboardShouldPersistTaps='always'
                    renderRow={(rowData) =>
                        <GroupItemAdd
                            group_id={this.group_id}
                            callbackAddMember={this.onAddMember.bind(this, rowData)}
                            data={rowData} />
                    }
                />
                {this.renderInternalLoading()}
            </View>
        );
    }
}