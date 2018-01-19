var db = require('../config/db.js');

//constant of voting to be considerated a potencial valid claim
const CONST_VOTES_TOTAL = 3;

exports.create = function(req, res) {
  let keywords = req.body.keywords;
  let article_number = req.body.article_number;

  let sqlInsert = "";
  
  if(req.session.user.id){
    sqlInsert = "INSERT INTO historical_learning (keywords, article_number, user_id) VALUES ('" + keywords + "', '" + article_number + "', '" +req.session.user.id+ "')";
  }else{
    sqlInsert = "INSERT INTO historical_learning (keywords, article_number) VALUES ('" + keywords + "', '" + article_number + "')";
  }

  db.getConnection(function(err, connection) {
    connection.query(sqlInsert, function(err, results) {
      connection.release();

      req.session.currclaimid = results.insertId;

      console.log("session before");
      console.log(req.session);

      req.session.save();
    });
  });

  res.sendStatus(200);
}

exports.voteClaim = function(req, res) {

  let claimId = 0;

  if(req.body.claimId == 0){
    //new claim registered, getting id of the claim registered by session
    claimId = req.session.currclaimid;
  }else{
    //similar claim was found
    claimId = req.body.claimId;
  }

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

          let sqlUpdate = "UPDATE historical_learning SET `vote_positive`= "+ votes_positive + " WHERE `id` = "+ claimId;

          db.getConnection(function(err, connection) {
            connection.query(sqlUpdate, function(err, results) {
              if(err){
                console.log(err);
              }else{
                console.log("Voto computado com sucesso");
                res.sendStatus(200);
                //console.log(results);
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
        console.log(`Número de votos atuais da queixa atualizada. Pos: ${votes_positive}, Neg: ${votes_negative}`);
      }
    });
  });
  delete req.session.currclaimid;
}

exports.searchMostSimilarClaim= function(req, res) {

  //console.log("this is my currently keywords:");
  //console.log(req.body.myKeywords);
  let myKeywords = req.body.myKeywords;

  db.getConnection(function(err, connection) {

    let sqlSelect = "SELECT id, keywords FROM historical_learning";
    connection.query(sqlSelect, function(err, results) {

      connection.release();

      if(err){
        req.session.sessionFlash = {
          type: "danger",
          message: 'Um erro inesperado ocorreu. Favor tentar novamente. (selectClaim)'
        }
        res.redirect('/');

      }else{
        //use the returned data from database
        //results =  array of claim. So for each claim, check the similarity (bag of words algorithm)
        //row data packet = rowdp
        
        //Checking similarity of the claim [begin]
        let objMostSimilar = {
          claimId: 0,
          ratio: 0
        }

        results.forEach(function(rowdp, i, arr){
          let cnt = 0;
          // val =  object containing id and keywords for each claims registered
          console.log(i+" id: "+rowdp.id+", keywords: "+rowdp.keywords);
          let arrkeywords = rowdp.keywords.split(",");

          //console.log("arrkeywords");
          //console.log(arrkeywords);

          //#refactor forEach to some
          myKeywords.forEach(function(val, ind){
            //console.log("comparing '"+val+"'");
            //console.log("comparing '"+val+"' in "+arrkeywords);

            if(arrkeywords.indexOf(val) > -1){
              cnt++;
            }
          });

          console.log("grau de similaridade desta queixa é de:");
          console.log("cnt: "+cnt+" arrkeywords.length: "+arrkeywords.length);
          let ratio = cnt/arrkeywords.length*100;
          console.log(ratio);
         
          if(ratio > objMostSimilar.ratio){
            objMostSimilar.claimId = rowdp.id;
            objMostSimilar.ratio = ratio;
          }

          //since the ratio more than limiar, the objective was found. a claim very well similar 
          //if(ratio > 90){ break;}
          //end
        });

        //check if similarity was too high. then do not register, instead, shows the claim to the user
        if(objMostSimilar.ratio < 90){
          //authorized to register new claim, no identical claim was found
          objMostSimilar.claimId = 0;
          objMostSimilar.ratio = 0;
        }

        console.log(objMostSimilar);
        obj = JSON.stringify(objMostSimilar);
        res.send(obj); 
      }

    });
  });

/*
  claim = { "claim" : claim, "keywords": keywords, "claimTagged": claimTagged}
  obj = JSON.stringify(claim);
  res.send(obj); 
  //or
  res.sendStatus(200);
*/

}

exports.selectClaimById = function(req, res) {

  let claimId = req.body.id
  
  let obj = {}
  db.getConnection(function(err, connection) {

    let sqlSelect = `SELECT 
                      h.id, a.art_id, a.subject, a.text, user_id, vote_positive, vote_negative 
                    FROM historical_learning AS h 
                    INNER JOIN articles AS a ON h.article_number = a.art_id
                    WHERE h.id = ${claimId}`;

    connection.query(sqlSelect, function(err, results) {

      connection.release();

      if(err){
        throw err;
      }else{
        obj = {
          id: results[0].id,
          artId: results[0].art_id,
          artSubject: results[0].subject,
          artText: results[0].text,
          votePos: results[0].vote_positive,
          voteNeg: results[0].vote_negative
        }
      }
      res.send(obj);
    });
  });
}
