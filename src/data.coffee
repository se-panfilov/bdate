angular.module 'bdate.data', []

.factory 'bDataFactory', () ->

  return exports =
    data: null
    isDataReady: ->
      !!exports.data
    setData: (source) ->
      exports.data = source