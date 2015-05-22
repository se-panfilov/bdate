angular.module('bdate.datepicker', [])

.directive 'bdatepicker', () ->
  {
  restrict: 'E'
  replace: true
  templateUrl: '../dist/templates/default.html'
#  templateUrl: 'dist/templates/default.html'
  link: (scope, elem) ->

  }