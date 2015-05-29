angular.module('bdate.datepicker', ['bdate.popup', 'bdate.data', 'bdate.templates']).directive('bdatepicker', ['$filter', 'bDataFactory', '$document', function($filter, bDataFactory, $document) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'bdate.html',
    scope: {
      bModel: '=',
      bSource: '=',
      bRootId: '@?',
      bInputId: '@?',
      bPopupId: '@?'
    },
    controller: ['$scope', function($scope) {
      $scope.isDataReady = false;
      return $scope.$watch('bSource', function() {
        if (bDataFactory.isDataValid($scope.bSource)) {
          bDataFactory.setData($scope.bSource);
          return $scope.isDataReady = true;
        }
      }, true);
    }],
    link: function(scope, elem) {
      var processClick;
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
        scope.date.viewed = formattedDate;
        return scope.bModel = scope.date.viewed;
      });
      processClick = function(event) {
        var clickedElem, isOpen, isOutsideClick, popupElem;
        isOpen = scope.popup.state.isOpen;
        clickedElem = event.target;
        popupElem = elem;
        isOutsideClick = (popupElem !== clickedElem) && !(popupElem[0].contains(clickedElem));
        if (isOpen && isOutsideClick) {
          return scope.$apply(function() {
            return scope.popup.hidePopup();
          });
        }
      };
      $document.on('click', processClick);
      return scope.popup = {
        state: {
          isOpen: false
        },
        togglePopup: function() {
          if (!scope.isDataReady) {
            return;
          }
          return scope.popup.state.isOpen = !scope.popup.state.isOpen;
        },
        hidePopup: function() {
          return scope.popup.state.isOpen = false;
        }
      };
    }
  };
}]);

angular.module('bdate.data', []).factory('bDataFactory', ['MESSAGES', function(MESSAGES) {
  var exports;
  return exports = {
    data: null,
    isDataReady: function() {
      return !!exports.data && exports.isDataValid(exports.data);
    },
    isDataValid: function(data) {
      if (!data || (angular.equals({}, data))) {
        return false;
      }
      if (!data.format) {
        return false;
      }
      if (!data.today) {
        return false;
      }
      if (!data.years) {
        return false;
      }
      if (!Object.keys(data.years)[0]) {
        return false;
      }
      if (!Object.keys(Object.keys(data.years)[0])[0]) {
        return false;
      }
      return true;
    },
    setData: function(source) {
      if (!exports.isDataValid(source)) {
        console.error(MESSAGES.sourceDataNotValid);
        return false;
      }
      return exports.data = source;
    }
  };
}]);

