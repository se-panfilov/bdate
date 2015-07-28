angular.module 'bdate', [
  'bdate.popup'
  'bdate.popup.ranged'
  'bdate.templates'
]

.directive 'bdatepicker', ($document, $filter) ->
  restrict: 'E'
#replace: true
  templateUrl: 'bdate.html'
  scope:
    bModel: '='
    bSource: '=?'
    bSettings: '=?'
    bStartSource: '=?'
    bEndSource: '=?'
    bRange: '=?'
    bRootClasses: '@?'
    bInputClasses: '@?'
    bButtonClasses: '@?'
    bPopupClasses: '@?'
    bMonthNames: '=?'
    bDaysNames: '=?'
    placeholder: '@?'
    bRefresh: "&?"
    bStartRefresh: "&?"
    bEndRefresh: "&?"
  link: (scope, elem) ->
    scope.state =
      isDataReady: false

    scope.data =
      date: null

    #TODO (S.Panfilov) should improve wait for data in case or ranges bStartSource and bEndSource
    #scope.$watch 'bSource', ->
    scope.isDataReady = true
    #, true

    getFormattedDate = (dmy) ->
      datetime = new Date(dmy.year, dmy.month - 1, dmy.day).getTime()
      return $filter('date') datetime, scope.bSettings.format

    getFormattedDateRange = (dmyRange) ->
      datetimeStart = new Date(dmyRange.start.year, dmyRange.start.month - 1, dmyRange.start.day).getTime()
      datetimeEnd = new Date(dmyRange.end.year, dmyRange.end.month - 1, dmyRange.end.day).getTime()
      startDate = $filter('date') datetimeStart, scope.bSettings.format
      endDate = $filter('date') datetimeEnd, scope.bSettings.format

    scope.$watch 'popup.result', (newVal, oldVal) ->
      return if newVal is oldVal
      return if not newVal
      return if angular.equals {}, newVal
      if (not scope.bRange)
        scope.bModel = getFormattedDate(scope.popup.result)
      else
        scope.bModel = getFormattedDateRange(scope.popup.result)
    , true

    processClick = (event) ->
      isOpen = scope.popup.state.isOpen
      clickedElem = event.target
      popupElem = elem
      isOutsideClick = (popupElem isnt clickedElem) and not (popupElem[0].contains clickedElem)
      if isOpen and isOutsideClick
        scope.$apply ->
          scope.popup.hidePopup()

    scope.clear = () ->
      scope.bModel = null;
      scope.popup.result = null;

    scope.popup =
      result: null
      state:
        isOpen: false
      togglePopup: () ->
        return if not scope.isDataReady
        scope.popup.state.isOpen = not scope.popup.state.isOpen
      hidePopup: () ->
        scope.popup.state.isOpen = false

    do () ->
      if not scope.bRange
        scope.bRefresh()
      else
        scope.bStartRefresh()
        scope.bEndRefresh()

    scope.bRefreshWrap = (m, y) ->
      scope.bRefresh
        m: m
        y: y

    scope.bStartRefreshWrap = (m, y) ->
      scope.bStartRefresh
        m: m
        y: y

    scope.bEndRefreshWrap = (m, y) ->
      scope.bEndRefresh
        m: m
        y: y

    $document.on 'click', processClick