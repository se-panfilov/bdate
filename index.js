'use strict';

angular.module('demo', [
    'bdate'
])

    .controller('DemoPageCtrl', function ($scope, $http) {

        $scope.settings = {
            "week": ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
            "today": {
                "day": 3,
                "month": 1,
                "year": 2010
            },
            "format": "dd-MM-yyyy",
            "range_delimiter": "--"
        };

        $scope.refreshData = function (m, y) {
            var defVal = "1-2010";
            var params = (m && y) ? m + '-' + y : defVal;
            var url = 'http://localhost:3000/resp/' + params;

            $http.get(url).success(function (data) {
                $scope.source = data;
            }).error(function (data, status) {
                console.error(status);
            });

        };

        $scope.refreshStartData = function (m, y) {
            var defVal = "1-2010";
            var params = (m && y) ? m + '-' + y : defVal;
            var url = 'http://localhost:3000/resp/' + params;

            $http.get(url).success(function (data) {
                $scope.startSource = data;
                $scope.startSource.comment = 'start';
            }).error(function (data, status) {
                console.error(status);
            });
        };

        $scope.refreshEndData = function (m, y) {
            var defVal = "1-2010";
            var params = (m && y) ? m + '-' + y : defVal;
            var url = 'http://localhost:3000/resp/' + params;

            $http.get(url).success(function (data) {
                $scope.endSource = data;
                $scope.endSource.comment = 'end';
            }).error(function (data, status) {
                console.error(status);
            });
        };

        //$scope.delayedDemoData = {};
        //
        //function copy(sourceObj) {
        //    return JSON.parse(JSON.stringify(sourceObj));
        //}
        //
        //$timeout(function () {
        //    $scope.delayedDemoData = copy($scope.demoData);
        //}, 2000);
        //
        //$scope.resultModel = '';
        //$scope.resultDelayedModel = '';
        //$scope.resultLinkedModel = '';
        //$scope.externalModel = '';
    })
;