angular.module('bdate', ['bdate.datepicker']).constant('MESSAGES', {
  invalidParams: 'Invalid params',
  errorOnChangeMonthOrYear: 'cannot change month or year',
  sourceDataNotValid: 'source data(json)is not valid'
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
        setViewedDate: function(yearNum, monthNum, dayNum) {
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
            },
            day: {
              number: dayNum
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
          var i, isPrevMonthExist, prevMonthDate, prevMonthDaysCount, result;
          result = [];
          prevMonthDate = {
            day: null,
            month: null,
            year: null
          };
          isPrevMonthExist = bDateUtils.sourceCheckers.month.isPrevMonthExist(yearNum, monthNum);
          prevMonthDaysCount = 0;
          if (isPrevMonthExist) {
            prevMonthDate = bDateUtils.sourceCheckers.month.getPrevMonthObj(yearNum, monthNum);
            prevMonthDaysCount = new Date(prevMonthDate.year, prevMonthDate.month, 0).getDate();
          }
          i = 0;
          while (i < startDay - 1) {
            result.unshift({
              day: prevMonthDaysCount - i,
              month: prevMonthDate.month,
              year: prevMonthDate.year,
              isOtherMonth: true
            });
            i++;
          }
          return result;
        },
        _getNextMonthTailDaysArr: function(yearNum, monthNum, startDay, daysCount, daysArr) {
          var daysInWeek, expectedWeeksCount, i, isNextMonthExist, nextMonthDate, result;
          result = [];
          daysInWeek = 7;
          expectedWeeksCount = Math.ceil(daysArr.length / daysInWeek);
          if ((daysArr.length / daysInWeek) === Math.floor(daysArr.length / daysInWeek)) {
            return result;
          }
          nextMonthDate = {
            day: null,
            month: null,
            year: null
          };
          isNextMonthExist = bDateUtils.sourceCheckers.month.isNextMonthExist(yearNum, monthNum);
          if (isNextMonthExist) {
            nextMonthDate = bDateUtils.sourceCheckers.month.getNextMonthObj(yearNum, monthNum);
          }
          i = daysArr.length;
          while (i < (expectedWeeksCount * daysInWeek)) {
            daysArr.push({
              day: i - (daysCount + startDay - 2),
              month: nextMonthDate.month,
              year: nextMonthDate.year,
              isOtherMonth: true
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
        _markToday: function(daysArr) {
          var i;
          i = 1;
          while (i < daysArr.length) {
            if (daysArr[i].day === scope.data.today.day) {
              daysArr[i].isToday = true;
            }
            i++;
          }
          return daysArr;
        },
        getDaysArr: function(year, month) {
          var currentMonthDaysArr, daysCount, nextMonthTailDaysArr, prevMonthTailDaysArr, result, startDay;
          daysCount = +month.daysTotal;
          startDay = +month.startDay;
          prevMonthTailDaysArr = scope.data._getPrevMonthTailDaysArr(year.number, month.number, startDay);
          currentMonthDaysArr = scope.data._getMonthDaysArr(year.number, month.number, daysCount);
          if (year.number === scope.data.today.year && month.number === scope.data.today.month) {
            currentMonthDaysArr = scope.data._markToday(currentMonthDaysArr);
          }
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
          if (scope.dateModel && !angular.equals({}, scope.dateModel)) {
            return scope.data.setViewedDate(scope.dateModel.year, scope.dateModel.month, scope.dateModel.day);
          } else if (bDateUtils.sourceCheckers.month.isMonthExist(dateSource.today.year, dateSource.today.month)) {
            return scope.data.setViewedDate(dateSource.today.year, dateSource.today.month);
          } else {
            firstYear = bDateUtils.sourceCheckers.year.getFirstYear();
            return scope.data.setViewedDate(firstYear, bDateUtils.sourceCheckers.month.getFirstMonth(firstYear));
          }
        }
      };
      (function() {
        if (bDataFactory.isDataReady(bDataFactory.data)) {
          scope.data.init(bDataFactory.data);
        }
        return scope.bDateUtils = bDateUtils;
      })();
      scope.$watch((function() {
        return bDataFactory.data;
      }), (function() {
        if (bDataFactory.isDataReady(bDataFactory.data)) {
          return scope.data.init(bDataFactory.data);
        }
      }), true);
      return scope.$watch('popupState.isOpen', function() {
        if (scope.popupState.isOpen && (scope.dateModel && !angular.equals({}, scope.dateModel))) {
          scope.data.setDateModel(scope.dateModel);
          return scope.data.setViewedDate(scope.dateModel.year, scope.dateModel.month, scope.dateModel.day);
        }
      });
    }
  };
}]);

