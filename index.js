'use strict';

angular.module('demo', [
    'bdate'
])

    .controller('DemoPageCtrl', function ($scope, $http, $filter) {

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

        $scope.commonCase = {};
        $scope.rangedCase = {};
        $scope.linkedCase = {};

    })

    .directive('modelWell', function ($filter) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                caseModel: '='
            },
            template: '<section class=well>' +
            '<div><span>Value:</span>&nbsp;<span ng-bind=caseModel.model></span></div>' +
            '<div><span>Start limit:</span>&nbsp;<span ng-bind=caseModel.startDate></span>&nbsp;<span>({{getDate(caseModel.startDate)}})</span></div>' +
            '<div><span>End limit:</span>&nbsp;<span ng-bind=caseModel.endDate></span>&nbsp;<span>({{getDate(caseModel.endDate)}})</span></div>' +
            '<div><button type="button" ng-click="plusOneMonth()">+1 month</button></div>' +
            '<div><button type="button" ng-click="minusOneMonth()">-1 month</button></div>' +
            '</section>',
            link: function (scope) {
                var dateFormat = 'dd-MM-yyyy';
                var dateRegex = /\d+/g;

                scope.getDate = function (datetime) {
                    if (!datetime) return ' none ';

                    return $filter('date')(new Date(datetime), dateFormat);
                };

                scope.plusOneMonth = function () {
                    var dateArr = (scope.caseModel.model).match(dateRegex);
                    var date = new Date(dateArr[2], dateArr[1] - 1, dateArr[0]);
                    if (date.getMonth() === 11) {
                        date.setMonth(0);
                        date.setFullYear(date.getFullYear() + 1)
                    } else {
                        date.setMonth(date.getMonth() + 1);
                    }

                    scope.caseModel.model = $filter('date')(date, dateFormat);
                };

                scope.minusOneMonth = function () {
                    var dateArr = (scope.caseModel.model).match(dateRegex);
                    var date = new Date(dateArr[2], dateArr[1] - 1, dateArr[0]);

                    if (date.getMonth() === 0) {
                        date.setMonth(11);
                        date.setFullYear(date.getFullYear() - 1)
                    } else {
                        date.setMonth(date.getMonth() - 1);
                    }

                    scope.caseModel.model = $filter('date')(date, dateFormat);
                };
            }
        };
    })


;
