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

    getOutputDate = (date) ->
      if (not scope.bRange)
        return getFormattedDate(date)
      else
        return getFormattedDateRange(date)

    parseDateStringToDMY = (dateStr) ->
      return if dateStr.length isnt scope.bSettings.format.length #TODO (S.Panfilov) throw error

      elements =
        day: 'd'
        month: 'm'
        year: 'y'

      dateStrRegex = new RegExp '\\d+', 'g'

      format = scope.bSettings.format
      format = format.toLowerCase()
      formatRegex = new RegExp '\\w+', 'g'

      keys = format.match formatRegex
      vals = dateStr.match dateStrRegex
      parsedObj = {}

      i = 0
      while i < keys.length
        parsedObj[keys[i]] = vals[i]
        i++

      for k of parsedObj
        for e of elements
          if k.indexOf(elements[e]) >= 0
            elements[e] = +parsedObj[k]

      #return new Date elements.year, elements.month, elements.day
      return elements

    parseDateRangeStringToDMY = (dateStr) ->
      delimiterLength =  scope.bSettings.range_delimiter.length
      formatLength = scope.bSettings.format.length
      dateStartStr = dateStr.substr(0, formatLength)
      dateEndStr = dateStr.substr(formatLength + delimiterLength)
      result =
        start: parseDateStringToDMY dateStartStr
        end: parseDateStringToDMY dateEndStr
      return result

    parseOutputDate = (dateStr) ->
      result = null
      if (not scope.bRange)
        result = parseDateStringToDMY(dateStr)
      else
        result = parseDateRangeStringToDMY(dateStr)
      return result

    scope.watchers =
      popup:
        result:
          handler: null
          callback: null
          start: (callback) ->
            return if scope.watchers.popup.result.handler
            if callback?
              scope.watchers.popup.result.callback = callback
            scope.watchers.popup.result.handler = scope.$watch 'popup.result', (newVal, oldVal) ->
              if scope.watchers.popup.result.callback
                scope.watchers.popup.result.callback  newVal, oldVal
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

          scope.watchers.bModel.stop()
          scope.bModel = getOutputDate scope.popup.result
          scope.watchers.bModel.start()

          if callback
            callback newVal, oldVal
      bModel:
        handler: null
        callback: null
        start: (callback) ->
          scope.watchers.bModel.callback = callback if not scope.watchers.bModel.callback
          return if scope.watchers.bModel.handler
          scope.watchers.bModel.handler = scope.$watch 'bModel', (newVal, oldVal) ->
            if scope.watchers.bModel.callback
              scope.watchers.bModel.callback newVal, oldVal
          ,
            true
          return scope.watchers.bModel.handler
        stop: () ->
          scope.watchers.bModel.handler()
          scope.watchers.bModel.handler = null
      watchBModel: (onChangeCb, callback) ->
        scope.watchers.bModel.start (newVal, oldVal) ->
          if newVal is oldVal
            if callback
              return callback()
            return

          if not newVal
            if callback
              return callback()
            return

          if not scope.popup.result or newVal isnt getOutputDate scope.popup.result
            scope.watchers.popup.result.stop()
            scope.popup.result = parseOutputDate newVal
            scope.watchers.popup.result.start()

          if onChangeCb
            onChangeCb newVal, oldVal
      bSource:
        handler: null
        start: (callback) ->
          return if scope.watchers.bSource.handler
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
          return if scope.watchers.bStartSource.handler
          scope.watchers.bStartSource.handler = scope.$watch 'bStartSource', (newVal, oldVal) ->
            if callback
              callback newVal, oldVal
          return scope.watchers.bStartSource.handler
        stop: () ->
          scope.watchers.bStartSource.handler()
      bEndSource:
        handler: null
        start: (callback) ->
          return if scope.watchers.bEndSource.handler
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
            if callback
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
              if callback
                callback val
          scope.watchers.bEndSource.start (val) ->
            return if not val
            isEndSourceReady = true
            if isStartSourceReady and isEndSourceReady
              scope.isSourceReady = true
              scope.watchers.bStartSource.stop()
              scope.watchers.bEndSource.stop()
              if callback
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
      scope.watchers.watchSource (->
        scope.watchers.watchBModel(null, ->
          scope.watchers.watchPopupResult()
        )
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