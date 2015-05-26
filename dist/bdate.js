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
      var init, source;
      source = {
        format: 'dd-mm-yyyy',
        today: {
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
              start_day: 4
            }, {
              days_total: 28,
              start_day: 7
            }, {
              days_total: 31,
              start_day: 7
            }, {
              days_total: 30,
              start_day: 3
            }, {
              days_total: 31,
              start_day: 5
            }
          ]
        }
      };
      scope.data = {
        dateModel: null,
        setDateModel: function(dateModel) {
          return scope.data.dateModel = dateModel;
        },
        source: null,
        setSource: function(dateSource) {
          return scope.data.source = dateSource;
        },
        format: null,
        setFormat: function(format) {
          return scope.data.format = format;
        },
        viewedDate: null,
        setViewedDate: function(year, monthNumber) {
          return scope.data.viewedDate = {
            year: year,
            month: {
              daysTotal: scope.data.source.years[year][monthNumber].days_total,
              startDay: scope.data.source.years[year][monthNumber].start_day,
              number: monthNumber,
              name: bdateUtils.getMonthName(monthNumber)
            }
          };
        },
        daysOfWeek: {
          get: function() {
            return bdateUtils.daysOfWeek;
          },
          getShorts: function() {
            return bdateUtils.getDaysOfWeekShorts();
          }
        },
        today: null,
        setToday: function(today) {
          return scope.data.today = today;
        },
        getYearObj: function(year) {
          return scope.data.source.years[year];
        },
        getMonthObj: function(month, year) {
          return scope.data.source.years[year][month];
        },
        getDaysArr: function(monthObj) {
          var arr, daysCount, daysInWeek, i, j, startDay;
          daysCount = monthObj.daysTotal;
          startDay = monthObj.startDay;
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
        goNextMonth: function(isForward) {
          if (isForward) {
            scope.data.viewedDate.month.number = scope.data.viewedDate.month.number + 1;
          } else {
            scope.data.viewedDate.month.number = scope.data.viewedDate.month.number - 1;
          }
          return scope.data.setViewedDate(scope.data.source.today.year, scope.data.viewedDate.month.number);
        },
        init: function(dateSource) {
          scope.data.setSource(dateSource);
          scope.data.setFormat(dateSource.format);
          scope.data.setViewedDate(dateSource.today.year, dateSource.today.month);
          return scope.data.setToday(dateSource.today);
        }
      };
      return (init = function() {
        return scope.data.init(source);
      })();
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
