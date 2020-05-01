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
  if(req.cookies['username']){
    var msg = genWelmsg(req.cookies['username']);
    var create_key_hidden = req.query.create_key === "success"? "display:block": "display:none";
    genPwdlist(req.cookies['username'], function(result){
      res.render('user', { title: 'User', username: msg, result: result, create_key_hidden: create_key_hidden});
    });
  } else{
    res.redirect('/login');
  }
});
router.get('/create_key', function(req, res, next) {
  if(req.cookies['username']){
    res.render('create_key', {title: 'Create new key pairs'});
  } else{
    res.redirect('/login');
  }
});
router.get('/view', function(req, res, next){
  
  if(req.cookies['username']){
    var key_id = req.query.key_id;
    console.log(key_id);
    getView(key_id, function(result){
      console.log(result[0]);
      console.log(result[0].USERNAME);
      var if_private = result[0].IF_PRIVATE? 'display:block': 'display:none';
      var alert = result[0].IF_PRIVATE? "The content is encrypted...Please enter password to decrypt":"";
      res.render('view', { title: 'View key pairs', 
        username: result[0].USERNAME, 
        password: result[0].PASSWORD, 
        if_private: if_private,
        alert: alert});
    });
  } else{
    res.redirect('/login');
  }
});


router.post('/', function(req, res, next) {
  if(req.body.logout){
    res.clearCookie('username');
    res.redirect("login");
  } else{
    res.redirect('/user/create_key');
  }
});
router.post('/create_key', function(req, res, next){
  if(req.cookies['username']){
    create_key(req, req.cookies['username'], function(result){
      if(result){
        res.redirect("/user?create_key=success");
      } else{
        res.redirect("/user?create_key=fail");
      }
    });
  } else{
    res.redirect('/login');
  }
});
router.post('/view', function(req, res, next){
  if(req.cookies['username']){
    var key_id = req.query.key_id;
    var alert = "";
    var if_private = 'display:none';
    console.log(key_id);
    getDecryView(key_id, req, function(result){
      console.log(result[0]);
      if(result[0].PASSWORD === null){
        alert = "Decryption password is wrong...Please try again!";
        if_private = 'display:block';
        result[0].PASSWORD = "*********";
      }
      res.render('view', { title: 'View key pairs', 
        username: result[0].USERNAME, 
        password: result[0].PASSWORD, 
        if_private: if_private,
        alert: alert});
    });
  } else{
    res.redirect('/login');
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
  var list_sql = "SELECT key_id,  USERNAME, if_private FROM key_store WHERE owner = ? ORDER BY LAST_MODIFIED_TIME DESC;";
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

function getView(id, callback){
  var view_sql = "SELECT USERNAME, PASSWORD, IF_PRIVATE FROM key_store WHERE key_id = ?;";
  connection.query(
    view_sql,[
      id
    ],
    function (err, rows) {
      if (err) throw err;
    
      return callback(rows);
    }
  );
}

function getDecryView(id, req, callback){
  var password = req.body.decrypt;
  console.log("password"+password);
  var deView_sql = "SELECT USERNAME, CONVERT(AES_DECRYPT(FROM_BASE64(PASSWORD), ?, @init_vector) USING UTF8) AS PASSWORD, IF_PRIVATE FROM key_store WHERE key_id = ?;"
  connection.query(
    deView_sql,[
      password,
      id
    ],
    function(err, rows){
      if (err) throw err;
    
      return callback(rows);
    }
  );
}

function create_key(req, username, callback){
  if(req.body.if_private === 'on'){
    console.log("private");
    var key_sql = "insert into key_store (username, password, OWNER, if_private, LAST_MODIFIED_TIME) values (?, TO_BASE64(AES_ENCRYPT(?,?, @init_vector)), ?, 1, now());"
    connection.query(
      key_sql,[
        req.body.username,
        req.body.user_password,
        req.body.pwd,
        username
      ],
      function (err) {
        if (err) throw err;
      
        return callback(true);
      }
    );
  }else{
    var key_sql = "insert into key_store (username, password, OWNER, if_private, LAST_MODIFIED_TIME) values (?, ?, ?, 0, now());"
    connection.query(
      key_sql,[
        req.body.username,
        req.body.user_password,
        username
      ],
      function (err) {
        if (err) throw err;
      
        return callback(true);
      }
    );
  }
}
module.exports = router;
