const mysql = require('mysql');
const Connection = require('./connection');

exports.init = function(values) {
    let method = values['method'];
    if (method == 'reset_password') {
        console.log('is_reset_password');
        return resetPassword(values);
    }
    else if (method == 'register') {
        console.log('is_register');
        return register(values);
    }
    else if (method == 'login') {
        console.log('is_login');
        return login(values);
    }
} 

var resetPassword = function(values) {
    return new Promise((resolve, reject) => {
        let connection = Connection.get();

        let value = values['value'];
        let resetBy = values['reset_by'];
        var resetByEmail = true;
        if (resetBy == 'phone_number') {
            resetByEmail = false;
        }

        connection.connect(err => {
            if (err) {
                reject(err);
            }

            var sql = 'SELECT * FROM users WHERE ' + resetBy + ' = ' + mysql.escape(value);
            connection.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                }

                let hasEmail = result.length > 0;    
                let json = {};
                if (hasEmail) {
                    console.log(`email = ${result[0].email}`);
                    json['complete'] = true;
                    json['message'] = 'We send new password to your email address.';
                }
                else {
                    json['complete'] = false;
                    if (resetByEmail) {
                        json['error_message'] = 'We do not have user with this email address.';
                    }
                    else {
                        json['error_message'] = 'We do not have user with this phone number';
                    }
                }
                resolve(json);
            });
        });
    });
}

var register = function(values) {
    return new Promise((resolve, reject) => {
        let connection = Connection.get();

        let email = values['email'];
        let password = values['password'];
        let first_name = values['first_name'];
        let last_name = values['last_name'];
        let phone_number = values['phone_number'];

        console.log('-----------------------');
        console.log(`email = ${email}`);
        console.log(`password = ${password}`);
        console.log(`first_name = ${first_name}`);
        console.log(`last_name = ${last_name}`)
        console.log(`phone_number = ${phone_number}`);
        console.log('-----------------------');

        connection.connect(err => {
            if (err) {
                reject(err);
            }

            var sql = 'SELECT * FROM users WHERE email = ' + mysql.escape(email);
            connection.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                }
            
                var alreadyExist = result.length > 0;          
                if (alreadyExist == false) {
                    sql = 'INSERT INTO users (email, password, first_name, last_name, phone_number) VALUES (' + mysql.escape(email) + ', ' + mysql.escape(password) + ', ' + mysql.escape(first_name) + ', ' + mysql.escape(last_name) + ', ' + mysql.escape(phone_number) + ')';
                    
                    connection.query(sql, (err, result) => {
                        if (err) {
                            reject(err);
                        }

                        let json = {};
                        console.log('1 record inserted');
                        json['complete'] = true;
                        json['message'] = 'Registration completed.'
                        
                        resolve(json);
                    });
                }
                else {
                    var json = {};
                    json['complete'] = false;
                    json['error_message'] = 'A user with this e-mail address already exists.';
                
                    resolve(json);
                }
            });
        });
    });
}

var login = function(values) {
    return new Promise((resolve, reject) => {
        let connection = Connection.get();
        
        let email = values['email'];
        let password = values['password'];
        console.log(`email = ${email}`);
        console.log(`password = ${password}`);

        connection.connect(err => {
            if (err) {
                reject(err);
            }

            var sql = 'SELECT * FROM users WHERE email = ' + mysql.escape(email);
            connection.query(sql, (err, result) => {
                if (err) {
                    reject(err);
                }

                var hasUser = result.length > 0;
                if (hasUser) {
                    var item = result[0];
                    var json = {};
                    if (item.password == password) {
                        json['complete'] = true;
                        json['email'] = item.email;
                        json['first_name'] = item.first_name;
                        json['last_name'] = item.last_name;
                        json['phone_number'] = item.phone_number;
                        json['id'] = item.id;
                    }
                    else {
                        json['complete'] = false;
                        json['error_message'] = 'Invalid password.'
                    }
                    resolve(json);
                }
                else {
                    var json = {};
                    json['complete'] = false;
                    json['error_message'] = 'We do not have user with this email address.'
                    resolve(json);
                }
            });
        });
    });
}