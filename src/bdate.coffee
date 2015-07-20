angular.module 'bdate.datepicker', [
  'bdate.popup',
  'bdate.data',
  'bdate.templates'
]

.directive 'bdatepicker', ($filter, bDataFactory, bDateUtils, $document, $interval) ->
  restrict: 'E'
  replace: true
  templateUrl: 'bdate.html'
  scope:
    bModel: '='
    bSource: '='
    bRootClasses: '@?'
    bInputClasses: '@?'
    bButtonClasses: '@?'
    bPopupClasses: '@?'
    bMonthNames: '=?'
    bDaysNames: '=?'
    placeholder: '@?'
  controller: ($scope) ->
    _generateRandomId = ->
      Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)

    $scope.dateStoreId = _generateRandomId()
    $scope.isDataReady = false

    $scope.$watch 'bSource', ->
      if bDataFactory.isDataValid $scope.bSource
        bDataFactory.setData $scope.bSource, $scope.dateStoreId
        $scope.isDataReady = true
    , true

    setLocalizedData = ->
      if $scope.bMonthNames
        bDataFactory.setMonthNames $scope.bMonthNames
      if $scope.bDaysNames
        bDataFactory.setDaysNames $scope.bDaysNames

    #init
    do ->
      setLocalizedData()

  link: (scope, elem) ->
    scope.date =
      viewed: ''
      model: {}

    doNotUpdateModelTwice = false

    setModelFromExternal = ->
      isSameDate = scope.bModel is scope.date.viewed
      isEmptyModel = scope.bModel is '' or scope.bModel is ' ' or not scope.bModel
      return false if isSameDate

      if isEmptyModel
#        scope.isDataReady = false
        scope.date.viewed = null
        scope.date.model = null
        return

      bModelDate = bDateUtils.stringToDate scope.bModel, bDataFactory.data[scope.dateStoreId].format, bDataFactory.data[scope.dateStoreId].delimiter
      return false if not angular.isDate bModelDate

      scope.date.viewed = scope.bModel
      doNotUpdateModelTwice = true
      scope.date.model =
        day: bModelDate.getDate()
        month: bModelDate.getMonth() + 1
        year: bModelDate.getFullYear()

    externalLoadInterval = $interval (->
      if scope.isDataReady
        setModelFromExternal()
        $interval.cancel(externalLoadInterval)
        externalLoadInterval = undefined
    ), 60

    scope.$watch 'bModel', (newVal, oldVal) ->
      return if newVal is oldVal
      setModelFromExternal()

    scope.$watch 'date.model', ->
      return if angular.equals {}, scope.date.model
      if doNotUpdateModelTwice
        return doNotUpdateModelTwice = false

      if scope.date.model
        dateTime = new Date(scope.date.model.year, scope.date.model.month - 1, scope.date.model.day).getTime()
        formattedDate = $filter('date') dateTime, bDataFactory.data[scope.dateStoreId].format
        scope.date.viewed = formattedDate
        scope.bModel = scope.date.viewed

    processClick = (event) ->
      isOpen = scope.popup.state.isOpen
      clickedElem = event.target
      popupElem = elem
      isOutsideClick = (popupElem isnt clickedElem) and not (popupElem[0].contains clickedElem)

      if isOpen and isOutsideClick
        scope.$apply ->
          scope.popup.hidePopup()

    $document.on 'click', processClick

    scope.popup =
      state:
        isOpen: false
      togglePopup: () ->
        return if not scope.isDataReady
        scope.popup.state.isOpen = not scope.popup.state.isOpen
      hidePopup: () ->
        scope.popup.state.isOpen = false