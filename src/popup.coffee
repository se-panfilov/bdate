angular.module('bdate.popup', [])

.directive 'bdatePopup', () ->
  {
  restrict: 'E'
  replace: true
  templateUrl: '../dist/templates/popup.html'
#  templateUrl: 'dist/templates/popup.html'
  scope:
    isHidden: '='
  link: (scope, elem) ->
#    scope.isHidden = false;

    source =
      format: 'dd-mm-YYYY'
      today: 1432537266825
      years:
        2015: [
          {
            1: 'monday'
            2: 'tuesday'
            3: 'wednesday'
            4: 'thursday'
            5: 'friday'
            6: 'saturday'
            7: 'sunday'
            8: 'monday'
            9: 'tuesday'
            10: 'wednesday'
            11: 'thursday'
            12: 'friday'
            13: 'saturday'
            14: 'sunday'
            15: 'monday'
          }
          {
            1: 'wednesday'
            2: 'thursday'
            3: 'friday'
            4: 'saturday'
            5: 'sunday'
            6: 'monday'
            7: 'tuesday'
            8: 'wednesday'
            9: 'thursday'
            10: 'friday'
            11: 'saturday'
            12: 'sunday'
            13: 'monday'
          }
        ]
    ;

    scope.data =
      source: source
      format: source.format
      selected: null
      current:
        year: (new Date).getFullYear()
        month: (new Date).getMonth()
        day: (new Date).getUTCDate()
        dayOfWeek: (new Date).getDay()
      getYearFromSource: (year)->
        return date.source.years[year]
      getMonthFromSource: (month, year)->
        return date.source.years[year][month]
      getToday: ->
        return source.today


#    scope.togglePopup = () ->
#      console.log 1
  }