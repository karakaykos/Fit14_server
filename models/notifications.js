const mysql = require('mysql');
const Connection = require('./connection');

exports.getAll = function() {
    let connection = Connection.get();

    return new Promise((resolve, reject) => {
        connection.connect(err => {
            if (err) {
                reject(err);
            }

            var sql = 'SELECT * FROM notifications';
            connection.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                }

                var json = {};
                json['complete'] = true;
                var notifications = [];
                result.forEach(function(element) {
                    var model = {}
                    model['status'] = element.status;
                    model['message'] = element.message;
                    notifications.push(model);
                }, this);
                json['notifications'] = notifications;
                resolve(json);
            });
        });
    });
} 