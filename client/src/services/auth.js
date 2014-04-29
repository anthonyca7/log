'use strict';

angular.module('fullstack')
  .factory('Auth', [
   '$location',
   '$rootScope', 
   'Session', 
   'User', 
   '$cookieStore',
    function ($location, $rootScope, Session, User, $cookieStore) {

    $rootScope.currentUser = $cookieStore.get('user') || null;
    $cookieStore.remove('user');
    return {
      login: function(user, remember, callback) {
        var cb = callback || angular.noop;

        return Session.save({
          email: user.email,
          password: user.password,
          remember: remember
        }, function(user) {
          $rootScope.currentUser = user;
          return cb();
        }, function(err) {
          return cb(err);
        }).$promise;
      },
      logout: function(callback) {
        var cb = callback || angular.noop;

        return Session.delete(function() {
            $rootScope.currentUser = null;
            return cb();
          },
          function(err) {
            return cb(err);
          }).$promise;
      },
      createUser: function(user, callback) {
        var cb = callback || angular.noop;

        return User.save(user,
          function(user) {
            $rootScope.currentUser = user;
            return cb(user);
          },
          function(err) {
            return cb(err);
          }).$promise;
      },
      changePassword: function(oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.update({
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },
      currentUser: function() {
        return User.get();
      },
      isLoggedIn: function() {
        var user = $rootScope.currentUser;
        return !!user;
      },
    };
  }]);