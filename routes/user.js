
const db = require('../config/db.js');
const bcrypt = require('bcrypt');
const GLOBAL_MAX_AGE = 600000; //10 min (1000 = 1s, 60000 = 1 min)

exports.signup = function(req, res) {

  db.getConnection(function(err, connection) {

    //p.s.: connection.escape already adds single quotes closuring each variable
    let user = {
      "name" : req.body.name,
      "email" : req.body.email,
      "password" : bcrypt.hashSync(req.body.password, 10),
      "phone" : req.body.phone,
      "cpf" : req.body.cpf,
      "address_cep" : req.body.cep,
      "address_street" : req.body.street,
      "address_number" : req.body.number,
      "address_complement" : req.body.complement,
      "address_district" : req.body.district,
      "address_city" : req.body.city,
      "address_state" : req.body.state,
      "created" : new Date(),
      "modified" : new Date()
    }

    let sql = `SELECT email, name FROM users WHERE email = ?`;

    connection.query(sql, [user.email], function(err, results) {
      if(err) {
        req.session.sessionFlash = {
          type: "danger",
          message: 'Um erro inesperado ocorreu. Favor tentar novamente.'
        }

        res.redirect('/login');
      } else {
        if (results.length > 0) {
          req.session.sessionFlash = {
            type: "danger",
            message: 'Endereço de e-mail ja se encontra cadastrado. Favor tentar novamente com outro e-mail.'
          }

          res.redirect("/login");
        } else {
          db.query('INSERT INTO users SET ?', user, function(err, results) {
            if (err) {
              res.redirect('/login');
            } else {
 
              //complete user info with the id registered
              user.id = results.insertId;

              //store user info into session
              req.session.userEmail = user.email;
              req.session.user = user;
              req.session.cookie.maxAge = GLOBAL_MAX_AGE;

              req.session.sessionFlash = {
                type: "success",
                message: 'Registro efetuado com sucesso!'
              }

              res.redirect('/dashboard');
            }
          });
        }
      }
      connection.release();
    });
  });
}

exports.signin = function(req, res) {


  db.getConnection(function(err, connection) {

    //p.s.: connection.escape already adds single quotes closuring each variable
    var email = req.body.email;
    var password = req.body.password;

    var sql = `SELECT 
                id, email, name, phone, cpf, address_cep, address_street,
                address_number, address_complement, address_district,
                address_city, address_state, password
              FROM users
              WHERE email = ?`;

    connection.query(sql, [email], function(err, results) {
      connection.release();

      if (results.length && bcrypt.compareSync(password, results[0].password)) {
        req.session.userEmail = results[0].email;
        req.session.user = results[0];
        req.session.cookie.maxAge = GLOBAL_MAX_AGE;

        req.session.sessionFlash = {
          type: "success",
          message: 'Login efetuado com sucesso'
        }

        res.send({
          url: "/dashboard"
        });

      }else{
        req.session.sessionFlash = {
          type: "danger",
          message: 'Credenciais inválidas. Tente novamente.'
        }
        
        res.send({
          url: "/login"
        });
      }
    });
  });
}

exports.signout = function(req, res) {

  req.session.destroy(function(err) {
    if (!err) {
      res.redirect('/login');
    }
  })
}

exports.dashboard = function(req, res) {

  var user = req.session.user;
  var userEmail = req.session.userEmail;

  if (userEmail == null) {
    res.redirect('/login');
    return;
  } else {
    res.render('users/dashboard');
  }
}

exports.login = function(req, res) {

  if (req.session.userEmail == null) {
    res.render('login');
  } else {
    res.redirect('/dashboard');
  }
}

exports.edit = function(req, res) {

  var userEmail = req.session.userEmail;
  var user = req.session.user;

  if (userEmail == null) {
    res.redirect('/login');
    return;
  } else {
    res.render('users/edit');
  }
}

