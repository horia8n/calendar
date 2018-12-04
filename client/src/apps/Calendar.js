import React, {Component} from 'react';
import axios from 'axios';
import _ from 'lodash';
import './Calendar.css';
import Modal from './components/Modal';
import Profile from './components/Profile';
import Clock from './components/Clock';

const keys = require('../config/keys');

class Calendar extends Component {

    constructor() {
        super();
        const now = new Date();
        this.state = {
            displayedMonth: now,
            tasks: [],
            weather: [],
            modalVisible: false,
            modalType: '',
            modalKey: ''
        };
    }

    //------------------------------------------------------- Data

    componentDidMount() {
        console.log('keys', keys);
        this.timer();
    }

    timer = () => {
        this.getTasks();
        this.getWeather();
        const that = this;
        setTimeout(() => {
            that.timer();
        }, 10000);
    };

    getTasks = async () => {
        return await axios.get(`${keys.backEndUrl}/tasks`)
            .then(result => result.data)
            .then(data => {
                this.arangeTasks(data);
            });
    };

    arangeTasks = (data) => {
        console.log('arangeTasks()');
        console.log(data);
        const tasks = [];
        data.forEach((task, index) => {
            let key;
            if (task.date === null) {
                key = 'nodate';
            } else {
                const date = new Date(task.date);
                key = date.getFullYear() + ' ' + date.getMonth() + ' ' + date.getDate();
            }
            if (typeof tasks[key] === 'undefined') {
                tasks[key] = {};
            }
            tasks[key][task.id] = task;
        });
        console.log('tasks', tasks);
        this.setState({tasks});

    }

    // dateStringtoDate = (str) => {
    //     // console.log('dateStringtoDate');
    //     // console.log('str', str);
    //     str = str.substr(0, str.length-1);
    //     // console.log('str', str);
    //     const arrDateTime = str.split('T');
    //     const arrDate = arrDateTime[0].split('-');
    //     const arrTime = arrDateTime[1].split(':');
    //     return new Date(parseInt(arrDate[0], 10), parseInt(arrDate[1], 10),  parseInt(arrDate[2], 10), parseInt(arrTime[0], 10), parseInt(arrTime[1], 10),  parseInt(arrTime[2], 10), );
    // };

    getWeather = async () => {
        return await axios.get('https://www.theweathernetwork.com/api/data/caon7718/hourly/cm?ts=1732')
            .then(result => result.data)
            .then(data => {
                // console.log('weather raw data', data);
                const weather = [];
                data.fourteendays.periods.forEach((dayData, index) => {
                    const date = new Date(dayData.tsl);
                    const key = date.getFullYear() + ' ' + date.getMonth() + ' ' + date.getDate();
                    weather[key] = {min: dayData.tmic, max: dayData.tmac, icon: dayData.icon};
                });

                const now = new Date();
                const todayKey = now.getFullYear() + ' ' + now.getMonth() + ' ' + now.getDate();
                weather[todayKey] = {temp: data.obs.tc, feels: data.obs.fc, icon: data.obs.icon};
                data.hourly.periods.forEach((hourData, index) => {
                    const date = new Date(parseInt(hourData.tsg, 10));
                    const key = date.getFullYear() + ' ' + date.getMonth() + ' ' + date.getDate();
                    // console.log(key);
                    // console.log(hourlyByDay[key]);
                    if (typeof weather[key] === 'undefined') {
                        weather[key] = {};
                    }
                    const hourKey = hourData.hour.toUpperCase();

                    if (typeof weather[key].hour === 'undefined') {
                        weather[key].hour = {};
                    }
                    weather[key].hour[hourKey] = {temp: hourData.tc, feels: hourData.fc, icon: hourData.icon};
                    // weather[key] = {min: dayData.tmic, max: dayData.tmac, icon: dayData.icon, hour:[]};
                });
                // console.log('weather', weather);
                this.setState({weather});
            });
    };

