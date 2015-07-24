angular.module('bdate', ['bdate.popup', 'bdate.popup.ranged', 'bdate.templates']).directive('bdatepicker', ['$document', '$filter', function($document, $filter) {
  return {
    restrict: 'E',
    templateUrl: 'bdate.html',
    scope: {
      bModel: '=',
      bSource: '=?',
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
    controller: ['$scope', function($scope) {
      var getFormattedDate;
      $scope.state = {
        isDataReady: false
      };
      $scope.data = {
        date: null
      };
      $scope.$watch('bSource', function() {
        return $scope.isDataReady = true;
      }, true);
      getFormattedDate = function(dmy) {
        var datetime;
        datetime = new Date(dmy.year, dmy.month - 1, dmy.day).getTime();
        return $filter('date')(datetime, $scope.bSource.format);
      };
      return $scope.$watch('popupResult', function(newVal, oldVal) {
        if (newVal === oldVal) {
          return;
        }
        if (!newVal) {
          return;
        }
        if (angular.equals({}, newVal)) {
          return;
        }
        return $scope.bModel = getFormattedDate($scope.popupResult);
      }, true);
    }],
    link: function(scope, elem) {
      var processClick;
      scope.date = {
        viewed: '',
        model: {}
      };
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
        return scope.popupResult = null;
      };
      scope.popup = {
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
        return scope.bRefresh();
      })();
      scope.bRefreshTest = function(m, y) {
        return scope.bRefresh({
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
      popupSource: '=',
      popupResult: '=',
      popupRefresh: "&?"
    },
    link: function(scope) {
      scope.$watch('popupSource', function() {
        return console.log(scope.popupState);
      }, true);
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
          if (!scope.popupSource.selected || !scope.popupSource.selected.year) {
            return;
          }
          if (scope.popupSource.selected.year.isStart) {
            console.error('error');
            return false;
          }
          year = scope.popupSource.selected.year.num - 1;
          month = scope.popupSource.selected.month.num;
          return scope.popup.refreshSelectedData(month, year);
        },
        isFirstYear: function() {
          if (!scope.popupSource || !scope.popupSource.selected) {
            return;
          }
          return scope.popupSource.selected.year.isStart;
        },
        goPrevMonth: function() {
          var december, month, year;
          if (!scope.popupSource.selected || !scope.popupSource.selected.year) {
            return;
          }
          if (scope.popupSource.selected.month.isStart && scope.popupSource.selected.year.isStart) {
            console.error('error');
            return false;
          }
          december = 12;
          month = scope.popupSource.selected.month.num;
          if (scope.popupSource.selected.month.isStart) {
            year = scope.popupSource.selected.year.num - 1;
            month = december;
          } else if (scope.popupSource.selected.month.isStart && scope.popupSource.selected.year.isStart) {
            console.error('error');
            return false;
          } else {
            year = scope.popupSource.selected.year.num;
            month = scope.popupSource.selected.month.num - 1;
          }
          return scope.popup.refreshSelectedData(month, year);
        },
        isFirstMonth: function() {
          if (!scope.popupSource || !scope.popupSource.selected) {
            return;
          }
          return scope.popupSource.selected.month.isStart;
        },
        goNextMonth: function() {
          var january, month, year;
          if (!scope.popupSource.selected || !scope.popupSource.selected.year) {
            return;
          }
          if (scope.popupSource.selected.month.isEnd && scope.popupSource.selected.year.isEnd) {
            console.error('error');
            return false;
          }
          january = 1;
          month = scope.popupSource.selected.month.num;
          if (scope.popupSource.selected.month.isEnd) {
            year = scope.popupSource.selected.year.num + 1;
            month = january;
          } else if (scope.popupSource.selected.month.isEnd && scope.popupSource.selected.year.isEnd) {
            console.error('error');
            return false;
          } else {
            year = scope.popupSource.selected.year.num;
            month = scope.popupSource.selected.month.num + 1;
          }
          return scope.popup.refreshSelectedData(month, year);
        },
        isLastMonth: function() {
          if (!scope.popupSource || !scope.popupSource.selected) {
            return;
          }
          return scope.popupSource.selected.month.isEnd;
        },
        goNextYear: function() {
          var month, year;
          if (!scope.popupSource.selected || !scope.popupSource.selected.year) {
            return;
          }
          if (scope.popupSource.selected.year.isEnd) {
            console.error('error');
            return false;
          }
          year = scope.popupSource.selected.year.num + 1;
          month = scope.popupSource.selected.month.num;
          return scope.popup.refreshSelectedData(month, year);
        },
        isLastYear: function() {
          if (!scope.popupSource || !scope.popupSource.selected) {
            return;
          }
          return scope.popupSource.selected.year.isEnd;
        },
        isSelectedDay: function(date) {
          if (!scope.popupResult || !scope.popupResult.day) {
            return;
          }
          return (date.day === scope.popupResult.day) && (date.month === scope.popupResult.month) && (date.year === scope.popupResult.year);
        },
        getTodayDateTime: function() {
          var today;
          if (!scope.popupSource || !scope.popupSource.today) {
            return;
          }
          today = scope.popupSource.today;
          return new Date(today.year, today.month - 1, today.day).getTime();
        },
        isDayInSelectedMonth: function(date) {
          return (date.month === scope.popupSource.selected.month.num) && (date.year === scope.popupSource.selected.year.num);
        },
        goToYear: function() {
          var month, year;
          year = scope.popupSource.selected.year.num;
          month = scope.popupSource.selected.month.num;
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
      popupStartSource: '=',
      popupEndSource: '=',
      popupResult: '=',
      popupStartRefresh: "&?",
      popupEndRefresh: "&?"
    },
    link: function(scope) {
      var getSource;
      scope.data = {
        startDate: '',
        endDate: ''
      };
      getSource = function(isStartPopup) {
        if (isStartPopup) {
          return scope.popupStartSource;
        } else {
          return scope.popupEndSource;
        }
      };
      scope.popup = {
        hidePopup: function() {
          return scope.popupState.isOpen = false;
        },
        selectDate: function(isStartPopup, date) {
          scope.popupResult = date;
          scope.popup.hidePopup();
          if (!scope.popup.isDayInSelectedMonth(date)) {
            return scope.popup.refreshSelectedData(date.month, date.year);
          }
        },
        goPrevYear: function(isStartPopup) {
          var month, popupSource, year;
          popupSource = getSource(isStartPopup);
          if (!popupSource.selected || !popupSource.selected.year) {
            return;
          }
          if (popupSource.selected.year.isStart) {
            console.error('error');
            return false;
          }
          year = popupSource.selected.year.num - 1;
          month = popupSource.selected.month.num;
          return scope.popup.refreshSelectedData(month, year);
        },
        isFirstYear: function(isStartPopup) {
          var popupSource;
          popupSource = getSource(isStartPopup);
          if (!popupSource || !popupSource.selected) {
            return;
          }
          return popupSource.selected.year.isStart;
        },
        goPrevMonth: function(isStartPopup) {
          var december, month, popupSource, year;
          popupSource = getSource(isStartPopup);
          if (!popupSource.selected || !popupSource.selected.year) {
            return;
          }
          if (popupSource.selected.month.isStart && popupSource.selected.year.isStart) {
            console.error('error');
            return false;
          }
          december = 12;
          month = popupSource.selected.month.num;
          if (popupSource.selected.month.isStart) {
            year = popupSource.selected.year.num - 1;
            month = december;
          } else if (popupSource.selected.month.isStart && popupSource.selected.year.isStart) {
            console.error('error');
            return false;
          } else {
            year = popupSource.selected.year.num;
            month = popupSource.selected.month.num - 1;
          }
          return scope.popup.refreshSelectedData(month, year);
        },
        isFirstMonth: function(isStartPopup) {
          var popupSource;
          popupSource = getSource(isStartPopup);
          if (!popupSource || !popupSource.selected) {
            return;
          }
          return popupSource.selected.month.isStart;
        },
        goNextMonth: function(isStartPopup) {
          var january, month, popupSource, year;
          popupSource = getSource(isStartPopup);
          if (!popupSource.selected || !popupSource.selected.year) {
            return;
          }
          if (popupSource.selected.month.isEnd && popupSource.selected.year.isEnd) {
            console.error('error');
            return false;
          }
          january = 1;
          month = popupSource.selected.month.num;
          if (popupSource.selected.month.isEnd) {
            year = popupSource.selected.year.num + 1;
            month = january;
          } else if (popupSource.selected.month.isEnd && popupSource.selected.year.isEnd) {
            console.error('error');
            return false;
          } else {
            year = popupSource.selected.year.num;
            month = popupSource.selected.month.num + 1;
          }
          return scope.popup.refreshSelectedData(month, year);
        },
        isLastMonth: function(isStartPopup) {
          var popupSource;
          popupSource = getSource(isStartPopup);
          if (!popupSource || !popupSource.selected) {
            return;
          }
          return popupSource.selected.month.isEnd;
        },
        goNextYear: function(isStartPopup) {
          var month, popupSource, year;
          popupSource = getSource(isStartPopup);
          if (!popupSource.selected || !popupSource.selected.year) {
            return;
          }
          if (popupSource.selected.year.isEnd) {
            console.error('error');
            return false;
          }
          year = popupSource.selected.year.num + 1;
          month = popupSource.selected.month.num;
          return scope.popup.refreshSelectedData(month, year);
        },
        isLastYear: function(isStartPopup) {
          var popupSource;
          popupSource = getSource(isStartPopup);
          if (!popupSource || !popupSource.selected) {
            return;
          }
          return popupSource.selected.year.isEnd;
        },
        isSelectedDay: function(date) {
          if (!scope.popupResult || !scope.popupResult.day) {
            return;
          }
          return (date.day === scope.popupResult.day) && (date.month === scope.popupResult.month) && (date.year === scope.popupResult.year);
        },
        getTodayDateTime: function(isStartPopup) {
          var popupSource, today;
          popupSource = getSource(isStartPopup);
          if (!popupSource || !popupSource.today) {
            return;
          }
          today = popupSource.today;
          return new Date(today.year, today.month - 1, today.day).getTime();
        },
        isDayInSelectedMonth: function(isStartPopup, date) {
          var popupSource;
          popupSource = getSource(isStartPopup);
          return (date.month === popupSource.selected.month.num) && (date.year === popupSource.selected.year.num);
        },
        goToYear: function(isStartPopup) {
          var month, popupSource, year;
          popupSource = getSource(isStartPopup);
          year = popupSource.selected.year.num;
          month = popupSource.selected.month.num;
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

angular.module("bdate.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("bdate.html","<div ng-class=\"{b_datepicker_in_progress: !isDataReady}\" class=\"b_datepicker_root {{::bRootClasses}}\"><input type=text ng-model=bModel placeholder={{placeholder}} ng-click=popup.togglePopup() ng-disabled=!isDataReady readonly=readonly class=\"b_datepicker_input {{::bInputClasses}}\"><button type=button ng-click=clear() class=\"b_clear_btn {{::bButtonClasses}}\">&times;</button><button type=button ng-click=popup.togglePopup() ng-disabled=!isDataReady class=\"b_datepicker_button b_calendar_btn {{::bButtonClasses}}\">&nbsp;</button><bdate-popup popup-state=popup.state popup-source=bSource popup-result=popupResult popup-refresh=\"bRefreshTest(m, y)\" ng-if=!bRange class={{::bPopupClasses}}></bdate-popup><bdate-range-popup popup-state=popup.state popup-source=bSource popup-result=popupResult popup-refresh=\"bRefreshTest(m, y)\" ng-if=bRange class={{::bPopupClasses}}></bdate-range-popup></div>");
$templateCache.put("popup.html","<div ng-show=popupState.isOpen class=b_popup><div class=b_popup_controls><div class=b_btn_prev_container><button type=button ng-click=popup.goPrevYear() ng-disabled=popup.isFirstYear() class=\"b_popup_btn b_btn_prev\">&#9664; &#9664;</button><button type=button ng-click=popup.goPrevMonth() ng-disabled=\"popup.isFirstMonth() &amp;&amp; popup.isFirstYear()\" class=\"b_popup_btn b_btn_prev\">&#9664;</button></div><div ng-bind=popupSource.selected.month.name class=b_popup_month></div>&nbsp;<select ng-model=popupSource.selected.year.num ng-options=\"year for year in popupSource.years\" ng-init=\"year = popupSource.selected.year.num\" ng-change=popup.goToYear() class=b_popup_year></select><div class=b_btn_next_container><button type=button ng-click=popup.goNextMonth() ng-disabled=\"popup.isLastMonth() &amp;&amp; popup.isLastYear()\" class=\"b_popup_btn b_btn_next\">&#9654;</button><button type=button ng-click=popup.goNextYear() ng-disabled=popup.isLastYear() class=\"b_popup_btn b_btn_next\">&#9654; &#9654;</button></div></div><table class=b_popup_days><tr><td ng-repeat=\"dayOfWeek in ::popupSource.week\" class=b_popup_day_of_week><span ng-bind=::dayOfWeek></span></td></tr></table><table class=b_popup_weeks><tr class=b_popup_week><td ng-repeat=\"date in popupSource.selected.dates track by $index\" ng-class=\"{b_popup_today_day_container: date.isToday}\" class=b_popup_day><button type=button ng-bind=date.day ng-click=popup.selectDate(date) ng-disabled=date.isDisabled ng-class=\"{b_popup_day_in_selected_month: popup.isDayInSelectedMonth(date), b_popup_today_day: date.isToday, b_popup_selected_day: popup.isSelectedDay(date)}\" class=b_popup_day_btn></button></td></tr></table><div ng-show=popupSource.today class=b_popup_today><button type=button ng-bind=\"popup.getTodayDateTime() | date:popupSource.format\" ng-click=popup.selectDate(popupSource.today) class=b_popup_today_btn></button></div></div>");
$templateCache.put("range-popup.html","<div ng-show=popupState.isOpen class=b_range_popup_back><div class=\"b_popup b_range_popup b_range_popup_start\"><div class=b_popup_controls><div class=b_btn_prev_container><button type=button ng-click=popup.goPrevYear(true) ng-disabled=popup.isFirstYear(true) class=\"b_popup_btn b_btn_prev\">&#9664; &#9664;</button><button type=button ng-click=popup.goPrevMonth(true) ng-disabled=\"popup.isFirstMonth(true) &amp;&amp; popup.isFirstYear(true)\" class=\"b_popup_btn b_btn_prev\">&#9664;</button></div><div ng-bind=popupSource.selected.month.name class=b_popup_month></div>&nbsp;<select ng-model=popupSource.selected.year.num ng-options=\"year for year in popupSource.years\" ng-init=\"year = popupSource.selected.year.num\" ng-change=popup.goToYear(true) class=b_popup_year></select><div class=b_btn_next_container><button type=button ng-click=popup.goNextMonth(true) ng-disabled=\"popup.isLastMonth(true) &amp;&amp; popup.isLastYear(true)\" class=\"b_popup_btn b_btn_next\">&#9654;</button><button type=button ng-click=popup.goNextYear(true) ng-disabled=popup.isLastYear(true) class=\"b_popup_btn b_btn_next\">&#9654; &#9654;</button></div></div><table class=b_popup_days><tr><td ng-repeat=\"dayOfWeek in ::popupSource.week\" class=b_popup_day_of_week><span ng-bind=::dayOfWeek></span></td></tr></table><table class=b_popup_weeks><tr class=b_popup_week><td ng-repeat=\"date in popupSource.selected.dates track by $index\" ng-class=\"{b_popup_today_day_container: date.isToday}\" class=b_popup_day><button type=button ng-bind=date.day ng-click=\"popup.selectDate(true, date)\" ng-disabled=date.isDisabled ng-class=\"{b_popup_day_in_selected_month: popup.isDayInSelectedMonth(true, date), b_popup_today_day: date.isToday, b_popup_selected_day: popup.isSelectedDay(date)}\" class=b_popup_day_btn></button></td></tr></table><div ng-show=popupSource.today class=b_popup_today><button type=button ng-bind=\"popup.getTodayDateTime() | date:popupSource.format\" ng-click=\"popup.selectDate(true, popupSource.today)\" class=b_popup_today_btn></button></div></div><div class=\"b_popup b_range_popup b_range_popup_end\"><div class=b_popup_controls><div class=b_btn_prev_container><button type=button ng-click=popup.goPrevYear(false) ng-disabled=popup.isFirstYear(false) class=\"b_popup_btn b_btn_prev\">&#9664; &#9664;</button><button type=button ng-click=popup.goPrevMonth(false) ng-disabled=\"popup.isFirstMonth(false) &amp;&amp; popup.isFirstYear(false)\" class=\"b_popup_btn b_btn_prev\">&#9664;</button></div><div ng-bind=popupSource.selected.month.name class=b_popup_month></div>&nbsp;<select ng-model=popupSource.selected.year.num ng-options=\"year for year in popupSource.years\" ng-init=\"year = popupSource.selected.year.num\" ng-change=popup.goToYear(false) class=b_popup_year></select><div class=b_btn_next_container><button type=button ng-click=popup.goNextMonth(false) ng-disabled=\"popup.isLastMonth(false) &amp;&amp; popup.isLastYear(false)\" class=\"b_popup_btn b_btn_next\">&#9654;</button><button type=button ng-click=popup.goNextYear(false) ng-disabled=popup.isLastYear(false) class=\"b_popup_btn b_btn_next\">&#9654; &#9654;</button></div></div><table class=b_popup_days><tr><td ng-repeat=\"dayOfWeek in ::popupSource.week\" class=b_popup_day_of_week><span ng-bind=::dayOfWeek></span></td></tr></table><table class=b_popup_weeks><tr class=b_popup_week><td ng-repeat=\"date in popupSource.selected.dates track by $index\" ng-class=\"{b_popup_today_day_container: date.isToday}\" class=b_popup_day><button type=button ng-bind=date.day ng-click=popup.selectDate(date) ng-disabled=date.isDisabled ng-class=\"{b_popup_day_in_selected_month: popup.isDayInSelectedMonth(date), b_popup_today_day: date.isToday, b_popup_selected_day: popup.isSelectedDay(date)}\" class=b_popup_day_btn></button></td></tr></table><div ng-show=popupSource.today class=b_popup_today><button type=button ng-bind=\"popup.getTodayDateTime(false) | date:popupSource.format\" class=b_popup_today_btn></button></div></div><button type=button ng-click=popup.selectRangedDate()>Ok</button></div>");}]);