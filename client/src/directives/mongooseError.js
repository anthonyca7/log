'use strict';

angular.module('fullstack')
  .directive('mongooseError', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        element.on('keydown', function() {
          scope.submitted = null;
          console.log('test');
          return ngModel.$setValidity('mongoose', true);
        });
      }
    };
  });