    gridArray = (date) => {
        const now = new Date();
        const firstDayDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDayDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const firstWeekDayOfMonth = firstDayDate.getDay();
        const previousMonth = date.getMonth() === 0 ? 11 : date.getMonth() - 1;
        const previousMonthLastDayDate = new Date(date.getFullYear(), previousMonth + 1, 0);
        const previousMonthLastDay = previousMonthLastDayDate.getDate();
        const previousMonthLastDayWeekDay = previousMonthLastDayDate.getDay();
        const nextMonth = date.getMonth() === 11 ? 0 : date.getMonth() + 1;
        const arrayMonth = [];
        let cell = 0;
        let dayOfMonth = 0;
        let gridRowLimit = 5;
        if (lastDayDate.getDate() + firstWeekDayOfMonth > 34) {
            gridRowLimit = 6;
        }
        for (let gridRow = 0; gridRow < gridRowLimit; gridRow++) {
            let arrayWeek = [];
            for (let gridColumn = 0; gridColumn < 7; gridColumn++) {
                if (cell < firstWeekDayOfMonth) {                   // fill visible part of previous month
                    const prevMonthDay = previousMonthLastDay - previousMonthLastDayWeekDay + gridColumn;
                    const prevMonthDayDate = new Date(previousMonthLastDayDate.getFullYear(), previousMonthLastDayDate.getMonth(), prevMonthDay);
                    arrayWeek.push({
                        dayOfMonth: prevMonthDay,
                        visible: false,
                        date: prevMonthDayDate,
                        timestatus: 'past'
                    });
                }                                                   // fill visible part of next month
                else if (dayOfMonth >= lastDayDate.getDate()) {
                    const nextMonthDay = cell - dayOfMonth - firstWeekDayOfMonth + 1;
                    const nextMonthDayDate = new Date(date.getFullYear(), nextMonth, nextMonthDay);
                    arrayWeek.push({
                        dayOfMonth: nextMonthDay,
                        visible: false,
                        date: nextMonthDayDate,
                        timestatus: 'future'
                    });
                }
                else {                                              // fill this month
                    dayOfMonth++;
                    const thisMonthDayDate = new Date(date.getFullYear(), date.getMonth(), dayOfMonth);
                    if (this.isThisDayToday(thisMonthDayDate)) {
                        arrayWeek.push({dayOfMonth, visible: true, date: thisMonthDayDate, timestatus: 'present'});
                    } else if (thisMonthDayDate < now) {
                        arrayWeek.push({dayOfMonth, visible: true, date: thisMonthDayDate, timestatus: 'past'});
                    } else {
                        arrayWeek.push({dayOfMonth, visible: true, date: thisMonthDayDate, timestatus: 'future'});
                    }
                }
                cell++;
            }
            arrayMonth.push(arrayWeek);
        }
        return arrayMonth;
    };

    toggleModal = () => {
        this.setState(prevState => ({
            ...prevState,
            modalVisible: !prevState.modalVisible
        }));
    };

    formatAMPM = (key) => {
        // console.log('formatAMPM key', key);
        let date;
        if (key === 'nodate' || key === null) {
            return 'Undated';
        } else {
            date = new Date(key);
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            hours = hours < 10 ? ' ' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            return hours + ':' + minutes + ' ' + ampm;
        }
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

    prepareDataFOrModalDay = () => {
        const out = {};
        if (this.isThisDayToday(this.state.modalKey)) {
            out['nodate'] = this.state.tasks['nodate'];
        }
        out[this.state.modalKey] = this.state.tasks[this.state.modalKey];
        return out;
    };

    setMainState = (cb) => {
        cb(this.state, (state) => {
            this.setState(state);
        })
    };

    monthName = (monthnumber) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[monthnumber];
    };

    weekdayName = (weekday) => {
        const months = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return months[weekday];
    };

    addMonth(date, number) {
        return new Date(date.getFullYear(), date.getMonth() + number, 1);
    }

    //------------------------------------------------------- Render

    render() {
        return this.renderCalendar();
    }

    renderCalendar = () => {
        const date = new Date();
        return (
            <div className="Calendar">
                <h1>Calendar</h1>
                <div className="controlsTop">
                    <div className="clockWrapper">
                        <Clock/>
                    </div>
                    <div className="calControl">
                        <div className="button"
                             onClick={() => this.setState({displayedMonth: this.addMonth(this.state.displayedMonth, -12)})}>
                            ❮❮
                        </div>
                        <div className="button"
                             onClick={() => this.setState({displayedMonth: this.addMonth(this.state.displayedMonth, -1)})}>
                            ❮
                        </div>
                        <div className="month_year">
                            {this.monthName(this.state.displayedMonth.getMonth()) + ' ' + this.state.displayedMonth.getFullYear()}
                        </div>
                        <div className="button"
                             onClick={() => this.setState({displayedMonth: this.addMonth(this.state.displayedMonth, 1)})}>
                            ❯
                        </div>
                        <div className="button"
                             onClick={() => this.setState({displayedMonth: this.addMonth(this.state.displayedMonth, 12)})}>
                            ❯❯
                        </div>
                    </div>
                </div>
                {this.renderMonth(this.gridArray(this.state.displayedMonth))}
                {this.state.modalVisible &&
                <Modal>
                    <Profile
                        modalKey={this.state.modalKey}
                        tasks={this.prepareDataFOrModalDay()}
                        weather={this.state.weather[this.state.modalKey]}
                        toggleModal={this.toggleModal}
                        formatAMPM={this.formatAMPM}
                        renderDayWeather={this.renderDayWeather}
                        modalview={'dayview'}
                        setMainState={this.setMainState}
                        arangeTasks={this.arangeTasks}
                    />
                </Modal>}
            </div>
        );
    };

