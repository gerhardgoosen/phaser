'use strict';

// Declare app level module which depends on views, and components
var myPhaserApp = angular.module('myPhaserApp', [
  'ngRoute',
//  'myPhaserApp.mygame',
  'myPhaserApp.invaders',
  'myPhaserApp.breakout',
  'myPhaserApp.tanks',
  'myPhaserApp.defender'

]);
myPhaserApp.config(['$locationProvider', '$routeProvider'
 , function($locationProvider, $routeProvider) {

  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/tanks'});

}]);
//phaser
var game;
