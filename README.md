[![Bower version](https://badge.fury.io/bo/bdate.svg)](http://badge.fury.io/bo/bdate)
[![npm version](https://badge.fury.io/js/bdate.svg)](http://badge.fury.io/js/bdate)
[![dependency Status](https://david-dm.org/Light241/bdate/status.svg?branch=master)](https://david-dm.org/Light241/bdate#info=Dependencies)
[![devDependency Status](https://david-dm.org/Light241/bdate/dev-status.svg?branch=master)](https://david-dm.org/Light241/bdate#info=devDependencies)
[![Hex.pm](https://img.shields.io/hexpm/l/plug.svg)](https://github.com/Light241/bdate/blob/master/LICENSE)

bDate
=============
| [Demo][1] | 

Backend-driven Angularjs datepicker
-------------

```html
<div>
  <label for="bdatepicker">Date</label>
  <bdatepicker b-input-id="bdatepicker" b-model="resultModel" b-source="demoData"></bdatepicker>
</div>
```

**Required**:

`b-model` - Object where selected date will be store (also may be used as init value)

`b-source` - Object (json) where we take available date ranges

**Optional**:

`b-input-id` - Provides id for directive's input element

`b-root-id` - Provides id for directive's root element

`b-popup-id` - Provides id for directive's popup element

**Expected json format**:

```json

{
    "format": "dd-MM-yyyy",
    "delimiter": "-",
    "today": {
        "date": 1432537266825,
        "year": 2015,
        "month": 5,
        "day": 25,
        "day_of_week": 1
    },
    "years": {
        "2015": {
            "2": {
                "days_total": 28,
                "start_day": 7
            } 
        }
    }
}
```


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/Light241/bdate/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

[1]: http://light241.github.io/bdate/
