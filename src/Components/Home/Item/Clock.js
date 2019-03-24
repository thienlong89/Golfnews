import React from 'react';
import { Text } from 'react-native';
import BaseComponent from '../../../Core/View/BaseComponent';
import { fontSize, scale } from '../../../Config/RatioScale';

let obj_dequy = {
    "1": {
        "digit": "1",
        "text": "",
        "voice": "",
        "parent_key": 0,
        "childs": {
            "1": {
                "digit": "1",
                "text": "",
                "voice": "",
                "parent_key": 1,
                "childs": {}
            },
            "2": {
                "digit": "2",
                "text": "",
                "voice": "",
                "parent_key": 1,
                "childs": {}
            }
        }
    },
    "2": {
        "digit": "1",
        "text": "",
        "voice": "",
        "parent_key": 0,
        "childs": {
            "1": {
                "digit": "1",
                "text": "",
                "voice": "",
                "parent_key": 2,
                "childs": {}
            },
            "2": {
                "digit": "2",
                "text": "",
                "voice": "",
                "parent_key": 2,
                "childs": {}
            }
        }
    }
}

const listObj = [];

/**
 * Hàm này chỉ push obj thỏa mãn vào list
 * @param {Object} obj 
 */
function pushToList(obj) {
    //neu chi muon luu object và nội dung của obj thì bỏ quả key 'childs';
    let o = {
        "digit": obj.digit,
        "text": obj.text,
        "voice": obj.voice,
        "parent_key": obj.parent_key,
    }
    listObj.push(o);
}

/**
 * Hàm tìm đệ quy
 * @param {Object} obj 
 */
function dequy(obj) {
    let childs = obj.hasOwnProperty('childs') ? obj['childs'] : null;
    if (childs) {
        //ton tai childs la cac obj cap sau
        let keys = Object.keys(childs);
        if (!keys.length) {
            listObj.push(obj);
            return;
        }
        for (let key of keys) {
            let _o = childs[key];
            dequy(_o);
        }
    } else {
        //check thằng cha to nhat
        let keys = Object.keys(obj);
        if (!keys.length) {
            pushToList(obj)
            return;
        }
        for (let key of keys) {
            let _o = obj[key];
            //push thang cha to nhất ngoài cùng do những thằng này không cần dequy
            pushToList(_o);
            dequy(_o);
        }
    }

}

function startDeqy() {
    dequy(obj_dequy);
    console.log('..................... list dequy : ', listObj);
    //vi du tim kiem cac obj co parent_key = 0;
    //sau khi push vao mang thi tien hanh filter trong mang
    let o = listObj.filter(d => d.parent_key === 0);
    console.log('mang obj thoa man : ', o);
}

//startDeqy();

/**
 * Đồng hồ đếm ngược để tính handicap
 */
export default class Clock extends BaseComponent {
    constructor(props) {
        super(props);
        this.time = 1000;//tinh bang giay
        this.hours = 10;
        this.minutes = 30;
        this.seconds = 50;
        this.state = {
            time: this.getFormatTime()
        }
    }

    getFormatTime() {
        return `${this.formatInt(this.hours)}:${this.formatInt(this.minutes)}:${this.formatInt(this.seconds)} `;
    }

    componentDidMount() {
        this.formatClock();
    }

    componentWillUnmount() {
        if (this.refreshIntervalId) clearInterval(this.refreshIntervalId)
    }

    startClock() {
        this.refreshIntervalId = setInterval(() => {
            this.seconds--;
            if (this.seconds <= 0) {
                this.seconds = 59;
                this.minutes--;
                if (this.minutes <= 0) {
                    this.minutes = 59;
                    this.hours--;
                    this.hours = this.hours <= 0 ? 0 : this.hours;
                    if (this.hours <= 0 && this.minutes <= 0 && this.seconds <= 0) {
                        //stop clock
                        clearInterval(this.refreshIntervalId);
                    }
                }
            }
            this.setState({
                time: this.getFormatTime()
            });
        }, 1000);
    }

    /**
     * format để hiển thị tgian
     * @param {Number} n
     */
    formatInt(n){
        return n < 10 ? '0'+n : n.toString();
    }

    /**
     * format time theo định dạng giờ : phút : giây
     */
    formatClock() {
        let date = new Date();
        let day = date.getDate();
        if (day >= 1 && day <= 16) {
            //nếu nó ở đâu tháng
            let time_end = 16 * 24 * 60 * 60;//quy ra seconds
            let time_start = day * 24 * 60 * 60 + date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds();
            let time_delta = time_end - time_start;//thời gian đếm ngược
            this.hours = parseInt(time_delta / (3600));
            let h_m = time_delta % 3600;
            this.minutes = parseInt(h_m / 60);
            this.seconds = h_m % 60;
            let txt_time = this.getFormatTime();
            this.setState({
                time: txt_time
            });
            //kick hoat dong hồ
            this.startClock();
        } else {
            let countDate = this.getAppUtil().getDaysInThisMonth();
            console.log('so ngay thang nay la : ', countDate,day);
            let time_end = (countDate+1) * 24 * 60 * 60;//quy ra seconds
            let time_start = day * 24 * 60 * 60 + date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds();
            let time_delta = time_end - time_start;//thời gian đếm ngược
            this.hours = parseInt(time_delta / (3600));
            let h_m = time_delta % 3600;
            this.minutes = parseInt(h_m / 60);
            this.seconds = h_m % 60;
            let txt_time = this.getFormatTime();
            this.setState({
                time: txt_time
            });
            this.startClock();
        }
    }

    render() {
        let { style } = this.props;
        let { time } = this.state;
        return (
            <Text style={style} allowFontScaling={global.isScaleFont}>
                {time}
                <Text allowFontScaling={global.isScaleFont} style={{ fontSize: fontSize(10, -scale(4)) }}>{'▼'}</Text>
            </Text>
        );
    }
}