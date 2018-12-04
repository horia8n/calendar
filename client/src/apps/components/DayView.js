import React, {Component} from 'react';
import _ from 'lodash';
import './DayView.css';

class DayView extends Component {

    constructor() {
        super();
        this.state = {
            emptyOn: true
        }
    }

    //------------------------------------------------------- Data
    formatTime = (time) => {
        const timeArr = time.split(':');
        const hour = {number: null, ampm: null};
        if (timeArr[0] === '0') {
            hour.number = '12';
            hour.ampm = 'AM';
        } else if (timeArr[0] < 12) {
            hour.number = timeArr[0];
            hour.ampm = 'AM';
        } else if (timeArr[0] === '12') {
            hour.number = '12';
            hour.ampm = 'PM';
        } else {
            hour.number = timeArr[0] - 12;
            hour.ampm = 'PM';
        }
        return hour.number + ' ' + hour.ampm;
    };

    isThisDayToday = (date) => {
        const now = new Date();
        let dateDate;
        if (typeof date.getMonth !== 'function') {
            const dateArr = date.split(' ');
            dateDate = new Date(dateArr[0], dateArr[1], dateArr[2]);
        } else {
            dateDate = new Date(date);
        }
        return (now.getFullYear() === dateDate.getFullYear() && now.getMonth() === dateDate.getMonth() && now.getDate() === dateDate.getDate());
    };

    gridArray = () => {
        const now = new Date();
        const nowHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
        const dayArray = {};
        const nodateArray = []
        if (this.isThisDayToday(this.props.modalKey)) {
            _.forEach(this.props.tasks['nodate'], (task) => {
                nodateArray.push(task);
            });
        }
        for (let hour = 0; hour < 24; hour++) {
            const dispTime = this.formatTime(hour + ':0');
            const modalKeyArray = this.props.modalKey.split(' ');
            const dispTimeRealTime = new Date(modalKeyArray[0], modalKeyArray[1], modalKeyArray[2], hour);
            let timestatus = 'future';
            if (dispTimeRealTime < nowHour) {
                timestatus = 'past';
            } else if (dispTimeRealTime.getHours() === nowHour.getHours()) { // TODO add if isThisDayToday
                timestatus = 'present';
            }
            dayArray[hour] = {dispTime, timestatus, tasks: []};
        }
        if (this.props.tasks[this.props.modalKey]) {
            _.forEach(this.props.tasks[this.props.modalKey], (task, index) => {
                const taskDate = new Date(task.date);
                dayArray[taskDate.getHours()].tasks.push(task);
            });
        }
        _.forEach(dayArray, (hour, index) => {
            if (hour.timestatus === 'present') {
                console.log('nodateArray', nodateArray);
                _.forEach(nodateArray, (task) => {
                    dayArray[index].tasks.push(task);
                });
            }
        });
        return dayArray;
    };

    //------------------------------------------------------- Render
    render() {
        // console.log('this.props', this.props);
        return (
            <div className="dispModalDay">
                <div className="topWindow">
                    <h3>{this.createTitle()}</h3>
                </div>
                <div className="controls">
                    <div className="button"
                         onClick={() => this.props.switchView('taskview', {taskIndex: null, task: {id: 'insert'}})}>
                        ✚ Add Task
                    </div>
                    <div className="button" onClick={() => this.setState({emptyOn: !this.state.emptyOn})}>
                        {this.state.emptyOn ? '⚐ Show Empty Blocks' : '⚐ Hide Empty Blocks'}
                    </div>
                    {this.props.renderDayWeather(this.props.modalKey)}
                </div>
                {this.renderDay()}
            </div>
        );
    }

    createTitle = () => {
        const titleDate = new Date(this.props.modalKey);
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayPrefix = (day) => {
            if (day === 1 || day === 21 || day === 31) {
                return 'st';
            } else if (day === 2 || day === 22) {
                return 'nd';
            } else if (day === 3 || day === 23) {
                return 'rd';
            } else {
                return 'th';
            }
        };
        const title = weekDays[titleDate.getDay()] + ' ' + months[titleDate.getMonth()] + ' ' + titleDate.getDate() + dayPrefix(titleDate.getDate()) + ' ' + titleDate.getFullYear();
        // console.log('title', title);
        return title;
    };

    renderDay = () => {
        const contentArray = () => {
            const displayArray = [];
            const gridArrObj = this.gridArray();
            for (let key = 0; key < 24; key++) {
                displayArray.push(this.renderHour(gridArrObj[key], key))
            }
            return displayArray;
        };
        return (
            <div className="hoursWrapper">
                <ul className="hours">
                    {contentArray()}
                </ul>
            </div>
        );
    };

    renderHour = (hour, index) => {
        let today = '';
        if (this.isThisDayToday(this.props.modalKey)) {
            today = ' today';
        }
        // console.log('hour', hour);
        let emptyClass = '';
        if (hour.tasks.length === 0 && this.state.emptyOn) {
            emptyClass = ' empty';
        }
        return (
            <li key={index} className={'gridHour ' + hour.timestatus + emptyClass + today}>
                <div className="dispHour">{hour.dispTime}</div>
                {this.renderHourWeather(hour.dispTime)}
                {this.renderTasks(hour.tasks)}
                <div className="cl"></div>
            </li>
        );
    };

    renderTasks = (tasks) => {
        if (tasks.length === 0) {
            return null;
        }
        const contentArray = () => {
            return tasks.map((task, index) => {
                let completedIMG = '☐';
                if (task.completed) {
                    completedIMG = '✓';
                }
                if (task.autocompletion) {
                    completedIMG = '◷';
                }
                return (
                    <tr key={index} onClick={() => this.props.switchView('taskview', {taskIndex: task.id, task})}>
                        <td className="completed"><span>{completedIMG}</span></td>
                        <td className="time">{this.props.formatAMPM(task.date)}</td>
                        <td className="name">{task.name}</td>
                    </tr>
                );
            });
        };
        return (
            <table className="tasks">
                <tbody>
                {contentArray()}
                </tbody>
            </table>
        );
    };

    renderHourWeather = (key) => {
        if (typeof this.props.weather === 'undefined' || typeof this.props.weather.hour === 'undefined' || typeof this.props.weather.hour[key] === 'undefined') {
            return null;
        }
        const contentArray = () => {
            return (
                <tr>
                    <td className="temp">{this.props.weather.hour[key].temp}° ( {this.props.weather.hour[key].feels}°
                        )
                    </td>
                    <td className="icon">
                        <img
                            alt=""
                            src={`https://s1.twnmm.com/images/en_ca/icons/wxicons_medium/${this.props.weather.hour[key].icon}.png`}
                        />
                    </td>
                </tr>
            );
        };
        return (
            <table className="weather">
                <tbody>
                {contentArray()}
                </tbody>
            </table>
        );
    };
}

export default DayView;