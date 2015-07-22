angular.module 'bdate.popup', [
  'bdate.templates'
]

.directive 'bdatePopup', () ->
  restrict: 'E'
  replace: true
  templateUrl: 'popup.html'
  scope:
    popupState: '='
    popupSource: '='
    popupResult: '='
  link: (scope) ->

    console.log scope.popupSource
    
    scope.popup =
      hidePopup: ->
        scope.popupState.isOpen = false
      selectDate: (date) ->
        scope.popupResult =
        scope.popup.hidePopup()
      goPrevYear: () ->
        console.warn 'not implemented yet'
      isFirstYear: () ->
        console.warn 'not implemented yet'
      goPrevMonth: () ->
        console.warn 'not implemented yet'
      isFirstMonth: () ->
        console.warn 'not implemented yet'
      goNextMonth: () ->
        console.warn 'not implemented yet'
      isLastMonth: () ->
        console.warn 'not implemented yet'
      goNextYear: () ->
        console.warn 'not implemented yet'
      isLastYear: () ->
        console.warn 'not implemented yet'
      isSelectedDay: (day) ->
        console.warn 'not implemented yet'
      getToday: () ->
        console.warn 'not implemented yet'
      isDayInSelectedMonth: (day) ->
        console.warn 'not implemented yet'

    scope.$watch 'popupSource', ->
      scope.isDataReady = true
    , true
