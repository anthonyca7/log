'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User');

User.find({}).remove(function() {
   User.create({
       provider: 'local',
       username: 'anthonyca7',
       name: 'Anthony Cabrera',
       email: 'anthonyka7@gmail.com',
       password: 'anthony'
   },
   function() {
      console.log('Finished initializing user table');
    }
  );
});
