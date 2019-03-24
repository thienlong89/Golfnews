import React from 'react';
import { StyleSheet, WebView, View, BackHandler, Dimensions, ScrollView, Text } from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import HeaderView from '../Common/HeaderView';
import HandicapInfoListView from './Item/HandicapInfoListView';
import HtmlBoldText from '../../Core/Common/HtmlBoldText';
import { fontSize, scale } from '../../Config/RatioScale';

let dimemsion = Dimensions.get('window');
// const screenHeight = dimemsion.height - 80;
// const screenWidth = dimemsion.width;
export default class HandicapIndexInfoView extends BaseComponent {
    constructor(props) {
        super(props);
        this.backHandle = null;
        this.height_text = 0;
        this.height_list = 0;
    }

    onBackClick() {
        let { navigation } = this.props;
        if (navigation) {
            navigation.goBack();
        }
        return true;
    }

    componentDidMount() {
        this.backHandle = BackHandler.addEventListener('hardwareBackPress', this.onBackClick.bind(this));
        if (this.headerView) {
            this.headerView.setTitle(this.t('handicap_index_info'));
            this.headerView.callbackBack = this.onBackClick.bind(this);
        }
    }

    componentWillUnmount() {
        if (this.backHandle) {
            this.backHandle.remove();
        }
    }

    onLoadStart() {
        if (this.internalLoading) {
            this.internalLoading.showLoading();
        }
    }

    onLoadEnd() {
        if (this.internalLoading) {
            this.internalLoading.hideLoading();
        }
    }

    render() {
        let text = this.getUserInfo().getUserProfile().getTextInfoHandicap();
        console.log("text 1 : ",text);
        text = text.replace(/<p>/gi, '').replace(/<\/p>/gi, '').trim();
        console.log("text 2 : ",text);
        return (
            <View style={styles.container}>
                <HeaderView ref={(headerView) => { this.headerView = headerView; }} />
                {/* <ScrollView style={{ height : (self.height_text + self.height_list),width : screenWidth}} */}
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <HtmlBoldText style={styles.msg_text}
                        message={text} />
                    {/* <Text style={styles.msg_text}
                        // onLayout={(event) => {
                        //     var { x, y, width, height } = event.nativeEvent.layout;
                        //     self.height_text = height;
                        //     console.log('height 1 : ', height);
                        // }}
                    >{text}</Text> */}
                    <View style={{ flex: 1, alignItems: 'center', borderTopColor: '#00aba7', borderTopWidth: 1 }}
                        // onLayout={(event) => {
                        //     var { x, y, width, height } = event.nativeEvent.layout;
                        //     self.height_list = height;
                        //     //self.setState({});
                        //     console.log('height 2 : ', height);
                        // }}
                    >
                        <HandicapInfoListView />
                    </View>
                </ScrollView>
            </View>
        );
    }

    // render() {
    //     return (
    //         <View style={styles.container}>
    //             <HeaderView ref={(headerView) => { this.headerView = headerView; }} />
    //                 <View style={{ flex: 1 }}>
    //                     <WebView source={{ uri: this.getUserInfo().getUserProfile().getUrlInfoHandicap(), baseUrl: '' }}
    //                         onLoadStart={this.onLoadStart.bind(this)}
    //                         onLoadEnd={this.onLoadEnd.bind(this)}
    //                         startInLoadingState={true}
    //                         style={styles.container}
    //                     />
    //                     <View style={{ height: screenHeight / 2, width: screenWidth, justifyContent: 'center', alignItems: 'center', borderTopColor: '#00aba7', borderTopWidth: 2 }}>
    //                         <HandicapInfoListView />
    //                     </View>
    //                     {this.renderInternalLoading()}
    //                 </View>
    //         </View>
    //     );
    // }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1
    },

    msg_text: {
        margin: 10,
        fontSize: fontSize(17,scale(3)),
        color: '#685d5d',
    },
});