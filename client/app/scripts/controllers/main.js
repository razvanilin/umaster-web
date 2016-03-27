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
    $scope.viewNewScript = false;

    if (store.get('profile')) {
      $scope.loading = true;
      // create or update the user
      User.one().customPOST({user: store.get('profile')}).then(function(user) {

        console.log(user);
        $scope.profile = store.get('profile');
        $scope.loggedin = true;

        umasterSocket.emit('register', $scope.profile);
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
    umasterSocket.on('lock-accepted', function(data) {
      if (data.pinCode == $scope.pinCode) {
        Script.one('lock').get().then(function(data) {
          console.log(data);
        });
      } else {
        console.log("Lock denied.");
      }
    });

    $scope.lockScript = function() {
      umasterSocket.emit('lock', $scope.profile);
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
          umasterSocket.emit('register', $scope.profile);
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

      umasterSocket.emit('unregister', $scope.profile);
      $scope.pinCode = "";
    };

    $scope.prepareScript = function() {
      $scope.viewNewScript = !$scope.viewNewScript;

      if (!$scope.viewNewScript) {
        $scope.script = {};
        $scope.scriptError = false;
      }
    };

    $scope.addScript = function() {
      $scope.loading = true;
      Script.one().customPOST({user: $scope.profile.email, script: $scope.script})
      .then(function(scripts) {
        $scope.scripts = scripts;
        console.log(scripts);
        $scope.viewNewScript = false;
        $scope.loading = false;
        $location.path("/");
      }, function(response) {
        console.log(response);
        $scope.scriptError = response.data;
        $scope.loading = false;
      });
    };

    $scope.deleteScript = function(scriptName) {
      $scope.loading = true;

    };

  });
