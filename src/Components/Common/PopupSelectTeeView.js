import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ListView,
    Modal
} from 'react-native';

import MyView from '../../Core/View/MyView';
import SelectTeeView from './SelectTeeView';
import DrawerView from './DrawerView';
import {scale,verticalScale,fontSize} from '../../Config/RatioScale';

const DELAY_TIME = 500;

export default class PopupSelectTeeView extends React.Component {

    constructor(props) {
        super(props);
        this.extrasData = '';
        this.onRequestClose = this.onRequestClose.bind(this);
        this.onTeeSelected = this.onTeeSelected.bind(this);

        this.state = {
            isShowTeePopup: false,
            teeList: []
        }
    }

    render() {
        let { isShowTeePopup, teeList } = this.state;
        console.log('PopupSelectTeeView', teeList)
        return (
            <Modal animationType="none"
                transparent={true}
                visible={isShowTeePopup}
                onRequestClose={this.onRequestClose}>
                <DrawerView
                    ref={(refDrawerView) => this.refDrawerView = refDrawerView}
                    initialDrawerSize={0.6}
                    drawerBg='rgba(0,0,0,0)'
                    renderContainerView={() => <View style={{ flex: 1, backgroundColor: '#000000', opacity: 0.6 }} />}
                    renderDrawerView={() => (
                        <SelectTeeView
                            onTeeSelected={this.onTeeSelected}
                            teeList={teeList} />
                    )}
                    renderInitDrawerView={() => (<View style={{ marginTop: verticalScale(25), height: verticalScale(30), justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ height: verticalScale(7), width: scale(80), borderRadius: verticalScale(5), backgroundColor: '#FFF' }} />
                    </View>)}
                    onRequestClose={this.onRequestClose}
                />
            </Modal>
        );
    }

    setVisible(teeList = [], extrasData = '') {
        this.extrasData = extrasData;
        this.setState({
            isShowTeePopup: true,
            teeList: teeList
        }, () => {
            if (this.refDrawerView)
                this.refDrawerView.slideUp(100);
        })
    }

    onRequestClose() {
        if (this.refDrawerView)
            this.refDrawerView.slideDown();
        setTimeout(() => {
            this.setState({
                isShowTeePopup: false
            })
        }, DELAY_TIME)

    }

    async onTeeSelected(teeObject) {
        // await this.onRequestClose();
        this.setState({
            isShowTeePopup: false
        }, () => {
            if (this.props.onTeeSelected) {
                this.props.onTeeSelected(teeObject, this.extrasData);
            }
        })

    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },

});