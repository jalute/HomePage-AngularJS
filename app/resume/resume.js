angular.module('JALUTE.resume', ['ngRoute', 'ngSanitize'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/resume', {
            templateUrl: 'resume/resume.html',
            controller: 'ResumeCtrl'
        });

    }])

    .controller('ResumeCtrl', ['$rootScope', function($rootScope) {
        console.log("In ResumeCtrl...");

        $rootScope.activeHome = "";
        $rootScope.activePhotos = "";
        $rootScope.activeResume = "active";
        $rootScope.activeProjects = "";

    }])
;