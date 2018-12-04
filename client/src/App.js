import React, {Component} from 'react';
import './App.css';
import Calendar from './apps/Calendar';

class App extends Component {

    constructor(){
        super();
        this.state = {
        };
    }

    render(){
        return (
        <div>
            <Calendar/>
        </div>
        );
    }

}

export default App;
