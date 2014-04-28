'use strict';

var should   = require('should'),
	app      = require('../../../server'),
	request  = require('supertest');

var agent = request(app);

describe('user api', function() {
	var id;
	var username;


	it('should create new user', function(done) {
		agent
		.post('/api/users')
		.send({
        	name:     'test user',
	    	username: 'testuser',
	    	email:    'test@test.com',
	    	password: 'test'  
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function (err, res) {
			if (err) { return done(err); }
			res.body.should.not.be.instanceof(Array);
			res.body.should.have.property('username', 'testuser');
			res.body.should.have.property('name', 'test user');
			id = res.body._id;
			username = res.body.username;
			done();
		});
	});

	it('should be able to read user information with id', function(done) {
		agent
		.get('/api/users/id/'+id)
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function (err, res) {
			if (err) { return done(err); }
			res.body.should.have.property('username', 'testuser');
			res.body.should.have.property('name', 'test user');
			done();
		});
	});
	it('should be able to read user with username', function(done) {
		agent
		.get('/api/users/'+username)
		.expect(200)
		.expect('Content-Type', /json/)
		.end(function (err, res) {
			if (err) { return done(err); }
			res.body.should.have.property('username', 'testuser');
			res.body.should.have.property('name', 'test user');
			done();
		});
	});

	it('should return error code if username is not registered', function(done) {
		agent
		.get('/api/users/'+'fakeuser')
		.end(function (err, res) {
			should(res.statusCode).be.equal(404);
			done();
		});
	});

	
});