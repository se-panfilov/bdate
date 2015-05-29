angular.module 'bdate.data', []

.factory 'bDataFactory', (MESSAGES) ->

  return exports =
    data: null
    isDataReady: ->
      !!exports.data and exports.isDataValid exports.data
    isDataValid: (data) ->
      return false if not data.format
      return false if not data.today
      return false if not data.years
      return false if not Object.keys(data.years)[0]
      return false if not Object.keys(Object.keys(data.years)[0])[0]
      return true
    setData: (source) ->
      if not exports.isDataValid source
        console.error MESSAGES.sourceDataNotValid
        return false

      exports.data = source