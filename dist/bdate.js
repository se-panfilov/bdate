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
    link: function(scope) {
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
            }, {
              days_total: 30,
              start: 3
            }, {
              days_total: 31,
              start: 5
            }
          ]
        }
      };
      return scope.data = {
        source: source,
        format: source.format,
        viewedMonth: {
          month: source.years[source.current.year][source.current.month],
          number: source.current.month
        },
        selected: null,
        current: {
          year: source.current.year,
          month: {
            name: bdateUtils.getMonthName(source.current.month),
            number: source.current.month
          },
          day: (new Date).getUTCDate(),
          dayOfWeek: (new Date).getDay()
        },
        daysOfWeekShorts: bdateUtils.getDaysOfWeekShorts(),
        getYearFromSource: function(year) {
          return scope.data.source.years[year];
        },
        getMonthFromSource: function(month, year) {
          return scope.data.source.years[year][month];
        },
        getToday: function() {
          console.log(scope.data.source.current.date);
          return scope.data.source.current.date;
        },
        getDaysForMonths: function(daysCount, startDay) {
          var arr, daysInWeek, i, j;
          arr = Array.apply(null, {
            length: daysCount + 1
          }).map(Number.call, Number);
          arr.shift();
          i = 1;
          while (i <= startDay - 1) {
            arr.unshift('x');
            i++;
          }
          daysInWeek = 7;
          if ((arr.length / daysInWeek) === Math.floor(arr.length / daysInWeek)) {
            return arr;
          }
          j = daysCount;
          while (j <= daysCount + startDay - 1) {
            arr.push('x');
            j++;
          }
          return arr;
        },
        setViewed: function(isForward) {
          if (isForward) {
            viewedMonth.number = viewedMonth.number + 1;
          } else {
            viewedMonth.number = viewedMonth.number - 1;
          }
          return viewedMonth.month = source.years[source.current.year][viewedMonth.number];
        }
      };
    }
  };
}]);

angular.module('bdate.utils', []).factory('bdateUtils', function() {
  var daysOfWeek, exports, month;
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
  month = [
    {
      name: 'Январь',
      short: 'Янв'
    }, {
      name: 'Февраль',
      short: 'Фев'
    }, {
      name: 'Март',
      short: 'Март'
    }, {
      name: 'Апрель',
      short: 'Май'
    }, {
      name: 'Май',
      short: 'Май'
    }, {
      name: 'Июнь',
      short: 'Июнь'
    }, {
      name: 'Июль',
      short: 'Июль'
    }, {
      name: 'Август',
      short: 'Авг'
    }, {
      name: 'Сентябрь',
      short: 'Сент'
    }, {
      name: 'Октябрь',
      short: 'Окт'
    }, {
      name: 'Ноябрь',
      short: 'Ноя'
    }, {
      name: 'Декабрь',
      short: 'Дек'
    }
  ];
  return exports = {
    daysOfWeek: daysOfWeek,
    month: month,
    getDaysOfWeekShorts: function() {
      var i, result;
      i = 0;
      result = [];
      while (i < daysOfWeek.length) {
        result.push(daysOfWeek[i].short);
        i++;
      }
      return result;
    },
    getMonthName: function(number) {
      return month[number].name;
    }
  };
});
