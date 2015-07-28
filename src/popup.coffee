angular.module 'bdate.popup', [
  'bdate.templates'
]

.directive 'bdatePopup', () ->
  restrict: 'E'
  replace: true
  templateUrl: 'popup.html'
  scope:
    popupState: '='
    popupSettings: '='
    popupSource: '='
    popupResult: '='
    popupRefresh: "&?"
  link: (scope) ->

    scope.popup =
      hidePopup: ->
        scope.popupState.isOpen = false
      selectDate: (date) ->
        scope.popupResult = date
        scope.popup.hidePopup()
        if not scope.popup.isDayInSelectedMonth date
          scope.popup.refreshSelectedData date.month, date.year
      goPrevYear: () ->
        return if not scope.popupSource or not scope.popupSource.year
        if scope.popupSource.year.isStart
          console.error 'error'
          return false
        year = scope.popupSource.year.num - 1
        month = scope.popupSource.month.num
        scope.popup.refreshSelectedData month, year
      isFirstYear: () ->
        return if not scope.popupSource or not scope.popupSource
        return scope.popupSource.year.isStart
      goPrevMonth: () ->
        return if not scope.popupSource or not scope.popupSource.year
        if scope.popupSource.month.isStart and scope.popupSource.year.isStart
          console.error 'error'
          return false

        december = 12
        month = scope.popupSource.month.num

        if scope.popupSource.month.isStart
          year = scope.popupSource.year.num - 1
          month = december
        else if scope.popupSource.month.isStart and scope.popupSource.year.isStart
          console.error 'error'
          return false
        else
          year = scope.popupSource.year.num
          month = scope.popupSource.month.num - 1

        scope.popup.refreshSelectedData month, year
      isFirstMonth: () ->
        return if not scope.popupSource or not scope.popupSource
        return scope.popupSource.month.isStart
      goNextMonth: () ->
        return if not scope.popupSource or not scope.popupSource.year
        if scope.popupSource.month.isEnd and scope.popupSource.year.isEnd
          console.error 'error'
          return false

        january = 1
        month = scope.popupSource.month.num

        if scope.popupSource.month.isEnd
          year = scope.popupSource.year.num + 1
          month = january
        else if scope.popupSource.month.isEnd and scope.popupSource.year.isEnd
          console.error 'error'
          return false
        else
          year = scope.popupSource.year.num
          month = scope.popupSource.month.num + 1

        scope.popup.refreshSelectedData month, year
      isLastMonth: () ->
        return if not scope.popupSource or not scope.popupSource
        return scope.popupSource.month.isEnd
      goNextYear: () ->
        return if not scope.popupSource or not scope.popupSource.year
        if scope.popupSource.year.isEnd
          console.error 'error'
          return false
        year = scope.popupSource.year.num + 1
        month = scope.popupSource.month.num
        scope.popup.refreshSelectedData month, year
      isLastYear: () ->
        return if not scope.popupSource or not scope.popupSource
        return scope.popupSource.year.isEnd
      isSelectedDay: (date) ->
        return if not scope.popupResult or not scope.popupResult.day
        return ((date.day is scope.popupResult.day) and (date.month is scope.popupResult.month) and (date.year is scope.popupResult.year))
      getTodayDateTime: () ->
        return if not scope.popupSettings or not scope.popupSettings.today
        today = scope.popupSettings.today
        return new Date(today.year, today.month - 1, today.day).getTime()
      isDayInSelectedMonth: (date) ->
        return ((date.month is scope.popupSource.month.num) and (date.year is scope.popupSource.year.num))
      goToYear: () ->
        year = scope.popupSource.year.num
        month = scope.popupSource.month.num
        scope.popup.refreshSelectedData month, year
      refreshSelectedData: (month, year) ->
        scope.popupRefresh
          m: month
          y: year