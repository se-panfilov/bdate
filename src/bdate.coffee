angular.module 'bdate.datepicker', ['bdate.popup', 'bdate.data', 'bdate.templates']

.directive 'bdatepicker', ($filter, bDataFactory, bDateUtils, $document) ->
  restrict: 'E'
  replace: true
  templateUrl: 'bdate.html'
  scope:
    bModel: '='
    bSource: '='
    bRootId: '@?'
    bInputId: '@?'
    bPopupId: '@?'
    bRootClasses: '@?'
    bInputClasses: '@?'
    bButtonClasses: '@?'
    bPopupClasses: '@?'
  controller: ($scope) ->

    _generateRandomId = ->
      #TODO (S.Panfilov) this is not super reliable function on big amount of iteration (>1000) - can produce duplicates, better if replace it
      Math.random().toString(36).substring(12)

    $scope.dateStoreId = _generateRandomId();

    $scope.isDataReady = false

    $scope.$watch 'bSource', ->
      if bDataFactory.isDataValid $scope.bSource
        bDataFactory.setData $scope.bSource, $scope.dateStoreId
        $scope.isDataReady = true
    , true

  link: (scope, elem) ->
    scope.date =
      viewed: ''
      model: {}

    doNotUpdateModelTwice = false;
    
    scope.$watch 'bModel', (newVal, oldVal) ->
      isSameDate = scope.bModel is scope.date.viewed
      isEmptyModel = scope.bModel is '' or scope.bModel is ' ' or not scope.bModel
      return false if isSameDate or isEmptyModel

      bModelDate = bDateUtils.stringToDate scope.bModel, bDataFactory.data.format, bDataFactory.data.delimiter
      return false if not angular.isDate bModelDate

      scope.date.viewed = scope.bModel
      doNotUpdateModelTwice = true
      scope.date.model =
        day: bModelDate.getDate()
        month: bModelDate.getMonth() + 1
        year: bModelDate.getFullYear()

    scope.$watch 'date.model', ->
      return if angular.equals {}, scope.date.model
      if doNotUpdateModelTwice
        return doNotUpdateModelTwice = false

      dateTime = new Date(scope.date.model.year, scope.date.model.month - 1, scope.date.model.day).getTime()
      formattedDate = $filter('date') dateTime, bDataFactory.data.format
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