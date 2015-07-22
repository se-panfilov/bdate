angular.module('bdate', ['bdate.popup', 'bdate.templates']).directive('bdatepicker', ['$filter', '$document', '$interval', function($filter, $document, $interval) {
  return {
    restrict: 'E',
    templateUrl: 'bdate.html',
    scope: {
      bModel: '=',
      bSource: '=',
      bRootClasses: '@?',
      bInputClasses: '@?',
      bButtonClasses: '@?',
      bPopupClasses: '@?',
      bMonthNames: '=?',
      bDaysNames: '=?',
      placeholder: '@?',
      bRefresh: "&?"
    },
    controller: ['$scope', function($scope) {
      var getModelString, setData;
      $scope.popupResult = null;
      $scope.state = {
        isDataReady: false
      };
      $scope.data = {
        date: null
      };
      $scope.$watch('bSource', function() {
        setData();
        return $scope.isDataReady = true;
      }, true);
      $scope.$watch('popupResult', function(newVal, oldVal) {
        if (newVal === oldVal) {
          return;
        }
        if (!newVal) {
          return;
        }
        if (angular.equals({}, newVal)) {
          return;
        }
        return $scope.bModel = getModelString($scope.popupResult);
      }, true);
      getModelString = function(dmyObj) {
        var dateTime;
        dateTime = new Date(dmyObj.year, dmyObj.month - 1, dmyObj.day).getTime();
        return $filter('date')(dateTime, $scope.bSource.format);
      };
      return setData = function() {
        return console.warn('not implemented yet');
      };
    }],
    link: function(scope, elem) {
      var processClick;
      scope.date = {
        viewed: '',
        model: {}
      };
      (function() {
        return scope.bRefresh();
      })();
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
      scope.popup = {
        hidePopup: function() {
          return scope.popupState.isOpen = false;
        },
        selectDate: function(date) {
          scope.popupResult = date;
          return scope.popup.hidePopup();
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
            month = scope.popupSource.selected.month - 1;
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
        refreshSelectedData: function(month, year) {
          return scope.popupRefresh(month, year);
        }
      };
      return scope.$watch('popupSource', function() {
        return scope.isDataReady = true;
      }, true);
    }
  };
});

angular.module("bdate.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("bdate.html","<div ng-class=\"{b_datepicker_in_progress: !isDataReady}\" class=\"b_datepicker_root {{::bRootClasses}}\"><input type=text ng-model=bModel placeholder={{placeholder}} ng-click=popup.togglePopup() ng-disabled=!isDataReady readonly=readonly class=\"b_datepicker_input {{::bInputClasses}}\"><button type=button ng-click=popup.clear() class=\"b_clear_btn {{::bButtonClasses}}\">&times;</button><button type=button ng-click=popup.togglePopup() ng-disabled=!isDataReady class=\"b_datepicker_button b_calendar_btn {{::bButtonClasses}}\">&nbsp;</button><bdate-popup popup-state=popup.state popup-source=bSource popup-result=popupResult popup-refresh=bRefresh() class={{::bPopupClasses}}></bdate-popup></div>");
$templateCache.put("popup.html","<div ng-show=popupState.isOpen class=b_popup><div class=b_popup_controls><div class=b_btn_prev_container><button type=button ng-click=popup.goPrevYear() ng-disabled=popup.isFirstYear() class=\"b_popup_btn b_btn_prev\">&#9664; &#9664;</button><button type=button ng-click=popup.goPrevMonth() ng-disabled=\"popup.isFirstMonth() &amp;&amp; popup.isFirstYear()\" class=\"b_popup_btn b_btn_prev\">&#9664;</button></div><div ng-bind=popupSource.selected.month.name class=b_popup_month></div>&nbsp;<select ng-model=popup.selectViewedYear ng-options=\"year for year in popupSource.years\" ng-init=\"popup.selectViewedYear = popupSource.selected.year.num\" ng-change=popup.goToYear() class=b_popup_year></select><div class=b_btn_next_container><button type=button ng-click=goNextMonth() ng-disabled=\"isLastMonth() &amp;&amp; isLastYear()\" class=\"b_popup_btn b_btn_next\">&#9654;</button><button type=button ng-click=goNextYear() ng-disabled=isLastYear() class=\"b_popup_btn b_btn_next\">&#9654; &#9654;</button></div></div><table class=b_popup_days><tr><td ng-repeat=\"dayOfWeek in ::popupSource.week\" class=b_popup_day_of_week><span ng-bind=::dayOfWeek></span></td></tr></table><table class=b_popup_weeks><tr class=b_popup_week><td ng-repeat=\"date in popupSource.selected.dates track by $index\" ng-class=\"{b_popup_today_day_container: date.isToday}\" class=b_popup_day><button type=button ng-bind=date.day ng-click=popup.selectDate(date) ng-disabled=date.isDisabled ng-class=\"{b_popup_day_in_selected_month: popup.isDayInSelectedMonth(date), b_popup_today_day: date.isToday, b_popup_selected_day: popup.isSelectedDay(date)}\" class=b_popup_day_btn></button></td></tr></table><div ng-show=popupSource.today class=b_popup_today><button type=button ng-bind=\"popup.getTodayDateTime() | date:popupSource.format\" ng-click=popup.selectDate(popupSource.today) class=b_popup_today_btn></button></div></div>");}]);