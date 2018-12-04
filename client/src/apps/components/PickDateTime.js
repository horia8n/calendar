import React, {Component} from 'react';
import PickDate from './PickDate';
import PickTime from './PickTime';
import './PickDateTime.css';

class PickDateTime extends Component {

    constructor() {
        super();
        this.state = {
            show: false,
            date: null,
            partDate: null,
            partTime: null
        };
    }

    componentWillMount() {
        const date = new Date(this.props.date)
        this.setState({date, partDate: date, partTime: date});
    }

    setDate = async (part, val) => {
        this.state['part' + part] = val;
        this.state.date = new Date(this.state.partDate.getFullYear(), this.state.partDate.getMonth(), this.state.partDate.getDate(), this.state.partTime.getHours(), this.state.partTime.getMinutes(), this.state.partTime.getSeconds())
        await this.setState(this.state);

        this.props.handleChange({target: {name: 'date', value: this.state.date.toISOString()}})
    };

    render() {
        return (
            <div className="divDateTimeRelative">
                <input
                    type="text" name="date" value={new Date(this.props.date)}
                    onFocus={() => {
                        this.setState({show: true})
                    }}
                    // onBlur={() => {this.setState({show:false})}}
                    onChange={this.handleChange}
                />
                {this.state.show &&
                <div className="pickDateTime">
                    <PickDate date={this.state.partDate} setDate={this.setDate}/>
                    <PickTime date={this.state.partTime} setDate={this.setDate}/>
                </div>
                }
            </div>
        );
    }

}

export default PickDateTime;