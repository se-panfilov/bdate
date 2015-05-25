angular.module 'bdate.utils', []

.factory 'bdateUtils', () ->
  daysOfWeek = [
    {name: 'Понедельник', short: 'Пн'}
    {name: 'Вторник', short: 'Вт'}
    {name: 'Среда', short: 'Ср'}
    {name: 'Четверг', short: 'Чт'}
    {name: 'Пятница', short: 'Пт'}
    {name: 'Суббота', short: 'Сб'}
    {name: 'Воскресенье', short: 'Вс'}
  ]

  return exports =
    daysOfWeek: daysOfWeek
    getDaysOfWeekShorts: ->
      i = 0
      result = []
      while i < daysOfWeek.length
        result.push daysOfWeek[i].short
        i++
      result