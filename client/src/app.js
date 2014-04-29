'use strict';

angular.module('fullstack', [
	'ngCookies',
	'ngResource', 
	'ngRoute', 
])
	.config([
		'$routeProvider', 
		'$locationProvider', 
		function($routeProvider, $locationProvider) {
			$routeProvider
			.when('/',{
				templateUrl: 'partials/main'
			})
			.when('/profile',{
				templateUrl: 'partials/profile'
			})
			// .when('/signup',{
			// 	templateUrl: 'partials/signup',
			// 	controller: 'SignupController'
			// })
			// .when('/login', {
			// 	templateUrl: 'partials/login',
			// 	controller: 'LoginController'
			// })
			// .when('/password', {
			// 	templateUrl: 'partials/password',
			// 	controller: 'ChangePassword',
			// 	authenticate: true
			// })
			.otherwise({
		    	redirectTo: '/'
		    });

			$locationProvider.html5Mode(true);
	}])
	.run([
		'$rootScope',
		'$location', 
		'Auth',
		function ($rootScope, $location, Auth) {
		    $rootScope.$on('$routeChangeStart', function (event, next) {
		      if (next.authenticate && !Auth.isLoggedIn()) {
		        $location.path('/login');
		      }
		    });
  	}]);
