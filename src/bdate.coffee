angular.module 'bdate.datepicker', ['bdate.popup', 'bdate.data', 'bdate.templates']

.directive 'bdatepicker', ($filter, bDataFactory, $document, $interval) ->
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

#    source =
#      stopFetSourceInterval: (intId) ->
#        $interval.cancel intId
#        intId = null
#      getSourceDataInInterval: ->
#        minute = 60000
#
#        retry = 0
#        retriesStep = 100
#        retriesLimit = minute / 3
#
#        getSourceInt = $interval (->
#          console.log retry
#          if $scope.bSource
#            bDataFactory.setData $scope.bSource
#            source.stopFetSourceInterval getSourceInt
#
#          if retry >= retriesLimit
#            source.stopFetSourceInterval getSourceInt
#
#          retry += retriesStep
#        ), retriesStep
#    getSourceData: ->
#      if $scope.bSource
#        bDataFactory.setData $scope.bSource
#      else

    scope.$watch 'date.model', ->
      bDataFactory.setData $scope.bSource

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
        scope.popup.state.isOpen = not scope.popup.state.isOpen
      hidePopup: () ->
        scope.popup.state.isOpen = false