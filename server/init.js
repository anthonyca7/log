'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User');

User.find({}).remove(function() {
   User.create({
       email:    'user@user.com',
       password: 'user',
       dob:      new Date(1992, 7, 12)
   },
   function() {
      console.log('Default user created with email: user@user.com and password: user');
    }
  );
});
