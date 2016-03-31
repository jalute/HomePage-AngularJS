/**
 * Created by jalute on 2/9/16.
 */
angular.module('JALUTE.projects', ['ngRoute', 'ngSanitize'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/projects', {
            templateUrl: 'projects/projects-page.html',
            controller: 'Project1Ctrl'
        });

    }])

    .controller('Project1Ctrl', ['$rootScope','$scope', function($rootScope, $scope) {
        console.log("In Project1Ctrl...");

        // set navbar
        $rootScope.activeHome = "";
        $rootScope.activePhotos = "";
        $rootScope.activeResume = "";
        $rootScope.activeProjects = "active";

    }])
;