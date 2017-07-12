let Notifications = require('../models/notifications');

exports.getAll = function(res) {
    Notifications.getAll().then(data => {
        res.status(200).send(data);
    }).catch(error => {
        console.log(`ERROR: ${error.message}`);
        res.sendStatus(503);
    });
}