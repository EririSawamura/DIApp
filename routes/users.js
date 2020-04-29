var express = require('express');
var router = express.Router();
var date = new Date();
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: 'password',
  database: 'users'
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  var msg = "";

  if(req.cookies['username']){
    msg = genWelmsg(req.cookies['username']);
    genPwdlist(req.cookies['username'], function(result){
      res.render('user', { title: 'User', username: msg, result: result});
    });
  } else{
    res.redirect('/login');
  }
});
router.get('/create_key', function(req, res, next) {
  res.render('create_key', {title: 'Create new key pairs'})
});


router.post('/', function(req, res, next) {
  if(req.body.logout){
    res.clearCookie('username');
    res.redirect("login");
  } else{
    res.redirect('/user/create_key');
  }
});

function genWelmsg(name){
  var hour = date.getHours();
  if(hour >= 18 || hour <= 5){
    return name + ", good evening.";
  }else if(hour >= 12 && hour < 18){
    return name + ", good afternoon.";
  }else{
    return name + ", good morning.";
  }
}

function genPwdlist(name, callback){
  var list_sql = "SELECT key_id,  USERNAME FROM key_store WHERE owner = ? ORDER BY LAST_MODIFIED_TIME DESC;";
  connection.query(
    list_sql,[
      name
    ],
    function (err, rows) {
      if (err) throw err;
    
      return callback(rows);
    }
  );
}
module.exports = router;
