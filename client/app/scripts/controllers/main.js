'use strict';

/**
 * @ngdoc function
 * @name uMasterApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the uMasterApp
 */
angular.module('uMasterApp')
  .controller('MainCtrl', function ($scope, User, auth, store, $location) {
    $scope.viewSignup = true;
    $scope.user = {};

    if (store.get('profile')) {
      $scope.profile = store.get('profile');
      $scope.loggedin = true;
    }

    $scope.signin = function() {
      auth.signin({}, function (profile, token) {
        // Success callback
        store.set('profile', profile);
        store.set('token', token);
        $scope.profile = profile;
        $scope.loggedin = true;
        $location.path('/');
      }, function () {
        // Error callback
      });
    };

    $scope.logout = function() {
      auth.signout();
      store.remove('profile');
      store.remove('token');
      $scope.loggedin = false;
      $scope.profile = {};
    };

  });