    renderMonth = (arrayMonth) => {
        const contentArray = () => {
            let out = [];
            const now = new Date();
            for (let i = 0; i < 7; i++) {
                let today = '';
                if (i === now.getDay()) {
                    today = ' today';
                }
                out.push(<th key={i}><span className={'weekDay' + today}>{this.weekdayName(i)}</span></th>);
            }
            return out;
        };
        return (
            <table className="gridMonth">
                <thead>
                <tr>
                    {contentArray()}
                </tr>
                </thead>
                <tbody>
                {this.renderWeeks(arrayMonth)}
                </tbody>
            </table>
        );
    };

    renderWeeks = (arrayMonth) => {
        return arrayMonth.map((arrayWeek, index) => {
            return <tr key={index}>{this.renderDays(arrayWeek)}</tr>;
        });
    };

    renderDays = (arrayWeek) => {
        let today = '';
        let visible = ' visible';
        return arrayWeek.map((day, index) => {
            const key = day.date.getFullYear() + ' ' + day.date.getMonth() + ' ' + day.date.getDate();
            today = '';
            visible = ' invisible';
            if (day.visible) {
                visible = ' visible';
            }
            if (this.isThisDayToday(day.date)) {
                today = ' today';
            }
            return (
                <td key={index}>
                    <div className={'gridDay ' + day.timestatus + visible + today} onClick={() => {
                        this.setState({modalVisible: true, modalType: 'day', modalKey: key});
                    }}>
                        <div className="dispDay">{day.dayOfMonth}</div>
                        <div className="weatherWrapper">{this.renderDayWeather(key)}</div>
                        <div className="tasksWrapper">{this.renderDayTasks(key)}</div>
                    </div>
                </td>
            );
        });
    };

    renderDayTasks = (key) => {
        const contentArray = (key) => {
            if (typeof this.state.tasks[key] === 'undefined') {
                return null;
            }
            return _.map(this.state.tasks[key], (task, index) => {
                // console.log('task', task);
                let date;
                if (key === 'nodate') {
                    date = 'nodate';
                } else {
                    date = task.date;
                }

                let completedIMG = '☐';  // ▢ □ ☐
                if (task.completed) {
                    completedIMG = '✓'; // ▣ ✓ ■ ▪ ✔ ☑
                }
                if (task.autocompletion) {
                    completedIMG = '◷'; // ⧖⊞ ◷
                }
                return (
                    <tr className="task" key={index}>
                        <td className="completed"><span>{completedIMG}</span></td>
                        <td className="time">{this.formatAMPM(date)}</td>
                        <td className="name">{task.name}</td>
                    </tr>
                );
            });
        };
        return (
            <table className="tasks">
                <tbody>
                {(this.isThisDayToday(key)) ? contentArray('nodate') : null}
                {contentArray(key)}
                </tbody>
            </table>
        );
    };

    renderDayWeather = (key) => {
        if (typeof this.state.weather[key] === 'undefined') {
            return null;
        }
        const contentArray = () => {
            if (this.isThisDayToday(key)) {
                return (
                    <tr>
                        <td className="temp">{this.state.weather[key].temp}° ( {this.state.weather[key].feels}° )</td>
                        <td className="icon">
                            <img
                                alt=""
                                src={`https://s1.twnmm.com/images/en_ca/icons/wxicons_medium/${this.state.weather[key].icon}.png`}
                            />
                        </td>
                    </tr>
                );
            } else {
                return (
                    <tr>
                        <td className="temp">L: {this.state.weather[key].min}° H: {this.state.weather[key].max}°</td>
                        <td className="icon">
                            <img
                                alt=""
                                src={`https://s1.twnmm.com/images/en_ca/icons/wxicons_medium/${this.state.weather[key].icon}.png`}
                            />
                        </td>
                    </tr>
                );
            }
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

export default Calendar;