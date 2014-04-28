'use strict';

var should   = require('should'),
    mongoose = require('mongoose'),
    User     = mongoose.model('User');

var user;

describe('User Model', function() {
  beforeEach(function(done) {
    user = new User({
      name:     'test user',
      username: 'testuser',
      email:    'test@test.com',
      password: 'test'
    });
    User.remove().exec();
    done();
  });
  after(function (done) {
  	User.remove().exec();
    done();
  });

  it('user model should start empty', function(done) {
    User.find({}, function (err, users) {
      users.should.have.length(0);
      done();
    });
  });

  it('should fail when trying to save a duplicate user', function(done) {
    user.save();
    var userDup = new User(user);
    userDup.save(function(err){
      should.exist(err);
      done();
    });    
  });

  it('should authenticate user if password is valid', function(done) {
    user.authenticate('test').should.be.equal(true);    
    done();
  });

  it('should not authenticate false password', function(done) {
    user.authenticate('invalid_password');
    done();
  });

  describe('email', function() {
    it('should fail when saving without an email', function(done) {
      user.email = '';
      user.save(function(err){
        should.exist(err);
        done();
      });
    });

    it('should have a length bigger than 8', function(done) {
      user.email = 't@t.com';
      user.save(function(err){
        should.exist(err);
        done();
      });
    });

    it('should have a length smaller than 50', function(done) {
      user.email = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaafffffffffffffffffffffffffffaaaaaaaaasssss@ssssssssss.com';
      user.save(function(err){
        should.exist(err);
        done();
      });
    });

    it('should save with valid length', function(done) {
      user.email = 'testuser@gmail.com';
      user.save(function(err){
        should.not.exist(err);
        done();
      });
    });
    it('It should not save if the email has an invalid character', function(done) {
      user.email = 'test*user@gmail.com';
      user.save(function(err){
        should.exist(err);
        done();
      });
    });


  });


  describe('username', function() {
      it('should have length greater than 5', function(done) {
        user.username = 'four';
        user.save(function (err) {
          should.exist(err);
          done();
        });
      });

      it('should have a length less than 25', function(done) {
        user.username = 'aaaaaaaaaaaaaaaaaaaaaaaaaa';
        user.save(function (err) {
          should.exist(err);
          done();
        });
      });

      it('should fail if there are spaces present', function(done) {
        user.username = 'test test';
        user.save(function (err) {
          should.exist(err);
          done();
        });
      });

      it('should only allow a-z A-Z 0-9 and - and _', function(done) {
        user.username = 'testTEST98-_';
        user.save(function (err) {
          should.not.exist(err);
          done();
        });
      });

      it('should only start with a character', function(done) {
        user.username = '-testTEST98f-_';
        user.save(function (err) {
          should.exist(err);
          done();
        });
      });
  });
});

