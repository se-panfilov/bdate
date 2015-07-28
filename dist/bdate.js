angular.module('bdate', ['bdate.popup', 'bdate.popup.ranged', 'bdate.templates']).directive('bdatepicker', ['$document', '$filter', function($document, $filter) {
  return {
    restrict: 'E',
    templateUrl: 'bdate.html',
    scope: {
      bModel: '=',
      bSource: '=?',
      bSettings: '=?',
      bStartSource: '=?',
      bEndSource: '=?',
      bRange: '=?',
      bRootClasses: '@?',
      bInputClasses: '@?',
      bButtonClasses: '@?',
      bPopupClasses: '@?',
      bMonthNames: '=?',
      bDaysNames: '=?',
      placeholder: '@?',
      bRefresh: "&?",
      bStartRefresh: "&?",
      bEndRefresh: "&?"
    },
    link: function(scope, elem) {
      var getFormattedDate, getFormattedDateRange, processClick;
      scope.state = {
        isDataReady: false
      };
      scope.data = {
        date: null
      };
      scope.isDataReady = true;
      getFormattedDate = function(dmy) {
        var datetime;
        datetime = new Date(dmy.year, dmy.month - 1, dmy.day).getTime();
        return $filter('date')(datetime, scope.bSettings.format);
      };
      getFormattedDateRange = function(dmyRange) {
        var datetimeEnd, datetimeStart, endDate, startDate;
        datetimeStart = new Date(dmyRange.start.year, dmyRange.start.month - 1, dmyRange.start.day).getTime();
        datetimeEnd = new Date(dmyRange.end.year, dmyRange.end.month - 1, dmyRange.end.day).getTime();
        startDate = $filter('date')(datetimeStart, scope.bSettings.format);
        endDate = $filter('date')(datetimeEnd, scope.bSettings.format);
        return startDate + scope.bSettings.range_delimiter + endDate;
      };
      scope.$watch('popup.result', function(newVal, oldVal) {
        if (newVal === oldVal) {
          return;
        }
        if (!newVal) {
          return;
        }
        if (angular.equals({}, newVal)) {
          return;
        }
        if (!scope.bRange) {
          return scope.bModel = getFormattedDate(scope.popup.result);
        } else {
          return scope.bModel = getFormattedDateRange(scope.popup.result);
        }
      }, true);
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
      scope.clear = function() {
        scope.bModel = null;
        return scope.popup.result = null;
      };
      scope.popup = {
        result: null,
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
      (function() {
        if (!scope.bRange) {
          return scope.bRefresh();
        } else {
          scope.bStartRefresh();
          return scope.bEndRefresh();
        }
      })();
      scope.bRefreshWrap = function(m, y) {
        return scope.bRefresh({
          m: m,
          y: y
        });
      };
      scope.bStartRefreshWrap = function(m, y) {
        return scope.bStartRefresh({
          m: m,
          y: y
        });
      };
      scope.bEndRefreshWrap = function(m, y) {
        return scope.bEndRefresh({
          m: m,
          y: y
        });
      };
      return $document.on('click', processClick);
    }
  };
}]);

angular.module('bdate.popup', ['bdate.templates']).directive('bdatePopup', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'popup.html',
    scope: {
      popupState: '=',
      popupSettings: '=',
      popupSource: '=',
      popupResult: '=',
      popupRefresh: "&?"
    },
    link: function(scope) {
      scope.popup = {
        hidePopup: function() {
          return scope.popupState.isOpen = false;
        },
        selectDate: function(date) {
          scope.popupResult = date;
          scope.popup.hidePopup();
          if (!scope.popup.isDayInSelectedMonth(date)) {
            return scope.popup.refreshSelectedData(date.month, date.year);
          }
        },
        goPrevYear: function() {
          var month, year;
          if (!scope.popupSource || !scope.popupSource.year) {
            return;
          }
          if (scope.popupSource.year.isStart) {
            console.error('error');
            return false;
          }
          year = scope.popupSource.year.num - 1;
          month = scope.popupSource.month.num;
          return scope.popup.refreshSelectedData(month, year);
        },
        isFirstYear: function() {
          if (!scope.popupSource || !scope.popupSource) {
            return;
          }
          return scope.popupSource.year.isStart;
        },
        goPrevMonth: function() {
          var december, month, year;
          if (!scope.popupSource || !scope.popupSource.year) {
            return;
          }
          if (scope.popupSource.month.isStart && scope.popupSource.year.isStart) {
            console.error('error');
            return false;
          }
          december = 12;
          month = scope.popupSource.month.num;
          if (scope.popupSource.month.isStart) {
            year = scope.popupSource.year.num - 1;
            month = december;
          } else if (scope.popupSource.month.isStart && scope.popupSource.year.isStart) {
            console.error('error');
            return false;
          } else {
            year = scope.popupSource.year.num;
            month = scope.popupSource.month.num - 1;
          }
          return scope.popup.refreshSelectedData(month, year);
        },
        isFirstMonth: function() {
          if (!scope.popupSource || !scope.popupSource) {
            return;
          }
          return scope.popupSource.month.isStart;
        },
        goNextMonth: function() {
          var january, month, year;
          if (!scope.popupSource || !scope.popupSource.year) {
            return;
          }
          if (scope.popupSource.month.isEnd && scope.popupSource.year.isEnd) {
            console.error('error');
            return false;
          }
          january = 1;
          month = scope.popupSource.month.num;
          if (scope.popupSource.month.isEnd) {
            year = scope.popupSource.year.num + 1;
            month = january;
          } else if (scope.popupSource.month.isEnd && scope.popupSource.year.isEnd) {
            console.error('error');
            return false;
          } else {
            year = scope.popupSource.year.num;
            month = scope.popupSource.month.num + 1;
          }
          return scope.popup.refreshSelectedData(month, year);
        },
        isLastMonth: function() {
          if (!scope.popupSource || !scope.popupSource) {
            return;
          }
          return scope.popupSource.month.isEnd;
        },
        goNextYear: function() {
          var month, year;
          if (!scope.popupSource || !scope.popupSource.year) {
            return;
          }
          if (scope.popupSource.year.isEnd) {
            console.error('error');
            return false;
          }
          year = scope.popupSource.year.num + 1;
          month = scope.popupSource.month.num;
          return scope.popup.refreshSelectedData(month, year);
        },
        isLastYear: function() {
          if (!scope.popupSource || !scope.popupSource) {
            return;
          }
          return scope.popupSource.year.isEnd;
        },
        isSelectedDay: function(date) {
          if (!scope.popupResult || !scope.popupResult.day) {
            return;
          }
          return (date.day === scope.popupResult.day) && (date.month === scope.popupResult.month) && (date.year === scope.popupResult.year);
        },
        getTodayDateTime: function() {
          var today;
          if (!scope.popupSettings || !scope.popupSettings.today) {
            return;
          }
          today = scope.popupSettings.today;
          return new Date(today.year, today.month - 1, today.day).getTime();
        },
        isDayInSelectedMonth: function(date) {
          return (date.month === scope.popupSource.month.num) && (date.year === scope.popupSource.year.num);
        },
        goToYear: function() {
          var month, year;
          year = scope.popupSource.year.num;
          month = scope.popupSource.month.num;
          return scope.popup.refreshSelectedData(month, year);
        },
        refreshSelectedData: function(month, year) {
          return scope.popupRefresh({
            m: month,
            y: year
          });
        }
      };
      return scope.$watch('popupSource', function() {
        return scope.isDataReady = true;
      }, true);
    }
  };
});

