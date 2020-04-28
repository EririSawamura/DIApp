const bcrypt = require('bcrypt');
var saltRounds = 10;
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: 'password',
  database: 'users'
});

connection.connect();

router.get('/', function(req, res, next) {
  res.send("Welcome to DIApp.");
});
router.get('/login', function(req, res, next) {
  if(req.cookies['username']){
    res.redirect('/user');
  }else{
    if(req.query.valid){
      res.render('login', { title: 'Login', valid_hidden:'display:block', reg_hidden:'display:none' });
    }
    else{
      if(req.query.register){
        res.render('login', { title: 'Login', valid_hidden:'display:none', reg_hidden:'display:block'});
      }
      else{
        res.render('login', { title: 'Login', valid_hidden:'display:none', reg_hidden:'display:none'});
      }
      
    }
  }
});
router.get('/register', function (req, res) {
  if(req.query.username){
    res.render('register', { title: 'Register', hidden:'display:block' });
  }
  else{
    res.render('register', { title: 'Register', hidden:'display:none'});
  }
});

router.post('/login', function (req, res) {
  login(req, function(result){
    if(result){
      console.log(result);
      res.cookie('username', req.body.username, {expire: 360000 + Date.now()});
      res.redirect("/user");
    } else{
      res.redirect("/login?valid=false");
    }
  });
});
router.post('/register', function (req, res) {
  register(req, function(result){
    if(result){
      res.redirect("/login?register=success");
    } else{
      res.redirect("/register?username=used");
    }
  });
})
module.exports = router;

function login(req, callback){
  var sql = "SELECT password FROM user WHERE username = ?";
  connection.query(
    sql,[
      req.body.username
    ],
    function (err, rows) {
      if (err) throw err;
      
      if(rows.length === 1){
        bcrypt.compare(req.body.pwd, rows[0].password, function(err, result) {
          if(err) throw err;
          if(result){
            return callback(true);
          } else{
            return callback(false);
          }
        });
      }
      else{
        return callback(false);
      }
    }
  );
}

function register(req, callback){
  var check_sql = "SELECT * FROM user WHERE username = ?";
  var res_sql = "INSERT INTO user VALUES (?, ?, ?, ?)";

  connection.query(
    check_sql,[
      req.body.username
    ],
    function (err, rows) {
      if (err) throw err;
      
      if(rows.length === 0 ){
        bcrypt.genSalt(saltRounds, function(err, salt) {
          if(err) throw(err);
          bcrypt.hash(req.body.pwd, salt, function(err, hash) {
            if(err) throw err;
            connection.query(
              res_sql,[
              req.body.username,
              hash,
              req.body.first_name,
              req.body.last_name
              ],
              function (err) {
                if (err) throw err;
              }
            );
            return callback(true);
          });
        });
      }
      else{
        return callback(false);
      }
    }
  );
}
