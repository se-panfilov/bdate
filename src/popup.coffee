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
      setViewedDate: (yearNum, monthNum, dayNum) ->
        return console.error MESSAGES.invalidParams if not yearNum or not monthNum
        yearNum = +yearNum
        monthNum = +monthNum

        scope.data.viewedDate =
          year:
            first: +Object.keys(bDataFactory.data.years)[0]
            last: +Object.keys(bDataFactory.data.years)[Object.keys(bDataFactory.data.years).length - 1]
            number: +yearNum
            count: +Object.keys(bDataFactory.data.years).length
          month:
            first: +Object.keys(bDataFactory.data.years[yearNum])[0]
            last: +Object.keys(bDataFactory.data.years[yearNum])[Object.keys(bDataFactory.data.years[yearNum]).length - 1]
            daysTotal: +bDataFactory.data.years[yearNum][monthNum].days_total
            startDay: +bDataFactory.data.years[yearNum][monthNum].start_day
            number: +monthNum
            name: bDateUtils.getMonthName monthNum
            count: +Object.keys(bDataFactory.data.years[yearNum]).length
          day:
            number: +dayNum

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

        prevMonthDate =
          day: null
          month: null
          year: null

        isPrevMonthExist = bDateUtils.sourceCheckers.month.isPrevMonthExist yearNum, monthNum
        prevMonthDaysCount = 0
        if isPrevMonthExist
          prevMonthDate = bDateUtils.sourceCheckers.month.getPrevMonthObj yearNum, monthNum
          prevMonthDaysCount = new Date(prevMonthDate.year, prevMonthDate.month, 0).getDate()

        i = 0
        while i < startDay - 1
          result.unshift
            day: if isPrevMonthExist then prevMonthDaysCount - i else ""
            month: if isPrevMonthExist then prevMonthDate.month else null
            year: if isPrevMonthExist then prevMonthDate.year else null
            isOtherMonth: true
            isLocked: !isPrevMonthExist
          i++
        return result
      _getNextMonthTailDaysArr: (yearNum, monthNum, startDay, daysCount, daysArr) ->
        result = []
        daysInWeek = 7
        expectedWeeksCount = Math.ceil daysArr.length / daysInWeek
        return result if (daysArr.length / daysInWeek) is Math.floor daysArr.length / daysInWeek

        nextMonthDate =
          day: null
          month: null
          year: null

        isNextMonthExist = bDateUtils.sourceCheckers.month.isNextMonthExist yearNum, monthNum
        if isNextMonthExist
          nextMonthDate = bDateUtils.sourceCheckers.month.getNextMonthObj yearNum, monthNum

        i = daysArr.length
        while i < (expectedWeeksCount * daysInWeek)
          daysArr.push
            day: if isNextMonthExist then i - (daysCount + startDay - 2) else ""
            month: if isNextMonthExist then nextMonthDate.month else null
            year: if isNextMonthExist then nextMonthDate.year else null
            isOtherMonth: true
            isLocked: !isNextMonthExist
          i++
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
      _markToday: (daysArr) ->
        i = 1
        while i < daysArr.length
          if daysArr[i].day is scope.data.today.day
            daysArr[i].isToday = true
          i++
        daysArr
      getDaysArr: (year, month) ->
        daysCount = +month.daysTotal
        startDay = +month.startDay

        prevMonthTailDaysArr = scope.data._getPrevMonthTailDaysArr year.number, month.number, startDay
        currentMonthDaysArr = scope.data._getMonthDaysArr year.number, month.number, daysCount
        if year.number is scope.data.today.year and month.number is scope.data.today.month
          currentMonthDaysArr = scope.data._markToday currentMonthDaysArr
        result = prevMonthTailDaysArr.concat currentMonthDaysArr
        nextMonthTailDaysArr = scope.data._getNextMonthTailDaysArr year.number, month.number, startDay, daysCount, result
        result = result.concat nextMonthTailDaysArr

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

        if scope.dateModel and not angular.equals {}, scope.dateModel
          scope.data.setViewedDate scope.dateModel.year, scope.dateModel.month, scope.dateModel.day
        else if bDateUtils.sourceCheckers.month.isMonthExist dateSource.today.year, dateSource.today.month
          scope.data.setViewedDate dateSource.today.year, dateSource.today.month
        else
          firstYear = bDateUtils.sourceCheckers.year.getFirstYear()
          scope.data.setViewedDate firstYear, bDateUtils.sourceCheckers.month.getFirstMonth firstYear

    #init
    do ->
      if bDataFactory.isDataReady bDataFactory.data
        scope.data.init(bDataFactory.data)
      scope.bDateUtils = bDateUtils

    scope.$watch (->
      bDataFactory.data
    ), (->
      if bDataFactory.isDataReady(bDataFactory.data)
        scope.data.init bDataFactory.data
    ), true

    scope.$watch 'popupState.isOpen', ->
      if scope.popupState.isOpen and (scope.dateModel and not angular.equals {}, scope.dateModel)
        scope.data.setDateModel scope.dateModel
        scope.data.setViewedDate scope.dateModel.year, scope.dateModel.month, scope.dateModel.day