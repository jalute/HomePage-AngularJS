/**
 * Created by jalute on 2/9/16.
 */
angular.module('VPT.vpIntro', ['ngRoute', 'ngSanitize'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/vpIntro', {
            templateUrl: 'intro/videoPokerIntro.html',
            controller: 'vpIntroCtrl'
        });

    }])

    .controller('vpIntroCtrl', ['$scope', function($scope) {
        console.log("In vpIntroCtrl...");

        $rootScope.activeHome = "";
        $rootScope.activePhotos = "";
        $rootScope.activeResume = "";
        $rootScope.activeProjects = "active";

    }])
;