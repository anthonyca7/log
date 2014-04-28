'use strict';

describe('Application login', function() {
	var scope, rootScope, q, controller, deferred, location = '/random';

	var mockAuth = {
		session: {},
		login: function (user) {
			deferred = q.defer();
			rootScope.currentUser = user;
			this.session = user;
			deferred.resolve();
            return deferred.promise;
		}
	};

	beforeEach(module('fullstack')); 

	beforeEach(function() {
		inject(function ($rootScope, $q, $controller) {
			rootScope  = $rootScope;
			scope = $rootScope.$new();
			q = $q;
			controller = $controller('LoginController', {
				$scope:    scope,
				Auth:      mockAuth,
				$location: location
			});
		});
	});

	it('should have an empty section', function() {
		expect(mockAuth.session.username).toBeUndefined();
	});

	it('should start in the /random path', function() {
		expect(location).toBe('/random');
	});

	it('should go back to / after logging out', function() {
		var form = {};
		form.$valid = true;
		scope.user.username = 'testlogin';
		scope.user.password = 'test';
		scope.login(form);
		expect(mockAuth.session.username).toBe('testlogin');
		expect(mockAuth.session.password).toBe('test');
		expect(rootScope.currentUser.username).toBe('testlogin');
	});
});