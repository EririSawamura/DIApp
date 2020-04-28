var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.cookies['username']){
    res.render('user', { title: 'User' });
  }
  else{
    res.render('login',{ title:'login' });
  }
});

router.post('/', function(req, res, next) {
  res.clearCookie('username');
  res.redirect("login");
});

module.exports = router;
