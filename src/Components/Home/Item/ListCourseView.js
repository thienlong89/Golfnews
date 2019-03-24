import React from 'react';
import { ListView,StyleSheet,View } from 'react-native';
import FacilityCourseItem from '../../Facilities/FacilityCourseItem';
import Touchable from 'react-native-platform-touchable';
import { scale} from '../../../Config/RatioScale';

export default class ListCourseView extends React.Component {
    constructor() {
        super();
        this.state = {
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
        }
        this.onItemClickCallback = null;
    }

    onCourseItemClick(data,id){
        if(this.onItemClickCallback){
            this.onItemClickCallback(data);
        }
    }

    /**
     * Fill dữ liệu vào listview
     * @param {Array} list 
     */
    fillData(list){
        let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.setState({
            dataSource : dataSource.cloneWithRows(list)
        });
    }

    render() {
        let{dataSource} = this.state;
        return (
            <ListView style={styles.list_spinner}
                renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.listview_separator} />}
                dataSource={dataSource}
                enableEmptySections={true}
                keyboardShouldPersistTaps='always'
                renderRow={(rowData, sectionID, itemId) =>
                    <Touchable onPress={() => this.onCourseItemClick(rowData, itemId)}>
                        <FacilityCourseItem facilityCourseModel={rowData} />
                    </Touchable>
                }
            />
        );
    }
}

const styles = StyleSheet.create({
    list_spinner: {
        flex : 1
        // borderColor: '#C7C7C7',
        // borderWidth: 1,
        // marginLeft: scale(10),
        // marginRight: scale(10)
    },
    listview_separator: {
        flex: 1,
        height: 1,
        backgroundColor: '#E3E3E3',
    },
});