'use strict';

/**
 * Created by jalute on 1/7/16.
 */
angular.module('JALUTE.home', ['ngRoute', 'ngSanitize'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'home/home2.html',
            controller: 'Home1Ctrl'
        });

    }])

    .controller('Home1Ctrl', ['$rootScope','$scope', function($rootScope, $scope) {
        console.log("In Home1Ctrl...");

        // set navbar
        $rootScope.activeHome = "active";
        $rootScope.activeBasics = "";
        $rootScope.activeTactics = "";
        $rootScope.activePractice = "";

    }])
;