exports.update = function(req, res){

  //Requisi o banco de dados um conexão e envia um callback
  db.getConnection(function(err, connection){

    //p.s.: connection.escape already adds single quotes closuring each variable
    let name        = connection.escape(req.body.name);
    let email       = connection.escape(req.body.email);
    let phone       = connection.escape(req.body.phone);
    let cpf         = connection.escape(req.body.cpf);
    let cep         = connection.escape(req.body.cep);
    let street      = connection.escape(req.body.street);
    let number      = connection.escape(req.body.number);
    let complement  = connection.escape(req.body.complement);
    let district    = connection.escape(req.body.district);
    let city        = connection.escape(req.body.city);
    let state       = connection.escape(req.body.state);

    let user        = req.session.user;

    //conexão permitida. Solicitar conexão com a conexão aberta passando também um callback quando terminar de executar. 
    //(Toda função async geralmente um callback)
    //
    let sqlUpdate = `UPDATE users SET 
                      name = ${name},
                      email = ${email},
                      phone = ${phone},
                      cpf = ${cpf},
                      address_cep = ${cep},
                      address_street = ${street},
                      address_number = ${number},
                      address_complement = ${complement},
                      address_district = ${district},
                      address_city = ${city},
                      address_state = ${state}
                    WHERE id = ${user.id}`;

    connection.query(sqlUpdate, function(err, results) {
      if(err) throw err;

      //sqlUpdate finalizado e callback acionado. A partir daqui pode-se fazer outra requisição utilizando a mesma 'connection' aberta.
      let sqlSelect = `SELECT 
                        id, email, name, phone, cpf, address_cep, address_street, 
                        address_number, address_complement, address_district, 
                        address_city, address_state, password
                      FROM users 
                      WHERE id = ${user.id}`;

      connection.query(sqlSelect, function(err, results) {
        if(err) throw err;

        //sqlSelect finalizado e callback finalizado. Como não será usamos mais a conexão aberta, terminamos o contato com o banco.
        connection.release();

        req.session.user = results[0];
        req.session.sessionFlash = {
          type: "success",
          message: 'Modificações realizadas com sucesso'
        }

        req.session.save(function(err) {
          req.session.reload(function(err){
            res.redirect('/edit');
          })
        })
      });

    });
  });

}

exports.complaints = function(req, res) {
  let user = req.session.user;
  let userEmail = req.session.userEmail;
  let obj;
  let sqlSelect;

  if (userEmail == null) {
    res.redirect('/login');
    return;
  } else {
    if (req.query.owner == "true") {
      sqlSelect = `SELECT 
                      h.id AS claimId, h.claim_text AS claimText, h.keywords, a.art_id AS artId, a.subject, a.text AS artText, vote_positive as votePos, vote_negative as voteNeg, valid_claim as validClaim
                      FROM historical_learning AS h 
                      INNER JOIN articles AS a ON h.article_number = a.art_id WHERE user_id = ${user.id}
                    ORDER BY h.id`;
    } else {
      sqlSelect = `SELECT 
                      h.id AS claimId, h.claim_text AS claimText, h.keywords, a.art_id AS artId, a.subject, a.text AS artText, vote_positive as votePos, vote_negative as voteNeg, valid_claim as validClaim 
                      FROM historical_learning AS h 
                      INNER JOIN articles AS a ON h.article_number = a.art_id
                    ORDER BY h.id`;
    }


    db.getConnection(function(err, connection) {
      connection.query(sqlSelect, function(err, results) {
        if (err) throw err;
        connection.release();

        obj = results;

        res.render('users/complaints', {data: obj});
      });
    });
  }
}

//es6
exports.getUserInfoById = (req, res)=>{
  let userId = req.body.userId;

  if(userId){
  
    let sql = `SELECT 
                email, name, phone, cpf, address_cep, address_street, address_number, address_complement, 
                address_district, address_city, address_state
              FROM users WHERE id = '${userId}';`; 

    db.getConnection(function(err, connection) {
      connection.query(sql, function(err, results) {
        connection.release();

        //if(err) throw err;
        res.send({
          userInfo: results[0]
        });
      });
    });
  }else{
    //res.status(404).render('404', { url: req.originalUrl });
  }
}

exports.registerExperiment = (req, res) =>{

  db.getConnection(function(err, connection) {
    let termName = connection.escape(req.body.termName);
    let suggestionExp = connection.escape(req.body.suggestionExp);
    let claimId = connection.escape(req.body.claimId);
    let userVote = connection.escape(req.body.userVote);

    let sqlInsert = `
      INSERT INTO experiments
    (name, claim_id, final_appointment, datetime, user_vote) 
      VALUES 
    (${termName}, ${claimId}, ${suggestionExp}, now(), ${userVote})`;

    connection.query(sqlInsert, function(err, results) {
      connection.release();

      if(err) throw err;
      res.send({
        result: results
      });
    });
  });
}
