angular.module('bdate.datepicker', ['bdate.popup', 'bdate.data']).directive('bdatepicker', ['$filter', 'bDataFactory', function($filter, bDataFactory) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'bdate/dist/templates/default.html',
    scope: {
      source: '=',
      bRootId: '@?',
      bInputId: '@?',
      bPopupId: '@?'
    },
    controller: function() {
      return bDataFactory.makeDataQuery();
    },
    link: function(scope) {
      scope.date = {
        viewed: '',
        model: {}
      };
      scope.$watch('date.model', function() {
        var dateTime, formattedDate;
        if (angular.equals({}, scope.date.model)) {
          return;
        }
        dateTime = new Date(scope.date.model.year, scope.date.model.month - 1, scope.date.model.day).getTime();
        formattedDate = $filter('date')(dateTime, bDataFactory.data.format);
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

angular.module('bdate.data', []).factory('bDataFactory', function() {
  var exports, sourceData;
  sourceData = {
    format: 'dd-MM-yyyy',
    today: {
      date: 1432537266825,
      year: 2015,
      month: 5,
      day: 25,
      day_of_week: 1
    },
    years: {
      2013: {
        1: {
          days_total: 31,
          start_day: 2
        }
      },
      2014: {
        5: {
          days_total: 31,
          start_day: 4
        },
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
      },
      2016: {
        1: {
          days_total: 31,
          start_day: 5
        }
      },
      2017: {
        1: {
          days_total: 31,
          start_day: 7
        },
        2: {
          days_total: 28,
          start_day: 3
        }
      }
    }
  };
  return exports = {
    data: null,
    setData: function(source) {
      return exports.data = source;
    },
    makeDataQuery: function() {
      return exports.setData(sourceData);
    }
  };
});

angular.module('bdate', ['bdate.datepicker']).constant('MESSAGES', {
  invalidParams: 'Invalid params',
  errorOnChangeMonthOrYear: 'cannot change month or year'
});

angular.module('bdate.popup', ['bdate.utils', 'bdate.data']).directive('bdatePopup', ['bDateUtils', 'bDataFactory', 'MESSAGES', function(bDateUtils, bDataFactory, MESSAGES) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'bdate/dist/templates/popup.html',
    scope: {
      popupState: '=',
      dateModel: '='
    },
    link: function(scope) {
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
            return console.error(MESSAGES.invalidParams);
          }
          return scope.dateModel = dateModel;
        },
        format: null,
        setFormat: function(format) {
          if (!format) {
            return console.error(MESSAGES.invalidParams);
          }
          return scope.data.format = format;
        },
        viewedDate: null,
        setViewedDate: function(yearNum, monthNum) {
          if (!yearNum || !monthNum) {
            return console.error(MESSAGES.invalidParams);
          }
          yearNum = +yearNum;
          monthNum = +monthNum;
          scope.data.viewedDate = {
            year: {
              first: Object.keys(bDataFactory.data.years)[0],
              last: Object.keys(bDataFactory.data.years)[Object.keys(bDataFactory.data.years).length - 1],
              number: yearNum,
              count: Object.keys(bDataFactory.data.years).length
            },
            month: {
              daysTotal: bDataFactory.data.years[yearNum][monthNum].days_total,
              startDay: bDataFactory.data.years[yearNum][monthNum].start_day,
              number: monthNum,
              name: bDateUtils.getMonthName(monthNum),
              count: Object.keys(bDataFactory.data.years[yearNum]).length
            }
          };
          return scope.data.viewedDate.days = scope.data.getDaysArr(scope.data.viewedDate.month, scope.data.viewedDate.year);
        },
        daysOfWeek: {
          get: function() {
            return bDateUtils.daysOfWeek;
          },
          getShorts: function() {
            return bDateUtils.getDaysOfWeekShorts();
          }
        },
        today: null,
        setToday: function(today) {
          if (!today) {
            return console.error(MESSAGES.invalidParams);
          }
          return scope.data.today = today;
        },
        getDaysArr: function(month, year) {
          var arr, daysCount, daysInWeek, expectedWeeksCount, i, j, k, startDay;
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
          i = 1;
          while (i <= startDay - 1) {
            arr.unshift('');
            i++;
          }
          daysInWeek = 7;
          expectedWeeksCount = Math.ceil(arr.length / daysInWeek);
          if ((arr.length / daysInWeek) === Math.floor(arr.length / daysInWeek)) {
            return arr;
          }
          j = arr.length;
          while (j < (expectedWeeksCount * daysInWeek)) {
            arr.push('');
            j++;
          }
          return arr;
        },
        goNextMonth: function(isForward) {
          var nextObj;
          nextObj = bDateUtils.sourceCheckers.month.getNextAvailableMonth(isForward, scope.data.viewedDate.year.number, scope.data.viewedDate.month.number);
          if (nextObj) {
            return scope.data.setViewedDate(nextObj.year, nextObj.month);
          }
        },
        goNextYear: function(isForward) {
          var nextObj;
          nextObj = bDateUtils.sourceCheckers.year.getNextAvailableYear(isForward, scope.data.viewedDate.year.number, scope.data.viewedDate.month.number);
          if (nextObj) {
            return scope.data.setViewedDate(nextObj.year, nextObj.month);
          }
        },
        init: function(dateSource) {
          var firstYear;
          scope.data.setFormat(dateSource.format);
          scope.data.setToday(dateSource.today);
          if (bDateUtils.sourceCheckers.month.isMonthExist(dateSource.today.year, dateSource.today.month)) {
            return scope.data.setViewedDate(dateSource.today.year, dateSource.today.month);
          } else {
            firstYear = bDateUtils.sourceCheckers.year.getFirstYear();
            return scope.data.setViewedDate(firstYear, bDateUtils.sourceCheckers.month.getFirstMonth(firstYear));
          }
        }
      };
      return (function() {
        return scope.data.init(bDataFactory.data);
      })();
    }
  };
}]);

