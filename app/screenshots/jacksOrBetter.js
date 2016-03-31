/**
 * Created by jalute on 2/15/16.
 */
angular.module('VPT.jacks', ['ngRoute', 'ngSanitize'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/jacks', {
            templateUrl: 'screenshots/JacksOrBetter.html',
            controller: 'Jacks1Ctrl'
        });

    }])

    .controller('Jacks1Ctrl', ['$rootScope','$scope', function($rootScope, $scope) {
        console.log("In Jacks1Ctrl...");

        // set navbar
        $rootScope.activeHome = "";
        $rootScope.activePhotos = "";
        $rootScope.activeResume = "";
        $rootScope.activeProjects = "active";

    }])
;