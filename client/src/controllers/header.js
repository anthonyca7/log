'use strict';

angular.module('fullstack')
	.controller('HeaderController', ['$scope', '$location', 'Auth',
  function($scope, $location, Auth){    
    $scope.logout = function() {
      Auth.logout()
      .then(function() {
        $location.path('/');
      });
    };


  }]);
    
	