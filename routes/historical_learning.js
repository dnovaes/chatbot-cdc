var db = require('../config/db.js');

exports.create = function(req, res) {
  var keywords = req.body.keywords;
  var article_number = req.body.article_number;

  db.getConnection(function(err, connection) {
    connection.query("INSERT INTO historical_learning (keywords, article_number) VALUES ('" + keywords + "', '" + article_number + "')", function(err, results) {
      connection.release();
    });
  });

  res.sendStatus(200);
}