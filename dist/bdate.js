angular.module('bdate.datepicker', ['bdate.popup']).directive('bdatepicker', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '../dist/templates/default.html',
    link: function(scope, elem) {
      scope.isPopupOpen = false;
      return scope.togglePopup = function() {
        return scope.isPopupOpen = !scope.isPopupOpen;
      };
    }
  };
});

angular.module('bdate', ['bdate.datepicker']).constant('HTTP_STATUS', {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502
}).constant('PERIOD', {
  second: 1000,
  minute: 60000,
  hour: 3600000,
  day: 86400000
});

angular.module('bdate.popup', []).directive('bdatePopup', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '../dist/templates/popup.html',
    scope: {
      isHidden: '='
    },
    link: function(scope, elem) {
      return scope.isHidden = false;
    }
  };
});
