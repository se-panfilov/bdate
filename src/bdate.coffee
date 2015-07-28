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
      isSourceReady: false

    scope.data =
      date: null

    getFormattedDate = (dmy) ->
      datetime = new Date(dmy.year, dmy.month - 1, dmy.day).getTime()
      return $filter('date') datetime, scope.bSettings.format

    getFormattedDateRange = (dmyRange) ->
      datetimeStart = new Date(dmyRange.start.year, dmyRange.start.month - 1, dmyRange.start.day).getTime()
      datetimeEnd = new Date(dmyRange.end.year, dmyRange.end.month - 1, dmyRange.end.day).getTime()
      startDate = $filter('date') datetimeStart, scope.bSettings.format
      endDate = $filter('date') datetimeEnd, scope.bSettings.format
      return startDate + scope.bSettings.range_delimiter + endDate

    scope.watchers =
      popup:
        result:
          handler: null
          start: (callback) ->
            scope.watchers.popup.result.handler = scope.$watch 'popup.result', (newVal, oldVal) ->
              if callback
                callback newVal, oldVal
            ,
              true
            return scope.watchers.popup.result.handler
          stop: () ->
            scope.watchers.popup.result.handler()
            scope.watchers.popup.result.handler = null
      watchPopupResult: (callback) ->
        scope.watchers.popup.result.start (newVal, oldVal) ->
          return if newVal is oldVal
          return if not newVal
          return if angular.equals {}, newVal
          if (not scope.bRange)
            scope.bModel = getFormattedDate(scope.popup.result)
          else
            scope.bModel = getFormattedDateRange(scope.popup.result)
          scope.watchers.popup.result.stop()
          callback newVal, oldVal
      bModel:
        handler: null
        start: (callback) ->
          scope.watchers.bModel.handler = scope.$watch 'bModel', (newVal, oldVal) ->
            if callback
              callback newVal, oldVal
          ,
            true
          return scope.watchers.bModel.handler
        stop: () ->
          scope.watchers.bModel.handler()
          scope.watchers.bModel.handler = null
      watchBModel: (callback) ->
        scope.watchers.bModel.start (newVal, oldVal) ->
          return if newVal is oldVal
          return if not newVal

          #TODO (S.Panfilov) should init popup value in case of bModel external change
          console.log newVal

          scope.watchers.bModel.stop()
          callback newVal, oldVal
      bSource:
        handler: null
        start: (callback) ->
          scope.watchers.bSource.handler = scope.$watch 'bSource', (newVal, oldVal) ->
            if callback
              callback newVal, oldVal
          return scope.watchers.bSource.handler
        stop: () ->
          scope.watchers.bSource.handler()
          scope.watchers.bSource.handler = null
      bStartSource:
        handler: null
        start: (callback) ->
          scope.watchers.bStartSource.handler = scope.$watch 'bStartSource', (newVal, oldVal) ->
            if callback
              callback newVal, oldVal
          return scope.watchers.bStartSource.handler
        stop: () ->
          scope.watchers.bStartSource.handler()
      bEndSource:
        handler: null
        start: (callback) ->
          scope.watchers.bEndSource.handler = scope.$watch 'bEndSource', (newVal, oldVal) ->
            if callback
              callback newVal, oldVal
          return scope.watchers.bEndSource.handler
        stop: () ->
          scope.watchers.bEndSource.handler()
          scope.watchers.bEndSource.handler = null
      watchSource: (callback) ->
        if not scope.bRange
          scope.watchers.bSource.start (val) ->
            return if not val
            scope.isSourceReady = true
            scope.watchers.bSource.stop()
            callback val
        else
          isStartSourceReady = false
          isEndSourceReady = false
          scope.watchers.bStartSource.start (val) ->
            return if not val
            isStartSourceReady = true
            if isStartSourceReady and isEndSourceReady
              scope.isSourceReady = true
              scope.watchers.bStartSource.stop()
              scope.watchers.bEndSource.stop()
              callback val
          scope.watchers.bEndSource.start (val) ->
            return if not val
            isEndSourceReady = true
            if isStartSourceReady and isEndSourceReady
              scope.isSourceReady = true
              scope.watchers.bStartSource.stop()
              scope.watchers.bEndSource.stop()
              callback val


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
        return if not scope.isSourceReady
        scope.popup.state.isOpen = not scope.popup.state.isOpen
      hidePopup: () ->
        scope.popup.state.isOpen = false

    do () ->
      scope.watchers.watchSource (
        scope.watchers.watchPopupResult()
        scope.watchers.watchBModel()
      )
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