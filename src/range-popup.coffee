angular.module 'bdate.popup', [
  'bdate.templates'
]

.directive 'bdateRangePopup', () ->
  restrict: 'E'
  replace: true
  templateUrl: 'range-popup.html'
  scope:
    popupState: '='
    popupSource: '='
    popupResult: '='
    popupRefresh: "&?"
  link: (scope) ->
    scope.popup =
      hidePopup: (isStartPopup) ->
        scope.popupState.isOpen = false
      selectDate: (isStartPopup, date) ->
        scope.popupResult = date
        scope.popup.hidePopup()
        if not scope.popup.isDayInSelectedMonth date
          scope.popup.refreshSelectedData date.month, date.year
      goPrevYear: (isStartPopup) ->
        return if not scope.popupSource.selected or not scope.popupSource.selected.year
        if scope.popupSource.selected.year.isStart
          console.error 'error'
          return false
        year = scope.popupSource.selected.year.num - 1
        month = scope.popupSource.selected.month.num
        scope.popup.refreshSelectedData month, year
      isFirstYear: (isStartPopup) ->
        return if not scope.popupSource or not scope.popupSource.selected
        return scope.popupSource.selected.year.isStart
      goPrevMonth: (isStartPopup) ->
        return if not scope.popupSource.selected or not scope.popupSource.selected.year
        if scope.popupSource.selected.month.isStart and scope.popupSource.selected.year.isStart
          console.error 'error'
          return false

        december = 12
        month = scope.popupSource.selected.month.num

        if scope.popupSource.selected.month.isStart
          year = scope.popupSource.selected.year.num - 1
          month = december
        else if scope.popupSource.selected.month.isStart and scope.popupSource.selected.year.isStart
          console.error 'error'
          return false
        else
          year = scope.popupSource.selected.year.num
          month = scope.popupSource.selected.month.num - 1

        scope.popup.refreshSelectedData month, year
      isFirstMonth: (isStartPopup) ->
        return if not scope.popupSource or not scope.popupSource.selected
        return scope.popupSource.selected.month.isStart
      goNextMonth: (isStartPopup) ->
        return if not scope.popupSource.selected or not scope.popupSource.selected.year
        if scope.popupSource.selected.month.isEnd and scope.popupSource.selected.year.isEnd
          console.error 'error'
          return false

        january = 1
        month = scope.popupSource.selected.month.num

        if scope.popupSource.selected.month.isEnd
          year = scope.popupSource.selected.year.num + 1
          month = january
        else if scope.popupSource.selected.month.isEnd and scope.popupSource.selected.year.isEnd
          console.error 'error'
          return false
        else
          year = scope.popupSource.selected.year.num
          month = scope.popupSource.selected.month.num + 1

        scope.popup.refreshSelectedData month, year
      isLastMonth: (isStartPopup) ->
        return if not scope.popupSource or not scope.popupSource.selected
        return scope.popupSource.selected.month.isEnd
      goNextYear: (isStartPopup) ->
        return if not scope.popupSource.selected or not scope.popupSource.selected.year
        if scope.popupSource.selected.year.isEnd
          console.error 'error'
          return false
        year = scope.popupSource.selected.year.num + 1
        month = scope.popupSource.selected.month.num
        scope.popup.refreshSelectedData month, year
      isLastYear: (isStartPopup) ->
        return if not scope.popupSource or not scope.popupSource.selected
        return scope.popupSource.selected.year.isEnd
      isSelectedDay: (date) ->
        return if not scope.popupResult or not scope.popupResult.day
        return ((date.day is scope.popupResult.day) and (date.month is scope.popupResult.month) and (date.year is scope.popupResult.year))
      getTodayDateTime: (isStartPopup) ->
        return if not scope.popupSource or not scope.popupSource.today
        today = scope.popupSource.today
        return new Date(today.year, today.month - 1, today.day).getTime()
      isDayInSelectedMonth: (isStartPopup, date) ->
        return ((date.month is scope.popupSource.selected.month.num) and (date.year is scope.popupSource.selected.year.num))
      goToYear: (isStartPopup) ->
        year = scope.popupSource.selected.year.num
        month = scope.popupSource.selected.month.num
        scope.popup.refreshSelectedData month, year
      refreshSelectedData: (month, year) ->
        scope.popupRefresh
          m: month
          y: year

    scope.$watch 'popupSource', ->
      scope.isDataReady = true
    , true
