angular.module 'bdate.popup', ['bdate.utils']

.directive 'bdatePopup', (bdateUtils) ->
  restrict: 'E'
  replace: true
  templateUrl: '../dist/templates/popup.html'
#  templateUrl: 'dist/templates/popup.html'
  scope:
    isHidden: '='
  link: (scope) ->
    source =
      format: 'dd-mm-yyyy'
      today:
        date: 1432537266825
        year: 2015
        month: 4
        day: 25
        day_of_week: 1
      years:
        2015: [
          {
            days_total: 31
            start_day: 4
          }
          {
            days_total: 28
            start_day: 7
          }
          {
            days_total: 31
            start_day: 7
          }
          {
            days_total: 30
            start_day: 3
          }
          {
            days_total: 31
            start_day: 5
          }
        ]

    messages =
      invalidParams: 'Invalid params'

    scope.data =
      dateModel: null
      setDateModel: (dateModel) ->
        return console.error messages.invalidParams if not dateModel
        scope.data.dateModel = dateModel
      source: null
      setSource: (dateSource) ->
        return console.error messages.invalidParams if not dateSource
        scope.data.source = dateSource
      format: null
      setFormat: (format) ->
        return console.error messages.invalidParams if not format
        scope.data.format = format
      viewedDate: null
      setViewedDate: (year, monthNumber) ->
        return console.error messages.invalidParams if not year or not monthNumber

        scope.data.viewedDate =
          year:
            first: Object.keys(scope.data.source.years)[0]
            last: Object.keys(scope.data.source.years)[Object.keys(scope.data.source.years).length - 1]
            number: year
            count: Object.keys(scope.data.source.years).length
          month:
            daysTotal: scope.data.source.years[year][monthNumber].days_total
            startDay: scope.data.source.years[year][monthNumber].start_day
            number: monthNumber
            name: bdateUtils.getMonthName monthNumber
            count: scope.data.source.years[year].length
      daysOfWeek:
        get: ->
          bdateUtils.daysOfWeek
        getShorts: ->
          bdateUtils.getDaysOfWeekShorts()
      today: null
      setToday: (today) ->
        return console.error messages.invalidParams if not today
        scope.data.today = today
#      getYearObj: (year)->
#        return scope.data.source.years[year]
#      getMonthObj: (month, year)->
#        return scope.data.source.years[year][month]
      getDaysArr: (monthObj) ->
        daysCount = monthObj.daysTotal
        startDay = monthObj.startDay

        arr = Array.apply(null, length: daysCount + 1).map Number.call, Number
        arr.shift()

        i = 1
        while i <= startDay - 1
          arr.unshift('')
          i++

        daysInWeek = 7
        return arr if (arr.length / daysInWeek) is Math.floor arr.length / daysInWeek

        j = daysCount
        while j <= daysCount + startDay - 1
          arr.push('')
          j++

        return arr
      goNextMonth: (isForward) ->
        if isForward
          scope.data.viewedDate.month.number = scope.data.viewedDate.month.number + 1
        else
          scope.data.viewedDate.month.number = scope.data.viewedDate.month.number - 1

        #TODO not current year, but calculate what year should to be
        scope.data.setViewedDate scope.data.source.today.year, scope.data.viewedDate.month.number
      init: (dateSource) ->
        scope.data.setSource dateSource
        scope.data.setFormat dateSource.format
        scope.data.setViewedDate dateSource.today.year, dateSource.today.month
        scope.data.setToday dateSource.today

    #init
    do -> scope.data.init(source)