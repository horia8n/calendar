import React, {Component} from 'react';
import './Profile.css';
import DayView from './DayView';
import TaskView from './TaskView';

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalview: this.props.modalview,
            modalKey: this.props.modalKey,
            editedTask: {taskIndex: null, task: null}
        };
    }

    switchView = (view, args = null) => {
        console.log('switchView view', view);
        console.log('switchView args', args);
        switch(view) {
            case 'dayview':
                this.setState({modalview: view, editedTask:{taskIndex: null, task: null}});
                break;
            case 'taskview':
                this.setState({modalview: view, editedTask:{taskIndex: args.taskIndex, task: args.task}});
                break;
            default:
                this.setState({modalview: null, editedTask:{taskIndex: null, task: null}});
        }

    };

    //------------------------------------------------------- Render

    render() {
        return (
            <div className="profile-modal">
                <article className="modalWindow">
                    {this.state.modalview === 'dayview' &&
                    <DayView
                        modalKey={this.props.modalKey}
                        tasks={this.props.tasks}
                        weather={this.props.weather}
                        toggleModal={this.props.toggleModal}
                        formatAMPM={this.props.formatAMPM}
                        renderDayWeather={this.props.renderDayWeather}
                        setMainState={this.props.setMainState}
                        switchView={this.switchView}
                        arangeTasks={this.props.arangeTasks}
                    />
                    }
                    {this.state.modalview === 'taskview' &&
                    <TaskView
                        modalKey={this.props.modalKey}
                        editedTask={this.state.editedTask}
                        switchView={this.switchView}
                        setMainState={this.props.setMainState}
                        arangeTasks={this.props.arangeTasks}
                    />
                    }
                    <div className="closeModal" onClick={this.props.toggleModal}>&#10005;</div>
                </article>
            </div>
        );
    }
}

export default Profile;