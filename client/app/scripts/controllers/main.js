'use strict';

/**
 * @ngdoc function
 * @name uMasterApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the uMasterApp
 */
angular.module('uMasterApp')
  .controller('MainCtrl', function ($scope, $window, User, auth, store, $location, umasterSocket, Script, $timeout) {
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
      User.one().customPOST(store.get('profile')).then(function(data) {
        document.getElementsByTagName("body")[0].style.backgroundImage = "none";
        document.getElementsByTagName("body")[0].style.backgroundColor = "#4A8E4E";
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
          showAppCues(data.user);
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
      //$scope.loading = true;
      auth.signin({}, function (profile, token) {
        // Success callback
        store.set('profile', profile);
        store.set('token', token);

        // create or update the user
        User.one().customPOST(profile).then(function(data) {
          document.getElementsByTagName("body")[0].style.backgroundImage = "none";
          document.getElementsByTagName("body")[0].style.backgroundColor = "#4A8E4E";

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

    $scope.logOut = function() {
      auth.signout();
      store.remove('profile');
      store.remove('token');
      $scope.loggedin = false;

      umasterSocket.emit('unregister', $scope.profile);
      $scope.profile = {};


      $scope.pinCode = "";

      document.getElementsByTagName("body")[0].style.backgroundImage = "url('/images/blurr-min.jpg')";
      document.getElementsByTagName("body")[0].style.backgroundColor = "none";
    };

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

    // APPCUES stuff
    function showAppCues(user) {
      Appcues.identify(user._id, { // Unique identifier for current user
        name: user.profile.name, // Current user's name
        email: user.email, // Current user's email
        created_at: user.createdAt, // Unix timestamp of user signup date

        // Additional user properties.
        // is_trial: false,
        // plan: "enterprise"
      });

      Appcues.on("flow_finished", function(eventData) {
        // when the welcome flow finished
        console.log("yo");
        if (eventData.flowId == "-KPMhc9-2M8J6PuhTIae") {
          Appcues.show("-KPt2eioAAONS0Gad79g");
        }
      });
    }
  });
