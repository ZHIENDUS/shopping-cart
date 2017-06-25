var User = require('../models/user');

var csrf = require('csurf');
var passport = require('passport');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transport = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    secureConnection: false,
    auth: {
        user: 'web154158227s@gmail.com',
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
