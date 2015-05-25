angular.module('bdate.datepicker', ['bdate.popup']).directive('bdatepicker', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '../dist/templates/default.html',
    scope: {
      source: '='
    },
    link: function(scope, elem) {
      scope.popup = {
        isOpen: false
      };
      return scope.togglePopup = function() {
        return scope.popup.isOpen = !scope.popup.isOpen;
      };
    }
  };
});

angular.module('bdate', ['bdate.datepicker']).constant('HTTP_STATUS', {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502
}).constant('PERIOD', {
  second: 1000,
  minute: 60000,
  hour: 3600000,
  day: 86400000
});

angular.module('bdate.popup', []).directive('bdatePopup', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '../dist/templates/popup.html',
    scope: {
      isHidden: '='
    },
    link: function(scope, elem) {
      var source;
      source = {
        format: 'dd-mm-YYYY',
        today: 1432537266825,
        years: {
          2015: [
            {
              1: 'monday',
              2: 'tuesday',
              3: 'wednesday',
              4: 'thursday',
              5: 'friday',
              6: 'saturday',
              7: 'sunday',
              8: 'monday',
              9: 'tuesday',
              10: 'wednesday',
              11: 'thursday',
              12: 'friday',
              13: 'saturday',
              14: 'sunday',
              15: 'monday'
            }, {
              1: 'wednesday',
              2: 'thursday',
              3: 'friday',
              4: 'saturday',
              5: 'sunday',
              6: 'monday',
              7: 'tuesday',
              8: 'wednesday',
              9: 'thursday',
              10: 'friday',
              11: 'saturday',
              12: 'sunday',
              13: 'monday'
            }
          ]
        }
      };
      return scope.data = {
        source: source,
        format: source.format,
        selected: null,
        current: {
          year: (new Date).getFullYear(),
          month: (new Date).getMonth(),
          day: (new Date).getUTCDate(),
          dayOfWeek: (new Date).getDay()
        },
        getYearFromSource: function(year) {
          return date.source.years[year];
        },
        getMonthFromSource: function(month, year) {
          return date.source.years[year][month];
        },
        getToday: function() {
          return source.today;
        }
      };
    }
  };
});
