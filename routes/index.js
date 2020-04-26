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
  res.render('login', { title: 'Login' });
});
router.get('/register', function (req, res) {
  res.render('register', { title: 'Register' });
});

router.post('/login', function (req, res) {
  login(req.body);
  res.render('login', { title: 'Login' });
});
router.post('/register', function (req, res) {
})
module.exports = router;

function login(req){
  console.log(req);
  connection.query(
    "SELECT * FROM user WHERE username = ? AND password = ?",[
      req.username,
      req.pwd],
    function (err, rows, fields) {
      if (err) throw err;
    
      if(rows.length == 1){
        console.log("nice");
      }
      else{
        console.log("shit");
      }
    }
  );
}

function register(){

}
