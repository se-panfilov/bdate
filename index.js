'use strict';

angular.module('demo', [
    'bdate'
])

    .controller('DemoPageCtrl', function ($scope, $http) {


        $scope.refreshData = function (month, year) {
            var params = (month && year) ? month + '-' + year : null;
            var url = 'http://localhost:3000/resp/' + params;

            $http.get(url).success(function (data) {
                $scope.demoData = data;
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
