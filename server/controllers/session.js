'use strict';

var passport = require('passport');

exports.logout = function (req, res) {
  req.logout();
  res.send(200);
};

exports.login = function (req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    var error = err || info;
    if (error) { return res.json(401, error); }

    req.logIn(user, function(err) {
      if(req.body.remember === true) {
        req.session.cookie.maxAge = 365*24*60*60*1000;
      }
      else{
        req.session.cookie.maxAge = 0;
      }
      if (err) { return res.send(err); }
      res.json(req.user.userInfo);
    });
  })(req, res, next);
};