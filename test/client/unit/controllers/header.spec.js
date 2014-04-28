'use strict';

describe('Application header', function() {
	var scope, rootScope, q, controller, deferred, location = '/random';

	var mockAuth = {
		session: {
			username: 'test',
			password: 'password'
		},
		login: function (user) {
			deferred = q.defer();
			this.session = user;
			rootScope.currentUser = user;
			deferred.resolve();
            return deferred.promise;
		},
		logout: function () {
			deferred = q.defer();
			location = '/';
			this.session = {};
			return deferred.promise;
		}
	};

	beforeEach(module('fullstack')); 

	beforeEach(function() {
		inject(function ($rootScope, $q, $controller) {
			rootScope  = $rootScope;
			scope = $rootScope.$new();
			q = $q;
			controller = $controller('HeaderController', {
				$scope:    scope,
				$location: location,
				Auth:      mockAuth
			});
		});
	});

	it('should start in the /random path', function() {
		expect(location).toBe('/random');
		expect(mockAuth.session.username).toBe('test');
	});

	it('should go back to / after logging out', function() {
		scope.logout();
		expect(location).toBe('/');
		expect(mockAuth.session.username).toBeUndefined();
	});
});