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
        scope.popupResult = date
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
      isDayInSelectedMonth: (date) ->
        return ((date.month is scope.popupSource.selected.month.num) and date.year is scope.popupSource.selected.year.num)

    scope.$watch 'popupSource', ->
      scope.isDataReady = true
    , true
