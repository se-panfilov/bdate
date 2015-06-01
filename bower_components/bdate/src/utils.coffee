angular.module 'bdate.utils', ['bdate.data']

.factory 'bDateUtils', (MESSAGES, bDataFactory) ->
  daysOfWeekList = [
    {name: 'Понедельник', short: 'Пн'}
    {name: 'Вторник', short: 'Вт'}
    {name: 'Среда', short: 'Ср'}
    {name: 'Четверг', short: 'Чт'}
    {name: 'Пятница', short: 'Пт'}
    {name: 'Суббота', short: 'Сб'}
    {name: 'Воскресенье', short: 'Вс'}
  ]

  monthObj =
    1: {name: 'Январь', short: 'Янв'}
    2: {name: 'Февраль', short: 'Фев'}
    3: {name: 'Март', short: 'Март'}
    4: {name: 'Апрель', short: 'Май'}
    5: {name: 'Май', short: 'Май'}
    6: {name: 'Июнь', short: 'Июнь'}
    7: {name: 'Июль', short: 'Июль'}
    8: {name: 'Август', short: 'Авг'}
    9: {name: 'Сентябрь', short: 'Сент'}
    10: {name: 'Октябрь', short: 'Окт'}
    11: {name: 'Ноябрь', short: 'Ноя'}
    12: {name: 'Декабрь', short: 'Дек'}

  return exports =
    daysOfWeek: daysOfWeekList
    month: monthObj
    getDaysOfWeekShorts: ->
      i = 0
      result = []
      while i < daysOfWeekList.length
        result.push daysOfWeekList[i].short
        i++
      return result
    getMonthName: (number)->
      return exports.month[number].name
    makeDateModel: (datetime) ->
