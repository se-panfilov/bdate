angular.module 'bdate.data', []

.factory 'bDataFactory', (MESSAGES) ->

  return exports =
    data: {}
    isDataReady: (storeId)->
      return console.error MESSAGES.invalidParams if not storeId

      !!exports.data[storeId] and exports.isDataValid exports.data[storeId]
    isDataValid: (data) ->
      return false if not data or (angular.equals {}, data)
      return false if not data.format
      return false if not data.delimiter
      return false if not data.today
      return false if not data.years
      return false if not Object.keys(data.years)[0]
      return false if not Object.keys(Object.keys(data.years)[0])[0]
      return true
    setData: (source, storeId) ->
      if not exports.isDataValid source
        console.error MESSAGES.sourceDataNotValid
        return false

      exports.data[storeId] = JSON.parse(JSON.stringify(source));
      exports.data[storeId].today.date = (exports.data[storeId].today.date * 1000) #convert secs to ms
      exports.data[storeId]