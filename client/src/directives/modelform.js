'use strict';

angular.module('fullstack')
  .directive('modelform', function ($location) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs, SignupController) {
        scope.closeModal = function () {
            $('.modal').modal('hide');
        }
      }
    }
  });