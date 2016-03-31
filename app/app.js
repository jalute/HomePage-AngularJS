'use strict';

// Declare app level module which depends on views, and components
angular.module('VPT', [
  'ngRoute',
  'JALUTE.home',
  'JALUTE.resume',
  'JALUTE.projects',
  'VPT.basics',
  'VPT.practice',
  'VPT.tactics',
  'VPT.jacks',
  'VPT.vptScreenShots',
  'VPT.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});

}]);
