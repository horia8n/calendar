const handleRegister = (req, res, pgClient, bcrypt) => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);
    pgClient.query(`INSERT INTO login (hash, email) VALUES ('${hash}', '${email}')`)
        .then(result => {
            pgClient.query(`INSERT INTO user (email, name, joined) VALUES ('${email}', '${name}', '${new Date()}')`)
                .then(result => {
                    pgClient.query(`SELECT * FROM user WHERE email = '${email}'`)
                        .then(result => {res.json(result.rows[0]);})
                        .catch(res.status(400).json(err));
                })
                .catch(res.status(400).json(err));
        })
        .catch(res.status(400).json(err));
};

module.exports = {
    handleRegister: handleRegister
};


