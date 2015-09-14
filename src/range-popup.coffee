angular.module 'bdate.popup.ranged', [
  'bdate.templates'
]

.directive 'bdateRangePopup', () ->
  restrict: 'E'
  replace: true
  templateUrl: 'range-popup.html'
  scope:
    popupState: '='
    popupSettings: '='
    popupStartSource: '='
    popupEndSource: '='
    popupResult: '='
    popupStartRefresh: "&?"
    popupEndRefresh: "&?"
  link: (scope) ->
    scope.data =
      startResult: null
      endResult: null

    scope.watchers =
      result:
        handler: null
        callback: null
        start: (callback) ->
          if callback?
            scope.watchers.result.callback = callback
          return if scope.watchers.result.handler
          scope.watchers.result.handler = scope.$watch 'popupResult', (newVal, oldVal) ->
            if scope.watchers.result.callback
              scope.watchers.result.callback newVal, oldVal
          ,
            true
        stop: () ->
          scope.watchers.result.handler()
          scope.watchers.result.handler = null
        watchPopupResult: (callback) ->
          scope.watchers.result.start (newVal, oldVal) ->
            return if newVal is oldVal
            return if not newVal
            return if angular.equals {}, newVal

            scope.popup.refreshSelectedData true, newVal.start.month, newVal.start.year
            scope.popup.refreshSelectedData false, newVal.end.month, newVal.end.year

            if callback
              callback newVal, oldVal


    getSource = (isStartPopup) ->
      if isStartPopup
        return scope.popupStartSource
      else
        return scope.popupEndSource

    setDataResult = (isStartPopup, date) ->
      if isStartPopup
        scope.data.startResult = date
      else
        scope.data.endResult = date

    scope.popup =
      hidePopup: () ->
        scope.popupState.isOpen = false
      selectDate: (isStartPopup, date) ->
        setDataResult isStartPopup, date

        if not scope.popup.isDayInSelectedMonth isStartPopup, date
          scope.popup.refreshSelectedData isStartPopup, date.month, date.year
      goPrevYear: (isStartPopup) ->
        popupSource = getSource isStartPopup

        return if not popupSource or not popupSource.year
        if popupSource.year.isStart
          console.error 'error'
          return false
        year = popupSource.year.num - 1
        month = popupSource.month.num
        scope.popup.refreshSelectedData isStartPopup, month, year
      isFirstYear: (isStartPopup) ->
        popupSource = getSource isStartPopup
        return if not popupSource or not popupSource
        return popupSource.year.isStart
      goPrevMonth: (isStartPopup) ->
        popupSource = getSource isStartPopup
        return if not popupSource or not popupSource.year
        if popupSource.month.isStart and popupSource.year.isStart
          console.error 'error'
          return false

        december = 12
        month = popupSource.month.num

        if popupSource.month.isStart
          year = popupSource.year.num - 1
          month = december
        else if popupSource.month.isStart and popupSource.year.isStart
          console.error 'error'
          return false
        else
          year = popupSource.year.num
          month = popupSource.month.num - 1

        scope.popup.refreshSelectedData isStartPopup, month, year
      isFirstMonth: (isStartPopup) ->
        popupSource = getSource isStartPopup
        return if not popupSource or not popupSource
        return popupSource.month.isStart
      goNextMonth: (isStartPopup) ->
        popupSource = getSource isStartPopup
        return if not popupSource or not popupSource.year
        if popupSource.month.isEnd and popupSource.year.isEnd
          console.error 'error'
          return false

        january = 1
        month = popupSource.month.num

        if popupSource.month.isEnd
          year = popupSource.year.num + 1
          month = january
        else if popupSource.month.isEnd and popupSource.year.isEnd
          console.error 'error'
          return false
        else
          year = popupSource.year.num
          month = popupSource.month.num + 1

        scope.popup.refreshSelectedData isStartPopup, month, year
      isLastMonth: (isStartPopup) ->
        popupSource = getSource isStartPopup
        return if not popupSource or not popupSource
        return popupSource.month.isEnd
      goNextYear: (isStartPopup) ->
        popupSource = getSource isStartPopup
        return if not popupSource or not popupSource.year
        if popupSource.year.isEnd
          console.error 'error'
          return false
        year = popupSource.year.num + 1
        month = popupSource.month.num
        scope.popup.refreshSelectedData isStartPopup, month, year
      isLastYear: (isStartPopup) ->
        popupSource = getSource isStartPopup
        return if not popupSource or not popupSource
        return popupSource.year.isEnd
      isSelectedDay: (isStartPopup, date) ->
        if isStartPopup
          return if not scope.data.startResult or not scope.data.startResult.day
          return ((date.day is scope.data.startResult.day) and (date.month is scope.data.startResult.month) and (date.year is scope.data.startResult.year))
        else
          return if not scope.data.endResult or not scope.data.endResult.day
          return ((date.day is scope.data.endResult.day) and (date.month is scope.data.endResult.month) and (date.year is scope.data.endResult.year))
      getTodayDateTime: () ->
        return if not scope.popupSettings or not scope.popupSettings.today
        today = scope.popupSettings.today
        return new Date(today.year, today.month - 1, today.day).getTime()
      isDayInSelectedMonth: (isStartPopup, date) ->
        popupSource = getSource isStartPopup
        return ((date.month is popupSource.month.num) and (date.year is popupSource.year.num))
      goToYear: (isStartPopup) ->
        popupSource = getSource isStartPopup
        year = popupSource.year.num
        month = popupSource.month.num
        scope.popup.refreshSelectedData isStartPopup, month, year
      refreshSelectedData: (isStartPopup, month, year) ->
        if isStartPopup
          scope.popupStartRefresh
            m: month
            y: year
        else
          scope.popupEndRefresh
            m: month
            y: year
      selectRangedDate: () ->
        scope.popupResult =
          start: scope.data.startResult
          end: scope.data.endResult
        scope.popup.hidePopup()

    do () ->
      scope.watchers.result.watchPopupResult()