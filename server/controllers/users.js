'use strict';

var mongoose = require('mongoose'),
    User     = mongoose.model('User');

//register
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  console.log(req.body);
  newUser.save(function(err) {
    if (err) {return res.json(400, err);}
    
    req.logIn(newUser, function(err) {
      if (err) {return next(err);}
      return res.json(req.user.userInfo);
    });
  });
};

//profile
exports.show = function (req, res) {
	res.json(req.userRequested.profile);
};


exports.changePassword = function(req, res) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) {return res.send(400);}
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

//Get current user
exports.currentUser = function(req, res) {
  res.json(req.user || null);
};

//loads user parameter
exports.loadByUsername = function (req, res, next, username) {
	User.findOne({username: username}, function (err, user) {
    	if (err) { return next(err); }
    	if (!user) { return res.send(404); }
    	else{
	    	req.userRequested = user;
	    	return next();
		}
  	});
};

exports.loadByUserId = function (req, res, next, userId) {
	User.findById(userId, function (err, user) {
		if (err) { return next(err); }
		if (!user) { return res.send(404); }
		req.userRequested = user;
		return next();
	});
};