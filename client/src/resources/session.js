'use strict';

angular.module('fullstack')
  .factory('Session', ['$resource', function ($resource) {
    return $resource('/api/session/');
  }]);
