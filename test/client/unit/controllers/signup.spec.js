'use strict';

describe('Signup controller test', function() {
	var scope, q, deferred, controller, location = '/';

	var mockAuth = {
		user: {},
		createUser: function(userInfo){
			deferred = q.defer();
			this.user = userInfo;
			deferred.resolve();
            return deferred.promise;
		}
	};

	beforeEach(module('fullstack'));

	beforeEach(function() {
		inject(function ($rootScope, $q, $controller) {
			scope = $rootScope.$new();
			q = $q;
			controller = $controller('SignupController', {
				$scope: scope,
				location: location,
				Auth: mockAuth
			});
		});
	});

	it('should send user information to Auth', function() {
		scope.user = {
			username: 'testu',
			password: 'testp',
			name: 'testn',
			email: 'teste@test.com'
		};
		var form = {};
		form.$valid = true;
		scope.register(form);

		expect(mockAuth.user).toEqual({
			username: 'testu',
			password: 'testp',
			name: 'testn',
			email: 'teste@test.com'
		});

		expect(location).toBe('/');
	});
});