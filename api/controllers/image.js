const Clarifai = require('clarifai');

//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
    apiKey: 'f526d145cbd645fbb8663824ecd716d2'
});

const handleApiCall = (req, res) => {
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {
            res.json(data);
        })
        .catch(err => res.status(400).json('unable to work with API'))
}

const handleImage = (req, res, pgClient) => {
    const { id } = req.body;
    pgClient.query(`SELECT entries FROM users WHERE id = '${id}'`)
        .then(result => result.rows[0].entries)
        .then(entries => {
            entries = entries + 1;
            pgClient.query(`UPDATE users SET entries = '${name}', age = '${age}', pet = '${pet}', WHERE id = '${id}'`)
                .then(result => {res.json(entries);})
        })
        .catch(err => res.status(400).json('unable to get entries'));

};

module.exports = {
    handleImage,
    handleApiCall
}