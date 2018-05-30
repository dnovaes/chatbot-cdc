const mysql = require('mysql');
const connection = mysql.createPool({
  host: 'myhostiphere.com',
  user: 'userid',
  passowrd: 'passserial',
  database: 'databasename'
});

module.exports = connection;
