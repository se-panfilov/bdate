var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var jade = require('gulp-jade');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var ngAnnotate = require('gulp-ng-annotate');
var stylus = require('gulp-stylus');
var nib = require('nib');
var connect = require('gulp-connect');
var minifyHTML = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var coffee = require('gulp-coffee');

var src = {
    styles: {
        demo: [
            'demo/*.styl',
            'demo/**/*.styl'
        ],
        src: [
            'src/styles/**/*.styl'
        ]
    },
    jade: {
        demo: [
            'demo/*.jade',
            'demo/**/*.jade'
        ],
        src: [
            'src/*.jade',
            'src/**/*.jade'
        ]
    }
    ,
    js: ['src/**/*.js'],
    coffee: ['src/**/*.coffee']
};

var dest = {
    dist: 'dist',
    src: 'src',
    demo: 'demo'
};

gulp.task('lint', function () {
    return gulp.src(src.js)
        .pipe(jshint({
            globalstrict: true,
            strict: false,
            globals: {
                angular: true
            }
        }))
        .pipe(jshint.reporter('jshint-stylish'));
});

//gulp.task('js', function () {
//    return gulp.src([src.js])
//        .pipe(changed(dest.dist))
//        .pipe(concat('bdate.js'))
//        .pipe(ngAnnotate({remove: true, add: true, single_quotes: true}))
//        .on('error', console.log)
//        .pipe(gulp.dest(dest.dist))
//        .pipe(sourcemaps.init())
//        .pipe(uglify())
//        .pipe(rename({basename: 'bdate.min'}))
//        .pipe(sourcemaps.write('.'))
//        .pipe(gulp.dest(dest.dist))
//        ;
//});

gulp.task('coffee', function () {
    gulp.src(src.coffee)
        .pipe(coffee({bare: true}))
        .on('error', console.log)
        .pipe(concat('bdate.js'))
        .pipe(ngAnnotate({remove: true, add: true, single_quotes: true}))
        .pipe(gulp.dest(dest.dist))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({basename: 'bdate.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dest.dist))
});

gulp.task('jade_demo', function () {
    return gulp.src(src.jade.demo)
        .pipe(changed(dest.demo, {extension: '.html'}))
        .pipe(jade({pretty: false}))
        .on('error', console.log)
        .pipe(minifyHTML({
            empty: true,
            spare: true
        }))
        .pipe(gulp.dest(dest.demo));
});

gulp.task('jade_src', function () {
    return gulp.src(src.jade.src)
        .pipe(changed(dest.dist, {extension: '.html'}))
        .pipe(jade({pretty: false}))
        .on('error', console.log)
        .pipe(minifyHTML({
            empty: true,
            spare: true
        }))
        .pipe(gulp.dest(dest.dist));
});

gulp.task('stylus_demo', function () {
    return gulp.src(src.styles.demo, {base: 'demo'})
        .pipe(concat('demo.styl'))
        .pipe(stylus({use: [nib()], compress: true}))
        .on('error', console.log)
        .pipe(minifyCss())
        .pipe(gulp.dest(dest.demo));
});

gulp.task('stylus_src', function () {
    return gulp.src(src.styles.src, {base: 'src'})
        .pipe(concat('bdate.styl'))
        .pipe(stylus({use: [nib()], compress: true}))
        .on('error', console.log)
        .pipe(minifyCss())
        .pipe(gulp.dest(dest.dist));
});

gulp.task('jade', function () {
    gulp.start('jade_demo');
    gulp.start('jade_src');
});

gulp.task('stylus', function () {
    gulp.start('stylus_demo');
    gulp.start('stylus_src');
});

gulp.task('watch', function () {
    gulp.watch(src.jade.demo, ['jade_demo']);
    gulp.watch(src.jade.src, ['jade_src']);

    gulp.watch(src.styles.demo, ['stylus_demo']);
    gulp.watch(src.styles.src, ['stylus_src']);

    gulp.watch(src.coffee, ['coffee']);
});

gulp.task('build', function () {
    gulp.start('coffee');
    gulp.start('jade');
    gulp.start('stylus');
});

gulp.task('webserver', function () {
    connect.server({
        root: [__dirname],
        port: 8001,
        livereload: true
    });
});

gulp.task('default', function () {
    gulp.start('build');
    gulp.start('watch');
});