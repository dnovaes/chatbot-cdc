var db = require('../config/db.js');

//constant of voting to be considerated a potencial valid claim
const CONST_VOTES_TOTAL = 3;

exports.create = function(req, res) {
  var keywords = req.body.keywords;
  var article_number = req.body.article_number;

  db.getConnection(function(err, connection) {
    connection.query("INSERT INTO historical_learning (keywords, article_number) VALUES ('" + keywords + "', '" + article_number + "')", function(err, results) {
      connection.release();

      req.session.currclaimid = results.insertId;

      console.log("session before");
      console.log(req.session);

      req.session.save();
    });
  });

  res.sendStatus(200);
}

/*
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `keywords` text COLLATE utf8_unicode_ci NOT NULL,
 `article_number` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
 `vote_positive` int(11) DEFAULT 0,
 `vote_negative` int(11) DEFAULT 0,
 `historical_user_id` int(11) DEFAULT NULL,
 `valid_claim` tinyint(1) DEFAULT 0,
*/

exports.voteClaim = function(req, res) {

  let claimId = req.session.currclaimid;

  let sqlSelect = "SELECT vote_positive, vote_negative FROM historical_learning WHERE id = " + claimId;

  db.getConnection(function(err, connection) {
    connection.query(sqlSelect, function(err, results) {

      connection.release();

      if(err) {
        req.session.sessionFlash = {
          type: "danger",
          message: 'Um erro inesperado ocorreu. Favor tentar novamente.'
        }
        res.redirect('/');

      }else{
        let votes_positive = results[0].vote_positive;
        let votes_negative = results[0].vote_negative;

        if(req.body.voting == '+'){
          votes_positive = results[0].vote_positive + 1;
          console.log(votes_positive);

          let sqlUpdate = "UPDATE historical_learning SET `vote_positive`= "+ votes_positive + " WHERE `id` = "+ claimId;

          db.getConnection(function(err, connection) {
            connection.query(sqlUpdate, function(err, results) {
              if(err){
                console.log(err);
              }else{
                console.log(results);
              }
              connection.release();
            });
          });
        }else{
          votes_negative = results[0].vote_negative + 1;
          let sqlUpdate = "UPDATE historical_learning SET `vote_negative`= "+ votes_negative+ " WHERE `id`= "+ claimId;

          db.getConnection(function(err, connection) {
            connection.query(sqlUpdate, function(err, results) {
              connection.release();
            });
          });
        }

        //update claim_valid field
        if(votes_positive+votes_negative > CONST_VOTES_TOTAL){
          if(votes_positive > votes_negative){
            let sqlUpdate = "UPDATE `historical_learning` SET `valid_claim`= 1 WHERE `id`= "+ claimId;

            db.getConnection(function(err, connection) {
              connection.query(sqlUpdate, function(err, results) {
                connection.release();
              });
            });
          }else{

            let sqlUpdate = "UPDATE `historical_learning` SET `valid_claim`= 0 WHERE `id`= "+ claimId;

            db.getConnection(function(err, connection) {
              connection.query(sqlUpdate, function(err, results) {
                connection.release();
              });
            });
          }
        }
      }
    });
  });
  delete req.session.currclaimid;
  res.sendStatus(200);
}
