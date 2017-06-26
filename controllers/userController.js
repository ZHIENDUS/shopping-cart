var User = require('../models/user');

var csrf = require('csurf');
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');

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
//verify email
exports.user_verification_get = function (req,res,next) {
    User.findById(req.params.id).exec(function (err,user) {
        if(err){
            res.end("<h1>Error 404</h1>");
        }
        else
        {
            if (user != null && user != undefined)
            {
                if (user.active == true){
                    res.redirect('/user/signin');
                }
            }
            else
            {
                res.end("<h1>User can not be found</h1>");
            }
        }
    });
    var user_instance = new User();
    user_instance._id = req.params.id;
    user_instance.active = true;
    User.findByIdAndUpdate(req.params.id,user_instance,{}).exec(function (err,user) {
        if (err){
            res.end("<h1>Cannot find account</h1>");
        }
        else{
            var notice = "Your email "+user.email+" is verified";
            res.render("user/verify",{notice: notice, layout:false});
        }
    });
  };

  //forget password
  exports.user_forget_password_get = function (req,res,next) {
      res.render("user/forgetpassword",{
          csrfToken: req.csrfToken(),
          layout: 'layout'
      });
  };

  exports.user_forget_password_post = function (req,res,next) {
      var email = req.body.email;
      User.findOne({'email': email}).exec(function(err, user)
      {
          if(err){
            console.log(err);
          }
          if (user != null && user != undefined) {
              var success = "Request has send to " + email;
              SendResetPasswordMail(req,user);                        //Send email reset password
              res.render("user/forgetpassword",{
                  success: success,
                  csrfToken: req.csrfToken(),
                  layout: 'layout'});
          }
          else {
              res.render("user/forgetpassword",{
                  message: 'Please input email exactly',
                  csrfToken: req.csrfToken(),
                  hasErrors: true,
                  layout: 'layout'
              });

          }
      });
  };

  function SendResetPasswordMail(req,user) {
      var token = bcrypt.hashSync(user["_id"], bcrypt.genSaltSync(5), null);
      User.findByIdAndUpdate(user["_id"],{_id: user["_id"],reset_token: token}).exec(function (err,user) {
          if(err)
          {
              console.log(err);
          }
      });
      var host=req.get('host');
      var link="http://"+req.get('host')+"/user/resetpassword/"+user["_id"]+"?reset="+token;              //link to reset password
      var mailOptions={
          to : user["email"],
          subject : "Reset your password",
          html : "Hello,<br> Please Click on the link to reset your password.<br><a href="+link+">Click here to reset</a>"
      };
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

  exports.user_reset_password_get = function (req,res,next) {
      res.render("user/resetpassword",{
          csrfToken: req.csrfToken(),
          layout: 'layout'}
          );
  };

  exports.user_reset_password_post = function (req,res,next) {

      var reset_qr = req.query.reset;
      var id = req.params.id;
      console.log("id: "+id);
      console.log("Reset: "+reset_qr);

      var messages = [];
      if (reset_qr != null && reset_qr!=undefined && reset_qr != '' )             //check reset toke param
      {
          User.findById(id).exec(function (err, user) {                           //find user
              if (err) {
                  console.log(err);
                  res.end("<h1>Error can not find!</h1>");
              }
              else {
                  if (user != null && user != undefined) {
                      console.log("Reset token: " + user.reset_token);
                      if (user.reset_token == reset_qr) {
                          var message = [];
                          req.checkBody('password', 'Password minimum length is 4').isLength({min: 4});
                          req.checkBody('password', 'Password is required').notEmpty();
                          req.checkBody('passwordretype', 'Retyping password is require').notEmpty();
                          req.checkBody('passwordretype', 'Password do not match').equals(req.body.password);
                          var errors = req.validationErrors();
                          if (errors) {

                              errors.forEach(function (error) {
                                  messages.push(error.msg);
                              });
                          }
                          if (messages.length > 0) {
                              res.render("user/resetpassword", {
                                  messages: messages, hasErrors: messages.length > 0,
                                  csrfToken: req.csrfToken(),
                                  layout: 'layout'
                              });

                          }
                          else {
                              var user_instance = new User();
                              user_instance._id = id;
                              user_instance.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(5), null);
                              user_instance.reset_token='';
                              User.findByIdAndUpdate(id, user_instance, {}).exec(function (err, user) {
                                  console.log(user);
                                  if (user != null && user != undefined) {

                                      res.render("user/resetpassword", {
                                          //messages: messages, hasErrors: messages.length > 0,
                                          success: 'Reset password success',
                                          csrfToken: req.csrfToken(),
                                          layout: 'layout'
                                      });
                                  }
                                  else {
                                      if (err) {
                                          messages.push('Update information error');
                                      }
                                      res.render("user/resetpassword", {
                                          messages: messages, hasErrors: messages.length > 0,
                                          csrfToken: req.csrfToken(),
                                          layout: 'layout'
                                      });
                                  }
                              });
                          }

                      }
                      else {
                          res.end("<h1>Link is expired</h1>");
                      }
                  }
              }

          });
      }
      else
      {
          res.send("<h1>Reset token does not exists</h1>");
      }

  };
