import React from 'react';
import { View, TouchableWithoutFeedback,Clipboard } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import PopupShareView from './Shares/PopupShareView';
// const SCROLL_HEIGHT = 0;

export default class SharePostView extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            // translateYValue: new Animated.Value(this.props.isShowing ? SCROLL_HEIGHT : 100),
        }
        this.hide = this.hide.bind(this);
        this.copy = this.copy.bind(this);
        this.share = this.share.bind(this);
    }

    componentDidMount() {
        // if(this.refPopup){
        //     this.refPopup.show();
        // }
    }

    isShowed(){
        return this.state.show;
    }

    show(url) {
        this.url = url;
        console.log('.......................... url share : ', this.url);
        this.setState({
            show: true
        }, () => {
            setTimeout(() => {
                if (this.refPopup) {
                    this.refPopup.show();
                }
            }, 60);
        });
    }

    hide() {
        this.setState({
            show: false
        });
    }

    copy() {
        this.setState({
            show: false
        },() => {
            Clipboard.setString(this.url);
        });
    }

    share() {
        this.setState({
            show: false
        }, () => {
            this.getAppUtil().ShareUrl(this.url);
        });
    }

    render() {
        let { show } = this.state;
        if (!show) return null;
        return (
            <TouchableWithoutFeedback onPress={this.hide}>
                <View style={{
                    position: 'absolute',
                    top: 0, bottom: 0, left: 0, right: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    justifyContent: 'flex-end'
                }}>
                    <PopupShareView ref={(refPopup) => { this.refPopup = refPopup; }}
                        isShowing={false}
                        onExit={this.hide}
                        copy={this.copy}
                        share={this.share}
                    />
                </View>
            </TouchableWithoutFeedback>
        );
    }
}