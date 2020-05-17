const bcrypt = require('bcrypt');
const qrcode = require('qrcode');
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
    var delete_key_hidden = req.query.delete_key === "success"? "display:block": "display:none";
    var change_key_hidden = req.query.change_key === "success"? "display:block": "display:none";
    genPwdlist(req.cookies['username'], function(result){
      res.render('user', { title: 'User', username: msg, result: result, create_key_hidden: create_key_hidden, delete_key_hidden: delete_key_hidden, change_key_hidden, change_key_hidden});
    });
  } else{
    res.redirect('/login');
  }
});
router.get('/create_key', function(req, res, next) {
  console.log('hello');
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
        sitename: result[0].sitename, 
        username: result[0].USERNAME, 
        password: result[0].PASSWORD, 
        if_private: if_private,
        alert: alert});
    });
  } else{
    res.redirect('/login');
  }
});
router.get('/verify', function(req, res, next){
  
  if(req.cookies['username']){
    var key_id = req.query.key_id;
    console.log(key_id);
    getView(key_id, function(result){
      console.log(result[0]);
      console.log(result[0].USERNAME);
      if(result[0].IF_PRIVATE){
        var valid_hidden = req.query.valid === "fail"? "display:block": "display:none";
        res.render('verify', { title: 'Verify', valid_hidden: valid_hidden});
      } else{
        res.render('change', { title: 'Change'});
      }
    });
  } else{
    res.redirect('/login');
  }
});
router.get('/change', function(req, res, next) {
  if(req.cookies['username']){
    res.render('change', {title: 'Change'});
  } else{
    res.redirect('/login');
  }
});
router.get('/delete', function(req, res, next) {
  if(req.cookies['username']){
    var valid_hidden = req.query.valid === "fail"? "display:block": "display:none";
    res.render('delete', { title: 'Delete', valid_hidden: valid_hidden});
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
        sitename: result[0].sitename, 
        username: result[0].USERNAME, 
        password: result[0].PASSWORD, 
        if_private: if_private,
        alert: alert});
    });
  } else{
    res.redirect('/login');
  }
});
router.post('/verify', function(req, res, next){
  if(req.cookies['username']){
    var key_id = req.query.key_id;
    console.log(key_id);
    getDecryView(key_id, req, function(result){
      if(result[0].PASSWORD === null){
        res.redirect("/user/verify?key_id="+key_id+"&valid=fail");
      } else{
        res.redirect("/user/change?key_id="+key_id);
      }
    });
  } else{
    res.redirect('/login');
  }
});
router.post('/change', function(req, res, next){
  if(req.cookies['username']){
    var key_id = req.query.key_id;
    change_key(key_id, req, req.cookies['username'], function(result){
      if(result){
        res.redirect("/user?change_key=success");
      } else{
        res.redirect("/user?change_key=fail");
      }
    });
  } else{
    res.redirect('/login');
  }
});
router.post('/delete', function(req, res, next){
  if(req.cookies['username']){
    var key_id = req.query.key_id;
    console.log(key_id);
    delete_key(key_id, req.cookies['username'], req, function(result){
      if(result){
        res.redirect("/user?delete_key=success");
      } else{
        res.redirect("/user/delete?key_id="+key_id+"&valid=fail");
      }
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
  var list_sql = "SELECT key_id,  USERNAME, sitename, if_private FROM key_store WHERE owner = ? ORDER BY LAST_MODIFIED_TIME DESC;";
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
  var view_sql = "SELECT USERNAME, PASSWORD, sitename, IF_PRIVATE FROM key_store WHERE key_id = ?;";
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
  var deView_sql = "SELECT USERNAME, CONVERT(AES_DECRYPT(FROM_BASE64(PASSWORD), ?, @init_vector) USING UTF8) AS PASSWORD, sitename, IF_PRIVATE FROM key_store WHERE key_id = ?;"
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
    var key_sql = "insert into key_store (username, password, sitename, OWNER, if_private, LAST_MODIFIED_TIME) values (?, TO_BASE64(AES_ENCRYPT(?,?, @init_vector)), ?, ?, 1, now());"
    connection.query(
      key_sql,[
        req.body.username,
        req.body.user_password,
        req.body.pwd,
        req.body.sitename,
        username
      ],
      function (err) {
        if (err) throw err;
      
        return callback(true);
      }
    );
  }else{
    var key_sql = "insert into key_store (username, password, sitename, OWNER, if_private, LAST_MODIFIED_TIME) values (?, ?, ?, ?, 0, now());"
    connection.query(
      key_sql,[
        req.body.username,
        req.body.user_password,
        req.body.sitename,
        username
      ],
      function (err) {
        if (err) throw err;
      
        return callback(true);
      }
    );
  }
}

function change_key(id, req, username, callback){
  if(req.body.if_private === 'on'){
    console.log("private");
    var key_sql = "UPDATE key_store SET username=?, password=TO_BASE64(AES_ENCRYPT(?,?, @init_vector)), sitename=?, if_private=1, LAST_MODIFIED_TIME=now() WHERE key_id=?;"
    connection.query(
      key_sql,[
        req.body.username,
        req.body.user_password,
        req.body.pwd,
        req.body.sitename,
        id
      ],
      function (err) {
        if (err) throw err;
      
        return callback(true);
      }
    );
  }else{
    var key_sql = "UPDATE key_store SET username=?, password=?, sitename=?, if_private=0, LAST_MODIFIED_TIME=now() WHERE key_id=?;"
    connection.query(
      key_sql,[
        req.body.username,
        req.body.user_password,
        req.body.sitename,
        id
      ],
      function (err) {
        if (err) throw err;
      
        return callback(true);
      }
    );
  }
}

function delete_key(id, username, req, callback){
  var pw_sql = "SELECT password FROM user WHERE username = ?";
  var key_sql = "DELETE FROM key_store WHERE key_id = ?;"
  connection.query(
    pw_sql,[
      username
    ],
    function (err, rows) {
      if (err) throw err;
      
      if(rows.length === 1){
        console.log(req.body.pwd)
        bcrypt.compare(req.body.pwd, rows[0].password, function(err, result) {
          if(err) throw err;
          if(result){
            connection.query(
              key_sql,[
                id
              ],
              function (err) {
                if (err) throw err;
              
                return callback(true);
              }
            );
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
module.exports = router;
