import React, { PureComponent } from 'react';
import {
    Platform,
    StyleSheet,
    View,
} from 'react-native';

export default class PaginationView extends PureComponent {

    static defaultProps = {
        listData: [0, 1, 2]
    }

    constructor(props) {
        super(props);

        this.state = {
            step: 0
        }
    }

    render() {
        let listDot = this.props.listData.map((data, index) => {
            return <View style={[{
                width: 13,
                height: 13,
                borderRadius: 7,
                marginLeft: 5,
                marginRight: 5
            }, { backgroundColor: index === this.state.step ? '#00ABA7' : '#BCBCBC' }]} />
        })
        return (
            <View style={styles.container}>
                {listDot}
            </View>
        );
    }

    setCurrentPage(current = 0) {
        this.setState({
            step: current
        })
    }


}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
    },
    view_dot: {
        width: 13,
        height: 13,
        borderRadius: 7,
        marginLeft: 7,
        marginRight: 7
    }
});