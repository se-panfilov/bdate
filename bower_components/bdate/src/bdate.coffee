angular.module 'bdate.datepicker', ['bdate.popup', 'bdate.data', 'bdate.templates']

.directive 'bdatepicker', ($filter, bDataFactory, $document) ->
  restrict: 'E'
  replace: true
  templateUrl: 'bdate.html'
  scope:
    bModel: '='
    bSource: '='
    bRootId: '@?'
    bInputId: '@?'
    bPopupId: '@?'
  controller: ($scope) ->

    $scope.isDataReady = false

    $scope.$watch 'bSource', ->
      if bDataFactory.isDataValid $scope.bSource
        bDataFactory.setData $scope.bSource
        $scope.isDataReady = true
    , true

  link: (scope, elem) ->
    scope.date =
      viewed: ''
      model: {}

    scope.$watch 'date.model', ->
      return if angular.equals {}, scope.date.model
      dateTime = new Date(scope.date.model.year, scope.date.model.month - 1, scope.date.model.day).getTime()
      formattedDate = $filter('date')(dateTime, bDataFactory.data.format)
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