angular.module('bdate.popup', [])

.directive 'bdatePopup', () ->
  {
  restrict: 'E'
  replace: true
  templateUrl: '../dist/templates/popup.html'
#  templateUrl: 'dist/templates/popup.html'
  scope:
    isHidden: '='
  link: (scope, elem) ->
    scope.isHidden = false;

#    scope.togglePopup = () ->
#      console.log 1
  }