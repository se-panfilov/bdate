angular.module('bdate.datepicker', ['bdate.popup']).directive('bdatepicker', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '../dist/templates/default.html',
    scope: {
      source: '='
    },
    link: function(scope) {
      scope.popup = {
        isOpen: false
      };
      return scope.togglePopup = function() {
        return scope.popup.isOpen = !scope.popup.isOpen;
      };
    }
  };
});

angular.module('bdate', ['bdate.datepicker']);

angular.module('bdate.popup', ['bdate.utils']).directive('bdatePopup', ['bdateUtils', function(bdateUtils) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '../dist/templates/popup.html',
    scope: {
      isHidden: '='
    },
    link: function(scope) {
      var messages, source;
      source = {
        format: 'dd-mm-yyyy',
        today: {
          date: 1432537266825,
          year: 2015,
          month: 5,
          day: 25,
          day_of_week: 1
        },
        years: {
          2015: {
            5: {
              days_total: 31,
              start_day: 4
            },
            6: {
              days_total: 28,
              start_day: 7
            },
            7: {
              days_total: 31,
              start_day: 7
            },
            8: {
              days_total: 30,
              start_day: 3
            },
            9: {
              days_total: 31,
              start_day: 5
            }
          }
        }
      };
      messages = {
        invalidParams: 'Invalid params',
        errorOnChangeMOnthOrYear: 'cannot change month or year'
      };
      scope.data = {
        dateModel: null,
        setDateModel: function(dateModel) {
          if (!dateModel) {
            return console.error(messages.invalidParams);
          }
          return scope.data.dateModel = dateModel;
        },
        source: null,
        setSource: function(dateSource) {
          if (!dateSource) {
            return console.error(messages.invalidParams);
          }
          return scope.data.source = dateSource;
        },
        format: null,
        setFormat: function(format) {
          if (!format) {
            return console.error(messages.invalidParams);
          }
          return scope.data.format = format;
        },
        viewedDate: null,
        setViewedDate: function(yearNum, monthNum) {
          if (!yearNum || !monthNum) {
            return console.error(messages.invalidParams);
          }
          yearNum = +yearNum;
          monthNum = +monthNum;
          return scope.data.viewedDate = {
            year: {
              first: Object.keys(scope.data.source.years)[0],
              last: Object.keys(scope.data.source.years)[Object.keys(scope.data.source.years).length - 1],
              number: yearNum,
              count: Object.keys(scope.data.source.years).length
            },
            month: {
              daysTotal: scope.data.source.years[yearNum][monthNum].days_total,
              startDay: scope.data.source.years[yearNum][monthNum].start_day,
              number: monthNum,
              name: bdateUtils.getMonthName(monthNum),
              count: Object.keys(scope.data.source.years[yearNum]).length
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
          if (!today) {
            return console.error(messages.invalidParams);
          }
          return scope.data.today = today;
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
            arr.unshift('');
            i++;
          }
          daysInWeek = 7;
          if ((arr.length / daysInWeek) === Math.floor(arr.length / daysInWeek)) {
            return arr;
          }
          j = daysCount;
          while (j <= daysCount + startDay - 1) {
            arr.push('');
            j++;
          }
          return arr;
        },
        isYearExistInSource: function(yearNum) {
          if (!yearNum) {
            return console.error(messages.invalidParams);
          }
          yearNum = +yearNum;
          return !!scope.data.source.years[yearNum];
        },
        getFirstYearInSource: function() {
          return Object.keys(scope.data.source.years)[0];
        },
        isMonthExistInSource: function(monthNum, yearNum) {
          if (!yearNum || !monthNum) {
            return console.error(messages.invalidParams);
          }
          yearNum = +yearNum;
          monthNum = +monthNum;
          if (!scope.data.source.years[yearNum]) {
            return false;
          }
          return !!scope.data.source.years[yearNum][monthNum];
        },
        isFirstMonthInSource: function(yearNum, monthNum) {
          yearNum = +yearNum;
          monthNum = +monthNum;
          return monthNum === Object.keys(scope.data.source.years[yearNum])[0];
        },
        isLastMonthInSource: function(yearNum, monthNum) {
          yearNum = +yearNum;
          monthNum = +monthNum;
          return monthNum === Object.keys(scope.data.source.years[yearNum])[Object.keys(scope.data.source.years[yearNum]).length - 1];
        },
        getFirstMonthInSource: function(yearNum) {
          return Object.keys(scope.data.source.years[+yearNum])[0];
        },
        isCanGoNextMonth: function(isForward, monthNum, yearNum) {
          var isChangeYear, isFirstMonthInSource, isLastMonthInSource, nextMonth, nextYearNum, result;
          yearNum = +yearNum;
          monthNum = +monthNum;
          isFirstMonthInSource = scope.data.isFirstMonthInSource(yearNum, monthNum);
          isLastMonthInSource = scope.data.isLastMonthInSource(yearNum, monthNum);
          isChangeYear = false;
          nextYearNum = yearNum;
          nextMonth = monthNum;
          if (isForward) {
            if (!isLastMonthInSource) {
              nextMonth = monthNum + 1;
            } else {
              isChangeYear = true;
              nextYearNum = yearNum + 1;
              if (scope.data.isYearExistInSource(nextYearNum)) {
                nextMonth = scope.data.getFirstMonthInSource(nextYearNum);
              } else {
                console.error(messages.errorOnChangeMOnthOrYear);
                return false;
              }
            }
          } else if (!isForward) {
            if (!isFirstMonthInSource) {
              nextMonth = monthNum - 1;
            } else {
              isChangeYear = true;
              nextYearNum = yearNum - 1;
              if (scope.data.isYearExistInSource(nextYearNum)) {
                nextMonth = scope.data.getLastMonthInSource(nextYearNum);
              } else {
                console.error(messages.errorOnChangeMOnthOrYear);
                return false;
              }
            }
          }
          return result = {
            year: nextYearNum,
            month: nextMonth
          };
        },
        goNextMonth: function(isForward) {
          var nextObj;
          nextObj = scope.data.isCanGoNextMonth(isForward, scope.data.viewedDate.month.number, scope.data.viewedDate.year.number);
          if (nextObj) {
            return scope.data.setViewedDate(nextObj.year, nextObj.month);
          }
        },
        init: function(dateSource) {
          var firstYear;
          scope.data.setSource(dateSource);
          scope.data.setFormat(dateSource.format);
          scope.data.setToday(dateSource.today);
          if (scope.data.isMonthExistInSource(dateSource.today.year, dateSource.today.month)) {
            return scope.data.setViewedDate(dateSource.today.year, dateSource.today.month);
          } else {
            firstYear = scope.data.getFirstYearInSource();
            return scope.data.setViewedDate(firstYear, scope.data.getFirstMonthInSource(firstYear));
          }
        }
      };
      return (function() {
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
    },
    isJanuary: function(monthNum) {
      return monthNum === 1;
    },
    isDecember: function(monthNum) {
      return monthNum === 12;
    }
  };
});
