var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jade = require('gulp-jade');
var jshint = require('gulp-jshint');
var stylus = require('gulp-stylus');
var nib = require('nib');
var connect = require('gulp-connect');
var minifyCss = require('gulp-minify-css');

gulp.task('jade', function () {
    return gulp.src('./*.jade')
        .pipe(jade({pretty: true}))
        .on('error', console.log)
        .pipe(gulp.dest(dest.demo));
});

gulp.task('stylus', function () {
    return gulp.src('./styles/*.styl')
        .pipe(concat('index.styl'))
        .pipe(stylus({use: [nib()], compress: false}))
        .on('error', console.log)
        .pipe(minifyCss())
        .pipe(gulp.dest(dest.demo));
});

gulp.task('watch', function () {
    gulp.watch('./*.jade', ['jade']);
    gulp.watch('./styles/*.styl', ['stylus']);
});

gulp.task('build', function () {
    gulp.start('jade');
    gulp.start('stylus');
});

gulp.task('default', function () {
    gulp.start('build');
    gulp.start('watch');
});