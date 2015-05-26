angular.module 'bdate.datepicker', ['bdate.popup']

.directive 'bdatepicker', () ->
  restrict: 'E'
  replace: true
  templateUrl: '../dist/templates/default.html'
#  templateUrl: 'dist/templates/default.html'
  scope:
    source: '='
  link: (scope, elem) ->
    scope.popup =
      isOpen: false;

    scope.togglePopup = () ->
      scope.popup.isOpen = !scope.popup.isOpen;