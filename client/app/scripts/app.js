'use strict';

/**
 * @ngdoc overview
 * @name uMasterApp
 * @description
 * # uMasterApp
 *
 * Main module of the application.
 */
angular
  .module('uMasterApp', [
    'restangular',
    'btford.socket-io',
    'auth0',
    'angular-storage',
    'angular-jwt',
    'ngRoute',
    'ngResource',
    'ui.materialize',
    'config'
  ])
  .config(function ($routeProvider, $httpProvider, RestangularProvider, authProvider, jwtInterceptorProvider, ENV) {
    var baseUrl;
    if (ENV == "development") {
      baseUrl = "http://localhost:3031";
    } else if (ENV == "production") {
      baseUrl = "https://api.umaster.xyz";
    } else if (ENV == "production-test") {
      baseUrl = "https://apidev.umaster.xyz";
    }

    RestangularProvider.setBaseUrl(baseUrl);

    jwtInterceptorProvider.tokenGetter = ['store', function(store) {
      // Return the saved token
      return store.get('token');
    }];

    $httpProvider.interceptors.push('jwtInterceptor');

    authProvider.init({
      domain: 'razvanilin.eu.auth0.com',
      clientID: 'cYRmkEJu68e2OuKKQj371CaPLR5ZYLio'
    });

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .factory('User', function(Restangular) {
    return Restangular.service('user');
  })
  .factory('Script', function(Restangular) {
    return Restangular.service('script');
  })
  .factory('umasterSocket', function(socketFactory, store, ENV) {
    var socketUrl;
    if (ENV == 'production') {
      socketUrl = "https://api.umaster.xyz";
    } else if (ENV == 'production-test') {
      socketUrl = "https://apidev.umaster.xyz";
    } else if (ENV == 'development') {
      socketUrl = "http://localhost:3031";
    }

    var socket;
    if (store.get('profile')) {
      socket = socketFactory({
        ioSocket: io.connect(socketUrl, {
          query: "email=" + store.get('profile').email + "&type=web"
        })
      });
    } else {
      socket = socketFactory();
    }

    return socket;
  })
  .run(function($rootScope, auth, store, jwtHelper, $location) {
    // This events gets triggered on refresh or URL change
    $rootScope.$on('$locationChangeStart', function() {
      var token = store.get('token');
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          if (!auth.isAuthenticated) {
            auth.authenticate(store.get('profile'), token);
          }
        } else {
          // Either show the login page or use the refresh token to get a new idToken
          $location.path('/');
        }
      }
    });
  });
