[![Bower version](https://badge.fury.io/bo/bdate.svg)](http://badge.fury.io/bo/bdate)
[![npm version](https://badge.fury.io/js/bdate.svg)](http://badge.fury.io/js/bdate)
[![dependency Status](https://david-dm.org/se-panfilov/bdate/status.svg?branch=master)](https://david-dm.org/se-panfilov/bdate#info=Dependencies)
[![devDependency Status](https://david-dm.org/se-panfilov/bdate/dev-status.svg?branch=master)](https://david-dm.org/se-panfilov/bdate#info=devDependencies)
[![Hex.pm](https://img.shields.io/hexpm/l/plug.svg)](https://github.com/se-panfilov/bdate/blob/master/LICENSE)

bDate - Backend-driven Angularjs datepicker
=============
| [Demo][1] | 

#What is this?
This is angularjs datepicker (like [angular-ui datepicker][2]) but with one serious difference:
bDate Datepicker **didn't** count any date on client side, it **works only with provided (json) data**.

##But why?
There are many reasons. But mostly it's made for people who want to take a control for datepicker from the backend.

#Installation

* download

    with bower:
    
    ```shell
    bower install bdate --save
    ```
    
    or with npm:
    
    ```shell
    npm  install bdate --save
    ```
    
    or download directly (please use latest [release][3] version).

* add `.js` and `.css` files
    
    ```html
     <link href=bdate/dist/bdate.css rel=stylesheet media=all>
     <script src=bdate/dist/bdate.js type=text/javascript></script>
    ```
    (don't forget to include angular.js before)

* add dependency to project:
    
    ```js
    angular.module('app', [
        'bdate'
    ]);
    ```
* add directive to html:
    
    ```html
    <bdatepicker 
        b-model="resultModel" 
        b-source="demoData"
        b-settings="settings"
        b-refresh="refreshData(m, y)"
        placeholder="Enter the date"
        ></bdatepicker>
    ```
    
    `b-model`  - is the result of date selection;
    
    `b-source` - Data with dates (may come from backend);
    
    `b-settings` - Var with params (format, month and day names, etc);
    
    `b-refresh` - Function wich calls every time, when you should update source (for example go to next month in popup). Should define with two args -`m` for month and `y` for year;

#Features
- Date ranges aviable
- 20kb minified;
- No dependencies (only angularjs);
- No extra options (just pick a date);
- Easy to custom - you may provide custom id and class (in progress right now) for each element of each directive (if you have multiple ones);
- Able to set date model externally;

#Date Raanges

```html
<bdatepicker 
    b-model="resultModel" 
    b-start-source="startSource"
    b-end-source="endSource"
    b-settings="settings"
    b-start-refresh="refreshStartData(m, y)"
    b-end-refresh="refreshEndData(m, y)"
    b-range="true"
    placeholder="Enter the date"
```

`b-range` - define ranges mode
`b-start-source` and `b-end-source` work as `b-source` (and insteado of them). Each work for start range and end range popups.;
`b-start-refresh` and `b-end-refresh` - all the same as `b-refresh` function, but wotks separately for start and end popup;
    
    
#Settings format

```json
{
    "week": ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    "today": {
        "day": 3,
        "month": 1,
        "year": 2010
    },
    "format": "dd-MM-yyyy",
    "range_delimiter": "--"
}
```


#Data format
```json

{
      "id": "1-2010",
      "years": [
        2015,
        2014,
        2013,
        2012,
        2011,
        2010
      ],
      "month": {
        "num": 1,
        "name": "Январь",
        "isStart": true,
        "isEnd": false
      },
      "year": {
        "num": 2010,
        "isStart": true,
        "isEnd": false
      },
      "dates": [
        {
          "day": 28,
          "month": 12,
          "year": 2009,
          "isDisabled": true
        },
        {
          "day": 29,
          "month": 12,
          "year": 2009,
          "isDisabled": true
        },
        {
          "day": 30,
          "month": 12,
          "year": 2009,
          "isDisabled": true
        },
        {
          "day": 31,
          "month": 12,
          "year": 2009,
          "isDisabled": true
        },
        {
          "day": 1,
          "month": 1,
          "year": 2010
        },
        {
          "day": 2,
          "month": 1,
          "year": 2010
        },
        {
          "day": 3,
          "month": 1,
          "year": 2010,
          "isToday": true
        },
        {
          "day": 4,
          "month": 1,
          "year": 2010
        },
        {
          "day": 5,
          "month": 1,
          "year": 2010
        },
        {
          "day": 6,
          "month": 1,
          "year": 2010
        },
        {
          "day": 7,
          "month": 1,
          "year": 2010
        },
        {
          "day": 8,
          "month": 1,
          "year": 2010
        },
        {
          "day": 9,
          "month": 1,
          "year": 2010
        },
        {
          "day": 10,
          "month": 1,
          "year": 2010
        },
        {
          "day": 11,
          "month": 1,
          "year": 2010
        },
        {
          "day": 12,
          "month": 1,
          "year": 2010
        },
        {
          "day": 13,
          "month": 1,
          "year": 2010
        },
        {
          "day": 14,
          "month": 1,
          "year": 2010
        },
        {
          "day": 15,
          "month": 1,
          "year": 2010
        },
        {
          "day": 16,
          "month": 1,
          "year": 2010
        },
        {
          "day": 17,
          "month": 1,
          "year": 2010
        },
        {
          "day": 18,
          "month": 1,
          "year": 2010
        },
        {
          "day": 19,
          "month": 1,
          "year": 2010
        },
        {
          "day": 20,
          "month": 1,
          "year": 2010
        },
        {
          "day": 21,
          "month": 1,
          "year": 2010
        },
        {
          "day": 22,
          "month": 1,
          "year": 2010
        },
        {
          "day": 23,
          "month": 1,
          "year": 2010
        },
        {
          "day": 24,
          "month": 1,
          "year": 2010
        },
        {
          "day": 25,
          "month": 1,
          "year": 2010
        },
        {
          "day": 26,
          "month": 1,
          "year": 2010
        },
        {
          "day": 27,
          "month": 1,
          "year": 2010
        },
        {
          "day": 28,
          "month": 1,
          "year": 2010
        },
        {
          "day": 29,
          "month": 1,
          "year": 2010
        },
        {
          "day": 30,
          "month": 1,
          "year": 2010
        },
        {
          "day": 31,
          "month": 1,
          "year": 2010
        },
        {
          "day": 1,
          "month": 2,
          "year": 2010
        },
        {
          "day": 2,
          "month": 2,
          "year": 2010
        },
        {
          "day": 3,
          "month": 2,
          "year": 2010
        },
        {
          "day": 4,
          "month": 2,
          "year": 2010
        },
        {
          "day": 5,
          "month": 2,
          "year": 2010
        },
        {
          "day": 6,
          "month": 2,
          "year": 2010
        },
        {
          "day": 7,
          "month": 2,
          "year": 2010
        }
      ]
    }
```

#Developing

Global dependencies:

 - [Node.js][4] with [npm][5] 
 - [gulp][6] ( `npm install --global gulp` )

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/se-panfilov/bdate/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

[1]: https://se-panfilov.github.io/bdate/
[2]: https://angular-ui.github.io/bootstrap/#/datepicker
[3]: https://github.com/se-panfilov/bdate/releases
[4]: https://nodejs.org/
[5]: https://www.npmjs.com/
[6]: http://gulpjs.com/
