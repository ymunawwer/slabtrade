var express = require('express');
var router = express.Router();
var passport = require('passport')
var user = require('../models/user')
var userx = new user();
var auth = require('../middlewares/auth');
/* GET home page. */
router.get('/',auth.checkToken,function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.post('/login',passport.authenticate('local-login', { failureRedirect: '/login' }),function(req,res,next){
//   res.redirect('/');
// })


module.exports = router;
