'use strict';

angular.module('fullstack')
  .controller('LoginController', function ($scope, Auth, $location) {
    $scope.user     = {};
    $scope.errors   = {};
    $scope.remember = true;

    $scope.login = function(form) {
      $scope.submitted = true;
      
      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        }, $scope.remember)
        .then( function() {
          $scope.closeModal();
          $location.path('/');
        })
        .catch( function(err) {
          // Update validity of form fields that match the mongoose errors
          form['email'].$setValidity('mongoose', false);
          $scope.errors['email'] = err.data.message;

        });
      }
    };
  });