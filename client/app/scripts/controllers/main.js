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

        //console.log(user);
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
      umasterSocket.emit('script', script);
    };

    $scope.signin = function() {
      $scope.loading = true;
      auth.signin({}, function (profile, token) {
        // Success callback
        // create or update the user
        User.one().customPOST({user: profile}).then(function(user) {

          store.set('profile', profile);
          store.set('token', token);
          $scope.profile = profile;
          $scope.loggedin = true;
          $scope.loading = false;

          Script.one().get({user: store.get('profile').email}).then(function(scripts) {
            $scope.scripts = scripts;
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

    $scope.prepareScript = function() {
      $scope.viewNewScript = !$scope.viewNewScript;

      if (!$scope.viewNewScript) {
        $scope.script = {};
        $scope.scriptError = false;
      } else {
        $scope.loading = true;
        Script.one('local').get().then(function(localScripts) {
          $scope.localScripts = localScripts;
          $scope.loading = false;
        }, function(response) {
          console.log(response);
          $scope.loading = false;
        });
      }
    };

    $scope.addScript = function() {
      $scope.loading = true;

      console.log($scope.script.args);
      if ($scope.script.args && $scope.script.args.length > 0)
        $scope.script.args = $scope.script.args.split(",");

      // check to see if this an edit request or creation
      var edit = false;
      for (var i=0; i<$scope.scripts.length; i++) {
        if ($scope.script._id == $scope.scripts[i]._id) {
          edit = true;
          break;
        }
      }

      if (edit) {
        Script.one().customPUT({user: $scope.profile.email, script: $scope.script})
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

      } else {
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
      }
    };

    $scope.deleteScript = function(scriptName) {
      $scope.loading = true;
      Script.one(scriptName).one('remove').customPOST({user:$scope.profile.email}).then(function(scripts) {
        console.log(scripts);
        $scope.scripts = scripts;
        $scope.loading = false;
      }, function(response) {
        $scope.loading = false;
        console.log(response.data);
      });
    };

    $scope.editScript = function(script) {
      $scope.script = script;
      $scope.prepareScript();
    };

    $scope.file_changed = function(element) {

      $scope.$apply(function(scope) {
         var file = element.files[0];

         $scope.script.args = file.path;

         var reader = new FileReader();
         reader.onload = function(e) {
            //
         };
         reader.readAsDataURL(file);
      });
    };

    $scope.selectScriptFile = function() {
      console.log($scope.input.selectedActivity);

      if (!$scope.script) $scope.script = {};
      // add the script file
      $scope.script.script_file = $scope.localScripts[$scope.input.selectedActivity].script_file;
      console.log($scope.script.script_file);
      /*if (typeof $scope.script === typeof undefined) { $scope.script = {}; console.log($scope.script); }
      $scope.script.script_file = $scope.localScripts[$scope.selectedActivity].script_file;
      console.log($scope.script.script_file);*/
    };

  });
