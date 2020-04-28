var express = require('express');
var router = express.Router();
var date = new Date();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var msg = "";

  if(req.cookies['username']){
    msg = genWelmsg(req.cookies['username']);
    res.render('user', { title: 'User', username: msg});
  } else{
    res.redirect('/login');
  }
});

router.post('/', function(req, res, next) {
  res.clearCookie('username');
  res.redirect("login");
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

module.exports = router;
