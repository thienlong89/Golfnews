import React from 'react';
import {
    Text,
} from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';

export default class TextCountComment extends BaseComponent {

    static defaultProps = {
        commentNumber: 0,
        showText: false
    }

    constructor(props) {
        super(props);
        this.state = {
            commentNumber: this.props.commentNumber,
            bold : false,
            color : this.props.style.color,
        }
    }

    updateCommentNumber(count = 0) {
        console.log('.....................update commend count ',count);
        this.setState({
            commentNumber: count
        });
    }

    setTextBold(){
        this.setState({
            bold : true,
            color : 'black'
        });
    }

    setTextNormal(){
        console.log('..................... setTextNormal : ');
        this.setState({
            bold : false,
            color : '#555555'
        });
    }

    render() {
        let { style, showText } = this.props;
        let { commentNumber,bold,color } = this.state;
        return (
            <Text allowFontScaling={global.isScaleFont} style={[style,{fontWeight : bold ? 'bold' : 'normal',color : color}]}>{commentNumber > 0 ? `${commentNumber} ${this.t('comment')}` : (showText ? this.t('comment') : '')}</Text>
        );
    }
}