angular.module('bdate.popup.ranged', ['bdate.templates']).directive('bdateRangePopup', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'range-popup.html',
    scope: {
      popupState: '=',
      popupSettings: '=',
      popupStartSource: '=',
      popupEndSource: '=',
      popupResult: '=',
      popupStartRefresh: "&?",
      popupEndRefresh: "&?"
    },
    link: function(scope) {
      var getSource, setDataResult;
      scope.data = {
        startResult: null,
        endResult: null
      };
      getSource = function(isStartPopup) {
        if (isStartPopup) {
          return scope.popupStartSource;
        } else {
          return scope.popupEndSource;
        }
      };
      setDataResult = function(isStartPopup, date) {
        if (isStartPopup) {
          return scope.data.startResult = date;
        } else {
          return scope.data.endResult = date;
        }
      };
      scope.popup = {
        hidePopup: function() {
          return scope.popupState.isOpen = false;
        },
        selectDate: function(isStartPopup, date) {
          setDataResult(isStartPopup, date);
          if (!scope.popup.isDayInSelectedMonth(isStartPopup, date)) {
            return scope.popup.refreshSelectedData(isStartPopup, date.month, date.year);
          }
        },
        goPrevYear: function(isStartPopup) {
          var month, popupSource, year;
          popupSource = getSource(isStartPopup);
          if (!popupSource || !popupSource.year) {
            return;
          }
          if (popupSource.year.isStart) {
            console.error('error');
            return false;
          }
          year = popupSource.year.num - 1;
          month = popupSource.month.num;
          return scope.popup.refreshSelectedData(isStartPopup, month, year);
        },
        isFirstYear: function(isStartPopup) {
          var popupSource;
          popupSource = getSource(isStartPopup);
          if (!popupSource || !popupSource) {
            return;
          }
          return popupSource.year.isStart;
        },
        goPrevMonth: function(isStartPopup) {
          var december, month, popupSource, year;
          popupSource = getSource(isStartPopup);
          if (!popupSource || !popupSource.year) {
            return;
          }
          if (popupSource.month.isStart && popupSource.year.isStart) {
            console.error('error');
            return false;
          }
          december = 12;
          month = popupSource.month.num;
          if (popupSource.month.isStart) {
            year = popupSource.year.num - 1;
            month = december;
          } else if (popupSource.month.isStart && popupSource.year.isStart) {
            console.error('error');
            return false;
          } else {
            year = popupSource.year.num;
            month = popupSource.month.num - 1;
          }
          return scope.popup.refreshSelectedData(isStartPopup, month, year);
        },
        isFirstMonth: function(isStartPopup) {
          var popupSource;
          popupSource = getSource(isStartPopup);
          if (!popupSource || !popupSource) {
            return;
          }
          return popupSource.month.isStart;
        },
        goNextMonth: function(isStartPopup) {
          var january, month, popupSource, year;
          popupSource = getSource(isStartPopup);
          if (!popupSource || !popupSource.year) {
            return;
          }
          if (popupSource.month.isEnd && popupSource.year.isEnd) {
            console.error('error');
            return false;
          }
          january = 1;
          month = popupSource.month.num;
          if (popupSource.month.isEnd) {
            year = popupSource.year.num + 1;
            month = january;
          } else if (popupSource.month.isEnd && popupSource.year.isEnd) {
            console.error('error');
            return false;
          } else {
            year = popupSource.year.num;
            month = popupSource.month.num + 1;
          }
          return scope.popup.refreshSelectedData(isStartPopup, month, year);
        },
        isLastMonth: function(isStartPopup) {
          var popupSource;
          popupSource = getSource(isStartPopup);
          if (!popupSource || !popupSource) {
            return;
          }
          return popupSource.month.isEnd;
        },
        goNextYear: function(isStartPopup) {
          var month, popupSource, year;
          popupSource = getSource(isStartPopup);
          if (!popupSource || !popupSource.year) {
            return;
          }
          if (popupSource.year.isEnd) {
            console.error('error');
            return false;
          }
          year = popupSource.year.num + 1;
          month = popupSource.month.num;
          return scope.popup.refreshSelectedData(isStartPopup, month, year);
        },
        isLastYear: function(isStartPopup) {
          var popupSource;
          popupSource = getSource(isStartPopup);
          if (!popupSource || !popupSource) {
            return;
          }
          return popupSource.year.isEnd;
        },
        isSelectedDay: function(isStartPopup, date) {
          if (isStartPopup) {
            if (!scope.data.startResult || !scope.data.startResult.day) {
              return;
            }
            return (date.day === scope.data.startResult.day) && (date.month === scope.data.startResult.month) && (date.year === scope.data.startResult.year);
          } else {
            if (!scope.data.endResult || !scope.data.endResult.day) {
              return;
            }
            return (date.day === scope.data.endResult.day) && (date.month === scope.data.endResult.month) && (date.year === scope.data.endResult.year);
          }
        },
        getTodayDateTime: function() {
          var today;
          if (!scope.popupSettings || !scope.popupSettings.today) {
            return;
          }
          today = scope.popupSettings.today;
          return new Date(today.year, today.month - 1, today.day).getTime();
        },
        isDayInSelectedMonth: function(isStartPopup, date) {
          var popupSource;
          popupSource = getSource(isStartPopup);
          return (date.month === popupSource.month.num) && (date.year === popupSource.year.num);
        },
        goToYear: function(isStartPopup) {
          var month, popupSource, year;
          popupSource = getSource(isStartPopup);
          year = popupSource.year.num;
          month = popupSource.month.num;
          return scope.popup.refreshSelectedData(isStartPopup, month, year);
        },
        refreshSelectedData: function(isStartPopup, month, year) {
          if (isStartPopup) {
            return scope.popupStartRefresh({
              m: month,
              y: year
            });
          } else {
            return scope.popupEndRefresh({
              m: month,
              y: year
            });
          }
        },
        selectRangedDate: function() {
          scope.popupResult = {
            start: scope.data.startResult,
            end: scope.data.endResult
          };
          return scope.popup.hidePopup();
        }
      };
      return scope.$watch('popupSource', function() {
        return scope.isDataReady = true;
      }, true);
    }
  };
});

