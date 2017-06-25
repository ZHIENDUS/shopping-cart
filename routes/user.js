var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var userController = require('../controllers/userController');
var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isloggedIn,function (req, res, next) {
  res.render('user/profile');
});

router.get('/logout', isloggedIn, function (req, res, next) {
  req.logout();
  res.redirect('/');
});

router.use('/', notloggedIn, function (req, res, next) {
  next();
});

router.get('/verify/:id',userController.user_verification_get);

router.get('/signup', function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length>0});
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));

router.get('/signin', function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length>0});
});

router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true
}));

module.exports = router;

function isloggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

function notloggedIn(req, res, next) {
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
