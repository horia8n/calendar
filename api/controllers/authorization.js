const knex = require('knex');
const keys = require('../config/keys');
const db = knex(keys.knexConnection);
const {Pool} = require('pg');
const pgClient = new Pool(keys.pgConnection);
pgClient.on('error', () => console.log('Lost PG connection'));

const requireAuth = async (req, res, next) => {
    console.log('----------------------- requireAuth');
    const {authorization} = req.headers;
    if (!authorization) {
        return res.status(401).json('Unauthorized');
    }
    return await pgClient.query(`SELECT id FROM auth WHERE token = '${authorization}'`)
        .then(data => {
            console.log('you shell pass');
            return next();
        })
        .catch(err => {
            return res.status(401).json('Unauthorized')
        });
};

module.exports = {requireAuth: requireAuth};