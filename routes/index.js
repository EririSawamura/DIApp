const crypto = require('crypto');
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
      res.render('login', { title: 'Login', hidden:'display:block' });
    }
    else{
      res.render('login', { title: 'Login', hidden:'display:none'});
    }
  }
});
router.get('/register', function (req, res) {
  res.render('register', { title: 'Register' });
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
      res.redirect("/login");
    }
  });
})
module.exports = router;

function login(req, callback){
  var sql = "SELECT * FROM user WHERE username = ? AND password = ?";
  connection.query(
      sql,[
      req.body.username,
      req.body.pwd],
    function (err, rows) {
      if (err) throw err;
      
      if(rows.length === 1){
        return callback(true);
      }
      else{
        return callback(false);
      }
    }
  );
}

function register(req, callback){
  var sql = "INSERT INTO user VALUES (?, ?)";
  connection.query(
      sql,[
      req.body.username,
      req.body.pwd],
    function (err, rows) {
      if (err) throw err;
      
      return callback(true);
    }
  );
}
