var extract = require('jsxgettext-recursive');

var walker_ru = extract({
    'input-dir': './../dist/',
    'output-dir': '.',
    output: 'calendar_ru.po',
    'join-existing': true,
    parsers: {
        '.js': 'javascript'
    }
});

walker_ru.on('end', function () {
    console.log('ru done!');
});

var walker_en = extract({
    'input-dir': './../dist/',
    'output-dir': '.',
    output: 'calendar_en.po',
    'join-existing': true,
    parsers: {
        '.js': 'javascript'
    }
});

walker_en.on('end', function () {
    console.log('en done!');
});