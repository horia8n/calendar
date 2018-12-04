const express = require('express');
const keys = require('./config/keys');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const morgan = require('morgan');
const auth = require('./controllers/authorization');
const tasks = require('./controllers/tasks');

const app = express();

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res)=> { res.send('calendar api') });
app.get('/tasks', (req, res) => { tasks.getAllTasks(req, res)});
app.post('/tasks/insert', (req, res) => { tasks.insertOneTask(req, res)});
app.put('/tasks/:id', (req, res) => { tasks.updateOneTask(req, res)});
app.delete('/tasks/:id', (req, res) => { tasks.deleteOneTask(req, res)});

const port = keys.nodePort;
app.listen(port, ()=> {
    console.log(`app is running on port ${port}`);
});
