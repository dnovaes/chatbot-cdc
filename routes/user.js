var db = require('../config/db.js');

var bcrypt = require('bcrypt');

exports.signup = function(req, res) {

  var user = {
    "name" : req.body.name,
    "email" : req.body.email,
    "password" : bcrypt.hashSync(req.body.password, 10),
    "created" : new Date(),
    "modified" : new Date()
  }

  var sql = "SELECT email, name from users where email = '" + user.email + "'";

  db.getConnection(function(err, connection) {
    connection.query(sql, function(err, results) {
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
              req.session.userEmail = user.email;
              req.session.user = user;

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

  var email = req.body.email;
  var name = req.body.name;
  var password = req.body.password;

  var sql = "SELECT id, email, name, password from users where email = '" + email + "'"; 

  db.getConnection(function(err, connection) {
    connection.query(sql, function(err, results) {

      if (results.length && bcrypt.compareSync(password, results[0].password)) {
        req.session.userEmail = results[0].email;
        req.session.user = results[0];

        req.session.sessionFlash = {
          type: "success",
          message: 'Login efetuado com sucesso'
        }

        res.redirect('/dashboard');
        
        } else {
          req.session.sessionFlash = {
          type: "danger",
          message: 'Credenciais inválidas. Tente novamente.'
        }

        res.redirect('/login');
      }
      connection.release();
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

  if (userEmail == null) {
    res.redirect('/login');
    return;
  } else {
    res.render('users/edit');  
  }
}

exports.update = function(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var user = req.session.user;

  db.getConnection(function(err, connection) {
    connection.query("UPDATE users SET name = '" + name + "', email = '" + email + "' where id = '" + user.id +"'", function(err, results) {
      connection.release();
    });  
  });

  db.getConnection(function(err, connection) {
    connection.query("SELECT id, email, name, password from users where id = '" + user.id + "'", function(err, results) {
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
}