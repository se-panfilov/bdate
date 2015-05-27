angular.module 'bdate.popup', ['bdate.utils']

.directive 'bdatePopup', (bdateUtils) ->
  restrict: 'E'
  replace: true
  templateUrl: 'bdate/dist/templates/popup.html'
  scope:
    popupState: '='
    dateModel: '='
  link: (scope) ->
    source =
      format: 'dd-mm-yyyy'
      today:
        date: 1432537266825
        year: 2015
        month: 5
        day: 25
        day_of_week: 1
      years:
        2014:
          6:
            days_total: 30
            start_day: 7
          7:
            days_total: 31
            start_day: 2
          8:
            days_total: 31
            start_day: 5
          9:
            days_total: 30
            start_day: 1
          10:
            days_total: 31
            start_day: 3
        2015:
          1:
            days_total: 31
            start_day: 4
          2:
            days_total: 28
            start_day: 7
          3:
            days_total: 31
            start_day: 7
          4:
            days_total: 30
            start_day: 3
          5:
            days_total: 31
            start_day: 5

    messages =
      invalidParams: 'Invalid params'
      errorOnChangeMonthOrYear: 'cannot change month or year'

    scope.popup =
      hidePopup: ->
        scope.popupState.isOpen = false
      selectDate: (date) ->
        scope.data.setDateModel date
        scope.popup.hidePopup()

    scope.data =
      setDateModel: (dateModel) ->
        return console.error messages.invalidParams if not dateModel
        scope.dateModel = dateModel
      source: null
      setSource: (dateSource) ->
        return console.error messages.invalidParams if not dateSource
        scope.data.source = dateSource
      format: null
      setFormat: (format) ->
        return console.error messages.invalidParams if not format
        scope.data.format = format
      viewedDate: null
      setViewedDate: (yearNum, monthNum) ->
        return console.error messages.invalidParams if not yearNum or not monthNum
        yearNum = +yearNum
        monthNum = +monthNum

        scope.data.viewedDate =
          year:
            first: Object.keys(scope.data.source.years)[0]
            last: Object.keys(scope.data.source.years)[Object.keys(scope.data.source.years).length - 1]
            number: yearNum
            count: Object.keys(scope.data.source.years).length
          month:
            daysTotal: scope.data.source.years[yearNum][monthNum].days_total
            startDay: scope.data.source.years[yearNum][monthNum].start_day
            number: monthNum
            name: bdateUtils.getMonthName monthNum
            count: Object.keys(scope.data.source.years[yearNum]).length

        scope.data.viewedDate.days = scope.data.getDaysArr scope.data.viewedDate.month, scope.data.viewedDate.year
      daysOfWeek:
        get: ->
          bdateUtils.daysOfWeek
        getShorts: ->
          bdateUtils.getDaysOfWeekShorts()
      today: null
      setToday: (today) ->
        return console.error messages.invalidParams if not today
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
      isYearExistInSource: (yearNum) ->
        return console.error messages.invalidParams if not yearNum
        yearNum = +yearNum

        !!scope.data.source.years[yearNum]
      getFirstYearInSource: ->
        Object.keys(scope.data.source.years)[0]
      isMonthExistInSource: (yearNum, monthNum)->
        return console.error messages.invalidParams if not yearNum or not monthNum
        yearNum = +yearNum
        monthNum = +monthNum

        return false if not scope.data.source.years[yearNum]
        !!scope.data.source.years[yearNum][monthNum]
      isFirstMonthInSource: (yearNum, monthNum) ->
        yearNum = +yearNum
        monthNum = +monthNum

        monthNum is +Object.keys(scope.data.source.years[yearNum])[0]
      isLastMonthInSource: (yearNum, monthNum) ->
        yearNum = +yearNum
        monthNum = +monthNum

        monthNum is +Object.keys(scope.data.source.years[yearNum])[Object.keys(scope.data.source.years[yearNum]).length - 1]
      getFirstMonthInSource: (yearNum) ->
        yearNum = +yearNum
        +Object.keys(scope.data.source.years[yearNum])[0]
      getLastMonthInSource: (yearNum) ->
        yearNum = +yearNum
        +Object.keys(scope.data.source.years[yearNum])[Object.keys(scope.data.source.years[yearNum]).length - 1]
      isCanGoNextMonth: (isForward, yearNum, monthNum) ->
        yearNum = +yearNum
        monthNum = +monthNum
        isFirstMonthInSource = scope.data.isFirstMonthInSource yearNum, monthNum
        isLastMonthInSource = scope.data.isLastMonthInSource yearNum, monthNum
        isChangeYear = false
        nextYearNum = yearNum
        nextMonth = monthNum

        if isForward
          if not isLastMonthInSource
            nextMonth = monthNum + 1
          else
            isChangeYear = true
            nextYearNum = yearNum + 1
            if scope.data.isYearExistInSource nextYearNum
              nextMonth = scope.data.getFirstMonthInSource nextYearNum
            else
              console.error messages.errorOnChangeMonthOrYear
              return false
        else if not isForward
          if not isFirstMonthInSource
            nextMonth = monthNum - 1
          else
            isChangeYear = true
            nextYearNum = yearNum - 1
            if scope.data.isYearExistInSource nextYearNum
              nextMonth = scope.data.getLastMonthInSource nextYearNum
            else
              console.error messages.errorOnChangeMonthOrYear
              return false

        result =
          year: nextYearNum
          month: nextMonth
      goNextMonth: (isForward) ->
        nextObj = scope.data.isCanGoNextMonth isForward, scope.data.viewedDate.year.number, scope.data.viewedDate.month.number
        if nextObj
          scope.data.setViewedDate nextObj.year, nextObj.month
      goNextYear: (isForward) ->
#        TODO
      init: (dateSource) ->
        scope.data.setSource dateSource
        scope.data.setFormat dateSource.format
        scope.data.setToday dateSource.today

        if scope.data.isMonthExistInSource dateSource.today.year, dateSource.today.month
          scope.data.setViewedDate dateSource.today.year, dateSource.today.month
        else
          firstYear = scope.data.getFirstYearInSource()
          scope.data.setViewedDate firstYear, scope.data.getFirstMonthInSource firstYear

    #init
    do -> scope.data.init(source)