angular.module('bdate.utils', ['bdate.data']).factory('bDateUtils', ['MESSAGES', 'bDataFactory', function(MESSAGES, bDataFactory) {
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
    sourceCheckers: {
      month: {
        isMonthExist: function(yearNum, monthNum) {
          if (!yearNum || !monthNum) {
            return console.error(MESSAGES.invalidParams);
          }
          yearNum = +yearNum;
          monthNum = +monthNum;
          if (!bDataFactory.data.years[yearNum]) {
            return false;
          }
          return !!bDataFactory.data.years[yearNum][monthNum];
        },
        isFirstMonth: function(yearNum, monthNum) {
          yearNum = +yearNum;
          monthNum = +monthNum;
          return monthNum === +Object.keys(bDataFactory.data.years[yearNum])[0];
        },
        getFirstMonth: function(yearNum) {
          yearNum = +yearNum;
          return +Object.keys(bDataFactory.data.years[yearNum])[0];
        },
        isLastMonth: function(yearNum, monthNum) {
          yearNum = +yearNum;
          monthNum = +monthNum;
          return monthNum === +Object.keys(bDataFactory.data.years[yearNum])[Object.keys(bDataFactory.data.years[yearNum]).length - 1];
        },
        getLastMonth: function(yearNum) {
          yearNum = +yearNum;
          return +Object.keys(bDataFactory.data.years[yearNum])[Object.keys(bDataFactory.data.years[yearNum]).length - 1];
        },
        getNextAvailableMonth: function(isForward, yearNum, monthNum) {
          var isChangeYear, isFirstMonth, isLastMonth, nextMonthNum, nextYearNum, result;
          yearNum = +yearNum;
          monthNum = +monthNum;
          isFirstMonth = exports.sourceCheckers.month.isFirstMonth(yearNum, monthNum);
          isLastMonth = exports.sourceCheckers.month.isLastMonth(yearNum, monthNum);
          isChangeYear = false;
          nextYearNum = yearNum;
          nextMonthNum = monthNum;
          if (isForward) {
            if (!isLastMonth) {
              nextMonthNum = monthNum + 1;
            } else {
              isChangeYear = true;
              nextYearNum = yearNum + 1;
              if (scope.data.isYearExist(nextYearNum)) {
                nextMonthNum = exports.sourceCheckers.month.getFirstMonth(nextYearNum);
              } else {
                console.error(MESSAGES.errorOnChangeMonthOrYear);
                return false;
              }
            }
          } else if (!isForward) {
            if (!isFirstMonth) {
              nextMonthNum = monthNum - 1;
            } else {
              isChangeYear = true;
              nextYearNum = yearNum - 1;
              if (exports.sourceCheckers.year.isYearExist(nextYearNum)) {
                nextMonthNum = exports.sourceCheckers.month.getLastMonth(nextYearNum);
              } else {
                console.error(MESSAGES.errorOnChangeMonthOrYear);
                return false;
              }
            }
          }
          return result = {
            year: nextYearNum,
            month: nextMonthNum
          };
        }
      },
      year: {
        isYearExist: function(yearNum) {
          if (!yearNum) {
            return console.error(MESSAGES.invalidParams);
          }
          yearNum = +yearNum;
          return !!bDataFactory.data.years[yearNum];
        },
        isFirstYear: function(yearNum) {
          yearNum = +yearNum;
          return yearNum === +Object.keys(bDataFactory.data.years)[0];
        },
        getFirstYear: function() {
          return +Object.keys(bDataFactory.data.years)[0];
        },
        isLastYear: function(yearNum) {
          yearNum = +yearNum;
          return yearNum === +Object.keys(bDataFactory.data.years)[Object.keys(bDataFactory.data.years).length - 1];
        },
        getLastYear: function() {
          return +Object.keys(bDataFactory.data.years)[Object.keys(bDataFactory.data.years).length - 1];
        },
        getNextAvailableYear: function(isForward, yearNum, monthNum) {
          var isFirstYear, isLastYear, nextMonthNum, nextYearNum, result;
          yearNum = +yearNum;
          monthNum = +monthNum;
          isFirstYear = exports.sourceCheckers.year.isFirstYear(yearNum);
          isLastYear = exports.sourceCheckers.year.isLastYear(yearNum);
          nextYearNum = yearNum;
          nextMonthNum = monthNum;
          if (isForward) {
            if (!isLastYear) {
              nextYearNum = yearNum + 1;
              if (exports.sourceCheckers.month.isMonthExist(nextYearNum, monthNum)) {
                nextMonthNum = monthNum;
              } else {
                nextMonthNum = exports.sourceCheckers.month.getFirstMonth(nextYearNum);
              }
            } else {
              return false;
            }
          } else if (!isForward) {
            if (!isFirstYear) {
              nextYearNum = yearNum - 1;
              if (exports.sourceCheckers.month.isMonthExist(nextYearNum, monthNum)) {
                nextMonthNum = monthNum;
              } else {
                nextMonthNum = exports.sourceCheckers.month.getFirstMonth(nextYearNum);
              }
            } else {
              return false;
            }
          }
          return result = {
            year: nextYearNum,
            month: nextMonthNum
          };
        }
      }
    }
  };
}]);
