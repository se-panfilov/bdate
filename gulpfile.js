var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var jade = require('gulp-jade');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var changed = require('gulp-changed');
var ngAnnotate = require('gulp-ng-annotate');
var stylus = require('gulp-stylus');
var nib = require('nib');
var minifyHTML = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var coffee = require('gulp-coffee');
var templateCache = require('gulp-angular-templatecache');

var src = {
    styles: ['src/styles/**/*.styl'],
    jade: ['src/templates/**/*.jade'],
    html: ['src/templates/**/*.html'],
    js: ['src/**/*.js'],
    coffee: ['src/**/*.coffee']
};

var dest = {
    dist: 'dist',
    src: 'src',
    templates: 'src/templates'
};


gulp.task('coffee', function () {
    gulp.src(src.coffee)
        .pipe(coffee({bare: true}))
        .on('error', console.log)
        .pipe(concat('bdate.js'))
        .pipe(ngAnnotate({remove: true, add: true, single_quotes: true}))
        //.pipe(templateReplace())
        .pipe(gulp.dest(dest.dist))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({basename: 'bdate.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dest.dist))
});

gulp.task('tmp', function(){
    //return gulp.src(src.html)
    return gulp.src('src/templates/**/*.html')
        .pipe(templateCache({
            module: 'bdate.templates',
            standalone: true
        }))
        .pipe(gulp.dest(dest.dist));

});

gulp.task('jade', function () {
    return gulp.src(src.jade)
        .pipe(changed(dest.templates, {extension: '.html'}))
        .pipe(jade({pretty: false}))
        .on('error', console.log)
        .pipe(minifyHTML({
            empty: true,
            spare: true
        }))
        .pipe(gulp.dest(dest.templates));
});

gulp.task('stylus', function () {
    return gulp.src(src.styles, {base: 'src'})
        .pipe(concat('bdate.styl'))
        .pipe(stylus({use: [nib()], compress: true}))
        .on('error', console.log)
        .pipe(minifyCss())
        .pipe(gulp.dest(dest.dist));
});

gulp.task('watch', function () {
    gulp.watch(src.jade, ['jade']);
    gulp.watch(src.styles, ['stylus']);
    gulp.watch(src.coffee, ['coffee']);
});

gulp.task('build', function () {
    gulp.start('coffee');
    gulp.start('jade');
    gulp.start('stylus');
});

gulp.task('default', function () {
    gulp.start('build');
    gulp.start('watch');
});