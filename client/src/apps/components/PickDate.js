import React, {Component} from 'react';
import './PickDate.css';

class PickDate extends Component {

    constructor() {
        super();
        const now = new Date();
        this.state = {
            show: false,
            displayedMonth: null,
            date: null,
            year: null,
            month: null,
            day:null,
            returnDateString: null,
            returnDateArray: null
        };
    }

    componentWillMount() {
        const displayedMonth = new Date(this.props.date.getFullYear(), this.props.date.getMonth(), 1);
        this.setState({date: this.props.date, displayedMonth});
    }

    monthName = (monthnumber) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[monthnumber];
    };

    weekdayName = (weekday) => {
        const months = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return months[weekday];
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

    isThisTheSameDay = (date1, date2) => {
        const now = new Date();
        let dateDate1;
        let dateDate2;
        if (typeof date1.getMonth !== 'function') {
            const dateArr1 = date1.split(' ');
            dateDate1 = new Date(dateArr1[0], dateArr1[1], dateArr1[2]);
        } else {
            dateDate1 = new Date(date1);
        }
        if (typeof date2.getMonth !== 'function') {
            const dateArr2 = date2.split(' ');
            dateDate2 = new Date(dateArr2[0], dateArr2[1], dateArr2[2]);
        } else {
            dateDate2 = new Date(date2);
        }
        return (dateDate1.getFullYear() === dateDate2.getFullYear() && dateDate1.getMonth() === dateDate2.getMonth() && dateDate1.getDate() === dateDate2.getDate());
    };

    addMonth(date, number){
        return new Date(date.getFullYear(), date.getMonth()+number, 1);
    }

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
                        timestatus: 'past',
                        picked: false
                    });
                }                                                   // fill visible part of next month
                else if (dayOfMonth >= lastDayDate.getDate()) {
                    const nextMonthDay = cell - dayOfMonth - firstWeekDayOfMonth + 1;
                    const nextMonthDayDate = new Date(date.getFullYear(), nextMonth, nextMonthDay);
                    arrayWeek.push({
                        dayOfMonth: nextMonthDay,
                        visible: false,
                        date: nextMonthDayDate,
                        timestatus: 'future',
                        picked: false
                    });
                }
                else {                                              // fill this month
                    dayOfMonth++;
                    const thisMonthDayDate = new Date(date.getFullYear(), date.getMonth(), dayOfMonth);
                    let picked = false;
                    if(this.isThisTheSameDay(thisMonthDayDate, this.state.date)){
                        picked = true;
                    }
                    if (this.isThisDayToday(thisMonthDayDate)) {
                        arrayWeek.push({dayOfMonth, visible: true, date: thisMonthDayDate, timestatus: 'present', picked});
                    } else if (thisMonthDayDate < now) {
                        arrayWeek.push({dayOfMonth, visible: true, date: thisMonthDayDate, timestatus: 'past', picked});
                    } else {
                        arrayWeek.push({dayOfMonth, visible: true, date: thisMonthDayDate, timestatus: 'future', picked});
                    }
                }
                cell++;
            }
            arrayMonth.push(arrayWeek);
        }
        return arrayMonth;
    };

    render() {
        // console.log('App state', this.state);
        return this.renderCalendar();
    }

    renderCalendar = () => {
        console.log('renderCalendar', this.state);
        if (!this.state.date) {
            return null;
        }
        const date = new Date();
        return (
            <div className="pickDate">
                <div className="controlsTop">
                    <div className="calControl">
                        <div className="button"
                             onClick={() => this.setState({displayedMonth: this.addMonth(this.state.displayedMonth, -12)})}>❮❮
                        </div>
                        <div className="button"
                             onClick={() => this.setState({displayedMonth: this.addMonth(this.state.displayedMonth, -1)})}>❮
                        </div>
                        <div className="month_year">
                            {this.monthName(this.state.displayedMonth.getMonth()) + ' ' + this.state.displayedMonth.getFullYear()}
                        </div>
                        <div className="button"
                             onClick={() => this.setState({displayedMonth: this.addMonth(this.state.displayedMonth, 1)})}>❯
                        </div>
                        <div className="button"
                             onClick={() => this.setState({displayedMonth: this.addMonth(this.state.displayedMonth, 12)})}>❯❯
                        </div>
                    </div>
                </div>
                {this.renderMonth(this.gridArray(this.state.displayedMonth))}
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
                out.push(<th><span className={'weekDay' + today}>{this.weekdayName(i)}</span></th>);
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
        let picked = '';
        return arrayWeek.map((day, index) => {
            const key = day.date.getFullYear() + ' ' + day.date.getMonth() + ' ' + day.date.getDate();
            today = '';
            visible = ' invisible';
            picked = '';
            if (day.visible) {
                visible = ' visible';
            }
            if (this.isThisDayToday(day.date)) {
                today = ' today';
            }
            if (day.picked) {
                picked = ' picked';
            }
            // console.log('day', day);
            return (
                <td key={index}>
                    <div
                        className={'gridDay ' + day.timestatus + visible + today + picked}
                        onClick={() => {this.onClick(day.dayOfMonth)}}
                    >
                        {day.dayOfMonth}
                    </div>
                </td>
            );
        });
    };

    onClick=async(dayOfMonth) => {
        await this.setState({date: new Date(this.state.date.getFullYear(), this.state.date.getMonth(), dayOfMonth)});
        this.props.setDate('Date', this.state.date);
    };
}


export default PickDate;