angular.module('bdate.utils', ['bdate.data']).factory('bDateUtils', ['MESSAGES', 'bDataFactory', function(MESSAGES, bDataFactory) {
  var daysOfWeekList, exports, monthObj;
  daysOfWeekList = [
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
  monthObj = {
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
    daysOfWeek: daysOfWeekList,
    month: monthObj,
    getDaysOfWeekShorts: function() {
      var i, result;
      i = 0;
      result = [];
      while (i < daysOfWeekList.length) {
        result.push(daysOfWeekList[i].short);
        i++;
      }
      return result;
    },
    getMonthName: function(number) {
      return monthObj[number].name;
    },
    makeDateModel: function(datetime) {
      var date, day, year;
      date = new Date(datetime);
      day = date.getUTCDate();
      monthObj = date.getMonth() + 1;
      year = date.getFullYear();
      return {
        day: day,
        month: monthObj,
        year: year
      };
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
        isPrevMonthExist: function(yearNum, curMonthNum) {
          var isFirstMonth, isFirstYear, lastMonthOfPrevYearNum, prevMonthNum, prevYearNum;
          if (!yearNum || !curMonthNum) {
            return false;
          }
          yearNum = +yearNum;
          curMonthNum = +curMonthNum;
          if (!exports.sourceCheckers.month.isMonthExist(yearNum, curMonthNum)) {
            return false;
          }
          isFirstMonth = exports.sourceCheckers.month.isFirstMonth(yearNum, curMonthNum);
          if (!isFirstMonth) {
            prevMonthNum = curMonthNum - 1;
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
        getPrevMonthObj: function(yearNum, curMonthNum) {
          var isFirstMonth, isFirstYear, lastMonthOfPrevYearNum, prevMonthNum, prevYearNum;
          if (!yearNum || !curMonthNum) {
            return console.error(MESSAGES.invalidParams);
          }
          yearNum = +yearNum;
          curMonthNum = +curMonthNum;
          isFirstMonth = exports.sourceCheckers.month.isFirstMonth(yearNum, curMonthNum);
          if (!isFirstMonth) {
            prevMonthNum = curMonthNum - 1;
            if (exports.sourceCheckers.month.isMonthExist(yearNum, prevMonthNum)) {
              return {
                year: yearNum,
                month: prevMonthNum
              };
            } else {
              return null;
            }
          } else {
            isFirstYear = exports.sourceCheckers.year.isFirstYear(yearNum);
            if (!isFirstYear) {
              prevYearNum = yearNum - 1;
              lastMonthOfPrevYearNum = exports.sourceCheckers.month.getLastMonth(prevYearNum);
              if (exports.sourceCheckers.month.isMonthExist(prevYearNum, lastMonthOfPrevYearNum)) {
                return {
                  year: prevYearNum,
                  month: lastMonthOfPrevYearNum
                };
              } else {
                return null;
              }
            } else {
              return null;
            }
          }
        },
        isNextMonthExist: function(yearNum, curMonthNum) {
          var firstMonthOfNextYearNum, isLastMonth, isLastYear, nextMonthNum, nextYearNum;
          if (!yearNum || !curMonthNum) {
            return false;
          }
          yearNum = +yearNum;
          curMonthNum = +curMonthNum;
          if (!exports.sourceCheckers.month.isMonthExist(yearNum, curMonthNum)) {
            return false;
          }
          isLastMonth = exports.sourceCheckers.month.isLastMonth(yearNum, curMonthNum);
          if (!isLastMonth) {
            nextMonthNum = curMonthNum + 1;
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
        getNextMonthObj: function(yearNum, curMonthNum) {
          var firstMonthOfNextYearNum, isLastMonth, isLastYear, nextMonthNum, nextYearNum;
          if (!yearNum || !curMonthNum) {
            return console.error(MESSAGES.invalidParams);
          }
          yearNum = +yearNum;
          curMonthNum = +curMonthNum;
          isLastMonth = exports.sourceCheckers.month.isLastMonth(yearNum, curMonthNum);
          if (!isLastMonth) {
            nextMonthNum = curMonthNum + 1;
            if (exports.sourceCheckers.month.isMonthExist(yearNum, nextMonthNum)) {
              return {
                year: yearNum,
                month: nextMonthNum
              };
            } else {
              return null;
            }
          } else {
            isLastYear = exports.sourceCheckers.year.isLastYear(yearNum);
            if (!isLastYear) {
              nextYearNum = yearNum + 1;
              firstMonthOfNextYearNum = exports.sourceCheckers.month.getFirstMonth(nextYearNum);
              if (exports.sourceCheckers.month.isMonthExist(nextYearNum, firstMonthOfNextYearNum)) {
                return {
                  year: nextYearNum,
                  month: firstMonthOfNextYearNum
                };
              } else {
                return null;
              }
            } else {
              return null;
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
          var isFirstMonth, isLastMonth, nextMonthNum, nextYearNum, result;
          yearNum = +yearNum;
          monthNum = +monthNum;
          isFirstMonth = exports.sourceCheckers.month.isFirstMonth(yearNum, monthNum);
          isLastMonth = exports.sourceCheckers.month.isLastMonth(yearNum, monthNum);
          nextYearNum = yearNum;
          nextMonthNum = monthNum;
          if (isForward) {
            if (!isLastMonth) {
              nextMonthNum = monthNum + 1;
            } else {
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

angular.module("bdate.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("bdate.html","<div id={{bRootId}} ng-class=\"{b_datepicker_in_progress: !isDataReady}\" class=b_datepicker_root><input type=text id={{bInputId}} ng-model=date.viewed ng-click=popup.togglePopup() ng-disabled=!isDataReady readonly=readonly class=b_datepicker_input><button type=button ng-click=popup.togglePopup() ng-disabled=!isDataReady class=b_datepicker_button>&nbsp;</button><bdate-popup id={{bPopupId}} popup-state=popup.state date-model=date.model></bdate-popup></div>");
$templateCache.put("popup.html","<div ng-show=popupState.isOpen class=b_popup><div class=b_popup_controls><div class=b_btn_prev_container><button type=button ng-click=data.goNextYear(false) ng-disabled=\"!bDateUtils.sourceCheckers.year.isYearExist(data.viewedDate.year.number - 1)\" class=\"b_popup_btn b_btn_prev\"><<</button><button type=button ng-click=data.goNextMonth(false) ng-disabled=\"!bDateUtils.sourceCheckers.month.isPrevMonthExist(data.viewedDate.year.number, data.viewedDate.month.number)\" class=\"b_popup_btn b_btn_prev\"><</button></div><div ng-bind=data.viewedDate.month.name class=b_popup_month></div>&nbsp;<div ng-bind=data.viewedDate.year.number class=b_popup_year></div><div class=b_btn_next_container><button type=button ng-click=data.goNextMonth(true) ng-disabled=\"!bDateUtils.sourceCheckers.month.isNextMonthExist(data.viewedDate.year.number, data.viewedDate.month.number)\" class=\"b_popup_btn b_btn_next\">></button><button type=button ng-click=data.goNextYear(true) ng-disabled=\"!bDateUtils.sourceCheckers.year.isYearExist(data.viewedDate.year.number + 1)\" class=\"b_popup_btn b_btn_next\">>></button></div></div><table class=b_popup_days><tr><td ng-repeat=\"dayOfWeek in ::data.daysOfWeek.getShorts()\" class=b_popup_day_of_week><span ng-bind=::dayOfWeek></span></td></tr></table><table class=b_popup_weeks><tr class=b_popup_week><td ng-repeat=\"date in data.viewedDate.days track by $index\" class=b_popup_day><button type=button ng-bind=date.day ng-click=popup.selectDate(date) ng-class=\"{b_popup_cur_month_day: !date.isOtherMonth, b_popup_today_day: date.isToday, b_popup_selected_day: date.day == dateModel.day &amp;&amp; date.month == dateModel.month &amp;&amp; date.year == dateModel.year}\" class=b_popup_day_btn></button></td></tr></table><div class=b_popup_today>Сегодня<button type=button ng-bind=\"data.today.date | date:data.format\" ng-click=popup.selectDate(bDateUtils.makeDateModel(data.today.date)) class=b_popup_today_btn></button></div></div>");}]);