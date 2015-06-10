angular.module('bdate.datepicker', ['bdate.popup', 'bdate.data', 'bdate.templates']).directive('bdatepicker', ['$filter', 'bDataFactory', 'bDateUtils', '$document', function($filter, bDataFactory, bDateUtils, $document) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'bdate.html',
    scope: {
      bModel: '=',
      bSource: '=',
      bRootId: '@?',
      bInputId: '@?',
      bPopupId: '@?',
      bRootClasses: '@?',
      bInputClasses: '@?',
      bButtonClasses: '@?',
      bPopupClasses: '@?'
    },
    controller: ['$scope', function($scope) {
      var _generateRandomId;
      _generateRandomId = function() {
        return Math.random().toString(36).substring(12);
      };
      $scope.dateStoreId = _generateRandomId();
      $scope.isDataReady = false;
      return $scope.$watch('bSource', function() {
        if (bDataFactory.isDataValid($scope.bSource)) {
          bDataFactory.setData($scope.bSource, $scope.dateStoreId);
          return $scope.isDataReady = true;
        }
      }, true);
    }],
    link: function(scope, elem) {
      var doNotUpdateModelTwice, processClick;
      scope.date = {
        viewed: '',
        model: {}
      };
      doNotUpdateModelTwice = false;
      scope.$watch('bModel', function(newVal, oldVal) {
        var bModelDate, isEmptyModel, isSameDate;
        isSameDate = scope.bModel === scope.date.viewed;
        isEmptyModel = scope.bModel === '' || scope.bModel === ' ' || !scope.bModel;
        if (isSameDate || isEmptyModel) {
          return false;
        }
        bModelDate = bDateUtils.stringToDate(scope.bModel, bDataFactory.data[scope.dateStoreId].format, bDataFactory.data[scope.dateStoreId].delimiter);
        if (!angular.isDate(bModelDate)) {
          return false;
        }
        scope.date.viewed = scope.bModel;
        doNotUpdateModelTwice = true;
        return scope.date.model = {
          day: bModelDate.getDate(),
          month: bModelDate.getMonth() + 1,
          year: bModelDate.getFullYear()
        };
      });
      scope.$watch('date.model', function() {
        var dateTime, formattedDate;
        if (angular.equals({}, scope.date.model)) {
          return;
        }
        if (doNotUpdateModelTwice) {
          return doNotUpdateModelTwice = false;
        }
        dateTime = new Date(scope.date.model.year, scope.date.model.month - 1, scope.date.model.day).getTime();
        formattedDate = $filter('date')(dateTime, bDataFactory.data[scope.dateStoreId].format);
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
    data: {},
    isDataReady: function(storeId) {
      if (!storeId) {
        return console.error(MESSAGES.invalidParams);
      }
      return !!exports.data[storeId] && exports.isDataValid(exports.data[storeId]);
    },
    isDataValid: function(data) {
      if (!data || (angular.equals({}, data))) {
        return false;
      }
      if (!data.format) {
        return false;
      }
      if (!data.delimiter) {
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
    setData: function(source, storeId) {
      if (!exports.isDataValid(source)) {
        console.error(MESSAGES.sourceDataNotValid);
        return false;
      }
      exports.data[storeId] = JSON.parse(JSON.stringify(source));
      exports.data[storeId].today.date = exports.data[storeId].today.date * 1000;
      return exports.data[storeId];
    }
  };
}]);

angular.module('bdate', ['bdate.datepicker']).constant('MESSAGES', {
  invalidParams: 'Invalid params',
  errorOnChangeMonthOrYear: 'cannot change month or year',
  sourceDataNotValid: 'source data(json)is not valid',
  dateNotReady: 'source data(json)is not ready(null?)'
});

angular.module('bdate.popup', ['bdate.utils', 'bdate.data', 'bdate.templates']).directive('bdatePopup', ['bDateUtils', 'bDataFactory', 'MESSAGES', function(bDateUtils, bDataFactory, MESSAGES) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'popup.html',
    scope: {
      popupState: '=',
      dateModel: '=',
      dateStoreId: '@?'
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
              first: +Object.keys(bDataFactory.data[scope.dateStoreId].years)[0],
              last: +Object.keys(bDataFactory.data[scope.dateStoreId].years)[Object.keys(bDataFactory.data[scope.dateStoreId].years).length - 1],
              number: +yearNum,
              count: +Object.keys(bDataFactory.data[scope.dateStoreId].years).length
            },
            month: {
              first: +Object.keys(bDataFactory.data[scope.dateStoreId].years[yearNum])[0],
              last: +Object.keys(bDataFactory.data[scope.dateStoreId].years[yearNum])[Object.keys(bDataFactory.data[scope.dateStoreId].years[yearNum]).length - 1],
              daysTotal: +bDataFactory.data[scope.dateStoreId].years[yearNum][monthNum].days_total,
              startDay: +bDataFactory.data[scope.dateStoreId].years[yearNum][monthNum].start_day,
              number: +monthNum,
              name: bDateUtils.getMonthName(monthNum),
              count: +Object.keys(bDataFactory.data[scope.dateStoreId].years[yearNum]).length
            },
            day: {
              number: +dayNum
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
          isPrevMonthExist = bDateUtils.sourceCheckers.month.isPrevMonthExist(yearNum, monthNum, scope.dateStoreId);
          prevMonthDaysCount = 0;
          if (isPrevMonthExist) {
            prevMonthDate = bDateUtils.sourceCheckers.month.getPrevMonthObj(yearNum, monthNum, scope.dateStoreId);
            prevMonthDaysCount = new Date(prevMonthDate.year, prevMonthDate.month, 0).getDate();
          }
          i = 0;
          while (i < startDay - 1) {
            result.unshift({
              day: isPrevMonthExist ? prevMonthDaysCount - i : "",
              month: isPrevMonthExist ? prevMonthDate.month : null,
              year: isPrevMonthExist ? prevMonthDate.year : null,
              isOtherMonth: true,
              isLocked: !isPrevMonthExist
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
          isNextMonthExist = bDateUtils.sourceCheckers.month.isNextMonthExist(yearNum, monthNum, scope.dateStoreId);
          if (isNextMonthExist) {
            nextMonthDate = bDateUtils.sourceCheckers.month.getNextMonthObj(yearNum, monthNum, scope.dateStoreId);
          }
          i = daysArr.length;
          while (i < (expectedWeeksCount * daysInWeek)) {
            daysArr.push({
              day: isNextMonthExist ? i - (daysCount + startDay - 2) : "",
              month: isNextMonthExist ? nextMonthDate.month : null,
              year: isNextMonthExist ? nextMonthDate.year : null,
              isOtherMonth: true,
              isLocked: !isNextMonthExist
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
          nextObj = bDateUtils.sourceCheckers.month.getNextAvailableMonth(isForward, scope.data.viewedDate.year.number, scope.data.viewedDate.month.number, scope.dateStoreId);
          if (nextObj) {
            return scope.data.setViewedDate(nextObj.year, nextObj.month);
          }
        },
        goNextYear: function(isForward) {
          var nextObj;
          nextObj = bDateUtils.sourceCheckers.year.getNextAvailableYear(isForward, scope.data.viewedDate.year.number, scope.data.viewedDate.month.number, scope.dateStoreId);
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
          } else if (bDateUtils.sourceCheckers.month.isMonthExist(dateSource.today.year, dateSource.today.month, scope.dateStoreId)) {
            return scope.data.setViewedDate(dateSource.today.year, dateSource.today.month);
          } else {
            firstYear = bDateUtils.sourceCheckers.year.getFirstYear(scope.dateStoreId);
            return scope.data.setViewedDate(firstYear, bDateUtils.sourceCheckers.month.getFirstMonth(firstYear, scope.dateStoreId));
          }
        }
      };
      (function() {
        if (bDataFactory.isDataReady(scope.dateStoreId)) {
          scope.data.init(bDataFactory.data[scope.dateStoreId]);
        }
        return scope.bDateUtils = bDateUtils;
      })();
      scope.$watch((function() {
        return bDataFactory.data[scope.dateStoreId];
      }), (function() {
        if (bDataFactory.isDataReady(scope.dateStoreId)) {
          return scope.data.init(bDataFactory.data[scope.dateStoreId]);
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
      return exports.month[number].name;
    },
    makeDateModel: function(datetime) {
      var date, day, month, year;
      date = new Date(datetime);
      day = date.getDate();
      month = date.getMonth() + 1;
      year = date.getFullYear();
      return {
        day: day,
        month: month,
        year: year
      };
    },
    stringToDate: function(dateStr, format, delimiter) {
      var dateItems, day, dayIndex, formatItems, formatLowerCase, month, monthIndex, year, yearIndex;
      formatLowerCase = format.toLowerCase();
      formatItems = formatLowerCase.split(delimiter);
      dateItems = dateStr.split(delimiter);
      monthIndex = formatItems.indexOf('mm');
      dayIndex = formatItems.indexOf('dd');
      yearIndex = formatItems.indexOf('yyyy');
      year = +dateItems[yearIndex];
      month = +dateItems[monthIndex] - 1;
      day = +dateItems[dayIndex];
      if (month > 12) {
        return false;
      }
      if (day > 31) {
        return false;
      }
      return new Date(year, month, day);
    },
    isValidDate: function(date) {
      if (!angular.isDate) {
        date = new Date(date);
      }
      if (isNaN(date.getTime())) {
        return false;
      }
    },
    sourceCheckers: {
      month: {
        isMonthExist: function(yearNum, monthNum, storeId) {
          if (!yearNum || !monthNum) {
            return console.error(MESSAGES.invalidParams);
          }
          yearNum = +yearNum;
          monthNum = +monthNum;
          if (!bDataFactory.isDataReady(storeId)) {
            return false;
          }
          if (!bDataFactory.data[storeId].years[yearNum]) {
            return false;
          }
          return !!bDataFactory.data[storeId].years[yearNum][monthNum];
        },
        isPrevMonthExist: function(yearNum, curMonthNum, storeId) {
          var isFirstMonth, isFirstYear, lastMonthOfPrevYearNum, prevMonthNum, prevYearNum;
          if (!yearNum || !curMonthNum) {
            return false;
          }
          yearNum = +yearNum;
          curMonthNum = +curMonthNum;
          if (!exports.sourceCheckers.month.isMonthExist(yearNum, curMonthNum, storeId)) {
            return false;
          }
          isFirstMonth = exports.sourceCheckers.month.isFirstMonth(yearNum, curMonthNum, storeId);
          if (!isFirstMonth) {
            prevMonthNum = curMonthNum - 1;
            return exports.sourceCheckers.month.isMonthExist(yearNum, prevMonthNum, storeId);
          } else {
            isFirstYear = exports.sourceCheckers.year.isFirstYear(yearNum, storeId);
            if (!isFirstYear) {
              prevYearNum = yearNum - 1;
              lastMonthOfPrevYearNum = exports.sourceCheckers.month.getLastMonth(prevYearNum, storeId);
              return exports.sourceCheckers.month.isMonthExist(prevYearNum, lastMonthOfPrevYearNum, storeId);
            } else {
              return false;
            }
          }
        },
        getPrevMonthObj: function(yearNum, curMonthNum, storeId) {
          var isFirstMonth, isFirstYear, lastMonthOfPrevYearNum, prevMonthNum, prevYearNum;
          if (!yearNum || !curMonthNum) {
            return console.error(MESSAGES.invalidParams);
          }
          yearNum = +yearNum;
          curMonthNum = +curMonthNum;
          isFirstMonth = exports.sourceCheckers.month.isFirstMonth(yearNum, curMonthNum, storeId);
          if (!isFirstMonth) {
            prevMonthNum = curMonthNum - 1;
            if (exports.sourceCheckers.month.isMonthExist(yearNum, prevMonthNum, storeId)) {
              return {
                year: yearNum,
                month: prevMonthNum
              };
            } else {
              return null;
            }
          } else {
            isFirstYear = exports.sourceCheckers.year.isFirstYear(yearNum, storeId);
            if (!isFirstYear) {
              prevYearNum = yearNum - 1;
              lastMonthOfPrevYearNum = exports.sourceCheckers.month.getLastMonth(prevYearNum, storeId);
              if (exports.sourceCheckers.month.isMonthExist(prevYearNum, lastMonthOfPrevYearNum, storeId)) {
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
        isNextMonthExist: function(yearNum, curMonthNum, storeId) {
          var firstMonthOfNextYearNum, isLastMonth, isLastYear, nextMonthNum, nextYearNum;
          if (!yearNum || !curMonthNum) {
            return false;
          }
          yearNum = +yearNum;
          curMonthNum = +curMonthNum;
          if (!exports.sourceCheckers.month.isMonthExist(yearNum, curMonthNum, storeId)) {
            return false;
          }
          isLastMonth = exports.sourceCheckers.month.isLastMonth(yearNum, curMonthNum, storeId);
          if (!isLastMonth) {
            nextMonthNum = curMonthNum + 1;
            return exports.sourceCheckers.month.isMonthExist(yearNum, nextMonthNum, storeId);
          } else {
            isLastYear = exports.sourceCheckers.year.isLastYear(yearNum, storeId);
            if (!isLastYear) {
              nextYearNum = yearNum + 1;
              firstMonthOfNextYearNum = exports.sourceCheckers.month.getFirstMonth(nextYearNum, storeId);
              return exports.sourceCheckers.month.isMonthExist(nextYearNum, firstMonthOfNextYearNum, storeId);
            } else {
              return false;
            }
          }
        },
        getNextMonthObj: function(yearNum, curMonthNum, storeId) {
          var firstMonthOfNextYearNum, isLastMonth, isLastYear, nextMonthNum, nextYearNum;
          if (!yearNum || !curMonthNum) {
            return console.error(MESSAGES.invalidParams);
          }
          yearNum = +yearNum;
          curMonthNum = +curMonthNum;
          isLastMonth = exports.sourceCheckers.month.isLastMonth(yearNum, curMonthNum, storeId);
          if (!isLastMonth) {
            nextMonthNum = curMonthNum + 1;
            if (exports.sourceCheckers.month.isMonthExist(yearNum, nextMonthNum, storeId)) {
              return {
                year: yearNum,
                month: nextMonthNum
              };
            } else {
              return null;
            }
          } else {
            isLastYear = exports.sourceCheckers.year.isLastYear(yearNum, storeId);
            if (!isLastYear) {
              nextYearNum = yearNum + 1;
              firstMonthOfNextYearNum = exports.sourceCheckers.month.getFirstMonth(nextYearNum, storeId);
              if (exports.sourceCheckers.month.isMonthExist(nextYearNum, firstMonthOfNextYearNum, storeId)) {
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
        getMonth: function(yearNum, monthNum, storeId) {
          if (!yearNum || !monthNum) {
            return console.error(MESSAGES.invalidParams);
          }
          if (!bDataFactory.isDataReady(storeId)) {
            return console.error(MESSAGES.dateNotReady);
          }
          return bDataFactory.data[storeId].years[yearNum][monthNum];
        },
        isFirstMonth: function(yearNum, monthNum, storeId) {
          if (!bDataFactory.isDataReady(storeId)) {
            return console.error(MESSAGES.dateNotReady);
          }
          yearNum = +yearNum;
          monthNum = +monthNum;
          return monthNum === +Object.keys(bDataFactory.data[storeId].years[yearNum])[0];
        },
        getFirstMonth: function(yearNum, storeId) {
          if (!bDataFactory.isDataReady(storeId)) {
            return console.error(MESSAGES.dateNotReady);
          }
          yearNum = +yearNum;
          return +Object.keys(bDataFactory.data[storeId].years[yearNum])[0];
        },
        isLastMonth: function(yearNum, monthNum, storeId) {
          if (!bDataFactory.isDataReady(storeId)) {
            return console.error(MESSAGES.dateNotReady);
          }
          yearNum = +yearNum;
          monthNum = +monthNum;
          return monthNum === +Object.keys(bDataFactory.data[storeId].years[yearNum])[Object.keys(bDataFactory.data[storeId].years[yearNum]).length - 1];
        },
        getLastMonth: function(yearNum, storeId) {
          if (!bDataFactory.isDataReady(storeId)) {
            return console.error(MESSAGES.dateNotReady);
          }
          yearNum = +yearNum;
          return +Object.keys(bDataFactory.data[storeId].years[yearNum])[Object.keys(bDataFactory.data[storeId].years[yearNum]).length - 1];
        },
        getNextAvailableMonth: function(isForward, yearNum, monthNum, storeId) {
          var isFirstMonth, isLastMonth, nextMonthNum, nextYearNum, result;
          yearNum = +yearNum;
          monthNum = +monthNum;
          isFirstMonth = exports.sourceCheckers.month.isFirstMonth(yearNum, monthNum, storeId);
          isLastMonth = exports.sourceCheckers.month.isLastMonth(yearNum, monthNum, storeId);
          nextYearNum = yearNum;
          nextMonthNum = monthNum;
          if (isForward) {
            if (!isLastMonth) {
              nextMonthNum = monthNum + 1;
            } else {
              nextYearNum = yearNum + 1;
              if (exports.sourceCheckers.year.isYearExist(nextYearNum, storeId)) {
                nextMonthNum = exports.sourceCheckers.month.getFirstMonth(nextYearNum, storeId);
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
              if (exports.sourceCheckers.year.isYearExist(nextYearNum, storeId)) {
                nextMonthNum = exports.sourceCheckers.month.getLastMonth(nextYearNum, storeId);
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
        isYearExist: function(yearNum, storeId) {
          if (!yearNum) {
            return console.error(MESSAGES.invalidParams);
          }
          if (!bDataFactory.isDataReady(storeId)) {
            return false;
          }
          yearNum = +yearNum;
          return !!bDataFactory.data[storeId].years[yearNum];
        },
        getYear: function(yearNum, storeId) {
          if (!yearNum) {
            return console.error(MESSAGES.invalidParams);
          }
          if (!bDataFactory.isDataReady(storeId)) {
            return console.error(MESSAGES.dateNotReady);
          }
          return bDataFactory.data[storeId].years[yearNum];
        },
        isFirstYear: function(yearNum, storeId) {
          yearNum = +yearNum;
          return yearNum === +Object.keys(bDataFactory.data[storeId].years)[0];
        },
        getFirstYear: function(storeId) {
          if (!bDataFactory.isDataReady(storeId)) {
            return console.error(MESSAGES.dateNotReady);
          }
          return +Object.keys(bDataFactory.data[storeId].years)[0];
        },
        isLastYear: function(yearNum, storeId) {
          if (!bDataFactory.isDataReady(storeId)) {
            return console.error(MESSAGES.dateNotReady);
          }
          yearNum = +yearNum;
          return yearNum === +Object.keys(bDataFactory.data[storeId].years)[Object.keys(bDataFactory.data[storeId].years).length - 1];
        },
        getLastYear: function(storeId) {
          if (!bDataFactory.isDataReady(storeId)) {
            return console.error(MESSAGES.dateNotReady);
          }
          return +Object.keys(bDataFactory.data[storeId].years)[Object.keys(bDataFactory.data[storeId].years).length - 1];
        },
        getNextAvailableYear: function(isForward, yearNum, monthNum, storeId) {
          var isFirstYear, isLastYear, nextMonthNum, nextYearNum, result;
          yearNum = +yearNum;
          monthNum = +monthNum;
          isFirstYear = exports.sourceCheckers.year.isFirstYear(yearNum, storeId);
          isLastYear = exports.sourceCheckers.year.isLastYear(yearNum, storeId);
          nextYearNum = yearNum;
          nextMonthNum = monthNum;
          if (isForward) {
            if (!isLastYear) {
              nextYearNum = yearNum + 1;
              if (exports.sourceCheckers.month.isMonthExist(nextYearNum, monthNum, storeId)) {
                nextMonthNum = monthNum;
              } else {
                nextMonthNum = exports.sourceCheckers.month.getFirstMonth(nextYearNum, storeId);
              }
            } else {
              return false;
            }
          } else if (!isForward) {
            if (!isFirstYear) {
              nextYearNum = yearNum - 1;
              if (exports.sourceCheckers.month.isMonthExist(nextYearNum, monthNum, storeId)) {
                nextMonthNum = monthNum;
              } else {
                nextMonthNum = exports.sourceCheckers.month.getFirstMonth(nextYearNum, storeId);
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

angular.module("bdate.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("bdate.html","<div id={{::bRootId}} ng-class=\"{b_datepicker_in_progress: !isDataReady}\" class=\"b_datepicker_root {{::bRootClasses}}\"><input type=text id={{::bInputId}} ng-model=date.viewed ng-click=popup.togglePopup() ng-disabled=!isDataReady readonly=readonly class=\"b_datepicker_input {{::bInputClasses}}\"><button type=button ng-click=popup.togglePopup() ng-disabled=!isDataReady class=\"b_datepicker_button {{::bButtonClasses}}\">&nbsp;</button><bdate-popup id={{::bPopupId}} popup-state=popup.state date-model=date.model date-store-id={{::dateStoreId}} class={{::bPopupClasses}}></bdate-popup></div>");
$templateCache.put("popup.html","<div ng-show=popupState.isOpen class=b_popup><div class=b_popup_controls><div class=b_btn_prev_container><button type=button ng-click=data.goNextYear(false) ng-disabled=\"!bDateUtils.sourceCheckers.year.isYearExist(data.viewedDate.year.number - 1, dateStoreId)\" class=\"b_popup_btn b_btn_prev\">&#9664;&#9664;</button><button type=button ng-click=data.goNextMonth(false) ng-disabled=\"!bDateUtils.sourceCheckers.month.isPrevMonthExist(data.viewedDate.year.number, data.viewedDate.month.number, dateStoreId)\" class=\"b_popup_btn b_btn_prev\">&#9664;</button></div><div ng-bind=data.viewedDate.month.name class=b_popup_month></div>&nbsp;<div ng-bind=data.viewedDate.year.number class=b_popup_year></div><div class=b_btn_next_container><button type=button ng-click=data.goNextMonth(true) ng-disabled=\"!bDateUtils.sourceCheckers.month.isNextMonthExist(data.viewedDate.year.number, data.viewedDate.month.number, dateStoreId)\" class=\"b_popup_btn b_btn_next\">&#9654;</button><button type=button ng-click=data.goNextYear(true) ng-disabled=\"!bDateUtils.sourceCheckers.year.isYearExist(data.viewedDate.year.number + 1, dateStoreId)\" class=\"b_popup_btn b_btn_next\">&#9654;&#9654;</button></div></div><table class=b_popup_days><tr><td ng-repeat=\"dayOfWeek in ::data.daysOfWeek.getShorts()\" class=b_popup_day_of_week><span ng-bind=::dayOfWeek></span></td></tr></table><table class=b_popup_weeks><tr class=b_popup_week><td ng-repeat=\"date in data.viewedDate.days track by $index\" ng-class=\"{b_popup_today_day_container: date.isToday}\" class=b_popup_day><button type=button ng-bind=date.day ng-click=popup.selectDate(date) ng-disabled=date.isLocked ng-class=\"{b_popup_cur_month_day: !date.isOtherMonth, b_popup_today_day: date.isToday, b_popup_selected_day: date.day == dateModel.day &amp;&amp; date.month == dateModel.month &amp;&amp; date.year == dateModel.year, b_popup_locked_day: date.isLocked}\" class=b_popup_day_btn></button></td></tr></table><div ng-show=\"bDateUtils.isMonthExist(data.today.year, data.today.month, dateStoreId)\" class=b_popup_today>Сегодня<button type=button ng-bind=\"data.today.date | date:data.format\" ng-click=popup.selectDate(bDateUtils.makeDateModel(data.today.date)) class=b_popup_today_btn></button></div></div>");}]);