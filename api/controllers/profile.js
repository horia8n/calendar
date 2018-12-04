const handleProfileGet = (req, res, pgClient) => {
    const {id} = req.params;
    pgClient.query(`SELECT * FROM users WHERE id = '${id}'`)
        .then(result => result.rows)
        .then(user => {
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(400).json('Not found')
            }
        })
        .catch(err => res.status(400).json('error getting user'))
};

const handleProfileUpdate = (req, res, pgClient) => {
    const {id} = req.params;
    const {name, age, pet} = req.body.formInput;
    pgClient.query(`UPDATE users SET name = '${name}', age = '${age}', pet = '${pet}', WHERE id = '${id}'`)
        .then(resp => {
            if(resp){
                res.json('success');
            }else{
                res.status(400).json('Unable to update')
            }
        })
        .catch(err => res.status(400).json('Error updating users'))
};

module.exports = {
    handleProfileGet,
    handleProfileUpdate
}