angular.module 'bdate.data', []

.factory 'bDataFactory', (MESSAGES) ->

  return exports =
    data: {}
    daysNames: [
      {name: 'Monday', short: 'Mon'}
      {name: 'Tuesday', short: 'Tue'}
      {name: 'Wednesday', short: 'Wed'}
      {name: 'Thursday', short: 'Th'}
      {name: 'Friday', short: 'Fri'}
      {name: 'Saturday', short: 'Sat'}
      {name: 'Sunday', short: 'Sun'}
    ]
    setDaysNames: (daysNamesArr) ->
      if not exports.isDaysNamesValid daysNamesArr
        console.error MESSAGES.daysNameNotValid
        return false
      exports.daysNames = daysNamesArr
    isDaysNamesValid: (daysNamesArr) ->
      return false if not angular.isArray(daysNamesArr) and angular.isObject(daysNamesArr)
      return false if daysNamesArr.length isnt 7
      return false if not daysNamesArr[0].name
      return false if not daysNamesArr[0].short
      return true
    monthNames:
      1: {name: 'January', short: 'Jan'}
      2: {name: 'February', short: 'Feb'}
      3: {name: 'March', short: 'Mar'}
      4: {name: 'April', short: 'Apr'}
      5: {name: 'May', short: 'May'}
      6: {name: 'June', short: 'Jun'}
      7: {name: 'July', short: 'July'}
      8: {name: 'August', short: 'Aug'}
      9: {name: 'September', short: 'Sep'}
      10: {name: 'October', short: 'Oct'}
      11: {name: 'November', short: 'Nov'}
      12: {name: 'December', short: 'Dec'}
    setMonthNames: (monthNamesObj)->
      if not exports.isDaysNamesValid monthNamesObj
        console.error MESSAGES.monthNameNotValid
        return false
      exports.monthNames = monthNamesObj
    isMonthNamesValid: (monthNamesObj) ->
      return false if angular.isArray(monthNamesObj) and not angular.isObject(monthNamesObj)
      return false if monthNamesObj.length isnt 12
      return false if not monthNamesObj[0].name
      return false if not monthNamesObj[0].short
      return true
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

      exports.data[storeId] = JSON.parse(JSON.stringify(source))
      exports.data[storeId].today.date = (exports.data[storeId].today.date * 1000) #convert secs to ms
      exports.data[storeId]