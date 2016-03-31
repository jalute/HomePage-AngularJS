/**
 * Created by jalute on 2/18/16.
 */
angular.module('VPT.tactics', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/vpt/tactics', {
            templateUrl: 'vpt/tactics.html',
            controller: 'vptTacticsCtrl'
        });
    }])

    .controller('vptTacticsCtrl', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {

        console.log("In vptTacticsCtrl...");

        $scope.basicScenarios = [];
        $scope.advanceScenarios = [];
        $scope.subView = "hold";

        // set breadcrumb
        $scope.activeBasics = "";
        $scope.activeTactics = "active";
        $scope.activePractice = "";


        console.log("fetching basicTactics.json");
        $http.get('data/basicTactics.json').success(function(data) {
            //$http.get('data/advanceTactics.json').success(function(data) {
            //console.log("fetch successful!");
            $scope.basicScenarios = data;
        });

        console.log("fetching advanceTactics.json");
        $http.get('data/advanceTactics.json').success(function(data) {
            //console.log("fetch successful!");
            $scope.advanceScenarios = data;
        });

        $scope.onSolutionClick = function(scenario) {
            console.log("in onSolutionClick...");
            //scenario.showSolutionTitle = scenario.solutionTitle;
            //scenario.showSolutionText = scenario.solutionText;
            if (scenario.hiddenCss == "hidden") {
                scenario.hiddenCss = "";
            }
            else {
                scenario.hiddenCss = "hidden";
            }

        };

        $scope.onBlueGuessClick = function(scenario) {
            if (scenario.solutionCss == "scenario-blue") {
                scenario.rightCss = "";
                scenario.wrongCss = "hidden";
                scenario.rightWrong = "Right!"
            }
            else {
                scenario.rightCss = "hidden";
                scenario.wrongCss = "";
                scenario.rightWrong = "Wrong!"
            }

            if (scenario.hiddenCss == "hidden") {
                scenario.hiddenCss = "";
            }
        };

        $scope.onGreenGuessClick = function(scenario) {
            if (scenario.solutionCss == "scenario-green") {
                scenario.rightCss = "";
                scenario.wrongCss = "hidden";
                scenario.rightWrong = "Right!"
            }
            else {
                scenario.rightCss = "hidden";
                scenario.wrongCss = "";
                scenario.rightWrong = "Wrong!"
            }

            if (scenario.hiddenCss == "hidden") {
                scenario.hiddenCss = "";
            }
        };

        $scope.showSubview = function(newSubview) {
            $scope.subView = newSubview;
        }


    }]);