angular.module 'bdate.popup', ['bdate.utils', 'bdate.data', 'bdate.templates']

.directive 'bdatePopup', (bDateUtils, bDataFactory, MESSAGES) ->
  restrict: 'E'
  replace: true
  templateUrl: 'popup.html'
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
            first: Object.keys(bDataFactory.data.years[yearNum])[0]
            last: Object.keys(bDataFactory.data.years[yearNum])[Object.keys(bDataFactory.data.years[yearNum]).length - 1]
            daysTotal: bDataFactory.data.years[yearNum][monthNum].days_total
            startDay: bDataFactory.data.years[yearNum][monthNum].start_day
            number: monthNum
            name: bDateUtils.getMonthName monthNum
            count: Object.keys(bDataFactory.data.years[yearNum]).length

        scope.data.viewedDate.days = scope.data.getDaysArr scope.data.viewedDate.year, scope.data.viewedDate.month
      daysOfWeek:
        get: ->
          bDateUtils.daysOfWeek
        getShorts: ->
          bDateUtils.getDaysOfWeekShorts()
      today: null
      setToday: (today) ->
        return console.error MESSAGES.invalidParams if not today
        scope.data.today = today
      _getPrevMonthTailDaysArr: (yearNum, monthNum, startDay) ->
        result = []
        i = 1

        isFirstMonth = bDateUtils.sourceCheckers.month.isFirstMonth yearNum, monthNum
        isFirstYear = bDateUtils.sourceCheckers.year.isFirstYear yearNum, monthNum

        while i <= startDay - 1
          result.unshift ''
          i++
        return result
      _getNextMonthTailDaysArr: (yearNum, monthNum, startDay, daysCount, daysArr) ->
        result = []
        daysInWeek = 7
        expectedWeeksCount = Math.ceil daysArr.length / daysInWeek
        return result if (daysArr.length / daysInWeek) is Math.floor daysArr.length / daysInWeek

        isLastMonth = bDateUtils.sourceCheckers.month.isLastMonth yearNum, monthNum
        isLastYear = bDateUtils.sourceCheckers.year.isLastYear yearNum, monthNum

        j = daysArr.length
        while j < (expectedWeeksCount * daysInWeek)
          daysArr.push
            day: j - (daysCount + startDay - 2)
            month: monthNum + 1
            year: yearNum
          j++
        return result
      _getMonthDaysArr: (yearNum, monthNum, daysCount) ->
        result = []
        i = 1
        while i <= daysCount
          result.push
            day: i
            month: monthNum
            year: yearNum
          i++
        return result
      getDaysArr: (year, month) ->
        daysCount = +month.daysTotal
        startDay = +month.startDay

        prevMonthTailDaysArr = scope.data._getPrevMonthTailDaysArr year.number, month.number, startDay
        currentMonthDaysArr = scope.data._getMonthDaysArr year.number, month.number, daysCount
        result = prevMonthTailDaysArr.concat currentMonthDaysArr
        nextMonthTailDaysArr = scope.data._getNextMonthTailDaysArr year.number, month.number, startDay, daysCount, result
        result = currentMonthDaysArr.concat nextMonthTailDaysArr

        return result
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