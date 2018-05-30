const mysql = require('mysql');
const connection = mysql.createPool({
  host: 'myhostiphere.com',
  user: 'userid',
  password: 'passserial',
  database: 'databasename'
});

module.exports = connection;