angular.module("bdate.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("bdate.html","<div ng-class=\"{b_datepicker_in_progress: !isDataReady}\" class=\"b_datepicker_root {{::bRootClasses}}\"><input type=text ng-model=bModel placeholder={{placeholder}} ng-click=popup.togglePopup() ng-disabled=!isDataReady aria-label=\"Toggle date popup\" readonly=readonly class=\"b_datepicker_input {{::bInputClasses}}\"><button type=button ng-click=clear() ng-keydown=clear() aria-label=\"Clear Date\" class=\"b_clear_btn {{::bButtonClasses}}\">&times;</button><button type=button ng-click=popup.togglePopup() ng-keydown=popup.togglePopup() ng-disabled=!isDataReady aria-label=\"Toggle date popup\" class=\"b_datepicker_button b_calendar_btn {{::bButtonClasses}}\">&nbsp;</button><bdate-popup popup-settings=bSettings popup-state=popup.state popup-source=bSource popup-result=popup.result popup-refresh=\"bRefreshWrap(m, y)\" ng-if=!bRange class={{::bPopupClasses}}></bdate-popup><bdate-range-popup popup-settings=bSettings popup-state=popup.state popup-start-source=bStartSource popup-end-source=bEndSource popup-result=popup.result popup-start-refresh=\"bStartRefreshWrap(m, y)\" popup-end-refresh=\"bEndRefreshWrap(m, y)\" ng-if=bRange class={{::bPopupClasses}}></bdate-range-popup></div>");
$templateCache.put("popup.html","<div ng-show=popupState.isOpen aria-label=\"Select date popup\" class=b_popup><div aria-label=\"Popup navigation\" class=b_popup_controls><div class=b_btn_prev_container><button type=button ng-click=popup.goPrevYear() aria-label=\"Select preview year\" ng-disabled=popup.isFirstYear() class=\"b_popup_btn b_btn_prev\">&#9664; &#9664;</button><button type=button ng-click=popup.goPrevMonth() aria-label=\"Select preview month\" ng-disabled=\"popup.isFirstMonth() &amp;&amp; popup.isFirstYear()\" class=\"b_popup_btn b_btn_prev\">&#9664;</button></div><div ng-bind=popupSource.month.name class=b_popup_month></div>&nbsp;<select ng-model=popupSource.year.num ng-options=\"year for year in popupSource.years\" ng-init=\"year = popupSource.year.num\" aria-label=\"Select year from list\" ng-change=popup.goToYear() class=b_popup_year></select><div class=b_btn_next_container><button type=button ng-click=popup.goNextMonth() aria-label=\"Select next month\" ng-disabled=\"popup.isLastMonth() &amp;&amp; popup.isLastYear()\" class=\"b_popup_btn b_btn_next\">&#9654;</button><button type=button ng-click=popup.goNextYear() aria-label=\"Select next year\" ng-disabled=popup.isLastYear() class=\"b_popup_btn b_btn_next\">&#9654; &#9654;</button></div></div><table aria-label=\"Days of selected month\" class=b_popup_days><tr><td ng-repeat=\"dayOfWeek in ::popupSettings.week\" aria-label=\"Days of week\" class=b_popup_day_of_week><span ng-bind=::dayOfWeek></span></td></tr></table><table class=b_popup_weeks><tr aria-label=\"Days of month\" class=b_popup_week><td ng-repeat=\"date in popupSource.dates track by $index\" ng-class=\"{b_popup_today_day_container: date.isToday}\" class=b_popup_day><button type=button ng-bind=date.day ng-click=popup.selectDate(date) ng-disabled=date.isDisabled aria-label={{date.day}}-{{date.month}}-{{date.year}} ng-class=\"{b_popup_day_in_selected_month: popup.isDayInSelectedMonth(date), b_popup_today_day: date.isToday, b_popup_selected_day: popup.isSelectedDay(date)}\" class=b_popup_day_btn></button></td></tr></table><div ng-show=popupSettings.today aria-label=\"Select today\" class=b_popup_today><button type=button ng-bind=\"popup.getTodayDateTime() | date:popupSettings.format\" ng-click=popup.selectDate(popupSettings.today) class=b_popup_today_btn></button></div></div>");
$templateCache.put("range-popup.html","<div ng-show=popupState.isOpen aria-label=\"Select dates range popup\" class=b_range_popup_back><div class=\"b_popup b_range_popup b_range_popup_start\"><div aria-label=\"Popup navigation\" class=b_popup_controls><div class=b_btn_prev_container><button type=button ng-click=popup.goPrevYear(true) aria-label=\"Select preview year\" ng-disabled=popup.isFirstYear(true) class=\"b_popup_btn b_btn_prev\">&#9664; &#9664;</button><button type=button ng-click=popup.goPrevMonth(true) aria-label=\"Select preview month\" ng-disabled=\"popup.isFirstMonth(true) &amp;&amp; popup.isFirstYear(true)\" class=\"b_popup_btn b_btn_prev\">&#9664;</button></div><div ng-bind=popupStartSource.month.name class=b_popup_month></div>&nbsp;<select ng-model=popupStartSource.year.num ng-options=\"year for year in popupStartSource.years\" ng-init=\"year = popupStartSource.year.num\" aria-label=\"Select year from list\" ng-change=popup.goToYear(true) class=b_popup_year></select><div class=b_btn_next_container><button type=button ng-click=popup.goNextMonth(true) aria-label=\"Select next month\" ng-disabled=\"popup.isLastMonth(true) &amp;&amp; popup.isLastYear(true)\" class=\"b_popup_btn b_btn_next\">&#9654;</button><button type=button ng-click=popup.goNextYear(true) aria-label=\"Select next year\" ng-disabled=popup.isLastYear(true) class=\"b_popup_btn b_btn_next\">&#9654; &#9654;</button></div></div><table aria-label=\"Days of selected month\" class=b_popup_days><tr><td ng-repeat=\"dayOfWeek in ::popupSettings.week\" class=b_popup_day_of_week><span ng-bind=::dayOfWeek></span></td></tr></table><table class=b_popup_weeks><tr aria-label=\"Days of month\" class=b_popup_week><td ng-repeat=\"date in popupStartSource.dates track by $index\" ng-class=\"{b_popup_today_day_container: date.isToday}\" class=b_popup_day><button type=button ng-bind=date.day ng-click=\"popup.selectDate(true, date)\" ng-disabled=date.isDisabled aria-label={{date.day}}-{{date.month}}-{{date.year}} ng-class=\"{b_popup_day_in_selected_month: popup.isDayInSelectedMonth(true, date), b_popup_today_day: date.isToday, b_popup_selected_day: popup.isSelectedDay(true, date)}\" class=b_popup_day_btn></button></td></tr></table><div ng-show=popupSettings.today aria-label=\"Select today\" class=b_popup_today><button type=button ng-click=\"popup.selectDate(true, popupSettings.today)\" ng-bind=\"popup.getTodayDateTime() | date:popupSettings.format\" class=b_popup_today_btn></button></div></div><div class=\"b_popup b_range_popup b_range_popup_end\"><div aria-label=\"Popup navigation\" class=b_popup_controls><div class=b_btn_prev_container><button type=button ng-click=popup.goPrevYear(false) aria-label=\"Select preview year\" ng-disabled=popup.isFirstYear(false) class=\"b_popup_btn b_btn_prev\">&#9664; &#9664;</button><button type=button ng-click=popup.goPrevMonth(false) aria-label=\"Select preview month\" ng-disabled=\"popup.isFirstMonth(false) &amp;&amp; popup.isFirstYear(false)\" class=\"b_popup_btn b_btn_prev\">&#9664;</button></div><div ng-bind=popupEndSource.month.name class=b_popup_month></div>&nbsp;<select ng-model=popupEndSource.year.num ng-options=\"year for year in popupEndSource.years\" ng-init=\"year = popupEndSource.year.num\" aria-label=\"Select year from list\" ng-change=popup.goToYear(false) class=b_popup_year></select><div class=b_btn_next_container><button type=button ng-click=popup.goNextMonth(false) aria-label=\"Select next month\" ng-disabled=\"popup.isLastMonth(false) &amp;&amp; popup.isLastYear(false)\" class=\"b_popup_btn b_btn_next\">&#9654;</button><button type=button ng-click=popup.goNextYear(false) aria-label=\"Select next year\" ng-disabled=popup.isLastYear(false) class=\"b_popup_btn b_btn_next\">&#9654; &#9654;</button></div></div><table aria-label=\"Days of selected month\" class=b_popup_days><tr><td ng-repeat=\"dayOfWeek in ::popupSettings.week\" class=b_popup_day_of_week><span ng-bind=::dayOfWeek></span></td></tr></table><table class=b_popup_weeks><tr aria-label=\"Days of month\" class=b_popup_week><td ng-repeat=\"date in popupEndSource.dates track by $index\" ng-class=\"{b_popup_today_day_container: date.isToday}\" class=b_popup_day><button type=button ng-bind=date.day ng-click=\"popup.selectDate(false, date)\" ng-disabled=date.isDisabled aria-label={{date.day}}-{{date.month}}-{{date.year}} ng-class=\"{b_popup_day_in_selected_month: popup.isDayInSelectedMonth(false, date), b_popup_today_day: date.isToday, b_popup_selected_day: popup.isSelectedDay(false, date)}\" class=b_popup_day_btn></button></td></tr></table><div ng-show=popupSettings.today aria-label=\"Select today\" class=b_popup_today><button type=button ng-click=\"popup.selectDate(false, popupSettings.today)\" ng-bind=\"popup.getTodayDateTime() | date:popupSettings.format\" class=b_popup_today_btn></button></div></div><button type=button ng-disabled=\"!data.startResult || !data.endResult\" ng-click=popup.selectRangedDate() class=ok_btn>Ok</button></div>");}]);