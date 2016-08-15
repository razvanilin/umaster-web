'use strict';

/**
 * @ngdoc function
 * @name uMasterApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the uMasterApp
 */
angular.module('uMasterApp')
  .controller('MainCtrl', function ($scope, $window, User, auth, store, $location, umasterSocket, Script, deviceDetector, $timeout) {
    $scope.viewSignup = true;
    $scope.user = {};
    $scope.pinCode = "";
    $scope.connection = {};
    $scope.wallHidden = false;

    $timeout(function() {
      $scope.scrollFireEngaged = true;
    },1000);

    // Socket messages
    umasterSocket.on('refresh-activities', function(data) {
      console.log("hello");
      Script.one().get({user: store.get('profile').email}).then(function(scripts) {
        $scope.scripts = scripts;
      }, function(response) {
        console.log(response);
      });
    });

    umasterSocket.on("register-complete", function(data) {
      console.log(data);
      $scope.connection = data;
    });

    // ---------------------------

    if (store.get('profile')) {
      $scope.loading = true;
      // create or update the user
      User.one().customPOST(store.get('profile')).then(function(user) {
        // console.log(user.token);
        //console.log(user);
        $scope.profile = store.get('profile');
        $scope.profile.type = "web";

        $scope.loggedin = true;
        $scope.loading = false;

        // emit the profile again
        umasterSocket.emit("register", $scope.profile);

        Script.one().get({user: store.get('profile').email}).then(function(scripts) {
          $scope.scripts = scripts;
        }, function(response) {
          console.log(response);
        });

      }, function(response) {
        console.log(response);
        $scope.loading = false;
      });
    }

    $scope.runScript = function(script) {
      script.pinCode = $scope.pinCode;
      script.email = $scope.profile.email;
      umasterSocket.emit('script', script);
    };

    $scope.signin = function() {
      $scope.loading = true;
      auth.signin({}, function (profile, token) {
        // Success callback

        store.set('profile', profile);
        store.set('token', token);

        // create or update the user
        User.one().customPOST(profile).then(function(user) {

          $scope.profile = profile;
          // register the type of the profile
          $scope.profile.type = "web";

          // emit the new profile
          umasterSocket.emit("register", $scope.profile);

          $scope.loggedin = true;
          $scope.loading = false;

          Script.one().get({user: store.get('profile').email}).then(function(scripts) {
            $scope.scripts = scripts;
            // refresh window workaround for refreshing the socket connection settings
            $window.location.reload();
          }, function(response) {
            console.log(response);
          });

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

      umasterSocket.emit('unregister', $scope.profile);
      $scope.profile = {};


      $scope.pinCode = "";
    };

    $scope.downloadClient = function() {
      if (deviceDetector.os == "mac") {
        $window.open("https://github.com/razvanilin/umaster-client/releases/download/untagged-fea942fff905bee46bd5/uMaster-darwin-x64-v0.0.3-alpha.dmg");
      } else {
        $window.open('https://github.com/razvanilin/umaster-client/releases', '_blank');
      }
    }

    $scope.hideWall = function() {
      $scope.wallHidden = true;
      console.log($scope.wallHidden);
      $timeout(function() {
        $scope.showWall();
      });
    }

    $scope.showWall = function() {
      console.log($scope.wallHidden);
    }
  });
