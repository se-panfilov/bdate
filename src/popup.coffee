angular.module 'bdate.popup', ['bdate.utils']

.directive 'bdatePopup', (bdateUtils) ->
  {
  restrict: 'E'
  replace: true
  templateUrl: '../dist/templates/popup.html'
#  templateUrl: 'dist/templates/popup.html'
  scope:
    isHidden: '='
  link: (scope) ->
    source =
      format: 'dd-mm-YYYY'
      current:
        date: 1432537266825
        year: 2015
        month: 4
        day: 25
        day_of_week: 1
      years:
        2015: [
          {
            days_total: 31
            start: 4
          }
          {
            days_total: 28
            start: 7
          }
          {
            days_total: 31
            start: 7
          }
          {
            days_total: 30
            start: 3
          }
          {
            days_total: 31
            start: 5
          }
        ]
    ;

    scope.data =
      source: source
      format: source.format
      viewedMonth: source.years[source.current.year][source.current.month]
      selected: null
      current:
        year: source.current.year
        month:
          name: bdateUtils.getMonthName(source.current.month)
          number: source.current.month
        day: (new Date).getUTCDate()
        dayOfWeek: (new Date).getDay()
      daysOfWeekShorts: bdateUtils.getDaysOfWeekShorts()
      getYearFromSource: (year)->
        return date.source.years[year]
      getMonthFromSource: (month, year)->
        return date.source.years[year][month]
      getToday: ->
        console.log data.source.current.date
        return data.source.current.date
      getDaysForMonths: (daysCount, startDay) ->
        arr = Array.apply(null, {length: daysCount + 1}).map(Number.call, Number)
        arr.shift();

        i = 1
        while i <= startDay
          arr.unshift('x')
          i++
        return arr;

  }