/**
 * Created by jalute on 2/15/16.
 */
angular.module('VPT.vptScreenShots', ['ngRoute', 'ngSanitize'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/vpt/screenshots', {
            templateUrl: 'screenshots/training.html',
            controller: 'vptScreenCtrl'
        });

    }])

    .controller('vptScreenCtrl', ['$rootScope', function($rootScope) {
        console.log("In vptScreenCtrl...");

        // set navbar
        $rootScope.activeHome = "";
        $rootScope.activePhotos = "";
        $rootScope.activeResume = "";
        $rootScope.activeProjects = "active";

    }])
;
