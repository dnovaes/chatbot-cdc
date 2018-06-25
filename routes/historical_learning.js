var db = require('../config/db.js');
const functions  = require(__dirname+"/../public/js/ext_functions.js");

//constant of voting to be considerated a potencial valid claim
const CONST_VOTES_TOTAL = 3;

exports.create = function(req, res) {

  db.getConnection(function(err, connection) {

    //p.s.: connection.escape already adds single quotes closuring each variable
    let keywords = connection.escape(req.body.keywords);
    let article_number = connection.escape(req.body.article_number);
    let claim_text = connection.escape(req.body.claim_text);

    let sqlInsert = "";
    
    if(req.session.user){
      sqlInsert = `INSERT INTO historical_learning (keywords, article_number, claim_text, user_id) VALUES (${keywords}, ${article_number}, ${claim_text}, ${req.session.user.id})`;
    }else{
      sqlInsert = `INSERT INTO historical_learning (keywords, article_number, claim_text) VALUES (${keywords}, ${article_number}, ${claim_text})`;
    }
    
    connection.query(sqlInsert, function(err, results) {
      connection.release();

      let obj = {}
      if(err){
        console.log(err);
      }else{
        obj.claimId = results.insertId;
      }
      res.send(obj);
    });
  });

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

        if(req.body.voting == 'vote-pos'){
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
        res.status(200);
      }
    });
  });
  delete req.session.currclaimid;
}

exports.searchMostSimilarClaim = function(req, res) {

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
          //console.log(i+" id: "+rowdp.id+", keywords: "+rowdp.keywords);
          let arrkeywords = rowdp.keywords.split(",");

          //#refactor forEach to some
          myKeywords.forEach(function(val, ind){
            //console.log("comparing '"+val+"'");
            //console.log("comparing '"+val+"' in "+arrkeywords);

            //check if it is equals
            if(arrkeywords.indexOf(val) > -1){
              cnt++;
            }
          });

          console.log("cnt: "+cnt+" arrkeywords.length: "+arrkeywords.length);
          console.log("grau de similaridade desta queixa é de:");
          let ratio = cnt/arrkeywords.length*100;
          console.log(ratio);

          if(ratio >= 100){
            console.log(arrkeywords);
          }
         
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

        objMostSimilar.ratio.toFixed(1);
        obj = JSON.stringify(objMostSimilar);
        res.send(obj); 
      }

    });
  });

}

exports.selectClaimById = function(req, res) {

  let claimId = req.body.claimId
  
  let obj = {}
  db.getConnection(function(err, connection) {

    let sqlSelect = `SELECT 
                      h.id, h.claim_text, h.keywords, a.art_id, a.subject, a.text, user_id, vote_positive, vote_negative, valid_claim
                    FROM historical_learning AS h 
                    INNER JOIN articles AS a ON h.article_number = a.art_id
                    WHERE h.id = ${claimId}`;

    connection.query(sqlSelect, function(err, results) {

      connection.release();

      if(err){
        throw err;
      }else{
        obj = {
          subject: results[0].subject,
          claimId: results[0].id,
          artId: results[0].art_id,
          claimText: results[0].claim_text,
          artText: results[0].text,
          votePos: results[0].vote_positive,
          voteNeg: results[0].vote_negative,
          keywords: results[0].keywords,
          validClaim: results[0].valid_claim
        }
      }
      res.send(obj);
    });
  });
}

exports.searchSimilarClaims = function(req, res){

  var myKeywords = req.body.myKeywords;
  
  let obj = {}

  db.getConnection(function(err, connection) {

    let sqlSelect = `SELECT 
                      h.id, h.keywords, h.claim_text, a.art_id, a.subject, a.text, user_id, vote_positive AS votePos, vote_negative as voteNeg, valid_claim AS validClaim
                    FROM historical_learning AS h 
                    INNER JOIN articles AS a ON h.article_number = a.art_id`

    connection.query(sqlSelect, function(err, results) {

      connection.release();

      if(err){
        throw err;
      }else{

        let objSimilarity = {
          "claims": []
        }

        results.forEach(function(rowdp, i, arr){
          let cnt = 0;
          // val =  object containing id and keywords for each claims registered
          //console.log(i+" id: "+rowdp.id+", keywords: "+rowdp.keywords);
          let arrkeywords = rowdp.keywords.split(",");

          //#refactor forEach to some
          myKeywords.forEach(function(val, ind){

            if(arrkeywords.indexOf(val) > -1){
              cnt++;
            }
          });

          console.log("cnt: "+cnt+" arrkeywords.length: "+arrkeywords.length);
          rowdp.similarity = cnt/arrkeywords.length*100;
          console.log("grau de similaridade desta queixa é de:");
          console.log(rowdp.similarity);

          /*
          if(rowdp.similarity > 100){
            console.log(arrkeywords);
            console.log(myKeywords);
          }
          */

          //prepare object containing only the data that will appear in the table (MAX_COUNT = 5) /number of similar claims that will appear
          let numOfClaims = 0;

          if(rowdp.similarity>=30 && rowdp.similarity<100){
            //>=30
            rowdp.similarity = rowdp.similarity.toFixed(1);
            objSimilarity.claims.push(rowdp);

          }
        });


        res.send(JSON.stringify(objSimilarity));

        /*
         * MergeSort
         *
        var arr = [0,2,9,23,8,34,7];
        var arrC = [320, 449, 8232, 9238, 22, 11, 32];

        arrObj = {arr: arr, arrC: arrC}
        let resultSort = functions.mergeSort(arrObj);
        console.log(resultSort);

        leftObj = {
          arr: [0,2,9],
          arrC: [20,40,60]
        }
        rightObj = {
          arr: [20,7,5],
          arrC: [300,400,500]
        }

        let resultMerge = functions.merge(leftObj, rightObj);
        console.log(resultMerge);
        */
      }
      //res.send(obj);
    });
  });
}
