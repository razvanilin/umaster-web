'use strict';

/**
 * @ngdoc function
 * @name uMasterApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the uMasterApp
 */
angular.module('uMasterApp')
  .controller('MainCtrl', function ($scope, User, auth, store, $location, umasterSocket, Script) {
    $scope.viewSignup = true;
    $scope.user = {};
    $scope.pinCode = "";

    if (store.get('profile')) {
      $scope.loading = true;
      // create or update the user
      User.one().customPOST({user: store.get('profile')}).then(function(user) {

        console.log(user);
        $scope.profile = store.get('profile');
        $scope.loggedin = true;
        $scope.loading = false;

      }, function(response) {
        console.log(response);
        $scope.loading = false;
      });

      Script.one().get({user: store.get('profile').email}).then(function(scripts) {
        $scope.scripts = scripts;
      }, function(response) {
        console.log(response);
      });
    }

    $scope.runScript = function(script) {
      script.pinCode = $scope.pinCode;
      script.email = $scope.profile.email;
      console.log(script);
      umasterSocket.emit('script', script);
    };

    $scope.signin = function() {
      $scope.loading = true;
      auth.signin({}, function (profile, token) {
        // Success callback
        console.log(profile);

        // create or update the user
        User.one().customPOST({user: profile}).then(function(user) {

          console.log(user);
          store.set('profile', profile);
          store.set('token', token);
          $scope.profile = profile;
          $scope.loggedin = true;
          $scope.loading = false;

        }, function(response) {
          console.log(response);
          $scope.loading = false;
        });
      }, function () {
        // Error callback
        $scope.loading = false;
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
