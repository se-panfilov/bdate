angular.module('bdate', ['bdate.popup', 'bdate.templates']).directive('bdatepicker', ['$filter', '$document', '$interval', function($filter, $document, $interval) {
  return {
    restrict: 'E',
    replace: true,
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
      refresh: "=?"
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
      dateModel: '='
    },
    link: function(scope) {
      return scope.popup = {
        hidePopup: function() {
          return scope.popupState.isOpen = false;
        },
        selectDate: function(date) {
          scope.data.setDateModel(date);
          return scope.popup.hidePopup();
        }
      };
    }
  };
});

angular.module("bdate.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("bdate.html","<div ng-class=\"{b_datepicker_in_progress: !isDataReady}\" class=\"b_datepicker_root {{::bRootClasses}}\"><input type=text ng-model=date.viewed placeholder={{placeholder}} ng-click=popup.togglePopup() ng-disabled=!isDataReady readonly=readonly class=\"b_datepicker_input {{::bInputClasses}}\"><button type=button ng-click=popup.clear() class=\"b_datepicker_button {{::bButtonClasses}}\"></button><button type=button ng-click=popup.togglePopup() ng-disabled=!isDataReady class=\"b_datepicker_button b_calendar_btn {{::bButtonClasses}}\">&nbsp;</button><bdate-popup popup-state=popup.state date-model=date.model class={{::bPopupClasses}}></bdate-popup></div>");
$templateCache.put("popup.html","<div ng-show=popupState.isOpen class=b_popup><div class=b_popup_controls><div class=b_btn_prev_container><button type=button ng-click=popup.goPrevYear() ng-disabled=popup.isFirstYear() class=\"b_popup_btn b_btn_prev\">&#9664; &#9664;</button><button type=button ng-click=popup.goPrevMonth() ng-disabled=popup.isFirstMonth() class=\"b_popup_btn b_btn_prev\">&#9664;</button></div><div ng-bind=popup.getMonthName() class=b_popup_month></div>&nbsp;<select ng-model=popup.selectViewedYear ng-options=\"year for year in data.years\" ng-init=\"popup.selectViewedYear = data.years[0]\" ng-change=popup.goToYear() class=b_popup_year></select><div class=b_btn_next_container><button type=button ng-click=goNextMonth() ng-disabled=isLastMonth() class=\"b_popup_btn b_btn_next\">&#9654;</button><button type=button ng-click=goNextYear() ng-disabled=isLastYear() class=\"b_popup_btn b_btn_next\">&#9654; &#9654;</button></div></div><table class=b_popup_days><tr><td ng-repeat=\"dayOfWeek in ::[\'Пн\', \'Вт\', \'Ср\', \'Чт\', \'Пт\', \'Сб\', \'Вс\']\" class=b_popup_day_of_week><span ng-bind=::dayOfWeek></span></td></tr></table><table class=b_popup_weeks><tr class=b_popup_week><td ng-repeat=\"day in data.days track by $index\" ng-class=\"{b_popup_today_day_container: popup.isTodayDate(day)}\" class=b_popup_day><button type=button ng-bind=day ng-click=popup.selectDate(day) ng-disabled=popup.isLockedDate(day) ng-class=\"{b_popup_cur_month_day: !popup.isLockedDate(day), b_popup_today_day: popup.isTodayDate(day), b_popup_selected_day: popup.isSelectedDay(day), b_popup_locked_day: popup.isLockedDate(day)}\" class=b_popup_day_btn></button></td></tr></table></div>");}]);