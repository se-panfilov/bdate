angular.module('bdate.datepicker', ['bdate.popup']).directive('bdatepicker', ['$filter', function($filter) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '../dist/templates/default.html',
    scope: {
      source: '='
    },
    link: function(scope) {
      scope.date = {
        viewed: '',
        model: {}
      };
      scope.$watch('date.model', function() {
        var dateTime, formattedDate;
        dateTime = new Date(scope.date.model.year, scope.date.model.month - 1, scope.date.model.day).getTime();
        formattedDate = $filter('date')(dateTime, "dd/MM/yyyy");
        return scope.date.viewed = formattedDate;
      });
      scope.popup = {
        state: {
          isOpen: false
        }
      };
      return scope.togglePopup = function() {
        return scope.popup.state.isOpen = !scope.popup.state.isOpen;
      };
    }
  };
}]);

angular.module('bdate', ['bdate.datepicker']);

angular.module('bdate.popup', ['bdate.utils']).directive('bdatePopup', ['bdateUtils', function(bdateUtils) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '../dist/templates/popup.html',
    scope: {
      popupState: '=',
      dateModel: '='
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
          2014: {
            6: {
              days_total: 30,
              start_day: 7
            },
            7: {
              days_total: 31,
              start_day: 2
            },
            8: {
              days_total: 31,
              start_day: 5
            },
            9: {
              days_total: 30,
              start_day: 1
            },
            10: {
              days_total: 31,
              start_day: 3
            }
          },
          2015: {
            1: {
              days_total: 31,
              start_day: 4
            },
            2: {
              days_total: 28,
              start_day: 7
            },
            3: {
              days_total: 31,
              start_day: 7
            },
            4: {
              days_total: 30,
              start_day: 3
            },
            5: {
              days_total: 31,
              start_day: 5
            }
          }
        }
      };
      messages = {
        invalidParams: 'Invalid params',
        errorOnChangeMonthOrYear: 'cannot change month or year'
      };
      scope.popup = {
        hidePopup: function() {
          return scope.popupState.isOpen = false;
        },
        selectDate: function(date) {
          scope.data.setDateModel(date);
          return scope.popup.hidePopup();
        }
      };
      scope.data = {
        setDateModel: function(dateModel) {
          if (!dateModel) {
            return console.error(messages.invalidParams);
          }
          return scope.dateModel = dateModel;
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
          scope.data.viewedDate = {
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
          return scope.data.viewedDate.days = scope.data.getDaysArr(scope.data.viewedDate.month, scope.data.viewedDate.year);
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
        getDaysArr: function(month, year) {
          var arr, daysCount, k, startDay;
          daysCount = month.daysTotal;
          startDay = month.startDay;
          arr = [];
          k = 1;
          while (k <= daysCount) {
            arr.push({
              day: k,
              month: month.number,
              year: year.number
            });
            k++;
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
        isMonthExistInSource: function(yearNum, monthNum) {
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
        isCanGoNextMonth: function(isForward, yearNum, monthNum) {
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
                console.error(messages.errorOnChangeMonthOrYear);
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
                console.error(messages.errorOnChangeMonthOrYear);
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
          nextObj = scope.data.isCanGoNextMonth(isForward, scope.data.viewedDate.year.number, scope.data.viewedDate.month.number);
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
