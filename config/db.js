var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'us-cdbr-iron-east-05.cleardb.net',
  user     : 'b28c5f6fe6a00e',
  password : '64fac776',
  database : 'heroku_a5bee640faa3e71'
});

module.exports = connection;