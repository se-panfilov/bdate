angular.module('bdate.datepicker', [
  'bdate.popup'
])

.directive 'bdatepicker', () ->
  {
  restrict: 'E'
  replace: true
  templateUrl: '../dist/templates/default.html'
#  templateUrl: 'dist/templates/default.html'
  link: (scope, elem) ->

    scope.isPopupOpen = false;

    scope.togglePopup = () ->
      scope.isPopupOpen = !scope.isPopupOpen;
  }