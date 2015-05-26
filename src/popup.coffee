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

    scope.data =
      dateModel: null
      setDateModel: (dateModel) ->
        scope.data.dateModel = dateModel
      source: null
      setSource: (dateSource) ->
        scope.data.source = dateSource
      format: null #scope.data.source.format
      setFormat: (format) ->
        scope.data.format = format
      viewedDate: null
      setViewedDate: (year, monthNumber) ->
        scope.data.viewedDate =
          year: year
          month:
            daysTotal: scope.data.source.years[year][monthNumber].days_total
            startDay: scope.data.source.years[year][monthNumber].start_day
            number: monthNumber
            name: bdateUtils.getMonthName monthNumber
      daysOfWeek:
        get: ->
          bdateUtils.daysOfWeek
        getShorts: ->
          bdateUtils.getDaysOfWeekShorts()
      today: null
      setToday: (today) ->
        scope.data.today = today
      getYearObj: (year)->
        return scope.data.source.years[year]
      getMonthObj: (month, year)->
        return scope.data.source.years[year][month]
      getDaysArr: (monthObj) ->
        daysCount = monthObj.daysTotal
        startDay = monthObj.startDay

        arr = Array.apply(null, length: daysCount + 1).map Number.call, Number
        arr.shift()

        i = 1
        while i <= startDay - 1
          arr.unshift('x')
          i++

        daysInWeek = 7

        if (arr.length / daysInWeek) is Math.floor arr.length / daysInWeek
          return arr

        j = daysCount
        while j <= daysCount + startDay - 1
          arr.push('x')
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

    do init = ->
      scope.data.init(source)

