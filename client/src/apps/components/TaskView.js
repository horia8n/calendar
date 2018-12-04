import React, {Component} from 'react';
import './TaskView.css';
import axios from 'axios';
import PickDateTime from './PickDateTime';

const keys = require('../../config/keys');

class TaskView extends Component {

    constructor() {
        super();
        this.state = {
            editedTask: null
        };
    }

    componentWillMount() {
        this.setState({editedTask: this.props.editedTask});
    }

    handleChange = ({target}) => {
        const state = this.state;
        state.editedTask.task[target.name] = target.value;
        this.setState({editedTask: state.editedTask});
    };

    handleDone = async (editedTask, done) => {
        return await axios.put(`${keys.backEndUrl}/tasks/${editedTask.task.id}`, {completed: done})
            .then(result => result.data)
            .then(returnedData => {
                console.log('returnedData', returnedData);
                console.log('this.props', this.props);
                this.props.arangeTasks(returnedData);
                this.props.switchView('dayview');
            })
            .catch(err => {
                console.log(err)
            });
    };

    handleUpdate = async (editedTask, task) => {
        console.log('handleUpdate()');
        console.log('editedTask', editedTask.task);
        return await axios.put(`${keys.backEndUrl}/tasks/${editedTask.task.id}`, editedTask.task)
            .then(result => result.data)
            .then(returnedData => {
                console.log('returnedData', returnedData);
                console.log('this.props', this.props);
                this.props.arangeTasks(returnedData);
                this.props.switchView('dayview');
            })
            .catch(err => {
                console.log(err)
            });
    };

    handleInsert = async (editedTask, task) => {
        console.log('handleInsert()');
        console.log('editedTask', editedTask.task);
        return await axios.post(`${keys.backEndUrl}/tasks/insert`, editedTask.task)
            .then(result => result.data)
            .then(returnedData => {
                console.log('returnedData', returnedData);
                console.log('this.props', this.props);
                this.props.arangeTasks(returnedData);
                this.props.switchView('dayview');
            })
            .catch(err => {
                console.log(err)
            });
    };

    handleDelete = async (id) => {
        console.log('handleDelete', id);
        return await axios.delete(`${keys.backEndUrl}/tasks/${id}`)
            .then(result => result.data)
            .then(returnedData => {
                console.log('returnedData', returnedData);
                this.props.arangeTasks(returnedData);
                this.props.switchView('dayview');
            })
            .catch(err => {
                console.log(err)
            });
    };

    handleCancel = () => {
        console.log('handleCancel');
        this.props.switchView('dayview');
    };

    pgFormatDate = (date) => {
        function zeroPad(d) {
            return ("0" + d).slice(-2)
        }

        const parsed = new Date(date);
        return [parsed.getUTCFullYear(), zeroPad(parsed.getMonth() + 1), zeroPad(parsed.getDate()), zeroPad(parsed.getHours()), zeroPad(parsed.getMinutes()), zeroPad(parsed.getSeconds())].join(" ");
    };

    //------------------------------------------------------- Render

    renderButtons = () => {
        if (this.props.editedTask.task.id === 'insert') {
            return (
                <div className="controls">
                    <div className="button" onClick={() => this.handleCancel()}>← Go Back</div>
                    <div className="button"
                         onClick={() => this.handleInsert(this.state.editedTask, this.state.editedTask.task)}>
                        Save
                    </div>
                </div>
            );
        }
        return (
            <div className="controls">
                <div className="button" onClick={() => this.handleCancel()}>← Go Back</div>
                <div className="button"
                     onClick={() => this.handleDone(this.state.editedTask, !this.state.editedTask.task.completed)}>
                    {this.state.editedTask.task.completed ? '☐ Undo' : '✓ Done'}
                </div>
                <div className="button"
                     onClick={() => this.handleUpdate(this.state.editedTask, this.state.editedTask.task)}>
                    Update
                </div>
                <div className="button" onClick={() => this.handleDelete(this.state.editedTask.taskIndex)}>Delete</div>
            </div>
        );
    };

    render() {
        return (
            <div className="dispModalTask">
                <div className="topWindow">
                    <h3>Task</h3>
                </div>
                {this.renderButtons()}

                <div className="taskWrapper">
                    <div className="taskDiv">
                        <label htmlFor="name">Title</label>
                        <input
                            type="text" name="name" className="name" value={this.state.editedTask.task.name}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="taskDiv">
                        <label htmlFor="description">Description</label>
                        <textarea
                            type="text" name="description" value={this.state.editedTask.task.description}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="taskDiv">
                        <label htmlFor="location">Location</label>
                        <input
                            type="text" name="location" value={this.state.editedTask.task.location}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="taskDiv">
                        <label htmlFor="date">Date</label>
                        <PickDateTime date={this.state.editedTask.task.date} handleChange={this.handleChange}/>
                    </div>
                </div>
            </div>
        );
    }

}

export default TaskView;