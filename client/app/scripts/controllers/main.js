'use strict';

/**
 * @ngdoc function
 * @name uMasterApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the uMasterApp
 */
angular.module('uMasterApp')
  .controller('MainCtrl', function ($scope, User) {
    $scope.viewSignup = true;
    $scope.user = {};

    $scope.login = function() {
      $scope.viewSignup = false;
      console.log($scope.user);
      User.one('login').customPOST($scope.user).then(function(data) {
        console.log(data);
      }, function(response) {
        console.log(response);
      });
    };

    $scope.signup = function() {
      $scope.viewSignup = true;

      User.one('signup').customPOST($scope.user).then(function(data) {
        console.log(data);
      }, function(response) {
        console.log(response);
      });
    };
  });
