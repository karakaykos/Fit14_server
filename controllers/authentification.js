let Authentification = require('../models/authentification');

exports.init = function(values, res) {
    Authentification.init(values).then(data => {
        res.status(200).send(data);
    }).catch(error => {
        console.log(`ERROR: ${error.message}`);
        res.sendStatus(503);
    });
}