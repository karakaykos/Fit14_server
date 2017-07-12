const express = require('express');
const jwt = require('jsonwebtoken');
const PRIVATE_KEY = '012345678';

let app = express();
let authentification = require('./controllers/authentification');
let notifications = require('./controllers/notifications');
let customer = require('./controllers/customer');

app.get('/', function (req, res) {
  res.send('Hello Digital Ocean!')
})

app.get('/api/config', function (req, res) {
  console.log('config!')
  var date = Math.floor(Date.now() / 1000);
  var json = {};
  json['complete'] = true;
  json['time'] = date;
  json['api_key'] = PRIVATE_KEY;
  res.status(200).send(json);
});

app.get('/api/:token', function (req, res) {
  let token = req.params.token;
  try {
    console.log('connected!')
    let decoded = jwt.verify(token, PRIVATE_KEY);
    let values = decoded['values'];
    let method = values['method'];

    if (method == 'login' || method == 'register' || method == 'reset_password') {
      authentification.init(values, res);
    }
    else if (method == 'notifications') {
      notifications.getAll(res);
    }
    else if (method == 'customers' || method == 'add_customers') {
      customer.init(values, res);
    }
  } 
  catch(err) {
    console.log('not connected!')
    res.sendStatus(503);
  }
});

app.listen(3000, function () {
	console.log('Server is listening on port 3000!');
});
