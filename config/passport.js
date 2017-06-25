var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transport = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    secureConnection: false,
    auth: {
        user: 'web154158227@gmail.com',
        pass: '154158227'
    }

}));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use('local.signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, email, password, done) {
  req.checkBody('name','Invalid Name').notEmpty();
  req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
  req.checkBody('password', 'Invalid Password').notEmpty().isLength({min: 4});
	req.checkBody('passwordretype','Password Do Not Match').equals(req.body.password);
  var errors = req.validationErrors();
  if(errors){
    var messages = [];
    errors.forEach(function (error) {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }
  User.findOne({'email': email}, function (err, user) {
    if(err){
      return done(err);
    }
    if(user){
      return done(null, false, {message: 'Email is already use.'});
    }
    var newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    newUser.name = req.body.name;
		newUser.rule = "member";
		newUser.active = false;
    newUser.save(function (err, result) {
      if(err){
        return done(err);
      }
      var sendmail;
      SendVerificationMail(req,result);
      sendmail = 'Email verification is sent to '+email;
      return done(null, newUser);
    });
  });
}));

passport.use('local.signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, email, password, done) {
  req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
  req.checkBody('password', 'Invalid Password').notEmpty();
  var errors = req.validationErrors();
  if(errors){
    var messages = [];
    errors.forEach(function (error) {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }
  User.findOne({'email': email}, function (err, user) {
    if(err){
      return done(err);
    }
    if(!user){
      return done(null, false, {message: 'No user found.'});
    }
    if(!user.validPassword(password)){
      return done(null, false, {message: 'Wrong password.'});
    }
    if (user.active == false || user.active == undefined || user.active == '')
		{
			return done(null, false, {message: 'User is not active'});
		}
    var newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    return done(null, user);
  });
}));

function SendVerificationMail(req,user) {
    var host=req.get('host');
    var link="http://"+req.get('host')+"/user/verify/"+user["_id"];
    var mailOptions={
        to : user["email"],
        subject : "Please confirm your account",
        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
    }
    console.log(mailOptions);
    transport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }
        else{
            console.log("Message sent: " + response.message);
        }
    });
}
