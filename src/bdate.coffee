angular.module 'bdate', [
  'bdate.popup'
  'bdate.templates'
]

.directive 'bdatepicker', ($filter, $document, $interval) ->
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
    bRefresh: "&"
  controller: ($scope) ->

    $scope.state =
      isDataReady: false

    $scope.data =
      date: null

    $scope.$watch 'bSource', ->
        setData()
        $scope.isDataReady = true
    , true

    setData = () ->


  link: (scope, elem) ->
    scope.date =
      viewed: ''
      model: {}

    do () ->
      scope.bRefresh()

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