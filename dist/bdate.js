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
      bRefresh: "&"
    },
    controller: ['$scope', function($scope) {
      $scope.state = {
        isDataReady: false
      };
      $scope.data = {
        date: null
      };
      return $scope.$watch('bSource', function() {
        return $scope.isDataReady = true;
      }, true);
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
      popupSource: '='
    },
    link: function(scope) {
      console.log(scope.popupSource);
      scope.popup = {
        hidePopup: function() {
          return scope.popupState.isOpen = false;
        },
        selectDate: function(date) {
          return scope.popup.hidePopup();
        },
        goPrevYear: function() {
          return console.warn('not implemented yet');
        },
        isFirstYear: function() {
          return console.warn('not implemented yet');
        },
        goPrevMonth: function() {
          return console.warn('not implemented yet');
        },
        isFirstMonth: function() {
          return console.warn('not implemented yet');
        },
        getMonthName: function() {
          return console.warn('not implemented yet');
        },
        goNextMonth: function() {
          return console.warn('not implemented yet');
        },
        isLastMonth: function() {
          return console.warn('not implemented yet');
        },
        goNextYear: function() {
          return console.warn('not implemented yet');
        },
        isLastYear: function() {
          return console.warn('not implemented yet');
        },
        isSelectedDay: function(day) {
          return console.warn('not implemented yet');
        },
        getToday: function() {
          return console.warn('not implemented yet');
        }
      };
      return scope.$watch('popupSource', function() {
        return scope.isDataReady = true;
      }, true);
    }
  };
});

angular.module("bdate.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("bdate.html","<div ng-class=\"{b_datepicker_in_progress: !isDataReady}\" class=\"b_datepicker_root {{::bRootClasses}}\"><input type=text ng-model=date.viewed placeholder={{placeholder}} ng-click=popup.togglePopup() ng-disabled=!isDataReady readonly=readonly class=\"b_datepicker_input {{::bInputClasses}}\"><button type=button ng-click=popup.clear() class=\"b_datepicker_button {{::bButtonClasses}}\"></button><button type=button ng-click=popup.togglePopup() ng-disabled=!isDataReady class=\"b_datepicker_button b_calendar_btn {{::bButtonClasses}}\">&nbsp;</button><bdate-popup popup-state=popup.state popup-source=bSource class={{::bPopupClasses}}></bdate-popup></div>");
$templateCache.put("popup.html","<div ng-show=popupState.isOpen class=b_popup><div class=b_popup_controls><div class=b_btn_prev_container><button type=button ng-click=popup.goPrevYear() ng-disabled=popup.isFirstYear() class=\"b_popup_btn b_btn_prev\">&#9664; &#9664;</button><button type=button ng-click=popup.goPrevMonth() ng-disabled=popup.isFirstMonth() class=\"b_popup_btn b_btn_prev\">&#9664;</button></div><div ng-bind=popupSource.selected.month.name class=b_popup_month></div>&nbsp;<select ng-model=popup.selectViewedYear ng-options=\"year for year in popupSource.years\" ng-init=\"popup.selectViewedYear = popupSource.selected.year.num\" ng-change=popup.goToYear() class=b_popup_year></select><div class=b_btn_next_container><button type=button ng-click=goNextMonth() ng-disabled=isLastMonth() class=\"b_popup_btn b_btn_next\">&#9654;</button><button type=button ng-click=goNextYear() ng-disabled=isLastYear() class=\"b_popup_btn b_btn_next\">&#9654; &#9654;</button></div></div><table class=b_popup_days><tr><td ng-repeat=\"dayOfWeek in ::popupSource.week\" class=b_popup_day_of_week><span ng-bind=::dayOfWeek></span></td></tr></table><table class=b_popup_weeks><tr class=b_popup_week><td ng-repeat=\"day in popupSource.selected.days track by $index\" ng-class=\"{b_popup_today_day_container: day.isToday}\" class=b_popup_day><button type=button ng-bind=day.num ng-click=popup.selectDate(day) ng-disabled=day.isDisabled ng-class=\"{b_popup_cur_month_day: !day.isDisabled, b_popup_today_day: day.isToday, b_popup_selected_day: popup.isSelectedDay(day)}\" class=b_popup_day_btn></button></td></tr></table><div class=b_popup_today><button type=button ng-bind=\"popup.getToday() | date:data.format\" ng-click=popup.selectDate(popup.getToday()) class=b_popup_today_btn></button></div></div>");}]);