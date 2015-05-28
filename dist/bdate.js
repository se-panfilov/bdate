angular.module('bdate.datepicker', ['bdate.popup', 'bdate.data', 'bdate.templates']).directive('bdatepicker', ['$filter', 'bDataFactory', function($filter, bDataFactory) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'default.html',
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

angular.module('bdate.popup', ['bdate.utils', 'bdate.data', 'bdate.templates']).directive('bdatePopup', ['bDateUtils', 'bDataFactory', 'MESSAGES', function(bDateUtils, bDataFactory, MESSAGES) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'popup.html',
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
              first: Object.keys(bDataFactory.data.years[yearNum])[0],
              last: Object.keys(bDataFactory.data.years[yearNum])[Object.keys(bDataFactory.data.years[yearNum]).length - 1],
              daysTotal: bDataFactory.data.years[yearNum][monthNum].days_total,
              startDay: bDataFactory.data.years[yearNum][monthNum].start_day,
              number: monthNum,
              name: bDateUtils.getMonthName(monthNum),
              count: Object.keys(bDataFactory.data.years[yearNum]).length
            }
          };
          return scope.data.viewedDate.days = scope.data.getDaysArr(scope.data.viewedDate.year, scope.data.viewedDate.month);
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
        _getPrevMonthTailDaysArr: function(yearNum, monthNum, startDay) {
          var i, isFirstMonth, isFirstYear, isPrevMonthExist, prevMonth, prevMonthNum, result;
          result = [];
          i = 1;
          isFirstMonth = bDateUtils.sourceCheckers.month.isFirstMonth(yearNum, monthNum);
          isFirstYear = bDateUtils.sourceCheckers.year.isFirstYear(yearNum, monthNum);
          prevMonthNum = monthNum - 1;
          isPrevMonthExist = bDateUtils.sourceCheckers.month.isMonthExist(yearNum, prevMonthNum);
          prevMonth = bDateUtils.sourceCheckers.month.getMonth(yearNum, prevMonthNum);
          while (i <= startDay - 1) {
            result.unshift({
              day: i,
              month: monthNum - 1,
              year: yearNum
            });
            i++;
          }
          return result;
        },
        _getNextMonthTailDaysArr: function(yearNum, monthNum, startDay, daysCount, daysArr) {
          var daysInWeek, expectedWeeksCount, i, isLastMonth, isLastYear, result;
          result = [];
          daysInWeek = 7;
          expectedWeeksCount = Math.ceil(daysArr.length / daysInWeek);
          if ((daysArr.length / daysInWeek) === Math.floor(daysArr.length / daysInWeek)) {
            return result;
          }
          isLastMonth = bDateUtils.sourceCheckers.month.isLastMonth(yearNum, monthNum);
          isLastYear = bDateUtils.sourceCheckers.year.isLastYear(yearNum, monthNum);
          i = daysArr.length;
          while (i < (expectedWeeksCount * daysInWeek)) {
            daysArr.push({
              day: i - (daysCount + startDay - 2),
              month: monthNum + 1,
              year: yearNum
            });
            i++;
          }
          return result;
        },
        _getMonthDaysArr: function(yearNum, monthNum, daysCount) {
          var i, result;
          result = [];
          i = 1;
          while (i <= daysCount) {
            result.push({
              day: i,
              month: monthNum,
              year: yearNum
            });
            i++;
          }
          return result;
        },
        getDaysArr: function(year, month) {
          var currentMonthDaysArr, daysCount, nextMonthTailDaysArr, prevMonthTailDaysArr, result, startDay;
          daysCount = +month.daysTotal;
          startDay = +month.startDay;
          prevMonthTailDaysArr = scope.data._getPrevMonthTailDaysArr(year.number, month.number, startDay);
          currentMonthDaysArr = scope.data._getMonthDaysArr(year.number, month.number, daysCount);
          result = prevMonthTailDaysArr.concat(currentMonthDaysArr);
          nextMonthTailDaysArr = scope.data._getNextMonthTailDaysArr(year.number, month.number, startDay, daysCount, result);
          result = result.concat(nextMonthTailDaysArr);
          return result;
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
        scope.data.init(bDataFactory.data);
        return scope.bDateUtils = bDateUtils;
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
  month = {
    1: {
      name: 'Январь',
      short: 'Янв'
    },
    2: {
      name: 'Февраль',
      short: 'Фев'
    },
    3: {
      name: 'Март',
      short: 'Март'
    },
    4: {
      name: 'Апрель',
      short: 'Май'
    },
    5: {
      name: 'Май',
      short: 'Май'
    },
    6: {
      name: 'Июнь',
      short: 'Июнь'
    },
    7: {
      name: 'Июль',
      short: 'Июль'
    },
    8: {
      name: 'Август',
      short: 'Авг'
    },
    9: {
      name: 'Сентябрь',
      short: 'Сент'
    },
    10: {
      name: 'Октябрь',
      short: 'Окт'
    },
    11: {
      name: 'Ноябрь',
      short: 'Ноя'
    },
    12: {
      name: 'Декабрь',
      short: 'Дек'
    }
  };
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
        isPrevMonthExist: function(yearNum, monthNum) {
          var isFirstMonth, isFirstYear, lastMonthOfPrevYearNum, prevMonthNum, prevYearNum;
          if (!yearNum || !monthNum) {
            return console.error(MESSAGES.invalidParams);
          }
          yearNum = +yearNum;
          monthNum = +monthNum;
          if (!exports.sourceCheckers.month.isMonthExist(yearNum, monthNum)) {
            return false;
          }
          isFirstMonth = exports.sourceCheckers.month.isFirstMonth(yearNum, monthNum);
          if (!isFirstMonth) {
            prevMonthNum = monthNum - 1;
            return exports.sourceCheckers.month.isMonthExist(yearNum, prevMonthNum);
          } else {
            isFirstYear = exports.sourceCheckers.year.isFirstYear(yearNum);
            if (!isFirstYear) {
              prevYearNum = yearNum - 1;
              lastMonthOfPrevYearNum = exports.sourceCheckers.month.getLastMonth(prevYearNum);
              return exports.sourceCheckers.month.isMonthExist(prevYearNum, lastMonthOfPrevYearNum);
            } else {
              return false;
            }
          }
        },
        isNextMonthExist: function(yearNum, monthNum) {
          var firstMonthOfNextYearNum, isLastMonth, isLastYear, nextMonthNum, nextYearNum;
          if (!yearNum || !monthNum) {
            return console.error(MESSAGES.invalidParams);
          }
          yearNum = +yearNum;
          monthNum = +monthNum;
          if (!exports.sourceCheckers.month.isMonthExist(yearNum, monthNum)) {
            return false;
          }
          isLastMonth = exports.sourceCheckers.month.isLastMonth(yearNum, monthNum);
          if (!isLastMonth) {
            nextMonthNum = monthNum + 1;
            return exports.sourceCheckers.month.isMonthExist(yearNum, nextMonthNum);
          } else {
            isLastYear = exports.sourceCheckers.year.isLastYear(yearNum);
            if (!isLastYear) {
              nextYearNum = yearNum + 1;
              firstMonthOfNextYearNum = exports.sourceCheckers.month.getFirstMonth(nextYearNum);
              return exports.sourceCheckers.month.isMonthExist(nextYearNum, firstMonthOfNextYearNum);
            } else {
              return false;
            }
          }
        },
        getMonth: function(yearNum, monthNum) {
          if (!yearNum || !monthNum) {
            return console.error(MESSAGES.invalidParams);
          }
          return bDataFactory.data.years[yearNum][monthNum];
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
              if (exports.sourceCheckers.year.isYearExist(nextYearNum)) {
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
        getYear: function(yearNum) {
          if (!yearNum) {
            return console.error(MESSAGES.invalidParams);
          }
          return bDataFactory.data.years[yearNum];
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

angular.module("bdate.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("default.html","<div id={{bRootId}} class=b_datepicker_root><input type=text id={{bInputId}} ng-model=date.viewed readonly=readonly class=b_input><button type=button ng-click=togglePopup() class=b_datepicker_button>H</button><bdate-popup id={{bPopupId}} popup-state=popup.state date-model=date.model></bdate-popup></div>");
$templateCache.put("popup.html","<div ng-show=popupState.isOpen class=b_popup><div class=b_popup_controls><div class=b_btn_prev_container><button type=button ng-click=data.goNextYear(false) ng-disabled=\"!bDateUtils.sourceCheckers.year.isYearExist(data.viewedDate.year.number - 1)\" class=\"b_popup_btn b_btn_prev\"><<</button><button type=button ng-click=data.goNextMonth(false) ng-disabled=\"!bDateUtils.sourceCheckers.month.isPrevMonthExist(data.viewedDate.year.number, data.viewedDate.month.number)\" class=\"b_popup_btn b_btn_prev\"><</button></div><div ng-bind=data.viewedDate.month.name class=b_popup_month></div>&nbsp;<div ng-bind=data.viewedDate.year.number class=b_popup_year></div><div class=b_btn_next_container><button type=button ng-click=data.goNextMonth(true) ng-disabled=\"!bDateUtils.sourceCheckers.month.isNextMonthExist(data.viewedDate.year.number, data.viewedDate.month.number)\" class=\"b_popup_btn b_btn_next\">></button><button type=button ng-click=data.goNextYear(true) ng-disabled=\"!bDateUtils.sourceCheckers.year.isYearExist(data.viewedDate.year.number + 1)\" class=\"b_popup_btn b_btn_next\">>></button></div></div><table class=b_popup_days><tr><td ng-repeat=\"dayOfWeek in ::data.daysOfWeek.getShorts()\" class=b_popup_day_of_week><span ng-bind=::dayOfWeek></span></td></tr></table><table class=b_popup_weeks><tr class=b_popup_week><td ng-repeat=\"date in data.viewedDate.days track by $index\" ng-class=\"{b_popup_clickable_day: date.day}\" class=b_popup_day><span ng-bind=date.day ng-click=popup.selectDate(date) role=button></span></td></tr></table><div class=b_popup_today>Сегодня &nbsp;<span ng-bind=\"data.today.date | date:data.format\"></span></div></div>");}]);