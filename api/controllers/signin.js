const jwt = require('jsonwebtoken');

const handleSignin = async (pgClient, bcrypt, req, res) => {
    console.log('---------------------------- handleSignin()');
    const {email, password} = req.body;
    console.log('email', email);
    console.log('password', password);
    if (!email || !password) {
        return Promise.reject('incorrect form submission');
    }
    // console.log('pgClient', pgClient);
    return pgClient.query(`SELECT email, hash FROM login WHERE email = '${email}'`)
        .then(result => {
            console.log('result', result);
            return result.rows;
        })
        .then(data => {
            console.log('data', data);
            console.log('password', password);
            const isValid = bcrypt.compareSync(password, data[0].hash);
            console.log('isValid', isValid);
            if (isValid) {
                return pgClient.query(`SELECT * FROM users WHERE email = '${email}'`)
                    .then(result => result.rows)
                    .then(user => {
                        console.log('user', user);
                        return user[0];
                    })
                    .catch(err => Promise.reject('unable to get user'))
            } else {
                Promise.reject('wrong credentials1')
            }
        })
        .catch(err => Promise.reject('wrong credentials2'));
};

const getAuthTokenId = (pgClient, req, res) => {
    console.log('---------------------------- getAuthTokenId()');
    const {authorization} = req.headers;
    console.log('authorization ', authorization);
    pgClient.query(`SELECT id FROM auth WHERE token = '${authorization}'`)
        .then(result => result.rows)
        .then(data => {
            console.log('db select data', data[0].id);
            res.json({id: data[0].id});
        })
        .catch(err => {
                res.status(400).json('Unauthorized');
            }
        );
};

const signToken = (email) => {
    // console.log('signToken');
    const jwtPayload = {email};
    return jwt.sign(jwtPayload, 'JWT_SECRET', {expiresIn: '2 days'});
};

const setToken = async (pgClient, token, id) => {
    console.log('---------------------------- setToken');
    console.log('id', id);
    console.log('token', token);
    const setToke = await
        pgClient.query(`SELECT * FROM auth WHERE token = '${token}'`)
            .then(result => result.rows)
            .then(async data => {
                if(data.length){
                    console.log('auth key exists');
                    return await pgClient.query(`UPDATE auth SET id = '${id}' WHERE token = '${token}'`)
                        .then(() => true);
                }else{
                    console.log('auth inserting', id);
                    return await pgClient.query(`INSERT INTO auth (id, token) VALUES ('${id}', '${token}')`)
                        .then(() => true);
                }
            })
            .catch(err => {
                console.log('err', err);
            });
    console.log('setToke', setToke);
    return setToke;
    // return Promise.resolve(setToke);
    // return Promise.resolve(redisClient.set(token, id))
};

const createSessions = (pgClient, user) => {
    console.log('---------------------------- createSessions()');
    const {email, id} = user;
    const token = signToken(email);
    console.log('id', id);
    console.log('email', email);
    console.log('token', token);
    return setToken(pgClient, token, id)
        .then((data) => {
            console.log('setToken Returned', data);
            return {success: 'true', userId: id, token}
        })
        .catch(console.log);
};

const signinAuthentication = (pgClient, bcrypt) => (req, res) => {
    console.log('---------------------------- signinAuthentication()');
    const {authorization} = req.headers;
    console.log('authorization', authorization);
    return authorization ?
        getAuthTokenId(pgClient, req, res) :
        handleSignin(pgClient, bcrypt, req, res)
            .then(data => {
                console.log('signinAuthentication back data', data);
                return data.id && data.email ?
                    createSessions(pgClient, data) :
                    Promise.reject(data);
            })
            .then(session => {
                console.log('after createSessions');
                console.log('session', session);
                return res.json(session)
            })
            .catch(err => res.status(400).json(err));
};

module.exports = {
    signinAuthentication: signinAuthentication
};

