let Customer = require('../models/customer');

exports.init = function(values, res) {
    Customer.init(values).then(data => {
        res.status(200).send(data);
    }).catch(error => {
        console.log(`ERROR: ${error.message}`);
        res.sendStatus(503);
    });
}