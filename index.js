'use strict';

angular.module('app', [
    'bdate'
])

    .controller('IndexPageCtrl', function ($scope, $timeout) {

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

        $scope.controls = {
            setToday: function () {
                $scope.resultModel = $filter('date')(new Date(2010, 1, 15), $scope.settings.format)
            },
            setTodayRanged: function () {
                var dates = {
                    start: $filter('date')(new Date(2010, 0, 1), $scope.settings.format),
                    end: $filter('date')(new Date(2010, 1, 20), $scope.settings.format)
                };

                $scope.resultRangeModel = dates.start + $scope.settings.range_delimiter + dates.end;
            }
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
    })
;
