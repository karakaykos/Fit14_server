const mysql = require('mysql');
const Connection = require('./connection');

exports.init = function(values) {
    let method = values['method'];
    if (method == 'customers') {
        console.log('is_get_customers');
        return getAllCustomers();
    }
    else if (method == 'add_customers') {
        console.log('is_add_customers');
        return addCustomer(values);
    }
} 

var getAllCustomers = function() {
    return new Promise((resolve, reject) => {
        let connection = Connection.get();

        connection.connect(err => {
            if (err) {
                reject(err);
            }

            var sql = 'SELECT * FROM customers';
            connection.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                }

                var json = {};
                json['complete'] = true;
                json['customers'] = result;
                resolve(json);
            });
        });
    });
} 

var addCustomer = function(values) {
    return new Promise((resolve, reject) => {
        let connection = Connection.get();
        
        let email = values['email'];
        let first_name = values['first_name'];
        let last_name = values['last_name'];
        let phone_number = values['phone_number'];
        let gender = values['gender'];
        let birthday_date = values['birthday_date'];
        let status = 'active';
        let register_date = Math.floor(Date.now() / 1000);

        connection.connect(err => {
            if (err) {
                reject(err);
            }

            let sql = 'INSERT INTO customers (email, first_name, last_name, phone_number, gender, birthday_date, status, register_date) VALUES (' + mysql.escape(email) + ', ' + mysql.escape(first_name) + ', ' + mysql.escape(last_name) + ', ' + mysql.escape(phone_number) + ', ' + mysql.escape(gender) + ', ' + mysql.escape(birthday_date) + ', ' + mysql.escape(status) + ', ' + mysql.escape(register_date) + ')';
            connection.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                }
                console.log('INSERTED!');
                var json = {};
                json['complete'] = true;
                json['message'] = 'New customer added.';
                resolve(json);
            });
        });
    });
}