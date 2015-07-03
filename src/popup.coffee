angular.module 'bdate.popup', ['bdate.utils', 'bdate.data', 'bdate.templates']

.directive 'bdatePopup', (bDateUtils, bDataFactory, MESSAGES) ->
  restrict: 'E'
  replace: true
  templateUrl: 'popup.html'
  scope:
    popupState: '='
    dateModel: '='
    dateStoreId: '@?'
  link: (scope) ->
    scope.popup =
      hidePopup: ->
        scope.popupState.isOpen = false
      selectDate: (date) ->
        scope.data.setDateModel date
        scope.popup.hidePopup()

    setInitViewedDate = (dateSource) ->
      year = null
      month = null
      day = null

      if scope.dateModel and not angular.equals {}, scope.dateModel
        year = scope.dateModel.year
        month = scope.dateModel.month
        day = scope.dateModel.day
      else if bDateUtils.sourceCheckers.month.isMonthExist dateSource.today.year, dateSource.today.month, scope.dateStoreId
        year = dateSource.today.year
        month = dateSource.today.month
      else
        year = bDateUtils.sourceCheckers.year.getFirstYear scope.dateStoreId
        month = bDateUtils.sourceCheckers.month.getFirstMonth year, scope.dateStoreId

      scope.data.setViewedDate year, month, day
      scope.data.yearsList = bDateUtils.getYearsAsFlatArr scope.dateStoreId
      reloadSelectViewDate(year)

    getPositionInArray = (val, arr) ->
      i = 0
      while i < arr.length
        if +arr[i] is +val
          return i
        i++

      console.error MESSAGES.yearNotExist
      return -1

    scope.$watch 'data.viewedDate.year.number', (year)->
      return if not year
      reloadSelectViewDate(year)

    reloadSelectViewDate = (year) ->
      viewedYearNumberInArr = getPositionInArray year, scope.data.yearsList
      scope.selectViewedYear = scope.data.yearsList[viewedYearNumberInArr]

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
        dayNum = (dayNum) ? +dayNum: 1

        scope.data.viewedDate =
          year:
            first: bDateUtils.sourceCheckers.year.getFirstYear(scope.dateStoreId)
            last: bDateUtils.sourceCheckers.year.getLastYear(scope.dateStoreId)
            number: +yearNum
            count: +Object.keys(bDataFactory.data[scope.dateStoreId].years).length
          month:
            first: bDateUtils.sourceCheckers.month.getFirstMonth(scope.dateStoreId)
            last: bDateUtils.sourceCheckers.month.getLastMonth(scope.dateStoreId)
            daysTotal: +bDataFactory.data[scope.dateStoreId].years[yearNum][monthNum].days_total
            startDay: +bDataFactory.data[scope.dateStoreId].years[yearNum][monthNum].start_day
            number: +monthNum
            name: bDateUtils.getMonthName monthNum
            count: +Object.keys(bDataFactory.data[scope.dateStoreId].years[yearNum]).length
          day:
            number: dayNum

        scope.data.viewedDate.days = scope.data.getDaysArr scope.data.viewedDate.year, scope.data.viewedDate.month
      yearsList: []
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

        isPrevMonthExist = bDateUtils.sourceCheckers.month.isPrevMonthExist yearNum, monthNum, scope.dateStoreId
        prevMonthDaysCount = 0
        if isPrevMonthExist
          prevMonthDate = bDateUtils.sourceCheckers.month.getPrevMonthObj yearNum, monthNum, scope.dateStoreId
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

        isNextMonthExist = bDateUtils.sourceCheckers.month.isNextMonthExist yearNum, monthNum, scope.dateStoreId
        if isNextMonthExist
          nextMonthDate = bDateUtils.sourceCheckers.month.getNextMonthObj yearNum, monthNum, scope.dateStoreId

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
        nextObj = bDateUtils.sourceCheckers.month.getNextAvailableMonth isForward, scope.data.viewedDate.year.number, scope.data.viewedDate.month.number, scope.dateStoreId
        if nextObj
          scope.data.setViewedDate nextObj.year, nextObj.month
      goNextYear: (isForward) ->
        nextObj = bDateUtils.sourceCheckers.year.getNextAvailableYear isForward, scope.data.viewedDate.year.number, scope.data.viewedDate.month.number, scope.dateStoreId
        if nextObj
          scope.data.setViewedDate nextObj.year, nextObj.month
      goToYear: (yearNum) ->
        return console.error MESSAGES.invalidParams if not yearNum
        yearNum = +yearNum
        return console.error MESSAGES.yearNotExist if not bDateUtils.sourceCheckers.year.isYearExist yearNum, scope.dateStoreId

        if bDateUtils.sourceCheckers.month.isMonthExist yearNum, scope.data.viewedDate.month.number, scope.dateStoreId
          monthNum = +scope.data.viewedDate.month.number
        else
          monthNum = +bDateUtils.sourceCheckers.month.getFirstMonth yearNum, scope.dateStoreId

        scope.data.setViewedDate yearNum, monthNum, scope.data.viewedDate.day.number
      init: (dateSource) ->
        scope.data.setFormat dateSource.format
        scope.data.setToday dateSource.today

        setInitViewedDate(dateSource)

    #init
    do ->
      if bDataFactory.isDataReady scope.dateStoreId
        scope.data.init(bDataFactory.data[scope.dateStoreId])
      scope.bDateUtils = bDateUtils

    scope.$watch (->
      bDataFactory.data[scope.dateStoreId]
    ), (->
      if bDataFactory.isDataReady(scope.dateStoreId)
        scope.data.init bDataFactory.data[scope.dateStoreId]
    ), true

    scope.$watch 'popupState.isOpen', ->
      if scope.popupState.isOpen and (scope.dateModel and not angular.equals {}, scope.dateModel)
        scope.data.setDateModel scope.dateModel
        scope.data.setViewedDate scope.dateModel.year, scope.dateModel.month, scope.dateModel.day