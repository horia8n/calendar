import React, {Component} from 'react';
import './Clock.css';

class Clock extends Component {

    constructor() {
        super();
        this.state = {
            time: ''
        };
        this.separator = ':'
    }

    componentDidMount() {
        this.timer();
    }

    time24to12 = (time) => {
        const timeArr = time.split(':');
        const hour = {number: null, ampm: null};
        if (timeArr[0] === '0') {
            hour.number = '12';
            hour.ampm = 'am';
        } else if (timeArr[0] < 12) {
            hour.number = timeArr[0];
            hour.ampm = 'am';
        } else if (timeArr[0] === '12') {
            hour.number = '12';
            hour.ampm = 'pm';
        } else {
            hour.number = timeArr[0] - 12;
            hour.ampm = 'pm';
        }
        const minutes = ((parseInt(timeArr[1], 10) < 10) ? '0' : '') + timeArr[1];
        this.separator = (this.separator===':')?' ': ':';
        return hour.number + this.separator + minutes + ' ' + hour.ampm;
    };

    timer = () => {
        const now = new Date();
        this.setState({time: (this.state.clock = this.time24to12(now.getHours() + ':' + now.getMinutes()))});
        setTimeout(() => {
            this.timer()
        }, 1000);
    };

    render() {
        return (
            <div className="clock">{this.state.time}</div>
        );
    }

}

export default Clock;