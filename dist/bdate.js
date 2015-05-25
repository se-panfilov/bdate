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

angular.module('bdate.popup', ['bdate.utils']).directive('bdatePopup', ['bdateUtils', function(bdateUtils) {
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
        current: {
          date: 1432537266825,
          year: 2015,
          month: 4,
          day: 25,
          day_of_week: 1
        },
        years: {
          2015: [
            {
              days_total: 31,
              start: 4
            }, {
              days_total: 28,
              start: 7
            }, {
              days_total: 31,
              start: 7
            }
          ]
        }
      };
      return scope.data = {
        source: source,
        format: source.format,
        viewedMonth: source.years[source.current.year][source.current.month],
        selected: null,
        current: {
          year: (new Date).getFullYear(),
          month: (new Date).getMonth(),
          day: (new Date).getUTCDate(),
          dayOfWeek: (new Date).getDay()
        },
        daysOfWeekShorts: bdateUtils.getDaysOfWeekShorts(),
        getYearFromSource: function(year) {
          return date.source.years[year];
        },
        getMonthFromSource: function(month, year) {
          return date.source.years[year][month];
        },
        getToday: function() {
          return source.current.date;
        }
      };
    }
  };
}]);

angular.module('bdate.utils', []).factory('bdateUtils', function() {
  var daysOfWeek, exports;
  daysOfWeek = [
    {
      name: 'Понедельник',
      short: 'Пн'
    }, {
      name: 'Вторник',
      short: 'Вт'
    }, {
      name: 'Среда',
      short: 'Ср'
    }, {
      name: 'Четверг',
      short: 'Чт'
    }, {
      name: 'Пятница',
      short: 'Пт'
    }, {
      name: 'Суббота',
      short: 'Сб'
    }, {
      name: 'Воскресенье',
      short: 'Вс'
    }
  ];
  return exports = {
    daysOfWeek: daysOfWeek,
    getDaysOfWeekShorts: function() {
      var i, result;
      i = 0;
      result = [];
      while (i < daysOfWeek.length) {
        result.push(daysOfWeek[i].short);
        i++;
      }
      return result;
    }
  };
});
