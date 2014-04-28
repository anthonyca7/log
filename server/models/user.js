'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
  
/**
 * User Schema
 */
var UserSchema = new Schema({
  name: String,
  username: {
    type: String,
    match: /^[a-zA-Z][a-zA-Z0-9\-\_]+$/,
  },
  email: {
    type: String,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  },
  hashedPassword: String,
  salt: String
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Basic info to identify the current authenticated user in the app
UserSchema
  .virtual('userInfo')
  .get(function() {
    return {
      '_id': this._id,
      'username': this.username,
      'name': this.name,
    };
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'username': this.username,
    };
  });
    
// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    return email.length >= 8 && email.length <= 50;
  }, 'Email cannot be blank');

// Validate empty username
UserSchema
  .path('username')
  .validate(function(username) {
    return username.length >= 5 && username.length <= 25;
  }, 'Username cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) {throw err;}
      if(user) {
        if(self.id === user.id){return respond(true); }
        return respond(false);
      }
      return respond(true);
    });
}, 'The specified email address is already in use.');

// Validate username is not taken
UserSchema
  .path('username')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({username: value}, function(err, user) {
      if(err) {throw err;}
      if(user) {
        if(self.id === user.id) {return respond(true);}
        return respond(false);
      }
      return respond(true);
    });
}, 'The specified username is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    if (!this.isNew) {return next();}

    if (!validatePresenceOf(this.hashedPassword)){
      next(new Error('Invalid password'));
    }
    else {next();}
  });

/**
 * Methods
 */
UserSchema.methods = {

  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  makeSalt: function() {
    return ((new Buffer('Anthony\'s salt Asdfg', 'base64'))   +
            crypto.randomBytes(16).toString('base64') +
            (new Buffer('Anthony\'s salt Hjkl1', 'base64')));
  },

  encryptPassword: function(password) {
    if (!password || !this.salt) {return '';}
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('User', UserSchema);