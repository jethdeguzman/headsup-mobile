// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

.run(function($ionicPlatform, $ionicHistory) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $ionicPlatform.registerBackButtonAction(function (event) {
      if ($ionicHistory.currentStateName() === 'login'){
        event.preventDefault();
      } else {
        $ionicHistory.goBack();
      }
    }, 100);
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('app.categories', {
    url: '/categories',
    views: {
      'menuContent': {
        templateUrl: 'templates/categories.html',
        controller: 'CategoriesCtrl'
      }
    }
  })

  .state('app.alerts', {
    url: '/alerts',
    views: {
      'menuContent': {
        templateUrl: 'templates/alerts.html',
        controller: 'AlertsCtrl'
      }
    },
    reload:true,
  })

  .state('app.alerts-create', {
    url: '/alerts/create?categoryId',
    views: {
      'menuContent': {
        templateUrl: 'templates/create-alert.html',
        controller: 'CreateAlertCtrl'
      }
    }
  })

  .state('app.single', {
    url: '/alerts/:alertId',
    views: {
      'menuContent': {
        templateUrl: 'templates/alert.html',
        controller: 'AlertCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/categories');
});
