angular.module 'bdate', [
  'bdate.popup'
  'bdate.templates'
]

.directive 'bdatepicker', ($document) ->
  restrict: 'E'
  #replace: true
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
    bRefresh: "&?"
  controller: ($scope) ->

    $scope.state =
      isDataReady: false

    $scope.data =
      date: null

    #$scope.$watch 'bSource', ->
        #setData()
        #$scope.isDataReady = true
    #, true

    $scope.$watch 'popupResult', (newVal, oldVal) ->
      return if newVal is oldVal
      return if not newVal
      return if angular.equals {}, newVal
      $scope.bModel = getModelString($scope.popupResult)
    , true

  link: (scope, elem) ->
    scope.date =
      viewed: ''
      model: {}

    processClick = (event) ->
      isOpen = scope.popup.state.isOpen
      clickedElem = event.target
      popupElem = elem
      isOutsideClick = (popupElem isnt clickedElem) and not (popupElem[0].contains clickedElem)
      if isOpen and isOutsideClick
        scope.$apply ->
          scope.popup.hidePopup()

    scope.popup =
      state:
        isOpen: false
      togglePopup: () ->
        return if not scope.isDataReady
        scope.popup.state.isOpen = not scope.popup.state.isOpen
      hidePopup: () ->
        scope.popup.state.isOpen = false

    do () ->
      scope.bRefresh()

    $document.on 'click', processClick