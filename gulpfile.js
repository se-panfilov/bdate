var gulp = require('gulp');
var jade = require('gulp-jade');
var watch = require('gulp-watch');
var connect = require('gulp-connect');
var minifyHTML = require('gulp-minify-html');

gulp.task('jade', function () {
    return gulp.src('./*.jade')
        .pipe(jade({pretty: false}))
        .on('error', console.log)
        .pipe(minifyHTML({
            empty: true,
            spare: true
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
    gulp.watch('./*.jade', ['jade']);
});

gulp.task('build', function () {
    gulp.start('jade');
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