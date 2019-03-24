import React, { Component } from 'react';
import {
    StyleSheet,
} from 'react-native';
import BaseComponent from '../../Core/View/BaseComponent';
import ParsedText from 'react-native-parsed-text';

/**
 * Hiển thị text dạng html-hiện tại hỗ trợ thẻ <b></b>
 */
export default class HtmlBoldChat extends Component {
    constructor(props) {
        super(props);
    }

    renderText(text, matching) {
        //console.log("text : ", text);
        text = text.replace('<b>', '');
        text = text.replace('</b>', '\n');
        return text;
    }

    render() {
        return (
            <ParsedText
                allowFontScaling={global.isScaleFont}
                style={this.props.style}
                // selectable={true}
                parse={
                    [
                        { pattern: /<b>(.*?)<\/b>/, style: styles.text_bold, renderText: this.renderText },
                        // { pattern: /\[(@[^:]+):([^\]]+)\]/i, style: styles.username, onPress: this.handleNamePress, renderText: this.renderText },
                        //{ pattern: /42/, style: styles.magicNumber },
                        //{ pattern: /#(\w+)/, style: styles.hashTag },
                    ]
                }
                childrenProps={{ allowFontScaling: false }}
            >
                {this.props.message}
            </ParsedText>
        );
    }
}

const styles = StyleSheet.create({
    text_bold: {
        fontWeight: 'bold',
        color : '#00aba7'
    },
});