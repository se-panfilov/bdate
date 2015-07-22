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

    scope.popup =
      hidePopup: ->
        scope.popupState.isOpen = false
      selectDate: (date) ->
        scope.popupResult = date
        scope.popup.hidePopup()
      goPrevYear: () ->
        console.warn 'not implemented yet'
      isFirstYear: () ->
        return if not scope.popupSource or not scope.popupSource.selected
        return scope.popupSource.selected.year.isStart
      goPrevMonth: () ->
        console.warn 'not implemented yet'
      isFirstMonth: () ->
        return if not scope.popupSource or not scope.popupSource.selected
        return scope.popupSource.selected.month.isStart
      goNextMonth: () ->
        console.warn 'not implemented yet'
      isLastMonth: () ->
        return if not scope.popupSource or not scope.popupSource.selected
        return scope.popupSource.selected.month.isEnd
      goNextYear: () ->
        console.warn 'not implemented yet'
      isLastYear: () ->
        return if not scope.popupSource or not scope.popupSource.selected
        return scope.popupSource.selected.year.isEnd
      isSelectedDay: (date) ->
        return if not scope.popupResult or not scope.popupResult.day
        return ((date.day is scope.popupResult.day) and (date.month is scope.popupResult.month) and (date.year is scope.popupResult.year))
      getTodayDateTime: () ->
        return if not scope.popupSource or not scope.popupSource.today
        today = scope.popupSource.today
        return new Date(today.year, today.month - 1, today.day).getTime()
      isDayInSelectedMonth: (date) ->
        return ((date.month is scope.popupSource.selected.month.num) and (date.year is scope.popupSource.selected.year.num))

    scope.$watch 'popupSource', ->
      scope.isDataReady = true
    , true
