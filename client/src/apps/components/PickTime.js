import React, {Component} from 'react';
import './PickTime.css';

class PickTime extends Component {

    constructor() {
        super();
        this.state = {
            show: false,
            // time: this.props.time,
            hours: 0,
            minutes: 0,
            hoursDouble: '12',
            hoursString: '12',
            minutesString: '00',
            ampmString: 'am',
            contrTime: '12 : 00 am',
            returnTimeString: '00:00:00.000000',
            returnTimeArray: [0, 0, 0],
            returnTimeDate: null
        };
    }

    componentWillMount() {
        const date = this.props.date;
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const minutesString = ((minutes < 10) ? '0' : '') + minutes.toString();
        const hourTemp = {number: null, ampm: null};
        if (hours === '0') {
            hourTemp.number = '12';
            hourTemp.ampm = 'am';
        } else if (hours < 12) {
            hourTemp.number = hours;
            hourTemp.ampm = 'am';
        } else if (hours === '12') {
            hourTemp.number = '12';
            hourTemp.ampm = 'pm';
        } else {
            hourTemp.number = hours - 12;
            hourTemp.ampm = 'pm';
        }
        const ampmString = hourTemp.ampm;
        const hoursString = hourTemp.number.toString();

        this.setState({hours, minutes, hoursString, minutesString, ampmString, returnTimeDate:date});



    }

    onClick = async (timePeriod, value) => {
        this.state[timePeriod] = value;
        this.state.minutesString = (this.state.minutes < 10) ? '0' + this.state.minutes.toString() : this.state.minutes.toString();
        let hours;
        if (this.state.ampmString === 'am') {
            if (this.state.hoursString === '12') {
                hours = 0;
            } else {
                hours = parseInt(this.state.hoursString, 10);
            }
        } else {
            if (this.state.hoursString === '12') {
                hours = 12;
            } else {
                hours = parseInt(this.state.hoursString, 10) + 12;
            }
        }
        this.state.hours = hours;
        this.state.hoursDouble = (this.state.hours < 10) ? '0' + this.state.hours.toString() : this.state.hours.toString();
        const returnTimeString = this.state.hoursDouble + ':' + this.state.minutesString + ':00.000000';
        const returnTimeArray = [this.state.hours, this.state.minutes, 0];
        const contrTime = this.state.hoursString + ' : ' + this.state.minutesString + ' ' + this.state.ampmString;
        const now = new Date();
        const returnTimeDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), returnTimeArray[0], returnTimeArray[1], returnTimeArray[2]);
        await this.setState({contrTime, returnTimeString, returnTimeArray, returnTimeDate});
        this.props.setDate('Time', returnTimeDate);
    };

    getHours = () => {
        console.log('getHours', this.state.hoursString);
        const out = [];
        for (let i = 1; i <= 12; i++) {
            let pickedOrNot = '';
            console.log('getHours', this.state.hoursString);
            console.log('i.toString()', i.toString());
            if (i.toString() === this.state.hoursString) {
                pickedOrNot = ' picked';
            }
            out.push(
                <div
                    className={'pickButton' + pickedOrNot}
                    onClick={() => {
                        this.onClick('hoursString', i.toString());
                    }}
                >
                    {i.toString()}
                </div>
            );
        }
        return out;
    };

    getMinutes = () => {
        const out = [];
        for (let i = 0; i < 60; i = i + 5) {
            let pickedOrNot = '';
            if (i === this.state.minutes) {
                pickedOrNot = ' picked';
            }
            out.push(
                <div
                    className={'pickButton' + pickedOrNot}
                    onClick={() => {
                        this.onClick('minutes', i);
                    }}
                >
                    {(i < 10) ? '0' + i.toString() : i.toString()}
                </div>
            );
        }
        return out;
    };

    getAMPM = () => {
        const inArray = ['am', 'pm'];
        const out = [];
        for (let i = 0; i < inArray.length; i++) {
            let pickedOrNot = '';
            if (inArray[i] === this.state.ampmString) {
                pickedOrNot = ' picked';
            }
            out.push(
                <div
                    className={'pickButton' + pickedOrNot}
                    onClick={() => {
                        this.onClick('ampmString', inArray[i]);
                    }}
                >
                    {inArray[i]}
                </div>
            );
        }
        return out;
    };

    render() {
        return (
            <div className="pickTime">
                <div className="timeButtons">
                    <div className="periodsTitle">Hours</div>
                    <div className="hours">{this.getHours()}</div>
                    <div className="periodsTitle">Minutes</div>
                    <div className="minutes">{this.getMinutes()}</div>
                    <div className="periodsTitle">AM/PM</div>
                    <div className="ampm">{this.getAMPM()}</div>
                </div>
                {/*<button onClick={() => {*/}
                    {/*console.log('state', this.state);*/}
                {/*}}>state*/}
                {/*</button>*/}
            </div>
        );
    }

}

export default PickTime;