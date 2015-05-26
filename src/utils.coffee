angular.module 'bdate.utils', []

.factory 'bdateUtils', () ->
  daysOfWeek = [
    {name: 'Понедельник' short: 'Пн'}
    {name: 'Вторник' short: 'Вт'}
    {name: 'Среда' short: 'Ср'}
    {name: 'Четверг' short: 'Чт'}
    {name: 'Пятница' short: 'Пт'}
    {name: 'Суббота' short: 'Сб'}
    {name: 'Воскресенье' short: 'Вс'}
  ]

  month = [
    {name: 'Январь' short: 'Янв'}
    {name: 'Февраль' short: 'Фев'}
    {name: 'Март' short: 'Март'}
    {name: 'Апрель' short: 'Май'}
    {name: 'Май' short: 'Май'}
    {name: 'Июнь' short: 'Июнь'}
    {name: 'Июль' short: 'Июль'}
    {name: 'Август' short: 'Авг'}
    {name: 'Сентябрь' short: 'Сент'}
    {name: 'Октябрь' short: 'Окт'}
    {name: 'Ноябрь' short: 'Ноя'}
    {name: 'Декабрь' short: 'Дек'}
  ]

  return exports =
    daysOfWeek: daysOfWeek
    month: month
    getDaysOfWeekShorts: ->
      i = 0
      result = []
      while i < daysOfWeek.length
        result.push daysOfWeek[i].short
        i++
      return result
    getMonthName: (number)->
      return month[number].name