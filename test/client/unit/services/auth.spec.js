'use strict';

describe('auth factory', function() {
	var factory, q, deferred, mockSession, mockUsers, User, Session, usermock, sessionmock,
		$rootScope, cbText='';

	beforeEach(module('fullstack'), function ($provide) {
	  sessionmock = jasmine.createSpyObj('Session', ['save', 'delete']);
	  usermock = jasmine.createSpyObj('User', ['save']);

	  $provide.value('User', usermock);
	  $provide.value('Session', sessionmock);
	}); 

	beforeEach(function() {
		inject(function (Auth, _$rootScope_, _User_, _Session_, $q) {
			factory = Auth;
			$rootScope = _$rootScope_;
			Session = _Session_;
			User = _User_;
			q = $q;
		});

		mockSession = {};
		mockUsers = [
			{username: 'test', password: 'test-password', name: 'test user', email: 'test@test.com'}
		];
		spyOn(Session, 'save').and.callFake(function (userInfo, succCb, errCb) {
			deferred = q.defer();
			mockUsers.forEach(function(item){
				if (userInfo && userInfo.username && userInfo.password &&
					item.username === userInfo.username && 
					item.password === userInfo.password) {

					mockSession = userInfo;
					succCb(item);
					return deferred.promise;
				}
			});
			errCb('err');
			return deferred.promise;
		});
		spyOn(Session, 'delete').and.callFake(function (cb) {
			deferred = q.defer();
			mockSession = {};
			cb();
			return deferred.promise;
		});
		spyOn(User, 'save').and.callFake(function(user, cb){
			deferred = q.defer();
			mockUsers.push(user);
			mockSession = user;
			cb();
			return deferred.promise;
		});
	});

	it('should save a new user', function() {
		factory.createUser({
			username: 'test2', email: 'test2@test2.com', 
			password: 'test2', name: 'test 2'},
			function (err) {
				if (err) {cbText=err; return;}
				cbText = 'success';
				return;
			}
		);

		expect(cbText).toBe('success');
		expect(mockUsers.length).toBe(2);
	});

	it('should be able to save a session', function() {
		var user = {username: 'test', password: 'test-password'};
		factory.login(user, function () {
			cbText = 'success';
			return;
		});
		expect(cbText).toBe('success');
		expect($rootScope.currentUser).toEqual({
			username: 'test',
			password: 'test-password', 
			name: 'test user', 
			email: 'test@test.com'
		});
	});

	it('should be able to delete a session', function() {
		var user = {username: 'test', password: 'test-password'};
		factory.login(user, function () {
			cbText = 'success';
			return;
		});
		expect($rootScope.currentUser).toEqual({
			username: 'test',
			password: 'test-password', 
			name: 'test user', 
			email: 'test@test.com'
		});
		factory.logout(function () {
			cbText = 'successful-logout';
			return;
		});
		expect($rootScope.currentUser).toBe(null);
		expect(cbText).toBe('successful-logout');
	});

	it('should be able to tell if a user is logged in', function() {
		expect(factory.isLoggedIn()).toBe(false);

		var user = {username: 'test', password: 'test-password'};
		factory.login(user, function () {
			cbText = 'success';
			return;
		});

		expect(factory.isLoggedIn()).toBe(true);
	});

});