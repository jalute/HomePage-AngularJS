angular.module('VPT.basics', ['ngRoute', 'ngSanitize'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/vpt/intro', {
            templateUrl: 'vpt/basics.html',
            controller: 'vptBasicsCtrl'
        });


    }])

    .directive('bsPopover', function() {
        return function(scope, element, attrs) {
            console.log("popover called");
            $('[data-toggle="popover"]').popover({ placement: 'left', html: 'true'});
        }
    })


    .directive('myScrollSpy', function($location, $window) {
        $('[data-spy="scroll"]').each(function () {
            var $spy = $(this).scrollspy('refresh')
        })
    })

    .controller('vptBasicsCtrl', ['$rootScope','$scope', '$http', function($rootScope, $scope, $http) {
        console.log("In vptBasicsCtrl...");

        $scope.pokerHands = [];

        // set breadcrumb
        $scope.activeBasics = "active";
        $scope.activeTactics = "";
        $scope.activePractice = "";


//    console.log("fetching pokerHands.json");
        $http.get('data/pokerHands.json').success(function(data) {
//    console.log("fetch successful!");
            $scope.pokerHands = data;
        });

        $scope.onHistoryClick = function() {
            $('#collapseHistory').toggleClass('collapse');
        };

    }])
;