#TODO fix select today
      date = new Date(datetime)
      day = date.getDate()
      #TODO It's not clear what use to - .getDate() or .getUtcDate()?
      #day = date.getUTCDate()
      month = date.getMonth() + 1
      year = date.getFullYear()
      return {day: day, month: month, year: year}
    stringToDate: (dateStr, format, delimiter) ->
      formatLowerCase = format.toLowerCase()
      formatItems = formatLowerCase.split delimiter
      dateItems = dateStr.split delimiter
      monthIndex = formatItems.indexOf 'mm'
      dayIndex = formatItems.indexOf 'dd'
      yearIndex = formatItems.indexOf 'yyyy'

      year = +dateItems[yearIndex]
      month = +dateItems[monthIndex] - 1
      day = +dateItems[dayIndex]

      return false if month > 12
      return false if day > 31

      return new Date year, month, day
    isValidDate: (date)->
      if not angular.isDate
        date = new Date date

      return false if isNaN date.getTime()
    sourceCheckers:
      month:
        isMonthExist: (yearNum, monthNum) ->
          return console.error MESSAGES.invalidParams if not yearNum or not monthNum
          yearNum = +yearNum
          monthNum = +monthNum
          return false if not bDataFactory.isDataReady()
          return false if not bDataFactory.data.years[yearNum]
          !!bDataFactory.data.years[yearNum][monthNum]
        isPrevMonthExist: (yearNum, curMonthNum) ->
          return false if not yearNum or not curMonthNum
          #          return console.error MESSAGES.invalidParams if not yearNum or not curMonthNum
          yearNum = +yearNum
          curMonthNum = +curMonthNum

          return false if not exports.sourceCheckers.month.isMonthExist yearNum, curMonthNum
          isFirstMonth = exports.sourceCheckers.month.isFirstMonth yearNum, curMonthNum
          if not isFirstMonth
            prevMonthNum = curMonthNum - 1
            return exports.sourceCheckers.month.isMonthExist yearNum, prevMonthNum
          else
            isFirstYear = exports.sourceCheckers.year.isFirstYear yearNum
            if not isFirstYear
              prevYearNum = yearNum - 1
              lastMonthOfPrevYearNum = exports.sourceCheckers.month.getLastMonth prevYearNum
              return exports.sourceCheckers.month.isMonthExist prevYearNum, lastMonthOfPrevYearNum
            else
              return false
        getPrevMonthObj: (yearNum, curMonthNum) ->
          return console.error MESSAGES.invalidParams if not yearNum or not curMonthNum
          yearNum = +yearNum
          curMonthNum = +curMonthNum

          isFirstMonth = exports.sourceCheckers.month.isFirstMonth yearNum, curMonthNum
          if not isFirstMonth
            prevMonthNum = curMonthNum - 1
            if exports.sourceCheckers.month.isMonthExist yearNum, prevMonthNum
              return {year: yearNum, month: prevMonthNum}
            else
              return null
          else
            isFirstYear = exports.sourceCheckers.year.isFirstYear yearNum
            if not isFirstYear
              prevYearNum = yearNum - 1
              lastMonthOfPrevYearNum = exports.sourceCheckers.month.getLastMonth prevYearNum
              if exports.sourceCheckers.month.isMonthExist prevYearNum, lastMonthOfPrevYearNum
                return {year: prevYearNum, month: lastMonthOfPrevYearNum}
              else
                return null
            else
              return null
        isNextMonthExist: (yearNum, curMonthNum) ->
          return false if not yearNum or not curMonthNum
          #          return console.error MESSAGES.invalidParams if not yearNum or not curMonthNum
          yearNum = +yearNum
          curMonthNum = +curMonthNum

          return false if not exports.sourceCheckers.month.isMonthExist yearNum, curMonthNum
          isLastMonth = exports.sourceCheckers.month.isLastMonth yearNum, curMonthNum
          if not isLastMonth
            nextMonthNum = curMonthNum + 1
            return exports.sourceCheckers.month.isMonthExist yearNum, nextMonthNum
          else
            isLastYear = exports.sourceCheckers.year.isLastYear yearNum
            if not isLastYear
              nextYearNum = yearNum + 1
              firstMonthOfNextYearNum = exports.sourceCheckers.month.getFirstMonth nextYearNum
              return exports.sourceCheckers.month.isMonthExist nextYearNum, firstMonthOfNextYearNum
            else
              return false
        getNextMonthObj: (yearNum, curMonthNum) ->
          return console.error MESSAGES.invalidParams if not yearNum or not curMonthNum
          yearNum = +yearNum
          curMonthNum = +curMonthNum

          isLastMonth = exports.sourceCheckers.month.isLastMonth yearNum, curMonthNum
          if not isLastMonth
            nextMonthNum = curMonthNum + 1
            if exports.sourceCheckers.month.isMonthExist yearNum, nextMonthNum
              return {year: yearNum, month: nextMonthNum}
            else
              return null
          else
            isLastYear = exports.sourceCheckers.year.isLastYear yearNum
            if not isLastYear
              nextYearNum = yearNum + 1
              firstMonthOfNextYearNum = exports.sourceCheckers.month.getFirstMonth nextYearNum
              if exports.sourceCheckers.month.isMonthExist nextYearNum, firstMonthOfNextYearNum
                return {year: nextYearNum, month: firstMonthOfNextYearNum}
              else
                return null
            else
              return null
        getMonth: (yearNum, monthNum) ->
          return console.error MESSAGES.invalidParams if not yearNum or not monthNum
          return console.error MESSAGES.dateNotReady if not bDataFactory.isDataReady()
          bDataFactory.data.years[yearNum][monthNum]
        isFirstMonth: (yearNum, monthNum) ->
          return console.error MESSAGES.dateNotReady if not bDataFactory.isDataReady()
          yearNum = +yearNum
          monthNum = +monthNum
          monthNum is +Object.keys(bDataFactory.data.years[yearNum])[0]
        getFirstMonth: (yearNum) ->
          return console.error MESSAGES.dateNotReady if not bDataFactory.isDataReady()
          yearNum = +yearNum
          +Object.keys(bDataFactory.data.years[yearNum])[0]
        isLastMonth: (yearNum, monthNum) ->
          return console.error MESSAGES.dateNotReady if not bDataFactory.isDataReady()
          yearNum = +yearNum
          monthNum = +monthNum
          monthNum is +Object.keys(bDataFactory.data.years[yearNum])[Object.keys(bDataFactory.data.years[yearNum]).length - 1]
        getLastMonth: (yearNum) ->
          return console.error MESSAGES.dateNotReady if not bDataFactory.isDataReady()
          yearNum = +yearNum
          +Object.keys(bDataFactory.data.years[yearNum])[Object.keys(bDataFactory.data.years[yearNum]).length - 1]
        getNextAvailableMonth: (isForward, yearNum, monthNum) ->
          yearNum = +yearNum
          monthNum = +monthNum
          isFirstMonth = exports.sourceCheckers.month.isFirstMonth yearNum, monthNum
          isLastMonth = exports.sourceCheckers.month.isLastMonth yearNum, monthNum
          nextYearNum = yearNum
          nextMonthNum = monthNum

          if isForward
            if not isLastMonth
              nextMonthNum = monthNum + 1
            else
              nextYearNum = yearNum + 1
              if exports.sourceCheckers.year.isYearExist nextYearNum
                nextMonthNum = exports.sourceCheckers.month.getFirstMonth nextYearNum
              else
                console.error MESSAGES.errorOnChangeMonthOrYear
                return false
          else if not isForward
            if not isFirstMonth
              nextMonthNum = monthNum - 1
            else
              nextYearNum = yearNum - 1
              if exports.sourceCheckers.year.isYearExist nextYearNum
                nextMonthNum = exports.sourceCheckers.month.getLastMonth nextYearNum
              else
                console.error MESSAGES.errorOnChangeMonthOrYear
                return false

          result =
            year: nextYearNum
            month: nextMonthNum
      year:
        isYearExist: (yearNum) ->
          return console.error MESSAGES.invalidParams if not yearNum
          return false if not bDataFactory.isDataReady()
          yearNum = +yearNum
          !!bDataFactory.data.years[yearNum]
        getYear: (yearNum) ->
          return console.error MESSAGES.invalidParams if not yearNum
          return console.error MESSAGES.dateNotReady if not bDataFactory.isDataReady()
          bDataFactory.data.years[yearNum]
        isFirstYear: (yearNum) ->
          yearNum = +yearNum
          yearNum is +Object.keys(bDataFactory.data.years)[0]
        getFirstYear: ->
          return console.error MESSAGES.dateNotReady if not bDataFactory.isDataReady()
          +Object.keys(bDataFactory.data.years)[0]
        isLastYear: (yearNum) ->
          return console.error MESSAGES.dateNotReady if not bDataFactory.isDataReady()
          yearNum = +yearNum
          yearNum is +Object.keys(bDataFactory.data.years)[Object.keys(bDataFactory.data.years).length - 1]
        getLastYear: ->
          return console.error MESSAGES.dateNotReady if not bDataFactory.isDataReady()
          +Object.keys(bDataFactory.data.years)[Object.keys(bDataFactory.data.years).length - 1]
        getNextAvailableYear: (isForward, yearNum, monthNum) ->
          yearNum = +yearNum
          monthNum = +monthNum
          isFirstYear = exports.sourceCheckers.year.isFirstYear yearNum
          isLastYear = exports.sourceCheckers.year.isLastYear yearNum
          nextYearNum = yearNum
          nextMonthNum = monthNum

          if isForward
            if not isLastYear
              nextYearNum = yearNum + 1
              if exports.sourceCheckers.month.isMonthExist nextYearNum, monthNum
                nextMonthNum = monthNum
              else
                nextMonthNum = exports.sourceCheckers.month.getFirstMonth nextYearNum
            else
              return false
          else if not isForward
            if not isFirstYear
              nextYearNum = yearNum - 1
              if exports.sourceCheckers.month.isMonthExist nextYearNum, monthNum
                nextMonthNum = monthNum
              else
                nextMonthNum = exports.sourceCheckers.month.getFirstMonth nextYearNum
            else
              return false

          result =
            year: nextYearNum
            month: nextMonthNum