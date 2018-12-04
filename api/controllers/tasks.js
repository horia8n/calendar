const {Pool} = require('pg');
const keys = require('../config/keys');
const table = 'tasks';

const pgClient = new Pool(keys.pgConnection);
pgClient.on('error', () => console.log('Lost PG connection'));

class postgres_pg_Model {
    static async getAll() {
        console.log('getAll');
        return await pgClient.query(`SELECT * FROM ${table} ORDER BY date ASC`)
            .then(result => result.rows)
            .catch(err => err);
    }

    static async getOne(id) {
        return await pgClient.query(`SELECT * FROM ${table} WHERE id = '${id}'`)
            .then(result => result.rows[0])
            .catch(err => err);
    }

    static async insert(row) {
        const rowNamesArr = [];
        const rowValuesArr = [];
        Object.keys(row).forEach((element) => {
            if (element !== 'id') {
                rowNamesArr.push(element);
                rowValuesArr.push(row[element]);
            }
        });
        const rowNames = rowNamesArr.join(", ");
        const rowValues = "'" + rowValuesArr.join("', '") + "'";
        let query = `INSERT INTO ${table} (${rowNames}) VALUES (${rowValues}) RETURNING id`;
        query = query.replace(/'null'/g, "NULL");
        console.log('query', query);
        return await pgClient.query(query)
            .then(async result => {
                return await this.getAll();
            })
            .catch(err => err);
    }

    static async update(id, row) {
        const rowArr = [];
        Object.keys(row).forEach((element) => {
            if (element !== 'id') {
                rowArr.push(`${element} = '${row[element]}'`);
            }
        });
        let query = `UPDATE ${table} SET ${rowArr.join(", ")} WHERE id = ${id} RETURNING *`;
        query = query.replace(/'null'/g, "NULL");
        console.log('query', query);
        return await pgClient.query(query)
            .then(async result => {
                return await this.getAll();
            })
            .catch(err => err);
    }

    static async remove(id) {
        let query = `DELETE FROM ${table} WHERE id = ${id}`;
        console.log('query', query);
        return await pgClient.query(query)
            .then(async result => {
                return await this.getAll();
            })
            .catch(err => err);
    }
}

const getAllTasks = async (req, res) => {
    res.send(await postgres_pg_Model.getAll());
};
const updateOneTask = async (req, res) => {
    console.log('put /tasks/:id');
    const id = req.params.id;
    const row = req.body;
    console.log('id', id);
    console.log('row', row);
    res.send(await postgres_pg_Model.update(id, row));
};
const deleteOneTask = async (req, res) => {
    console.log('delete /tasks/:id');
    const id = req.params.id;
    console.log('id', id);
    res.send(await postgres_pg_Model.remove(id));
};
const insertOneTask = async (req, res) => {
    console.log('put /tasks/insert');
    const row = req.body;
    res.send(await postgres_pg_Model.insert(row));
};

module.exports = {
    getAllTasks,
    updateOneTask,
    deleteOneTask,
    insertOneTask
};