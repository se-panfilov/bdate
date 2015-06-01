angular.module 'bdate', ['bdate.datepicker']

.constant 'MESSAGES',
  invalidParams: 'Invalid params'
  errorOnChangeMonthOrYear: 'cannot change month or year'
  sourceDataNotValid: 'source data(json)is not valid'
  dateNotReady: 'source data(json)is not ready(null?)'
