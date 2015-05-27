angular.module 'bdate.popup', ['bdate.utils', 'bdate.data']

.directive 'bdatePopup', (bDateUtils, bDataFactory, MESSAGES) ->
  restrict: 'E'
  replace: true
  templateUrl: 'bdate/dist/templates/popup.html'
  scope:
    popupState: '='
    dateModel: '='
  link: (scope) ->
    scope.popup =
      hidePopup: ->
        scope.popupState.isOpen = false
      selectDate: (date) ->
        scope.data.setDateModel date
        scope.popup.hidePopup()

    scope.data =
      setDateModel: (dateModel) ->
        return console.error MESSAGES.invalidParams if not dateModel
        scope.dateModel = dateModel
      format: null
      setFormat: (format) ->
        return console.error MESSAGES.invalidParams if not format
        scope.data.format = format
      viewedDate: null
      setViewedDate: (yearNum, monthNum) ->
        return console.error MESSAGES.invalidParams if not yearNum or not monthNum
        yearNum = +yearNum
        monthNum = +monthNum

        scope.data.viewedDate =
          year:
            first: Object.keys(bDataFactory.data.years)[0]
            last: Object.keys(bDataFactory.data.years)[Object.keys(bDataFactory.data.years).length - 1]
            number: yearNum
            count: Object.keys(bDataFactory.data.years).length
          month:
            daysTotal: bDataFactory.data.years[yearNum][monthNum].days_total
            startDay: bDataFactory.data.years[yearNum][monthNum].start_day
            number: monthNum
            name: bDateUtils.getMonthName monthNum
            count: Object.keys(bDataFactory.data.years[yearNum]).length

        scope.data.viewedDate.days = scope.data.getDaysArr scope.data.viewedDate.month, scope.data.viewedDate.year
      daysOfWeek:
        get: ->
          bDateUtils.daysOfWeek
        getShorts: ->
          bDateUtils.getDaysOfWeekShorts()
      today: null
      setToday: (today) ->
        return console.error MESSAGES.invalidParams if not today
        scope.data.today = today
      getDaysArr: (month, year) ->
        daysCount = month.daysTotal
        startDay = month.startDay

        arr = []
        k = 1
        while k <= daysCount
          arr.push
            day: k
            month: month.number
            year: year.number
          k++

        i = 1
        while i <= startDay - 1
          arr.unshift ''
          i++

        daysInWeek = 7
        expectedWeeksCount = Math.ceil arr.length / daysInWeek
        return arr if (arr.length / daysInWeek) is Math.floor arr.length / daysInWeek

        j = arr.length
        while j < (expectedWeeksCount * daysInWeek)
          arr.push ''
          j++

        return arr
      goNextMonth: (isForward) ->
        nextObj = bDateUtils.sourceCheckers.month.getNextAvailableMonth isForward, scope.data.viewedDate.year.number, scope.data.viewedDate.month.number
        if nextObj
          scope.data.setViewedDate nextObj.year, nextObj.month
      goNextYear: (isForward) ->
        nextObj = bDateUtils.sourceCheckers.year.getNextAvailableYear isForward, scope.data.viewedDate.year.number, scope.data.viewedDate.month.number
        if nextObj
          scope.data.setViewedDate nextObj.year, nextObj.month
      init: (dateSource) ->
        scope.data.setFormat dateSource.format
        scope.data.setToday dateSource.today

        if bDateUtils.sourceCheckers.month.isMonthExist dateSource.today.year, dateSource.today.month
          scope.data.setViewedDate dateSource.today.year, dateSource.today.month
        else
          firstYear = bDateUtils.sourceCheckers.year.getFirstYear()
          scope.data.setViewedDate firstYear, bDateUtils.sourceCheckers.month.getFirstMonth firstYear

    #init
    do -> scope.data.init(bDataFactory.data)